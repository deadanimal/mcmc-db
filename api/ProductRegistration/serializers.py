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
    ProductRegistration,
    SerialData
)

class ProductRegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductRegistration
        fields = (
            'Id', 
            'FileNo',
            'TAC',
            'SLPID',
            'ProductRegistrationNo',
            'RegType',
            'SerialNo',
            'IMEI',
            'created_date',
            'modified_date',
            'CA_owner',
            
        )
        # read_only_fields = ('email', 'id', 'TACInd')

class SerialDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = SerialData
        fields = (
            'id',
            'serial_count',
            'imei_count',
            'total_product',
            'total_product_month',
        )