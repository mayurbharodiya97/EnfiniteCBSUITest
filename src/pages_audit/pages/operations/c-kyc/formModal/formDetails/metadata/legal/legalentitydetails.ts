import { isValid } from "date-fns";
import * as API from "../../../../api";
import { useTranslation } from "react-i18next";
const { t } = useTranslation();

export const entity_detail_legal_meta_data = {
  form: {
    name: "personal_legal_detail_prefix_details_form",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 6,
        },
        container: {
          direction: "row",
          spacing: 1,
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
      divider: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "SURNAME",
      label: "Entity Name",
      required: true,
      isFieldFocused: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      maxLength: 100,
      validate: (columnValue, allField, flag) =>
        API.TrimSpaceValidation(columnValue, allField, flag),
      // placeholder: "Prefix",
      type: "text",
      txtTransform: "uppercase",
      // GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      GridProps: { md: 4.5, lg: 3.6, xl: 3 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "SEARCH_BTN_ignoreField",
      label: "Search",
      endsIcon: "Search",
      rotateIcon: "scale(1.5)",
      placeholder: "",
      type: "text",
      dependentFields: ["SURNAME"],
      GridProps: { md: 1.5, lg: 1.2, xl: 1 },
    },
    // {
    //     render: {
    //         componentType: "formbutton"
    //     },
    //     name: "Search",
    // },
    // {
    //     render: {
    //         componentType: "formbutton"
    //     },
    //     name: "Cust.Info",
    // },
    {
      render: {
        componentType: "select",
      },
      name: "TRADE_CD",
      label: "Occupation",
      options: (dependentValue, formState, _, authState) =>
        API.getOccupationDTL(authState?.companyID, authState?.user?.branchCode),
      _optionsKey: "occupationOpdtl",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      // placeholder: "First Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      // dependentFields: ["DAILY_AMT"],
    },
    {
      render: {
        componentType: "select",
      },
      name: "SUB_CUST_TYPE",
      label: "Sub Customer Type",
      options: () => API.getPMISCData("SUB_CUST_TYPE"),
      _optionsKey: "getSubCustTypeOpdtl",
      // placeholder: "Middle Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "GROUP_CD",
      label: "Group",
      options: (dependentValue, formState, _, authState) =>
        API.getCustomerGroupOptions(
          authState?.companyID,
          authState?.user?.branchCode
        ),
      _optionsKey: "GroupOptionsdtl",
      // placeholder: "Last Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "RATE_CD",
      label: "Rating",
      options: (dependentValue, formState, _, authState) =>
        API.getRatingOpDTL(authState?.companyID, authState?.user?.branchCode),
      _optionsKey: "ratingOpdtl",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "BIRTH_DT",
      label: "Inception Date",
      placeholder: "",
      maxDate: new Date(),
      format: "dd/MM/yyyy",
      type: "text",
      schemaValidation: {
        type: "string",
        rules: [{ name: "typeError", params: ["Mustbeavaliddate"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "EXPLICIT_TDS",
      label: "Explicit TDS",
      options: [
        { label: "YES", value: "Y" },
        { label: "NO", value: "N" },
      ],
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
        componentType: "textField",
      },
      name: "GSTIN",
      label: "GSTIN",
      placeholder: "",
      maxLength: 20,
      type: "text",
      txtTransform: "uppercase",
      validate: (columnValue, allField, flag) => {
        const TIN_ISSUING_COUNTRY = flag?.TIN_ISSUING_COUNTRY;
        const TIN = flag?.TIN;
        if (!Boolean(columnValue?.value)) {
          if (Boolean(TIN_ISSUING_COUNTRY) && !Boolean(TIN)) {
            return "This field is required";
          } else {
            return "";
          }
        } else {
          return API.validateGSTIN(columnValue, allField, flag);
        }
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "KYC_REVIEW_DT",
      label: "KYC Revised Dt.",
      placeholder: "",
      format: "dd/MM/yyyy",
      maxDate: new Date(),
      type: "text",
      schemaValidation: {
        type: "string",
        rules: [{ name: "typeError", params: ["Mustbeavaliddate"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "RISK_CATEG",
      label: "Risk Category",
      options: () => API.getPMISCData("CKYC_RISK_CATEG"),
      _optionsKey: "kycRiskCategOpdtl",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "NATIONALITY",
      label: "Registered in Country",
      options: (dependentValue, formState, _, authState) =>
        API.getCountryOptions(
          authState?.companyID,
          authState?.user?.branchCode
        ),
      _optionsKey: "countryOptionsdtl",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "RESIDENCE_STATUS",
      label: "Resi. Status",
      options: () => API.getPMISCData("RESIDE_STATUS"),
      _optionsKey: "ResisdenceStatusdtl",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "US_GIIN",
      label: "GIIN",
      maxLength: 24,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 24) {
            return false;
          }
          return true;
        },
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "TIN",
      label: "TIN",
      placeholder: "",
      maxLength: 24,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 24) {
            return false;
          }
          return true;
        },
      },
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "TIN_ISSUING_COUNTRY",
      label: "TIN issuing Country",
      options: (dependentValue, formState, _, authState) =>
        API.getCountryOptions(
          authState?.companyID,
          authState?.user?.branchCode
        ),
      _optionsKey: "TINIssuingCountriesdtl",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CCIL_ID",
      label: "CCIL ID",
      maxLength: 24,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 24) {
            return false;
          }
          return true;
        },
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LEI_NO",
      label: "LEI NO.",
      txtTransform: "uppercase",
      maxLength: 24,
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 24) {
            return false;
          }
          return true;
        },
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "LEI_EXPIRY_DATE",
      label: "LEI Expiry Date",
      validate: (value) => {
        if (Boolean(value?.value) && !isValid(value?.value)) {
          return t("Mustbeavaliddate");
        }
        return "";
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "PARENT_COMPANY",
      label: "Parent Company",
      options: [
        { label: "YES", value: "Y" },
        { label: "NO", value: "N" },
      ],
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PARENT_COMP_NM",
      label: "Parent Company Name",
      txtTransform: "uppercase",
      maxLength: 100,
      placeholder: "",
      dependentFields: ["PARENT_COMPANY"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues["PARENT_COMPANY"]?.value === "Y") {
          return false;
        } else {
          return true;
        }
      },
      type: "text",
      // GridProps: {xs:12, sm:5, md: 4, lg: 2.4, xl:2},
      GridProps: { xs: 12, sm: 5, md: 5, lg: 5, xl: 4 },
    },
  ],
};
