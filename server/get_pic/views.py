from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from signup.models import CustomUserDB
from server.JWT import CustomJWTAuthentication  # Replace with the actual path
import base64

@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def get_user_image(request):
    try:
        user = request.user
        user = get_object_or_404(CustomUserDB, id=user.id)
        print(user)
        if user.picture:
            if 'googleusercontent.com' in user.picture.url:
                # If image is from Google Cloud, return the image URL directly
                image_url = str(user.picture)  # Convert ImageFieldFile to string (URL)
                return JsonResponse({'image_url': image_url})
            else:
                # Read the local image file and encode it as base64
                with open(user.picture.path, 'rb') as image_file:
                    image_data = base64.b64encode(image_file.read()).decode('utf-8')
                return JsonResponse({'image_data': image_data})
        else:
            return JsonResponse({'error': 'User does not have a profile picture'}, status=404)
    
    except Exception as e:
        print(f"Error fetching user image: {str(e)}")
        return JsonResponse({'error': 'Failed to fetch user image'}, status=500)