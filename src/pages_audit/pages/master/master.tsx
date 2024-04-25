import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const ClearingBankMst = lazy(() => import("./clearingBankMaster"));
const LienReasonMst = lazy(() => import("./lienReasonMaster"));
const AdvocateMstGrid = lazy(() => import("./advocateMaster"));

const Master = () => {
  return (
    <Routes>
      <Route path="clearing-bank-master/*" element={<ClearingBankMst />} />
      <Route path="lien-reason-master/*" element={<LienReasonMst />} />
      <Route path="advocate-master/*" element={<AdvocateMstGrid />} />
    </Routes>
  );
};
export default Master;
