export type IPendingApprovals = {
  pending_approvals: IPendingApproval[];
  users_pending_approvals: IPendingApproval[];
};

export type IPendingApproval = {
  id: number;
  users: string[];
  approval_process_name: string;
  creator_name: string;
  pending_with: string[];
  minimum_approver: number;
  order: number;
  status: "approved" | "pending";
  approval_process: number;
};
