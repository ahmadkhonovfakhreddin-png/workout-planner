from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health),
    path('services/', views.ServiceList.as_view()),
    path('contact/', views.ContactCreate.as_view()),
]
