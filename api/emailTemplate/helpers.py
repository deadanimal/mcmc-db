from django.conf import settings
from django.core.mail import send_mail

from django.template import Context, Template
from django.utils.html import strip_tags

from rest_framework.response import Response
from rest_framework import viewsets, status
#         [data['to_']]
def send_email_result(data):

    print(data['plain_message_'])
    # email_template
    # if email_template:
    for em in data['to_']:
    #     print(em)
        
        useremail = ''
        useremail = [em]
        res = send_mail(
            'Notification from MCMC RECCE System',
            data['plain_message_'],
            'raziman@mcmc.my',
            useremail,
        )

    print(res)

    return Response(
        data=res,
        status=status.HTTP_200_OK
    )
    # else:
    #     return Response(
    #         status=status.HTTP_404_NOT_FOUND
    #     )