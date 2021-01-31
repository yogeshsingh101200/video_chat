from knox.models import AuthToken
from .models import User
from rest_framework import viewsets, permissions
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, ContactSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [
        permissions.AllowAny
    ]

    def get_queryset(self):
        queryset = User.objects.all()
        username = self.request.query_params.get('username', None)
        if username is not None:
            queryset = User.objects.filter(username=username)
        return queryset


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


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user(request):
    return Response({
        'user': UserSerializer(request.user).data
    })


class ContactViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = ContactSerializer

    def get_queryset(self):
        return self.request.user.contacts.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
