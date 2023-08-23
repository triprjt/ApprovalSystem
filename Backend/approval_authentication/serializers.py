from rest_framework import serializers
from .models import User, Approval, UserApproval, ApprovalProcess, ApprovalProcessTemplate, ApprovalStepTemplate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']  # Only include the 'username' field

class ApprovalSerializer(serializers.ModelSerializer):
    users = serializers.StringRelatedField(many=True, read_only=True)  # This will display usernames
    approval_process_name = serializers.CharField(source='approval_process.name', read_only=True)
    creator_name = serializers.CharField(source='approval_process.creator.username', read_only=True)
    pending_with = serializers.SerializerMethodField()

    class Meta:
        model = Approval
        fields = '__all__'  # Now this will include 'approval_process_name' and 'creator_name' in your serialized data
    def get_pending_with(self, obj):
        if obj.status == "pending":
            # Get the UserApproval objects for the current Approval object where approved is False.
            unapproved_users = UserApproval.objects.filter(approval=obj, approved=False)
            # Fetch the usernames of these unapproved users.
            return [user_approval.user.username for user_approval in unapproved_users]
        return []



class ApprovalProcessSerializer(serializers.ModelSerializer):
    steps = ApprovalSerializer(many=True, read_only=True)  # Nested the Approval steps
    class Meta:
        model = ApprovalProcess
        fields = '__all__'

class UserApprovalSerializer(serializers.ModelSerializer):   
    class Meta:
        model = UserApproval
        fields = '__all__'

class ApprovalStepTemplateSerializer(serializers.ModelSerializer):
    approver_list = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = ApprovalStepTemplate
        fields = ['min_approvers', 'order', 'approver_list']

class ApprovalProcessTemplateSerializer(serializers.ModelSerializer):
    steps = ApprovalStepTemplateSerializer(many=True)

    class Meta:
        model = ApprovalProcessTemplate
        fields = ['name', 'steps']
