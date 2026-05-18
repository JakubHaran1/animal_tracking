from django_filters import rest_framework as filters
from ..models import ObservationModel

class ObservationFilter(filters.FilterSet):
    title = filters.CharFilter(field_name="title", lookup_expr="icontains")
    author=filters.CharFilter(field_name="author__username", lookup_expr="icontains")
    species=filters.CharFilter(field_name="species__name", lookup_expr="icontains")
  
    # species=filters.CharFilter(field_name="species", lookup_expr="icontains")
    class Meta:
        model = ObservationModel
        fields = ['title', 'author',"species"]


        