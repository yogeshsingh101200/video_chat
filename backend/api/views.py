from knox.models import AuthToken
from .models import User
from rest_framework import viewsets, permissions, generics
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [
        permissions.AllowAny
    ]


@api_view(['POST'])
def RegisterAPI(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return Response({
        'user': UserSerializer(user).data,
        'token': AuthToken.objects.create(user)[1]
    })


@api_view(['POST'])
def LoginAPI(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return Response({
        'user': UserSerializer(user).data,
        'token': AuthToken.objects.create(user)[1]
    })
