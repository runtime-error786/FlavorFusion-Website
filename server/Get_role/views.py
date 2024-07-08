from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import AccessToken
from django.conf import settings
from signup.models import CustomUserDB

@api_view(['GET'])
def auth_view(request):
    try:
        # Get the token from cookies
        token = request.COOKIES.get('access')

        if not token:
            return JsonResponse({"error": "Token not provided"}, status=400)

        # Decode the token
        access_token = AccessToken(token)
        user_id = access_token['user_id']
        print(user_id)
        # Get the user and their role
        user = CustomUserDB.objects.get(id=user_id)
        role = user.role
        print(role)
        return JsonResponse({"role": role}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
