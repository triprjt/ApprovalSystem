export type IProcessModel = {
  approval_process_name: string;
  steps: IStoreSteps[];
};
export type IStoreSteps = {
  _id: string;
  approver_list: string[];
  min_approvers: number | null;
  order: number;
  status: "pending" | "approved";
};
