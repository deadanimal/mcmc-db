# Generated by Django 2.2.10 on 2021-02-03 03:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('FAQCategory', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='faqcategory',
            name='active',
            field=models.BooleanField(),
        ),
    ]
