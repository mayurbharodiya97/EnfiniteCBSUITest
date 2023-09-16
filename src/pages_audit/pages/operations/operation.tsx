import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ClearCacheProvider } from "cache";
import CkycProvider from "./c-kyc/CkycContext";
import { DetailMastersData } from "../../../components/formcomponent/detailMaster/detailStatic";
// import { Ckyc } from "./c-kyc/ckyc";

const ChequeBookEntryForm = lazy(() => import("./chequeBook"));
const Ckyc = lazy(() => import("./c-kyc"));
// const DetailMastersData = lazy(() => import("../components/formcomponent/detailMaster/detailStatic"));

export const OperationsMenu = () => (
  <Routes>
    {/* <Route path="chequebook-entry/*" element={<ChequeBookEntryForm />} /> */}
    <Route
      path="chequebook-entry/*"
      element={<DetailMastersData screenFlag="GETCHEQUEBOOK" />}
    />
    <Route
      path="detailMaster/*"
      element={<DetailMastersData screenFlag="GETACCTINQUIRY" />}
    />
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
