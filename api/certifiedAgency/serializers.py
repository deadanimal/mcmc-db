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
    certifiedAgency
)

class certifiedAgencySerializer(serializers.ModelSerializer):

    class Meta:
        model = certifiedAgency
        fields = (
            'Id', 
            'ca_name',
            'createdBy',
            'created_date',
            'modified_date',
            'appoint_date',
            'expiry_date',
            'pic_name',
            'ip_address',
            'url',
            'is_active',
            'path',
            'port',
            'remarks',
            'ca_id',






            
        )
        # read_only_fields = ('email', 'id', 'TACInd')

