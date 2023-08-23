import { apiPaths } from "@constants/api";

import { IBaseService } from "./baseService.service";

export class IUserService extends IBaseService {
  public static instance: IUserService | null = null;

  constructor() {
    super(apiPaths.all_users);
  }
  async getAllUsers() {
    const response = await super.get<string[]>();
    return response;
  }
  public static get getInstance() {
    if (IUserService.instance) return IUserService.instance;
    else {
      IUserService.instance = new IUserService();
      return IUserService.instance;
    }
  }
}
