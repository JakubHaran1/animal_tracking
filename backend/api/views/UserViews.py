from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.models import  User
from api.serializers.ObservationSerializers import UserCreateSerializer, UserSerializer

from rest_framework.authentication import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_serializer_class(self):
        if self.request.method == 'POST' or self.request.method == 'PUT':
            return UserCreateSerializer
        return UserSerializer
    

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

        
    

    @action(methods=["GET"], detail=False,  permission_classes=[IsAuthenticated])
    def me(self,request):
        return Response(UserSerializer(request.user).data)
    
