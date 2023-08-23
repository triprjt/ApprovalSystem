/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */

import { IPendingApproval, IPendingApprovals } from "@MyTypes/pendingApproval.modal.type";
import { createModel } from "@rematch/core";

import { sdk } from "@/services/sdk.service";

import { IRootModel } from "./index";

const initialState: IPendingApprovals = {
  pending_approvals: [],
  users_pending_approvals: [],
};

export const pendingApprovalModel = createModel<IRootModel>()({
  state: initialState,
  reducers: {
    _remove(state, id: number) {
      const filteredValue = state.pending_approvals.filter((el) => el.id !== id);
      return {
        ...state,
        pending_approvals: filteredValue,
      };
    },
    _updateStatus(state, prop: { id: number; value: "pending" | "approved" }) {
      const target = state.pending_approvals.find((el) => el.id === prop.id);
      if (!target) return state;
      target.status = prop.value;
    },

    _updateStatusUsers(state, prop: { id: number; value: "pending" | "approved" }) {
      const target = state.users_pending_approvals.find((el) => el.id === prop.id);
      if (!target) return state;
      target.status = prop.value;
    },
    _initState(state, value: IPendingApproval[]) {
      return {
        ...state,
        pending_approvals: value,
      };
    },
    _initStateUsers(state, value: IPendingApproval[]) {
      return {
        ...state,
        users_pending_approvals: value,
      };
    },
  },
  effects: (dispatch) => ({
    /* The `initiateState` function is an asynchronous effect that is triggered when the
    `initiateState` action is dispatched. It takes two parameters: `_payload` and `state`. */
    async initiateState() {
      const response = await sdk.approval.pending.getAll();
      dispatch.pendingApprovalModel._initState(response);
    },
    async initiateStateUsers() {
      const response = await sdk.approval.track.getAll();
      const FResponse: IPendingApproval[] = response.map((el, idx) => {
        const isPendingPresent = el.steps.find((el) => el.status === "pending");
        return {
          status: isPendingPresent ? "pending" : "approved",
          name: el.name,
          approval_process: 0,
          approval_process_name: el.steps[0]?.approval_process_name || "",
          creator_name: el.steps[0]?.creator_name || "",
          minimum_approver: el.steps[0]?.minimum_approver || 0,
          id: el.id,
          order: idx + 1,
          pending_with: el.steps.map((el) => el.pending_with).flatMap((el) => el?.toString() || ""),
          users: el.steps.map((el) => el.users).flatMap((el) => el || ""),
        };
      });

      dispatch.pendingApprovalModel._initStateUsers(FResponse);
    },
  }),
});
