import { Routes, Route } from "react-router-dom";
import { BankMasterGridWrapper } from "./bankMaster";
import { BranchMasterGridWrapper } from "./branchMaster";
import { ChargeTemplateMaster } from "./chargeTemplate";
import { DistMasterGridWrapper } from "./districtMaster";
import { DynamicBillers } from "./dynamicBiller";
import { MFSConfig } from "./mfsConfig";
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
import { ScreenNotesGridWrapper } from "./screenNotes";
import { MarqueMessageGrid } from "./marqueeMessage/marqueeMessageGrid";
import { FromSourceConfigGridWrapper } from "./fromSourceConfig";
import { AppVersionMasterGridWrapper } from "./appVersionMaster";
import { UserBlockConfigGridWrapper } from "./userBlockConfig";
import { MerchantMasterGridWrapper } from "./merchantMaster";
import { PgwMerUser } from "./pgwMerUser";
import { CardBinImage } from "./cardBinImage";
import { AtmLocMasterGridWrapper } from "./atmLocationMaster";
import { EmiscMasterGridWrapper } from "./emiscMaster";
import { BeneresMasterGridWrapper } from "./beneresMaster";
import { FdschemeMasterGridWrapper } from "./fdschemeMaster";
import { FileconfigMasterGridWrapper } from "./fileconfigMaster";
import { GuessPwdMasterGridWrapper } from "./guessPwdMaster";
// import { AtmLocMasterGridWrapper } from "./atmLocationMaster";

export const ConfigurationsMenu = () => (
  <Routes>
    <Route
      path="validation-msg/*"
      element={<ValidationMessagesGridWrapper />}
    />
    <Route path="charge-template/*" element={<ChargeTemplateMaster />} />
    <Route path="dynamic-biller/*" element={<DynamicBillers />} />
    <Route path="mfs-config/*" element={<MFSConfig />} />
    <Route path="pgw-user/*" element={<PgwMerUser />} />
    <Route path="card-bin-img/*" element={<CardBinImage />} />

    <Route path="merchant-add/*" element={<MerchantMasterGridWrapper />} />
    <Route path="service-config/*" element={<ServiceWiseConfigGridWrapper />} />
    <Route path="parameter/*" element={<ParametersGridWrapper />} />
    <Route path="para-confirm/*" element={<ParameterConfirmGridWrapper />} />
    <Route path="bank-master/*" element={<BankMasterGridWrapper />} />
    <Route path="branch-master/*" element={<BranchMasterGridWrapper />} />
    <Route path="district-master/*" element={<DistMasterGridWrapper />} />
    <Route path="atm-loc-upload/*" element={<AtmLocMasterGridWrapper />} />
    <Route path="e-misc-mst/*" element={<EmiscMasterGridWrapper />} />
    <Route path="bene-res/*" element={<BeneresMasterGridWrapper />} />
    <Route path="fd-config/*" element={<FdschemeMasterGridWrapper />} />
    <Route path="guide-line/*" element={<FileconfigMasterGridWrapper />} />
    <Route path="guess-pwd/*" element={<GuessPwdMasterGridWrapper />} />

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
    />
    <Route
      path="util-master/*"
      element={<OtherEntityMasters entityType="P" />}
    />
    <Route path="screen-notes/*" element={<ScreenNotesGridWrapper />} />
    <Route path="marquee-message/*" element={<MarqueMessageGrid />} />
    <Route
      path="from-source-config/*"
      element={<FromSourceConfigGridWrapper />}
    />
    <Route path="app-version-mst/*" element={<AppVersionMasterGridWrapper />} />
    <Route
      path="user-block-config/*"
      element={<UserBlockConfigGridWrapper />}
    />
  </Routes>
);
