/* eslint-disable @typescript-eslint/naming-convention */
import { IApprovalService } from "./approvalService.service";
import { IAuthService } from "./auth.service";
import { IUserService } from "./user.service";

// eslint-disable-next-line @typescript-eslint/naming-convention
/* The Sdk class is a TypeScript class that provides static access to instances of approval,
authentication, and user services. */
export class sdk {
  public static approval: IApprovalService = IApprovalService.getInstance;
  public static auth: IAuthService = new IAuthService();
  public static users: IUserService = IUserService.getInstance;
}
