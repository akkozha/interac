from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'quiz/index.html', {})

def quiz(request, num=1):
    return render(request, 'quiz/quiz-{}.html'.format(num), {})
