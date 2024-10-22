import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const StaticAdminUserReports = lazy(() => import("./staticReports"));

export const Reports = () => (
  <Routes>
    <Route path="*" element={<StaticAdminUserReports />} />
  </Routes>
);
