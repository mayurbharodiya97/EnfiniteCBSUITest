import { Routes, Route } from "react-router-dom";
import { StaticAdminUserReports } from "./staticReports";
import { DynamicReportConfig } from "./dynamicReportConfig";
export const Reports = () => (
  <Routes>
    <Route path="dynamic-rpt-config/*" element={<DynamicReportConfig />} />
    <Route
      path="acct-deletion/*"
      element={<StaticAdminUserReports screenFlag="ACCTDELETIONRPT" />}
    />
    <Route
      path="login-history/*"
      element={<StaticAdminUserReports screenFlag="LOGINHISTORYRPT" />}
    />
    <Route
      path="reg-customers/*"
      element={<StaticAdminUserReports screenFlag="REGISTRATIONCUSTRPT" />}
    />
    <Route
      path="password-change/*"
      element={<StaticAdminUserReports screenFlag="PASSCHANGEHISTRPT" />}
    />
    <Route
      path="user-activity/*"
      element={<StaticAdminUserReports screenFlag="USERACTIVITYRPT" />}
    />
  </Routes>
);
