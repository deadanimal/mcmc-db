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

from SearchCounter.models import (
    SearchCounter
)

from SearchCounter.serializers import (
    SearchCounterSerializer
)


class SearchCounterViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = SearchCounter.objects.all()
    serializer_class = SearchCounterSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'Id',
        'Name',
        'Counter',
        'created_date',
        'modified_date',
    ]

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = SearchCounter.objects.all()
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

        Counter = request.GET.get('Counter', '')
        Name = request.GET.get('Name', '')
        created_date = request.GET.get('created_date', '')

        result = SearchCounter.objects.filter(Counter__icontains=Counter,
                                              Name__icontains=Name,
                                              created_date__icontains=created_date)

        serializer = SearchCounterSerializer(result, many=True)
        return Response(serializer.data)
