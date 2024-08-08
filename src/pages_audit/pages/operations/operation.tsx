import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import CkycProvider from "./c-kyc/CkycContext";
import { CkycConfirm } from "./c-kyc/confirmation/CkycConfirm";
import AcctMST from "./acct-mst/AcctMST";
import { FixDepositProvider } from "./fixDeposit/fixDepositContext";
import AcctMSTProvider from "./acct-mst/AcctMSTContext";
import { RecurringContextWrapper } from "./recurringPaymentEntry/context/recurringPaymentContext";

const ChequebookTab = lazy(() => import("./chequeBookTab"));
const LimitEntry = lazy(() => import("./limit-entry"));
const StockEntry = lazy(() => import("./stockEntry"));
const StopPaymentEntry = lazy(() => import("./stopPaymentEntry"));
const LienEntry = lazy(() => import("./lienEntry"));
const TemporaryOD = lazy(() => import("./temporaryOD"));
const AtmEntry = lazy(() => import("./atm-entry"));
const Ckyc = lazy(() => import("./c-kyc"));
const AcctConfirm = lazy(() => import("./acct-mst/AcctConfirm"));
const FixDepositForm = lazy(() => import("./fixDeposit"));
const CtsOutwardClearingFormWrapper = lazy(() => import("./ctsOutward"));
const CtsOutwardClearingConfirmGrid = lazy(
  () => import("./ctsOutward/confirmation")
);
const RtgsBranchHoConfirmationGrid = lazy(
  () => import("./rtgsEntry/confirmation")
);
const InwardClearing = lazy(() => import("./inwardClearing"));
const ClearingDateTransferGridWrapper = lazy(
  () => import("./clearingDateTransfer")
);
const StrAcLevelBranchEntryGridWrapper = lazy(
  () => import("./strAcLevelBranchEntry")
);
const RtgsEntryFormWrapper = lazy(() => import("./rtgsEntry"));
const TellerScreen = lazy(() => import("./denomination/tellerScreen"));
const ConfirmationGridWrapper = lazy(() => import("../confirmations"));
const SingleDenomination = lazy(
  () => import("./denomination/singleDenomination/index")
);
const Form15GHEntryGrid = lazy(() => import("./form15G-HEntry"));
const Form15GHConfirmationGrid = lazy(
  () => import("./form15G-HEntry/confirmation")
);
// const PositivePayEntryGrid = lazy(() => import("./positivePayEntry"));
// const PositivePayConfirmationGrid = lazy(
//   () => import("./positivePayEntry/confirmation")
// );
const PayslipIsuueEntry = lazy(() => import("./payslip-issue-entry/index"));
const RecurringPaymentEntryGrid = lazy(() => import("./recurringPaymentEntry"));

export const OperationsMenu = () => (
  <Routes>
    <Route path="chequebook-entry/*" element={<ChequebookTab />} />
    <Route path="limit-entry/*" element={<LimitEntry />} />
    <Route path="stock-entry/*" element={<StockEntry />} />
    <Route path="stop-payment-entry/*" element={<StopPaymentEntry />} />
    <Route path="lien-entry/*" element={<LienEntry />} />
    <Route path="temp-od-entry/*" element={<TemporaryOD />} />
    <Route path="atm-reg-entry/*" element={<AtmEntry />} />

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
      path="cts-outward-confirmation/*"
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
    <Route
      path="str-branch-entry/*"
      element={<StrAcLevelBranchEntryGridWrapper />}
    />

    <Route path="rtgs-entry/*" element={<RtgsEntryFormWrapper />} />
    <Route path="payslip-issue-entry/*" element={<PayslipIsuueEntry />} />
    <Route
      path="rtgs-branch-confirmation/*"
      element={<RtgsBranchHoConfirmationGrid flag="BO" />}
    />
    <Route
      path="rtgs-ho-confirmation/*"
      element={<RtgsBranchHoConfirmationGrid flag="HO" />}
    />
    <Route
      path="fix-deposit/*"
      element={
        <FixDepositProvider>
          <FixDepositForm />
        </FixDepositProvider>
      }
    />
    <Route
      path="form-15g-h-entry/*"
      element={<Form15GHEntryGrid screenFlag="E" />}
    />
    <Route
      path="form-15g-h-confirmation/*"
      element={<Form15GHConfirmationGrid screenFlag="C" />}
    />
    {/* <Route path="positivepay-entry/*" element={<PositivePayEntryGrid />} />
    <Route
      path="positivepay-confirmation/*"
      element={<PositivePayConfirmationGrid screenFlag="C" />}
    /> */}
    <Route
      path="recurring-payment-entry/*"
      element={
        <RecurringContextWrapper>
          <RecurringPaymentEntryGrid screenFlag="recurringPmtEntry" />
        </RecurringContextWrapper>
      }
    />
    <Route
      path="recurring-payment-confirmation/*"
      element={
        <RecurringContextWrapper>
          <RecurringPaymentEntryGrid screenFlag="recurringPmtConf" />
        </RecurringContextWrapper>
      }
    />
  </Routes>
);
