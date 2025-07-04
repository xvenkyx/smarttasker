
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    # task_service/urls.py
    path('tasks/', include('tasks.urls'))
]
