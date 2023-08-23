import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { IUserApprovalUpdate } from "@/services/approvalService.service";
import { sdk } from "@/services/sdk.service";
import { IDispatch, IRootState } from "@/store/store";

export default function PendingApproval() {
  const headers: string[] = ["Name", "Status", "author", "Minium Approval", "Action"];

  const dispatch: IDispatch = useDispatch();
  const state = useSelector((state: IRootState) => state.pendingApprovalModel.pending_approvals);
  const notify = () => toast("Approved Successfully");
  const handleStatusChange = async (prop: IUserApprovalUpdate, id: number) => {
    const response = await sdk.approval.userApprovals.update({
      ...prop,
    });
    if (response) {
      notify();
      return dispatch.pendingApprovalModel._updateStatus({
        id: id,
        value: prop.status ? "approved" : "pending",
      });
    }
  };

  useEffect(() => {
    dispatch.pendingApprovalModel.initiateState(); //? will initiate the state please remove dummy data from state
  }, []);

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table aria-label="pending approval table">
        <TableHead>
          <TableRow>
            {headers.map((el) => {
              return (
                <TableCell sx={{ fontWeight: "bold" }} key={el}>
                  {el}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {state?.map((row) => (
            <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell>{row.approval_process_name}</TableCell>
              <TableCell>
                {row.status !== "approved" ? (
                  <CloseIcon color="error" />
                ) : (
                  <DoneIcon color="success" />
                )}
              </TableCell>
              <TableCell>{row.creator_name}</TableCell>
              <TableCell>{row.minimum_approver || 1}</TableCell>
              <TableCell>
                <Button
                  onClick={() =>
                    handleStatusChange(
                      {
                        approval_process_name: row.approval_process_name,
                        status: !(row.status == "approved"),
                      },
                      row.id
                    )
                  }
                >
                  Mark As {row.status == "approved" ? "unApproved" : "Approved"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
