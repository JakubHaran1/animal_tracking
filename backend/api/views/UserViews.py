from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from api.models import User
from api.serializers.ObservationSerializers import (
    UserCreateSerializer,
    UserSerializer,
    UserUpdateSerializer,
)
from rest_framework.filters import SearchFilter

from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [SearchFilter]
    search_fields = ["username", "email"]

    def get_serializer_class(self):
        if self.action == "me" and self.request.method == "PATCH":
            return UserUpdateSerializer
        if self.request.method == "POST":
            return UserCreateSerializer
        if self.request.method in ["PUT", "PATCH"]:
            return UserUpdateSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action in ["create", "login"]:
            return [AllowAny()]
        if self.action in ["list", "retrieve", "me"]:
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    def update(self, request, *args, **kwargs):
        if str(self.get_object().id) != str(request.user.id):
            raise PermissionDenied("Nie możesz edytować innego użytkownika.")
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if str(self.get_object().id) != str(request.user.id):
            raise PermissionDenied("Nie możesz edytować innego użytkownika.")
        return super().partial_update(request, *args, **kwargs)
    

    @action(methods=["POST"], detail=False)
    def login(self,request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username,password=password)
   
        if user is  None:
            raise  AuthenticationFailed("Provided credentials aren't correct")

        token = RefreshToken.for_user(user)
        return Response( {
            "tokens":{
                "refresh":str(token),
                "access":str(token.access_token),
                },
           
            "user":UserSerializer(user).data
        }
        )

        
    

    @action(methods=["GET", "PATCH"], detail=False, permission_classes=[IsAuthenticated])
    def me(self, request):
        if request.method == "PATCH":
            serializer = UserUpdateSerializer(
                request.user, data=request.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
        return Response(UserSerializer(request.user).data)
    
