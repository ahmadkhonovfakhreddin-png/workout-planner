from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health),
    path('csrf/', views.csrf),
    path('services/', views.ServiceList.as_view()),
    path('contact/', views.ContactCreate.as_view()),
    path('auth/signup/', views.SignupView.as_view()),
    path('auth/login/', views.LoginView.as_view()),
    path('auth/password-reset/', views.PasswordResetView.as_view()),
    path('auth/logout/', views.LogoutView.as_view()),
    path('auth/me/', views.MeView.as_view()),
    path('subscriptions/', views.SubscriptionCreate.as_view()),
    path('checkout/', views.CheckoutView.as_view()),
]
