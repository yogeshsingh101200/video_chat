from django.db import models
from django.db.models import fields
from .models import User, Contact
from rest_framework import serializers
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validate_data):
        return User.objects.create_user(**validate_data)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField()

    def create(self, validated_data):
        return User.objects.get(username=validated_data["username"])

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return data
        raise serializers.ValidationError('Incorrect Credentials!')


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'
        read_only_fields = ['owner']
