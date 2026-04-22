from django.shortcuts import render
from django.http import JsonResponse
from .models import Question



def get_main(request):
    return render(request, 'main.html')

def get_testing(request):
    questions = Question.objects.all().order_by('card_number')
    return render(request, 'testing.html', {'questions': questions})


def check_answer(request):
    if request.method == 'POST':
        import json
        data = json.loads(request.body)
        question_id = data.get('question_id')
        answer = data.get('answer')  # 'A', 'B' или 'C'
        
        question = Question.objects.get(id=question_id)
        is_correct = question.correct == answer
        
        return JsonResponse({
            'correct': is_correct,
            'explanation': question.explanation
        })