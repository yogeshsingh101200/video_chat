from django.urls import include, path
from rest_framework import routers
from .views import UserViewSet
from .views import RegisterAPI, LoginAPI, get_user
from knox import views as knox_views

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register', RegisterAPI),
    path('auth/login', LoginAPI),
    path('auth/logout', knox_views.LogoutView.as_view()),
    path('auth/user', get_user)
]
