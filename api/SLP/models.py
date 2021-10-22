from __future__ import unicode_literals
import json
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

from django.contrib.postgres.fields import ArrayField
from phonenumber_field.modelfields import PhoneNumberField
from simple_history.models import HistoricalRecords

from core.helpers import PathAndRename

class SLP(models.Model):

    Id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    SLP_ID = models.CharField(max_length=255, blank=True)
    ExpiryDate = models.DateTimeField(blank=True)
    ApproveDate = models.DateTimeField(blank=True)
    SLPID_owner = models.CharField(max_length=255, blank=True)
    principal_certificate = models.CharField(max_length=255, blank=True)
    CA_owner = models.CharField(max_length=255, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
 

    class Meta:
        ordering = ['created_date']

    def __str__(self):
        return self.Id

