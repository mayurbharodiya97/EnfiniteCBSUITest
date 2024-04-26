import { utilFunction } from "components/utils";
import * as API from "../api";
import { GeneralAPI } from "registry/fns/functions";
import {
  getDividendAccountDetail,
  getDividendViewMasterData,
  getInwardAccountDetail,
} from "../api";
import { GridMetaDataType } from "components/dataTableStatic";
export const chequeReturnPostFormMetaData = {
  form: {
    name: "InwardClearingChequeDetail",
    label: "Inward Clearing Cheque Detail",
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
        componentType: "hidden",
      },
      name: "DISABLE_RET_AC",
      label: "",
      placeholder: "",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "DISABLE_CHQ_NO",
      label: "",
      placeholder: "",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "DISABLE_MICR",
      label: "",
      placeholder: "",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "DISABLE_MAIN_AC",
      label: "",
      placeholder: "",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "POST_CONF",
      label: "",
      placeholder: "",
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_NO",
      label: "Cheque No.",
      placeholder: "Cheque No.",
      type: "text",
      required: true,
      autoComplete: "off",
      isFieldFocused: true,
      defaultfocus: true,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        isAllowed: (values) => {
          if (values?.value?.length > 6) {
            return false;
          }

          return true;
        },
      },
      dependentFields: ["DISABLE_CHQ_NO"],
      isReadOnly: (fieldValue, dependentFields, formState) => {
        if (dependentFields?.DISABLE_CHQ_NO?.value === "Y") {
          return true;
        } else {
          return false;
        }
      },
      GridProps: { xs: 12, sm: 1, md: 1, lg: 1, xl: 1 },
    },

    // {
    //   render: {
    //     componentType: "hidden",
    //   },
    //   name: "TRAN_DATE",
    //   label: "",
    //   placeholder: "",
    //   format: "dd/MM/yyyy",

    //   GridProps: { xs: 12, sm: 2, md: 1.8, lg: 1.8, xl: 1.5 },
    // },
    // {
    //   render: {
    //     componentType: "hidden",
    //   },
    //   name: "RANGE_DATE",
    //   label: "",
    //   placeholder: "",
    //   format: "dd/MM/yyyy",

    //   GridProps: { xs: 12, sm: 2, md: 1.8, lg: 1.8, xl: 1.5 },
    // },
    {
      render: {
        componentType: "datePicker",
      },
      name: "CHEQUE_DT",
      label: "Cheque Date",
      placeholder: "",
      format: "dd/MM/yyyy",
      type: "text",
      fullWidth: true,
      // dependentFields: ["TRAN_DATE", "RANGE_DATE"],
      // validate: (currentField, dependentField) => {
      //   const currentDate = new Date(currentField?.value);
      //   const rangeDate = new Date(dependentField?.RANGE_DATE?.value);
      //   const transDate = new Date(dependentField?.TRAN_DATE?.value);

      //   if (currentDate < rangeDate || currentDate > transDate) {
      //     return `Date should be between ${rangeDate.toLocaleDateString(
      //       "en-IN"
      //     )} - ${transDate.toLocaleDateString("en-IN")}`;
      //   }
      //   return "";
      // },

      maxLength: 6,

      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["Cheque Date is required."] }],
      // },
      GridProps: { xs: 12, sm: 2, md: 1.7, lg: 1.7, xl: 1.5 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "AMOUNT",
      label: "Cheque Amount",
      placeholder: "",
      isFieldFocused: true,
      required: true,
      type: "text",
      FormatProps: {
        allowNegative: false,
      },

      GridProps: { xs: 6, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
    },
    {
      render: {
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        name: "BRANCH_CD",
        required: true,
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
        dependentFields: ["DISABLE_MAIN_AC"],
        isReadOnly: (fieldValue, dependentFields, formState) => {
          if (dependentFields?.DISABLE_MAIN_AC?.value === "Y") {
            return true;
          } else {
            return false;
          }
        },
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: (field, formState) => {
          if (!field?.value.trim()) {
            formState.setDataOnFieldChange("ACCT_CD_BLANK");
            return {
              ACCT_CD: { value: "" },
              ACCT_TYPE: { value: "" },
              ACCT_NM: { value: "" },
              WIDTH_BAL: { value: "" },
              OTHER_REMARKS: { value: "" },
            };
          }
        },
      },
      accountTypeMetadata: {
        name: "ACCT_TYPE",
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
        isFieldFocused: true,
        defaultfocus: true,
        required: true,
        dependentFields: ["DISABLE_MAIN_AC", "BRANCH_CD"],
        isReadOnly: (fieldValue, dependentFields, formState) => {
          if (dependentFields?.DISABLE_MAIN_AC?.value === "Y") {
            return true;
          } else {
            return false;
          }
        },
        runPostValidationHookAlways: true,
        schemaValidation: {
          type: "string",
          rules: [{ name: "", params: "" }],
        },
        postValidationSetCrossFieldValues: (field, formState) => {
          if (!field?.value) {
            formState.setDataOnFieldChange("ACCT_CD_BLANK");
            return {
              ACCT_CD: { value: "" },
              ACCT_NM: { value: "" },
              WIDTH_BAL: { value: "" },
              OTHER_REMARKS: { value: "" },
            };
          }
        },
      },
      accountCodeMetadata: {
        name: "ACCT_CD",
        label: "A/C Number",
        placeholder: "",
        fullWidth: true,
        required: true,
        FormatProps: {
          isAllowed: (values) => {
            if (values?.value?.length > 6) {
              return false;
            }
            return true;
          },
        },
        // schemaValidation: {
        //   type: "string",
        //   rules: [{ name: "", params: "" }],
        // },
        dependentFields: ["DISABLE_MAIN_AC", "ACCT_TYPE", "BRANCH_CD"],
        isReadOnly: (fieldValue, dependentFields, formState) => {
          if (dependentFields?.DISABLE_MAIN_AC?.value === "Y") {
            return true;
          } else {
            return false;
          }
        },

        // disableCaching: false,
        postValidationSetCrossFieldValues: async (
          field,
          formState,
          auth,
          dependentFieldsValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (
            field.value &&
            // dependentFieldsValues?.["ACCT_TYPE"]?.value &&
            // dependentFieldsValues?.["BRANCH_CD"]?.value
            dependentFieldsValues?.["ACCT_TYPE"]?.value.trim() &&
            dependentFieldsValues?.["BRANCH_CD"]?.value.trim()
          ) {
            // console.log(
            //   ">>if value",
            //   field.value,
            //   dependentFieldsValues?.["ACCT_TYPE"]?.value,
            //   dependentFieldsValues?.["BRANCH_CD"]?.value
            // );
            let Apireq = {
              COMP_CD: auth?.companyID,
              ACCT_CD: utilFunction.getPadAccountNumber(
                field?.value,
                dependentFieldsValues?.["ACCT_TYPE"]?.optionData
              ),
              ACCT_TYPE: dependentFieldsValues?.["ACCT_TYPE"]?.value,
              BRANCH_CD: dependentFieldsValues?.["BRANCH_CD"]?.value,
              SCREEN_REF: "ETRN/650",
            };

            let postData = await getInwardAccountDetail(Apireq);
            if (postData?.[0]?.MESSAGE1) {
              formState?.MessageBox({
                messageTitle: "Information",
                message: postData?.[0]?.MESSAGE1,
              });
            } else if (postData?.[0]?.RESTRICTION) {
              formState?.MessageBox({
                messageTitle: "Account Validation Failed",
                message: postData?.[0]?.RESTRICTION,
              });
              formState.setDataOnFieldChange("ACCT_CD_VALID", []);
              return {
                ACCT_CD: { value: "", isFieldFocused: true },
                ACCT_NM: { value: "" },
                WIDTH_BAL: { value: "" },
              };
            }
            formState.setDataOnFieldChange("ACCT_CD_VALID", postData);
            return {
              // ACCT_CD: {
              //   value: postData?.[0]?.ACCT_NUMBER ?? "",
              //   ignoreUpdate: true,
              // },
              ACCT_CD: {
                value: field.value.padStart(6, "0")?.padEnd(20, " "),
                ignoreUpdate: true,
              },
              ACCT_NM: {
                value: postData?.[0]?.ACCT_NM ?? "",
              },
              WIDTH_BAL: { value: postData?.[0]?.WIDTH_BAL ?? "" },
              OTHER_REMARKS: { value: postData?.[0]?.OTHER_REMARKS ?? "" },
            };
          } else if (!field?.value) {
            formState.setDataOnFieldChange("ACCT_CD_BLANK");
            return {
              ACCT_NM: { value: "" },
              WIDTH_BAL: { value: "" },
              OTHER_REMARKS: { value: "" },
            };
          }
        },
        runPostValidationHookAlways: true,
        GridProps: { xs: 12, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "A/C Name",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 3.3, md: 3.3, lg: 3.3, xl: 2.3 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "MICR_TRAN_CD",
      label: "MICR",
      type: "text",
      fullWidth: true,
      required: true,
      dependentFields: ["DISABLE_MICR"],
      isReadOnly: (fieldValue, dependentFields, formState) => {
        if (dependentFields?.DISABLE_MICR?.value === "Y") {
          return true;
        } else {
          return false;
        }
      },

      GridProps: { xs: 6, sm: 0.6, md: 0.6, lg: 0.6, xl: 0.6 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      label: "Remarks",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 4.3, md: 4.3, lg: 4.3, xl: 4.3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "OTHER_REMARKS",
      label: "Mode Of Operation",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 3.2, md: 3.2, lg: 3.2, xl: 3.2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "WIDTH_BAL",
      label: "Withdraw.Balance",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },

    {
      render: {
        componentType: "formbutton",
      },
      name: "POST",
      label: "Post",
      rotateIcon: "scale(1.5)",
      placeholder: "",
      type: "text",
      dependentFields: ["POST_CONF"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.POST_CONF?.value === "P") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 12, sm: 1, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "CONFIRM",
      label: "Confirm",
      rotateIcon: "scale(1.5)",
      placeholder: "",
      type: "text",
      dependentFields: ["POST_CONF"],
      GridProps: { xs: 12, sm: 1, md: 1, lg: 1, xl: 1 },
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.POST_CONF?.value === "C") {
          return false;
        } else {
          return true;
        }
      },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "POSITIVE_PAY",
      label: "Positive Pay",
      rotateIcon: "scale(1.5)",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 1, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "typography",
      },
      name: "DIVIDER",
      label: "",
      // defaultValue: "For Return",
      TypographyProps: {
        style: {
          whiteSpace: "pre-line",
          color: "red",
          fontSize: "1rem",
          border: "1px solid black",
          borderStyle: "dashed",
          width: "100%",
          height: "0px",
        },
      },
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
        style: { alignSelf: "center" },
      },
    },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "ZONE_CD",
      label: "Zone",
      dependentFields: ["ACCT_CD", "BRANCH_CD", "ACCT_TYPE"],
      // disableCaching: true,
      options: (dependentValue, formState, _, authState) => {
        let ApiReq = {
          BRANCH_CD: authState?.user?.branchCode,
          COMP_CD: authState?.companyID,
          ZONE_TRAN_TYPE: "N",
        };
        return API.getInwardZoneTypeList(ApiReq);
      },
      _optionsKey: "getInwardZoneTypeList",

      // shouldExclude: (_, dependentFieldsValues, __) => {
      //   if (dependentFieldsValues?.RETURN?.value) {
      //     return false;
      //   } else {
      //     return true;
      //   }
      // },
      postValidationSetCrossFieldValues: (
        field,
        __,
        ___,
        dependentFieldsValues
      ) => {
        if (field.value && dependentFieldsValues?.ACCT_CD?.value.trim()) {
          return {
            RET_ACCT_CD: { value: dependentFieldsValues?.ACCT_CD?.value ?? "" },
            RET_BRANCH_CD: {
              value: dependentFieldsValues?.BRANCH_CD?.value ?? "",
            },
            RET_ACCT_TYPE: {
              value: dependentFieldsValues?.ACCT_TYPE?.value ?? "",
            },
          };
        } else if (
          field?.value &&
          field.optionData &&
          field.optionData.length > 0
        ) {
          return {
            RET_ACCT_CD: { value: field.optionData[0].OPP_ACCT_CD ?? "" },
            RET_BRANCH_CD: { value: field.optionData[0].OPP_BRANCH_CD ?? "" },
            RET_ACCT_TYPE: { value: field.optionData[0].OPP_ACCT_TYPE ?? "" },
          };
        }
      },
      runPostValidationHookAlways: false,
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "RET_BRANCH_CD",
      label: "Return Branch",
      placeholder: "Branch",
      type: "text",
      required: true,
      // maxLength: 16,
      options: GeneralAPI.getBranchCodeList,
      _optionsKey: "getBranchCodeList",
      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
      dependentFields: ["DISABLE_RET_AC"],
      isReadOnly: (fieldValue, dependentFields, formState) => {
        if (dependentFields?.DISABLE_RET_AC?.value === "Y") {
          return true;
        } else {
          return false;
        }
      },
      // shouldExclude: (_, dependentFieldsValues, __) => {
      //   if (dependentFieldsValues?.RETURN?.value) {
      //     return false;
      //   } else {
      //     return true;
      //   }
      // },
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["Branch Code is required."] }],
      // },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "RET_ACCT_TYPE",
      label: "Return Account Type",
      type: "text",
      required: true,
      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
      dependentFields: ["DISABLE_RET_AC"],
      isReadOnly: (fieldValue, dependentFields, formState) => {
        if (dependentFields?.DISABLE_RET_AC?.value === "Y") {
          return true;
        } else {
          return false;
        }
      },
      options: GeneralAPI.getAccountTypeList,
      _optionsKey: "getAccountTypeList",

      // shouldExclude: (_, dependentFieldsValues, __) => {
      //   if (dependentFieldsValues?.RETURN?.value) {
      //     return false;
      //   } else {
      //     return true;
      //   }
      // },
      // schemaValidation: {
      //   type: "string",
      //   rules: [
      //     { name: "required", params: ["Return Account Type is required."] },
      //   ],
      // },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "RET_ACCT_CD",
      label: "Return A/C Number",
      type: "text",
      // fullWidth: true,
      required: true,
      dependentFields: ["DISABLE_RET_AC"],
      // shouldExclude: (_, dependentFieldsValues, __) => {
      //   if (dependentFieldsValues?.RETURN?.value) {
      //     return false;
      //   } else {
      //     return true;
      //   }
      // },
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 6) {
            return false;
          }
          return true;
        },
      },
      isReadOnly: (fieldValue, dependentFields, formState) => {
        if (dependentFields?.DISABLE_RET_AC?.value === "Y") {
          return true;
        } else {
          return false;
        }
      },

      // schemaValidation: {
      //   type: "string",
      //   rules: [
      //     { name: "required", params: ["Return Account Number is required."] },
      //   ],
      // },
      GridProps: { xs: 12, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "REASON_CD",
      label: "Reason",
      GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
      // runValidationOnDependentFieldsChange: true,
      skipDefaultOption: true,
      options: (dependentValue, formState, _, authState) => {
        let ApiReq = {
          BRANCH_CD: authState?.user?.branchCode,
          COMP_CD: authState?.companyID,
          RETURN_TYPE: "CLG",
        };
        return API.getInwardReasonTypeList(ApiReq);
      },
      _optionsKey: "getInwardReasonTypeList",
      // disableCaching: true,
      // dependentFields: ["RETURN"],
      // shouldExclude: (_, dependentFieldsValues, __) => {
      //   if (dependentFieldsValues?.RETURN?.value) {
      //     return false;
      //   } else {
      //     return true;
      //   }
      // },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "REASON",
      label: "Other Reason",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      // required: true,
      validate: (currentField, value) => {
        console.log("currentField", currentField?.value);
        if (/[~`!@#$%^&*()-+={}:"<>?,._-]/g.test(currentField?.value)) {
          return "Special characters are not allowed.";
        }
        return "";
      },
      // maxLength: 20,
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["Other Reason is required."] }],
      // },
      // dependentFields: ["RETURN"],
      // shouldExclude: (_, dependentFieldsValues, __) => {
      //   if (dependentFieldsValues?.RETURN?.value) {
      //     return false;
      //   } else {
      //     return true;
      //   }
      // },
      GridProps: { xs: 12, sm: 3.3, md: 3.3, lg: 3.3, xl: 2.3 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "RETURN",
      label: "Return",
      rotateIcon: "scale(1.5)",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 0.9, md: 0.9, lg: 0.9, xl: 0.9 },
    },
  ],
};
export const chequesignFormMetaData = {
  form: {
    name: "InwardClearingChequeDetail",
    label: "Inward Clearing Cheque Detail",
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
        componentType: "numberFormat",
      },
      name: "CHEQUE_NO",
      label: "Cheque No.",
      placeholder: "Cheque No.",
      type: "text",
      required: true,
      autoComplete: "off",
      isFieldFocused: true,
      defaultfocus: true,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        isAllowed: (values) => {
          if (values?.value?.length > 6) {
            return false;
          }

          return true;
        },
      },
      GridProps: { xs: 12, sm: 1.2, md: 1.2, lg: 1.2, xl: 1.2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "CHEQUE_DT",
      label: "Cheque Date",
      placeholder: "",
      format: "dd/MM/yyyy",
      type: "text",
      fullWidth: true,

      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Cheque Date is required."] }],
      },
      GridProps: { xs: 12, sm: 2, md: 1.7, lg: 1.7, xl: 1.5 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "AMOUNT",
      label: "Cheque Amount",
      placeholder: "",
      isFieldFocused: true,
      required: true,
      type: "text",
      FormatProps: {
        allowNegative: false,
      },
      validationRun: "all",

      GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BRANCH_CD",
      label: "Branch Code",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 1, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_TYPE",
      label: "Account Type",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 1, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_CD",
      label: "Account Number",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "Account Name",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 3.4, md: 3.4, lg: 3.4, xl: 3.4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "OTHER_REMARKS",
      label: "Mode of Operation",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "typography",
      },
      name: "IMAGENOTE",
      label: "",
      defaultValue:
        "Note : To zoom in on the images, simply click on it once...",
      TypographyProps: {
        style: {
          color: "red",
          whiteSpace: "pre-line",
          fontSize: "1.1rem",
          marginLeft: "21px",
          marginTop: "30px",
          // position: "absolute",
          // bottom: 0,
        },
      },
      GridProps: { xs: 12, sm: 5, md: 5, lg: 5, xl: 5 },
      // GridProps: {
      //   xs: 4,
      //   md: 4,
      //   sm: 4,
      //   style: { alignSelf: "center" },
      // },
    },
  ],
};
export const positivePayFormMetaData = {
  form: {
    name: "InwardClearingChequeDetail",
    label: "Inward Clearing Cheque Detail",
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
        componentType: "textField",
      },
      name: "CONFIRMED",
      label: "Status ",
      type: "text",
      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BRANCH_CD",
      label: "Branch Code",
      // placeholder: "EnterAcNo",
      type: "text",

      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_TYPE",
      label: "Account Type",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_CD",
      label: "Account Number",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 1.7, md: 1.7, lg: 1.7, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "Account Name",
      type: "text",
      fullWidth: true,

      GridProps: { xs: 12, sm: 4.1, md: 4.1, lg: 4.1, xl: 4.1 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_NO",
      label: "Cheque No.",
      placeholder: "Cheque No.",
      type: "text",
      GridProps: { xs: 12, sm: 1.7, md: 1.7, lg: 1.7, xl: 1.7 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "CHEQUE_DT",
      label: "Cheque Date",
      placeholder: "",
      format: "dd/MM/yyyy",
      type: "text",
      fullWidth: true,
      required: true,
      GridProps: { xs: 12, sm: 2.3, md: 2.3, lg: 2.3, xl: 2.3 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "CHEQUE_AMT",
      label: "Cheque Amount",
      placeholder: "",
      isFieldFocused: true,
      required: true,
      type: "text",
      FormatProps: {
        allowNegative: false,
      },
      validationRun: "all",

      GridProps: { xs: 12, sm: 2.2, md: 2.2, lg: 2.2, xl: 2.2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "PAYEE_NM",
      label: "Payee Name",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 4.3, md: 4.3, lg: 4.3, xl: 4.3 },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "TRAN_DT",
      label: "Entery Date",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 2.3, md: 2.3, lg: 2.3, xl: 2.3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      label: "Remarks",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ENTERED_BY",
      label: "Enterd By",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ENTERED_BRANCH_CD",
      label: "Enterd Branch",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REQ_CHANNEL",
      label: "Received From",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 2.8, md: 2.8, lg: 2.8, xl: 2.8 },
    },
  ],
};
export const shareDividendMetaData = {
  form: {
    name: "InwardClearingProcess",
    label: "Inward Clearing Process",
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
        componentType: "hidden",
      },
      name: "AMOUNT",
      label: "",
      type: "text",

      GridProps: { xs: 12, sm: 1.2, md: 1.2, lg: 1.2, xl: 1.2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "YEAR_CD",
      label: "Year",
      type: "text",

      GridProps: { xs: 12, sm: 1, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        name: "BRANCH_CD",
        required: true,
        GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },

        postValidationSetCrossFieldValues: (field) => {
          if (!field?.value.trim()) {
            return {
              WARRANT_NO: { value: "" },
              DIVIDEND_AMOUNT: { value: "" },
            };
          }
        },
      },
      accountTypeMetadata: {
        name: "ACCT_TYPE",
        GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
        isFieldFocused: true,
        defaultfocus: true,
        required: true,
        dependentFields: ["BRANCH_CD"],
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "DIV",
          });
        },
        _optionsKey: "getInwardDividendTypeList",
        postValidationSetCrossFieldValues: (field) => {
          if (!field?.value) {
            return {
              WARRANT_NO: { value: "" },
              DIVIDEND_AMOUNT: { value: "" },
            };
          }
        },
        // CreateFilterOptionsConfig: (field) => {
        //   console.log("requestProps", field);
        // },
      },
      accountCodeMetadata: {
        name: "ACCT_CD",
        label: "A/C Number",
        placeholder: "",
        fullWidth: true,
        required: true,
        FormatProps: {
          isAllowed: (values) => {
            if (values?.value?.length > 6) {
              return false;
            }
            return true;
          },
        },

        dependentFields: ["ACCT_TYPE", "BRANCH_CD", "YEAR_CD", "AMOUNT"],

        // disableCaching: false,
        postValidationSetCrossFieldValues: async (
          field,
          formState,
          auth,
          dependentFieldsValues
        ) => {
          // if (formState?.isSubmitting) return {};
          if (
            field.value &&
            dependentFieldsValues?.["ACCT_TYPE"]?.value.trim() &&
            dependentFieldsValues?.["BRANCH_CD"]?.value.trim()
          ) {
            let Apireq = {
              ACCT_CD: utilFunction.getPadAccountNumber(
                field?.value,
                dependentFieldsValues?.["ACCT_TYPE"]?.optionData
              ),
              ACCT_TYPE: dependentFieldsValues?.["ACCT_TYPE"]?.value,
              BRANCH_CD: dependentFieldsValues?.["BRANCH_CD"]?.value,
              YEAR_CD: dependentFieldsValues?.["YEAR_CD"]?.value,
              // SCREEN_REF: "ETRN/650",
            };
            formState.setDataOnFieldChange("TAB_REQUEST", Apireq);

            let postData = await getDividendAccountDetail(Apireq);
            formState.setDataOnFieldChange("POST_DATA", postData);
            // First, handle "999" status
            let validationFailedMessageShown = false; // Flag to prevent showing multiple "Account Validation Failed" messages
            postData = postData?.map((item) => {
              if (item?.O_STATUS === "999" && !validationFailedMessageShown) {
                validationFailedMessageShown = true;
                formState?.MessageBox({
                  messageTitle: "Account Validation Failed",
                  message: item?.O_MESSAGE,
                });
              }
              return item; // Return the item in the map function
            });

            // Then, handle "99" status
            if (postData && postData?.[0]?.O_STATUS === "99") {
              if (!validationFailedMessageShown) {
                // Check if "999" message is not shown yet
                formState?.MessageBox({
                  messageTitle: "Information",
                  message: postData?.[0]?.O_MESSAGE,
                  buttonNames: ["Ok"],
                });

                if (postData?.[0]?.RET_FLAG === "Y") {
                  let viewMasterData = await getDividendViewMasterData({
                    ...Apireq,
                    A_ASON_DT: auth?.workingDate,
                    COMP_CD: auth?.companyID,
                  });
                  formState.setDataOnFieldChange("VIEW_MASTER", viewMasterData);
                }
              }
              if (postData?.[0]?.DIVIDEND_AMOUNT) {
                if (
                  postData?.[0]?.DIVIDEND_AMOUNT !==
                  dependentFieldsValues?.["AMOUNT"]?.value
                ) {
                  formState?.MessageBox({
                    messageTitle: "Validation Failed",
                    message: "Dividend Amount not match ",
                    buttonNames: ["Ok"],
                  });
                }
              }
              return {
                ACCT_CD: {
                  value: field.value.padStart(6, "0")?.padEnd(20, " "),
                  ignoreUpdate: true,
                },
                WARRANT_NO: {
                  value: postData?.[0]?.WARRANT_NO ?? "",
                },
                DIVIDEND_AMOUNT: {
                  value: postData?.[0]?.DIVIDEND_AMOUNT ?? "",
                },
              };
            }
          } else if (!field?.value) {
            return {
              WARRANT_NO: { value: "" },
              DIVIDEND_AMOUNT: { value: "" },
            };
          }
        },

        runPostValidationHookAlways: true,
        GridProps: { xs: 12, sm: 1.6, md: 1.6, lg: 1.6, xl: 1.6 },
      },
    },

    {
      render: {
        componentType: "numberFormat",
      },
      name: "TYPE_CD",
      label: "Dr",
      type: "text",
      defaultValue: "5",
      GridProps: { xs: 12, sm: 1, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "WARRANT_NO",
      label: "Warrant Number",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "DIVIDEND_AMOUNT",
      label: "Dividend Amount",
      placeholder: "",
      isReadOnly: true,
      type: "text",
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "",
      defaultValue: "DEBIT CLEARING",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 1.7, md: 1.7, lg: 1.7, xl: 1.7 },
    },
  ],
};

export const ViewDetailGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Inward Clearing Process(TRN/650)",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [10, 20, 30, 50],
    defaultPageSize: 10,
    containerHeight: { min: "40vh", max: "40vh" },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  filters: [],

  columns: [
    {
      accessor: "ACCT_TYPE",
      columnName: "Type",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 90,
      minWidth: 100,
      maxWidth: 180,
    },
    {
      accessor: "ACCT_CD",
      columnName: "Account Number",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "YEAR_CD",
      columnName: "Year",
      sequence: 2,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      accessor: "WARRANT_NO",
      columnName: "Warrant Number",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "TYPE_CD",
      columnName: "Dr.",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "DIVIDEND_AMOUNT",
      columnName: "Dividend Amount",
      sequence: 5,
      alignment: "center",
      componentType: "currency",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "NO_OF_SHARE",
      columnName: "Shares",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "SHARE_AMOUNT",
      columnName: "Shares Amount",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "AMOUNT",
      columnName: "Amount",
      sequence: 5,
      alignment: "center",
      componentType: "currency",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "DIVIDEND_RATE",
      columnName: "Rate",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "PAID",
      columnName: "Paid",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "PAID_DATE",
      columnName: "Paid Date",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "CREDIT_ACCOUNT",
      columnName: "Credit Account",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
  ],
};
export const PaidWarrantGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Inward Clearing Process(TRN/650)",
    rowIdColumn: "TRAN_CD",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [10, 20, 30, 50],
    defaultPageSize: 10,
    containerHeight: { min: "40vh", max: "40vh" },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  filters: [],

  columns: [
    {
      accessor: "ACCT_TYPE",
      columnName: "Type",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 90,
      minWidth: 100,
      maxWidth: 180,
    },
    {
      accessor: "ACCT_CD",
      columnName: "Account Number",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "YEAR_CD",
      columnName: "Year",
      sequence: 2,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      accessor: "WARRANT_NO",
      columnName: "Warrant Number",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "TYPE_CD",
      columnName: "Dr.",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "DIVIDEND_AMOUNT",
      columnName: "Dividend Amount",
      sequence: 5,
      alignment: "center",
      componentType: "currency",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "NO_OF_SHARE",
      columnName: "Shares",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "SHARE_AMOUNT",
      columnName: "Shares Amount",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "AMOUNT",
      columnName: "Amount",
      sequence: 5,
      alignment: "center",
      componentType: "currency",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "DIVIDEND_RATE",
      columnName: "Rate",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "PAID",
      columnName: "Paid",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "PAID_DATE",
      columnName: "Paid Date",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "CREDIT_ACCOUNT",
      columnName: "Credit Account",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
  ],
};
export const ViewMasterMetaData = {
  form: {
    name: "ViewMasterMetaData",
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
      Divider: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "BRANCH_CD",
      label: "Branch Code",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 1.2, md: 1.2, lg: 1.2, xl: 1.2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_TYPE",
      label: "Account Type",
      // placeholder: "EnterAcNo",
      type: "text",

      GridProps: { xs: 12, sm: 1.2, md: 1.2, lg: 1.2, xl: 1.2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_CD",
      label: "Account Number",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "Account Name",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 3.9, md: 3.9, lg: 3.9, xl: 3.9 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CUSTOMER_ID",
      label: "Id",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "OP_DATE",
      label: "Opening Date",
      placeholder: "",
      format: "dd/MM/yyyy",
      type: "text",
      fullWidth: true,

      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Cheque Date is required."] }],
      },
      GridProps: { xs: 12, sm: 2.3, md: 2.3, lg: 2.3, xl: 2.3 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "JOINT1",
      label: "Joint Name",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 3.9, md: 3.9, lg: 3.9, xl: 3.9 },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "UNCL_BAL",
      label: "Opening Balance",
      placeholder: "",
      isFieldFocused: true,
      required: true,
      type: "text",
      FormatProps: {
        allowNegative: false,
      },

      GridProps: { xs: 6, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "CONF_BAL",
      label: "Closing Balance",
      placeholder: "",
      isFieldFocused: true,
      required: true,
      type: "text",
      FormatProps: {
        allowNegative: false,
      },

      GridProps: { xs: 6, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TRAN_BAL",
      label: "Shadow Balance",
      placeholder: "",
      isFieldFocused: true,
      required: true,
      type: "text",
      FormatProps: {
        allowNegative: false,
      },

      GridProps: { xs: 6, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "INST_RS",
      label: "No.of Shares",
      placeholder: "",
      isFieldFocused: true,
      required: true,
      type: "text",
      FormatProps: {
        allowNegative: false,
      },

      GridProps: { xs: 6, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "NOMI1",
      label: "Nominee",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 3.9, md: 3.9, lg: 3.9, xl: 3.9 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MODE_NM",
      label: "Mode Name",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 3.4, md: 3.4, lg: 3.4, xl: 3.4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CATEG_NM",
      label: "Category",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 3.4, md: 3.4, lg: 3.4, xl: 3.4 },
    },

    {
      render: {
        componentType: "Divider",
      },
      dividerText: "Address",
      name: "Address",
      label: "Address",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD1",
      label: "Address",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 4.5, md: 4.5, lg: 4.5, xl: 4.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "AREA_NM",
      label: "Area",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 2.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CITY_NM",
      label: "City",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 2.5 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "PIN_CODE",
      label: "Pin Code",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD2",
      label: "Address2",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 4.5, md: 4.5, lg: 4.5, xl: 4.5 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "DIST_NM",
      label: "District",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 2.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "STATE_NM",
      label: "State",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 2.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "COUNTRY_NM",
      label: "Country",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 2.5 },
    },

    {
      render: {
        componentType: "Divider",
      },
      dividerText: "Contacts",
      name: "Contacts",
      label: "Contacts",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CONTACT1",
      label: "Phone(O)",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 2.7, md: 2.7, lg: 2.7, xl: 2.7 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CONTACT4",
      label: "Phone(R)",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 2.7, md: 2.7, lg: 2.7, xl: 2.7 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CONTACT2",
      label: "Mobile No.",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 2.7, md: 2.7, lg: 2.7, xl: 2.7 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CONTACT3",
      label: "Alternate Phone",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 2.7, md: 2.7, lg: 2.7, xl: 2.7 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ISSUED_BRANCH",
      label: "Issued Branch",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,

      GridProps: { xs: 12, sm: 2.2, md: 2.2, lg: 2.2, xl: 2.2 },
    },
  ],
};
