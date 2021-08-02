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
    variableConfigure
)

from users.serializers import CustomUserSerializer

class variableConfigureSerializer(serializers.ModelSerializer):

    class Meta:
        model = variableConfigure
        fields = (
            'Id', 
            'variable_name',
            'is_enable',
            'created_date',
            'modified_date',
        )
        # read_only_fields = ('email', 'id', 'TACInd')

class variableConfigureHistorySerializer(serializers.ModelSerializer):
    history_user = CustomUserSerializer(read_only=True)
    
    class Meta:
        model = variableConfigure.history.model
        fields = '__all__'

