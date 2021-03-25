from django.http.response import JsonResponse
from django.shortcuts import render
from django.db.models import Q
import json
import requests

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework import viewsets, status
from rest_framework_extensions.mixins import NestedViewSetMixin

from django_filters.rest_framework import DjangoFilterBackend

from certifiedAgency.models import (
    certifiedAgency
)

from certifiedAgency.serializers import (
    certifiedAgencySerializer
)


class certifiedAgencyViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = certifiedAgency.objects.all()
    serializer_class = certifiedAgencySerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
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
    ]

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = certifiedAgency.objects.all()
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

    @action(methods=['POST'], detail=False)
    def verify_recaptcha(self, request):

        print('verify_recaptcha')
        data = json.loads(request.body)
        response = data['response']
        secret = data['secret']

        captcha_verify_url = "https://www.google.com/recaptcha/api/siteverify"

        response = requests.post(captcha_verify_url, data=[
                                 ('secret', secret), ('response', response)])

        return JsonResponse(response.json())

    @action(methods=['GET'], detail=False)
    def filter_table_testing(self, request, *args, **kwargs):

        consigneeName = request.GET.get('consigneeName', '')
        modelDescription = request.GET.get('modelDescription', '')

        result = certifiedAgency.objects.filter(
            consigneeName__icontains=consigneeName, modelDescription__icontains=modelDescription)
        serializer = certifiedAgencySerializer(result, many=True)
        return Response(serializer.data)
