/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button, Checkbox, Container, Stack, TextField, Typography } from "@mui/material";
import { IStoreSteps } from "@MyTypes/process.model.type";
import { useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select, { MultiValue } from "react-select";
import { toast } from "react-toastify";

import { sdk } from "@/services/sdk.service";
import { IDispatch, IRootState } from "@/store/store";

type IUserOptions = {
  users: {
    label: string;
    value: string;
  }[];
  target_id: string;
  order: number;
};

const UserOptions = ({ users, order, target_id }: IUserOptions) => {
  const dispatch: IDispatch = useDispatch();
  const state = useSelector((state: IRootState) => state.processModel.steps).find(
    (el) => el._id == target_id
  );

  /* The `formattedSelectValue` variable is using the `useMemo` hook to memoize the result of a function. */
  const formattedSelectValue = useMemo(() => {
    return state?.approver_list.map((el) => {
      return {
        label: el,
        value: el,
      };
    });
  }, [state]);

  /**
   * The handleChange function updates the steps in the process model with the labels of the selected
   * values.
   * @param value - The `value` parameter is of type `MultiValue`, which is an array of objects. Each
   * object has two properties: `label` of type `string` and `value` of type `string`.
   */
  const handleChange = (
    value: MultiValue<{
      label: string;
      value: string;
    }>
  ) => {
    dispatch.processModel._updateSteps(
      target_id,
      value.map((el) => el.label)
    );
  };

  return (
    <Stack spacing={2}>
      <Stack spacing={2} p={0} alignItems={"center"} direction={"row"}>
        <Typography textTransform={"capitalize"}>Process Step: {order}</Typography>
        <Button onClick={() => dispatch.processModel._delete(target_id)} color="warning">
          Remove
        </Button>
      </Stack>

      <TextField
        value={state?.min_approvers ?? ""}
        size="small"
        type="number"
        onChange={(v) =>
          dispatch.processModel._updateMinApproval(target_id, v.target.value as unknown as number)
        }
        id="outlined-basic"
        label="Min Approval"
        variant="outlined"
      />
      <Select value={formattedSelectValue} onChange={handleChange} isMulti options={users} />
    </Stack>
  );
};

function TemplateSearchField() {
  const dispatch: IDispatch = useDispatch();
  const [selectShow, setSelectShow] = useState(false);
  const processState = useSelector((state: IRootState) => state.processModel);
  const [allApprovals, setAllApprovals] = useState<{ label: string; value: string }[]>();

  useEffect(() => {
    sdk.approval.template.getAll().then((d) => {
      const values = d.map((el) => {
        return {
          label: el,
          value: el,
        };
      });
      setAllApprovals(values);
    });
  }, []);

  /**
   * The `handleSearch` function updates the name in the process model, searches for approval templates
   * using the provided value, and initializes the process model with the retrieved data if there are
   * any steps in the response.
   * @param {string} value - The `value` parameter is a string that represents the search value. It is
   * used to search for approval templates based on the provided value.
   * @returns If the `response.steps.length` is truthy, the function will return the result of
   * `dispatch.processModel.init({ approval_process_name: name, steps: steps })`.
   */
  const proposeTemplates = async (value: string) => {
    const response = await sdk.approval.template.search(value);
    const steps: IStoreSteps[] =
      response?.steps?.map((el) => {
        return {
          approver_list: el?.approver_list || [],
          min_approvers: (el as unknown as any)?.min_approvers ?? 0,
          order: 0,
          status: "pending",
          _id: crypto.randomUUID(),
        };
      }) || [];

    return dispatch.processModel.addMoreSteps(steps);
  };

  return (
    <Stack alignItems={"start"} spacing={1}>
      <Stack direction={"row"} justifyContent={"center"} alignItems={"center"}>
        <Checkbox onChange={(e) => setSelectShow(e.target.checked)} sx={{ p: 0 }} />
        <Typography sx={{ ml: 1 }}>Select existing templates</Typography>
      </Stack>
      <Box width={"100%"} sx={{ zIndex: 999, display: selectShow ? "block" : "none" }}>
        <Select onChange={(value) => proposeTemplates(value?.label || "")} options={allApprovals} />
      </Box>

      <TextField
        value={processState.approval_process_name}
        size="small"
        onChange={(v) => dispatch.processModel._updateName(v.target.value)}
        id="outlined-basic"
        label="Name"
        variant="outlined"
      />
    </Stack>
  );
}

export default function Proposals() {
  const navigate = useNavigate();
  const state = useSelector((state: IRootState) => state.processModel);
  const usersState = useSelector((state: IRootState) => state.usersModel.users); //? use this when api is ready
  const dispatch: IDispatch = useDispatch();
  const auth = sdk.auth.getAuth();
  const notify = (str?: string) => toast(str || "Steps Creation Successful!", { autoClose: 1000 });
  const loading = useRef(false);

  /* The `filteredUserState` variable is using the `useMemo` hook to memoize the result of a function. */
  const filteredUserState = useMemo(() => {
    const blackList = state.steps.map((el) => el.approver_list).flatMap((el) => el);
    blackList.push(auth?.username);
    const users = usersState
      .filter((el) => !blackList.includes(el))
      ?.map((el) => {
        return {
          label: el,
          value: el,
        };
      });
    return users;
  }, [state.steps]);

  /**
   * The function `handleSave` is an asynchronous function that performs validation checks and creates a
   * new approval process using the `sdk.approval.create` method.
   * @returns The function handleSave is returning either nothing or the result of the
   * dispatch.processModel._reset() function.
   */
  const handleSave = async () => {
    try {
      if (!state.approval_process_name) return notify("Please Add A Unique Name");
      const isAnyUserListIsEmpty = state.steps
        .map((el) => el.approver_list.length == 0)
        .includes(true);
      const isStepsEmpty = state.steps.length == 0;
      if (isStepsEmpty) return notify("Steps Can't Be Empty");
      if (isAnyUserListIsEmpty) return notify("Approver List Can't Be Empty");
      loading.current = true;
      const formattedSteps = state.steps.map((el) => {
        return {
          ...el,
          min_approvers: el.min_approvers || 1,
        };
      });
      const response = await sdk.approval.create({
        approval_process_name: state.approval_process_name,
        steps: formattedSteps,
      });
      loading.current = false;
      if (response.status >= 200) notify();
      return dispatch.processModel._reset();
    } catch (error) {
      loading.current = false;
    }
  };

  useEffect(() => {
    dispatch.usersModel.initiateState(); //? will initiate all users state
    Promise.all([
      dispatch.usersModel.initiateState(),
      dispatch.pendingApprovalModel.initiateState(),
    ]);

    return () => {
      dispatch.usersModel._initState([]);
      dispatch.pendingApprovalModel._initState([]);
    };
  }, []);

  return (
    <Container maxWidth={false} sx={{ p: 5 }}>
      <Stack direction={"column"} alignItems={"start"} spacing={3}>
        <TemplateSearchField />
        <Button onClick={() => dispatch.processModel._addStep()} startIcon={<AddIcon />}>
          Add Step
        </Button>
      </Stack>
      <Stack maxWidth={"40%"} spacing={2}>
        {state.steps.map((el, idx) => {
          return (
            <UserOptions
              users={filteredUserState}
              key={el._id}
              target_id={el._id}
              order={idx + 1}
            />
          );
        })}
      </Stack>
      <Button
        onClick={handleSave}
        disabled={loading.current}
        sx={{ mt: 4 }}
        variant="contained"
        startIcon={<SaveIcon />}
      >
        save
      </Button>
      <Button
        onClick={() => navigate("/")}
        disabled={loading.current}
        sx={{ mt: 4, ml: 2 }}
        variant="outlined"
      >
        cancel
      </Button>
    </Container>
  );
}
