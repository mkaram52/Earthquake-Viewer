import requests
import csv
import io
from django.conf import settings

from .models import (
    Earthquake
)

def get_earthquakes():
    url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.csv"
    response = requests.get(url)
    response.raise_for_status()

    last_earthquake = Earthquake.objects.all().order_by("-time").first()

    # Use io.StringIO to treat the string content as a file
    csv_data = io.StringIO(response.text)
    reader = csv.reader(csv_data)

    data = list(reader)
    counter = 0

    for row in data[1:]:
        if last_earthquake and row[11] == last_earthquake.earthquake_id:
            return counter
        latlng = row[1] + "," + row[2]
        country = get_country_from_latlng(latlng)
        Earthquake.objects.create(
            earthquake_id=row[11],
            time=row[0],
            place=row[13],
            latitude=row[1],
            longitude=row[2],
            depth=row[3],
            magnitude=row[4],
            country=country,
        )
        counter+=1

    return counter

def get_country_from_latlng(latlng):
    reverse_geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={latlng}&key={settings.GOOGLE_API_KEY}&result_type=country"
    response = requests.get(reverse_geocode_url).json()
    results = response.get('results', {})

    if results:
        # Iterate through address components to find the country
        for component in results[0]['address_components']:
            if 'country' in component['types']:
                return component['long_name']
    return None