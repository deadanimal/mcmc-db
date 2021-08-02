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
    emailNoti
)

from users.serializers import CustomUserSerializer

class emailNotiSerializer(serializers.ModelSerializer):

    class Meta:
        model = emailNoti
        fields = '__all__'

class emailNotiHistorySerializer(serializers.ModelSerializer):
    history_user = CustomUserSerializer(read_only=True)
    
    class Meta:
        model = emailNoti.history.model
        fields = '__all__'

