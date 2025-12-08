from django.core.management.base import BaseCommand
from earthquakes.utils import get_earthquakes

class Command(BaseCommand):
    help = 'Loads initial data into Earthquakes'

    def handle(self, *args, **options):
        counter = get_earthquakes()
        self.stdout.write(self.style.SUCCESS(f'Successfully loaded {counter} earthquakes'))