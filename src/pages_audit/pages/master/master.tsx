import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
const EntryDescription = lazy(() => import("./entrydescriptionmaster/"));
const InsuranceType = lazy(() => import("./insurancetypemaster/"));
const NpaCategory = lazy(() => import("./npaCateMast/"));
const CourtMaster = lazy(() => import("./courtmaster"));
const ClearingBankMst = lazy(() => import("./clearingBankMaster"));
const LienReasonMst = lazy(() => import("./lienReasonMaster"));
const AdvocateMstGrid = lazy(() => import("./advocateMaster"));
const LienMasterGrid = lazy(()=> import('./lienMaster/lienMasterGrid'))
const AcPeriodMasterGrid = lazy(()=> import('./ACperiodMaster/ACperiodMasterGrid'))
const ModeMasterGrid = lazy(()=> import('./modeMaster/modeMasterGrid'));
const BankIfscCodeMaster = lazy(()=> import('./bankIfscCodeMaster/bankIfscCodeMaasterGrid'));


const Master = () => {
  return (
    <>
      <Routes>
        <Route
          path="entry-description-master/*"
          element={<EntryDescription />}
        />
        <Route path="lien-master/*" element={<LienMasterGrid />} />
        <Route path="a/c-period-master/*" element={<AcPeriodMasterGrid />} />
        <Route path="mode-master/*" element={<ModeMasterGrid />} />
        <Route path="bank-Ifsc-Code-Master/*" element={<BankIfscCodeMaster />} />
        <Route path="insurance-type-master/*" element={<InsuranceType />} />
        <Route path="npa-category-master/*" element={<NpaCategory />} />
        <Route path="court-master/*" element={<CourtMaster />} />
        <Route path="clearing-bank-master/*" element={<ClearingBankMst />} />
        <Route path="lien-reason-master/*" element={<LienReasonMst />} />
        <Route path="advocate-master/*" element={<AdvocateMstGrid />} />

      </Routes>
    </>
  );
};
export default Master;
