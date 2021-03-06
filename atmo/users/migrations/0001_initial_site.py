# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-09-20 09:12
from __future__ import unicode_literals
from urlparse import urlparse

from django.conf import settings
from django.db import migrations


def add_site(apps, schema_editor):
    Site = apps.get_model('sites', 'Site')
    db_alias = schema_editor.connection.alias
    domain = urlparse(settings.SITE_URL)
    Site.objects.using(db_alias).get_or_create(
        id=settings.SITE_ID,
        defaults={'domain': domain.netloc, 'name': domain.netloc}
    )


def delete_site(apps, schema_editor):
    Site = apps.get_model('sites', 'Site')
    db_alias = schema_editor.connection.alias
    Site.objects.using(db_alias).filter(id=settings.SITE_ID).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('sites', '0002_alter_domain_unique'),
    ]

    operations = [
        migrations.RunPython(add_site, delete_site),
    ]
