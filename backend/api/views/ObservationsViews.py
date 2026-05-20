from django.shortcuts import render
from django.http import HttpResponse

from rest_framework.viewsets import ModelViewSet
from rest_framework import filters
from rest_framework.parsers import FormParser, MultiPartParser
from django_filters.rest_framework import DjangoFilterBackend

from api.serializers.ObservationSerializers import ObservationSerializer, SpeciesSerialiser
from api.models import SpeciesModel, ObservationModel
from api.custom_filters.ObservationFilterBackend import ObservationFilter


class SpeciesViewSet(ModelViewSet):
    queryset = SpeciesModel.objects.all()
    serializer_class = SpeciesSerialiser
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]


class ObservationViewSet(ModelViewSet):
    queryset = ObservationModel.objects.all()
    serializer_class = ObservationSerializer
    parser_classes = [FormParser, MultiPartParser]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ObservationFilter

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        bounds = self.request.query_params.dict()
        observations = self.queryset.all()

        if "_northEast_lat" in bounds.keys():
            observations = observations.filter(
                latitude__lte=bounds["_northEast_lat"]
            ).filter(
                longitude__lte=bounds["_northEast_lng"]
            ).filter(
                latitude__gte=bounds["_southWest_lat"]
            ).filter(
                longitude__gte=bounds["_southWest_lng"]
            )

        return observations