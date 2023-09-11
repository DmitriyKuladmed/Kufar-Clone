from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
import kufar.views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.api.urls')),
    path('add-image/', kufar.views.AnnouncementImageUpload.as_view()),
    path('filtered_advertisements/', kufar.views.FilteredAnnouncementList.as_view(), name='filtered_advertisements'),
    path('search_by_title/', kufar.views.SearchByTitleView.as_view(), name='search_by_title'),
    path('user_announcements/', kufar.views.UserAnnouncementsListView.as_view(), name='user_announcements'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify')
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 