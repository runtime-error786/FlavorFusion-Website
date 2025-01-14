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
from products.views import product_list_create,product_detail,product_detail1,product_get,product_guest
from signout.views import sign_out
from deladmin.views import DeleteAdminView
from sale.views import admin_count, customer_count, category_product_qty_sum, customer_count_by_country, total_profit
from Profile.views import Show_profile,update_profile
router = DefaultRouter()
router.register(r'signup', CustomUserViewSet, basename='signup')
from django.conf import settings
from django.conf.urls.static import static
router1 = DefaultRouter()
router1.register(r'users', CustomUserViewSet)
from like.views import like_product
from carti.views import add_to_cart,cart_count_view
from carti.views import show_cart,update_cart,remove_cart_item
from checkout.views import create_checkout_session,clear_cart_items,verify_payment
from LLM.views import QueryView
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
    path('products1/<int:pk>/', product_detail1, name='product-detail'),
    path('sign_out/', sign_out, name='sign_out'),
    path('', include(router1.urls)),
    path('signup/delete-admin/<int:pk>/', DeleteAdminView.as_view(), name='delete_admin'),  # New URL pattern
    path('admincount', admin_count, name='admin-count'),
    path('customercount', customer_count, name='customer-count'),
    path('CategoryProductQtySum', category_product_qty_sum, name='category-product-qty-sum'),
    path('CustomerCountByCountry', customer_count_by_country, name='customer-count-by-country'),
    path('profit', total_profit, name='total-profit'),
    path('showprofile/', Show_profile, name='show-profile'),
    path('upprofile/', update_profile, name='update-profile'),
    path('products_get/', product_get , name='product-list-create'),
    path('like_product/', like_product, name='like_product'),
    path('addtocart/', add_to_cart, name='addtocart'),
    path('showcart/', show_cart, name='show_cart'),
    path('updatecart/', update_cart, name='update_cart'),
    path('removecart/', remove_cart_item, name='update_cart'),
    path('createcheckoutsession/', create_checkout_session, name='create-checkout-session'),
    path('cartdel/', clear_cart_items, name='checkout_webhook'),
    path('verifypay/', verify_payment, name='verify'),
    path('products_guest/', product_guest, name='guest'),
    path('cartcount/', cart_count_view, name='cart_count_view'),
    path('query/', QueryView.as_view(), name='query'),


]

