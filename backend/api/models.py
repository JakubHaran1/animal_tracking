from django.db import models

from django.contrib.auth.models import AbstractUser
from uuid import uuid4


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid4)
    avatar = models.CharField(max_length=50)

    def __str__(self):
        return self.username


class SpeciesModel(models.Model):
    name = models.CharField(max_length=150)
    latitude = models.DecimalField(max_digits=8, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    def __str__(self):
        return self.name


class ObservationModel(models.Model):
    author = models.ForeignKey(User, verbose_name=(
        "Users"), related_name='observations', on_delete=models.CASCADE)
    species = models.ForeignKey(SpeciesModel, verbose_name=(
        "species"), related_name="obsertvations", on_delete=models.CASCADE)

    title = models.CharField(max_length=100)
    img = models.ImageField(
        upload_to='observations/', height_field=None, width_field=None, max_length=None, default="")
    latitude = models.DecimalField(max_digits=8, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.title
