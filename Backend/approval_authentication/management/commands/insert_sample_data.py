from django.core.management.base import BaseCommand
from approval_authentication.models import User

class Command(BaseCommand):
    help = 'Inserts sample data into the database'

    def handle(self, *args, **kwargs):
        # Sample data
        users_data = [
            {"username": "Alice", "password": "1234"},
            {"username": "Bob", "password": "1234"},
            {"username": "Charles", "password": "1234"},
            {"username": "Arnold", "password": "1234"},
            {"username": "Bill", "password": "1234"},
            {"username": "Cynthia", "password": "1234"},
            {"username": "Alan", "password": "1234"},
            {"username": "Ben", "password": "1234"}
        ]

        # Inserting the data
        for user_data in users_data:
            User.objects.create_user(username=user_data['username'], password=user_data['password'])

        self.stdout.write(self.style.SUCCESS('Successfully inserted sample data!'))
