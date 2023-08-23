/* eslint-disable @typescript-eslint/naming-convention */
import { IProcessModel, IStoreSteps } from "@MyTypes/process.model.type";
import { createModel } from "@rematch/core";

import { IRootModel } from "./index";

const initialState: IProcessModel = {
  approval_process_name: "",
  steps: [],
};

export const processModel = createModel<IRootModel>()({
  state: initialState,
  reducers: {
    _addStep(state) {
      const uuid = crypto.randomUUID();
      return {
        ...state,
        steps: [
          ...state.steps,
          {
            _id: uuid,
            approver_list: [],
            min_approvers: null,
            order: state.steps.length + 1,
            status: "pending",
          },
        ],
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _reset(state) {
      return {
        approval_process_name: "",
        steps: [],
      };
    },

    _delete(state, id) {
      const filteredValues = state.steps.filter((el) => el._id !== id);
      return {
        approval_process_name: "",
        steps: [...filteredValues],
      };
    },
    init(state, prop: IStoreSteps[]) {
      return {
        ...state,
        steps: prop,
      };
    },
    addMoreSteps(state, prop: IStoreSteps[]) {
      return {
        ...state,
        steps: [...state.steps, ...prop],
      };
    },
    _updateName(state, name: string) {
      return {
        ...state,
        approval_process_name: name,
      };
    },
    _updateSteps(state, _id: string, value: string[]) {
      const target = state.steps.find((el) => el._id == _id);
      if (!target) return state;
      target.approver_list = value;
    },
    _updateMinApproval(state, _id: string, value: number) {
      const target = state.steps.find((el) => el._id == _id);
      if (!target) return state;
      target.min_approvers = value;
    },
  },
});
