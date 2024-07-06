from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import generate_otp

class OTPGeneratorView(APIView):
    def get(self, request, format=None):
        otp = generate_otp()
        return Response({'otp': otp}, status=status.HTTP_200_OK)
