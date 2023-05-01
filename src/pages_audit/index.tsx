import { Fragment, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import {
  AuthProvider,
  AuthLoginController,
  ProtectedRoutes,
  ForgotPasswordController,
} from "./auth";
import { PagesAudit } from "./pages_audit";
//alert("EntryPoint");
const EntryPoint = () => (
  <Fragment>
    <AuthProvider>
      <Routes>
        <Route path="login" element={<AuthLoginController />} />
        <Route path="forgotpassword" element={<ForgotPasswordController />} />
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
