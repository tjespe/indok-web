# Generated by Django 3.1.1 on 2020-09-28 14:13

from django.db import migrations


def create_cabins(apps, schema_editor):
    Cabin = apps.get_model("cabins", "Cabin")
    Cabin.objects.create(name="Oksen")
    Cabin.objects.create(name="Bjørnen")


class Migration(migrations.Migration):

    dependencies = [
        ("cabins", "0001_initial"),
    ]

    operations = [migrations.RunPython(create_cabins)]
