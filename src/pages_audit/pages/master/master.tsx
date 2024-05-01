import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const CategoryMasterGrid = lazy(() => import("./categoryMaster"));
const OrnamentTypeMasterGrid = lazy(() => import("./ornamentTypeMaster"));
const ActionTakenMasterGrid = lazy(() => import("./actionTakenMaster"));

const Master = () => {
  return (
    <Routes>
      <Route path="category-master/*" element={<CategoryMasterGrid />} />
      <Route
        path="ornament-type-master/*"
        element={<OrnamentTypeMasterGrid />}
      />
      <Route path="action-taken-master/*" element={<ActionTakenMasterGrid />} />
    </Routes>
  );
};

export default Master;
