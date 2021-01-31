from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Contact(models.Model):
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='contacts')
    person = models.ForeignKey(User, on_delete=models.CASCADE)
    contact_name = models.CharField(max_length=150)

    class Meta:
        unique_together = (('owner', 'person'), ('owner', 'contact_name'))

    def __str__(self):
        return f'({self.owner}, {self.person})'
