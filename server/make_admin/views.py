from django.core.mail import send_mail
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from signup.models import CustomUserDB
from signup.serializers import CustomUserSerializer
from django.conf import settings
import logging
from server.JWT import CustomJWTAuthentication  # Replace with the actual path
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, authentication_classes, permission_classes

# Configure logging
logger = logging.getLogger(__name__)
@api_view(['POST'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def create_admin_user(request):
    if request.method == 'POST':
        data = request.data  # Make a copy to modify it safely
        
        # Extract the picture file from request.FILES if present
        picture_file = request.FILES.get('picture')
        logger.info(f'Picture file received: {picture_file}')
        
        # Create a serializer instance with the modified data
        serializer = CustomUserSerializer(data=data)
        logger.info(f'Serializer instance created: {serializer}')
        
        if serializer.is_valid():
            # Save the validated data (create the user)
            user = serializer.save()

            # If picture file exists, save it to user instance
            if picture_file:
                user.picture = picture_file
                user.save()

            # Send email with credentials to the registered user
            send_credentials_to_user(user.email, user.username, data['password'])

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        logger.error(f'Serializer errors: {serializer.errors}')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

def send_credentials_to_user(email, username, password):
    subject = 'Your Admin Credentials'
    message = f'Hello {username},\n\nYou have been registered as an admin user.\nUsername: {username}\nPassword: {password}\n\nPlease keep your credentials secure.'
    from_email = settings.EMAIL_HOST_USER  # Use the configured email user
    try:
        send_mail(subject, message, from_email, [email])
        logger.info(f'Email sent successfully to {email}')
        print("email is send",subject,message,from_email,email)
    except Exception as e:
        logger.error(f'Error sending email: {e}')
        print("email is not send")
