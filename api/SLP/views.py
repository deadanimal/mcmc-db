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

from SLP.models import (
    SLP
)

from SLP.serializers import (
    SLPSerializer
)


class SLPViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = SLP.objects.all()
    serializer_class = SLPSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'Id',
        'SLP_ID',
        'ExpiryDate',
        'ApproveDate',
        'SLPID_owner',
        'principal_certificate',
        'CA_owner',
    ]

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = SLP.objects.all()
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

        SLP_ID = request.GET.get('SLP_ID', '')
        ApproveDate = request.GET.get('ApproveDate', '')
        SLPID_owner = request.GET.get('SLPID_owner', '')
        principal_certificate = request.GET.get('principal_certificate', '')

        result = SLP.objects.filter(SLP_ID__icontains=SLP_ID,
                                    ApproveDate__icontains=ApproveDate,
                                    SLPID_owner__icontains=SLPID_owner,
                                    principal_certificate__icontains=principal_certificate)

        serializer = SLPSerializer(result, many=True)
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

    #     result = SLP.objects.filter(approveDate__range=[approveDate])

    #     serializer = SLPSerializer(result, many=True)
    #     return Response(serializer.data)
