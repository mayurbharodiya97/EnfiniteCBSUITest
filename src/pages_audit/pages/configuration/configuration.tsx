import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ClearCacheProvider } from "cache";
import { StaticAdminUserReports } from "../reports/staticReports/staticReports";

const DynamicGridConfig = lazy(() => import("./dynamicGridConfig"));
const DynFormMetadataConfig = lazy(() => import("./dynFormMetadtaConfig"));
const CommunMSTConfig = lazy(() => import("./CommunMSTConfig"));
const LangWiseMessageConfig = lazy(
  () => import("./LangWiseMessageConfig/index")
);

export const Configuration = () => (
  <Routes>
    <Route path="dynamic-grid-config/*" element={<DynamicGridConfig />} />
    <Route path="dynamic-form-metadata/*" element={<DynFormMetadataConfig />} />
    <Route path="langWise-msg-config/*" element={<LangWiseMessageConfig />} />
    <Route path="misc-mst-config/*" element={<CommunMSTConfig />} />
    {/* <Route
      path="misc-mst-config/*"
      element={<StaticAdminUserReports screenFlag="GETPROPMISCDATA" />}
    /> */}
  </Routes>
);
