import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ClearCacheProvider } from "cache";
import CkycProvider from "./c-kyc/CkycContext";
// import { Ckyc } from "./c-kyc/ckyc";

const ChequeBookEntryForm = lazy(() => import("./chequeBook"));
const Ckyc = lazy(() => import("./c-kyc"));

export const OperationsMenu = () => (
  <Routes>
    <Route path="chequebook-entry/*" element={<ChequeBookEntryForm />} />
    <Route path="ckyc/*" element={
      <CkycProvider>
        <Ckyc />
      </CkycProvider>
    } />
  </Routes>
);
