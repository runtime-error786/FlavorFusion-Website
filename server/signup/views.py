from rest_framework import status
from rest_framework.response import Response
from .models import CustomUserDB
from .serializers import CustomUserSerializer
from rest_framework import viewsets

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUserDB.objects.all()
    serializer_class = CustomUserSerializer
