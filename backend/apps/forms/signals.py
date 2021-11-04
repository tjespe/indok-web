from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.forms.models import Form

from utils.permissions import assign_object_permissions


@receiver(post_save, sender=Form)
def assign_form_permissions(instance: Form, created: bool, **kwargs) -> None:
    if created:
        assign_object_permissions(
            app_name="forms", model_name="Form", instance=instance, organization=instance.organization
        )
