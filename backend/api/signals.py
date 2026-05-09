from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.files.base import ContentFile
from .models import ObservationModel


import os
import io
from PIL import Image

@receiver(post_save, sender=ObservationModel)
def save_img(instance,**kwargs):
        print(instance.title)
        if instance.img_thumbnail:
                return 
        
        img = instance.img
        img_name, ext = os.path.splitext(img.name)
        new_name = img_name + '_thumbnail.webp'
        print(new_name)
        with Image.open(img) as im:
            im.thumbnail((300, 300))
            bufor = io.BytesIO()
            im.save(bufor, 'webp')
            

        img_new = ContentFile(bufor.getvalue(), new_name)
        instance.img_thumbnail.save(new_name,img_new,save=False)
        instance.save()
           
            
            # observation = ObservationModel.objects.create(
            #     species=species_obj, **validated_data)
            
            

    # if created:
    #     ObservationModel.save()
