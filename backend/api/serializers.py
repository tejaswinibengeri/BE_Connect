from rest_framework import serializers
from .models import User, Post, Comment, Resource, Hackathon

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'password', 'branch', 'skills', 'github_link', 'bio']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'], # use email as username since we require unique email
            email=validated_data['email'],
            name=validated_data.get('name', ''),
            password=validated_data['password'],
            branch=validated_data.get('branch', ''),
            skills=validated_data.get('skills', ''),
            github_link=validated_data.get('github_link', ''),
            bio=validated_data.get('bio', '')
        )
        return user

class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.name')
    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'user_name', 'comment', 'created_at']
        read_only_fields = ['user']

class PostSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.name')
    user_skills = serializers.ReadOnlyField(source='user.skills')
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'post_type', 'user', 'user_name', 'user_skills', 'created_at', 'comments']
        read_only_fields = ['user']

class ResourceSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.ReadOnlyField(source='uploaded_by.name')

    class Meta:
        model = Resource
        fields = ['id', 'title', 'file_url', 'uploaded_by', 'uploaded_by_name', 'created_at']
        read_only_fields = ['uploaded_by']

class HackathonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hackathon
        fields = '__all__'
