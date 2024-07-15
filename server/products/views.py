from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from .models import Product
from .serializer import ProductSerializer
from server.JWT import CustomJWTAuthentication  # Replace with the actual path
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from like.views import Like
class ProductPagination(PageNumberPagination):
    page_size = 10  # Number of records per page
    page_size_query_param = 'page_size'
    max_page_size = 100  # Maximum records per page

@api_view(['GET', 'POST'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def product_list_create(request):
    if request.method == 'GET':
        sort = request.query_params.get('sort', 'true').lower()
        queryset = Product.objects.all()
        
        # Apply name filtering if provided in query params
        name_param = request.query_params.get('search')
        if name_param:
            queryset = queryset.filter(name__icontains=name_param)
        
        # Apply sorting based on sort parameter
        if sort == 'true':
            queryset = queryset.order_by('name')
        else:
            queryset = queryset.order_by('-name')
        
        # Count total products before pagination
        total_products = queryset.count()
        
        # Pagination
        paginator = ProductPagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = ProductSerializer(page, many=True)
            total_pages = (total_products + paginator.page_size - 1) // paginator.page_size
            return paginator.get_paginated_response({
                'data': serializer.data,
                'total_pages': total_pages,
                'total_products': total_products
            })

        serializer = ProductSerializer(queryset, many=True)
        return Response({
            'data': serializer.data,
            'total_pages': 1,  # If no pagination, there is only one page
            'total_products': total_products
        }, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        product_name = request.data.get('name')
        if Product.objects.filter(name__iexact=product_name).exists():
            return Response({'error': 'Product already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    elif request.method == 'PUT':
        print("PUT request data:", request.data)  # Debugging output

        serializer = ProductSerializer(product, data=request.data)
        
        if serializer.is_valid():
            print("entry in put")
            serializer.save()
            return Response(serializer.data)
        print("Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def product_get(request):
    if request.method == 'GET':
        sort = request.query_params.get('sort', 'true').lower()
        category_param = request.query_params.get('Category', None)
        name_param = request.query_params.get('search', None)
        
        queryset = Product.objects.all()
        
        # Apply name filtering if provided in query params
        if name_param:
            queryset = queryset.filter(name__icontains=name_param)
        
        # Apply category filtering if provided in query params and not 'all'
        if category_param and category_param.lower() != 'all':
            queryset = queryset.filter(category__icontains=category_param)
        
        # Apply sorting based on sort parameter
        if sort == 'true':
            queryset = queryset.order_by('price')
        else:
            queryset = queryset.order_by('-price')
        
        # Count total products before pagination
        total_products = queryset.count()
        
        # Pagination
        paginator = ProductPagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = ProductSerializer(page, many=True)
            product_data = serializer.data

            # Check if each product is liked by the user
            for product in product_data:
                product_id = product['id']
                is_liked = Like.objects.filter(user=request.user, product_id=product_id).exists()
                product['like'] = is_liked

            total_pages = (total_products + paginator.page_size - 1) // paginator.page_size
            return paginator.get_paginated_response({
                'data': product_data,
                'total_pages': total_pages,
                'total_products': total_products
            })

        serializer = ProductSerializer(queryset, many=True)
        product_data = serializer.data

        # Check if each product is liked by the user
        for product in product_data:
            product_id = product['id']
            is_liked = Like.objects.filter(user=request.user, product_id=product_id).exists()
            product['like'] = is_liked

        return Response({
            'data': product_data,
            'total_pages': 1,  # If no pagination, there is only one page
            'total_products': total_products
        }, status=status.HTTP_200_OK)