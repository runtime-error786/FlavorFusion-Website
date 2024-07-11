from rest_framework import status
from rest_framework.response import Response
from .models import CustomUserDB
from .serializers import CustomUserSerializer
from rest_framework import viewsets
from rest_framework.decorators import action

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUserDB.objects.all()
    serializer_class = CustomUserSerializer
    
    @action(detail=False, methods=['get'], url_path='admins')
    def get_admins(self, request):
        admins = CustomUserDB.objects.filter(role=CustomUserDB.ROLE_ADMIN)
        serializer = self.get_serializer(admins, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
