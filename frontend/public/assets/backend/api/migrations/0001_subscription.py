# Generated migration for Subscription model

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Subscription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('plan', models.CharField(choices=[('basic', 'Basic'), ('pro', 'Pro'), ('elite', 'Elite')], max_length=20)),
                ('status', models.CharField(choices=[('active', 'Active'), ('cancelled', 'Cancelled')], default='active', max_length=20)),
                ('card_last4', models.CharField(blank=True, max_length=4)),
                ('card_expiry', models.CharField(blank=True, max_length=7)),
                ('phone', models.CharField(blank=True, max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='subscription', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'api_subscription',
            },
        ),
    ]
