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

from productCertification.models import (
    productCertification
)

from productCertification.serializers import (
    productCertificationSerializer
)


class productCertificationViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = productCertification.objects.all()
    serializer_class = productCertificationSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'Id',
        'FileNo',
        'TAC',
        'TypeOfProduct',
        'Model',
        'Brand',
        'MarketingName',
        'ApproveDate',
        'ExpiryDate',
        'ProductCategory',
        'CertholderName',
        'ROCROB',
        'CA_owner',
    ]

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = productCertification.objects.all()
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
        TypeOfProduct = request.GET.get('TypeOfProduct', '')
        Model = request.GET.get('Model', '')
        Brand = request.GET.get('Brand', '')
        MarketingName = request.GET.get('MarketingName', '')
        ApproveDate = request.GET.get('ApproveDate', '')
        ProductCategory = request.GET.get('ProductCategory', '')
        ROCROB = request.GET.get('ROCROB', '')

        result = productCertification.objects.filter(FileNo__icontains=FileNo,
                                                     TAC__icontains=TAC,
                                                     TypeOfProduct__icontains=TypeOfProduct,
                                                     Model__icontains=Model,
                                                     Brand__icontains=Brand,
                                                     MarketingName__icontains=MarketingName,
                                                     ROCROB__icontains=ROCROB,
                                                     ProductCategory__icontains=ProductCategory,
                                                     ApproveDate__icontains=ApproveDate)

        serializer = productCertificationSerializer(result, many=True)
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

    # @action(methods=['GET'], detail=False)
    # def filter_daterange(self, request, *args, **kwargs):

    #     approveDate = request.GET.get('approveDate', '')

    #     result = productCertification.objects.filter(approveDate__range=[approveDate])

    #     serializer = productCertificationSerializer(result, many=True)
    #     return Response(serializer.data)
