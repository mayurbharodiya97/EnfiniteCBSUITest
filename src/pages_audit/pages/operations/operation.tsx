import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ClearCacheProvider } from "cache";
// import { Ckyc } from "./c-kyc/ckyc";

const ChequeBookEntryForm = lazy(() => import("./chequeBook"));
const Ckyc = lazy(() => import("./c-kyc"));

export const OperationsMenu = () => (
  <Routes>
    <Route path="chequebook-entry/*" element={<ChequeBookEntryForm />} />
    <Route path="ckyc/*" element={<Ckyc />} />
  </Routes>
);
