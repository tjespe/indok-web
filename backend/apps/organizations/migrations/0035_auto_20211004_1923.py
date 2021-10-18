# Generated by Django 3.2.5 on 2021-10-04 17:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('permissions', '0011_merge_0004_auto_20210824_2126_0010_auto_20210824_1546'),
        ('organizations', '0034_alter_organization_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='membership',
            name='groups',
            field=models.ManyToManyField(
                related_name='memberships',
                to='permissions.ResponsibleGroup',
                blank=True,
            ),
        ),
    ]
