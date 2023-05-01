import { Routes, Route } from "react-router-dom";
import { CustomerSearchingForm } from "./customerSearching";
import { TagCardForm, TagAccountForm } from "./tagAccountCard";
import { ClearCacheProvider } from "cache";
import { LoanRequestsGridWrapper } from "./loanRequest/loanRequests";
import { LoanClosureGridWrapper } from "./loanClosure/loanClosure";
import { CustomerActivationForm } from "./customerActivation";
import { PrimaryIDChangeForm } from "./primaryIDChange";
import { PrimaryIDChangeConfirm } from "./primaryIDChange/Confirmation";
export const OperationsMenu = () => (
  <Routes>
    <Route path="customer-searching/*" element={<CustomerSearchingForm />} />
    <Route
      path="tag-account/*"
      element={
        <ClearCacheProvider>
          <TagAccountForm />
        </ClearCacheProvider>
      }
    />
    <Route
      path="tag-card/*"
      element={
        <ClearCacheProvider>
          <TagCardForm />
        </ClearCacheProvider>
      }
    />
    <Route
      path="cib-loan-req/*"
      element={<LoanRequestsGridWrapper screenFlag="CIB" />}
    />
    <Route
      path="dbr-loan-req/*"
      element={<LoanRequestsGridWrapper screenFlag="DBR" />}
    />
    <Route
      path="auth-loan-req/*"
      element={<LoanRequestsGridWrapper screenFlag="AUTH" />}
    />
    <Route path="loan-cls-req/*" element={<LoanClosureGridWrapper />} />
    {/* <Route
      path="user-limit/*"
      element={<ConfirmationGridWrapper screenFlag="userLimit" />}
    /> */}
    <Route path="customer-activation/*" element={<CustomerActivationForm />} />
    <Route path="primary-id-change/*" element={<PrimaryIDChangeForm />} />
    <Route path="primary-id-confirm/*" element={<PrimaryIDChangeConfirm />} />
    {/* <Route
      path="pass_reset_conf/*"
      element={<ConfirmationGridWrapper screenFlag="passReset" />}
    />
    <Route
      path="pass_reset_conf/*"
      element={<ConfirmationGridWrapper screenFlag="passReset" />}
    /> */}
  </Routes>
);
