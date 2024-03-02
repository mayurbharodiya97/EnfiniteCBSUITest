import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import CkycProvider from "./c-kyc/CkycContext";
import { CkycConfirm } from "./c-kyc/confirmation/CkycConfirm";
import AcctMST from "./acct-mst/AcctMST";
import SingleDeno from "../dashboard/noteDenomination/singleDeno";
import { FixDepositProvider } from "./fixDeposit/fixDepositContext";

const ChequebookTab = lazy(() => import("./chequeBookTab"));
const LimitEntry = lazy(() => import("./limit-entry"));
const StockEntry = lazy(() => import("./stockEntry"));
const StopPaymentEntry = lazy(() => import("./stopPaymentEntry"));
const LienEntry = lazy(() => import("./lienEntry"));
const Ckyc = lazy(() => import("./c-kyc"));
const FixDepositForm = lazy(() => import("./fixDeposit"));
const CashReceiptEntry = lazy(
  () => import("pages_audit/pages/dashboard/noteDenomination/cashReceiptEntry")
);
const CtsOutwardClearingFormWrapper = lazy(() => import("./ctsOutward"));
const InwardClearing = lazy(() => import("./inwardClearing"));
const TellerScreen = lazy(
  () => import("../dashboard/noteDenomination/tellerScreen")
);

export const OperationsMenu = () => (
  <Routes>
    <Route path="chequebook-entry/*" element={<ChequebookTab />} />
    <Route path="limit-entry/*" element={<LimitEntry />} />
    <Route path="stock-entry/*" element={<StockEntry />} />
    <Route path="stop-payment-entry/*" element={<StopPaymentEntry />} />
    <Route path="lien-entry/*" element={<LienEntry />} />
    <Route path="teller/*" element={<TellerScreen />} />
    {/* <Route path="teller2/*" element={<CashReceiptEntry />} /> */}
    <Route
      path="confirm-ckyc/*"
      element={
        <CkycProvider>
          <CkycConfirm />
        </CkycProvider>
      }
    />
    <Route path="account-mst/*" element={<AcctMST />} />
    <Route path="single-deno/*" element={<SingleDeno />} />

    <Route
      path="ckyc/*"
      element={
        <CkycProvider>
          <Ckyc />
        </CkycProvider>
      }
    />
    <Route
      path="cts-outward-clearing/*"
      element={<CtsOutwardClearingFormWrapper zoneTranType="S" />}
    />
    <Route path="inward-clearing-process/*" element={<InwardClearing />} />
    <Route
      path="fix-deposit/*"
      element={
        <FixDepositProvider>
          <FixDepositForm />
        </FixDepositProvider>
      }
    />
  </Routes>
);
