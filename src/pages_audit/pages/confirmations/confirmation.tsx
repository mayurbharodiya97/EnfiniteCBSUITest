import { Routes, Route } from "react-router-dom";
import { ConfirmationGridWrapper } from ".";
import { ChargeTemplateMasterConfirm } from "../configurations/chargeTemplate";
import { DynamicBillerChargeConfirm } from "../configurations/dynamicBiller/billerChargeConfirmation";
import { DynamicBillerConfirm } from "../configurations/dynamicBiller/dynamicBillerConfirm";
import { MFSConfigConfirm } from "../configurations/mfsConfig/mfsConfigConfirmGrid";
import { PGWConfigConfirm } from "../configurations/pgwMerUser/pgwMerUserConfirmGrid";
import { SchemeMasterConfirm } from "../configurations/schemeMaster";
import { UserBlockConfirmGridWrapper } from "../configurations/userBlockConfig/Confirmation";

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

    <Route path="mfs-config-conf/*" element={<MFSConfigConfirm />} />
    <Route path="pgw-user-conf/*" element={<PGWConfigConfirm />} />
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
    <Route
      path="dynamic-biller/*"
      element={<DynamicBillerConfirm isDelete={"N"} />}
    />
    <Route
      path="delete-biller/*"
      element={<DynamicBillerConfirm isDelete={"Y"} />}
    />
    <Route
      path="biller-charge-acct/*"
      element={<DynamicBillerChargeConfirm />}
    />
    <Route
      path="operator-master/*"
      element={<ConfirmationGridWrapper screenFlag="operatorMaster" />}
    />
    <Route
      path="user-block-config/*"
      element={<UserBlockConfirmGridWrapper />}
    />
  </Routes>
);
