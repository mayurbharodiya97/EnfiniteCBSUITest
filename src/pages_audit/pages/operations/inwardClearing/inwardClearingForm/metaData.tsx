import { utilFunction } from "components/utils";
import * as API from "../api";
import { GeneralAPI } from "registry/fns/functions";
export const chequeReturnPostFormMetaData = {
  form: {
    name: "CustomerLevelPostReturn",
    label: "Customer Level Post/Return",
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

    {
      render: {
        componentType: "hidden",
      },
      name: "TRAN_DATE",
      label: "",
      placeholder: "",
      format: "dd/MM/yyyy",

      GridProps: { xs: 12, sm: 2, md: 1.8, lg: 1.8, xl: 1.5 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "RANGE_DATE",
      label: "",
      placeholder: "",
      format: "dd/MM/yyyy",

      GridProps: { xs: 12, sm: 2, md: 1.8, lg: 1.8, xl: 1.5 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "CHEQUE_DATE",
      label: "Cheque Date",
      placeholder: "",
      format: "dd/MM/yyyy",
      type: "text",
      fullWidth: true,
      dependentFields: ["TRAN_DATE", "RANGE_DATE"],
      validate: (currentField, dependentField) => {
        const currentDate = new Date(currentField?.value);
        const rangeDate = new Date(dependentField?.RANGE_DATE?.value);
        const transDate = new Date(dependentField?.TRAN_DATE?.value);

        if (currentDate < rangeDate || currentDate > transDate) {
          return `Date should be between ${rangeDate.toLocaleDateString(
            "en-IN"
          )} - ${transDate.toLocaleDateString("en-IN")}`;
        }
        return "";
      },

      required: true,
      maxLength: 6,

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
        // postValidationSetCrossFieldValues: () => {
        //   return {
        //     ACCT_CD: { value: "" },
        //     ACCT_NM: { value: "" },
        //   };
        // },
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
        // defaultValue: "",
        // dependentFields: ["ACCT_TYPE"],
        // postValidationSetCrossFieldValues: () => {
        //   return { ACCT_CD: { value: "" }, ACCT_NM: { value: "" } };
        // },
      },
      accountCodeMetadata: {
        name: "ACCT_CD",
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
          console.log("dependentFieldsValues", dependentFieldsValues);
          if (
            field.value &&
            dependentFieldsValues?.["ACCT_TYPE"]?.value &&
            dependentFieldsValues?.["BRANCH_CD"]?.value
            // dependentFieldsValues?.["ACCT_TYPE"]?.value.trim() &&
            // dependentFieldsValues?.["BRANCH_CD"]?.value.trim()
          ) {
            console.log(
              "test",
              field.value &&
                dependentFieldsValues?.["ACCT_TYPE"]?.value &&
                dependentFieldsValues?.["BRANCH_CD"]?.value
            );
            let Apireq = {
              COMP_CD: auth?.companyID,
              ACCT_CD: utilFunction.getPadAccountNumber(
                field?.value,
                dependentFieldsValues?.["ACCT_TYPE"]?.optionData
              ),
              ACCT_TYPE: dependentFieldsValues?.["ACCT_TYPE"]?.value,
              BRANCH_CD: dependentFieldsValues?.["BRANCH_CD"]?.value,
              GD_TODAY_DT: auth?.workingDate,
              SCREEN_REF: "ETRN/650",
            };

            let postData = await GeneralAPI.getAccNoValidation(Apireq);
            if (postData?.MESSAGE1) {
              formState?.MessageBox({
                messageTitle: "Information",
                message: postData?.MESSAGE1,
              });
            } else if (postData?.RESTRICT_MESSAGE) {
              formState?.MessageBox({
                messageTitle: "Account Validation Failed",
                message: postData?.RESTRICT_MESSAGE,
              });
              return {
                ACCT_CD: { value: "", isFieldFocused: true },
                ACCT_NM: { value: "" },
              };
            }

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
                value: postData?.ACCT_NM ?? "",
              },
            };
          } else if (!field?.value) {
            return {
              ACCT_NM: { value: "" },
            };
          }
        },

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

      GridProps: { xs: 12, sm: 3.7, md: 3.7, lg: 3.7, xl: 3.7 },
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
      GridProps: { xs: 12, sm: 3.3, md: 3.3, lg: 3.3, xl: 3.3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "WIDTH_BAL",
      label: "Withdraw.Balance",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
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

      GridProps: { xs: 12, sm: 1, md: 1, lg: 1, xl: 1 },
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
      dependentFields: ["RETURN"],
      GridProps: { xs: 12, sm: 1, md: 1, lg: 1, xl: 1 },
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
    // {
    //   render: {
    //     componentType: "typography",
    //   },
    //   name: "DIVIDER",
    //   label: "",
    //   // defaultValue: "For Return",
    //   TypographyProps: {
    //     style: {
    //       whiteSpace: "pre-line",
    //       color: "red",
    //       fontSize: "1rem",
    //       border: "1px solid black",
    //       borderStyle: "dashed",
    //       width: "100%",
    //       height: "0px",
    //     },
    //   },
    //   GridProps: {
    //     xs: 12,
    //     md: 12,
    //     sm: 12,
    //     style: { alignSelf: "center" },
    //   },
    // },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "ZONE_CD",
      label: "Zone",
      dependentFields: ["RETURN", "ACCT_CD", "BRANCH_CD", "ACCT_TYPE"],
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

      shouldExclude: (_, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.RETURN?.value) {
          return false;
        } else {
          return true;
        }
      },
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
      GridProps: { xs: 12, sm: 1.7, md: 1.7, lg: 1.7, xl: 1.7 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "RET_BRANCH_CD",
      label: "Return Branch",
      placeholder: "Branch",
      type: "text",
      isFieldFocused: true,
      required: true,
      // maxLength: 16,
      options: GeneralAPI.getBranchCodeList,
      _optionsKey: "getBranchCodeList",
      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
      dependentFields: ["RETURN", "DISABLE_RET_AC"],
      isReadOnly: (fieldValue, dependentFields, formState) => {
        if (dependentFields?.DISABLE_RET_AC?.value === "Y") {
          return true;
        } else {
          return false;
        }
      },
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.RETURN?.value) {
          return false;
        } else {
          return true;
        }
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
      name: "RET_ACCT_TYPE",
      label: "Return Account Type",
      type: "text",
      required: true,
      GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
      dependentFields: ["RETURN", "DISABLE_RET_AC"],
      isReadOnly: (fieldValue, dependentFields, formState) => {
        if (dependentFields?.DISABLE_RET_AC?.value === "Y") {
          return true;
        } else {
          return false;
        }
      },
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.RETURN?.value) {
          return false;
        } else {
          return true;
        }
      },
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Return Account Type is required."] },
        ],
      },
      options: GeneralAPI.getAccountTypeList,
      _optionsKey: "getAccountTypeList",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "RET_ACCT_CD",
      label: "Return Account Number",
      type: "text",
      // fullWidth: true,
      required: true,
      dependentFields: ["RETURN", "DISABLE_RET_AC"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.RETURN?.value) {
          return false;
        } else {
          return true;
        }
      },
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

      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Return Account Number is required."] },
        ],
      },
      GridProps: { xs: 12, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "REASON_CD",
      label: "Reason",
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 2.5 },
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
      dependentFields: ["RETURN"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.RETURN?.value) {
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
      name: "OTH_REASON",
      label: "Other Reason",
      // placeholder: "EnterAcNo",
      type: "text",
      fullWidth: true,
      required: true,
      // maxLength: 20,
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["Other Reason is required."] }],
      // },
      dependentFields: ["RETURN"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.RETURN?.value) {
          return false;
        } else {
          return true;
        }
      },
      GridProps: { xs: 12, sm: 3.3, md: 3.3, lg: 3.3, xl: 2.3 },
    },
  ],
};
export const chequesignFormMetaData = {
  form: {
    name: "CustomerLevelPhotoSignature",
    label: "Customer Level Photo/Signature",
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
      name: "CHEQUE_DATE",
      label: "Cheque Date",
      placeholder: "",
      format: "dd/MM/yyyy",
      type: "text",
      fullWidth: true,
      required: true,
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
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Description is required."] }],
      },
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
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Description is required."] }],
      },
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
