# Generated by Django 3.1.6 on 2021-04-16 13:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("listings", "0003_auto_20210415_1631"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="listing",
            options={"ordering": ["deadline"]},
        ),
    ]
