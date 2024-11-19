import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
// import { StaticAdminUserReports } from "./staticReports";
// import { DynamicReportConfig } from "./dynamicReportConfig";

const StaticAdminUserReports = lazy(() => import("./staticReports"));
// const DynamicReportConfig = lazy(() => import("./dynamicReportConfig"));

export const Reports = () => (
  <Routes>
    {/* <Route path="dynamic-rpt-config/*" element={<DynamicReportConfig />} /> */}
    <Route
      path="acct-deletion/*"
      element={<StaticAdminUserReports screenFlag="ACCOUNTDELETION" />}
    />
    <Route
      path="admin-user-activity/*"
      element={<StaticAdminUserReports screenFlag="ADMINUSERACTIVITY" />}
    />
    <Route
      path="user-app-history/*"
      element={<StaticAdminUserReports screenFlag="USERTBGLOG" />}
    />
    <Route
      path="misc-mst-config/*"
      element={<StaticAdminUserReports screenFlag="GETPROPMISCDATA" />}
    />
  </Routes>
);
