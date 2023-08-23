import { PrimaryLayout } from "@components";
import { paths } from "@constants/paths";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { ApprovalTabs } from "./approval";
import Proposals from "./approval/createApproval";
import PendingApproval from "./approval/pendingApprovals";
import { Login } from "./auth";
import Home from "./home";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={"/Login"} element={<Login />} />
      <Route path={"/"} element={<Home />} />

      <Route
        path={paths.create_proposal}
        element={
          <Suspense fallback="loading..">
            <PrimaryLayout>
              <Proposals />
            </PrimaryLayout>
          </Suspense>
        }
      />

      <Route
        path={paths.pending_approval}
        element={
          <Suspense fallback="loading..">
            <PrimaryLayout>
              <ApprovalTabs />
            </PrimaryLayout>
          </Suspense>
        }
      />
    </Routes>
  );
}
