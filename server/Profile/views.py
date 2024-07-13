from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from signup.models import CustomUserDB
from signup.serializers import CustomUserSerializer
from server.JWT import CustomJWTAuthentication  # Replace with the actual path
import base64

@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def Show_profile(request):
    try:
        user = request.user
        user = get_object_or_404(CustomUserDB, id=user.id)
        serializer = CustomUserSerializer(user)
        
        # Handle the profile picture
        profile_data = serializer.data
        if user.picture:
            if 'googleusercontent.com' in user.picture.url:
                # If image is from Google Cloud, return the image URL directly
                profile_data['picture'] = user.picture.url
            else:
                # Read the local image file and encode it as base64
                with open(user.picture.path, 'rb') as image_file:
                    image_data = base64.b64encode(image_file.read()).decode('utf-8')
                profile_data['picture'] = image_data
        else:
            profile_data['picture'] = None

        return JsonResponse({'profile': profile_data}, status=200)
    except Exception as e:
        print(f"Error fetching user profile: {str(e)}")
        return JsonResponse({'error': 'Failed to fetch user profile'}, status=500)

@api_view(['PUT'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    serializer = CustomUserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    print("Validation errors:", serializer.errors)  # Print the validation errors
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
