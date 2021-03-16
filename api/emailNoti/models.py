from __future__ import unicode_literals
import json
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

from django.contrib.postgres.fields import ArrayField
from phonenumber_field.modelfields import PhoneNumberField
from simple_history.models import HistoricalRecords

from core.helpers import PathAndRename

from emailTemplate.models import (
    emailTemplate
)

class emailNoti(models.Model):

     
    Id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email  = models.CharField(max_length=255, blank=True)
    emailCode = models.CharField(max_length=255, blank=True)
    createdBy = models.CharField(max_length=255, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
    # emailTemplate_Id = models.ForeignKey(emailTemplate, on_delete=models.CASCADE, related_name='emailTemplateContent_emailTemplate', null=True)


    class Meta:
        ordering = ['created_date']

    def __str__(self):
        return self.Id

