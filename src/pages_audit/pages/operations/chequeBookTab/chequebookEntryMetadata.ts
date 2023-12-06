import { GeneralAPI } from "registry/fns/functions";
import { TemporaryData, chequebookCharge } from "./api";

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
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 3,
        xl: 3,
      },
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
      name: "CHEQUE_FROM",
      label: "From Cheque No.",
      placeholder: "From Cheque No.",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 2.25,
        sm: 2.25,
        lg: 2.25,
        xl: 2.25,
      },
    },
    // {
    //   render: {
    //     componentType: "autocomplete",
    //   },
    //   name: "LEAF_ARR",
    //   label: "No. of Cheque(s)",
    //   placeholder: "Enter no of Cheque book",
    //   type: "text",
    //   isFieldFocused: false,
    //   GridProps: {
    //     xs: 12,
    //     md: 3,
    //     sm: 3,
    //     lg: 3,
    //     xl: 3,
    //   },
    //   dependentFields: [
    //     "CHEQUE_FROM",
    //     // "SERVICE_TAX",
    //     // "SERVECE_C_FLAG",
    //     // "ACCT_NM",
    //     "BRANCH_CD",
    //     "ACCT_TYPE",
    //     "ACCT_CD",
    //   ],

    //   postValidationSetCrossFieldValues: async (
    //     field,
    //     __,
    //     auth,
    //     dependentFieldsValues
    //   ) => {
    //     console.log(
    //       "<<<postValidationSetCrossFieldValues",
    //       field,
    //       __,
    //       auth,
    //       dependentFieldsValues
    //     );

    //     let Apireq = {
    //       COMP_CD: auth.companyID,
    //       BRANCH_CD: dependentFieldsValues.BRANCH_CD.value,
    //       ACCT_TYPE: dependentFieldsValues.ACCT_TYPE.value,
    //       ACCT_CD: dependentFieldsValues.ACCT_CD.value,
    //       NO_OF_LEAVES: field.value,
    //     };
    //     if (field.value) {
    //       let postdata = await chequebookCharge(Apireq);
    //       console.log("<<<posrtdata", postdata);
    //       return {
    //         SERVECE_C_FLAG: {
    //           value: postdata?.[0]?.SERVICE_CHARGE_FLAG ?? "",
    //         },
    //         GST: {
    //           value: parseInt(postdata[0]?.TAX_RATE) / 100 ?? "",
    //         },
    //         CHEQUE_TO: {
    //           value:
    //             parseInt(dependentFieldsValues?.CHEQUE_FROM?.value) +
    //               parseInt(field?.value) -
    //               1 ?? "",
    //         },
    //         SERVICE_TAX: {
    //           value: postdata?.[0]?.GST_AMT,
    //           // postdata?.[0]?.GST_ROUND_OFF === "1"
    //           //   ? Math.floor(
    //           //       (parseInt(field?.value) * parseInt(postdata[0]?.GST)) /
    //           //         100
    //           //     ) ?? ""
    //           //   : postdata?.[0]?.GST_ROUND_OFF === "2"
    //           //   ? Math.ceil(
    //           //       (parseInt(field?.value) * parseInt(postdata[0]?.GST)) /
    //           //         100
    //           //     ) ?? ""
    //           //   : postdata?.[0]?.GST_ROUND_OFF === "3"
    //           //   ? Math.round(
    //           //       (parseInt(field?.value) * parseInt(postdata[0]?.GST)) /
    //           //         100
    //           //     ) ?? ""
    //           //   : (parseInt(field?.value) * parseInt(postdata[0]?.GST)) /
    //           //       100 ?? "",
    //         },
    //       };
    //     }

    //     return {};
    //   },
    // },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "LEAF_ARR",
      label: "No. of Cheque(s)",
      placeholder: "Enter no of Cheque book",
      type: "text",
      isFieldFocused: false,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
      dependentFields: [
        "CHEQUE_FROM",
        "SERVICE_TAX",
        "SERVECE_C_FLAG",
        "ACCT_NM",
      ],

      postValidationSetCrossFieldValues: async (
        field,
        __,
        ___,
        dependentFieldsValues
      ) => {
        if (field.value) {
          let postdata = await TemporaryData();
          return {
            SERVECE_C_FLAG: {
              value: postdata?.[0]?.SERVICE_CHARGE_FLAG ?? "",
            },
            GST: {
              value: parseInt(postdata[0]?.GST) / 100 ?? "",
            },
            CHEQUE_TO: {
              value:
                parseInt(dependentFieldsValues?.CHEQUE_FROM?.value) +
                  parseInt(field?.value) -
                  1 ?? "",
            },
            SERVICE_TAX: {
              value:
                postdata?.[0]?.GST_ROUND_OFF === "1"
                  ? Math.floor(
                      (parseInt(field?.value) * parseInt(postdata[0]?.GST)) /
                        100
                    ) ?? ""
                  : postdata?.[0]?.GST_ROUND_OFF === "2"
                  ? Math.ceil(
                      (parseInt(field?.value) * parseInt(postdata[0]?.GST)) /
                        100
                    ) ?? ""
                  : postdata?.[0]?.GST_ROUND_OFF === "3"
                  ? Math.round(
                      (parseInt(field?.value) * parseInt(postdata[0]?.GST)) /
                        100
                    ) ?? ""
                  : (parseInt(field?.value) * parseInt(postdata[0]?.GST)) /
                      100 ?? "",
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
      name: "CHEQUE_TO",
      label: "To Cheque No.",
      placeholder: "To Cheque No.",
      type: "text",
      isReadOnly: true,
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
        componentType: "numberFormat",
      },
      name: "CHEQUE_TOTAL",
      label: "No of ChequeBooks",
      placeholder: "Enter no of Cheque book",
      type: "text",
      defaultValue: "1",
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 2) {
            return false;
          }
          return true;
        },
      },
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
        componentType: "hidden",
      },
      name: "SERVECE_C_FLAG",
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
      dependentFields: ["SERVECE_C_FLAG"],

      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.SERVECE_C_FLAG?.value === "D") {
          return false;
        } else {
          return true;
        }
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "PAYABLE_AT_PAR",
      label: "Payable At PAR",
      placeholder: '"Payable At PAR',
      defaultValue: "Y",
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
      name: "CHARACTERISTICS",
      // sequence: 4,
      label: "Characteristics",
      placeholder: "Characteristics",
      type: "text",
      defaultValue: "B",
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
      isReadOnly: true,
      defaultValue: new Date(),
      maxDate: new Date(),
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
      name: "GST",
      label: "GST",
      placeholder: "GST",
      type: "text",
      isReadOnly: true,
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
        componentType: "amountField",
      },
      name: "ACCT_BAL",
      label: "Balance",
      placeholder: "Enter no of Cheque book",
      type: "text",
      isReadOnly: true,
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
      name: "JOINT_NAME_1",
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
      name: "JOINT_NAME_2",
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
      name: "legend",
      // sequence: 10,
      label: "legend Description",
      // placeholder: "Enter remark",
      defaultValue:
        "CI = No. of chequebook issued , CU = No of cheque used , CS = No of cheque stop , CSU = No of cheque surrender , CUN = No of unused cheque",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
        lg: 12,
        xl: 12,
      },
    },

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
