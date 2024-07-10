from django.urls import path, include
from rest_framework.routers import DefaultRouter
from signup.views import CustomUserViewSet
from otp_generator.views import send_otp
from Goog_Signin.views import google_sign_in
from signin.views import sign_in
from forgot_pass.views import update_password
from Get_role.views import auth_view
from get_pic.views import get_user_image
from make_admin.views import create_admin_user
from products.views import product_list_create,product_detail
router = DefaultRouter()
router.register(r'signup', CustomUserViewSet, basename='signup')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('otp/', send_otp, name='generate-otp'),
    path('', include(router.urls)),
    path('signingoogle/', google_sign_in, name='google-sign-in'),
    path('signin/', sign_in, name='sign_in'),
    path('signinForgot/', update_password, name='update_password'),
    path('auth/', auth_view, name='auth'), # return role
    path('img/', get_user_image, name='get_user_image'),
    path('create_admin/', create_admin_user, name='create_admin_user'),
    path('products/', product_list_create, name='product-list-create'),
    path('products/<int:pk>/', product_detail, name='product-detail'),

]
