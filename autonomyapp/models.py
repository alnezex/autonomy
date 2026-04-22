from django.db import models

class Question(models.Model):
    card_number = models.IntegerField()
    topic = models.CharField(max_length=100)
    text = models.TextField()
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    correct = models.CharField(max_length=1)  # 'A', 'B' или 'C'
    explanation = models.TextField()

    def __str__(self):
        return f"#{self.card_number} {self.topic}"