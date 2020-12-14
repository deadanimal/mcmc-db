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

    ProductRegistrationId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    SLPID = models.CharField(max_length=255, blank=True)
    TAC = models.CharField(max_length=255, blank=True)
    IMEI = models.CharField(max_length=255, blank=True)
    serialNo = models.CharField(max_length=255, blank=True)
    ProductRegNo = models.CharField(max_length=255, blank=True)
    REG_TYPE_OPTION = [
        ('SN','SerialNo'),
        ('IMEI','IMEI')
    ]

    user_type = models.CharField(max_length=2,choices=REG_TYPE_OPTION)
    regType = models.CharField(max_length=255, blank=True)
    created_date = models.DateTimeField(auto_now=True)
    modified_date = models.DateTimeField(auto_now=True)
 

    class Meta:
        ordering = ['modified_date']

    def __str__(self):
        return self.SLPID

