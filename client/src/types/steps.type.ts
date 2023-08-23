export type ISteps = {
  _id: string;
  approver_list: string[];
  min_approvers: number | null;
  order: number;
  status: "pending" | "approved";
};
