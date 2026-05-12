from django.shortcuts import render
from django.http import HttpResponse


from rest_framework.viewsets import ModelViewSet
from rest_framework.parsers import FormParser,  MultiPartParser
from rest_framework.filters import SearchFilter
from rest_framework.decorators import action
from rest_framework.response import Response


from api.serializers.ObservationSerializers import ObservationSerializer, SpeciesSerialiser
from api.models import SpeciesModel, ObservationModel


class SpeciesViewSet(ModelViewSet):
    queryset = SpeciesModel.objects.all()
    serializer_class = SpeciesSerialiser


class ObservationViewSet(ModelViewSet):
    queryset = ObservationModel.objects.all()
    serializer_class = ObservationSerializer
    parser_classes = [FormParser,  MultiPartParser]
    filter_backends = [SearchFilter]
    search_fields = ["author"]


    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        bounds = self.request.query_params.dict()
        print(bounds)
        observations = self.queryset.filter(latitude__lte=bounds["_northEast_lat"]).filter(longitude__lte=bounds["_northEast_lng"]).filter(latitude__gte=bounds["_southWest_lat"]).filter(longitude__gte=bounds["_southWest_lng"])
        return observations
 
       