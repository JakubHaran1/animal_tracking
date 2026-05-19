from rest_framework import serializers
from rest_framework.serializers import ModelSerializer,ImageField

from rest_framework.fields import DecimalField, CharField
from rest_framework.exceptions import ValidationError

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError


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
        fields = ["id", "title", "date", "species_name"]


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
                {"confirm_password": "Hasła muszą być takie same."})
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


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True, trim_whitespace=False)
    new_password = serializers.CharField(write_only=True, trim_whitespace=False)
    confirm_new_password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        request = self.context.get("request")
        user = self.context.get("user") or (request.user if request else None)
        current_password = attrs.get("current_password")
        new_password = attrs.get("new_password")
        confirm_new_password = attrs.get("confirm_new_password")

        if not user or not user.is_authenticated:
            raise ValidationError("Użytkownik nie jest uwierzytelniony.")

        if not user.check_password(current_password):
            raise ValidationError({"current_password": "Niepoprawne aktualne hasło."})

        if new_password != confirm_new_password:
            raise ValidationError({"confirm_new_password": "Hasła muszą być takie same."})

        if current_password == new_password:
            raise ValidationError({"new_password": "Nowe hasło musi być inne niż aktualne."})

        try:
            validate_password(new_password, user)
        except DjangoValidationError as exc:
            raise ValidationError({"new_password": list(exc.messages)}) from exc

        return attrs


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

    # def create(self, validated_data):
        # To do wywalenia - musi byc inny flow. User wpisuje we frontendie inputa -> debouncing do api -> jak nie ma to opcja dodanie w modalu
        # w celach ćwiczebnych
        # pobiera species data od usera i pobiera z bazy danych objekt species lub go tworzy 
        # species_data = validated_data.pop("species")
        # species_obj, _ = SpeciesModel.objects.get_or_create(
        #     **species_data)

        # edycja imgt do przeniesienia do signału 
        # img = validated_data["img"]
        # img_name, ext = os.path.splitext(img.name)
        # new_name = img_name + '_thumbnail.webp'
        # print(new_name)
        # with Image.open(img) as im:
        #     im.thumbnail((300, 300))
        #     bufor = io.BytesIO()
        #     im.save(bufor, 'webp')
        #     print("im", im)

        # img_new = ContentFile(bufor.getvalue(), new_name)
        # validated_data["img"] = img_new

        # observation = ObservationModel.objects.create(
        #   **validated_data)
        
        # observation = ObservationModel.objects.create(
        #     species=species_obj, **validated_data)
        
        # return observation
  
