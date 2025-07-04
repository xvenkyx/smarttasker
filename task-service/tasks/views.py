from django.http import JsonResponse
from django.db.models import Q
from django.db.models import Count
from django.utils.dateparse import parse_datetime
from rest_framework import viewsets, permissions
from django.http import JsonResponse
from .models import Task
from .serializers import TaskSerializer
from tasks.kafka_producer import send_task_event

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        task = serializer.save()
        print(f"✅ New task created with ID: {task.id}")
        send_task_event('task.created', TaskSerializer(task).data)      

    def perform_update(self, serializer):
        task = serializer.save()
        send_task_event('task.updated', TaskSerializer(task).data)


def get_all_tasks(request):
    print("🔥 get_all_tasks hit")

    # Extract query params
    assigned_to = request.GET.get('assigned_to')
    status = request.GET.get('status')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    tasks = Task.objects.all()

    if assigned_to:
        tasks = tasks.filter(assigned_to=assigned_to)
    
    if status:
        tasks = tasks.filter(status=status)

    if start_date and end_date:
        try:
            tasks = tasks.filter(created_at__range=[start_date, end_date])
        except:
            pass  # Invalid format, skip filter

    task_list = list(tasks.values())
    return JsonResponse({'tasks': task_list})

def get_task_stats(request):
    total = Task.objects.count()

    by_status = Task.objects.values('status').annotate(count=Count('id'))
    by_user = Task.objects.values('assigned_to').annotate(count=Count('id'))

    return JsonResponse({
        'total_tasks': total,
        'by_status': list(by_status),
        'by_user': list(by_user),
    })

def get_user_tasks(request):
    email = request.GET.get("email")
    if not email:
        return JsonResponse({"error": "email is required"}, status=400)

    user_tasks = Task.objects.filter(assigned_to=email).values()
    return JsonResponse({"tasks": list(user_tasks)})