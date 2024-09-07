import { components } from "components/report";
import * as API from "./api";
import { GeneralAPI } from "registry/fns/functions";
import * as CommonApi from "pages_audit/pages/operations/DailyTransaction/TRNCommon/api";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { utilFunction } from "components/utils";

export const TellerScreenMetadata: any = {
  form: {
    name: "TellerOperation",
    label: "Teller Transaction(Maker) - (TRN/039)",
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
      datetimePicker: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "autocomplete",
      },
      required: true,
      name: "TRN",
      label: "Transaction",
      placeholder: "Select Transaction",
      isFieldFocused: true,
      runPostValidationHookAlways: true,
      options: [
        { label: "1 - Cash Receipt", value: "1" },
        { label: "4 - Cash Payment", value: "4" },
        // { label: " Single Denomination", value: "S" },
      ],
      _optionsKey: "defaultOption",
      postValidationSetCrossFieldValues: (
        currentField,
        formState,
        authState,
        dependentFieldValue,
        reqFlag
      ) => {
        formState.setDataOnFieldChange("TRN", currentField);
        if (currentField?.value) {
          const sdc =
            currentField?.value === "1"
              ? "1   "
              : currentField?.value === "4"
              ? "4   "
              : "";
          return {
            BRANCH_CD: { value: authState?.user?.branchCode ?? "" },
            ACCT_TYPE: { value: "" },
            ACCT_CD: { value: "" },
            FLAG: { value: "" },
            TOKEN: { value: "" },
            SDC: { value: sdc ?? "" },
            CHEQUE_NO: { value: "" },
            CHEQUE_DT: { value: "" },
            RECEIPT: { value: "" },
            PAYMENT: { value: "" },
          };
        }
      },
      defaultValue: "1",
      GridProps: {
        xs: 6,
        sm: 3,
        md: 2,
        lg: 2,
        xl: 2,
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Transaction is required"] }],
      },
      AlwaysRunPostValidationSetCrossFieldValues: {
        alwaysRun: true,
        touchAndValidate: false,
      },
    },
    {
      render: {
        componentType: "_accountNumber",
      },
      // fullAccountNumberMetadata: {
      //   name:"FL_AACT_CD",
      //   maxLength: 8,
      //   GridProps: {
      //     xs: 2,
      //     sm: 2,
      //     md: 2,
      //     lg: 2,
      //     xl: 2,
      //   },
      // },
      branchCodeMetadata: {
        name: "BRANCH_CD",
        dependentFields: ["TRN"],
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: (
          currentField,
          formState,
          authState,
          dependentFieldValue,
          reqFlag
        ) => {
          formState.setDataOnFieldChange("BRANCH_CD", currentField);
          return {
            ACCT_TYPE: { value: "" },
            ACCT_CD: { value: "" },
            FLAG: { value: "" },
            CHEQUE_NO: { value: "" },
            CHEQUE_DT: { value: "" },
            RECEIPT: { value: "" },
            PAYMENT: { value: "" },
          };
        },
        GridProps: {
          xs: 6,
          sm: 3,
          md: 1.5,
          lg: 1.5,
          xl: 1.5,
        },
      },
      accountTypeMetadata: {
        name: "ACCT_TYPE",
        dependentFields: ["TRN", "BRANCH_CD"],
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues,
          reqFlag
        ) => {
          formState.setDataOnFieldChange("ACCT_TYPE", {
            currentField,
            branch_cd: dependentFieldValues?.BRANCH_CD?.value,
          });
          const sdcValue =
            dependentFieldValues?.TRN?.value === "1" ? "1   " : "4   ";
          return {
            ACCT_CD: { value: "" },
            FLAG: { value: "" },
            CHEQUE_NO: { value: "" },
            CHEQUE_DT: { value: "" },
            RECEIPT: { value: "" },
            PAYMENT: { value: "" },
          };
        },
        GridProps: {
          xs: 6,
          sm: 3,
          md: 1.5,
          lg: 1.5,
          xl: 1.5,
        },
      },
      accountCodeMetadata: {
        name: "ACCT_CD",
        dependentFields: ["TRN", "BRANCH_CD", "ACCT_TYPE"],
        autoComplete: "off",
        GridProps: {
          xs: 6,
          sm: 3,
          md: 2,
          lg: 2,
          xl: 2,
        },
        enableShortcut: ["ACCT_CD", "ACCT_TYPE", "BRANCH_CD"],
        postValidationSetCrossFieldValues: async (
          field,
          formState,
          authState,
          dependentFieldValues
        ) => {
          // console.log("POST CALLED");
          const previousValue = formState.previousFieldValue || "";
          // const paddedAcctcode = (field?.value).padStart(
          //   dependentFieldValues?.ACCT_TYPE?.optionData?.[0]?.PADDING_NUMBER ||
          //     0,
          //   0
          // );
          const paddedAcctcode = utilFunction?.getPadAccountNumber(
            field?.value,
            dependentFieldValues?.ACCT_TYPE?.optionData?.[0]
          );
          if (field.value !== previousValue) {
            // console.log(field.value, "paddedACCTCD__", previousValue);
            const reqParameters = {
              BRANCH_CD: dependentFieldValues?.BRANCH_CD?.value,
              COMP_CD: authState?.companyID,
              ACCT_TYPE: dependentFieldValues?.ACCT_TYPE?.value,
              ACCT_CD: paddedAcctcode,
              SCREEN_REF: "ETRN/039",
            };

            if (
              paddedAcctcode &&
              dependentFieldValues?.BRANCH_CD?.value &&
              dependentFieldValues?.ACCT_TYPE?.value
            ) {
              const postData = await GeneralAPI.getAccNoValidation(
                reqParameters
              );
              const getBtnName = async (msgObj) => {
                let btnNm = await formState?.MessageBox(msgObj);
                return { btnNm, msgObj };
              };
              for (let i = 0; i < postData?.MSG?.length; i++) {
                if (postData?.MSG?.length > 0) {
                  if (postData?.MSG[i]?.O_STATUS === "999") {
                    const { btnNm, msgObj } = await getBtnName({
                      messageTitle: "ValidationFailed",
                      message: postData?.MSG[i]?.O_MESSAGE,
                    });
                    if (btnNm === "Ok") {
                      return {
                        ACCT_CD: { value: "" },
                        FLAG: { value: "" },
                        CHEQUE_NO: { value: "" },
                        CHEQUE_DT: { value: "" },
                        RECEIPT: { value: "" },
                        PAYMENT: { value: "" },
                      };
                    }
                  } else if (postData?.MSG[i]?.O_STATUS === "99") {
                    const { btnNm, msgObj } = await getBtnName({
                      messageTitle: "confirmation",
                      message: postData?.MSG[i]?.O_MESSAGE,
                      buttonNames: ["Yes", "No"],
                    });
                    if (btnNm === "No") {
                      return {
                        ACCT_CD: { value: "" },
                        FLAG: { value: "" },
                        CHEQUE_NO: { value: "" },
                        CHEQUE_DT: { value: "" },
                        RECEIPT: { value: "" },
                        PAYMENT: { value: "" },
                      };
                    }
                  } else if (postData?.MSG[i]?.O_STATUS === "9") {
                    const { btnNm, msgObj } = await getBtnName({
                      messageTitle: "Alert",
                      message: postData?.MSG[i]?.O_MESSAGE,
                    });
                  }
                }
              }

              // if (postData?.RESTRICTION) {
              //   formState.MessageBox({
              //     messageTitle: "Validation Failed...!",
              //     message: postData.RESTRICTION,
              //     buttonNames: ["Ok"],
              //     defFocusBtnName: "Ok",
              //     icon: "ERROR",
              //   });
              //   return {
              //     ACCT_CD: { value: "" },
              //     FLAG: { value: "" },
              //     CHEQUE_NO: { value: "" },
              //     CHEQUE_DT: { value: "" },
              //     RECEIPT: { value: "" },
              //     PAYMENT: { value: "" },
              //   };
              // }

              // if (postData?.MESSAGE1) {
              //   formState.MessageBox({
              //     messageTitle: "Validation Alert",
              //     message: postData.MESSAGE1,
              //     buttonNames: ["Ok"],
              //     defFocusBtnName: "Ok",
              //     icon: "INFO",
              //   });
              // }

              const carousalCardDataReqParameters = {
                COMP_CD: authState?.companyID,
                ACCT_TYPE: dependentFieldValues?.ACCT_TYPE?.value,
                BRANCH_CD: dependentFieldValues?.BRANCH_CD?.value,
                ACCT_CD: paddedAcctcode,
                PARENT_TYPE:
                  dependentFieldValues?.ACCT_TYPE?.optionData?.[0]
                    ?.PARENT_TYPE ?? "",
              };

              const carousalCardData = await CommonApi.getCarousalCards({
                reqData: carousalCardDataReqParameters,
              });

              formState.setDataOnFieldChange("ACCT_CD", {
                paddedAcctcode,
                dependentFieldValues,
                carousalCardData,
              });
              formState.previousFieldValue = paddedAcctcode;
              const sdcValue =
                dependentFieldValues?.TRN?.value === "1" ? "1   " : "4   ";
              return {
                ACCT_CD: { value: paddedAcctcode ?? "", ignoreUpdate: true },
                FLAG: { value: "A" },
                CHEQUE_NO: {
                  value: postData?.CHEQUE_NO ?? "",
                  ignoreUpdate: true,
                },
                CHEQUE_DT: { value: "" },
                RECEIPT: { value: "" },
                PAYMENT: { value: "" },
              };
            }
          }
        },
        schemaValidation: {},
        validate: (currentField, dependentFields, formState) => {
          // console.log(formState, currentField?.value, "formState");
          if (!currentField?.value) {
            formState?.setCardDetails([]);
            return "Account code is required";
          }
        },
      },

      // acctFieldPara: "1",
      // postValidationSetCrossFieldValues: () =>
      //   getRetrieveData({
      //     COMP_CD: "132 ",
      //     SELECT_COLUMN: { CUSTOMER_ID: "2" },
      //   }),
      // acctTypeCustomAPI: () => getpMiscData("CKYC_ACCT_TYPE"),
      // branchCodeCustomAPI: () =>
      //   getCIFCategories({
      //     COMP_CD: "132 ",
      //     BRANCH_CD: "099 ",
      //     ENTITY_TYPE: "I",
      //   }),
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "FLAG",
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "TOKEN",
      label: "Token",
      placeholder: "Enter Token",
      defaultValue: "",
      GridProps: {
        xs: 6,
        md: 1,
        sm: 4,
        lg: 1,
        xl: 1,
      },
      dependentFields: ["TRN", "FLAG"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.TRN?.value === "4") {
          return false;
        } else {
          return true;
        }
      },
      isReadOnly: (fieldValue, dependentFields, formState) => {
        if (dependentFields?.FLAG?.value === "A") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "SDC",
      label: "SDC",
      placeholder: "Select SDC",
      options: API.getSDCList,
      _optionsKey: "getSDCList",
      GridProps: {
        xs: 6,
        md: 1,
        sm: 4,
        lg: 1,
        xl: 1,
      },
      dependentFields: ["TRN", "FLAG"],
      // postValidationSetCrossFieldValues: async (
      //   field,
      //   formState,
      //   authState,
      //   dependentFieldValues
      // ) => {
      //   console.log(field, "65468456454sdokfmnsdfv");
      //   let sdc;

      //   if (field?.optionData?.[0]?.CODE) {
      //     sdc = field?.optionData?.[0]?.DISLAY_STANDARD;
      //   }
      //   // return sdc;
      //   return {
      //     REMARK: { value: sdc },
      //   };
      // },
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.TRN?.value === "1" ||
          dependentFieldsValues?.TRN?.value === "4"
        ) {
          return false;
        } else {
          return true;
        }
      },
      // isReadOnly: (fieldValue, dependentFields, formState) => {
      //   if (dependentFields?.FLAG?.value === "A") {
      //     return false;
      //   }
      //   return true;
      // },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARK",
      label: "Remark",
      placeholder: "Enter Remark",
      defaultValue: "",
      GridProps: {
        xs: 6,
        md: 2,
        sm: 4,
        lg: 2,
        xl: 2,
      },
      dependentFields: ["TRN", "BRANCH_CD", "ACCT_TYPE", "SDC", "FLAG"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.TRN?.value === "1" ||
          dependentFieldsValues?.TRN?.value === "4"
        ) {
          return false;
        } else {
          return true;
        }
      },
      // setValueOnDependentFieldsChange: (dependentFields) => {
      //   let sdc;
      //   if (dependentFields?.TRN?.value === "R") {
      //     if (dependentFields?.SDC?.optionData?.[0]?.CODE === "1   ")
      //       sdc = dependentFields?.SDC?.optionData?.[0]?.DISLAY_STANDARD;
      //   } else if (dependentFields?.TRN?.value === "P") {
      //     if (dependentFields?.SDC?.optionData?.[0]?.CODE === "4   ") {
      //       sdc = dependentFields?.SDC?.optionData?.[0]?.DISLAY_STANDARD;
      //     }
      //   } else {
      //     sdc = "";
      //   }
      //   console.log(sdc, "sdcsdcsdcsdcsdcsdcsdcsdcsdcsdcsdcsdcsdc");

      //   return sdc;
      // },
      // isReadOnly: (fieldValue, dependentFields, formState) => {
      //   if (dependentFields?.FLAG?.value === "A") {
      //     return false;
      //   }
      //   return true;
      // },
      setValueOnDependentFieldsChange: (dependentFields) => {
        if (dependentFields?.SDC?.optionData?.[0]?.DISLAY_STANDARD) {
          const RMARK = dependentFields?.SDC?.optionData?.[0]?.DISLAY_STANDARD;
          return RMARK;
        }
        return "";
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "FLAG_CHEQUENO",
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_NO",
      label: "Cheque No.",
      placeholder: "Enter Cheque No.",
      defaultValue: "",
      GridProps: {
        xs: 6,
        md: 1,
        sm: 4,
        lg: 1,
        xl: 1,
      },
      dependentFields: ["TRN", "FLAG", "BRANCH_CD", "ACCT_TYPE", "ACCT_CD"],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentFieldValues
      ) => {
        const chequeNo = field?.value;
        const branchCd = dependentFieldValues?.BRANCH_CD?.value;
        const acctCd = utilFunction?.getPadAccountNumber(
          dependentFieldValues?.ACCT_CD?.value,
          dependentFieldValues?.ACCT_TYPE?.optionData
        );
        const acctyType = dependentFieldValues?.ACCT_TYPE?.value;

        if (chequeNo && branchCd && acctyType && acctCd) {
          const reqParameters = {
            // COMP_CD: authState?.companyID,
            BRANCH_CD: branchCd,
            ACCT_TYPE: acctyType,
            ACCT_CD: acctCd,
            CHEQUE_NO: chequeNo,
            TYPE_CD: dependentFieldValues?.TRN?.value,
          };

          const apiResponse = await API?.getChqValidation(reqParameters);
          let button, returnValue;

          const getBtnName = async (msgObj) => {
            let btnNm = await formState?.MessageBox(msgObj);
            return { btnNm, msgObj };
          };
          for (let i = 0; i < apiResponse?.length; i++) {
            // console.log(
            //   apiResponse[i]?.ERR_CODE,
            //   apiResponse[i]?.ERR_MSG,
            //   "apiResponse[i]?.ERR_MSG btnNm"
            // );
            if (apiResponse[i]?.ERR_CODE === "999") {
              const { btnNm, msgObj } = await getBtnName({
                messageTitle: "ValidationFailed",
                message: apiResponse[i]?.ERR_MSG,
              });
              if (btnNm === "Ok") {
                return {
                  CHEQUE_NO: {
                    value: "",
                    // isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                  CHEQUE_DT: {
                    value: "",
                    // isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                  RECEIPT: {
                    value: "",
                    // isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                  PAYMENT: {
                    value: "",
                    // isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                };
              }
            } else if (apiResponse[i]?.ERR_CODE === "99") {
              const { btnNm, msgObj } = await getBtnName({
                messageTitle: "confirmation",
                message: apiResponse[i]?.ERR_MSG,
                buttonNames: ["Yes", "No"],
              });
              if (btnNm === "No") {
                return {
                  CHEQUE_NO: {
                    value: "",
                    // isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                  CHEQUE_DT: {
                    value: "",
                    // isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                  RECEIPT: {
                    value: "",
                    // isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                  PAYMENT: {
                    value: "",
                    // isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                  FLAG_CHEQUENO: {
                    value: "",
                    // isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                };
              } else if (btnNm === "Yes") {
                return {
                  FLAG_CHEQUENO: {
                    value: "A",
                    // isFieldFocused: true,
                    ignoreUpdate: true,
                  },
                };
              }
            } else if (apiResponse[i]?.ERR_CODE === "9") {
              const { btnNm, msgObj } = await getBtnName({
                messageTitle: "Alert",
                message: apiResponse[i]?.ERR_MSG,
              });
              return {
                FLAG_CHEQUENO: {
                  value: "A",
                  // isFieldFocused: true,
                  ignoreUpdate: true,
                },
              };
            } else if (apiResponse[i]?.ERR_CODE === "0") {
              return {
                FLAG_CHEQUENO: {
                  value: "A",
                  // isFieldFocused: true,
                  ignoreUpdate: true,
                },
              };
            }
          }
        }
      },
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.TRN?.value === "4") {
          return false;
        } else {
          return true;
        }
      },
      isReadOnly: (fieldValue, dependentFields, formState) => {
        if (dependentFields?.FLAG?.value === "A") {
          return false;
        }
        return true;
      },
      validate: (currentField, dependentFields, formState) => {
        // console.log(formState, currentField?.value, "formState");
        if (!currentField?.value) {
          return "Cheque No. code is required";
        }
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "CHEQUE_DT",
      label: "Cheque Date",
      placeholder: "Enter Cheque Date",
      isWorkingDate: true,
      GridProps: {
        xs: 6,
        md: 1.5,
        sm: 4,
        lg: 1.5,
        xl: 1.5,
      },
      dependentFields: ["TRN", "FLAG"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.TRN?.value === "4") {
          return false;
        } else {
          return true;
        }
      },
      isReadOnly: true,
    },
    // {
    //   render: {
    //     componentType: "checkboxGroup",
    //   },
    //   name: "CHEQ_BK_GRP",
    //   label: "CHEQ_BK_GRP",
    //   placeholder: "CHEQ_BK_GRP",
    //   options: GeneralAPI.getBranchCodeList,
    //   _optionsKey: "defaultOption",
    // },
    // {
    //   render: {
    //     componentType: "timePicker",
    //   },
    //   name: "TM_PKR",
    //   label: "TM_PKR",
    //   placeholder: "TM_PKR",
    //   // format: "hh:mm:ss",
    // },
    {
      render: {
        componentType: "amountField",
      },
      name: "RECEIPT",
      label: "Receipt Amount",
      placeholder: "Enter Receipt",
      required: true,
      dependentFields: ["TRN", "BRANCH_CD", "ACCT_TYPE", "ACCT_CD", "FLAG"],
      validate: (currentField, dependentFields, formState) => {
        // console.log("<<<cff", currentField, dependentFields);
        if (!currentField.value && !dependentFields?.FLAG?.value) {
          return "";
        } else if (!currentField?.value && dependentFields?.FLAG?.value) {
          return "Enter valid amount";
        }
        return "";
      },
      isReadOnly: (fieldValue, dependentFields, formState) => {
        // console.log(dependentFields, "dependentFieldsdependentFieldsqa[wdol");
        if (
          dependentFields?.FLAG?.value === "A" &&
          dependentFields?.ACCT_CD?.value
        ) {
          return false;
        }
        return true;
      },
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.TRN?.value === "1") {
          return false;
        } else {
          return true;
        }
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (
          !dependentFieldsValues?.ACCT_CD?.error &&
          Boolean(dependentFieldsValues?.ACCT_CD?.value) &&
          Boolean(dependentFieldsValues?.BRANCH_CD?.value) &&
          Boolean(dependentFieldsValues?.ACCT_TYPE?.value) &&
          Boolean(field?.value)
        ) {
          formState.setDataOnFieldChange("RECEIPT", {
            field,
            dependentFieldsValues,
          });
          // Remove focus from the currently active element
          // @ts-ignore
          document.activeElement.blur();
        }
      },
      AlwaysRunPostValidationSetCrossFieldValues: {
        alwaysRun: true,
        touchAndValidate: false,
      },
      GridProps: {
        xs: 6,
        md: 2,
        sm: 4,
        lg: 2,
        xl: 2,
      },
      // setValueOnDependentFieldsChange: (dependentFields) => {
      //   return "";
      // },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "PAYMENT",
      label: "Payment Amount",
      placeholder: "Enter Payment",
      required: true,
      dependentFields: [
        "TRN",
        "BRANCH_CD",
        "ACCT_TYPE",
        "ACCT_CD",
        "FLAG",
        "FLAG_CHEQUENO",
        "CHEQUE_NO",
      ],
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["Enter valid amount"] }],
      // },
      validate: (currentField, dependentFields, formState) => {
        // console.log("<<<cff", currentField, dependentFields);
        if (!currentField.value && !dependentFields?.FLAG?.value) {
          return "";
        } else if (!currentField?.value && dependentFields?.FLAG?.value) {
          return "Enter valid amount";
        }
        return "";
      },
      isReadOnly: (fieldValue, dependentFields, formState) => {
        if (
          dependentFields?.FLAG?.value === "A" &&
          dependentFields?.ACCT_CD?.value &&
          dependentFields?.FLAG_CHEQUENO?.value === "A" &&
          dependentFields?.CHEQUE_NO?.value
        ) {
          return false;
        }
        return true;
      },
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.TRN?.value === "4") {
          return false;
        } else {
          return true;
        }
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (
          !dependentFieldsValues?.ACCT_CD?.error &&
          Boolean(dependentFieldsValues?.ACCT_CD?.value) &&
          Boolean(dependentFieldsValues?.BRANCH_CD?.value) &&
          Boolean(dependentFieldsValues?.ACCT_TYPE?.value) &&
          Boolean(field?.value)
        ) {
          formState.setDataOnFieldChange("PAYMENT", {
            field,
            dependentFieldsValues,
          });
        }
      },
      AlwaysRunPostValidationSetCrossFieldValues: {
        alwaysRun: true,
        touchAndValidate: false,
      },
      GridProps: {
        xs: 6,
        md: 2,
        sm: 4,
        lg: 2,
        xl: 2,
      },
      // setValueOnDependentFieldsChange: (dependentFields) => {
      //   return "";
      // },
    },

    // { render: { componentType: "hidden" }, name: "HIDDEN_FOCUS" },
    // {
    //   render: {
    //     componentType: "textField",
    //   },
    //   name: "ACCT_NM",
    //   label: "Name",
    //   placeholder: "Enter Name",
    //   GridProps: {
    //     xs: 6,
    //     md: 6,
    //     sm: 3,
    //     lg: 3,
    //     xl: 3,
    //   },
    //   isReadOnly: true,
    //   dependentFields: ["TRN"],
    //   shouldExclude(fieldData, dependentFieldsValues, formState) {
    //     if (
    //       dependentFieldsValues?.TRN?.value === "R" ||
    //       dependentFieldsValues?.TRN?.value === "P"
    //     ) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   },
    //   // setValueOnDependentFieldsChange: (dependentFields) => {
    //   //   return "";
    //   // },
    // },
    // {
    //   render: {
    //     componentType: "amountField",
    //   },
    //   name: "BALANCE",
    //   label: "Balance",
    //   placeholder: "Enter Balance",
    //   GridProps: {
    //     xs: 6,
    //     md: 6,
    //     sm: 3,
    //     lg: 3,
    //     xl: 3,
    //   },
    //   isReadOnly: true,
    //   dependentFields: ["TRN"],
    //   shouldExclude(fieldData, dependentFieldsValues, formState) {
    //     if (
    //       dependentFieldsValues?.TRN?.value === "R" ||
    //       dependentFieldsValues?.TRN?.value === "P"
    //     ) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   },
    //   // setValueOnDependentFieldsChange: (dependentFields) => {
    //   //   return "";
    //   // },
    // },
    // {
    //   render: {
    //     componentType: "amountField",
    //   },
    //   name: "LIMIT",
    //   label: "Transaction Limit",
    //   placeholder: "Enter Transaction Limit",
    //   GridProps: {
    //     xs: 6,
    //     md: 6,
    //     sm: 3,
    //     lg: 3,
    //     xl: 3,
    //   },
    //   defaultValue: "20000",
    //   isReadOnly: true,
    //   dependentFields: ["TRN"],
    //   shouldExclude(fieldData, dependentFieldsValues, formState) {
    //     if (
    //       dependentFieldsValues?.TRN?.value === "R" ||
    //       dependentFieldsValues?.TRN?.value === "P"
    //     ) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   },
    // },
  ],
};
// export const denoViewTrnGridMetaData: GridMetaDataType = {
//   gridConfig: {
//     dense: true,
//     gridLabel: "View Transactions",
//     rowIdColumn: "id",

