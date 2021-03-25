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
        'SLPID',
        'imeiNo',
        'consigneeName',
        'modelDescription',
        'modelId',
        'productCategory',
        'serialNo',
        'approveDate',

        
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

        consigneeName = request.GET.get('consigneeName', '')
        modelDescription = request.GET.get('modelDescription', '')
        productCategory = request.GET.get('productCategory','')
        SLPID = request.GET.get('SLPID','')
        imeiNo = request.GET.get('imeiNo','')
        modelId = request.GET.get('modelId','')
        serialNo = request.GET.get('serialNo','')
        approveDate = request.GET.get('approveDate','')

        result = ProductRegistration.objects.filter(consigneeName__icontains=consigneeName,
                                                    modelDescription__icontains=modelDescription,
                                                    productCategory__icontains=productCategory,
                                                    SLPID__icontains=SLPID,
                                                    imeiNo__icontains=imeiNo,
                                                    modelId__icontains=modelId,
                                                    serialNo__icontains=serialNo,
                                                    approveDate__icontains=approveDate)

        serializer = ProductRegistrationSerializer(result, many=True)
        return Response(serializer.data) 


    @action(methods=['POST'], detail=False)
    def verify_recaptcha(self, request):

        print('verify_recaptcha')
        data = json.loads(request.body)
        response = data['response']
        secret = data['secret']

        captcha_verify_url = "https://www.google.com/recaptcha/api/siteverify"

        response = requests.post(captcha_verify_url, data=[('secret', secret), ('response', response)])

        return JsonResponse(response.json())  

    
    @action(methods=['GET'], detail=False)
    def filter_daterange(self, request, *args, **kwargs):

        approveDate = request.GET.get('approveDate', '')

        result = ProductRegistration.objects.filter(approveDate__range=[approveDate])

        serializer = ProductRegistrationSerializer(result, many=True)
        return Response(serializer.data) 