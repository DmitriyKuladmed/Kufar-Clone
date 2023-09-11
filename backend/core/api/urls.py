from rest_framework.routers import DefaultRouter
from kufar.api.urls import base_router
from django.urls import include, path

import kufar.api

router = DefaultRouter()
router.registry.extend(base_router.registry)

urlpatterns = [
    path('', include(router.urls)),
    path('users/', include(kufar.api.urls))
]
