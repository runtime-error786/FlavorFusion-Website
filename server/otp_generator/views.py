# views.py
import random
import string
from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
@api_view(['POST'])
def send_otp(request):
    email = request.data.get('email')
    print(email)
    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    otp = ''.join(random.choices(string.digits, k=4))

    
    subject = 'Your OTP Code'
    message = f'Your OTP code is {otp}'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]
    print(from_email)
    try:
        print("hello")
        send_mail(subject, message, from_email, recipient_list)
        print("hello1")
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({"otp": otp}, status=status.HTTP_200_OK)

