
from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter

from .views.ObservationsViews import ObservationViewSet, SpeciesViewSet
from .views.UserViews import UserViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
  path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
  path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] 

# Router dla observations
Router = DefaultRouter()
Router.register(r'observations', ObservationViewSet)
Router.register(r'users', UserViewSet)
Router.register(r'species', SpeciesViewSet)
urlpatterns += Router.urls
