import time
import uuid
import datetime
import pytz

from django.utils import timezone

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

from ProductRegistration.models import (
    ProductRegistration
)

from ProductRegistration.serializers import (
    ProductRegistrationSerializer
)


class ProductRegistrationViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = ProductRegistration.objects.all()
    serializer_class = ProductRegistrationSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
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


    ]

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = ProductRegistration.objects.all()
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

    @action(methods=['GET'], detail=False)
    def filter_table_testing(self, request, *args, **kwargs):

        FileNo = request.GET.get('FileNo', '')
        TAC = request.GET.get('TAC', '')
        SLPID = request.GET.get('SLPID', '')
        IMEI = request.GET.get('IMEI', '')
        ProductRegistrationNo = request.GET.get('ProductRegistrationNo', '')
        SerialNo = request.GET.get('SerialNo', '')
        RegType = request.GET.get('RegType', '')

        result = ProductRegistration.objects.filter(FileNo__icontains=FileNo,
                                                    TAC__icontains=TAC,
                                                    SLPID__icontains=SLPID,
                                                    IMEI__icontains=IMEI,
                                                    SerialNo__icontains=SerialNo,
                                                    ProductRegistrationNo__icontains=ProductRegistrationNo,
                                                    RegType__icontains=RegType)

        serializer = ProductRegistrationSerializer(result, many=True)
        return Response(serializer.data)

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
    def filter_daterange(self, request, *args, **kwargs):

        approveDate = request.GET.get('approveDate', '')

        result = ProductRegistration.objects.filter(
            approveDate__range=[approveDate])

        serializer = ProductRegistrationSerializer(result, many=True)
        return Response(serializer.data)


    @action(methods=['GET'], detail=False)
    def get_search_counter(self, request, *args, **kwargs):

        timezone_ = pytz.timezone('Asia/Kuala_Lumpur')
        current_year = str(datetime.datetime.now(timezone_).year)
        filter_year = datetime.datetime.now(tz=timezone.utc).year

        
        ProductChart = ProductRegistration.objects.get(ApproveDate__icontains=ApproveDate)
        print (ProductChart)
        TAC_by_month = {
            'january': len(ProductChart.filter(
                ApproveDate=1,
            )),
            'february': len(ProductChart.filter(
                ApproveDate=2,
            )),
            'march': len(ProductChart.filter(
                ApproveDate=3,
            )),
            'april': len(ProductChart.filter(
                ApproveDate=4,
            )),
            'may': len(ProductChart.filter(

                ApproveDate=5,
            )),
            'june': len(ProductChart.filter(
                ApproveDate=6,
            )),
            'july': len(ProductChart.filter(
                ApproveDate=7,
            )),
            'august': len(ProductChart.filter(
                ApproveDate=8,
            )),
            'september': len(ProductChart.filter(
                ApproveDate=9,
            )),
            'october': len(ProductChart.filter(
                ApproveDate=10,
            )),
            'november': len(ProductChart.filter(
                ApproveDate=11,
            )),
            'december': len(ProductChart.filter(
                ApproveDate=12,
            ))
        }

        statistic_data = {
            'TAC_by_month': TAC_by_month
        }

        return JsonResponse(statistic_data)