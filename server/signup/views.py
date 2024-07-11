from rest_framework import status
from rest_framework.response import Response
from .models import CustomUserDB
from .serializers import CustomUserSerializer
from rest_framework import viewsets
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUserDB.objects.all()
    serializer_class = CustomUserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['username']

    @action(detail=False, methods=['get'], url_path='admins')
    def get_admins(self, request):
        sort = request.query_params.get('sort', 'true').lower()
        queryset = CustomUserDB.objects.filter(role=CustomUserDB.ROLE_ADMIN)
        
        # Apply username filtering if provided in query params
        username_param = request.query_params.get('search')
        if username_param:
            queryset = queryset.filter(username__icontains=username_param)
        
        # Apply sorting based on sort parameter
        if sort == 'true':
            queryset = queryset.order_by('username')
        else:
            queryset = queryset.order_by('-username')
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
