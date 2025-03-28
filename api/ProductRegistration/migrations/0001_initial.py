# Generated by Django 2.2.10 on 2020-12-08 07:31

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ProductRegistration',
            fields=[
                ('ProductRegistrationId', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('SLPID', models.CharField(blank=True, max_length=255)),
                ('TAC', models.CharField(blank=True, max_length=255)),
                ('IMEI', models.CharField(blank=True, max_length=255)),
                ('serialNo', models.CharField(blank=True, max_length=255)),
                ('ProductRegNo', models.CharField(blank=True, max_length=255)),
                ('user_type', models.CharField(choices=[('SN', 'SerialNo'), ('IMEI', 'IMEI')], max_length=2)),
                ('regType', models.CharField(blank=True, max_length=255)),
                ('created_date', models.DateTimeField(auto_now=True)),
                ('modified_date', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['SLPID'],
            },
        ),
    ]
