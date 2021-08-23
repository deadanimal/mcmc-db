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
    certifiedAgency,
    APIDetails
)

from certifiedAgency.serializers import (
    certifiedAgencySerializer,
    certifiedAgencyHistorySerializer,
    APIDetailsSerializer,
    APIDetailsHistorySerializer
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
    
    @action(methods=['GET','POST'], detail=False)
    def script(self, request, *args, **kwargs):
        urlData = request.data['url']
        print(urlData)
        
        token_url="https://staging-gw-codelab.sirim.my/security/connect/token"
        url = "http://ecommdev.esource.my/restapi/api/GetNewCertifiedProduct"

        client_id='60ee4a9379aa3166c8632f93'
        client_secret='5nZ85UMp5GpOswN5BEyxnCdoWX7hyX9QVuKsyIdqtd4='
        scope='eip-admin.sirim-ecomm.all'
        
        data = {'grant_type': 'client_credentials'}
        access_token_response = requests.post(token_url, data=data, verify=False, allow_redirects=False, auth=(client_id, client_secret))
        # print (access_token_response.text)
        
        tokens = json.loads(access_token_response.text)
        headers={'Authorization': 'Bearer ' + tokens['access_token']}
        
        payload = json.dumps({
            "Authentication": {
                "UserName": "MCMC2021",
                "Password": "833c38dbdf88e210a41755f69165f54c",
                "Token": "1A8E29BF-00BE-47DD-AE39-31782A0F17C7"
            }
            })
        
        response = requests.request("POST", urlData+"GetNewCertifiedProduct", headers=headers, data=payload)

        print(response.status_code)
        # print(response.content)
        data_from_json = json.loads(response.content)
        cert_line_count = 0
        for row in data_from_json['TACList']:
            if cert_line_count==0:
                cert_line_count +=1
            certification = {
            # #      #  database: json
                    'FileNo': row["FileNo"],
                    'TAC': row["TAC"],
                    'TypeOfProduct': row["TypeOfProduct"],
                    'Model': row["Model"],
                    'Brand': row["Brand"],
                    'MarketingName': row["MarketingName"],
                    'ApproveDate': row["ApproveDate"],
                    'ExpiryDate': row["ExpiryDate"],
                    'ProductCategory': row["ProductCategory"],
                    'CertholderName': row["CertHolderName"],
                    'ROCROB': row["ROCROB"],
                }
            cert_line_count += 1
            # print(json.dumps(certification))
            # requests.post('http://192.168.11.136/v1/productCertification/', data=certification)
            # print(row)
        print(f'Processed {cert_line_count -1} lines of Cert data.')
        
        responseSLP = requests.request("POST", urlData+"GetSLP", headers=headers, data=payload)

        SLP = json.loads(responseSLP.content)
        SLP_line_count = 0
        for row in SLP['SLPList']:
            if SLP_line_count==0:
                SLP_line_count +=1
            SLPID = {
            # #      #  database: json
                    'SLP_ID': row["SLPID"],
                    'ExpiryDate': row["ExpiryDate"],
                    'SLPID_owner': row["Owner"],
                    'principal_certificate': row["Principal"],
                }
            SLP_line_count += 1
            # print(json.dumps(certification))
            # requests.post('http://192.168.11.136/v1/SLP/', data=SLPID)
            print(row)
        print(f'Processed {SLP_line_count -1} lines of SLP data.')
        
        TAC2 = {"TAC": "RCCT/75E/1020/S(20-4063)"}
        responseSerial = requests.post("http://ecommdev.esource.my/restapi/api/GetProductRegistration", json=TAC2)
        print(responseSerial.status_code)
        product2 = json.loads(responseSerial.content)

        line_count = 0
        for row in product2['ProductReg']:
            for row2 in row['SerialNoList']:
                if line_count==0:
                    line_count +=1   
                Product2 = {
                        #  database: json
                        'SLPID': row["SLP_ID"],
                        'ProductRegistrationNo': row["ProductRegNo"],
                        'RegType': row["RegType"],
                        'SerialNo': row2["SerialNo"],
                        # 'IMEI': row2['IMEINo'],
                    }
                line_count += 1
                    # print(json.dumps(certification))
                # requests.post('http://192.168.11.136/v1/ProductRegistration/', data=Product)
                print(Product2)
        print(f'Processed {line_count -1} lines of product data (Serial).')
        
        TAC = {"TAC": "RGIC/06A/0620/S(20-2463)"}

        responseIMEI = requests.post("http://ecommdev.esource.my/restapi/api/GetProductRegistration", json=TAC)
        print(responseIMEI.status_code)
        product = json.loads(responseIMEI.content)

        line_count = 0
        for row in product['ProductReg']:
            for row2 in row['IMEIList']:
                if line_count==0:
                    line_count +=1   
                Product = {
                        #  database: json
                        'SLPID': row["SLP_ID"],
                        'ProductRegistrationNo': row["ProductRegNo"],
                        'RegType': row["RegType"],
                        # 'SerialNo': row2["SerialNo"],
                        'IMEI': row2['IMEINo'],
                    }
                line_count += 1
                    # print(json.dumps(certification))
                # requests.post('http://192.168.11.136/v1/ProductRegistration/', data=Product)
                print(Product)
        print(f'Processed {line_count -1} lines of product data (IMEI).')

        
        # Sending email function through services
        obj = {
            "template_code": "1",
            "context": "",
            }

        sendMail=requests.post('http://127.0.0.1:8000/v1/emailTemplate/send_email/', json=obj)
        print(sendMail.response.code)
        
        return Response({"data": urlData})

class APIDetailsViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = APIDetails.objects.all()
    serializer_class = APIDetailsSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'url'
    ]

    def get_permissions(self):
        permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]    

    
    def get_queryset(self):
        queryset = APIDetails.objects.all()
        return queryset
    
    @action(methods=['GET','POST'], detail=False)
    def script(self, request, *args, **kwargs):
        url = APIDetails.objects.all()
        url2 = url['url']
        response = requests.post(url2)
        print(response.status_code)
        # print(response.content)
        data_from_json = json.loads(response.content)
        cert_line_count = 0
        for row in data_from_json['TACList']:
            if cert_line_count==0:
                cert_line_count +=1
            certification = {
        # #      #  database: json
                    'FileNo': row["FileNo"],
                    'TAC': row["TAC"],
                    'TypeOfProduct': row["TypeOfProduct"],
                    'Model': row["Model"],
                    'Brand': row["Brand"],
                    'MarketingName': row["MarketingName"],
                    'ApproveDate': row["ApproveDate"],
                    'ExpiryDate': row["ExpiryDate"],
                    'ProductCategory': row["ProductCategory"],
                    'CertholderName': row["CertHolderName"],
                    'ROCROB': row["ROCROB"],
                }
        cert_line_count += 1
        print(json.dumps(certification))
        # requests.post('http://192.168.11.136/v1/productCertification/', data=certification)
        print(row)
        print(f'Processed {cert_line_count -1} lines of Cert data.')
        
        return response.status_code

class APIDetailsHistoryViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = APIDetails.history.all()
    serializer_class = APIDetailsHistorySerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    # filterset_fields = []

    def get_permissions(self):
        permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]    

    
    def get_queryset(self):
        queryset = APIDetails.history.all()
        return queryset

class certifiedAgencyHistoryViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = certifiedAgency.history.all()
    serializer_class = certifiedAgencyHistorySerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['history_type','history_date']

    def get_permissions(self):
        permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]    

    
    def get_queryset(self):
        queryset = certifiedAgency.history.all()
        return queryset