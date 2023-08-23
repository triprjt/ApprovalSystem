from django.urls import path
from . import views

urlpatterns = [
    path('api/v1/pending-approvals/', views.PendingApprovals.as_view(), name="pending_approvals"),
    path('api/v1/logout/', views.Logout.as_view(), name="logout"),
    path('api/v1/all-users/', views.UsersAPIView.as_view(), name='get-users'),
    path('api/v1/api-token-auth/', views.CustomAuthToken.as_view(), name='api_token_auth'),
    path('api/v1/create-approval-process/', views.CreateApprovalProcess.as_view(), name='approval-process'),
    path('api/v1/update-status/', views.UpdateApprovalStatus.as_view(), name='update-status'),
    path('api/v1/track-approval-process/', views.TrackApprovalProcess.as_view(), name="track_approval_process"),
    path('api/v1/approval-process-template/<str:name>/', views.GetApprovalProcessTemplate.as_view(), name="get_approval_process_template"),
    path('api/v1/all-approval-process/',views.ListAllApprovals.as_view(), name= "List_all_approval_processes" )
]

