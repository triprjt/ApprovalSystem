const apiUrl = "http://localhost:8000/api/v1"; //? change it with deployed api link
export default apiUrl;

export const apiPaths = Object.freeze({
  pending_approvals: "/pending-approvals/",
  approvals: "/create-approval-process/",
  all_users: "/all-users/",
  user_approval: "/update-status/",
  sign_in: "/api-token-auth/",
  "track-approval-process": "/track-approval-process/",
  "approval-process-template": "/approval-process-template/",
  "approval-process-template/Approval": "/all-approval-process/",
});