//     defaultColumnConfig: {
//       width: 200,
//       maxWidth: 300,
//       minWidth: 200,
//     },

//     allowColumnReordering: false,
//     disableSorting: false,
//     hideHeader: false,
//     disableGroupBy: true,
//     enablePagination: false,
//     containerHeight: {
//       min: "420px",
//       max: "420px",
//     },
//     allowFilter: false,
//     allowColumnHiding: false,
//     allowRowSelection: false,
//     isCusrsorFocused: true,
//     hideFooter: true,
//   },
//   columns: [
//     {
//       accessor: "SR_NO",
//       columnName: "Sr.No",
//       sequence: 1,
//       isAutoSequence: true,
//       alignment: "left",
//       componentType: "default",
//       width: 100,
//       minWidth: 100,
//       maxWidth: 100,
//     },
//     {
//       accessor: "Column1",
//       columnName: "Column1",
//       sequence: 2,
//       alignment: "left",
//       componentType: "default",
//       width: 300,
//       minWidth: 200,
//       maxWidth: 350,
//     },
//     {
//       accessor: "Column2",
//       columnName: "Column2",
//       sequence: 3,
//       alignment: "left",
//       componentType: "default",
//       width: 90,
//       minWidth: 100,
//       maxWidth: 200,
//     },
//     {
//       accessor: "Column3",
//       columnName: "Column3",
//       sequence: 4,
//       alignment: "left",
//       componentType: "default",
//       width: 180,
//       minWidth: 180,
//       maxWidth: 180,
//     },
//   ],
// };

