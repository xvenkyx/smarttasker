from rest_framework import viewsets, permissions
from .models import Task
from .serializers import TaskSerializer
from tasks.kafka_producer import send_task_event

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        task = serializer.save()
        send_task_event('task.created', TaskSerializer(task).data)

    def perform_update(self, serializer):
        task = serializer.save()
        send_task_event('task.updated', TaskSerializer(task).data)
