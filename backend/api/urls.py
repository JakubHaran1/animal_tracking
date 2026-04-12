
from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter

from .views.ObservationsViews import ObservationViewSet, SpeciesViewSet, UserViewSet


urlpatterns = [


] 

# Router dla observations
Router = DefaultRouter()
Router.register(r'observations', ObservationViewSet)
Router.register(r'users', UserViewSet)
Router.register(r'species', SpeciesViewSet)
urlpatterns += Router.urls
