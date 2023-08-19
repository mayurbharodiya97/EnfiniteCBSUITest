import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ClearCacheProvider } from "cache";
import { TradeMasterGridForm } from "./masterGrid";

export const MastersMenu = () => (
  <Routes>
    <Route
      path="trade-master/:id/*"
      element={
        <TradeMasterGridForm
          screenFlag={"TradeMaster"}
          isAddButton={true}
          isDeleteButton={false}
        />
      }
    />
  </Routes>
);
