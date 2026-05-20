import os

from django.db import models

from django.contrib.auth.models import AbstractUser
from uuid import uuid4

import os
import io
from PIL import Image
from django.core.files.base import ContentFile

def create_obs_img_path(instance,filename):
    return f'observations/{instance.author.id}/{instance.title}/{filename}'


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid4)
    avatar = models.CharField(max_length=50, blank=True, default="")
    city = models.CharField(max_length=100, blank=True, default="")
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username


class SpeciesModel(models.Model):
    name = models.CharField(max_length=150,unique=True)
    latitude = models.DecimalField(max_digits=8, decimal_places=6,null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6,null=True)

    # def __str__(self):
    #     return self.name


class ObservationModel(models.Model):
    author = models.ForeignKey(User, verbose_name=(
        "Users"), related_name='observations', on_delete=models.CASCADE)
    species = models.ForeignKey(SpeciesModel, verbose_name=(
        "species"), related_name="obsertvations", on_delete=models.CASCADE,null=True)

    description = models.TextField(max_length=200)
    title = models.CharField(max_length=100)
    img = models.ImageField(
        upload_to=create_obs_img_path, height_field=None, width_field=None, max_length=None)
    img_thumbnail = models.ImageField(
      height_field=None, width_field=None, max_length=None,default="")
    latitude = models.DecimalField(max_digits=10, decimal_places=6)
    longitude = models.DecimalField(max_digits=10, decimal_places=6)
    date = models.DateField(auto_now_add=True)

    def save(self,*args, **kwargs):
        if self.pk:
            old = ObservationModel.objects.get(pk=self.pk)

        img = self.img
        # if old.img == img:
        #     super().save(*args, **kwargs)
        #     return
        img_name, ext = os.path.splitext(img.name)
        new_name = img_name + '_thumbnail.webp'
        print("d",new_name)
        with Image.open(img) as im:
            im.thumbnail((300, 300))
            bufor = io.BytesIO()
            im.save(bufor, 'webp')


        img_new = ContentFile(bufor.getvalue(), new_name)
        self.img_thumbnail.save(new_name,img_new,save=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class FriendRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        ACCEPTED = "accepted", "Accepted"
        DECLINED = "declined", "Declined"
        CANCELED = "canceled", "Canceled"

    from_user = models.ForeignKey(
        User, related_name="sent_friend_requests", on_delete=models.CASCADE
    )
    to_user = models.ForeignKey(
        User, related_name="received_friend_requests", on_delete=models.CASCADE
    )
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["from_user", "to_user"],
                name="unique_friend_request_pair",
            ),
            models.CheckConstraint(
                condition=~models.Q(from_user=models.F("to_user")),
                name="no_self_friend_request",
            ),
        ]
        indexes = [models.Index(fields=["status"], name="friend_request_status_idx")]

    def __str__(self):
        return f"{self.from_user} -> {self.to_user} ({self.status})"


class Friendship(models.Model):
    user_low = models.ForeignKey(
        User, related_name="friendships_low", on_delete=models.CASCADE
    )
    user_high = models.ForeignKey(
        User, related_name="friendships_high", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user_low", "user_high"],
                name="unique_friendship_pair",
            ),
            models.CheckConstraint(
                condition=~models.Q(user_low=models.F("user_high")),
                name="no_self_friendship",
            ),
        ]

    def __str__(self):
        return f"{self.user_low} <-> {self.user_high}"
