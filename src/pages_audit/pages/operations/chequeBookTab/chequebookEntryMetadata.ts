import { GeneralAPI } from "registry/fns/functions";
import { utilFunction } from "components/utils";
import * as API from "./api";

export const ChequeBookEntryMetaData = {
  form: {
    name: "PRIORITY",
    label: "Cheque Book Issue",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
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
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        postValidationSetCrossFieldValues: async (field) => {
          if (field?.value) {
            return {
              ACCT_TYPE: { value: "" },
              ACCT_CD: { value: "" },
              ACCT_NM: { value: "" },
              ACCT_BAL: { value: "" },
              CHEQUE_FROM: { value: "" },
              CHEQUE_TO: { value: "" },
              SERVICE_TAX: { value: "" },
              GST: { value: "" },
              LEAF_ARR: { value: "" },
              AMOUNT: { value: "" },
              TOOLBAR_DTL: { value: "" },
              REQUISITION_DT: { value: "" },
              SR_CD: { value: "" },
            };
          }
        },
      },
      accountTypeMetadata: {
        // isFieldFocused: true,
        postValidationSetCrossFieldValues: async (field) => {
          if (field?.value) {
            return {
              ACCT_CD: { value: "" },
              ACCT_NM: { value: "" },
              ACCT_BAL: { value: "" },
              CHEQUE_FROM: { value: "" },
              CHEQUE_TO: { value: "" },
              SERVICE_TAX: { value: "" },
              GST: { value: "" },
              LEAF_ARR: { value: "" },
              AMOUNT: { value: "" },
              TOOLBAR_DTL: { value: "" },
              REQUISITION_DT: { value: "" },
              SR_CD: { value: "" },
            };
          }
        },
      },
      accountCodeMetadata: {
        disableCaching: true,
        postValidationSetCrossFieldValues: async (
          field,
          formState,
          authState,
          dependentValue
        ) => {
          console.log("<<<<dedededee", dependentValue);
          if (
            field?.value &&
            dependentValue?.BRANCH_CD?.value &&
            dependentValue?.ACCT_TYPE?.value
          ) {
            let otherAPIRequestPara = {
              COMP_CD: authState?.companyID,
              ACCT_CD: utilFunction.getPadAccountNumber(
                field?.value,
                dependentValue?.ACCT_TYPE?.optionData
              ),
              ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
              BRANCH_CD: dependentValue?.BRANCH_CD?.value,
              SCREEN_REF: "ETRN/045",
            };

            let postData = await API.getChequebookData({ otherAPIRequestPara });

            const result = [
              "ACCT_ALLOW_MSG",
              "BRN_ALLOW_MSG",
              "CHEQUBOOK_ALLOW_MSG",
              "CONFIRM_MSG",
              "STATUS_MSG",
              "ACCT_MSG",
            ]
              .map((key) => postData[0][key])
              .filter((message) => message !== "");
            if (postData?.[0]?.RESTRICTION_MESSAGE) {
              formState.MessageBox({
                messageTitle: "Validation Failed...!",
                message: postData?.[0]?.RESTRICTION_MESSAGE,
                buttonNames: ["Ok"],
              });
              return {
                ACCT_CD: { value: "" },
                ACCT_NM: { value: "" },
                ACCT_BAL: { value: "" },
                CHEQUE_FROM: { value: "" },
                CHEQUE_TO: { value: "" },
                SERVICE_TAX: { value: "" },
                LEAF_ARR: { value: "" },
                AMOUNT: { value: "" },
                TOOLBAR_DTL: { value: "" },
                REQUISITION_DT: { value: "" },
                SR_CD: { value: "" },
              };
            } else if (result.length) {
              const res = await formState.MessageBox({
                messageTitle: "Risk Category Alert",
                message: result,
                buttonNames: ["Ok"],
              });
              if (res === "Ok") {
                formState.MessageBox({
                  messageTitle: "HNI Alert",
                  message: postData?.[0]?.MESSAGE1,
                  buttonNames: ["Ok"],
                });
              }
              formState.setDataOnFieldChange("DTL_TAB", { DTL_TAB: true });
              return {
                ACCT_CD: {
                  value: postData?.[0]?.ACCT_CD ?? "",
                  ignoreUpdate: true,
                },
                ACCT_NM: {
                  value: postData?.[0]?.ACCT_NM ?? "",
                },
                ACCT_BAL: {
                  value: postData?.[0]?.ACCT_BAL ?? "",
                },
                CHEQUE_FROM: {
                  value: postData?.[0]?.CHEQUE_FROM ?? "",
                },
                NEW_LEAF_ARR: {
                  value: postData?.[0]?.LEAF_ARR ?? "",
                },
                AUTO_CHQBK_FLAG: {
                  value: postData?.[0]?.AUTO_CHQBK_FLAG ?? "",
                },
                AUTO_CHQBK_PRINT_FLAG: {
                  value: postData?.[0]?.CHEQUEBOOK_PRINT ?? "",
                },
                JOINT_NAME_1: {
                  value: postData?.[0]?.JOINT_NAME_1 ?? "",
                },
                JOINT_NAME_2: {
                  value: postData?.[0]?.JOINT_NAME_2 ?? "",
                },
                REQUISITION_DT: {
                  value: authState?.workingDate,
                },
                SR_CD: {
                  value: postData?.[0]?.SR_CD ?? "",
                },
                TOOLBAR_DTL: {
                  value: `No. of chequebook issued = ${postData?.[0]?.NO_CHEQUEBOOK_ISSUE} , No of cheque used = ${postData?.[0]?.NO_CHEQUE_USED} , No of cheque stop = ${postData?.[0]?.NO_CHEQUE_STOP} , No of cheque surrender = ${postData?.[0]?.NO_CHEQUE_SURRENDER} , No of unused cheque =  ${postData?.[0]?.NO_OF_CHEQUE_UNUSED} `,
                },
              };
            } else {
              formState.setDataOnFieldChange("DTL_TAB", { DTL_TAB: true });
              return {
                ACCT_CD: {
                  value: postData?.[0]?.ACCT_CD ?? "",
                  ignoreUpdate: true,
                },
                ACCT_NM: {
                  value: postData?.[0]?.ACCT_NM ?? "",
                },
                ACCT_BAL: {
                  value: postData?.[0]?.ACCT_BAL ?? "",
                },
                CHEQUE_FROM: {
                  value: postData?.[0]?.CHEQUE_FROM ?? "",
                },
                NEW_LEAF_ARR: {
                  value: postData?.[0]?.LEAF_ARR ?? "",
                },
                AUTO_CHQBK_FLAG: {
                  value: postData?.[0]?.AUTO_CHQBK_FLAG ?? "",
                },
                AUTO_CHQBK_PRINT_FLAG: {
                  value: postData?.[0]?.CHEQUEBOOK_PRINT ?? "",
                },
                JOINT_NAME_1: {
                  value: postData?.[0]?.JOINT_NAME_1 ?? "",
                },
                JOINT_NAME_2: {
                  value: postData?.[0]?.JOINT_NAME_2 ?? "",
                },
                REQUISITION_DT: {
                  value: authState?.workingDate,
                },
                SR_CD: {
                  value: postData?.[0]?.SR_CD ?? "",
                },
                TOOLBAR_DTL: {
                  value: `No. of chequebook issued = ${postData?.[0]?.NO_CHEQUEBOOK_ISSUE} , No of cheque used = ${postData?.[0]?.NO_CHEQUE_USED} , No of cheque stop = ${postData?.[0]?.NO_CHEQUE_STOP} , No of cheque surrender = ${postData?.[0]?.NO_CHEQUE_SURRENDER} , No of unused cheque =  ${postData?.[0]?.NO_OF_CHEQUE_UNUSED} `,
                },
              };
            }
          } else if (!field?.value) {
            formState.setDataOnFieldChange("DTL_TAB", { DTL_TAB: false });
            return {
              ACCT_NM: { value: "" },
              ACCT_BAL: { value: "" },
              CHEQUE_FROM: { value: "" },
              CHEQUE_TO: { value: "" },
              SERVICE_TAX: { value: "" },
              LEAF_ARR: { value: "" },
              AMOUNT: { value: "" },
              TOOLBAR_DTL: { value: "" },
              JOINT_NAME_1: { value: "" },
              JOINT_NAME_2: { value: "" },
            };
          }

          return {};
        },
        runPostValidationHookAlways: true,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
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
        componentType: "amountField",
      },
      name: "ACCT_BAL",
      label: "Balance",
      placeholder: "Enter no of Cheque book",
      type: "text",
      FormatProps: {
        allowNegative: true,
      },
      // textFieldStyle: {
      //   "& .MuiInputLabel-formControl": {
      //     right: "0",
      //     left: "auto",
      //   },
      // },
      isReadOnly: true,
      dependentFields: ["SERVICE_TAX", "CHEQUE_TOTAL"],
      runValidationOnDependentFieldsChange: true,
      validate: (currentField, dependentFields, formState) => {
        if (
          Number(dependentFields.SERVICE_TAX.value) *
            Number(dependentFields.CHEQUE_TOTAL.value) >
          Number(currentField.value)
        ) {
          return "balance is less than service-charge";
        }
        return "";
      },
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
      label: "From Cheque No.",
      placeholder: "From Cheque No.",
      type: "text",
      textFieldStyle: {
        "& .MuiInputBase-input": {
          textAlign: "right",
          background: "var(--theme-color7)",
        },
        // "& .MuiInputLabel-formControl": {
        //   right: "0",
        //   left: "auto",
        // },
      },
      // isReadOnly: true,
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
      name: "LEAF_ARR",
      label: "No. of Cheque(s)",
      placeholder: "Enter no of Cheque book",
      type: "text",
      textFieldStyle: {
        "& .MuiInputBase-input": {
          textAlign: "right",
        },
        // "& .MuiInputLabel-formControl": {
        //   right: "0",
        //   left: "auto",
        // },
      },
      // isFieldFocused: false,
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
      validate: (currentField, value, formState, newbal) => {
        if (value?.ACCT_CD?.error) {
          return "";
        } else if (!currentField?.value) {
          return "No. of cheque is required.";
        }
        return "";
      },
      dependentFields: [
        "CHEQUE_FROM",
        "BRANCH_CD",
        "ACCT_TYPE",
        "ACCT_CD",
        "CHEQUE_TOTAL",
        "NEW_LEAF_ARR",
      ],
      disableCaching: true,
      options: async (dependentValue, formState, _, authState) => {
        let newDD = dependentValue?.NEW_LEAF_ARR?.value;
        if (newDD) {
          newDD = newDD.split(",").map((item) => ({
            label: item,
            value: item,
          }));
          return newDD;
        }
        return [];
      },
      _optionsKey: "getChequebookDataDD",

      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFieldsValues
      ) => {
        if (field.value) {
          let Apireq = {
            COMP_CD: auth.companyID,
            BRANCH_CD: dependentFieldsValues.BRANCH_CD.value,
            ACCT_TYPE: dependentFieldsValues.ACCT_TYPE.value,
            ACCT_CD: dependentFieldsValues.ACCT_CD.value,
            NO_OF_LEAVES: field.value,
            ENT_COMP: auth.companyID,
            ENT_BRANCH: dependentFieldsValues.BRANCH_CD.value,
            SYS_DATE: auth?.workingDate,
          };
          let postdata = await API.chequebookCharge(Apireq);

          return {
            SERVECE_C_FLAG: {
              value: postdata?.[0]?.FLAG_ENABLE_DISABLE ?? "",
            },
            ROUND_OFF_FLAG: {
              value: postdata?.[0]?.GST_ROUND ?? "",
            },
            GST: {
              value: postdata?.[0]?.TAX_RATE ?? "",
            },
            SERVICE_TAX: {
              value: postdata?.[0]?.SERVICE_CHRG ?? "",
            },

            AMOUNT: {
              value: postdata?.[0]?.GST_AMT,
            },
            CHEQUE_TO: {
              value:
                parseInt(dependentFieldsValues?.CHEQUE_FROM?.value) +
                  parseInt(field?.value) -
                  1 ?? "",
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
      textFieldStyle: {
        "& .MuiInputBase-input": {
          textAlign: "right",
          background: "var(--theme-color7)",
        },
        // "& .MuiInputLabel-formControl": {
        //   right: "0",
        //   left: "auto",
        // },
      },
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["To cheque no. is required."] }],
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_TOTAL",
      label: "No of ChequeBooks",
      textFieldStyle: {
        "& .MuiInputBase-input": {
          textAlign: "right",
        },
        // "& .MuiInputLabel-formControl": {
        //   right: "0",
        //   left: "auto",
        // },
      },
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
      dependentFields: ["ACCT_BAL"],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentFields
      ) => {
        if (field?.value > 1 && Number(!dependentFields?.ACCT_BAL?.error)) {
          formState.setDataOnFieldChange("CHEQUE_TOTAL", {
            CHEQUE_TOTAL: true,
          });
        }
      },
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
        componentType: "amountField",
      },
      name: "SERVICE_TAX",
      label: "Service Charge",
      placeholder: "Service Charge",
      type: "text",
      // textFieldStyle: {
      //   "& .MuiInputLabel-formControl": {
      //     right: "0",
      //     left: "auto",
      //   },
      // },
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
      dependentFields: [
        "SERVECE_C_FLAG",
        "GST",
        "ROUND_OFF_FLAG",
        "CHEQUE_TOTAL",
      ],
      isReadOnly(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.SERVECE_C_FLAG?.value === "N") {
          return false;
        } else {
          return true;
        }
      },
      postValidationSetCrossFieldValues: (
        field,
        formState,
        auth,
        dependentFieldsValues
      ) => {
        if (field.value) {
          if (
            dependentFieldsValues?.CHEQUE_TOTAL?.value > 1 &&
            Number(!dependentFieldsValues?.ACCT_BAL?.error)
          ) {
            formState.setDataOnFieldChange("CHEQUE_TOTAL", {
              CHEQUE_TOTAL: true,
            });
          }

          return {
            AMOUNT: {
              value:
                dependentFieldsValues?.ROUND_OFF_FLAG?.value === "3"
                  ? Math.floor(
                      (parseInt(field?.value) *
                        parseInt(dependentFieldsValues?.GST?.value)) /
                        100
                    ) ?? ""
                  : dependentFieldsValues?.ROUND_OFF_FLAG?.value === "2"
                  ? Math.ceil(
                      (parseInt(field?.value) *
                        parseInt(dependentFieldsValues?.GST?.value)) /
                        100
                    ) ?? ""
                  : dependentFieldsValues?.ROUND_OFF_FLAG?.value === "1"
                  ? Math.round(
                      (parseInt(field?.value) *
                        parseInt(dependentFieldsValues?.GST?.value)) /
                        100
                    ) ?? ""
                  : (parseInt(field?.value) *
                      parseInt(dependentFieldsValues?.GST?.value)) /
                      100 ?? "",
            },
          };
        }
        return {};
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "AMOUNT",
      label: "GST-Amount",
      placeholder: "GST-AMOUNT",
      type: "text",
      // textFieldStyle: {
      //   "& .MuiInputLabel-formControl": {
      //     right: "0",
      //     left: "auto",
      //   },
      // },
      isReadOnly: true,
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
      name: "REQUISITION_DT",
      label: "Requisition Date",
      isReadOnly: true,
      maxDate: new Date(),
      placeholder: "",
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
        componentType: "Remark",
      },
      name: "REMARKS",
      label: "Remark",
      placeholder: "Enter remark",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
        lg: 4,
        xl: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "JOINT_NAME_1",
      label: "Joint Account Name - 1",
      isReadOnly: true,
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
        md: 4,
        sm: 4,
        lg: 4,
        xl: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "JOINT_NAME_2",
      label: "Joint Account Name - 2",
      isReadOnly: true,
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
        md: 4,
        sm: 4,
        lg: 4,
        xl: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "TOOLBAR_DTL",
      label: "",
      isReadOnly: true,
      textFieldStyle: {
        "& .MuiInputBase-input": {
          background: "var(--theme-color5)",
          minHeight: "35px !important",
          fontSize: "15px",
          color: "white",
          boxShadow:
            "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
          paddingY: "0px !important",
        },
        "& .MuiInputBase-root": {
          marginTop: " 0px !important",
        },
      },
      shouldExclude(fieldData) {
        if (fieldData?.value) {
          return false;
        } else {
          return true;
        }
      },
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
      name: "SR_CD",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "SERVECE_C_FLAG",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "GST",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ROUND_OFF_FLAG",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "AUTO_CHQBK_FLAG",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "SR_CD",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "NEW_LEAF_ARR",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "AUTO_CHQBK_PRINT_FLAG",
    },
  ],
};
