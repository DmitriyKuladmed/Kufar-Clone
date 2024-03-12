from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.contrib.auth.hashers import make_password


class UserAccountManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, phone, password=None):
        email = self.normalize_email(email)
        email = email.lower()

        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
            phone=phone
        )

        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, first_name, last_name, email, phone, password=None):
        user = self.create_user(
            email,
            first_name,
            last_name,
            phone,
            password=password
        )

        user.is_staff = True
        user.is_superuser = True
        user.save()

        return user


class User(AbstractBaseUser, PermissionsMixin):
    id = models.BigAutoField(primary_key=True)
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone']

    def get_full_name(self):
        return self.first_name

    def __str__(self):
        return self.email


class Category(models.Model):
    name = models.CharField(max_length=150, primary_key=True)

    def __str__(self):
        return self.name


class Announcement(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=100)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    city = models.CharField(max_length=60)
    description = models.CharField(max_length=500)
    price = models.IntegerField(default=0)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    publication_date = models.DateField(auto_now_add=True)
    photo = models.ImageField(verbose_name='Изображение', upload_to='postads/', default='postads/default.jpg')

    def __str__(self):
        return self.title
