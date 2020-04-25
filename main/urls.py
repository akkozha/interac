from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('video/', views.video, name='video'),
    path('games/', views.games, name='games'),
    path('game/froggy/', views.froggy, name='froggy'),
    path('game/computer/', views.computer, name='computer'),
    path('game/computer_two/', views.computer_two, name='computer_two'),
    path('contact/', views.contact, name='contact'),
]