from datetime import datetime
from calendar import timegm
import json
from simple_history.models import HistoricalRecords

from django.contrib.auth.forms import PasswordResetForm
from django.conf import settings
from django.utils.translation import gettext as _
from rest_framework import serializers
from django.utils.timezone import now
#from api.settings import AWS_S3_ENDPOINT_URL, AWS_STORAGE_BUCKET_NAME

from .models import (
    emailTemplate
)

from users.serializers import CustomUserSerializer

class emailTemplateSerializer(serializers.ModelSerializer):

    class Meta:
        model = emailTemplate
        fields = '__all__'
        
class emailTemplateHistorySerializer(serializers.ModelSerializer):
    history_user = CustomUserSerializer(read_only=True)
    
    class Meta:
        model = emailTemplate.history.model
        fields = '__all__'