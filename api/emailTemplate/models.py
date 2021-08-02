from __future__ import unicode_literals
import json
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

from django.contrib.postgres.fields import ArrayField
from phonenumber_field.modelfields import PhoneNumberField
from simple_history.models import HistoricalRecords

from core.helpers import PathAndRename

from users.models import (
    CustomUser
)

class emailTemplate(models.Model):

    Id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    template_name = models.CharField(max_length=255, blank=True)
    CODE = [
        ('1', 'Success'),
        ('2', 'Fail'),
        ('0', 'Not Choose')
    ]
    template_code = models.CharField(max_length=1, choices=CODE, default=0, blank=True)
    template_content = models.CharField(max_length=100000, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
    history = HistoricalRecords(user_model=CustomUser)
 
    class Meta:
        ordering = ['created_date']

    def __str__(self):
        return self.template_content
