from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255, unique=True)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    category = models.CharField(max_length=255)
    picture = models.ImageField(upload_to='product_pictures/', null=True, blank=True)

    def __str__(self):
        return self.name

class Sale(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    profit = models.DecimalField(max_digits=10, decimal_places=2)