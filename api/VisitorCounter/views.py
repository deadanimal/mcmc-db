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

from VisitorCounter.models import (
    VisitorCounter
)

from VisitorCounter.serializers import (
    VisitorCounterSerializer
)


class VisitorCounterViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = VisitorCounter.objects.all()
    serializer_class = VisitorCounterSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'Id',
        'Name',
        'Counter',
        'created_date',
        'modified_date',
    ]

    # MyModel.objects.annotate(
    # month=TruncMonth('date')
    # ).filter(month=YOURVALUE).values('month').distinct()

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    # def get_queryset(self):
    #     queryset = CustomUser.objects.all()
    #     # queryset = CustomUser.objects.filter(string__contains=CustomUser.name)

    #     """
    #     if self.request.user.is_anonymous:
    #         queryset = Company.objects.none()

    #     else:
    #         user = self.request.user
    #         company_employee = CompanyEmployee.objects.filter(employee=user)
    #         company = company_employee[0].company

    #         if company.company_type == 'AD':
    #             queryset = User.objects.all()
    #         else:
    #             queryset = User.objects.filter(company=company.id)
    #     """
    #     return queryset

    @action(methods=['GET'], detail=False)
    def filter_table_testing(self, request, *args, **kwargs):

        Counter = request.GET.get('Counter', '')
        Name = request.GET.get('Name', '')
        created_date = request.GET.get('created_date', '')

        result = VisitorCounter.objects.filter(Counter__icontains=Counter,
                                              Name__icontains=Name,
                                              created_date__icontains=created_date)

        serializer = VisitorCounterSerializer(result, many=True)
        return Response(serializer.data)

    @action(methods=['GET'], detail=False)
    def get_visitor_counter(self, request, *args, **kwargs):

        timezone_ = pytz.timezone('Asia/Kuala_Lumpur')
        current_year = str(datetime.datetime.now(timezone_).year)
        filter_year = datetime.datetime.now(tz=timezone.utc).year

        visitor_counter = VisitorCounter.objects.all()
        value = len(visitor_counter.filter(Name='visitor'))
        visitor_by_month = {
            'january': len(visitor_counter.filter(
                # created_date=filter_year,
                Counter=1,
                Name='visitor',
            )),
            'february': len(visitor_counter.filter(
                # created_date=filter_year,
                Counter=2,
                Name='visitor',
            )),
            'march': len(visitor_counter.filter(
                # created_date=filter_year,
                Counter=3,
                Name='visitor',
            )),
            'april': len(visitor_counter.filter(
                # created_date=filter_year,
                Counter=4,
                Name='visitor',
            )),
            'may': len(visitor_counter.filter(
                # created_date=filter_year,
                Counter=5,
                Name='visitor',
            )),
            'june': len(visitor_counter.filter(
                # created_date=filter_year,
                Counter=6,
                Name='visitor',
            )),
            'july': len(visitor_counter.filter(
                # created_date=filter_year,
                Counter=7,
                Name='visitor',
            )),
            'august': len(visitor_counter.filter(
                # created_date=filter_year,
                Counter=8,
                Name='visitor',
            )),
            'september': len(visitor_counter.filter(
                # created_date=filter_year,
                Counter=9,
                Name='visitor',
            )),
            'october': len(visitor_counter.filter(
                # created_date=filter_year,
                Counter=10,
                Name='visitor',
            )),
            'november': len(visitor_counter.filter(
                # created_date=filter_year,
                Counter=11,
                Name='visitor',
            )),
            'december': len(visitor_counter.filter(
                # created_date=filter_year,
                Counter=12,
                Name='visitor',
            ))
        }

        statistic_data = {
            'value': value,
            'visitor_by_month': visitor_by_month
        }

        return JsonResponse(statistic_data)
