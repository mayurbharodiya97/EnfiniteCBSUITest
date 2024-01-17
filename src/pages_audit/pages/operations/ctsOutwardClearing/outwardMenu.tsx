import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { RetrieveClearing } from "./retrieveClearingData";
import CtsOutwardClearing from ".";

export const CtsOutwardMenu = () => {
  return (
    <Routes>
      <Route path="/*" element={<CtsOutwardClearing zoneTranType="S" />} />
      <Route path="/retrieve" element={<RetrieveClearing zoneTranType="S" />} />
    </Routes>
  );
};
