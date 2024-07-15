from rest_framework import serializers
from .models import Product,Sale
import base64

class ProductSerializer(serializers.ModelSerializer):
    picture_base64 = serializers.SerializerMethodField()

    def get_picture_base64(self, product):
        if product.picture:
            with open(product.picture.path, 'rb') as image_file:
                return base64.b64encode(image_file.read()).decode('utf-8')
        return None

    class Meta:
        model = Product
        fields = ['id', 'name', 'quantity', 'price', 'description', 'category', 'picture', 'picture_base64']

    
        
class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = '__all__'