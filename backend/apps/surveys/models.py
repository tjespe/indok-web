from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import UniqueConstraint
from django.db.models.constraints import CheckConstraint
from django.db.models.query_utils import Q
from django.db.models.functions import Length
from apps.organizations.models import Organization
from apps.users.models import User


# Create your models here.
class Survey(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True)
    descriptive_name = models.CharField(max_length=100)
    description = models.CharField(max_length=3000, blank=True, default="")

    def __str__(self) -> str:
        return f"{self.descriptive_name}"

class Question(models.Model):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    question = models.CharField(max_length=300)
    description = models.CharField(max_length=1000, blank=True, default="")
    offered_answers = models.ManyToManyField("OfferedAnswer")
    question_type = models.ForeignKey("QuestionType", on_delete=models.SET_NULL, null=True)
    position = models.IntegerField()
    mandatory = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"{self.survey}: {self.question}"

    class Meta:
        ordering = ["position"]
        constraints = [
            UniqueConstraint(fields=["position", "survey"], name="unique question position per survey")
        ]

class OfferedAnswer(models.Model):
    answer = models.CharField(max_length=500)

    def __str__(self) -> str:
        return f"{self.answer}"

class Answer(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.CharField(max_length=10000)

    class Meta:
        constraints = [
            UniqueConstraint(fields=["user", "question"], name="unique_answer_to_question_per_user"),
            CheckConstraint(check=~Q(answer=""), name="answer_not_empty")
        ]

    def __str__(self) -> str:
        return f"User: {self.user}; Answer: {self.answer}"

class QuestionType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self) -> str:
        return f"{self.name}"
