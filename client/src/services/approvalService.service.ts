/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiPaths } from "@constants/api";
import { IPendingApproval } from "@MyTypes/pendingApproval.modal.type";
import { IProcessModel } from "@MyTypes/process.model.type";

import { IBaseService } from "./baseService.service";

export type IUserApprovalUpdate = {
  status: boolean;
  approval_process_name: string;
};

/* The IPendingProposal class extends the IBaseService class and provides a method to retrieve all
pending approvals. */
class IPendingProposal extends IBaseService {
  constructor() {
    super(apiPaths.pending_approvals);
  }
  public async getAll() {
    const response = await super.get<IPendingApproval[]>();
    return response;
  }
}

class IUserApproval extends IBaseService {
  constructor() {
    super(apiPaths.user_approval);
  }
  public async update(data: IUserApprovalUpdate) {
    const response = await super.put<IUserApprovalUpdate>(data);
    return response;
  }
}
export interface ITrackServiceGetAll {
  id: number;
  steps: Partial<IPendingApproval & { approver_list?: string[] }>[];
  name: string;
  creator: number;
}

class ITrackService extends IBaseService {
  constructor() {
    super(apiPaths["track-approval-process"]);
  }
  public async getAll() {
    try {
      const response = await super.get<ITrackServiceGetAll[]>();
      return response;
    } catch (error: any) {
      return [];
    }
  }
}

class IApprovalProcessTemplate extends IBaseService {
  constructor() {
    super(apiPaths["approval-process-template"]);
  }
  /**
   * The function "search" is an asynchronous function that takes a string parameter "q" and makes a GET
   * request to an API endpoint with the provided string appended to the URL.
   * @param {string} q - The parameter `q` is a string that represents the search query. It is used to
   * search for a specific item in the approval process template.
   * @returns The response from the API call is being returned.
   */
  async search(q: string) {
    const response = await super.custom<Partial<ITrackServiceGetAll>>(
      apiPaths["approval-process-template"] + q + "/",
      {
        method: "get",
      }
    );
    return response;
  }
  /**
   * The function `getAll` makes an asynchronous request to retrieve all approval process templates.
   * @returns a promise that resolves to an array of strings.
   */
  async getAll() {
    const response = await super.custom<string[]>(apiPaths["approval-process-template/Approval"]);
    return response;
  }
}

/* The IApprovalService class extends the IBaseService class and provides a method to create a new
approval process. */
export class IApprovalService extends IBaseService {
  public static instance: IApprovalService | null = null;
  constructor() {
    super(apiPaths.approvals);
  }
  async create(data: IProcessModel) {
    const response = await super.post<IProcessModel>(data);
    return response;
  }
  get pending() {
    return new IPendingProposal();
  }
  get userApprovals() {
    return new IUserApproval();
  }
  get track() {
    return new ITrackService();
  }
  get template() {
    return new IApprovalProcessTemplate();
  }
  /**
   * The getInstance function returns an instance of the IApprovalService class, creating one if it
   * doesn't already exist.
   * @returns The method is returning an instance of the IApprovalService class.
   */
  public static get getInstance() {
    if (IApprovalService.instance) return IApprovalService.instance;
    else {
      IApprovalService.instance = new IApprovalService();
      return IApprovalService.instance;
    }
  }
}
//@example
// const res = await IApprovalService.getInstance.pending.getAll();
