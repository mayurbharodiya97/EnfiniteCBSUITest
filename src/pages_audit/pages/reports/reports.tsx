import { Routes, Route } from "react-router-dom";
import { DynamicReportConfig } from "./dynamicReportConfig";
import { DynamicReports } from "./dynamicReports";
export const Reports = () => (
  <Routes>
    <Route path="dynamic-rpt-config/*" element={<DynamicReportConfig />} />
  </Routes>
);
