import * as API from "../api";
import { getPMISCData } from "../../c-kyc/api";

export const current_tab_metadata = {
  form: {
    name: "current_tab_form",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "sequence",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 6,
        },
        container: {
          direction: "row",
          spacing: 0.5,
        },
      },
    },
    componentProps: {
      textField: {
        fullWidth: true,
      },
      select: {
        fullWidth: true,
      },
      datePicker: {
        fullWidth: true,
      },
      numberFormat: {
        fullWidth: true,
      },
      inputMask: {
        fullWidth: true,
      },
      datetimePicker: {
        fullWidth: true,
      },
      Divider: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "divider",
      },
      dividerText: "A/c Belongs to Director",
      name: "savingsdivider_ignoreField",
      label: "",
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "DAY_BOOK_GRP_CD",
      label: "Name",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      options: () => API.getAdvDirectorNameTypeOP({ A_ROLE_IND: "D" }),
      _optionsKey: "directorNmCurrentOp",
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "DAY_BOOK_REVRS_GRP_CD",
      label: "Relationship",
      options: (dependentValue) => getPMISCData("RELATIONSHIP", dependentValue),
      _optionsKey: "relationshipCurrentOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PATH_SIGN",
      label: "Nature of Interest",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "INST_NO",
      label: "Chq. Sign Autho",
      placeholder: "",
      // defaultValue: "N",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      options: (dependentValue, formState, _, authState) =>
        API.getCheqSignAuthoTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "chqSignAuthoCurrentOp",
    },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "CATEG_CD",
      label: "Category",
      options: (dependentValue, formState, _, authState) =>
        API.getCategoryTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "categCurrentOp",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "CLASS_CD",
      label: "Risk Category",
      options: (dependentValue, formState, _, authState) =>
        API.getRiskCategTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "riskCategCurrentOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "divider",
      },
      dividerText: "Rates",
      name: "recommendbydivider_ignoreField",
      label: "",
    },
    {
      render: {
        componentType: "rateOfInt",
      },
      name: "INT_RATE",
      label: "Interest",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "rateOfInt",
      },
      name: "PENAL_RATE",
      label: "Penal",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "AGENT_CD",
      label: "Agent",
      options: (dependentValue, formState, _, authState) =>
        API.getAgentTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "agentCurrentOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "rateOfInt",
      },
      name: "CR_INT",
      label: "Int. on Credit Balance",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "rateOfInt",
      },
      name: "AG_CLR_RATE",
      label: "Against Clearing Rate",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "LST_INT_COMPUTE_DT",
      label: "Last Int. Applied",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "OD_APPLICABLE",
      label: "OD Applicable",
      options: [
        { label: "Allow", value: "Y" },
        { label: "Not Allow", value: "N" },
        { label: "As per Type", value: "T" },
      ],
      // _optionsKey: "npaReasonTermLoanOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "AGAINST_CLEARING",
      label: "Against Clearing",
      options: [
        { label: "Allow", value: "Y" },
        { label: "Not Allow", value: "N" },
        { label: "As per Type", value: "T" },
      ],
      // _optionsKey: "npaReasonTermLoanOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "TYPE_CD",
      label: "Cheque Book",
      options: [
        { label: "YES", value: "Y" },
        { label: "NO", value: "N" },
      ], //api
      // _optionsKey: "npaReasonTermLoanOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "INT_TYPE",
      label: "Int. Type",
      options: [
        { label: "Monthly", value: "M" },
        { label: "Quarterly", value: "Q" },
        { label: "Half-Yearly", value: "H" },
        { label: "Yearly", value: "Y" },
        { label: "On Expiry", value: "E" },
      ],
      // _optionsKey: "npaReasonTermLoanOp",
      placeholder: "",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "PTS",
      label: "Segment / PTS",
      options: (dependentValue, formState, _, authState) =>
        API.getSegmentPTSOp({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "ptsCurrentOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "PURPOSE_CD",
      label: "Purpose",
      options: (dependentValue, formState, _, authState) =>
        API.getPurposeTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "purposeCurrentOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "PARENT_GROUP",
      label: "Priority",
      options: (dependentValue, formState, _, authState) =>
        API.getPrioritParentTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "parPriorityCurrentOp",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "PRIO_CD",
      label: "",
      dependentFields: ["PARENT_GROUP"],
      options: (dependentValue, formState, _, authState) =>
        API.getPrioritMainTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          dependentValue: dependentValue,
        }),
      _optionsKey: "mainPriorityCurrentOp",
      disableCaching: true,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "SUB_PRIO_CD",
      label: "Weaker",
      dependentFields: ["PRIO_CD"],
      options: (dependentValue, formState, _, authState) =>
        API.getPriorityWeakerTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          dependentValue: dependentValue,
        }),
      _optionsKey: "weakerPrioCurrentOp",
      disableCaching: true,
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PRIORITY_CD",
      label: "",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "SECURITY_CD",
      label: "Security",
      options: (dependentValue, formState, _, authState) =>
        API.getSecurityTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "securityCurrentOp",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "INDUSTRY_CD",
      label: "Industry",
      options: (dependentValue, formState, _, authState) =>
        API.getIndustryTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "industryCurrentOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "RECRE_CD",
      label: "RECRE",
      options: (dependentValue, formState, _, authState) =>
        API.getRECRETypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "RECRECurrentOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "BUSINESS_CD",
      label: "Business",
      options: (dependentValue, formState, _, authState) =>
        API.getBusinessypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "businessCurrentOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SANCTIONED_AMT",
      label: "Sanctioned",
      type: "text",
      FormatProps: {
        allowNegative: true,
      },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "SANCTION_DT",
      label: "Sanction",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "NPA_DT",
      label: "NPA Date",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "NPA_CD",
      label: "NPA",
      options: (dependentValue, formState, _, authState) =>
        API.getNPATypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "npaCurrentOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "NPA_REASON",
      label: "Forcefully NPA Reason",
      options: (dependentValue) => getPMISCData("npa_reason"),
      _optionsKey: "npaReasonCurrentOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
  ],
};
