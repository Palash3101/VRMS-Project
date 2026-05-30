from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from user.models import User

class Command(BaseCommand):
    help = 'Sets or updates the password for a user, ensuring it is hashed correctly by Django.'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='The email of the user to update.')
        parser.add_argument('password', type=str, help='The new password for the user.')

    def handle(self, *args, **kwargs):
        email = kwargs['email']
        password = kwargs['password']

        try:
            user = User.objects.get(email=email)
            user.password = make_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Successfully updated password for user: {email}'))
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'User with email "{email}" does not exist.'))
