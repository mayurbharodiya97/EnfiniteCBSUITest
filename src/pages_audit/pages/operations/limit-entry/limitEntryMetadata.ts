import { GeneralAPI } from "registry/fns/functions";
import { securityDropDownList } from "./api";

export const limitEntryMetaData = {
  form: {
    name: "limitEntry",
    label: "Limit Entry",
    resetFieldOnUnmount: false,
    validationRun: "onChange",
    submitAction: "home",
    hideHeader: true,
    formStyle: {
      background: "white",
      height: "calc(100vh - 390px)",
      overflowY: "auto",
      overflowX: "hidden",
    },
    render: {
      ordering: "sequence",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 4,
          md: 4,
        },
        container: {
          direction: "row",
          spacing: 1,
          height: "35vh",
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
    },
    // apiKey: {
    //   BRANCH_CD: "BRANCH_CD",
    //   ACCT_TYPE: "ACCT_TYPE",
    //   ACCT_CD: "ACCT_CD",
    // },
    // apiID: "GETLIMITENTRY",
  },
  fields: [
    {
      render: {
        componentType: "autocomplete",
      },
      name: "BRANCH_CD",
      label: "Branch",
      placeholder: "Branch Code",
      type: "text",
      required: true,
      isFieldFocused: true,
      // maxLength: 16,
      options: GeneralAPI.getBranchCodeList,
      _optionsKey: "getBranchCodeList",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Branch Code is required."] }],
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "ACCT_TYPE",
      label: "AccountType",
      placeholder: "EnterAccountType",
      type: "text",
      required: true,
      options: GeneralAPI.getAccountTypeList,
      _optionsKey: "getAccountTypeList",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Account Type is required."] }],
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_CD",
      label: "ACNo",
      placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      maxLength: 20,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Account No. is required."] }],
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_MST_TRN_BAL",
      label: "Tran. Balance",
      placeholder: "Balance",
      isFieldFocused: false,
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "NOHEQUE",
      label: "Limit Type",
      placeholder: "Limit Type",
      type: "text",
      options: () => {
        return [
          { value: "Nw", label: "Normal Limit" },
          { value: "Hf", label: "Ad-hoc Limit" },
        ];
      },
      _optionsKey: "getChequeLeavesList",
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
        lg: 2.5,
        xl: 2.5,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "SECURITY_VALUE",
      label: "Security",
      placeholder: "Security",
      type: "text",
      // isReadOnly: true,
      options: securityDropDownList,
      _optionsKey: "securityDropDownList",
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
        lg: 2.5,
        xl: 2.5,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SERRGE",
      label: "San. Limit",
      placeholder: "San. limit",
      type: "text",
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "GST",
      label: "Certi. No.",
      // placeholder: "Type",
      type: "text",
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
        lg: 2.5,
        xl: 2.5,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "GST",
      label: "Type",
      placeholder: "Type",
      type: "text",
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
        lg: 2.5,
        xl: 2.5,
      },
    },
    // {
    //   render: {
    //     componentType: "textField",
    //   },
    //   name: "REQUISITION_DT",
    //   // sequence: 9,
    //   label: "FD No.",
    //   placeholder: "FD Number",
    //   // dependentFields: ["SECURITY_VALUE"],
    //   // shouldExclude(fieldData, dependentFields, __) {
    //   //   if (dependentFields.SECURITY_VALUE.value === "") {
    //   //     return true;
    //   //   } else if (dependentFields.SECURITY_VALUE.value === "11") {
    //   //     return false;
    //   //   } else {
    //   //     return true;
    //   //   }
    //   // },
    //   GridProps: {
    //     xs: 12,
    //     md: 2.5,
    //     sm: 2.5,
    //     lg: 2.5,
    //     xl: 2.5,
    //   },
    // },
    {
      render: {
        componentType: "datePicker",
      },
      name: "REQUTION_DT",
      // sequence: 9,
      label: "Entry",
      placeholder: "",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "REQUTION_D",
      // sequence: 9,
      label: "Effective",
      placeholder: "",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "EXPIRY_DT",
      // sequence: 9,
      label: "Expiry",
      placeholder: "",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "RESOLUTION_DATE",
      // sequence: 9,
      label: "Resolution",
      placeholder: "",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_M",
      // sequence: 1,
      label: "Sec. Value",
      type: "text",
      placeholder: "Sec. Value",
      // required: true,
      // maxLength: 16,
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "REMAKS",
      // sequence: 10,
      label: "Margin %",
      placeholder: "Margin %",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "REMKS",
      // sequence: 10,
      label: "Sec. Limit",
      placeholder: "Sec. Limit",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARS",
      // sequence: 10,
      label: "Over Drawn %",
      placeholder: "Enter Remarks",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "EMARKS",
      // sequence: 10,
      label: "Int. Amount",
      placeholder: "Interest Amount",
      dependentFields: ["SECURITY_VALUE"],
      shouldExclude(fieldData, dependentFields, __) {
        if (
          dependentFields.SECURITY_VALUE.value === "12" ||
          dependentFields.SECURITY_VALUE.value === "16" ||
          dependentFields.SECURITY_VALUE.value === "19"
        ) {
          console.log("<<<if");
          return false;
        } else {
          return true;
        }
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARK",
      // sequence: 10,
      label: "Int. Margin %",
      placeholder: "Int. Margin %",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
      dependentFields: ["SECURITY_VALUE"],
      shouldExclude(fieldData, dependentFields, __) {
        if (
          dependentFields.SECURITY_VALUE.value === "12" ||
          dependentFields.SECURITY_VALUE.value === "16" ||
          dependentFields.SECURITY_VALUE.value === "19"
        ) {
          return false;
        } else {
          return true;
        }
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      // sequence: 10,
      label: "Sec. Int. Limit",
      placeholder: "Sec. Int. Limit",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
      dependentFields: ["SECURITY_VALUE"],
      shouldExclude(fieldData, dependentFields, __) {
        if (
          dependentFields.SECURITY_VALUE.value === "12" ||
          dependentFields.SECURITY_VALUE.value === "16" ||
          dependentFields.SECURITY_VALUE.value === "19"
        ) {
          return false;
        } else {
          return true;
        }
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LIMIT_AMOUNT",
      // sequence: 10,
      label: "Limit Amount",
      placeholder: "Limit Amount",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "INT_RATE",
      // sequence: 10,
      label: "Int. Rate",
      // placeholder: "Limit Amount",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      // sequence: 10,
      label: "Remarks",
      // placeholder: "Limit Amount",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DESCRIPTION",
      // sequence: 10,
      label: "Description",
      // placeholder: "Limit Amount",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DOCKET",
      // sequence: 10,
      label: "Docket No.",
      // placeholder: "Limit Amount",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CHARGE",
      // sequence: 10,
      label: "Charge",
      // placeholder: "Limit Amount",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "GST",
      // sequence: 10,
      label: "GST",
      // placeholder: "Limit Amount",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "RESOLUTION",
      // sequence: 10,
      label: "Resolution No.",
      // placeholder: "Limit Amount",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
  ],
};
