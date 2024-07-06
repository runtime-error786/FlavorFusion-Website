from rest_framework.decorators import api_view
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUserDB
from .serializers import CustomUserSerializer

@api_view(['POST'])
def signup_view(request):
    print("Received signup request")  # Debugging print statement
    parser_classes = (MultiPartParser, FormParser)
    data = request.data
    serializer = CustomUserSerializer(data=data)

    if serializer.is_valid():
        print("Serializer is valid")  # Debugging print statement
        serializer.save()
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    else:
        print("Serializer errors:", serializer.errors)  # Debugging print statement
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
