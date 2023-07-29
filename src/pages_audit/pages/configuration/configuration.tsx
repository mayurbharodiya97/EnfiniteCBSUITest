import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ClearCacheProvider } from "cache";

const DynamicGridConfig = lazy(() => import("./dynamicGridConfig"));

export const Configuration = () => (
  <Routes>
    <Route path="dynamic-grid-config/*" element={<DynamicGridConfig />} />
  </Routes>
);
