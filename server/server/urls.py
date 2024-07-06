from django.urls import path, include
from rest_framework.routers import DefaultRouter
from signup.views import signup_view
from otp_generator.views import send_otp

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('signup/', signup_view,name='signup'),
    path('otp/', send_otp, name='generate-otp')
]
