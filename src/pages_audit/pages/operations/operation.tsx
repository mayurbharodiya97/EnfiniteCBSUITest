import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import CkycProvider from "./c-kyc/CkycContext";
import { CkycConfirm } from "./c-kyc/confirmation/CkycConfirm";
import AcctMST from "./acct-mst/AcctMST";
// import { FixDepositProvider } from "./fixDeposit/fixDepositContext";
import AcctMSTProvider from "./acct-mst/AcctMSTContext";
import { RecurringContextWrapper } from "./recurringPaymentEntry/context/recurringPaymentContext";
import { FDContextWrapper } from "./fix-deposit/context/fdContext";

const ChequebookTab = lazy(() => import("./chequeBookTab"));
const LimitEntry = lazy(() => import("./limit-entry"));
const StockEntry = lazy(() => import("./stockEntry"));
const StopPaymentEntry = lazy(() => import("./stopPaymentEntry"));
const LienEntry = lazy(() => import("./lienEntry"));
const TemporaryOD = lazy(() => import("./temporaryOD"));
const AtmEntry = lazy(() => import("./atm-entry"));
const ImpsEntry = lazy(() => import("./imps-entry"));
const ATMconfirmation = lazy(() => import("./atm-entry/confirm/confirmation"));
const Ckyc = lazy(() => import("./c-kyc"));
const AcctConfirm = lazy(() => import("./acct-mst/AcctConfirm"));
// const FixDepositForm = lazy(() => import("./fixDeposit"));
const FDDetailGrid = lazy(() => import("./fix-deposit"));
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
const InsuranceEntryForm = lazy(() => import("./insuranceEntry"));
const DailyTransactionImportForm = lazy(
  () => import("./dailyTransactionImport")
);
const TellerScreen = lazy(() => import("./denomination/tellerScreen"));
const ConfirmationGridWrapper = lazy(() => import("../confirmations"));
const SingleDenomination = lazy(
  () => import("./denomination/singleDenomination/index")
);
const Payslipissueconfirmation = lazy(
  () => import("./payslipissueconfirmation/index")
);
const Form15GHEntryGrid = lazy(() => import("./form15G-HEntry"));
const Form15GHConfirmationGrid = lazy(
  () => import("./form15G-HEntry/confirmation")
);
const PositivePayEntryGrid = lazy(() => import("./positivePayEntry"));
const PositivePayConfirmationGrid = lazy(
  () => import("./positivePayEntry/confirmation")
);
const RecurringPaymentEntryGrid = lazy(() => import("./recurringPaymentEntry"));
const PassbookPrint = lazy(() => import("./passbookPrint"));
const LoanScheduleGrid = lazy(() => import("./loanSchedule"));
// const LoanScheduleGrid = lazy(() => import("./loanSchedule"));
const StandingInstructionGridWrapper = lazy(
  () => import("./standingInstruction")
);
const StandingInstructionConfirmationGridWrapper = lazy(
  () => import("./standingInstruction/confirmation/")
);
const RecurringCalculatorFormWrapper = lazy(
  () => import("./recurringCalculator")
);
const EMICalculatorFormWrapper = lazy(() => import("./emiCalculator"));
const PayslipIsuueEntry = lazy(() => import("./payslip-issue-entry/index"));
const OutwardChequeSearch = lazy(() => import("./cheQueSearch/index"));
const HoldTrnsConfirmationMain = lazy(
  () => import("./holdTransactionConfirmation/index")
);
const DayEndProcess = lazy(() => import("./dayEndProcess/index"));
const FdInterestCalculator = lazy(() => import("./fdInterestCalculator/index"));
const GstOutwardEntryGrid = lazy(
  () => import("./gstOutwardEntry/gstOutwardGrid")
);
const GstOutwardEntryConfirmationGrid = lazy(
  () =>
    import(
      "./gstOutwardEntry/gstOutwardEntryConfirmation/gstOutwardEntryConfirmationGrid"
    )
);
const PlaySlipDraftPrinting = lazy(
  () => import("./payslipDraftPrintingNew/retrieve")
);
const FdPrintDynamicNew = lazy(
  () => import("./fdPrintDynamicNew/fdPrintRetrieve/retrieveFdPrint")
);
const CashierEntry = lazy(
  () => import("./cashierExchangeEntry/cashierExchangeEntry")
);
const AccountCloseProcess = lazy(() => import("./ACCloseProcess"));
const AccountCloseConfirm = lazy(() => import("./ACCCloseConfirm"));
const FdInterestPaymentGrid = lazy(() => import("./FDInterestPayment"));
const FDInterestPaymentConfm = lazy(() => import("./FDInterestPaymentConf"));

