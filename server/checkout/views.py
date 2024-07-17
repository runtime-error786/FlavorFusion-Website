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
from django.core.mail import send_mail
from signup.models import CustomUserDB
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
        user = request.user
        cart_items = CartItems.objects.filter(user=user)
        
        if not cart_items.exists():
            return Response({'message': 'No items in the cart to clear'}, status=status.HTTP_200_OK)

        # Calculate grand total
        grand_total = sum(item.cart_qty * item.product.price for item in cart_items)

        # Email content
        email_subject = 'Your Purchase Bill'
        email_body = (
            f"Hello {user.username},\n\n"
            f"Here is the total amount for your purchase:\n\n"
            f"Grand Total: ${grand_total:.2f}\n\n"
            "Thank you for your purchase!\n\n"
            "Best wishes,\n"
            "[Flavour Fusion]"
        )

        # Send email
        send_mail(
            email_subject,
            email_body,
            'mustafa782a@gmail.com',  # Replace with your actual sender email
            [user.email],
            fail_silently=False,
        )

        # Dictionary to store notifications for each user
        notifications = {}
        # Set to store all products with shortages
        shortage_products = set()

        # Notify other users whose cart quantities exceed the available product quantities
        for item in cart_items:
            product = item.product
            product.quantity -= item.cart_qty
            product.save()

            # Check other users' cart items for this product
            other_cart_items = CartItems.objects.filter(product=product).exclude(user=user)
            for other_item in other_cart_items:
                if other_item.cart_qty > product.quantity:
                    if other_item.user.email not in notifications:
                        notifications[other_item.user.email] = []
                    notifications[other_item.user.email].append(product.name)
                    shortage_products.add(product.name)

        # Send notification emails to users
        for email, products in notifications.items():
            notify_user(email, products)

        # Notify all admins about the shortage
        if shortage_products:
            notify_admins(shortage_products)

        # Clear cart items
        cart_items.delete()

        return Response({'message': 'Cart items deleted successfully, email sent, and product quantities updated'}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def notify_user(email, products):
    product_list = "\n".join(products)
    email_subject = 'Product Quantity Update'
    email_body = (
        f"Hello,\n\n"
        f"The quantities of the following products in your cart exceed the available stock:\n\n"
        f"{product_list}\n\n"
        "Please review your cart and make necessary adjustments.\n\n"
        "Best regards,\n"
        "[Flavour Fusion]"
    )

    # Send email
    send_mail(
        email_subject,
        email_body,
        'mustafa782a@gmail.com',  # Replace with your actual sender email
        [email],
        fail_silently=False,
    )

def notify_admins(shortage_products):
    admin_emails = CustomUserDB.objects.filter(role=CustomUserDB.ROLE_ADMIN).values_list('email', flat=True)
    product_list = "\n".join(shortage_products)
    email_subject = 'Product Shortage Alert'
    email_body = (
        f"Hello Admin,\n\n"
        f"The following products have shortages:\n\n"
        f"{product_list}\n\n"
        "Please take necessary actions to restock these items.\n\n"
        "Best regards,\n"
        "[Flavour Fusion]"
    )

    # Send email to all admins
    send_mail(
        email_subject,
        email_body,
        'mustafa782a@gmail.com',  # Replace with your actual sender email
        admin_emails,
        fail_silently=False,
    )
    
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
