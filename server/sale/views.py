from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from signup.models import CustomUserDB
from products.models import Product, Sale
from server.JWT import CustomJWTAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count

@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def admin_count(request):
    admin_count = CustomUserDB.objects.filter(role=CustomUserDB.ROLE_ADMIN).count()
    return Response({'adminCount': admin_count}, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def customer_count(request):
    customer_count = CustomUserDB.objects.filter(role=CustomUserDB.ROLE_CUSTOMER).count()
    return Response({'customerCount': customer_count}, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def category_product_qty_sum(request):
    categories = Product.objects.values('category').annotate(productQtySum=Sum('quantity'))
    return Response(categories, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def customer_count_by_country(request):
    customers = CustomUserDB.objects.filter(role=CustomUserDB.ROLE_CUSTOMER).values('country').annotate(customerCount=Count('id')).order_by('-customerCount')
    return Response(customers, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def total_profit(request):
    total_profit = Sale.objects.aggregate(totalProfit=Sum('profit'))['totalProfit']
    return Response({'totalProfit': total_profit}, status=status.HTTP_200_OK)