export const OperationsMenu = () => (
  <Routes>
    <Route path="chequebook-entry/*" element={<ChequebookTab />} />
    <Route
      path="holdtrn-confirmation/*"
      element={<HoldTrnsConfirmationMain />}
    />
    <Route path="owreturn-chqsearch/*" element={<OutwardChequeSearch />} />
    <Route path="limit-entry/*" element={<LimitEntry />} />
    <Route path="stock-entry/*" element={<StockEntry />} />
    <Route path="stop-payment-entry/*" element={<StopPaymentEntry />} />
    <Route path="lien-entry/*" element={<LienEntry />} />
    <Route path="temp-od-entry/*" element={<TemporaryOD />} />
    <Route path="atm-reg-entry/*" element={<AtmEntry />} />
    <Route path="imps-reg-entry/*" element={<ImpsEntry />} />
    <Route path="atm-reg-confirmation/*" element={<ATMconfirmation />} />
    <Route path="dayend-process/*" element={<DayEndProcess />} />

    <Route
      path="chequebook-confirmation/*"
      element={
        <ConfirmationGridWrapper screenFlag="chequebookCFM" reqData="" />
      }
    />
    <Route
      path="limit-confirmation/*"
      element={<ConfirmationGridWrapper screenFlag="limitCFM" reqData="" />}
    />
    <Route
      path="stock-confirmation/*"
      element={<ConfirmationGridWrapper screenFlag="stockCFM" reqData="" />}
    />
    <Route
      path="stop-pay-confirmation/*"
      element={
        <ConfirmationGridWrapper screenFlag="stopPaymentCFM" reqData="" />
      }
    />
    <Route
      path="lien-confirmation/*"
      element={<ConfirmationGridWrapper screenFlag="lienCFM" reqData="" />}
    />
    <Route
      path="tempOd-confirmation/*"
      element={<ConfirmationGridWrapper screenFlag="tempOdCFM" reqData="" />}
    />
    <Route
      path="insurance-confirmation/*"
      element={<ConfirmationGridWrapper screenFlag="insuranceCFM" reqData="" />}
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
      path="payslip-issue-confirmation/*"
      element={<Payslipissueconfirmation />}
    />
    <Route path="fdint-calculator/*" element={<FdInterestCalculator />} />
    <Route
      path="rtgs-branch-confirmation/*"
      element={<RtgsBranchHoConfirmationGrid flag="BO" />}
    />
    <Route
      path="rtgs-ho-confirmation/*"
      element={<RtgsBranchHoConfirmationGrid flag="HO" />}
    />
    <Route path="insurance-entry/*" element={<InsuranceEntryForm />} />
    <Route
      path="daily-transaction-import/*"
      element={<DailyTransactionImportForm />}
    />

    {/* <Route
      path="fix-deposit/*"
      element={
        <FixDepositProvider>
          <FixDepositForm />
        </FixDepositProvider>
      }
    /> */}

    <Route
      path="fix-deposit/*"
      element={
        <FDContextWrapper>
          <FDDetailGrid />
        </FDContextWrapper>
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
    <Route path="positivepay-entry/*" element={<PositivePayEntryGrid />} />
    <Route
      path="positivepay-confirmation/*"
      element={<PositivePayConfirmationGrid screenFlag="C" />}
    />
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
    <Route path="passbook-printing/*" element={<PassbookPrint />} />
    <Route path="loanschedule/*" element={<LoanScheduleGrid />} />
    {/* <Route path="loanschedule/*" element={<LoanScheduleGrid />} /> */}
    <Route
      path="gst-outward-entry/*"
      element={<GstOutwardEntryGrid screenFlag="gstEntry" />}
    />
    <Route
      path="gst-outward-confirmation/*"
      element={
        <GstOutwardEntryConfirmationGrid screenFlag="gstEntryConfirmation" />
      }
    />
    <Route path="dd-printing/*" element={<PlaySlipDraftPrinting />} />
    <Route path="fd-printing/*" element={<FdPrintDynamicNew />} />
    <Route path="cashier-exchange-entry/*" element={<CashierEntry />} />
    <Route path="account-close-process/*" element={<AccountCloseProcess />} />
    <Route
      path="account-close-confirmation/*"
      element={<AccountCloseConfirm />}
    />
    <Route path="fdpayint-master-entry/*" element={<FdInterestPaymentGrid />} />
    <Route
      path="fdpayint-master-confirmation/*"
      element={<FDInterestPaymentConfm />}
    />

    <Route
      path="standing-instruction-entry/*"
      element={<StandingInstructionGridWrapper />}
    />
    <Route
      path="standing-instruction-confirmation/*"
      element={<StandingInstructionConfirmationGridWrapper />}
    />
    <Route
      path="recint-calculator/*"
      element={<RecurringCalculatorFormWrapper />}
    />
    <Route path="emi-calculator/*" element={<EMICalculatorFormWrapper />} />
  </Routes>
);
