from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from .models import CartItems
from server.JWT import CustomJWTAuthentication
from rest_framework.permissions import IsAuthenticated
from products.models import Product
from .Serializers import CartItemSerializer
from rest_framework import status  # Import status module

@api_view(['POST'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    user = request.user
    product_id = request.data.get('productId')
    cart_qty = int(request.data.get('quantity', 0))

    # Get the product object
    product = get_object_or_404(Product, id=product_id)

    # Check if the requested quantity is less than or equal to product quantity
    if cart_qty > product.quantity:
        return Response({'error': 'Requested quantity exceeds available stock'}, status=400)

    # Check if the item already exists in the cart
    cart_item, created = CartItems.objects.get_or_create(user=user, product_id=product_id)

    # If item exists, update the quantity; otherwise, create a new entry
    if not created:
        # Check if adding more would exceed the available stock
        if cart_qty > product.quantity:
            return Response({'error': 'Requested quantity exceeds available stock'}, status=400)
        cart_item.cart_qty = cart_qty
    else:
        cart_item.cart_qty = cart_qty

    # Save the cart item
    cart_item.save()

    return Response({'message': 'Cart updated successfully'})

@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def show_cart(request):
    user = request.user
    cart_items = CartItems.objects.filter(user=user)

    # Serialize the cart items
    serializer = CartItemSerializer(cart_items, many=True)

    # Calculate the total price
    total_price = sum(item.product.price * item.cart_qty for item in cart_items)

    return Response({
        'cartItems': serializer.data,
        'totalPrice': total_price
    })
    


from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from .models import CartItems
from server.JWT import CustomJWTAuthentication
from rest_framework.permissions import IsAuthenticated
from products.models import Product

@api_view(['PUT'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def update_cart(request):
    print(request.data)  # Print request data for debugging
    user = request.user
    product_id = request.data.get('productId')
    cart_qty = int(request.data.get('qty', 0))  # 'qty' should match the key used in your frontend
    print(user,product_id,cart_qty)
    # Get the cart item object if it exists
    cart_item = get_object_or_404(CartItems, user=user, product_id=product_id)

    # Get the product object
    product = cart_item.product

    # Check if the requested quantity is less than or equal to product quantity
    if cart_qty > product.quantity:
        return Response({'error': 'Requested quantity exceeds available stock'}, status=400)

    # Update the cart quantity
    cart_item.cart_qty = cart_qty
    cart_item.save()

    return Response({'message': 'Cart item updated successfully'})

@api_view(['DELETE'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def remove_cart_item(request):
    user = request.user
    product_id = request.data.get('productId')
    print(user,product_id)
    # Get the cart item object if it exists
    cart_item = get_object_or_404(CartItems, user=user, product_id=product_id)

    # Delete the cart item
    cart_item.delete()

    return Response({'message': 'Cart item removed successfully'})