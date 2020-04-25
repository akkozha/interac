from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('video/', views.video, name='video'),
    path('games/', views.games, name='games'),
    path('game/froggy/', views.froggy, name='froggy'),
    path('contact/', views.contact, name='contact'),
]