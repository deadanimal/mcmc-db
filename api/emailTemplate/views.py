from django.shortcuts import render
from django.db.models import Q
from django.core.mail import send_mail
from django.template import Context, Template
from django.utils.html import strip_tags

import json

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework import viewsets, status
from rest_framework_extensions.mixins import NestedViewSetMixin

from django_filters.rest_framework import DjangoFilterBackend

from .helpers import send_email_result

from emailTemplate.models import (
    emailTemplate
)

from emailTemplate.serializers import (
    emailTemplateSerializer
)

from emailNoti.models import emailNoti

class emailTemplateViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = emailTemplate.objects.all()
    serializer_class = emailTemplateSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'Id',
        'template_name',
        'template_content',
        'template_code',
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
        queryset = emailTemplate.objects.all()
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

    
    # @action(methods=['POST'], detail=False)
    # def sending_email(self, request, *args, **kwargs):

    #     template_content = request.GET.get('template_content', '<p><strong>Dear sir/madam,</strong></p><p><br></p><p>Here to inform you that the system is unsuccessfully to update data as right now.</p><p><br></p><p>Any problems occurs, kindly contact admin.</p><p><br></p><p>Thanks and regards.</p>')
    #     plain_message = strip_tags(template_content)
    #     send_mail('Email Notification', plain_message = strip_tags(template_content), 'admin@mcmc.com', ['arifhazman@pipeline.com.my','raziman@pipeline.com.my'], fail_silently=False)

    
         # code = self.request.data['code']
    #     to = self.request.data['to']
    #     context = json.loads(self.request.data['context']) if self.request.data['context'] else None
    #     email_template = emailNoti.objects.filter(code=code)
    #     if email_template:
    #         subject = email_template[0].subject
    #         t = Template(email_template[0].body)
    #         c = Context(context) if context else Context()
    #         html_message = t.render(c)
    #         plain_message = strip_tags(html_message)
    #         to = to

    #         res = send_mail(subject, plain_message, None, [to], html_message=html_message, fail_silently=False)
    #         return Response(data=res, status=status.HTTP_200_OK)

    #     else:
    #         return Response(status=status.HTTP_404_NOT_FOUND)

    @action(methods=['POST'], detail=False)
    def send_email(self, request, *args, **kwargs):

        template_code = self.request.data['template_code']
        context = json.loads(self.request.data['context']) if self.request.data['context'] else None
        template_content = emailTemplate.objects.filter(template_code=template_code)
        email_to = []

        emails = emailNoti.objects.all()

        if template_content:
            t = Template(template_content[0].body)
            c = Context(context) if context else Context()
            html_message = t.render(c)

        for email_ in emails:
            email_to.append(
                email_.email
            )
            # print(email_to)

        data = {
            'subject_': 'Email Notification',
            'plain_message_': strip_tags(html_message),
            'to_': email_to,
            'html_message_': template_content
        }

        print(data)

        send_email_result(data)
        