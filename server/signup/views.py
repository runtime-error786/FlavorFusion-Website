from rest_framework import status
from rest_framework.response import Response
from .models import CustomUserDB
from .serializers import CustomUserSerializer
from rest_framework import viewsets
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.pagination import PageNumberPagination

class CustomUserPagination(PageNumberPagination):
    page_size = 2  # Number of records per page
    page_size_query_param = 'page_size'
    max_page_size = 100  # Maximum records per page

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUserDB.objects.all()
    serializer_class = CustomUserSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['username']
    ordering_fields = ['username']
    pagination_class = CustomUserPagination  # Enable pagination

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
        
        # Count total users before pagination
        total_users = queryset.count()
        
        # Pagination handled automatically by pagination_class
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            # Calculate total pages based on total users and page size
            total_pages = (total_users + self.pagination_class.page_size - 1) // self.pagination_class.page_size
            return Response({
                'data': serializer.data,
                'total_pages': total_pages,
                'total_users': total_users
            }, status=status.HTTP_200_OK)

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'data': serializer.data,
            'total_pages': 1,  # If no pagination, there is only one page
            'total_users': total_users
        }, status=status.HTTP_200_OK)
