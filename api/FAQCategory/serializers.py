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
    FAQCategory
)

from users.serializers import CustomUserSerializer

class FAQCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = FAQCategory
        fields = (
            'categoryId',
            'category',
            'active', 
            'content',
            
            
        )
        # read_only_fields = ('email', 'id', 'TACInd')

class FAQCategoryHistorySerializer(serializers.ModelSerializer):
    history_user = CustomUserSerializer(read_only=True)
    
    class Meta:
        model = FAQCategory.history.model
        fields = '__all__'
