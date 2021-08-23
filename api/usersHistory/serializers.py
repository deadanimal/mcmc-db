from rest_framework import serializers

from .models import (
    userHistory  
)

class userHistorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = userHistory
        fields = '__all__'