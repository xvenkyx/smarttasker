from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=[('todo', 'To Do'), ('in_progress', 'In Progress'), ('done', 'Done')],
        default='todo'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    assigned_to = models.CharField(max_length=100, blank=True)  # Could be user ID or name

    def __str__(self):
        return self.title
