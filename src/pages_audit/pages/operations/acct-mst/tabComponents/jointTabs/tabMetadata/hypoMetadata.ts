import * as API from "../../../api";
import { getPMISCData } from "../../../../c-kyc/api";

export const hypothication_metadata = {
  form: {
    name: "hypothication_tab_form",
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
        componentType: "Divider",
      },
      dividerText: "Recommended By",
      name: "recommendbydivider_ignoreField",
      label: "",
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "RECOMMENED_NM",
      label: "Name",
      placeholder: "",
      options: () => API.getAdvDirectorNameTypeOP({ A_ROLE_IND: "R" }),
      _optionsKey: "recommendNmHypoOp",
      // defaultValue: "N",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "SANCTIONED_BY",
      label: "Sanctioned By",
      placeholder: "",
      options: () => API.getAdvDirectorNameTypeOP({ A_ROLE_IND: "S" }),
      _optionsKey: "sanctionByHypoOp",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
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
        componentType: "Divider",
      },
      dividerText: "Advances Belongs to Director",
      name: "recommendbydivider_ignoreField",
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
      _optionsKey: "directorNmHypoOp",
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
      name: "DAY_BOOK_REVRS_GRP_CD",
      label: "Relationship",
      options: (dependentValue) => getPMISCData("RELATIONSHIP", dependentValue),
      _optionsKey: "relationshipHypoOp",
      placeholder: "",
      type: "text",
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
      _optionsKey: "ptsHypoOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
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
      _optionsKey: "categHypoOp",
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
      name: "SECURITY_CD",
      label: "Security",
      options: (dependentValue, formState, _, authState) =>
        API.getSecurityTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "securityHypoOp",
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
      _optionsKey: "purposeHypoOp",
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
      _optionsKey: "parPriorityHypoOp",
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
      _optionsKey: "mainPriorityHypoOp",
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
      _optionsKey: "weakerPrioHypoOp",
      disableCaching: true,
      // _optionsKey: "weakerTermLoanOp",
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
      name: "NPA_CD",
      label: "NPA",
      options: (dependentValue, formState, _, authState) =>
        API.getNPATypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "npaHypoOp",
      placeholder: "",
      type: "text",
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
      name: "NPA_REASON",
      label: "Forcefully NPA Reason",
      options: (dependentValue) => getPMISCData("npa_reason"),
      _optionsKey: "npaReasonHypoOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "NO_OF_LEAVES",
      label: "Insurance",
      options: [
        { label: "Bank", value: "0" },
        { label: "Waiver", value: "99999" },
      ],
      // _optionsKey: "npaReasonTermLoanOp",
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
      name: "INST_DUE_DT",
      label: "Due Date",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      shouldExclude: (initialValue, original, prevRows, nextRows) => {
        const GPARAM155 = prevRows?.GPARAM155;
        if (Boolean(GPARAM155)) {
          if (GPARAM155 === "Y") {
            return true;
          } else if (GPARAM155 === "N") {
            return false;
          }
        }
        return false;
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "landDTL_ignoreField",
      label: "Land Detail",
      placeholder: "",
      type: "text",
      GridProps: { lg: 1, xl: 1 },
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
      name: "AGENT_CD",
      label: "Agent",
      options: (dependentValue, formState, _, authState) =>
        API.getAgentTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "agentHypoOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "Divider",
      },
      dividerText: "Rates(%)",
      name: "recommendbydivider_ignoreField",
      label: "",
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "RATE_WEF",
      label: "W.E.F.",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
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
        componentType: "textField",
      },
      name: "RATING_CD",
      label: "Rating",
      isReadOnly: true,
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
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
        componentType: "rateOfInt",
      },
      name: "STOCK_EXPIRY_PENAL_RT",
      label: "Stock Expiry Penal",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "rateOfInt",
      },
      name: "INSURANCE_EXPIRY_PENAL_RT",
      label: "Insurance Expiry Penal",
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
        componentType: "textField",
      },
      name: "FILE_NO",
      label: "File No.",
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
      _optionsKey: "riskCategHypoOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    // {
    //     render: {
    //         componentType: "numberFormat",
    //     },
    //     name: "INST_NO",
    //     label: "No. of Installment",
    //     maxLength: 6, //5
    //     FormatProps: {
    //         isAllowed: (values) => {
    //             if (values?.value?.length > 6) {
    //             return false;
    //             }
    //             return true;
    //         },
    //     },
    //     validate: (columnValue) => {
    //         const PIN = columnValue.value
    //         if(Boolean(PIN) && PIN.length<6) {
    //             return "Pin code should be of six digits"
    //         }
    //     },
    //     placeholder: "",
    //     type: "text",
    //     GridProps: {xs:12, sm:4, md:2.4, lg: 2.4, xl:2},
    // },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "INST_NO",
      label: "Chq. Sign Autho",
      options: (dependentValue, formState, _, authState) =>
        API.getCheqSignAuthoTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "chqSignAuthoHypoOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "formbutton",
      },
      name: "landDTL_ignoreField",
      label: "Ornament",
      placeholder: "",
      type: "text",
      GridProps: { lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PACKET_NO",
      label: "Packet No.",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DESCRIPTION",
      label: "Description",
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
        componentType: "formbutton",
      },
      name: "letterofCont_ignoreField",
      label: "Letter of Continuity Detail",
      placeholder: "",
      type: "text",
      GridProps: { lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LAST_OVERDUE",
      label: "Overdue",
      isReadOny: true,
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
      _optionsKey: "industryHypoOp",
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
      _optionsKey: "RECREHypoOp",
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
      _optionsKey: "businessHypoOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "DATE_OF_COMMENCEMENT",
      label: "Commencement Date of Commercial Operation",
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
      name: "PRODUCTION_YES_NO",
      label: "Production Start",
      options: [
        { label: "YES", value: "Y" },
        { label: "NO", value: "N" },
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
  ],
};
