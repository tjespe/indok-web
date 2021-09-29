"""
Base settings to build other settings files upon.
"""
from pathlib import Path

import environ

ROOT_DIR = Path(__file__).resolve(strict=True).parent.parent.parent

APPS_DIR = ROOT_DIR / "apps"
env = environ.Env()

# GENERAL
DEBUG = env.bool("DJANGO_DEBUG", False)

TIME_ZONE = "Europe/Oslo"
LANGUAGE_CODE = "en-us"
USE_TZ = True

# INTERNATIONALIZATION
USE_I18N = True
USE_L10N = True

# DATABASES
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("DB_NAME", default="postgres"),
        "USER": env("DB_USER", default="postgres"),
        "PASSWORD": env("DB_PASSWORD", default="postgres"),
        "HOST": env("DB_HOST", default="postgres"),
        "PORT": env.int("DB_PORT", default=5432),
    }
}

# URLS
ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

# APPS
DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "corsheaders",
    "graphene_django",
    "rest_framework",
    "phonenumber_field",
    "guardian",
]

LOCAL_APPS = [
    "apps.archive",
    "apps.cabins",
    "apps.events",
    "apps.organizations",
    "apps.users",
    "apps.forms",
    "apps.listings",
    "apps.permissions",
]
INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS


# AUTHENTICATION
AUTHENTICATION_BACKENDS = [
    "graphql_jwt.backends.JSONWebTokenBackend",
    "django.contrib.auth.backends.ModelBackend",
    "guardian.backends.ObjectPermissionBackend",
]
AUTH_USER_MODEL = "users.User"

# DATAPORTEN
DATAPORTEN_ID = env("DATAPORTEN_ID")
DATAPORTEN_SECRET = env("DATAPORTEN_SECRET")
DATAPORTEN_REDIRECT_URI = env("DATAPORTEN_REDIRECT_URI")

# PASSWORDS
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# MIDDLEWARE
MIDDLEWARE = [
    "django_alive.middleware.healthcheck_bypass_host_check",
    "api.auth.middleware.IndokWebJWTMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# STATIC FILES
STATIC_URL = "/static/"
STATIC_ROOT = str(ROOT_DIR / "staticfiles")

MEDIA_URL = "/media/"
MEDIA_ROOT = str(APPS_DIR / "media")

# TEMPLATES
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [str(ROOT_DIR / "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
            ],
        },
    }
]


# CORS
CORS_ALLOW_CREDENTIALS = env.bool("CORS_ALLOW_CREDENTIALS", True)
CORS_ORIGIN_WHITELIST = env.list("CORS_ORIGIN_WHITELIST")


# EMAIL
EMAIL_BACKEND = env(
    "DJANGO_EMAIL_BACKEND",
    default="django.core.mail.backends.smtp.EmailBackend",
)
# https://docs.djangoproject.com/en/dev/ref/settings/#email-timeout
EMAIL_TIMEOUT = 5

# ADMIN
ADMIN_URL = "admin/"

# LOGGING
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {"verbose": {"format": "%(levelname)s %(asctime)s %(module)s " "%(process)d %(thread)d %(message)s"}},
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        }
    },
    "root": {"level": "INFO", "handlers": ["console"]},
}

# PHONE NUMBERS
PHONENUMBER_DB_FORMAT = "NATIONAL"
PHONENUMBER_DEFAULT_REGION = "NO"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# GOOGLE DRIVE
GOOGLE_DRIVE_API_KEY = env("GOOGLE_DRIVE_API_KEY")


# GRAPHENE
GRAPHENE = {
    "SCHEMA": "config.schema.schema",
    "MIDDLEWARE": [
        "graphql_jwt.middleware.JSONWebTokenMiddleware",
        "api.auth.middleware.AnonymousUserMiddleware",
    ],
}
GRAPHQL_URL = "graphql/"