export const cashReportMetaData = {
  title: "View Transactions",
  disableGroupBy: "",
  hideFooter: false,
  hideAmountIn: true,
  retrievalType: "",
  groupBy: [""],
  columns: [
    // {
    //   accessor: "sr_no",
    //   columnName: "SrNo",
    //   sequence: 1,
    //   alignment: "left",
    //   componentType: "default",
    //   width: 65,
    //   minWidth: 65,
    //   maxWidth: 130,
    //   isAutoSequence: true,
    // },
    {
      accessor: "BRANCH_CD",
      columnName: "BrCode",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 45,
      maxWidth: 200,
    },
    {
      accessor: "ACCT_TYPE",
      columnName: "AcctType",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 50,
      maxWidth: 240,
    },
    {
      accessor: "ACCT_CD",
      columnName: "ACNo",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 40,
      maxWidth: 200,
    },
    {
      accessor: "TRAN_DT",
      columnName: "TrnDate",
      sequence: 5,
      alignment: "left",
      Cell: components.DateCell,
      // dateFormat: "dd/MM/yyyy",
      format: "dd/MM/yyyy",
      width: 120,
      minWidth: 60,
      maxWidth: 260,
    },
    {
      accessor: "CHEQUE_NO",
      columnName: "Chequeno",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 90,
      maxWidth: 200,
    },
    {
      accessor: "TYPE_CD",
      columnName: "Trx",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 60,
      maxWidth: 120,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 200,
      maxWidth: 400,
    },
    {
      accessor: "DEBIT",
      columnName: "DebitAmount",
      sequence: 5,
      alignment: "right",
      Cell: components.NumberCell,
      width: 140,
      minWidth: 60,
      maxWidth: 220,
      color: "red",
      // currencyRefColumn: "CURR_CD",
      // symbolPosi: "end",
    },
    {
      accessor: "CREDIT",
      columnName: "CreditAmount",
      sequence: 5,
      alignment: "right",
      Cell: components.NumberCell,
      width: 140,
      minWidth: 60,
      maxWidth: 240,
      color: "green",
      // currencyRefColumn: "CURR_CD",
      // isCurrencyCode: true,
      // symbolPosi: "end",
    },
    {
      accessor: "TRAN_CD",
      columnName: "Vno",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 80,
      maxWidth: 220,
    },
    {
      accessor: "CONFIRMED",
      columnName: "Status",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 110,
      maxWidth: 220,
    },
    {
      accessor: "SCROLL1",
      columnName: "Scroll",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 110,
      minWidth: 110,
      maxWidth: 220,
    },
    {
      accessor: "SDC",
      columnName: "SDC",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 220,
    },
    {
      accessor: "MAKER",
      columnName: "Maker",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 130,
      maxWidth: 220,
    },
    {
      accessor: "CHECKER",
      columnName: "Checker",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 130,
      minWidth: 130,
      maxWidth: 220,
    },
  ],
};
// export const denoTableMetadata = {
//   form: {
//     name: "single_denomination",
//     label: "",
//     resetFieldOnUnmount: false,
//     validationRun: "onBlur",
//     submitAction: "home",
//     render: {
//       ordering: "auto",
//       renderType: "simple",
//       gridConfig: {
//         item: {
//           xs: 12,
//           sm: 12,
//           md: 12,
//           lg: 12,
//           xl: 12,
//         },
//         container: {
//           direction: "row",
//           spacing: 3,
//         },
//       },
//     },
//     componentProps: {
//       textField: {
//         fullWidth: true,
//       },
//       select: {
//         fullWidth: true,
//       },
//       datePicker: {
//         fullWidth: true,
//       },
//       numberFormat: {
//         fullWidth: true,
//       },
//       inputMask: {
//         fullWidth: true,
//       },
//       datetimePicker: {
//         fullWidth: true,
//       },
//       divider: {
//         fullWidth: true,
//       },
//     },
//   },
//   fields: [
//     {
//       render: {
//         componentType: "arrayField",
//       },
//       name: "singleDenoRow",
//       label: "Single Denomination",
//       isRemoveButton: true,
//       displayCountName: "row",
//       isScreenStyle: true,
//       disagreeButtonName: "No",
//       agreeButtonName: "Yes",
//       errorTitle: "Are you Sure you want to delete this row?",
//       removeRowFn: "deleteFormArrayFieldData",
//       GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
//       _fields: [
//         // {
//         //   render: {
//         //     componentType: "branchCode",
//         //   },
//         //   GridProps: {
//         //     xs: 6,
//         //     sm: 6,
//         //     md: 2,
//         //     lg: 1,
//         //     xl: 1,
//         //   },
//         // },
//         // {
//         //   render: {
//         //     componentType: "accountType",
//         //   },
//         //   GridProps: {
//         //     xs: 6,
//         //     sm: 6,
//         //     md: 2,
//         //     lg: 1,
//         //     xl: 1,
//         //   },
//         // },
//         // {
//         //   render: {
//         //     componentType: "accountCode",
//         //   },
//         //   GridProps: {
//         //     xs: 6,
//         //     sm: 6,
//         //     md: 2,
//         //     lg: 1.2,
//         //     xl: 1.2,
//         //   },
//         // },
//         {
//           render: { componentType: "_accountNumber" },
//           branchCodeMetadata: {
//             GridProps: {
//               xs: 6,
//               sm: 3,
//               md: 2,
//               lg: 1.2,
//               xl: 1.2,
//             },
//           },
//           accountTypeMetadata: {
//             dependentFields: ["BRANCH_CD"],
//             postValidationSetCrossFieldValues: (
//               field,
//               formState,
//               authState,
//               dependentFieldValues
//             ) => {
//               console.log(dependentFieldValues, "dependentFieldValues");
//               formState.setDataOnFieldChange("ACCT_TYPE", {
//                 currentField: field,
//                 branchCode:
//                   dependentFieldValues?.["singleDenoRow.BRANCH_CD"]?.value ??
//                   "",
//               });
//             },
//             GridProps: {
//               xs: 6,
//               sm: 3,
//               md: 2,
//               lg: 1.2,
//               xl: 1.2,
//             },
//           },
//           accountCodeMetadata: {
//             postValidationSetCrossFieldValues: async (
//               field,
//               formState,
//               authState,
//               dependentFieldValues
//             ) => {
//               console.log(
//                 field,
//                 formState,
//                 authState,
//                 dependentFieldValues,
//                 "metadtaatahdnbbndka"
//               );
//               const companyCode = authState?.companyID;
//               const branchCode =
//                 dependentFieldValues?.["singleDenoRow.BRANCH_CD"]?.value ?? "";
//               const accountType =
//                 dependentFieldValues?.["singleDenoRow.ACCT_TYPE"]?.value ?? "";
//               let accountCode = field?.value ?? "";
//               if (
//                 Boolean(companyCode) &&
//                 Boolean(branchCode) &&
//                 Boolean(accountType) &&
//                 Boolean(accountCode)
//               ) {
//                 accountCode = utilFunction?.getPadAccountNumber(
//                   field?.value,
//                   dependentFieldValues?.["singleDenoRow.ACCT_TYPE"]
//                     ?.optionData?.[0]
//                 );
//                 const reqParameters = {
//                   BRANCH_CD: branchCode,
//                   COMP_CD: companyCode,
//                   ACCT_TYPE: accountType,
//                   ACCT_CD: accountCode,
//                   SCREEN_REF: "ETRN/039",
//                 };
//                 const apiResponse = await GeneralAPI.getAccNoValidation(
//                   reqParameters
//                 );
//                 if (apiResponse?.RESTRICTION) {
//                   formState.MessageBox({
//                     messageTitle: "Validation Failed...!",
//                     message: apiResponse.RESTRICTION,
//                     buttonNames: ["Ok"],
//                     defFocusBtnName: "Ok",
//                     icon: "ERROR",
//                   });
//                   return {
//                     ACCT_CD: { value: "" },
//                     ACCT_TYPE: { value: "" },
//                     RECEIPT: { value: "" },
//                     PAYMENT: { value: "" },
//                   };
//                 }

