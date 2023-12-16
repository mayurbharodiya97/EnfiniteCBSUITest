import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { GeneralAPI } from "registry/fns/functions";
import { getAccountName, getSlipNumber } from "./api";
import { format } from "date-fns";

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
      name: "TRAN_DT",
      // sequence: 9,
      label: "Presentment Date",
      placeholder: "",
      GridProps: { xs: 6, sm: 2, md: 2, lg: 2, xl: 1.5 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "ZONE",
      label: "Zone",
      placeholder: "Props Value",
      defaultValue: "0   ",
      GridProps: { xs: 12, sm: 2, md: 1.5, lg: 1.5, xl: 1.5 },
      runValidationOnDependentFieldsChange: true,
      skipDefaultOption: true,
      options: "getZoneListData",
      _optionsKey: "getZoneListData",
      disableCaching: true,
      requestProps: "ZONE_TRAN_TYPE",
      dependentFields: ["TRAN_DT"],
      postValidationSetCrossFieldValues: async (
        field,
        __,
        auth,
        dependentFieldsValues
      ) => {
        let Apireq = {
          COMP_CD: auth.companyID ?? "",
          BRANCH_CD: auth.user.branchCode ?? "",
          TRAN_DT: format(
            new Date(dependentFieldsValues?.TRAN_DT?.value),
            "dd/MMM/yyyy"
          ),
          ZONE: field?.value ?? "0   ",
          TRAN_TYPE: field?.optionData?.[0]?.ZONE_TRAN_TYPE ?? "S",
        };
        if (field.value) {
          let postdata = await getSlipNumber(Apireq);
          return {
            SLIP_CD: {
              value: Number(postdata?.[0]?.SLIP_NO ?? ""),
            },
          };
        }

        return {};
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SLIP_CD",
      label: "Slip No.",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 6, sm: 1, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ENTERED_BY",
      label: "Maker",
      placeholder: "",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 1.5, md: 2, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "datetimePicker",
      },
      name: "ENTERED_DATE",
      label: "Maker Time",
      placeholder: "",
      type: "text",
      format: "dd/MM/yyyy HH:mm:ss",
      defaultValue: new Date(),
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 3, md: 3, lg: 2.5, xl: 1.5 },
    },
    // {
    //   render: {
    //     componentType: "textField",
    //   },
    //   name: "CLEARING_STATUS",
    //   label: "Entry Status",
    //   placeholder: "",
    //   type: "text",
    //   fullWidth: true,
    //   isReadOnly: true,

    //   // required: true,
    //   // maxLength: 20,
    //   // schemaValidation: {
    //   //   type: "string",
    //   //   rules: [{ name: "required", params: ["Slip No. is required."] }],
    //   // },
    //   GridProps: { xs: 12, sm: 3, md: 3, lg: 2.5, xl: 1.5 },
    // },
  ],
};
export const SlipDetailFormMetaData: any = {
  form: {
    refID: 1667,
    name: "SlipDetailFormMetaData",
    label: "Slip Detail",
    resetFieldOnUmnount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",

      gridConfig: {
        item: {
          xs: 12,
          sm: 6,
          md: 6,
        },
        container: {
          direction: "row",
          spacing: 2,
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
    },
  },
  fields: [
    {
      render: {
        componentType: "arrayField",
      },
      fixedRows: true,
      isDisplayCount: false,
      // isCustomStyle: true,
      name: "slipDetails",
      removeRowFn: "deleteFormArrayFieldData",
      arrayFieldIDName: "DOC_CD",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        // {
        //   render: {
        //     componentType: "textField",
        //   },
        //   name: "COMP_CD",
        //   label: "Company Code",
        //   placeholder: "Company Code",
        //   type: "text",
        //   required: true,
        //   defaultValue: "",
        //   // maxLength: 16,
        //   // options: GeneralAPI.getBranchCodeList,
        //   // _optionsKey: "getBranchCodeList",
        //   GridProps: { xs: 12, sm: 3, md: 2, lg: 2.5, xl: 1.5 },
        //   schemaValidation: {
        //     type: "string",
        //     rules: [
        //       { name: "required", params: ["Company Code is required."] },
        //     ],
        //   },
        // },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "BRANCH_CD",
          label: "Branch",
          placeholder: "Branch Code",
          type: "text",
          required: true,
          // maxLength: 16,
          options: GeneralAPI.getBranchCodeList,
          _optionsKey: "getBranchCodeList",
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
          GridProps: { xs: 12, sm: 2, md: 2.5, lg: 2, xl: 1.5 },
          isFieldFocused: true,
          // defaultfocus: true,
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
          autoComplete: "off",
          // required: true,
          // maxLength: 6,
          dependentFields: ["ACCT_TYPE"],
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["ACNo is required."] }],
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ACCT_NAME",
          label: "AC Name",
          type: "text",
          fullWidth: true,
          isReadOnly: true,

          GridProps: { xs: 12, sm: 3, md: 3, lg: 3.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "TRAN_BAL",
          label: "Trn.Balance",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 2, md: 1.5, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "AMOUNT",
          label: "Amount",
          placeholder: "",
          isFieldFocused: true,
          autoComplete: false,
          type: "text",
          // isReadOnly: true,
          GridProps: { xs: 12, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
        },
      ],
    },
  ],
};
export const ChequeDetailFormMetaData: any = {
  form: {
    refID: 1667,
    name: "ChequeDetailFormMetaData",
    label: "Cheque Detail",
    resetFieldOnUmnount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",

      gridConfig: {
        item: {
          xs: 12,
          sm: 6,
          md: 6,
        },
        container: {
          direction: "row",
          spacing: 2,
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
    },
  },
  fields: [
    {
      render: {
        componentType: "arrayField",
      },
      fixedRows: true,
      // isDisplayCount: true,
      isScreenStyle: true,
      name: "chequeDetails",
      removeRowFn: "deleteFormArrayFieldData",
      arrayFieldIDName: "DOC_CD",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CHEQUE_NO",
          label: "Cheque No.",
          placeholder: "Cheque No.",
          type: "text",
          isFieldFocused: true,
          // required: true,
          // maxLength: 16,
          // options: GeneralAPI.getBranchCodeList,
          // _optionsKey: "getBranchCodeList",
          GridProps: { xs: 6, sm: 2, md: 1.5, lg: 1.5, xl: 1.5 },
          // schemaValidation: 1.5
          //   type: "string",
          //   rules: [
          //     { name: "required", params: ["Company Code is required."] },
          //   ],
          // },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "BANK_CD",
          label: "Bank",
          placeholder: "Bank",
          type: "text",
          // required: true,
          // maxLength: 10,
          // options: GeneralAPI.getBranchCodeList,
          // _optionsKey: "getBranchCodeList",
          GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 2.5 },
          // schemaValidation: {
          //   type: "string",
          //   rules: [{ name: "required", params: ["Branch Code is required."] }],
          // },
        },
        // {
        //   render: {
        //     componentType: "formbutton",
        //   },
        //   name: "BANK_NAME",
        //   label: "...",
        //   placeholder: "",
        //   type: "text",
        //   // required: true,
        //   // maxLength: 16,
        //   // options: GeneralAPI.getBranchCodeList,
        //   // _optionsKey: "getBranchCodeList",
        //   // GridProps: { xs: 12, sm: 1, md: 1.5, lg: 1.2, xl: 1 },
        //   GridProps: { sm: 1, md: 1.5, lg: 1.2, xl: 1 },
        //   // GridProps: { xs: 12, sm: 1, md: 1, lg: 1.2, xl: 1.2 },
        //   // schemaValidation: {
        //   //   type: "string",
        //   //   rules: [{ name: "required", params: ["Branch Code is required."] }],
        //   // },
        // },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "ECS_SEQ_NO",
          label: "Payee A/C No.",
          placeholder: "",
          type: "text",
          required: true,
          // options: GeneralAPI.getAccountTypeList,
          // _optionsKey: "getAccountTypeList",
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2.3, xl: 1.5 },

          // schemaValidation: {
          //   type: "string",
          //   rules: [{ name: "required", params: ["Account Type is required."] }],
          // },
        },
        // {
        //   render: {
        //     componentType: "datePicker",
        //   },
        //   name: "CHEQUE_DATE",
        //   // sequence: 9,
        //   label: "Cheque Date",
        //   placeholder: "",
        //   GridProps: { xs: 12, sm: 3, md: 3, lg: 2.2, xl: 1.5 },
        // },
        {
          render: {
            componentType: "datePicker",
          },
          name: "CHEQUE_DATE",
          label: "Cheque Date",
          placeholder: "",
          format: "dd/MM/yyyy",
          // defaultValue: new Date(),
          type: "text",
          fullWidth: true,
          // required: true,
          maxLength: 6,
          defaultfocus: true,
          // schemaValidation: {
          //   type: "string",
          //   rules: [{ name: "required", params: ["ACNo is required."] }],
          // },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "BRANCH",
          label: "Description",
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
            componentType: "numberFormat",
          },
          name: "CHQ_MICR_CD",
          label: "CHQ Micr",
          placeholder: "EnterAcNo",
          type: "text",
          fullWidth: true,
          defaultValue: "10",
          // required: true,
          // maxLength: 6,
          dependentFields: ["ACCT_TYPE"],
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["ACNo is required."] }],
          },
          GridProps: { xs: 6, sm: 1, md: 1, lg: 1, xl: 1 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ECS_USER_NO",
          label: "Pay Name",
          placeholder: "",
          type: "text",
          autoComplete: "off",
          // isReadOnly: true,
          GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 1.5 },
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
          GridProps: { xs: 6, sm: 2, md: 2.2, lg: 2, xl: 1.5 },
        },
      ],
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
      name: "RBI_CD",
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
      name: "BANK_CD",
      label: "Code",
      placeholder: "",
      type: "text",
      maxLength: 20,
      required: true,
      dependentFields: ["RBI_CD"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        return dependentFields?.RBI_CD?.value ?? "";
      },
      GridProps: { xs: 6, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BANK_NM",
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
      // defaultValue: true,
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
function addFormArrayFieldData() {
  throw new Error("Function not implemented.");
}
