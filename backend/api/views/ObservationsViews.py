from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.viewsets import ModelViewSet
from rest_framework.parsers import FormParser,  MultiPartParser

from api.serializers.ObservationSerializers import ObservationSerializer,  SpeciesSerialiser
from api.models import SpeciesModel,   ObservationModel

class SpeciesViewSet(ModelViewSet):
    queryset = SpeciesModel.objects.all()
    serializer_class = SpeciesSerialiser


class ObservationViewSet(ModelViewSet):
    queryset = ObservationModel.objects.all()
    serializer_class = ObservationSerializer
    parser_classes = [FormParser,  MultiPartParser]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
