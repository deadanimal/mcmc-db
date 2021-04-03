from __future__ import unicode_literals
import json
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

from django.contrib.postgres.fields import ArrayField
from phonenumber_field.modelfields import PhoneNumberField
from simple_history.models import HistoricalRecords

from core.helpers import PathAndRename

class productCertification(models.Model):

    Id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    FileNo = models.CharField(max_length=255, blank=True)
    TAC = models.CharField(max_length=255, blank=True)
    TypeOfProduct  = models.CharField(max_length=255, blank=True)
    Model = models.CharField(max_length=255, blank=True)
    Brand = models.CharField(max_length=255, blank=True)
    MarketingName = models.CharField(max_length=255, blank=True)
    ApproveDate = models.CharField(max_length=255, blank=True)
    ExpiryDate = models.CharField(max_length=255, blank=True)
    ProductCategory = models.CharField(max_length=255, blank=True)
    CertholderName = models.CharField(max_length=255, blank=True)
    ROCROB = models.CharField(max_length=255, blank=True)
    CA_owner = models.CharField(max_length=255, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
 

    class Meta:
        ordering = ['created_date']

    def __str__(self):
        return self.Id

