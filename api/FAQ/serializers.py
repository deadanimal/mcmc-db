from datetime import datetime
from calendar import timegm
import json

from django.contrib.auth.forms import PasswordResetForm
from django.conf import settings
from django.utils.translation import gettext as _
from rest_framework import serializers
from django.utils.timezone import now
#from api.settings import AWS_S3_ENDPOINT_URL, AWS_STORAGE_BUCKET_NAME

from .models import (
    FAQ
)

class FAQSerializer(serializers.ModelSerializer):

    class Meta:
        model = FAQ
        fields = (
            'FAQId', 
            
            
        )
        # read_only_fields = ('email', 'id', 'TACInd')

class FAQHistorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = FAQ.history.model
        fields = '__all__'
