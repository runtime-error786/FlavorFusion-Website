from django.contrib.auth import get_user_model
from django.db import models
from products.models import Product  # Import Product model if defined in a separate file

User = get_user_model()

class CartItems(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)  # Ensure this matches your Product model
    cart_qty = models.IntegerField(default=0)

    class Meta:
        unique_together = ('user', 'product')  # Ensure this matches your intended unique constraint

    def __str__(self):
        return f"Cart item for {self.user.username}: {self.product.name}"
