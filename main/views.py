from django.shortcuts import render

# Create your views here.
from django.http import Http404
from django.shortcuts import render


def index(request):
    return render(request, 'main/index.html', {})


def video(request):
    return render(request, 'main/video.html', {})


def games(request):
    return render(request, 'main/games/index.html', {})


def froggy(request):
    return render(request, 'main/games/froggy.html', {})
