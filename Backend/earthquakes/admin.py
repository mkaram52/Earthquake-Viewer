from django.contrib import admin
from .models import (
    Earthquake
)

@admin.register(Earthquake)
class EarthquakeAdmin(admin.ModelAdmin):
    list_display = ('time', 'magnitude', 'country')
    list_filter = ('time',)
    ordering = ('-time',)