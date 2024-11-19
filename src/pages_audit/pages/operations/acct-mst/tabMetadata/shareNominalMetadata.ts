import * as API from "../api";
import { getPMISCData } from "../../c-kyc/api";

export const shareNominal_tab_metadata = {
  form: {
    name: "shareNominal_tab_form",
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
      name: "savingsdivider_ignoreField",
      label: "A/c Belongs to Director",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "DAY_BOOK_GRP_CD",
      label: "Name",
      options: () => API.getAdvDirectorNameTypeOP({ A_ROLE_IND: "D" }),
      _optionsKey: "directorNmShareOp",
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
      name: "DAY_BOOK_REVRS_GRP_CD",
      label: "Relationship",
      options: (dependentValue) => getPMISCData("RELATIONSHIP", dependentValue),
      _optionsKey: "relationshipShareOp",
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
      //come back
      render: {
        componentType: "textField", //come back
      },
      name: "APP_NO",
      label: "Share Appl. No.",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "divider",
      },
      name: "notextdivider_ignoreField",
      label: "",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
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
      _optionsKey: "categShareOp",
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
      label: "Dividend Class",
      options: (dependentValue, formState, _, authState) =>
        API.getRiskCategTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          FOR_SHARE: "Y",
        }),
      _optionsKey: "riskCategShareOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "SANCTION_DT",
      label: "Sanction/Meeting Date",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "LIMIT_AMOUNT",
      label: "Credit Value",
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
        componentType: "textField",
      },
      name: "RESOLUTION_NO",
      label: "Resolution No.",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "APPLIED_AMT",
      label: "ADM Fee",
      type: "text",
      // FormatProps: {
      //   allowNegative: true,
      // },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "TRADE_INFO",
      label: "Issue to Branch",
      options: [
        //come back
        { label: "Resident Individual", value: "A" },
        { label: "Legal Person/Entity Excluding 'C' and 'D'", value: "B" },
        { label: "Central/State Gov.", value: "C" },
        { label: "Central/State Gov. Owned Undertaking", value: "D" },
        { label: "Reporting Entity", value: "E" },
        { label: "Non Profit Organisation", value: "F" },
        { label: "Non-residential individual", value: "G" },
        { label: "Overseas corporate body/FII", value: "H" },
        { label: "Not categorised", value: "X" },
        { label: "Other", value: "Z" },
      ],
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
      name: "PURPOSE_CD",
      label: "Purpose",
      options: (dependentValue, formState, _, authState) =>
        API.getPurposeTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "purposeShareOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "TYPE_CD",
      label: "Share Membership Card",
      options: [
        //come back
        { label: "YES", value: "Y" },
        { label: "NO", value: "N" },
      ], //api
      // _optionsKey: "npaReasonTermLoanOp",
      placeholder: "",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField", //come back
      },
      name: "RECOMMENED_NM",
      label: "Hand-Over Remark",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "CUST_RISK_CATEG",
      label: "Risk Category",
      options: [],
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
  ],
};
