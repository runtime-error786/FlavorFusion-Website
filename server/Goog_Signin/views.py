from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from rest_framework.decorators import api_view
import json

User = get_user_model()

@api_view(['POST'])
def google_sign_in(request):
    data = json.loads(request.body)
    print(data)
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
        )

    
    refresh = RefreshToken.for_user(user)
    return JsonResponse({'refresh': str(refresh), 'access': str(refresh.access_token)})
