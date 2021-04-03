from __future__ import unicode_literals
import json
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

from django.contrib.postgres.fields import ArrayField
from phonenumber_field.modelfields import PhoneNumberField
from simple_history.models import HistoricalRecords

from core.helpers import PathAndRename

class ProductRegistration(models.Model):

    Id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    TAC = models.CharField(max_length=255, blank=True)
    SLPID  = models.CharField(max_length=255, blank=True)
    ProductRegistrationNo = models.CharField(max_length=255, blank=True)
    RegType = models.CharField(max_length=255, blank=True)
    SerialNo = models.CharField(max_length=255, blank=True)
    IMEI = models.CharField(max_length=255, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
    CA_owner = models.CharField(max_length=255, blank=True)
    FileNo = models.CharField(max_length=255, blank=True)
 

    class Meta:
        ordering = ['created_date']

    def __str__(self):
        return self.SLPID

