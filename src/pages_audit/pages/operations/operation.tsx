import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ClearCacheProvider } from "cache";
import CkycProvider from "./c-kyc/CkycContext";
import { DetailMastersData } from "../../../components/formcomponent/detailMaster/detailStatic";
// import { ChequebookTab } from "./chequeBookTab/chequebookTab";
// import { Ckyc } from "./c-kyc/ckyc";

const ChequeBookEntryForm = lazy(() => import("./chequeBook"));
const ChequebookTab = lazy(() => import("./chequeBookTab"));
const LimitEntry = lazy(() => import("./limit-entry"));
const Ckyc = lazy(() => import("./c-kyc"));
// const DetailMastersData = lazy(() => import("../components/formcomponent/detailMaster/detailStatic"));

export const OperationsMenu = () => (
  <Routes>
    {/* <Route path="chequebook-entry/*" element={<ChequeBookEntryForm />} /> */}
    <Route path="chequebook-entry/*" element={<ChequebookTab />} />
    <Route path="limit-entry/*" element={<LimitEntry />} />
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
  </Routes>
);
