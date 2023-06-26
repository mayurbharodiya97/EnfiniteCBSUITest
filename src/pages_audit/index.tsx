import { Fragment, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { PagesAudit } from "./pages_audit";
import {
  AuthLoginController,
  AuthProvider,
  ForgotPasswordController,
  ProtectedRoutes,
} from "./auth";
import { BranchSelectionGridWrapper } from "./auth/branchSelection";
//alert("EntryPoint");
const EntryPoint = () => (
  <Fragment>
    <AuthProvider>
      <Routes>
        <Route path="login" element={<AuthLoginController />} />
        <Route path="forgotpassword" element={<ForgotPasswordController />} />
        <Route
          path="branch-selection/*"
          element={<BranchSelectionGridWrapper selectionMode={"S"} />}
        />
        <Route
          path="change-branch/*"
          element={<BranchSelectionGridWrapper selectionMode={"C"} />}
        />
        <Route
          path="*"
          element={
            <ProtectedRoutes>
              <PagesAudit />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </AuthProvider>
  </Fragment>
);

export default EntryPoint;
