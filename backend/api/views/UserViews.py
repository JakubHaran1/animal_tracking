from django.contrib.auth import authenticate
from rest_framework.decorators import action
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied, ValidationError
from rest_framework.filters import SearchFilter
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.viewsets import ModelViewSet

from api.models import User
from api.serializers.ObservationSerializers import (
    ChangePasswordSerializer,
    UserCreateSerializer,
    UserSerializer,
    UserUpdateSerializer,
)
from api.services import send_verification_email, verify_email_token


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [SearchFilter]
    search_fields = ["username", "email"]

    def get_serializer_class(self):
        if self.action == "me" and self.request.method == "PATCH":
            return UserUpdateSerializer
        if self.action == "verify_email":
            return UserSerializer
        if self.request.method == "POST":
            return UserCreateSerializer
        if self.request.method in ["PUT", "PATCH"]:
            return UserUpdateSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action in ["create", "login", "verify_email"]:
            return [AllowAny()]
        if self.action in ["list", "retrieve", "me"]:
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        send_result = None
        try:
            send_result = send_verification_email(user)
        except Exception:
            # In case some unexpected error occurs, avoid breaking registration.
            send_result = {"sent": False}

        response_payload = {
            "detail": "Konto utworzone. Sprawdź maila i potwierdź adres e-mail.",
            "user": UserSerializer(user).data,
            "email_sent": bool(send_result and send_result.get("sent")),
        }

        # In debug mode or when sending failed, include the verification URL to ease development.
        from django.conf import settings as _settings

        if send_result and not send_result.get("sent") and _settings.DEBUG:
            response_payload["verification_url"] = send_result.get("verification_url")

        return Response(response_payload, status=201)

    def update(self, request, *args, **kwargs):
        if str(self.get_object().id) != str(request.user.id):
            raise PermissionDenied("Nie możesz edytować innego użytkownika.")
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if str(self.get_object().id) != str(request.user.id):
            raise PermissionDenied("Nie możesz edytować innego użytkownika.")
        return super().partial_update(request, *args, **kwargs)

    @action(methods=["POST"], detail=False)
    def login(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if user is None:
            raise AuthenticationFailed("Niepoprawny login lub hasło.")

        if not user.is_verified:
            raise AuthenticationFailed("Konto nie zostało jeszcze zweryfikowane. Sprawdź email.")

        token = RefreshToken.for_user(user)
        return Response(
            {
                "tokens": {
                    "refresh": str(token),
                    "access": str(token.access_token),
                },
                "user": UserSerializer(user).data,
            }
        )

    @action(methods=["POST"], detail=False, url_path="verify-email")
    def verify_email(self, request):
        token = request.data.get("token")
        if not token:
            raise ValidationError({"token": "Token jest wymagany."})

        user = verify_email_token(token)
        if not user.is_verified:
            user.is_verified = True
            user.save(update_fields=["is_verified"])

        return Response({"detail": "Email został zweryfikowany."})

    @action(methods=["GET", "PATCH"], detail=False, permission_classes=[IsAuthenticated])
    def me(self, request):
        if request.method == "PATCH":
            serializer = UserUpdateSerializer(
                request.user, data=request.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()

        return Response(UserSerializer(request.user,context={"request":request}).data)
     

    @action(
        methods=["POST"],
        detail=False,
        permission_classes=[IsAuthenticated],
        url_path="change-password",
    )
    def change_password(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request, "user": request.user},
        )
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save(update_fields=["password"])
        return Response({"detail": "Hasło zostało zmienione."})
