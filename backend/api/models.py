from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # Extending default user
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    branch = models.CharField(max_length=100, blank=True, null=True)
    skills = models.TextField(blank=True, null=True)
    github_link = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']

    def __str__(self):
        return self.email

class Post(models.Model):
    POST_TYPES = (
        ('project', 'Project Collaboration'),
        ('discussion', 'Discussion Forum'),
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    post_type = models.CharField(max_length=20, choices=POST_TYPES, default='project')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.name} on {self.post.title}"

class Resource(models.Model):
    title = models.CharField(max_length=255)
    file_url = models.CharField(max_length=1000) # Could be URL, Drive link, etc.
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resources')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Hackathon(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField()
    link = models.URLField(max_length=1000)

    def __str__(self):
        return self.title
