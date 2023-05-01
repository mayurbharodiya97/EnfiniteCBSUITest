import { Routes, Route } from "react-router-dom";
import { BankMasterGridWrapper } from "./bankMaster";
import { BranchMasterGridWrapper } from "./branchMaster";
import { ChargeTemplateMaster } from "./chargeTemplate";
import { DistMasterGridWrapper } from "./districtMaster";
import { DynamicBillers } from "./dynamicBiller";
import { OperatorMasterGridWrapper } from "./operatorMaster";
import { EMailSMSTemplateGridWrapper } from "./emailSMSTemplate";
import { OtherEntityMasters } from "./otherEntityMasters";
import { ParametersGridWrapper } from "./parameter";
import { ParameterConfirmGridWrapper } from "./parameter/Confirmation";
import { SchemeMaster } from "./schemeMaster";
import { ServiceActiveConfigGridWrapper } from "./serviceActivateConfig";
import { ServiceWiseConfigGridWrapper } from "./serviceWiseConfig";
import { SourceParentGridWrapper } from "./sourceParentTypeMaster";
import { ValidationMessagesGridWrapper } from "./validationMessages";
import { CardCategoryMaster } from "./cardCategoryMaster";
export const ConfigurationsMenu = () => (
  <Routes>
    <Route
      path="validation-msg/*"
      element={<ValidationMessagesGridWrapper />}
    />
    <Route path="charge-template/*" element={<ChargeTemplateMaster />} />
    <Route path="dynamic-biller/*" element={<DynamicBillers />} />
    <Route path="service-config/*" element={<ServiceWiseConfigGridWrapper />} />
    <Route path="parameter/*" element={<ParametersGridWrapper />} />
    <Route path="para-confirm/*" element={<ParameterConfirmGridWrapper />} />
    <Route path="bank-master/*" element={<BankMasterGridWrapper />} />
    <Route path="branch-master/*" element={<BranchMasterGridWrapper />} />
    <Route path="district-master/*" element={<DistMasterGridWrapper />} />
    <Route
      path="service-active/*"
      element={<ServiceActiveConfigGridWrapper />}
    />
    <Route path="operator-master/*" element={<OperatorMasterGridWrapper />} />
    <Route path="email-template/*" element={<EMailSMSTemplateGridWrapper />} />
    <Route path="scheme-master/*" element={<SchemeMaster />} />
    <Route
      path="university-master/*"
      element={<OtherEntityMasters entityType="U" />}
    />
    <Route
      path="club-master/*"
      element={<OtherEntityMasters entityType="C" />}
    />
    <Route
      path="source-parent-type-master/*"
      element={<SourceParentGridWrapper />}
    />
    <Route path="cardcategory-mst/*" element={<CardCategoryMaster />} />
    <Route
      path="insurance-master/*"
      element={<OtherEntityMasters entityType="I" />}
    />{" "}
    <Route
      path="util-master/*"
      element={<OtherEntityMasters entityType="P" />}
    />
  </Routes>
);
