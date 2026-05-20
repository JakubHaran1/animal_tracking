from rest_framework.serializers import ModelSerializer,ImageField

from rest_framework.fields import DecimalField, CharField
from rest_framework.exceptions import ValidationError


from django.core.files.base import ContentFile


from PIL import Image
import io
import os

from api.models import User, SpeciesModel, ObservationModel


class SpeciesSerialiser(ModelSerializer):

    class Meta:
        model = SpeciesModel
        fields = '__all__'


class ObservationSummarySerializer(ModelSerializer):
    species_name = CharField(source="species.name", read_only=True, allow_null=True)

    class Meta:
        model = ObservationModel
        fields = ["id", "title","img","img_thumbnail","latitude","longitude","description", "date", "species_name"]


class UserSerializer(ModelSerializer):
    observations = ObservationSummarySerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "city",
            "date_joined",
            "avatar",
            "is_verified",
            "observations",
        ]


class UserCreateSerializer(ModelSerializer):
    confirm_password = CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password']
        extra_kwargs = {
            "password": {"write_only": True},
            "confirm_password": {"write_only": True},
        }

    def validate(self, data):
        if data["confirm_password"] != data["password"]:
            raise ValidationError(
                {"confirm_password": "Hasło i potwierdź hasło nie są takie same"})
        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password", None)
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        # NOTE: for now mark new accounts as verified to simplify development flow.
        # TODO: change to False in production so users must confirm via email.
        user.is_verified = True
        user.save(update_fields=["is_verified"])
        return user



class UserUpdateSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ["city"]


class ObservationSerializer(ModelSerializer):
    # species = SpeciesSerialiser()
    author = UserSerializer(read_only=True)
    # img = ImageField()
    read_only_fields = ["img_thumbnail"]
    class Meta:
        model = ObservationModel
        fields = [
            "id",
            "title",
            "description",
            "img",
            "img_thumbnail",
            "latitude",
            "longitude",
            "date",
            "author",
            "species",
        ]


       