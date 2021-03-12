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
    emailTemplate
)

class emailTemplateSerializer(serializers.ModelSerializer):

    class Meta:
        model = emailTemplate
        fields = (
            'Id', 
            'template_name',
            'template_content',
            'created_date',
            'modified_date',


            
        )
        # read_only_fields = ('email', 'id', 'TACInd')

