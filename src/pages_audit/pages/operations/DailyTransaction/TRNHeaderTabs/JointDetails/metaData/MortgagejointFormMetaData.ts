import {
  getAdvocateTypeOp,
  getGuardianorRelationTypeOp,
  getMortgageTypeOp,
  getSecurityTypeOP,
  getValuerTypeOp,
} from "pages_audit/pages/operations/acct-mst/api";
import { getOptionsOnPinParentArea } from "pages_audit/pages/operations/c-kyc/api";

export const MortgagejointFormMetaData = {
  form: {
    name: "mortgage_form",
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
          sm: 12,
          md: 12,
          lg: 12,
          xl: 12,
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
      name: "referenceDivider_ignoreField",
      label: "Reference",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CUSTOMER_ID",
      label: "Customer Id",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "JOINT_DISC",
      label: "Type",
      fullWidth: true,
      GridProps: { xs: 6, sm: 4, md: 3, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "MORTGAGE_ID",
      label: "Mortgage No",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "divider",
      },
      name: "MembershipDivider_ignoreField",
      label: "Membership",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MEM_ACCT_TYPE",
      label: "A/C No.",
      placeholder: "COMP CD",
      GridProps: { xs: 12, sm: 2, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MEM_ACCT_CD",
      label: "",
      placeholder: "BRANCH CD",
      GridProps: { xs: 12, sm: 2, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SHARE_ACCT_TYPE",
      label: "",
      placeholder: "A/C Type",
      GridProps: { xs: 12, sm: 2, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SHARE_ACCT_CD",
      label: "",
      placeholder: "A/C No.",
      GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 1.5 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "CRDT_WORTHINESS_ignoreField",
      label: "Credit Worthiness",
      type: "text",
      GridProps: { xs: 1.5, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "divider",
      },
      name: "PersonaldtlDivider_ignoreField",
      label: "personaldtlDivider",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "rateOfInt",
      },
      name: "SHARE_PER",
      label: "Share %",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REF_PERSON_NAME",
      label: "Person Name",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "dob",
      },
      name: "BIRTH_DATE",
      label: "Birth Date",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "GENDER",
      label: "Gender",
      options: [
        { label: "MALE", value: "M" },
        { label: "FEMALE", value: "F" },
        { label: "OTHER", value: "O" },
        { label: "TRANSGENDER", value: "T" },
      ],
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "DESIGNATION",
      label: "Designation/Relation",
      options: (dependentValue, formState, _, authState) =>
        getGuardianorRelationTypeOp({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "designCollateralOp",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD1",
      label: "Line1",
      required: true,
      maxLength: 50,
      placeholder: "",
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 5, md: 3.2, lg: 3.2, xl: 3.3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD2",
      label: "Line2",
      placeholder: "",
      maxLength: 50,

      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 5, md: 3.2, lg: 3.2, xl: 3.3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD3",
      label: "Line3",
      placeholder: "",
      maxLength: 50,

      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 5, md: 3.2, lg: 3.2, xl: 3.3 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "PIN_CODE",
      label: "PIN",
      required: true,
      maxLength: 6,
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      runPostValidationHookAlways: false,
      name: "AREA_CD",
      label: "SubArea",
      dependentFields: ["PIN_CODE"],
      disableCaching: true,
      options: (dependentValue, formState, _, authState) =>
        getOptionsOnPinParentArea(_?.PIN_CODE?.value, formState, _, authState),
      _optionsKey: "indSubareaMaiwejfjwefnOpjoint",
      setValueOnDependentFieldsChange: (dependentFields) => {
        const pincode = dependentFields?.PIN_CODE?.value;
        if (Boolean(pincode)) {
          if (pincode.length < 6) {
            return "";
          }
        } else return null;
      },
      postValidationSetCrossFieldValues: (
        field,
        __,
        ___,
        dependentFieldsValues
      ) => {
        if (field.value) {
          let values = {
            CITY_CD: {
              value: field?.optionData[0]?.CITY_CD
                ? field?.optionData[0]?.CITY_CD
                : "",
            },
            CITY_ignoreField: {
              value: field?.optionData[0]?.CITY_NM
                ? field?.optionData[0]?.CITY_NM
                : "",
            },
            DISTRICT_CD: {
              value: field?.optionData[0]?.DISTRICT_CD
                ? field?.optionData[0]?.DISTRICT_CD
                : "",
            },
            DISTRICT_ignoreField: {
              value: field?.optionData[0]?.DISTRICT_NM
                ? field?.optionData[0]?.DISTRICT_NM
                : field?.optionData[0]?.DISTRICT_CD
                ? field?.optionData[0]?.DISTRICT_CD
                : "",
            },
            STATE: { value: field?.optionData[0]?.STATE_NM ?? "" },
            COUNTRY: { value: field?.optionData[0]?.COUNTRY_NM ?? "" },
            STATE_CD: { value: field?.optionData[0]?.STATE_CD ?? "" },
            COUNTRY_CD: { value: field?.optionData[0]?.COUNTRY_CD ?? "" },
          };
          return values;
        }
        return {};
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CITY_ignoreField",
      label: "City",
      isReadOnly: true,
      placeholder: "",
      type: "text",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields["AREA_CD"]?.optionData;
        if (optionData && optionData.length > 0) {
          return optionData[0].CITY_NM;
        } else return "";
      },
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "CITY_CD",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields["AREA_CD"]?.optionData;
        if (optionData && optionData.length > 0) {
          return optionData[0].CITY_CD;
        } else return "";
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DISTRICT_ignoreField",
      label: "District Name",
      isReadOnly: true,
      placeholder: "",
      type: "text",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields["AREA_CD"]?.optionData;
        if (optionData && optionData.length > 0) {
          return optionData[0].DISTRICT_NM;
        } else return "";
      },
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "DISTRICT_CD",
      label: "hidden district",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields["AREA_CD"]?.optionData;
        if (optionData && optionData.length > 0) {
          return optionData[0].DISTRICT_CD;
        } else return "";
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "STATE",
      label: "State",
      isReadOnly: true,
      placeholder: "",
      type: "text",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields["AREA_CD"]?.optionData;
        if (optionData && optionData.length > 0) {
          return optionData[0].STATE_NM;
        } else return "";
      },
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "COUNTRY",
      label: "Country",
      isReadOnly: true,
      placeholder: "",
      type: "text",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields["AREA_CD"]?.optionData;
        if (optionData && optionData.length > 0) {
          return optionData[0].COUNTRY_NM;
        } else return "";
      },
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "STATE_CD",
      label: "UnionTerritoriesCode",
      isReadOnly: true,
      placeholder: "",
      type: "text",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields["AREA_CD"]?.optionData;
        if (optionData && optionData.length > 0) {
          return optionData[0].STATE_CD;
        } else return "";
      },
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "COUNTRY_CD",
      label: "CountryCode",
      isReadOnly: true,
      placeholder: "",
      type: "text",
      dependentFields: ["AREA_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        const optionData = dependentFields["AREA_CD"]?.optionData;
        if (optionData && optionData.length > 0) {
          return optionData[0].COUNTRY_CD;
        } else return "";
      },
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CKYC_NUMBER",
      label: "CKYC No",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "MOBILE_NO",
      label: "Mobile No.",
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "PHONE",
      label: "Phone",
      GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "aadharCard",
      },
      name: "UNIQUE_ID",
      label: "UIDAadhaar",
      placeholder: "1111 1111 1111",
      required: true,
      type: "text",
      maxLength: 12,
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "FORM_60",
      label: "Form6061",
      placeholder: "",
      defaultValue: "N",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      options: [
        { label: "Form 61", value: "F" },
        { label: "No", value: "N" },
      ],
    },
    {
      render: {
        componentType: "panCard",
      },
      name: "PAN_NO",
      label: "PanNo",
      placeholder: "AAAAA1111A",
      type: "text",
      txtTransform: "uppercase",
      required: true,
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      maxLength: 10,
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      label: "Remarks",
      maxLength: 300,
      GridProps: { xs: 12, sm: 6, md: 6, lg: 4.7, xl: 4 },
    },
    {
      render: {
        componentType: "divider",
      },
      name: "MortgageDivider_ignoreField",
      label: "Mortgage/Hypothication/Security Detail",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "mort_description",
      label: "Description",
      maxLength: 200,
      GridProps: { xs: 12, sm: 6, md: 6, lg: 4.7, xl: 4 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "PROPERTY_ignoreField",
      label: "PROPERTY",
      type: "text",
      GridProps: { lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "MORT_TYPE",
      label: "Mort. Type",
      options: (dependentValue, formState, _, authState) =>
        getMortgageTypeOp({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "mortTypeCollateralOp",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "SECURITY_TYPE",
      label: "Security Type",
      options: [
        { label: "Prime", value: "P" },
        { label: "Collateral", value: "C" },
      ],
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "SECURITY_CD",
      label: "Security",
      options: (dependentValue, formState, _, authState) =>
        getSecurityTypeOP({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "securityCollateralOp",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "OTHRSECURITY_ignoreField",
      label: "OTHER SECURITY",
      type: "text",
      GridProps: { lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "MORT_AMT",
      label: "Cost/Value",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "divider",
      },
      name: "ValuerDivider_ignoreField",
      label: "Valuer",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "VALUER_CODE",
      label: "Name",
      options: (dependentValue, formState, _, authState) =>
        getValuerTypeOp({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "valuerCollateralOp",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "VALUATION_DT",
      label: "Valuation Date",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "MACHINERY_ignoreField",
      label: "MACHINERY",
      type: "text",
      GridProps: { lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "VALUE_AMT",
      label: "Value",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "divider",
      },
      name: "TitleClearanceDivider_ignoreField",
      label: "Title Clearance",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "ADVOCATE_CODE",
      label: "Advocate",
      options: (dependentValue, formState, _, authState) =>
        getAdvocateTypeOp({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "advocateCollateralOp",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "TITLE_CLEAR_DT",
      label: "Clearance Date",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
  ],
};
