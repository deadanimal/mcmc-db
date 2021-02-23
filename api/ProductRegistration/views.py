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

        result = ProductRegistration.objects.filter(consigneeName__icontains=consigneeName,
                                                    modelDescription__icontains=modelDescription,
                                                    productCategory__icontains=productCategory,
                                                    SLPID__icontains=SLPID,
                                                    imeiNo__icontains=imeiNo,
                                                    modelId__icontains=modelId,
                                                    serialNo__icontains=serialNo)

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

    # @api_view(['GET', 'POST', 'DELETE'])
    # def table_list(request):
    #     # GET list of tutorials, POST a new tutorial, DELETE all tutorials
    
    
    # @api_view(['GET', 'PUT', 'DELETE'])
    # def tutorial_detail(request, pk):
    #     # find tutorial by pk (id)
    #     try: 
    #         tutorial = Tutorial.objects.get(pk=pk) 
    #     except Tutorial.DoesNotExist: 
    #         return JsonResponse({'message': 'The tutorial does not exist'}, status=status.HTTP_404_NOT_FOUND) 
    
    #     # GET / PUT / DELETE tutorial
        
            
    # @api_view(['GET'])
    # def tutorial_list_published(request):
    #     if request.method == 'GET':
    #         tutorials = Tutorial.objects.all()
        
    #     title = request.GET.get('title', None)
    #     if title is not None:
    #         tutorials = tutorials.filter(title__icontains=title)
        
    #     tutorials_serializer = ProductRegistrationSerializer(tutorials, many=True)
    #     return JsonResponse(tutorials_serializer.data, safe=False)
    #     # 'safe=False' for objects serialization

# Create your views here.
