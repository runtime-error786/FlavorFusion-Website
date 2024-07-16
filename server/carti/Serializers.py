from rest_framework import serializers
from .models import CartItems
from products.models import Product

class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', read_only=True, max_digits=10, decimal_places=2)
    original_qty = serializers.IntegerField(source='product.quantity', read_only=True)

    class Meta:
        model = CartItems
        fields = ['id', 'product_id', 'product_name', 'product_price', 'cart_qty', 'original_qty']

