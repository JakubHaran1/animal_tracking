from rest_framework import serializers

from api.models import FriendRequest, User


class FriendSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "avatar"]


class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = FriendSummarySerializer(read_only=True)
    to_user = FriendSummarySerializer(read_only=True)
    to_user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source="to_user", write_only=True
    )
    status = serializers.ChoiceField(
        choices=FriendRequest.Status.choices, required=False
    )

    class Meta:
        model = FriendRequest
        fields = [
            "id",
            "from_user",
            "to_user",
            "to_user_id",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]
