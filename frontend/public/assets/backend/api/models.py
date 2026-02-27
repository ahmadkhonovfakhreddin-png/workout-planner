from django.db import models
from django.conf import settings

PLAN_CHOICES = [
    ('basic', 'Basic'),
    ('pro', 'Pro'),
    ('elite', 'Elite'),
]

STATUS_CHOICES = [
    ('active', 'Active'),
    ('cancelled', 'Cancelled'),
]


class Subscription(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='subscription',
    )
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    card_last4 = models.CharField(max_length=4, blank=True)
    card_expiry = models.CharField(max_length=7, blank=True)  # MM/YYYY
    phone = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'api_subscription'

    def __str__(self):
        return f"{self.user.email} – {self.get_plan_display()}"
