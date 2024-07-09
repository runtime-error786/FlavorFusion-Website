from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from rest_framework.decorators import api_view
import json

User = get_user_model()

@api_view(['POST'])
def google_sign_in(request):
    data = json.loads(request.body)
    token_info = data.get('token_info')
    email = token_info.get('email')
    name = token_info.get('name')
    picture = token_info.get('picture', '')

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        user = User.objects.create_user(
            username=name,
            email=email,
            password='123',  # Default password for users signing in with Google
            picture=picture,
            role=User.ROLE_CUSTOMER  # Assuming a default role for new users
        )

    if user.role == 'admin':
        # Return an error response for admin users
        return JsonResponse({'error': 'Enter valid credentials. Admin access not allowed.'}, status=403)

    refresh = RefreshToken.for_user(user)
    response = JsonResponse({'refresh': str(refresh), 'access': str(refresh.access_token)})

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
