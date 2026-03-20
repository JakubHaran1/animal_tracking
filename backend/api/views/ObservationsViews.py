from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.viewsets import ModelViewSet


from api.serializers.ObservationSerializers import ObservationSerializer, UserCreateSerializer, UserSerializer, SpeciesSerialiser
from api.models import SpeciesModel, User,  ObservationModel

# Do przeniesienia do UserViews
class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_serializer_class(self):
        if self.request.method == 'POST' or self.request.method == 'PUT':
            return UserCreateSerializer 
        return UserSerializer
    
    
    


class SpeciesViewSet(ModelViewSet):
    queryset = SpeciesModel.objects.all()
    serializer_class = SpeciesSerialiser


class ObservationViewSet(ModelViewSet):
    queryset = ObservationModel.objects.all()
    serializer_class = ObservationSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
