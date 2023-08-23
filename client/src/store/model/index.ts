import { Models } from "@rematch/core";

import { pendingApprovalModel } from "./pendingApproval.modal";
import { processModel } from "./processStep.model";
import { usersModel } from "./users.model";

export interface IRootModel extends Models<IRootModel> {
  processModel: typeof processModel;
  pendingApprovalModel: typeof pendingApprovalModel;
  usersModel: typeof usersModel;
}

export const models: IRootModel = { processModel, pendingApprovalModel, usersModel };
