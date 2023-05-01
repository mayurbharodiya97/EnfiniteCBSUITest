import { Routes, Route } from "react-router-dom";
import { ConfirmationGridWrapper } from ".";
import { ChargeTemplateMasterConfirm } from "../configurations/chargeTemplate";
import { DynamicBillerConfirm } from "../configurations/dynamicBiller/dynamicBillerConfirm";
import { SchemeMasterConfirm } from "../configurations/schemeMaster";

export const ConfirmationMenu = () => (
  <Routes>
    <Route
      path="user-limit/*"
      element={<ConfirmationGridWrapper screenFlag="userLimit" />}
    />
    <Route
      path="pass_reset/*"
      element={<ConfirmationGridWrapper screenFlag="passReset" />}
    />
    <Route
      path="cust_activation/*"
      element={<ConfirmationGridWrapper screenFlag="custActivation" />}
    />
    <Route
      path="service-config/*"
      element={<ConfirmationGridWrapper screenFlag="serviceConfig" />}
    />
    <Route path="charge-template/*" element={<ChargeTemplateMasterConfirm />} />
    <Route path="scheme-master/*" element={<SchemeMasterConfirm />} />
    <Route path="dynamic-biller/*" element={<DynamicBillerConfirm />} />
  </Routes>
);
