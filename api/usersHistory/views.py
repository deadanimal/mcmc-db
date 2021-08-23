import json
import time
import uuid
import datetime
import pytz
import dateutil.parser

from django.utils import timezone
from django.http.response import JsonResponse
from django.shortcuts import render
from django.db.models import Q
from django.http import JsonResponse
from django.db.models.functions import Extract
from django.db.models.functions import ExtractMonth

import json
import requests

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework import viewsets, status
from rest_framework_extensions.mixins import NestedViewSetMixin

from django_filters.rest_framework import DjangoFilterBackend

from usersHistory.models import (
    userHistory
)

from usersHistory.serializers import (
    userHistorySerializer
)


class usersHistoryViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = userHistory.objects.all()
    serializer_class = userHistorySerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['history_type', 'history_date']

    # MyModel.objects.annotate(
    # month=TruncMonth('date')
    # ).filter(month=YOURVALUE).values('month').distinct()

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]