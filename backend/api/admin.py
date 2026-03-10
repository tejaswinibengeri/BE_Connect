from django.contrib import admin
from .models import User, Post, Comment, Resource, Hackathon

admin.site.register(User)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Resource)
admin.site.register(Hackathon)
