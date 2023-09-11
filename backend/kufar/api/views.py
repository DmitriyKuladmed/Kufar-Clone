from rest_framework.viewsets import ModelViewSet
from ..models import User, Announcement, Category
from .serializers import UserCreateSerializer, AnnouncementSerializer, CategorySerializer

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer


class RegisterViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer


class AnnouncementViewSet(ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
