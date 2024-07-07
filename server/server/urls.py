from django.urls import path, include
from rest_framework.routers import DefaultRouter
from signup.views import CustomUserViewSet
from otp_generator.views import send_otp
from Goog_Signin.views import google_sign_in

router = DefaultRouter()
router.register(r'signup', CustomUserViewSet, basename='signup')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    # path('signup/', signup_view,name='signup'),
    path('otp/', send_otp, name='generate-otp'),
    path('', include(router.urls)),
    path('signingoogle/', google_sign_in, name='google-sign-in'),
]
