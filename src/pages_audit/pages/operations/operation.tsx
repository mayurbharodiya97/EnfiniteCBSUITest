import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ClearCacheProvider } from "cache";
import CkycProvider from "./c-kyc/CkycContext";
import { DetailMastersData } from "../../../components/formcomponent/detailMaster/detailStatic";
import { CkycConfirm } from "./c-kyc/confirmation/CkycConfirm";
import AcctMST from "./acct-mst/AcctMST";
import SingleDeno from "../dashboard/noteDenomination/singleDeno";

// import { ChequebookTab } from "./chequeBookTab/chequebookTab";
// import { Ckyc } from "./c-kyc/ckyc";

const ChequeBookEntryForm = lazy(() => import("./chequeBook"));
const ChequebookTab = lazy(() => import("./chequeBookTab"));
const LimitEntry = lazy(() => import("./limit-entry"));
const StockEntry = lazy(() => import("./stockEntry"));
const StoppaymentEntry = lazy(() => import("./stopPaymentEntry"));
const LienEntry = lazy(() => import("./lienEntry"));
const Ckyc = lazy(() => import("./c-kyc"));
const FixDepositForm = lazy(() => import("./fixDeposit"));
const CashReceiptEntry = lazy(
  () => import("pages_audit/pages/dashboard/noteDenomination/cashReceiptEntry")
);
const CtsOutwardClearing = lazy(() => import("./ctsOutwardClearing"));
// const DetailMastersData = lazy(() => import("../components/formcomponent/detailMaster/detailStatic"));

export const OperationsMenu = () => (
  <Routes>
    {/* <Route path="chequebook-entry/*" element={<ChequeBookEntryForm />} /> */}
    <Route path="chequebook-entry/*" element={<ChequebookTab />} />
    <Route path="limit-entry/*" element={<LimitEntry />} />
    <Route path="stock-entry/*" element={<StockEntry />} />
    <Route path="stop-pay-entry/*" element={<StoppaymentEntry />} />
    <Route path="lien-entry/*" element={<LienEntry />} />
    <Route path="teller/*" element={<CashReceiptEntry />} />
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
    {/* <Route
      path="chequebook-entry/*"
      element={<DetailMastersData screenFlag="GETCHEQUEBOOK" />}
    />
    <Route
      path="limit-entry/*"
      element={<DetailMastersData screenFlag="GETLIMITENTRY" />}
    />
    <Route
      path="lien-entry/*"
      element={<DetailMastersData screenFlag="GETLIENENTRY" />}
    />
    <Route
      path="stock-entry/*"
      element={<DetailMastersData screenFlag="GETSTOCKENTRY" />}
    />
    <Route
      path="stop-payment-entry/*"
      element={<DetailMastersData screenFlag="GETSTOPPAYMENTENTRY" />}
    /> */}
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
      element={<CtsOutwardClearing zoneTranType="S" />}
    />
    <Route path="fix-deposit/*" element={<FixDepositForm />} />
  </Routes>
);
