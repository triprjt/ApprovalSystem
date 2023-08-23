/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */

import { createModel } from "@rematch/core";

import { sdk } from "@/services/sdk.service";

import { IRootModel } from "./index";

const initialState: {
  users: string[];
} = {
  users: [],
};

export const usersModel = createModel<IRootModel>()({
  state: initialState,
  reducers: {
    _initState(state, value: string[]) {
      return {
        ...state,
        users: value,
      };
    },
  },
  effects: (dispatch) => ({
    /* The `initiateState` function is an asynchronous effect that is triggered when the
    `initiateState` action is dispatched. It takes two parameters: `_payload` and `state`. */
    async initiateState() {
      const response = await sdk.users.getAllUsers();
      dispatch.usersModel._initState(response);
    },
  }),
});
