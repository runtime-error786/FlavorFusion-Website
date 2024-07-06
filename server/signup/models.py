from django.db import models
from django.contrib.auth.models import AbstractUser, Group
from django.contrib.auth.hashers import make_password

class CustomUserDB(AbstractUser):
    email = models.EmailField(unique=True)  # Email as primary key
    country = models.CharField(max_length=120)
    picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    # Custom related_name to resolve clashes
    groups = models.ManyToManyField(
        Group,
        related_name='custom_users',  # Custom related_name for groups
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_users',  # Custom related_name for user_permissions
        blank=True,
        help_text='Specific permissions for this user.',
    )

    ROLE_CUSTOMER = 'customer'
    ROLE_ADMIN = 'admin'
    ROLE_CHOICES = [
        (ROLE_CUSTOMER, 'Customer'),
        (ROLE_ADMIN, 'Admin'),
    ]
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=ROLE_CUSTOMER,
        help_text='User role',
    )

    username = models.CharField(
        max_length=150,  # or as needed
        unique=False,  # Changed to False to align with your requirement
    )

    # Set email as the USERNAME_FIELD
    USERNAME_FIELD = 'email'
    # Removed email from REQUIRED_FIELDS
    REQUIRED_FIELDS = ['username', 'country']

    def __str__(self):
        return self.username

    @property
    def is_admin(self):
        return self.role == self.ROLE_ADMIN

    def save(self, *args, **kwargs):
        if not self.id:  # New user, so password needs hashing
            self.password = make_password(self.password)
        super().save(*args, **kwargs)