//                 if (apiResponse?.MESSAGE1) {
//                   formState.MessageBox({
//                     messageTitle: "Validation Alert",
//                     message: apiResponse.MESSAGE1,
//                     buttonNames: ["Ok"],
//                     defFocusBtnName: "Ok",
//                     icon: "INFO",
//                   });
//                 }

//                 const carousalCardDataReqParameters = {
//                   COMP_CD: companyCode,
//                   ACCT_TYPE: accountType,
//                   BRANCH_CD: branchCode,
//                   ACCT_CD: accountCode,
//                   PARENT_TYPE:
//                     dependentFieldValues?.["singleDenoRow.ACCT_TYPE"]
//                       ?.optionData?.[0]?.PARENT_TYPE ?? "",
//                 };

//                 const carousalCardData = await CommonApi.getCarousalCards({
//                   reqData: carousalCardDataReqParameters,
//                 });

//                 formState.setDataOnFieldChange("ACCT_CD", {
//                   accountCode,
//                   dependentFieldValues,
//                   carousalCardData,
//                 });
//                 formState.previousFieldValue = accountCode;
//                 return {
//                   ACCT_CD: { value: accountCode ?? "", ignoreUpdate: true },
//                 };
//                 console.log(apiResponse, "apiResponse9090909");
//                 // console.log(accountCode, "accountCode9090909");
//               }
//             },
//             GridProps: {
//               xs: 6,
//               sm: 3,
//               md: 2,
//               lg: 1.2,
//               xl: 1.2,
//             },
//           },
//         },
//         {
//           render: {
//             componentType: "autocomplete",
//           },
//           name: "TRX",
//           label: "TRX",
//           placeholder: "TRX",
//           defaultValue: "1",
//           options: [
//             { label: "1 - CASH DEPOSITE", value: "D" },
//             { label: "4 - CASH WITHDRAWAL", value: "W" },
//           ],
//           _optionKey: "TRXdata",
//           GridProps: {
//             xs: 6,
//             sm: 3,
//             md: 2,
//             lg: 1,
//             xl: 1,
//           },
//         },
//         {
//           render: {
//             componentType: "numberFormat",
//           },
//           name: "TOKEN",
//           label: "Token",
//           placeholder: "Token",
//           type: "text",
//           GridProps: {
//             xs: 6,
//             sm: 3,
//             md: 2,
//             lg: 1,
//             xl: 1,
//           },
//           dependentFields: ["TRX"],
//           shouldExclude(fieldData, dependentFieldsValues, formState) {
//             if (dependentFieldsValues?.["singleDenoRow.TRX"]?.value === "W") {
//               return false;
//             } else {
//               return true;
//             }
//           },
//         },
//         {
//           render: {
//             componentType: "autocomplete",
//           },
//           name: "SDC",
//           label: "SDC",
//           placeholder: "SDC",
//           defaultValue: "CHGT",
//           type: "select",
//           options: API.getSDCList,
//           _optionsKey: "getSDCList",
//           GridProps: { xs: 6, sm: 3, md: 2, lg: 1.3, xl: 1.3 },
//         },
//         {
//           render: {
//             componentType: "textField",
//           },
//           name: "Remarks",
//           label: "Remarks",
//           placeholder: "Remarks",
//           type: "text",
//           GridProps: { xs: 6, sm: 3, md: 4, lg: 1, xl: 1 },
//         },
//         {
//           render: {
//             componentType: "numberFormat",
//           },
//           name: "CHQNO",
//           label: "Chq.No",
//           placeholder: "Chq.No",
//           type: "number",
//           GridProps: { xs: 6, sm: 3, md: 2, lg: 1, xl: 1 },
//         },
//         {
//           render: {
//             componentType: "amountField",
//           },
//           name: "RECEIPT",
//           label: "Receipt",
//           placeholder: "Receipt",
//           type: "text",
//           validationRun: "all",
//           validate: (currentField, value) => {
//             if (currentField?.value) {
//               return;
//             }
//           },
//           postValidationSetCrossFieldValues: async (
//             field,
//             formState,
//             authState,
//             dependentFieldsValues
//           ) => {
//             if (
//               !dependentFieldsValues?.["singleDenoRow.ACCT_CD"]?.error &&
//               Boolean(
//                 dependentFieldsValues?.["singleDenoRow.ACCT_CD"]?.value
//               ) &&
//               Boolean(
//                 dependentFieldsValues?.["singleDenoRow.BRANCH_CD"]?.value
//               ) &&
//               Boolean(
//                 dependentFieldsValues?.["singleDenoRow.ACCT_TYPE"]?.value
//               ) &&
//               Boolean(field?.value)
//             ) {
//               formState.setDataOnFieldChange("RECEIPT", {
//                 field,
//                 dependentFieldsValues,
//               });
//             }
//             if (field?.value) {
//               return {
//                 RECEIPT_TOTAL: { value: field.value ?? "0" },
//               };
//             } else {
//               return {
//                 RECEIPT_TOTAL: { value: "" },
//               };
//             }
//           },
//           GridProps: { xs: 6, sm: 3, md: 3, lg: 1.5, xl: 1.5 },
//         },
//         {
//           render: {
//             componentType: "amountField",
//           },
//           name: "PAYMENT",
//           label: "Payment",
//           placeholder: "Payment",
//           type: "text",
//           validationRun: "all",
//           validate: (currentField, value) => {
//             if (currentField?.value) {
//               return;
//             }
//           },
//           postValidationSetCrossFieldValues: async (
//             field,
//             formState,
//             authState,
//             dependentFieldsValues
//           ) => {
//             if (
//               !dependentFieldsValues?.["singleDenoRow.ACCT_CD"]?.error &&
//               Boolean(
//                 dependentFieldsValues?.["singleDenoRow.ACCT_CD"]?.value
//               ) &&
//               Boolean(
//                 dependentFieldsValues?.["singleDenoRow.BRANCH_CD"]?.value
//               ) &&
//               Boolean(
//                 dependentFieldsValues?.["singleDenoRow.ACCT_TYPE"]?.value
//               ) &&
//               Boolean(field?.value)
//             ) {
//               formState.setDataOnFieldChange("PAYMENT", {
//                 field,
//                 dependentFieldsValues,
//               });
//             }
//           },
//           GridProps: { xs: 6, sm: 3, md: 3, lg: 1.5, xl: 1.5 },
//         },
//       ],
//     },
//   ],
// };
export const denoTableMetadataTotal: any = {
  form: {
    refID: 1667,
    name: "singleDenoRowTotal",
    label: "Single Denomination",
    resetFieldOnUnmount: false,
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
    },
  },
  fields: [
    {
      render: {
        componentType: "arrayField",
      },
      name: "singleDenoRow",
      isRemoveButton: true,
      displayCountName: "row",
      isScreenStyle: true,
      // fixedRows: true,
      disagreeButtonName: "No",
      agreeButtonName: "Yes",
      errorTitle: "Are you Sure you want to delete this row?",
      removeRowFn: "deleteFormArrayFieldData",
      changeRowOrder: true,
      // addRowFn: (...rest) => {
      //   console.log(rest, "restDatadatadatadata");
      // },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        // {
        //   render: {
        //     componentType: "branchCode",
        //   },
        //   GridProps: {
        //     xs: 6,
        //     sm: 6,
        //     md: 2,
        //     lg: 1,
        //     xl: 1,
        //   },
        // },
        // {
        //   render: {
        //     componentType: "accountType",
        //   },
        //   GridProps: {
        //     xs: 6,
        //     sm: 6,
        //     md: 2,
        //     lg: 1,
        //     xl: 1,
        //   },
        // },
        // {
        //   render: {
        //     componentType: "accountCode",
        //   },
        //   GridProps: {
        //     xs: 6,
        //     sm: 6,
        //     md: 2,
        //     lg: 1.2,
        //     xl: 1.2,
        //   },
        // },
        {
          render: { componentType: "_accountNumber" },
          branchCodeMetadata: {
            // isFieldFocused: true,
            postValidationSetCrossFieldValues: async (
              field,
              formState,
              authState,
              dependentFieldsValues
            ) => {
              return {
                // ACCT_TYPE: { value: "" },
                ACCT_CD: { value: "" },
                FLAG_HIDE: { value: "" },
                TRX: { value: "1" },
                CHQNO: { value: "" },
                CHQ_DT: { value: "" },
                RECEIPT: { value: "" },
                PAYMENT: { value: "" },
              };
            },
            GridProps: {
              xs: 6,
              sm: 3,
              md: 2,
              lg: 1.2,
              xl: 1.2,
            },
          },
          accountTypeMetadata: {
            dependentFields: ["BRANCH_CD"],
            postValidationSetCrossFieldValues: (
              field,
              formState,
              authState,
              dependentFieldValues
            ) => {
              // console.log(dependentFieldValues, "dependentFieldValues");
              formState.setDataOnFieldChange("ACCT_TYPE", {
                currentField: field,
                branchCode:
                  dependentFieldValues?.["singleDenoRow.BRANCH_CD"]?.value ??
                  "",
              });
              return {
                ACCT_CD: { value: "" },
                FLAG_HIDE: { value: "" },
                TRX: { value: "1" },
                CHQNO: { value: "" },
                CHQ_DT: { value: "" },
                RECEIPT: { value: "" },
                PAYMENT: { value: "" },
              };
            },
            GridProps: {
              xs: 6,
              sm: 3,
              md: 2,
              lg: 1.2,
              xl: 1.2,
            },
          },
          accountCodeMetadata: {
            dependentFields: ["BRANCH_CD", "ACCT_TYPE"],
            postValidationSetCrossFieldValues: async (
              field,
              formState,
              authState,
              dependentFieldValues
            ) => {
              // console.log(
              //   field,
              //   formState,
              //   authState,
              //   dependentFieldValues,
              //   "metadtaatahdnbbndka"
              // );
              const previousValue = formState.previousFieldValue || "";
              if (field.value !== previousValue) {
                const companyCode = authState?.companyID;
                const branchCode =
                  dependentFieldValues?.["singleDenoRow.BRANCH_CD"]?.value ??
                  "";
                const accountType =
                  dependentFieldValues?.["singleDenoRow.ACCT_TYPE"]?.value ??
                  "";
                let accountCode = field?.value ?? "";
                if (
                  Boolean(companyCode) &&
                  Boolean(branchCode) &&
                  Boolean(accountType) &&
                  Boolean(accountCode)
                ) {
                  accountCode = utilFunction?.getPadAccountNumber(
                    field?.value,
                    dependentFieldValues?.["singleDenoRow.ACCT_TYPE"]
                      ?.optionData?.[0]
                  );
                  const reqParameters = {
                    BRANCH_CD: branchCode,
                    COMP_CD: companyCode,
                    ACCT_TYPE: accountType,
                    ACCT_CD: accountCode,
                    SCREEN_REF: "ETRN/039",
                  };

                  const apiResponse = await GeneralAPI.getAccNoValidation(
                    reqParameters
                  );
                  const getBtnName = async (msgObj) => {
                    let btnNm = await formState?.MessageBox(msgObj);
                    return { btnNm, msgObj };
                  };
                  for (let i = 0; i < apiResponse?.MSG?.length; i++) {
                    if (apiResponse?.MSG?.length > 0) {
                      if (apiResponse?.MSG[i]?.O_STATUS === "999") {
                        const { btnNm, msgObj } = await getBtnName({
                          messageTitle: "ValidationFailed",
                          message: apiResponse?.MSG[i]?.O_MESSAGE,
                        });
                        if (btnNm === "Ok") {
                          return {
                            ACCT_CD: { value: "" },
                            FLAG_HIDE: { value: "" },
                            // TRX: { value: "1" },
                            CHQNO: { value: "" },
                            CHQ_DT: { value: "" },
                            RECEIPT: { value: "" },
                            PAYMENT: { value: "" },
                          };
                        }
                      } else if (apiResponse?.MSG[i]?.O_STATUS === "99") {
                        const { btnNm, msgObj } = await getBtnName({
                          messageTitle: "confirmation",
                          message: apiResponse?.MSG[i]?.O_MESSAGE,
                          buttonNames: ["Yes", "No"],
                        });
                        if (btnNm === "No") {
                          return {
                            ACCT_CD: { value: "" },
                            FLAG_HIDE: { value: "" },
                            // TRX: { value: "1" },
                            CHQNO: { value: "" },
                            CHQ_DT: { value: "" },
                            RECEIPT: { value: "" },
                            PAYMENT: { value: "" },
                          };
                        }
                      } else if (apiResponse?.MSG[i]?.O_STATUS === "9") {
                        const { btnNm, msgObj } = await getBtnName({
                          messageTitle: "Alert",
                          message: apiResponse?.MSG[i]?.O_MESSAGE,
                        });
                      }
                    }
                  }

                  // if (apiResponse?.RESTRICTION) {
                  //   formState.MessageBox({
                  //     messageTitle: "Validation Failed...!",
                  //     message: apiResponse.RESTRICTION,
                  //     buttonNames: ["Ok"],
                  //     defFocusBtnName: "Ok",
                  //     icon: "ERROR",
                  //   });
                  //   return {
                  //     ACCT_CD: { value: "" },
                  //     FLAG_HIDE: { value: "" },
                  //     TRX: { value: "1" },
                  //     CHQNO: { value: "" },
                  //     CHQ_DT: { value: "" },
                  //     RECEIPT: { value: "" },
                  //     PAYMENT: { value: "" },
                  //   };
                  // }

                  // if (apiResponse?.MESSAGE1) {
                  //   formState.MessageBox({
                  //     messageTitle: "Validation Alert",
                  //     message: apiResponse.MESSAGE1,
                  //     buttonNames: ["Ok"],
                  //     defFocusBtnName: "Ok",
                  //     icon: "INFO",
                  //   });
                  // }

                  const carousalCardDataReqParameters = {
                    COMP_CD: companyCode,
                    ACCT_TYPE: accountType,
                    BRANCH_CD: branchCode,
                    ACCT_CD: accountCode,
                    PARENT_TYPE:
                      dependentFieldValues?.["singleDenoRow.ACCT_TYPE"]
                        ?.optionData?.[0]?.PARENT_TYPE ?? "",
                  };

                  const carousalCardData = await CommonApi.getCarousalCards({
                    reqData: carousalCardDataReqParameters,
                  });

                  formState.setDataOnFieldChange("ACCT_CD", {
                    accountCode,
                    dependentFieldValues,
                    carousalCardData,
                  });
                  formState.previousFieldValue = accountCode;
                  return {
                    ACCT_CD: { value: accountCode ?? "" },
                    FLAG_HIDE: { value: "A" },
                    // TRX: { value: "1" },
                    CHQNO: {
                      value: "0",
                      ignoreUpdate: true,
                    },
                    CHQ_DT: { value: "" },
                    RECEIPT: { value: "" },
                    PAYMENT: { value: "" },
                  };
                }
              }
            },
            GridProps: {
              xs: 6,
              sm: 3,
              md: 2,
              lg: 1.2,
              xl: 1.2,
            },
            schemaValidation: {},
            validate: (currentField, dependentFields, formState) => {
              // console.log(formState, currentField?.value, "formState");
              if (!currentField?.value) {
                formState?.setCardDetails([]);
                return "Account code is required";
              }
            },
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "FLAG_HIDE",
          dependentFields: ["ACCT_CD"],
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "TRX",
          label: "TRX",
          placeholder: "TRX",
          defaultValue: "1",
          options: [
            { label: "1 - CASH DEPOSITE", value: "1" },
            { label: "4 - CASH WITHDRAWAL", value: "W" },
          ],
          _optionKey: "TRXdata",
          dependentFields: ["SDC"],
          postValidationSetCrossFieldValues: async (
            field,
            formState,
            authState,
            dependentFieldValues
          ) => {
            const sdcValue = field?.value === "1" ? "1   " : "4   ";
            return {
              SCROLL: { value: "" },
              TOKEN: { value: "" },
              SDC: { value: sdcValue ?? "" },
              REMARK: { value: "" },
              CHQNO: { value: "" },
              CHQ_DT: { value: "" },
              RECEIPT: { value: "" },
              PAYMENT: { value: "" },
            };
          },
          GridProps: {
            xs: 6,
            sm: 3,
            md: 2,
            lg: 1,
            xl: 1,
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "SCROLL",
          label: "scroll",
          placeholder: "scroll",
          dependentFields: ["TRX"],
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (dependentFieldsValues?.["singleDenoRow.TRX"]?.value === "1") {
              return false;
            } else {
              return true;
            }
          },
          GridProps: {
            xs: 6,
            sm: 3,
            md: 2,
            lg: 1,
            xl: 1,
          },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "TOKEN",
          label: "Token",
          placeholder: "Token",
          type: "text",
          GridProps: {
            xs: 6,
            sm: 3,
            md: 2,
            lg: 1,
            xl: 1,
          },
          dependentFields: ["TRX", "BRANCH_CD", "ACCT_TYPE", "ACCT_CD"],
          postValidationSetCrossFieldValues: async (
            field,
            formState,
            authState,
            dependentFieldValues
          ) => {
            const branchCode =
              dependentFieldValues?.["singleDenoRow.BRANCH_CD"]?.value ?? "";
            const accountType =
              dependentFieldValues?.["singleDenoRow.ACCT_TYPE"]?.value ?? "";
            const acctCode =
              dependentFieldValues?.["singleDenoRow.ACCT_CD"]?.value ?? "";
            const reqPara = {
              COMP_CD: authState?.companyID ?? "",
              BRANCH_CD: branchCode,
              ACCT_TYPE: accountType,
              ACCT_CD: acctCode,
              TOKEN_NO: field?.value ?? "",
              SCREEN_REF: "TRN/042",
            };
            if (
              Boolean(branchCode) &&
              Boolean(accountType) &&
              Boolean(acctCode) &&
              Boolean(field?.value)
            ) {
              const getTokenValidate = await API.getTokenValidation(reqPara);

              const getBtnName = async (msgObj) => {
                let btnNm = await formState?.MessageBox(msgObj);
                return { btnNm, msgObj };
              };
              for (let i = 0; i < getTokenValidate?.MSG?.length; i++) {
                if (getTokenValidate?.MSG?.length > 0) {
                  if (getTokenValidate?.MSG[i]?.O_STATUS === "999") {
                    const { btnNm, msgObj } = await getBtnName({
                      messageTitle: "ValidationFailed",
                      message: getTokenValidate?.MSG[i]?.O_MESSAGE,
                    });
                    if (btnNm === "Yes") {
                      return {
                        CHQNO: { value: "" },
                        CHQ_DT: { value: "" },
                        RECEIPT: { value: "" },
                        PAYMENT: { value: "" },
                      };
                    }
                  }
                }
              }
            }
          },
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (dependentFieldsValues?.["singleDenoRow.TRX"]?.value === "W") {
              return false;
            } else {
              return true;
            }
          },
        },
        {
          render: {
            componentType: "select",
          },
          name: "SDC",
          label: "SDC",
          placeholder: "SDC",
          defaultValue: "",
          type: "select",
          options: API.getSDCList,
          _optionsKey: "getSDCList",

          // postValidationSetCrossFieldValues: async (
          //   field,
          //   formState,
          //   authState,
          //   dependentFieldValues
          // ) => {
          //   console.log(field, "field{}{}{}{}{}{}{}{}");
          //   // let sdc;

          //   // if (field?.optionData?.[0]?.CODE) {
          //   //   sdc = field?.optionData?.[0]?.DISLAY_STANDARD;
          //   // }
          //   // // console.log(sdc, "field{}{}{}{}{}{}{}{}SDC");
          //   // return {
          //   //   REMARK: { value: sdc },
          //   // };
          // },
          GridProps: { xs: 12, sm: 3, md: 2, lg: 1.3, xl: 1.3 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "REMARK",
          label: "Remarks",
          placeholder: "Remarks",
          type: "text",
          dependentFields: ["TRX", "SDC"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            if (
              dependentFields?.["singleDenoRow.SDC"]?.optionData?.[0]
                ?.DISLAY_STANDARD
            ) {
              const RMARK =
                dependentFields?.["singleDenoRow.SDC"]?.optionData?.[0]
                  ?.DISLAY_STANDARD;
              return RMARK;
            }
            return "";
          },
          GridProps: { xs: 6, sm: 6, md: 2, lg: 2, xl: 2 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "FLAG_CHQ",
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CHQNO",
          label: "Chq.No",
          placeholder: "Chq.No",
          defaultValue: "0",
          type: "number",
          GridProps: { xs: 6, sm: 3, md: 2, lg: 1, xl: 1 },
          dependentFields: ["TRX", "BRANCH_CD", "ACCT_TYPE", "ACCT_CD"],
          postValidationSetCrossFieldValues: async (
            field,
            formState,
            authState,
            dependentFieldValues
          ) => {
            const chequeNo = field?.value;
            const branchCd =
              dependentFieldValues?.["singleDenoRow.BRANCH_CD"]?.value;
            const acctCd = utilFunction?.getPadAccountNumber(
              dependentFieldValues?.["singleDenoRow.ACCT_CD"]?.value,
              dependentFieldValues?.["singleDenoRow.ACCT_TYPE"]?.optionData
            );
            const acctyType =
              dependentFieldValues?.["singleDenoRow.ACCT_TYPE"]?.value;

            if (chequeNo && branchCd && acctyType && acctCd) {
              const reqParameters = {
                // COMP_CD: authState?.companyID,
                BRANCH_CD: branchCd,
                ACCT_TYPE: acctyType,
                ACCT_CD: acctCd,
                CHEQUE_NO: chequeNo,
                TYPE_CD: dependentFieldValues?.["singleDenoRow.TRX"]?.value,
              };

              const apiResponse = await API?.getChqValidation(reqParameters);
              let button, returnValue;

              const getBtnName = async (msgObj) => {
                let btnNm = await formState?.MessageBox(msgObj);
                return { btnNm, msgObj };
              };
              for (let i = 0; i < apiResponse?.length; i++) {
                // console.log(
                //   apiResponse[i]?.ERR_CODE,
                //   apiResponse[i]?.ERR_MSG,
                //   "apiResponse[i]?.ERR_MSG btnNm"
                // );
                if (apiResponse[i]?.ERR_CODE === "999") {
                  const { btnNm, msgObj } = await getBtnName({
                    messageTitle: "ValidationFailed",
                    message: apiResponse[i]?.ERR_MSG,
                  });
                  if (btnNm === "Ok") {
                    return {
                      CHQNO: {
                        value: "",
                        // isFieldFocused: true,
                        ignoreUpdate: true,
                      },
                      CHQ_DT: {
                        value: "",
                        // isFieldFocused: true,
                        ignoreUpdate: true,
                      },
                      RECEIPT: {
                        value: "",
                        // isFieldFocused: true,
                        ignoreUpdate: true,
                      },
                      PAYMENT: {
                        value: "",
                        // isFieldFocused: true,
                        ignoreUpdate: true,
                      },
                    };
                  }
                } else if (apiResponse[i]?.ERR_CODE === "99") {
                  const { btnNm, msgObj } = await getBtnName({
                    messageTitle: "confirmation",
                    message: apiResponse[i]?.ERR_MSG,
                    buttonNames: ["Yes", "No"],
                  });
                  if (btnNm === "No") {
                    return {
                      CHQNO: {
                        value: "",
                        // isFieldFocused: true,
                        ignoreUpdate: true,
                      },
                      CHQ_DT: {
                        value: "",
                        // isFieldFocused: true,
                        ignoreUpdate: true,
                      },
                      RECEIPT: {
                        value: "",
                        // isFieldFocused: true,
                        ignoreUpdate: true,
                      },
                      PAYMENT: {
                        value: "",
                        // isFieldFocused: true,
                        ignoreUpdate: true,
                      },
                      FLAG_CHQ: {
                        value: "",
                      },
                    };
                  } else if (btnNm === "Yes") {
                    return {
                      FLAG_CHQ: {
                        value: "A",
                      },
                    };
                  }
                } else if (apiResponse[i]?.ERR_CODE === "9") {
                  const { btnNm, msgObj } = await getBtnName({
                    messageTitle: "Alert",
                    message: apiResponse[i]?.ERR_MSG,
                  });
                  return {
                    FLAG_CHQ: {
                      value: "A",
                    },
                  };
                } else if (apiResponse[i]?.ERR_CODE === "0") {
                  return {
                    FLAG_CHQ: {
                      value: "A",
                    },
                  };
                }
              }
            }
          },
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (dependentFieldsValues?.["singleDenoRow.TRX"]?.value === "W") {
              return false;
            } else {
              return true;
            }
          },
          validate: (currentField, dependentFields, formState) => {
            // console.log(formState, currentField?.value, "formState");
            if (!currentField?.value) {
              return "Cheque No. code is required";
            }
          },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "CHQ_DT",
          isWorkingDate: false,
          label: "Chq.Date",
          placeholder: "Chq.D",
          type: "number",
          dependentFields: ["TRX", "CHQNO"],
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (dependentFieldsValues?.["singleDenoRow.TRX"]?.value === "W") {
              return false;
            } else {
              return true;
            }
          },
          isReadOnly: true,
          GridProps: { xs: 6, sm: 3, md: 2, lg: 1, xl: 1 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "RECEIPT",
          label: "Receipt",
          placeholder: "Receipt",
          type: "text",
          required: true,
          validationRun: "all",
          FormatProps: {
            allowNegative: false,
          },
          // validate: (currentField, value) => {
          //   if (currentField?.value) {
          //     return;
          //   }
          // },

          dependentFields: [
            "ACCT_CD",
            "BRANCH_CD",
            "ACCT_TYPE",
            "TRX",
            "singleDenoRow",
            "FLAG_HIDE",
          ],
          postValidationSetCrossFieldValues: async (
            field,
            formState,
            authState,
            dependentFieldsValues
          ) => {
            if (
              !dependentFieldsValues?.["singleDenoRow.ACCT_CD"]?.error &&
              Boolean(
                dependentFieldsValues?.["singleDenoRow.ACCT_CD"]?.value
              ) &&
              Boolean(
                dependentFieldsValues?.["singleDenoRow.BRANCH_CD"]?.value
              ) &&
              Boolean(dependentFieldsValues?.["singleDenoRow.ACCT_TYPE"]?.value)
            ) {
              formState.setDataOnFieldChange("RECEIPT", {
                field,
                dependentFieldsValues,
              });
              if (field?.value) {
                return {
                  RECEIPT_TOTAL: { value: field.value ?? "0" },
                };
              } else {
                return {
                  RECEIPT_TOTAL: { value: "" },
                };
              }
            }
          },
          isReadOnly: (fieldValue, dependentFields, formState) => {
            const TRX = dependentFields?.["singleDenoRow.TRX"]?.value;
            const FLAG_HIDE =
              dependentFields?.["singleDenoRow.FLAG_HIDE"]?.value;
            const ACCT_CD = dependentFields?.["singleDenoRow.ACCT_CD"]?.value;
            if (TRX === "1" && FLAG_HIDE === "A" && Boolean(ACCT_CD)) {
              return false;
            }
            return true;
          },
          GridProps: { xs: 6, sm: 3, md: 3, lg: 1.5, xl: 1.5 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "PAYMENT",
          label: "Payment",
          placeholder: "Payment",
          type: "text",
          required: true,
          validationRun: "all",
          FormatProps: {
            allowNegative: false,
          },
          // validate: (currentField, value) => {
          //   if (currentField?.value) {
          //     return;
          //   }
          // },
          dependentFields: [
            "ACCT_CD",
            "BRANCH_CD",
            "ACCT_TYPE",
            "TRX",
            "singleDenoRow",
            "FLAG_HIDE",
            "FLAG_CHQ",
            "CHQNO",
          ],
          postValidationSetCrossFieldValues: async (
            field,
            formState,
            authState,
            dependentFieldsValues
          ) => {
            if (
              !dependentFieldsValues?.["singleDenoRow.ACCT_CD"]?.error &&
              Boolean(
                dependentFieldsValues?.["singleDenoRow.ACCT_CD"]?.value
              ) &&
              Boolean(
                dependentFieldsValues?.["singleDenoRow.BRANCH_CD"]?.value
              ) &&
              Boolean(dependentFieldsValues?.["singleDenoRow.ACCT_TYPE"]?.value)
            ) {
              formState.setDataOnFieldChange("PAYMENT", {
                field,
                dependentFieldsValues,
              });
              if (field?.value) {
                return {
                  PAYMENT_TOTAL: { value: field.value ?? "0" },
                };
              } else {
                return {
                  PAYMENT_TOTAL: { value: "" },
                };
              }
            }
          },
          isReadOnly: (fieldValue, dependentFields, formState) => {
            // console.log(dependentFields, "dependentFields887");
            const TRX = dependentFields?.["singleDenoRow.TRX"]?.value;
            const FLAG_HIDE =
              dependentFields?.["singleDenoRow.FLAG_HIDE"]?.value;
            const FLAG_CHQ = dependentFields?.["singleDenoRow.FLAG_CHQ"]?.value;
            const CHQNO = dependentFields?.["singleDenoRow.CHQNO"]?.value;
            const ACCT_CD = dependentFields?.["singleDenoRow.ACCT_CD"]?.value;
            if (
              TRX === "W" &&
              FLAG_HIDE === "A" &&
              FLAG_CHQ === "A" &&
              Boolean(CHQNO) &&
              Boolean(ACCT_CD)
            ) {
              return false;
            }
            return true;
          },
          GridProps: { xs: 6, sm: 3, md: 3, lg: 1.5, xl: 1.5 },
        },
      ],
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "SPCER",
      GridProps: {
        xs: 0.0,
        md: 1.5,
        sm: 1.3,
        lg: 5,
        xl: 5,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "RECEIPT_TOTAL",
      label: "Receipt Total",
      placeholder: "Receipt Total",
      defaultValue: "0",
      dependentFields: ["singleDenoRow"],
      validationRun: "all",
      validate: (currentField, value) => {
        if (currentField?.value) {
          return;
        }
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFieldsValues
      ) => {
        let accumulatedTakeoverLoanAmount = (
          Array.isArray(dependentFieldsValues?.["singleDenoRow"])
            ? dependentFieldsValues?.["singleDenoRow"]
            : []
        ).reduce((accum, obj) => accum + Number(obj.RECEIPT?.value), 0);

        if (Number(field.value) === Number(accumulatedTakeoverLoanAmount)) {
          return {};
        }

        if (accumulatedTakeoverLoanAmount) {
          return {
            RECEIPT_TOTAL: {
              value: accumulatedTakeoverLoanAmount ?? 0,
            },
          };
        } else {
          return {
            RECEIPT_TOTAL: {
              value: "",
            },
          };
        }
      },
      isReadOnly: true,
      GridProps: { xs: 5.7, sm: 3, md: 3, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "PAYMENT_TOTAL",
      label: "Payments Total",
      placeholder: "Payments Total",
      defaultValue: "0",
      dependentFields: ["singleDenoRow"],
      validationRun: "all",
      validate: (currentField, value) => {
        if (currentField?.value) {
          return;
        }
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFieldsValues
      ) => {
        let accumulatedTakeoverLoanAmount = (
          Array.isArray(dependentFieldsValues?.["singleDenoRow"])
            ? dependentFieldsValues?.["singleDenoRow"]
            : []
        ).reduce((accum, obj) => accum + Number(obj.PAYMENT?.value), 0);

        if (Number(field.value) === Number(accumulatedTakeoverLoanAmount)) {
          return {};
        }

        if (accumulatedTakeoverLoanAmount) {
          return {
            PAYMENT_TOTAL: {
              value: accumulatedTakeoverLoanAmount ?? 0,
            },
          };
        } else {
          return {
            PAYMENT_TOTAL: {
              value: "",
            },
          };
        }
      },
      isReadOnly: true,
      GridProps: { xs: 5.7, sm: 3, md: 3, lg: 1.5, xl: 1.5 },
    },
    // {
    //   render: {
    //     componentType: "spacer",
    //   },
    //   GridProps: {
    //     xs: 3.1,
    //     sm: 3.1,
    //     md: 3.1,
    //     lg: 8.9,
    //     xl: 8.9,
    //   },
    // },
    // {
    //   render: {
    //     componentType: "spacer",
    //   },
    //   name: "SPCR2",
    //   GridProps: {
    //     xs: 0.5,
    //     sm: 0,
    //     md: 0,
    //     lg: 8.9,
    //     xl: 8.9,
    //   },
    // },
    {
      render: {
        componentType: "amountField",
      },
      name: "FINAL_AMOUNT",
      label: "Final Total",
      placeholder: "Final Total",
      defaultValue: "0",
      dependentFields: ["RECEIPT_TOTAL", "PAYMENT_TOTAL"],
      isReadOnly: true,
      setValueOnDependentFieldsChange: (dependentFields) => {
        // console.log(dependentFields, "dependentFields++++++++========>");
        if (
          dependentFields?.RECEIPT_TOTAL?.value ||
          dependentFields?.PAYMENT_TOTAL?.value
        ) {
          const returnFinalAmount =
            dependentFields?.RECEIPT_TOTAL?.value -
            dependentFields?.PAYMENT_TOTAL?.value;
          return returnFinalAmount;
        } else {
          return "";
        }
      },
      GridProps: { xs: 5.7, sm: 3, md: 3, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "DENO_BTN",
      label: "Denomination",
      endsIcon: "",
      rotateIcon: "",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 2.5,
        sm: 1.5,
        md: 1.5,
        lg: 1,
        xl: 1,
      },
    },
  ],
};
