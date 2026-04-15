from django.shortcuts import render




def get_main(request):
    return render(request, 'main.html')

def get_testing(request):
    return render(request, 'testing.html')