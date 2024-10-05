# project_name/urls.py

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    # Include app-specific URLs
    path('', include('app_name.urls')),  # Replace 'app_name' with your actual app name
]