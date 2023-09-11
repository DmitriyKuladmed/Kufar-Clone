from django.contrib import admin
from .models import User, Announcement, Category

admin.site.register(User)
admin.site.register(Announcement)
admin.site.register(Category)
