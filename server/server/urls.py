from django.urls import path, include
from rest_framework.routers import DefaultRouter
from signup.views import CustomUserViewSet
from otp_generator.views import OTPGeneratorView

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'signup', CustomUserViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
    path('generate-otp/', OTPGeneratorView.as_view(), name='generate-otp')
]
