from rest_framework import serializers
from .models import CustomUserDB
import re

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # Make password write-only

    class Meta:
        model = CustomUserDB
        fields = ['email', 'username', 'country', 'password', 'picture', 'role']  # Include 'password' field in serializer

        extra_kwargs = {
            'username': {'validators': []},  # Clear default validators
        }

    def validate_username(self, value):
        # Validate username format (letters, numbers, and spaces only)
        if not re.match(r'^[a-zA-Z0-9\s]+$', value):
            raise serializers.ValidationError("Username can only contain letters, numbers, and spaces.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUserDB.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user
