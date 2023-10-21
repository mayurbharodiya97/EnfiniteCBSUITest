import React from "react";
import { GeneralAPI } from "registry/fns/functions";

export const LienEntryMetadata = {
  form: {
    name: "PRIORITY",
    label: "Lien Entry",
    resetFieldOnUnmount: false,
    validationRun: "onChange",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 3,
          md: 3,
        },
        container: {
          direction: "row",
          spacing: 2,
        },
      },
    },
    componentProps: {
      datePicker: {
        fullWidth: true,
      },
      select: {
        fullWidth: true,
      },
      textField: {
        fullWidth: true,
      },
      numberFormat: {
        fullWidth: true,
      },
    },
    apiKey: {
      BRANCH_CD: "BRANCH_CD",
      ACCT_TYPE: "ACCT_TYPE",
      ACCT_CD: "ACCT_CD",
    },
    apiID: "GETLIENDATA",
  },
  fields: [
    {
      render: {
        componentType: "autocomplete",
      },
      name: "BRANCH_CD",
      label: "Branch",
      placeholder: "Branch",
      type: "text",
      isFieldFocused: true,
      required: true,
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
      label: "Account Type",
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
      label: "Account Number",
      placeholder: "EnterAcNo",
      type: "text",
      // fullWidth: true,
      required: true,
      // maxLength: 20,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Account no. is required."] }],
      },
      // padEnds: 20,/
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 3,
        xl: 3,
      },
      // dependentFields: ["BRANCH_CD", "ACCT_TYPE", "FROM_CHEQU"],
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      // sequence: 1,
      label: "Account Name",
      placeholder: "Account Name",
      type: "text",
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
        componentType: "autocomplete",
      },
      name: "FLAG",
      label: "Lien Code",
      defaultValue: "S",
      options: () => {
        return [
          { value: "S", label: "Stop Payment" },
          { value: "D", label: "Surrender Cheque" },
          { value: "P", label: "PDC" },
        ];
      },
      _optionsKey: "PAYABLE_AT_PAR",
      type: "text",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "CHEQUE_TO",
      label: "Line Amount",
      type: "text",
      placeholder: "Stock Description",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "REASON_CD",
      label: "Lien Status",
      // options: () => {
      //   return [
      //     { value: "", label: " " },
      //     { value: "", label: " " },
      //     { value: "", label: "" },
      //   ];
      // },
      // _optionsKey: "PAYAE_AT_PAR",
      type: "text",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CHEQUE_FROM",
      label: "Parent Code/Name",
      type: "text",
      placeholder: "Stock Description",
      GridProps: {
        xs: 12,
        md: 4.8,
        sm: 4.8,
        lg: 4.8,
        xl: 4.8,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "CHEQUE_DT",
      // sequence: 9,
      label: "Effective Date",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "CHEQUE_T",
      // sequence: 9,
      label: "Removal Date",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "FSWLAG",
      label: "Reason",
      // defaultValue: "S",
      options: () => {
        return [
          { value: "S", label: "Stop Payment" },
          { value: "D", label: "Surrender Cheque" },
          { value: "P", label: "PDC" },
        ];
      },
      _optionsKey: "PAYAB_AT_PAR",
      type: "text",
      GridProps: {
        xs: 12,
        md: 3.6,
        sm: 3.6,
        lg: 3.6,
        xl: 3.6,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "SERVICE_TAX",
      label: "Remarks",
      placeholder: "Remarks",
      type: "text",
      GridProps: {
        xs: 12,
        md: 3.6,
        sm: 3.6,
        lg: 3.6,
        xl: 3.6,
      },
    },
  ],
};
