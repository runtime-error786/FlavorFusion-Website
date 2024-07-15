from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Like
from products.models import Product
from .Serializers import LikeSerializer
from server.JWT import CustomJWTAuthentication
from rest_framework.permissions import IsAuthenticated

@api_view(['POST'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def like_product(request):
    user = request.user
    product_id = request.data.get('productId')
    print("startttt", user, product_id)
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        like = Like.objects.get(user=user, product=product)
        like.delete()
        return Response({'message': 'Product unliked successfully'}, status=status.HTTP_200_OK)
    except Like.DoesNotExist:
        Like.objects.create(user=user, product=product)
        return Response({'message': 'Product liked successfully'}, status=status.HTTP_201_CREATED)
