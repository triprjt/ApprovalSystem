from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin
)
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=255, unique=True, null=False)  # Ensure it's not nullable

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []


class ApprovalProcess(models.Model):
    name = models.CharField(max_length=255, unique=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_approvals")
    
class Approval(models.Model):
    approval_process = models.ForeignKey(ApprovalProcess, related_name='steps', on_delete=models.CASCADE)
    users = models.ManyToManyField(User, related_name='approval_steps')
    minimum_approver = models.PositiveIntegerField(null=True, blank=True)
    order = models.PositiveIntegerField()
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        (None, "Null"),
    )
    status = models.CharField(max_length=8, choices=STATUS_CHOICES, default="pending", null=True, blank=True)


class UserApproval(models.Model):
    approval = models.ForeignKey("Approval", on_delete=models.CASCADE)
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    approved = models.BooleanField(default=False)

class ApprovalProcessTemplate(models.Model):
    name = models.CharField(max_length=255, unique=True)

class ApprovalStepTemplate(models.Model):
    approval_process_template = models.ForeignKey(ApprovalProcessTemplate, related_name='steps', on_delete=models.CASCADE)
    min_approvers = models.PositiveIntegerField()
    order = models.PositiveIntegerField()
    approver_list = models.ManyToManyField(User)
