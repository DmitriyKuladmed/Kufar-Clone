from django.urls import path
from rest_framework.routers import DefaultRouter

from ..views import RegistrationView, RetrieveUserView, AnnouncementImageUpload, FilteredAnnouncementList
from .views import UserViewSet, AnnouncementViewSet, CategoryViewSet

base_router = DefaultRouter()

base_router.register(r'user', UserViewSet)
base_router.register(r'category', CategoryViewSet)
base_router.register(r'announcement', AnnouncementViewSet)

urlpatterns = [
    path('register', RegistrationView.as_view()),
    path('me', RetrieveUserView.as_view()),
    path('add-image', AnnouncementImageUpload.as_view()),
]

