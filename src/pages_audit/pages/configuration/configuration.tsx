import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ClearCacheProvider } from "cache";

const DynamicGridConfig = lazy(() => import("./dynamicGridConfig"));
const DynFormMetadataConfig = lazy(() => import("./dynFormMetadtaConfig"));
const LangWiseMessageConfig = lazy(
  () => import("./LangWiseMessageConfig/index")
);

export const Configuration = () => (
  <Routes>
    <Route path="dynamic-grid-config/*" element={<DynamicGridConfig />} />
    <Route path="dynamic-form-metadata/*" element={<DynFormMetadataConfig />} />
    <Route path="langWise-msg-config/*" element={<LangWiseMessageConfig />} />
  </Routes>
);
