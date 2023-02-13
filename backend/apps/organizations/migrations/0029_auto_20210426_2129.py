# Generated by Django 3.1.8 on 2021-04-26 19:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("permissions", "0002_auto_20210422_2020"),
        ("organizations", "0028_auto_20210426_1948"),
    ]

    operations = [
        migrations.AlterField(
            model_name="organization",
            name="hr_group",
            field=models.OneToOneField(
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="hr_organization",
                to="permissions.responsiblegroup",
            ),
        ),
        migrations.AlterField(
            model_name="organization",
            name="primary_group",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="organization",
                to="permissions.responsiblegroup",
            ),
        ),
    ]
