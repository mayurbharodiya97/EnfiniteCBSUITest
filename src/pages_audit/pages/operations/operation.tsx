import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import CkycProvider from "./c-kyc/CkycContext";
import { CkycConfirm } from "./c-kyc/confirmation/CkycConfirm";
import AcctMST from "./acct-mst/AcctMST";
import { FixDepositProvider } from "./fixDeposit/fixDepositContext";
import AcctMSTProvider from "./acct-mst/AcctMSTContext";

const ChequebookTab = lazy(() => import("./chequeBookTab"));
const LimitEntry = lazy(() => import("./limit-entry"));
const StockEntry = lazy(() => import("./stockEntry"));
const StopPaymentEntry = lazy(() => import("./stopPaymentEntry"));
const LienEntry = lazy(() => import("./lienEntry"));
const TemporaryOD = lazy(() => import("./temporaryOD"));
const Ckyc = lazy(() => import("./c-kyc"));
const AcctConfirm = lazy(() => import("./acct-mst/AcctConfirm"));
const FixDepositForm = lazy(() => import("./fixDeposit"));
const CtsOutwardClearingFormWrapper = lazy(() => import("./ctsOutward"));
const CtsOutwardClearingConfirmGrid = lazy(
  () => import("./ctsOutward/confirmation")
);
const InwardClearing = lazy(() => import("./inwardClearing"));
const ClearingDateTransferGridWrapper = lazy(
  () => import("./clearingDateTransfer")
);
const RtgsEntryFormWrapper = lazy(() => import("./rtgsEntry"));
const TellerScreen = lazy(() => import("./denomination/tellerScreen"));
const ConfirmationGridWrapper = lazy(() => import("../confirmations"));
const SingleDenomination = lazy(
  () => import("./denomination/singleDenomination/index")
);

export const OperationsMenu = () => (
  <Routes>
    <Route path="chequebook-entry/*" element={<ChequebookTab />} />
    <Route path="limit-entry/*" element={<LimitEntry />} />
    <Route path="stock-entry/*" element={<StockEntry />} />
    <Route path="stop-payment-entry/*" element={<StopPaymentEntry />} />
    <Route path="lien-entry/*" element={<LienEntry />} />
    <Route path="temp-od-entry/*" element={<TemporaryOD />} />
    <Route
      path="chequebook-confirmation/*"
      element={<ConfirmationGridWrapper screenFlag="chequebookCFM" />}
    />
    <Route
      path="limit-confirmation/*"
      element={<ConfirmationGridWrapper screenFlag="limitCFM" />}
    />
    <Route
      path="stock-confirmation/*"
      element={<ConfirmationGridWrapper screenFlag="stockCFM" />}
    />
    <Route
      path="stop-pay-confirmation/*"
      element={<ConfirmationGridWrapper screenFlag="stopPaymentCFM" />}
    />
    <Route
      path="lien-confirmation/*"
      element={<ConfirmationGridWrapper screenFlag="lienCFM" />}
    />
    <Route
      path="tempOd-confirmation/*"
      element={<ConfirmationGridWrapper screenFlag="tempOdCFM" />}
    />
    <Route path="teller/*" element={<TellerScreen />} />
    <Route path="single-denomination/*" element={<SingleDenomination />} />
    <Route
      path="confirm-ckyc/*"
      element={
        <CkycProvider>
          <CkycConfirm />
        </CkycProvider>
      }
    />
    <Route
      path="account-mst/*"
      element={
        <AcctMSTProvider>
          <AcctMST />
        </AcctMSTProvider>
      }
    />
    <Route
      path="account-confirm/*"
      element={
        <AcctMSTProvider>
          <AcctConfirm />
        </AcctMSTProvider>
      }
    />
    {/* <Route path="single-deno/*" element={<SingleDeno />} /> */}

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
    <Route
      path="inward-return-entry/*"
      element={<CtsOutwardClearingFormWrapper zoneTranType="R" />}
    />
    <Route
      path="cts-o/w-confirmation/*"
      element={<CtsOutwardClearingConfirmGrid zoneTranType="S" />}
    />
    <Route
      path="inward-return-confirmation/*"
      element={<CtsOutwardClearingConfirmGrid zoneTranType="R" />}
    />
    <Route
      path="outward-return-confirmation/*"
      element={<CtsOutwardClearingConfirmGrid zoneTranType="W" />}
    />
    <Route path="inward-clearing-process/*" element={<InwardClearing />} />
    <Route
      path="clearing-date-transfer/*"
      element={<ClearingDateTransferGridWrapper />}
    />
    <Route path="rtgs-entry/*" element={<RtgsEntryFormWrapper />} />
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
