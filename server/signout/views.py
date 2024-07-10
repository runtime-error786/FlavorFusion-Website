from django.http import JsonResponse
from rest_framework.decorators import api_view

@api_view(['POST'])
def sign_out(request):
    response = JsonResponse({"message": "Sign out successful"})
    response.delete_cookie('access')  # Delete the 'access' cookie
    return response