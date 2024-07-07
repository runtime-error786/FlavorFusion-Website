from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from django.contrib.auth.signals import user_logged_in
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from signup.models import CustomUserDB
import json

@api_view(['POST'])
def sign_in(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    user = authenticate(email=email, password=password)
    
    if user is not None:
        # If the user exists and password matches
        update_last_login(None, user)  # Update the last login time
        refresh = RefreshToken.for_user(user)
        
        response = Response({
            'user': {
                'email': user.email,
                'role': user.role
            },
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }, status=status.HTTP_200_OK)

        # Ensure the cookie is set correctly
        response.set_cookie(
            'access', 
            str(refresh.access_token), 
            httponly=True, 
            secure=False,  # Change to True in production
            samesite='Lax'
        )
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Credentials"] = "true"
        response["Access-Control-Allow-Headers"] = "content-type"
        
        return response
    else:
        # If the user does not exist or password does not match
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)
