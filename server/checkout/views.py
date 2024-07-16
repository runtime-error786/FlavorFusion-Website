from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from server.JWT import CustomJWTAuthentication  # Replace with the actual path to your JWT authentication
import stripe
from carti.models import CartItems  # Import your CartItem model from your app
from django.shortcuts import get_object_or_404

stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(['POST'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    try:
        user = request.user
        # Fetch items from the cart that are not yet purchased
        cart_items = CartItems.objects.filter(user=user)
        print("User:", user)  # For debugging
        print("cart_item",cart_items)
        # Prepare line items for Stripe checkout session
        line_items = []
        for cart_item in cart_items:
            # print("Cart Item:", cart_item.product.image_url)  # Debug statement
            line_item = {
                'price_data': {
                    'currency': 'usd',  # Replace with your currency
                    'unit_amount': int(cart_item.product.price * 100),  # Stripe requires amount in cents
                    'product_data': {
                        'name': cart_item.product.name
                    },
                },
                'quantity': cart_item.cart_qty,  # Quantity of this product in the checkout session
            }
            line_items.append(line_item)
        print(line_items)
        # Create Stripe checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url=settings.SITE_URL + '/customer/cart/?success=true&session_id={CHECKOUT_SESSION_ID}',
            cancel_url=settings.SITE_URL + '/customer/cart',
        )

        return Response({'sessionId': checkout_session.id}, status=status.HTTP_200_OK)

    except stripe.error.StripeError as e:
        # Since this is a Stripe-specific error, handle it separately
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    except Exception as e:
        # Handle any other unexpected exceptions
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@authentication_classes([CustomJWTAuthentication])  # Replace with your actual JWT authentication class
@permission_classes([IsAuthenticated])
def clear_cart_items(request):
    try:
        print("webhook api call---------------------------------------------------- ")
        user = request.user
        # Delete all cart items for the authenticated user
        CartItems.objects.filter(user=user).delete()

        return Response({'message': 'Cart items deleted successfully'}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    


@api_view(['POST'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    try:
        print("run veri fy pay")
        session_id = request.data.get('sessionId')
        print("sesss",session_id)
        session = stripe.checkout.Session.retrieve(session_id)

        if session.payment_status == 'paid':
            return Response({'payment_status': 'succeeded'}, status=status.HTTP_200_OK)
        else:
            return Response({'payment_status': session.payment_status}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
