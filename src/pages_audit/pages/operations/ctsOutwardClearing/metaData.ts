import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { GeneralAPI } from "registry/fns/functions";

export const CtsOutwardClearingMetadata = {
  form: {
    name: "CTS O/W Clearing",
    label: "CTS O/W Clearing",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    // allowColumnHiding: true,
    render: {
      ordering: "auto",
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
  },
  fields: [
    {
      render: {
        componentType: "datePicker",
      },
      name: "ENTRY_DATE",
      // sequence: 9,
      label: "Date",
      placeholder: "",
      defaultValue: new Date(),
      isFieldFocused: true,
      GridProps: { xs: 12, sm: 3, md: 3, lg: 2.2, xl: 1.5 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "ZONE_LIST",
      label: "Zone",
      placeholder: "Props Value",
      defaultValue: "0 CTS OUTWARD",
      GridProps: { xs: 12, sm: 3, md: 3, lg: 2.5, xl: 1.5 },
      runValidationOnDependentFieldsChange: true,
      skipDefaultOption: true,
      options: "getZoneListData",
      _optionsKey: "getZoneListData",
      requestProps: "ZONE_TRAN_TYPE",
      disableCaching: true,
      isFieldFocused: true,
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SLIP_NO",
      label: "Slip No.",
      placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      // required: true,
      // maxLength: 20,
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["Slip No. is required."] }],
      // },
      GridProps: { xs: 12, sm: 3, md: 3, lg: 2.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CLEARING_STATUS",
      label: "Status",
      placeholder: "",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      // required: true,
      // maxLength: 20,
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["Slip No. is required."] }],
      // },
      GridProps: { xs: 12, sm: 3, md: 3, lg: 2.5, xl: 1.5 },
    },
    // {
    //   render: {
    //     componentType: "spacer",
    //   },
    //   GridProps: {
    //     xs: 12,
    //     md: 2,
    //     sm: 4,
    //   },
    // },
    {
      render: {
        componentType: "textField",
      },
      name: "COMP_CD",
      label: "Company Code",
      placeholder: "Company Code",
      type: "text",
      required: true,
      // maxLength: 16,
      // options: GeneralAPI.getBranchCodeList,
      // _optionsKey: "getBranchCodeList",
      GridProps: { xs: 12, sm: 3, md: 2, lg: 2.5, xl: 1.5 },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Company Code is required."] }],
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BRANCH_CD",
      label: "Branch",
      placeholder: "Branch Code",
      type: "text",
      required: true,
      // maxLength: 16,
      // options: GeneralAPI.getBranchCodeList,
      // _optionsKey: "getBranchCodeList",
      GridProps: { xs: 12, sm: 3, md: 1.5, lg: 1.5, xl: 1.5 },
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
      GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 1.5 },
      isFieldFocused: true,
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["Account Type is required."] }],
      // },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "ACCT_CD",
      label: "ACNo",
      placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      // required: true,
      maxLength: 6,
      isFieldFocused: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ACNo is required."] }],
      },
      GridProps: { xs: 12, sm: 3, md: 3, lg: 2.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACC_NM",
      label: "AC Name",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      // required: true,
      // maxLength: 20,
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["Branch Code is required."] }],
      // },
      GridProps: { xs: 12, sm: 3, md: 3, lg: 4, xl: 1.5 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TRAN_BALANCE",
      label: "Trn.Balance",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 1.5 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "AMOUNT",
      label: "Amount",
      placeholder: "",
      isFieldFocused: true,
      type: "text",
      // isReadOnly: true,
      GridProps: { xs: 12, sm: 3, md: 3, lg: 2.5, xl: 1.5 },
    },
  ],
};

export const ClearingBankMasterFormMetadata = {
  form: {
    name: "ClearingBankMasterForm",
    label: "Clearing Bank Master",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
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
  },
  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "RBI_CODE",
      label: "RBI Code",
      placeholder: "",
      type: "text",
      maxLength: 20,
      required: true,
      GridProps: { xs: 6, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CODE",
      label: "Code",
      placeholder: "",
      type: "text",
      maxLength: 20,
      required: true,
      GridProps: { xs: 6, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BANK_CD",
      label: "Bank Name",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 100,
      showMaxLength: true,
      GridProps: { xs: 12, sm: 3, md: 4, lg: 4, xl: 1.5 },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "EXCLUDE",
      label: "Exclude",
      defaultValue: true,
      GridProps: { xs: 6, sm: 2, md: 1.5, lg: 1.5, xl: 1 },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "CTS",
      label: "CTS",
      defaultValue: true,
      GridProps: { xs: 6, sm: 2, md: 1.5, lg: 1.5, xl: 1 },
    },
  ],
};
