from rest_framework.serializers import ModelSerializer
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


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'email',]


class UserCreateSerializer(ModelSerializer):
    confirm_password = CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password']

    def validate(self, data):
        if data["confirm_password"] != data["password"]:
            raise ValidationError(
                {"confirm_password": "Password and confirm password aren't the same"})
        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        user = User.objects.create(
            username=validated_data['username'], email=validated_data['email'])

        user.set_password(validated_data["password"])
        user.save()
        return user
        # dodać confirm field i validate czy takie samo - frontend


class ObservationSerializer(ModelSerializer):
    species = SpeciesSerialiser()
    author = UserSerializer(read_only=True)

    class Meta:
        model = ObservationModel
        fields = ['title', 'img', 'latitude',
                  'longitude', 'date', 'author', 'species']

    def create(self, validated_data):
        # To do wywalenia - musi byc inny flow. User wpisuje we frontendie inputa -> debouncing do api -> jak nie ma to opcja dodanie w modalu
        # w celach ćwiczebnych
        species_data = validated_data.pop("species")
        species_obj, _ = SpeciesModel.objects.get_or_create(
            **species_data)

        img = validated_data["img"]
        img_name, ext = os.path.splitext(img.name)
        new_name = img_name + '_thumbnail.webp'
        print(new_name)
        with Image.open(img) as im:
            im.thumbnail((300, 300))
            bufor = io.BytesIO()
            im.save(bufor, 'webp')
            print("im", im)
        img_new = ContentFile(bufor.getvalue(), new_name)
        validated_data["img"] = img_new

        observation = ObservationModel.objects.create(
            species=species_obj, **validated_data)
        return observation
  
