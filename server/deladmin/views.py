# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from signup.models import CustomUserDB
from server.JWT import CustomJWTAuthentication  # Replace with the actual path
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, authentication_classes, permission_classes

@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
class DeleteAdminView(APIView):
    def delete(self, request, pk):
        try:
            user = CustomUserDB.objects.get(pk=pk)
            if user.role != CustomUserDB.ROLE_ADMIN:
                return Response({"error": "User is not an admin"}, status=status.HTTP_400_BAD_REQUEST)
            user.delete()
            return Response({"success": "Admin user deleted successfully"}, status=status.HTTP_200_OK)
        except CustomUserDB.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
