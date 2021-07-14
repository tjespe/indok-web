# Generated by Django 3.1.8 on 2021-05-03 16:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('forms', '0005_populate_position'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='question',
            options={'ordering': ['position']},
        ),
        migrations.AlterField(
            model_name='question',
            name='position',
            field=models.IntegerField(),
        ),
        migrations.AddConstraint(
            model_name='question',
            constraint=models.UniqueConstraint(fields=('form', 'position'), name='unique_question_position_on_form'),
        ),
    ]
