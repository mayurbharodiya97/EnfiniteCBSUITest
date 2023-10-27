import { GeneralAPI } from "registry/fns/functions";
import { GetdetailData } from "./chequebookTab";

export const ChequeBookEntryMetaData = {
  form: {
    name: "PRIORITY",
    label: "Cheque Book Issue",
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
    apiID: "GETCHEQUEBOOK",
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
        componentType: "autocomplete",
      },
      name: "NO_OF_CHEQUE",
      label: "No. of Cheque(s)",
      placeholder: "Enter no of Cheque book",
      type: "text",
      isFieldFocused: false,
      // options: () => {
      //   return [
      //     { value: "15", label: "15" },
      //     { value: "45", label: "45" },
      //     { value: "90", label: "90" },
      //   ];
      // },
      options: GeneralAPI.getChequeLeavesList,
      _optionsKey: "getChequeLeavesList",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },

      postValidationSetCrossFieldValues: async (
        field,
        __,
        ___,
        dependentFieldsValues
      ) => {
        if (field.value) {
          let postdata = await GetdetailData({
            apiID: "GETLANGMSGDTL",
            otherAPIRequestPara: { TRAN_CD: 1 },
          });
          return {
            SERVICE_CHARGE: { value: postdata[0]?.LANG_MSG ?? "" },
            GST: {
              value: postdata[0]?.LANG_CODE ?? "",
            },
            FROM_CHEQUE_NO: { value: postdata[0]?.SR_CD ?? "" },
            TO_CHEQUE_NO: { value: postdata[0]?.TRAN_CD ?? "" },
          };
        }

        return {};
      },
      runPostValidationHookAlways: true,
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
      // isReadOnly: true,
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
      name: "CHEQUE_FROM",
      label: "From Cheque No.",
      placeholder: "From Cheque No.",
      type: "text",
      // isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 2.25,
        sm: 2.25,
        lg: 2.25,
        xl: 2.25,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CHEQUE_TO",
      label: "To Cheque No.",
      placeholder: "To Cheque No.",
      type: "text",
      // isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 2.25,
        sm: 2.25,
        lg: 2.25,
        xl: 2.25,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SERVICE_TAX",
      label: "Service Charge",
      placeholder: "Service Charge",
      type: "text",
      GridProps: {
        xs: 12,
        md: 2.25,
        sm: 2.25,
        lg: 2.25,
        xl: 2.25,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "GST",
      label: "GST",
      placeholder: "GST",
      type: "text",
      GridProps: {
        xs: 12,
        md: 2.25,
        sm: 2.25,
        lg: 2.25,
        xl: 2.25,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      // sequence: 10,
      label: "Remark",
      placeholder: "Enter remark",
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
      name: "PAYABLE_AT_PAR",
      label: "Payable At PAR",
      placeholder: '"Payable At PAR',
      options: () => {
        return [
          { value: "Y", label: "Yes" },
          { value: "N", label: "No" },
        ];
      },
      _optionsKey: "PAYABLE_AT_PAR",
      type: "text",
      GridProps: {
        xs: 12,
        md: 2.25,
        sm: 2.25,
        lg: 2.25,
        xl: 2.25,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "CHARACTERISTICS",
      // sequence: 4,
      label: "Characteristics",
      placeholder: "Characteristics",
      type: "text",
      options: () => {
        return [
          { value: "B", label: "Bearer" },
          { value: "O", label: "Order" },
        ];
      },
      _optionsKey: "CHARACTERISTICS",
      GridProps: {
        xs: 12,
        md: 2.25,
        sm: 2.25,
        lg: 2.25,
        xl: 2.25,
      },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "REQUISITION_DT",
      // sequence: 9,
      label: "Requisition Date",
      placeholder: "",
      GridProps: {
        xs: 12,
        md: 2.25,
        sm: 2.25,
        lg: 2.25,
        xl: 2.25,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "CHEQUE_TOTAL",
      label: "No of ChequeBooks",
      placeholder: "Enter no of Cheque book",
      type: "text",
      // defaultValue: "2",
      // enableDefaultOption: true,
      GridProps: {
        xs: 12,
        md: 2.25,
        sm: 2.25,
        lg: 2.25,
        xl: 2.25,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "MACHINE_NM",
      label: "Joint Account Name",
      type: "text",
      shouldExclude(fieldData) {
        if (fieldData?.value) {
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
      name: "MACHINE_NMA",
      label: "Joint Account Name",
      type: "text",
      shouldExclude(fieldData) {
        if (fieldData?.value) {
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
    // {
    //   render: {
    //     componentType: "datePicker",
    //   },
    //   name: "TRAN_DT",
    //   // sequence: 9,
    //   label: "tran Date",
    //   // format: "dd/mm/yyyy",
    //   placeholder: "",
    //   GridProps: {
    //     xs: 12,
    //     md: 2.25,
    //     sm: 2.25,
    //     lg: 2.25,
    //     xl: 2.25,
    //   },
    //   __EDIT__: { render: { componentType: "hidden" } },
    // },
    {
      render: {
        componentType: "hidden",
      },
      name: "AUTO_CHQBK_FLAG",
      label: "Auto chequebook flag",
      type: "text",
      shouldExclude(fieldData) {
        if (fieldData?.value) {
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
        componentType: "hidden",
      },
      name: "AUTO_CHQBK_PRINT_FLAG",
      label: "Auto chequebook print flag",
      type: "text",
      shouldExclude(fieldData) {
        if (fieldData?.value) {
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
        componentType: "hidden",
      },
      name: "SR_CD",
      label: "SR-CD",
      type: "text",
      shouldExclude(fieldData) {
        if (fieldData?.value) {
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
        componentType: "hidden",
      },
      name: "AMOUNT",
      label: "SR-CD",
      type: "text",
      shouldExclude(fieldData) {
        if (fieldData?.value) {
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
  ],
};
