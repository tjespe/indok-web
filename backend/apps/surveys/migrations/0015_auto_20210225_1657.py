# Generated by Django 3.1.2 on 2021-02-25 15:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('surveys', '0014_auto_20210225_1650'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='answer',
            constraint=models.UniqueConstraint(fields=('user', 'question'), name='unique_answer_to_question_per_user'),
        ),
    ]
