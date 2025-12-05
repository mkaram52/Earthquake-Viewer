from django.db import models
from django.utils import timezone


class Earthquake(models.Model):
    earthquake_id = models.CharField(max_length=256)
    time = models.DateTimeField(null=False, blank=False)
    depth = models.FloatField(default=0)
    magnitude = models.FloatField(default=0)

    latitude = models.FloatField(default=0)
    longitude = models.FloatField(default=0)
    country = models.CharField(max_length=256, null=True, blank=True)