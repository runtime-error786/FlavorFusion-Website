from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

class CustomJWTAuthentication(JWTAuthentication):
    def get_validated_token(self, request):
        # Retrieve the JWT token from the 'access' cookie
        access_token = request.COOKIES.get('access')

        if not access_token:
            raise AuthenticationFailed('Authentication credentials were not provided.')

        try:
            # Validate the JWT token
            return super().get_validated_token(access_token)

        except Exception as e:
            raise AuthenticationFailed('Invalid token.')

    def authenticate(self, request):
        validated_token = self.get_validated_token(request)
        user = self.get_user(validated_token)
        return (user, validated_token)
