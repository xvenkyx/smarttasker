from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, get_all_tasks, get_task_stats, get_user_tasks

# router = DefaultRouter()
router = DefaultRouter(trailing_slash=False)  # 🔥 no trailing slash!
router.register(r'task', TaskViewSet)  # Handles /tasks/

urlpatterns = [
    path('', include(router.urls)),                  # ⬅️ Registers POST, GET, PUT, DELETE
    path('all', get_all_tasks, name='get_all_tasks'),   # ⬅️ For dashboard
    path('stats', get_task_stats, name='get_task_stats'),
    path('my', get_user_tasks, name='get_user_tasks'),
]
