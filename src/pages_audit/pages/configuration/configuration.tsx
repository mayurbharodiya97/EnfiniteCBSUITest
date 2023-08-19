import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ClearCacheProvider } from "cache";

const DynamicGridConfig = lazy(() => import("./dynamicGridConfig"));
const LangWiseMessageConfig = lazy(
  () => import("./LangWiseMessageConfig/index")
);

export const Configuration = () => (
  <Routes>
    <Route path="dynamic-grid-config/*" element={<DynamicGridConfig />} />
    <Route path="langWise-msg-config/*" element={<LangWiseMessageConfig />} />
  </Routes>
);
