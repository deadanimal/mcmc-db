# Generated by Django 2.2.10 on 2020-12-29 08:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('FAQTitle', '0006_auto_20201229_0755'),
    ]

    operations = [
        migrations.RenameField(
            model_name='faqtitle',
            old_name='description',
            new_name='title',
        ),
    ]
