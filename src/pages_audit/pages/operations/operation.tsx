import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ClearCacheProvider } from "cache";

const ChequeBookEntryForm = lazy(() => import("./chequeBook"));

export const OperationsMenu = () => (
  <Routes>
    <Route path="chequebook-entry/*" element={<ChequeBookEntryForm />} />
  </Routes>
);
