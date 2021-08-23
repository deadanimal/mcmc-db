from django.shortcuts import render
from django.db.models import Q
from django.core.mail import send_mail
from django.template import Context, Template
from django.utils.html import strip_tags
import requests

import json

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework import viewsets, status
from rest_framework_extensions.mixins import NestedViewSetMixin

from django_filters.rest_framework import DjangoFilterBackend

from emailNoti.models import (
    emailNoti
)

from emailNoti.serializers import (
    emailNotiSerializer,
    emailNotiHistorySerializer
)

class emailNotiViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = emailNoti.objects.all()
    serializer_class = emailNotiSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'Id',
        'email',
        'created_date',
        'modified_date',
        # 'createdBy',
        # 'created_date',
    ]

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]    

    
    def get_queryset(self):
        queryset = emailNoti.objects.all()
        # queryset = CustomUser.objects.filter(string__contains=CustomUser.name)

        """
        if self.request.user.is_anonymous:
            queryset = Company.objects.none()

        else:
            user = self.request.user
            company_employee = CompanyEmployee.objects.filter(employee=user)
            company = company_employee[0].company
            
            if company.company_type == 'AD':
                queryset = User.objects.all()
            else:
                queryset = User.objects.filter(company=company.id)
        """
        return queryset  
    
    @action(methods=['GET','POST'], detail=True)
    def history(self, request, *args, **kwargs):
        history = emailNoti.history.all()
        serializer = emailNotiSerializer(history, many=True)
        return Response(serializer.data)
    
    
class emailNotiHistoryViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = emailNoti.history.all()
    serializer_class = emailNotiHistorySerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['history_type','history_date']

    def get_permissions(self):
        permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]    

    
    def get_queryset(self):
        queryset = emailNoti.history.all()
        return queryset

