from django.shortcuts import render
from rest_framework.generics import RetrieveUpdateAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Approval, UserApproval, User
from .renderers import UserJSONRenderer
from .serializers import UserSerializer, ApprovalSerializer, UserApprovalSerializer, ApprovalProcessSerializer, ApprovalProcessTemplateSerializer
from rest_framework.viewsets import ModelViewSet
from django.db.models import Q
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from .models import Approval, ApprovalProcess, ApprovalStepTemplate, ApprovalProcessTemplate
from rest_framework.generics import ListAPIView

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'username': user.username,
        })

class UsersAPIView(APIView):
    permission_classes = (AllowAny,)
    
    def get(self, request):
        users = User.objects.all()
        usernames = [user.username for user in users]
        return Response(usernames)

class CreateApprovalProcess(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        data = request.data
        approval_process_name = data.get('approval_process_name')
        approval_process = ApprovalProcess.objects.create(name=approval_process_name, creator=request.user)
        for step_data in data.get('steps', []):
            step = Approval.objects.create(
                approval_process=approval_process,
                minimum_approver=step_data.get('min_approvers'),
                order=step_data.get('order'),
                status=step_data.get('status')
            )

            for username in step_data.get('approver_list', []):
                try:
                    user = User.objects.get(username=username)
                    step.users.add(user)
                except User.DoesNotExist:
                    continue  # or handle appropriately
        approval_process_template = ApprovalProcessTemplate.objects.create(name=approval_process_name)
        for step_data in data.get('steps', []):
            step_template = ApprovalStepTemplate.objects.create(
                approval_process_template=approval_process_template,
                min_approvers=step_data.get('min_approvers'),
                order=step_data.get('order')
            )

            for username in step_data.get('approver_list', []):
                try:
                    user = User.objects.get(username=username)
                    step_template.approver_list.add(user)
                except User.DoesNotExist:
                    continue

        return Response(status=status.HTTP_201_CREATED)

class PendingApprovals(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        approvals = Approval.objects.filter(users=user)  # Get all approvals where the user is an approver.
        serializer = ApprovalSerializer(approvals, many=True)
        return Response(serializer.data)


class UpdateApprovalStatus(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        data = request.data

        # Get the required data from request
        approval_process_name = data.get('approval_process_name')
        approver_name = request.user.username  # Extracting username from the authenticated user
        approval_status = data.get('status')

        try:
            # Fetch the approval process
            approval_process = ApprovalProcess.objects.get(name=approval_process_name)
            
            # Get the specific approval step for the approver
            approval = Approval.objects.get(approval_process=approval_process, users__username=approver_name)

            # Update the UserApproval instance or create a new one
            user_approval, created = UserApproval.objects.update_or_create(
                approval=approval,
                user=request.user,
                defaults={'approved': approval_status}
            )

            # Check the count of approvals
            approved_count = approval.userapproval_set.filter(approved=True).count()

            if not approval_status:  # If the status is rejected
                if approved_count < approval.minimum_approver:
                    approval.status = "rejected"
                    approval.save()
                    return Response({"message": "Approval status set to rejected due to insufficient approvals."}, status=status.HTTP_200_OK)

            elif approved_count >= approval.minimum_approver:
                approval.status = "approved"
                approval.save()

                # Get the next approval step in the process by order
                next_approval = Approval.objects.filter(approval_process=approval_process, order=approval.order + 1).first()
                if next_approval and next_approval.status is None:
                    next_approval.status = "pending"
                    next_approval.save()

            return Response({"message": "Approval status updated successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class Logout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Simply delete the Token and return a success response
        request.auth.delete()
        return Response(status=status.HTTP_200_OK)

class TrackApprovalProcess(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        approval_processes = ApprovalProcess.objects.filter(creator=request.user)

        if not approval_processes.exists():
            return Response({"message": "No approval processes found for the current user."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ApprovalProcessSerializer(approval_processes, many=True)
        return Response(serializer.data)

class GetApprovalProcessTemplate(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, name):
        try:
            approval_process_template = ApprovalProcessTemplate.objects.get(name=name)
            serializer = ApprovalProcessTemplateSerializer(approval_process_template)
            return Response(serializer.data)
        except ApprovalProcessTemplate.DoesNotExist:
            return Response({"error": "Approval Process Template not found."}, status=status.HTTP_404_NOT_FOUND)

class ListAllApprovals(ListAPIView):
    queryset = ApprovalProcessTemplate.objects.all()
    serializer_class = ApprovalProcessTemplateSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Extracting only the 'name' field from each serialized ApprovalProcessTemplate object
        names = [process_template['name'] for process_template in serializer.data]
        
        return Response(names)

