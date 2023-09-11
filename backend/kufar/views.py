import logging

from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.shortcuts import get_object_or_404


from rest_framework import status, permissions
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_jwt.settings import api_settings
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.decorators import api_view, permission_classes

from .models import User, Announcement
from .api.serializers import UserCreateSerializer, UserSerializer, AnnouncementSerializer

# logger = logging.getLogger(__name__)


class RegistrationView(APIView):

    def post(self, request):
        data = request.data
        first_name = data['first_name']
        last_name = data['last_name']
        email = data['email']
        phone = data['phone']
        password = data['password']

        user = User.objects.create_user(email, first_name, last_name, phone, password)
        user = UserCreateSerializer(user)

        return Response(user.data, status=status.HTTP_201_CREATED)

class RetrieveUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        user = UserSerializer(user)

        return Response(user.data, status=status.HTTP_200_OK)



class LoginView(APIView):
    def post(self, request):
        data = request.data
        email = data['email']
        password = data['password']

        user = authenticate(request, email=email, password=password)

        if user is not None:
            login(request, user)
            jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
            jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
            payload = jwt_payload_handler(user)
            token = jwt_encode_handler(payload)
            return Response({'token': token}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'No active account found with the given credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        

class AnnouncementImageUpload(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        print(request.data)
        serializer = AnnouncementSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['GET'])
def retrieve_specific_ad(request, ad_id):
    try:
        ad = get_object_or_404(Announcement, id=ad_id)
        serializer = AnnouncementSerializer(ad)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)
    except Announcement.DoesNotExist:
        return JsonResponse({'detail': 'Ad not found'}, status=status.HTTP_404_NOT_FOUND)
        

class FilteredAnnouncementList(generics.ListAPIView):
    serializer_class = AnnouncementSerializer

    def get_queryset(self):
        category = self.request.query_params.get('category', None)
        queryset = Announcement.objects.all()
        
        if category:
            queryset = queryset.filter(category__name=category)
        
        return queryset
    

class SearchByTitleView(generics.ListAPIView):
    serializer_class = AnnouncementSerializer

    def get_queryset(self):
        title = self.request.query_params.get('query', None)  # Get the search query from the request
        queryset = Announcement.objects.all()
        
        if title:
            queryset = queryset.filter(title__icontains=title)

        return queryset
    

class UserAnnouncementsListView(generics.ListAPIView):
    serializer_class = AnnouncementSerializer

    def get_queryset(self):
        user = self.request.query_params.get('email', None)
        print(user)
        queryset = Announcement.objects.all()

        if user:
            queryset = queryset.filter(email=user)
        
        return queryset