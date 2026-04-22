from django.contrib import admin
from .models import Question

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    # колонки которые видны в списке
    list_display = ['card_number', 'topic', 'correct']
    # поиск по этим полям
    search_fields = ['topic', 'text']
    # фильтр сбоку
    list_filter = ['correct']
    # сортировка по умолчанию
    ordering = ['card_number']