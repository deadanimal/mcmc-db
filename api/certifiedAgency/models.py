from __future__ import unicode_literals
import json
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

from django.contrib.postgres.fields import ArrayField
from phonenumber_field.modelfields import PhoneNumberField
from simple_history.models import HistoricalRecords

from core.helpers import PathAndRename

class certifiedAgency(models.Model):

    Id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ca_name  = models.CharField(max_length=255, blank=True, null=True)
    createdBy = models.CharField(max_length=255, blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
    appoint_date = models.DateField(null=True)
    expiry_date = models.DateField(null=True)
    pic_name = models.CharField(max_length=255, blank=True, null=True)
    ip_address = models.CharField(max_length=255, blank=True, null=True)
    url = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField()
    path = models.CharField(max_length=255, blank=True, null=True)
    port = models.CharField(max_length=255, blank=True, null=True)
    remarks = models.CharField(max_length=255, blank=True, null=True)
    ca_id = models.CharField(max_length=255, blank=True, null=True)

 

    class Meta:
        ordering = ['created_date']

    def __str__(self):
        return self.ca_id

