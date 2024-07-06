# serializers.py
from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # Make password write-only

    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'country', 'password', 'picture','role']  # Include 'password' field in serializer

    def create(self, validated_data):
        print("serializer run")
        password = validated_data.pop('password')  # Remove password from validated_data
        user = CustomUser.objects.create(**validated_data)  # Create user object
        user.set_password(password)  # Set password using set_password method
        user.save()  # Save user object
        return user
