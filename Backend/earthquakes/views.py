from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Earthquake
from .serializers import EarthquakeSerializer


class EarthquakeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Earthquake.objects.all().order_by("-magnitude")
    permission_classes = [permissions.AllowAny]
    serializer_class = EarthquakeSerializer



