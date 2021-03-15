import graphene
from api.graphql.users.types import UserType
from apps.organizations.permissions import check_user_membership
from apps.surveys.models import Answer, Option, Question
from apps.surveys.models import QuestionType as QuestionTypeModel
from apps.surveys.models import Survey
from django.contrib.auth import get_user_model
from django.db.models.query_utils import Q
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required


class OptionType(DjangoObjectType):
    class Meta:
        model = Option
        fields = ["answer", "question", "id"]


class AnswerType(DjangoObjectType):
    user = graphene.Field(UserType)

    class Meta:
        model = Answer
        fields = ["answer", "question", "id"]
    
    @staticmethod
    @login_required
    def resolve_user(answer, info):
        user = info.context.user
        if user == answer.user:
            return user
            
        check_user_membership(user, answer.question.survey.organization)
        return answer.user


class QuestionTypeType(DjangoObjectType):
    class Meta:
        model = QuestionTypeModel
        fields = ["name", "id"]

class QuestionType(DjangoObjectType):
    options = graphene.List(OptionType)
    answers = graphene.List(AnswerType, user_id=graphene.ID())
    answer = graphene.Field(AnswerType, user_id=graphene.ID(required=True))

    class Meta:
        model = Question
        fields = [
            "question",
            "description",
            "id",
            "question_type",
            "position",
            "mandatory",
        ]

    @staticmethod
    def resolve_options(root: Question, info):
        return root.options.all()

    @staticmethod
    @login_required
    def resolve_answers(root: Question, info, user_id: int=None):
        qs = root.answers
        if user_id:
            return qs.filter(user__pk=user_id).distinct()
        return qs.all()
    
    @staticmethod
    @login_required
    def resolve_answer(root: Question, info, user_id: int):
        return root.answers.filter(user__pk=user_id).first()

class SurveyType(DjangoObjectType):
    questions = graphene.List(QuestionType)
    responders = graphene.List(UserType, user_id=graphene.ID())
    responder = graphene.Field(UserType, user_id=graphene.ID(required=True))

    class Meta:
        model = Survey
        fields = [
            "id",
            "descriptive_name",
            "description",
        ]

    @staticmethod
    def resolve_questions(root: Survey, info):
        return root.questions.all()

    @staticmethod
    @login_required
    def resolve_responders(root: Survey, info, user_id: int=None):
        """ 
        Parameters
        ----------
        root : Survey
            The survey instance
        info 
            
        user_id : int, optional
            By default None

        Returns
        -------
        A queryset of all users who have submitted answers to questions in a given survey
        """
        q = Q(answers__question__survey=root)
        if user_id:
            q &= Q(pk=user_id)
        return get_user_model().objects.filter(q).distinct()
    
    @staticmethod
    @login_required
    def resolve_responder(root: Survey, info, user_id: int):
        return SurveyType.resolve_responders(root, info, user_id).first()

    



