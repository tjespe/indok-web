# Generated by Django 3.1.2 on 2021-03-01 18:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('surveys', '0019_auto_20210301_1859'),
    ]

    operations = [
        migrations.AlterField(
            model_name='answer',
            name='answer',
            field=models.CharField(max_length=10000),
        ),
        migrations.AddConstraint(
            model_name='answer',
            constraint=models.CheckConstraint(check=models.Q(_negated=True, answer=''), name='answer_not_empty'),
        ),
    ]
