from django.contrib import admin

from api.models import ObservationModel, User, SpeciesModel

admin.site.register(ObservationModel)
admin.site.register(User)
admin.site.register(SpeciesModel)

# Register your models here.
