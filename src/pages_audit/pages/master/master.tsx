import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
const EntryDescription = lazy(() => import("./entrydescriptionmaster/"));
const InsuranceType = lazy(() => import("./insurancetypemaster/"));
const NpaCategory = lazy(() => import("./npaCateMast/"));
const CourtMaster = lazy(() => import("./courtmaster"));

const Master = () => {
  return (
    <>
      <Routes>
        <Route
          path="entry-description-master/*"
          element={<EntryDescription />}
        />
        <Route path="insurance-type-master/*" element={<InsuranceType />} />
        <Route path="npa-category-master/*" element={<NpaCategory />} />
        <Route path="court-master/*" element={<CourtMaster />} />
      </Routes>
    </>
  );
};

export default Master;
