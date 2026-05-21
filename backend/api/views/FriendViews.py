from django.db.models import Q
from rest_framework import status
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet

from api.models import FriendRequest, Friendship, User
from api.serializers.FriendSerializers import (
    FriendRequestSerializer,
    FriendSummarySerializer,
)


def _normalize_friendship_users(user_a: User, user_b: User) -> tuple[User, User]:
    if str(user_a.id) < str(user_b.id):
        return user_a, user_b
    return user_b, user_a


def _friendship_exists(user_a: User, user_b: User) -> bool:
    user_low, user_high = _normalize_friendship_users(user_a, user_b)
    return Friendship.objects.filter(user_low=user_low, user_high=user_high).exists()


def _create_friendship(user_a: User, user_b: User) -> Friendship:
    user_low, user_high = _normalize_friendship_users(user_a, user_b)
    friendship, _ = Friendship.objects.get_or_create(
        user_low=user_low, user_high=user_high
    )
    return friendship


def _delete_friendship(user_a: User, user_b: User) -> None:
    user_low, user_high = _normalize_friendship_users(user_a, user_b)
    Friendship.objects.filter(user_low=user_low, user_high=user_high).delete()


def _get_friend_ids(user: User) -> list[str]:
    friendships = Friendship.objects.filter(Q(user_low=user) | Q(user_high=user))
    friend_ids: list[str] = []
    for friendship in friendships:
        if friendship.user_low_id == user.id:
            friend_ids.append(str(friendship.user_high_id))
        else:
            friend_ids.append(str(friendship.user_low_id))
    return friend_ids


class FriendViewSet(ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        friend_ids = _get_friend_ids(request.user)
        friends = User.objects.filter(id__in=friend_ids).order_by("username")
        serializer = FriendSummarySerializer(friends, many=True)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        if not pk:
            raise ValidationError({"friend_id": "Friend id is required."})

        try:
            friend = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        _delete_friendship(request.user, friend)
        return Response(status=status.HTTP_204_NO_CONTENT)


class FriendRequestViewSet(ModelViewSet):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return FriendRequest.objects.filter(
            Q(from_user=user) | Q(to_user=user)
        ).order_by("-created_at")

    def perform_create(self, serializer):
        from_user = self.request.user
        to_user = serializer.validated_data.get("to_user")

        if from_user == to_user:
            raise ValidationError({"to_user_id": "Cannot add yourself as a friend."})

        if _friendship_exists(from_user, to_user):
            raise ValidationError({"to_user_id": "Friendship already exists."})

        pending_exists = FriendRequest.objects.filter(
            Q(from_user=from_user, to_user=to_user, status=FriendRequest.Status.PENDING)
            | Q(from_user=to_user, to_user=from_user, status=FriendRequest.Status.PENDING)
        ).exists()
        if pending_exists:
            raise ValidationError({"to_user_id": "Friend request already pending."})

        serializer.save(from_user=from_user, status=FriendRequest.Status.PENDING)

    def partial_update(self, request, *args, **kwargs):
        instance: FriendRequest = self.get_object()
        next_status = request.data.get("status")

        if not next_status:
            raise ValidationError({"status": "Status is required."})

        if instance.status != FriendRequest.Status.PENDING:
            raise ValidationError({"status": "Only pending requests can be updated."})

        if next_status == FriendRequest.Status.ACCEPTED:
            if request.user != instance.to_user:
                raise PermissionDenied("Only the recipient can accept a request.")
            _create_friendship(instance.from_user, instance.to_user)
        elif next_status == FriendRequest.Status.DECLINED:
            if request.user != instance.to_user:
                raise PermissionDenied("Only the recipient can decline a request.")
        elif next_status == FriendRequest.Status.CANCELED:
            if request.user != instance.from_user:
                raise PermissionDenied("Only the sender can cancel a request.")
        else:
            raise ValidationError({"status": "Invalid status value."})

        serializer = self.get_serializer(
            instance, data={"status": next_status}, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(status=next_status)

        return Response(serializer.data)
