import * as API from "./api";
import { GeneralAPI } from "registry/fns/functions";
import * as CommonApi from "pages_audit/pages/operations/DailyTransaction/TRNCommon/api";
import { icon } from "@fortawesome/fontawesome-svg-core";
import {
  utilFunction,
  components,
  GridMetaDataType,
} from "@acuteinfo/common-base";

export const TellerScreenMetadata: any = {
  form: {
    name: "TellerOperation",
    label: "",
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
    // {
    //   render: {
    //     componentType: "autocomplete",
    //   },
    //   required: true,
    //   name: "TRN",
    //   label: "Transaction",
    //   placeholder: "Select Transaction",
    //   isFieldFocused: true,
    //   runPostValidationHookAlways: true,
    //   options: [
    //     { label: "1 - Cash Receipt", value: "1" },
    //     { label: "4 - Cash Payment", value: "4" },
    //     // { label: " Single Denomination", value: "S" },
    //   ],
    //   _optionsKey: "defaultOption",
    //   postValidationSetCrossFieldValues: (
    //     currentField,
    //     formState,
    //     authState,
    //     dependentFieldValue,
    //     reqFlag
    //   ) => {
    //     formState.setDataOnFieldChange("TRN", currentField);
    //     if (currentField?.value) {
    //       const sdc =
    //         formState?.screenFlag === "CASHREC"
    //           ? "1   "
    //           : formState?.screenFlag === "CASHPAY"
    //           ? "4   "
    //           : "";
    //       return {
    //         BRANCH_CD: {
    //           value: authState?.user?.branchCode ?? "",
    //           ignoreUpdate: true,
    //         },
    //         ACCT_TYPE: { value: "", ignoreUpdate: true },
    //         ACCT_CD: { value: "", ignoreUpdate: true },
    //         FLAG: { value: "", ignoreUpdate: true },
    //         TOKEN: { value: "", ignoreUpdate: true },
    //         SDC: { value: sdc ?? "", ignoreUpdate: true },
    //         CHEQUE_NO: { value: "", ignoreUpdate: true },
    //         CHEQUE_DT: { value: "", ignoreUpdate: true },
    //         RECEIPT: { value: "", ignoreUpdate: true },
    //         PAYMENT: { value: "", ignoreUpdate: true },
    //       };
    //     }
    //   },
    //   defaultValue: "1",
    //   GridProps: {
    //     xs: 6,
    //     sm: 3,
    //     md: 2,
    //     lg: 2,
    //     xl: 2,
    //   },
    //   schemaValidation: {
    //     type: "string",
    //     rules: [{ name: "required", params: ["Transaction is required"] }],
    //   },
    //   AlwaysRunPostValidationSetCrossFieldValues: {
    //     alwaysRun: true,
    //     touchAndValidate: false,
    //   },
    // },
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
        isFieldFocused: true,
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: (
          currentField,
          formState,
          authState
        ) => {
          formState.setDataOnFieldChange("BRANCH_CD", currentField);
          const sdc =
            formState?.screenFlag === "CASHREC"
              ? "1   "
              : formState?.screenFlag === "CASHPAY"
              ? "4   "
              : "";
          return {
            ACCT_TYPE: { value: "", ignoreUpdate: true },
            ACCT_CD: { value: "", ignoreUpdate: true },
            FLAG: { value: "", ignoreUpdate: true },
            CHEQUE_NO: { value: "", ignoreUpdate: true },
            CHEQUE_DT: {
              value: authState?.workingDate ?? "",
              ignoreUpdate: true,
            },
            SDC: { value: sdc, ignoreUpdate: true },
            RECEIPT: { value: "", ignoreUpdate: true },
            PAYMENT: { value: "", ignoreUpdate: true },
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
        dependentFields: ["BRANCH_CD"],
        runPostValidationHookAlways: true,
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          formState.setDataOnFieldChange("ACCT_TYPE", {
            currentField,
            branch_cd: dependentFieldValues?.BRANCH_CD?.value,
          });
          return {
            ACCT_CD: { value: "", ignoreUpdate: true },
            FLAG: { value: "", ignoreUpdate: true },
            CHEQUE_NO: { value: "", ignoreUpdate: true },
            CHEQUE_DT: {
              value: authState?.workingDate ?? "",
              ignoreUpdate: true,
            },
            RECEIPT: { value: "", ignoreUpdate: true },
            PAYMENT: { value: "", ignoreUpdate: true },
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
        dependentFields: ["BRANCH_CD", "ACCT_TYPE"],
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
              SCREEN_REF: "TRN/039",
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
                    // if (btnNm === "Ok") {
                    //   return {
                    //     ACCT_CD: { value: "", ignoreUpdate: true },
                    //     FLAG: { value: "", ignoreUpdate: true },
                    //     CHEQUE_NO: { value: "", ignoreUpdate: true },
                    //     CHEQUE_DT: {
                    //       value: authState?.workingDate ?? "",
                    //       ignoreUpdate: true,
                    //     },
                    //     RECEIPT: { value: "", ignoreUpdate: true },
                    //     PAYMENT: { value: "", ignoreUpdate: true },
                    //   };
                    // }
                  } else if (postData?.MSG[i]?.O_STATUS === "99") {
                    const { btnNm, msgObj } = await getBtnName({
                      messageTitle: "confirmation",
                      message: postData?.MSG[i]?.O_MESSAGE,
                      buttonNames: ["Yes", "No"],
                    });
                    if (btnNm === "No") {
                      return {
                        ACCT_CD: { value: "", ignoreUpdate: true },
                        FLAG: { value: "", ignoreUpdate: true },
                        CHEQUE_NO: { value: "", ignoreUpdate: true },
                        CHEQUE_DT: {
                          value: authState?.workingDate ?? "",
                          ignoreUpdate: true,
                        },
                        RECEIPT: { value: "", ignoreUpdate: true },
                        PAYMENT: { value: "", ignoreUpdate: true },
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
              // const sdcValue =
              //   dependentFieldValues?.TRN?.value === "1" ? "1   " : "4   ";
              return {
                ACCT_CD: { value: paddedAcctcode ?? "", ignoreUpdate: true },
                FLAG: { value: "A", ignoreUpdate: true },
                CHEQUE_NO: {
                  value: postData?.CHEQUE_NO ?? "",
                  ignoreUpdate: true,
                },
                CHEQUE_DT: {
                  value: authState?.workingDate ?? "",
                  ignoreUpdate: true,
                },
                RECEIPT: { value: "", ignoreUpdate: true },
                PAYMENT: { value: "", ignoreUpdate: true },
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
      dependentFields: ["FLAG", "BRANCH_CD", "ACCT_TYPE", "ACCT_CD"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (formState?.screenFlag === "CASHPAY") {
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
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldsValues
      ) => {
        if (formState?.isSubmitting) return {};
        if (
          Boolean(currentField?.value) &&
          Boolean(dependentFieldsValues?.ACCT_TYPE) &&
          Boolean(dependentFieldsValues?.BRANCH_CD) &&
          Boolean(dependentFieldsValues?.ACCT_CD)
        ) {
          let reqParameters = {
            COMP_CD: authState?.companyID ?? "",
            BRANCH_CD: dependentFieldsValues?.BRANCH_CD?.value ?? "",
            ACCT_TYPE: dependentFieldsValues?.ACCT_TYPE?.value ?? "",
            ACCT_CD: dependentFieldsValues?.ACCT_CD?.value ?? "",
            TOKEN_NO: currentField?.value ?? "",
            SCREEN_REF:
              formState?.screenFlag === "CASHREC" ? "TRN/039" : "TRN/040",
          };

          let postData = await API.checkTokenValidate(reqParameters);
          postData = postData.sort(
            (a, b) => parseInt(b.O_STATUS) - parseInt(a.O_STATUS)
          );
          let btn99, returnVal;
          const getButtonName = async (obj) => {
            let btnName = await formState.MessageBox(obj);
            return { btnName, obj };
          };
          for (let i = 0; i < postData.length; i++) {
            if (postData[i]?.O_STATUS === "999") {
              const { btnName, obj } = await getButtonName({
                messageTitle: "ValidationFailed",
                message: postData[i]?.O_MESSAGE ?? "",
                icon: "ERROR",
              });
              returnVal = "";
            } else if (postData[i]?.O_STATUS === "99") {
              const { btnName, obj } = await getButtonName({
                messageTitle: "Confirmation",
                message: postData[i]?.O_MESSAGE ?? "",
                buttonNames: ["Yes", "No"],
              });
              btn99 = btnName;
              if (btnName === "No") {
                returnVal = "";
              }
            } else if (postData[i]?.O_STATUS === "9") {
              if (btn99 !== "No") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: "Alert",
                  message: postData[i]?.O_MESSAGE ?? "",
                  icon: "WARNING",
                });
              }
              returnVal = "";
            } else if (postData[i]?.O_STATUS === "0") {
              if (btn99 !== "No") {
                returnVal = currentField?.value;
              } else {
                returnVal = "";
              }
            }
          }
          btn99 = 0;
          return {
            TOKEN: {
              value: returnVal ?? "",
              ignoreUpdate: true,
            },
          };
        } else if (!currentField?.value) {
          return {
            TOKEN: { value: "", ignoreUpdate: true },
          };
        }
        return {};
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
      dependentFields: ["FLAG"],
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
      dependentFields: ["BRANCH_CD", "ACCT_TYPE", "SDC", "FLAG"],
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
      dependentFields: ["FLAG", "BRANCH_CD", "ACCT_TYPE", "ACCT_CD"],
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
            COMP_CD: authState?.companyID ?? "",
            BRANCH_CD: branchCd,
            ACCT_TYPE: acctyType,
            ACCT_CD: acctCd,
            CHEQUE_NO: chequeNo,
            TYPE_CD:
              formState?.screenFlag === "CASHREC"
                ? "1   "
                : formState?.screenFlag === "CASHPAY"
                ? "4   "
                : "",
            SCREEN_REF:
              formState?.screenFlag === "CASHREC" ? "TRN/039" : "TRN/040",
          };

          const apiResponse = await API?.getChqValidation(reqParameters);
          let button, returnValue;
          const getBtnName = async (msgObj) => {
            let btnNm = await formState?.MessageBox(msgObj);
            return { btnNm, msgObj };
          };
          for (let i = 0; i < apiResponse?.length; i++) {
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
                    value: authState?.workingDate ?? "",
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
                    value: authState?.workingDate ?? "",
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
        if (formState?.screenFlag === "CASHPAY") {
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
      dependentFields: ["FLAG", "BRANCH_CD", "CHEQUE_NO"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (formState?.screenFlag === "CASHPAY") {
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
        const branchCode = dependentFieldsValues?.BRANCH_CD?.value ?? "";
        const chequeNo = dependentFieldsValues?.CHEQUE_NO?.value ?? "";
        const typeCd =
          formState?.screenFlag === "CASHREC"
            ? "1   "
            : formState?.screenFlag === "CASHPAY"
            ? "4   "
            : "";
        if (
          !dependentFieldsValues?.ACCT_CD?.error &&
          Boolean(branchCode) &&
          Boolean(field?.value)
        ) {
          const apiRequest = {
            BRANCH_CD: branchCode ?? "",
            TYPE_CD: typeCd ?? "",
            CHEQUE_NO: chequeNo ?? "",
            CHEQUE_DT: field?.value ?? "",
          };
          const chequeDateValidate: any = await API?.getChqDateValidation(
            apiRequest
          );
          const getButtonName = async (obj) => {
            let btnName = await formState.MessageBox(obj);
            return { btnName, obj };
          };
          for (let i = 0; i < chequeDateValidate?.length; i++) {
            const status: any = chequeDateValidate[i]?.STATUS;
            const message = chequeDateValidate[i]?.MESSAGE1;
            if (status === "999") {
              const { btnName, obj } = await getButtonName({
                messageTitle: "ValidationFailed",
                message,
              });
              return {
                TOKEN: {
                  value: "",
                  isFieldFocused: false,
                  ignoreUpdate: true,
                },
              };
            } else if (status === "99") {
              const { btnName, obj } = await getButtonName({
                messageTitle: "RiskCategoryAlert",
                message,
                buttonNames: ["Yes", "No"],
              });
              if (btnName === "No") {
                return {
                  TOKEN: {
                    value: "",
                    isFieldFocused: false,
                    ignoreUpdate: true,
                  },
                };
              }
            } else if (status === "9") {
              const { btnName, obj } = await getButtonName({
                messageTitle: "Alert",
                message,
              });
            }
          }
        }
      },
      // isReadOnly: true,
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
      dependentFields: [
        "BRANCH_CD",
        "ACCT_TYPE",
        "ACCT_CD",
        "FLAG",
        "CHEQUE_NO",
      ],
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
        if (formState?.screenFlag === "CASHREC") {
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
        if (formState?.isSubmitting) return {};
        if (
          !dependentFieldsValues?.ACCT_CD?.error &&
          Boolean(dependentFieldsValues?.ACCT_CD?.value) &&
          Boolean(dependentFieldsValues?.BRANCH_CD?.value) &&
          Boolean(dependentFieldsValues?.ACCT_TYPE?.value) &&
          Boolean(field?.value)
        ) {
          const cardData = await formState?.getCardColumnValue();
          const reqPara = {
            BRANCH_CD: dependentFieldsValues?.BRANCH_CD?.value ?? "",
            ACCT_TYPE: dependentFieldsValues?.ACCT_TYPE?.value ?? "",
            ACCT_CD: dependentFieldsValues?.ACCT_CD?.value ?? "",
            TYPE_CD:
              formState?.screenFlag === "CASHREC"
                ? "1   "
                : formState?.screenFlag === "CASHPAY"
                ? "4   "
                : "",
            COMP_CD: authState?.companyID ?? "",
            CHEQUE_NO: "",
            AVALIABLE_BAL: cardData?.WITHDRAW_BAL,
            SHADOW_CL: cardData?.TRAN_BAL,
            HOLD_BAL: cardData?.HOLD_BAL,
            LEAN_AMT: cardData?.LIEN_AMT,
            AGAINST_CLEARING: cardData?.AGAINST_CLEARING,
            MIN_BALANCE: cardData?.MIN_BALANCE,
            CONF_BAL: cardData?.CONF_BAL,
            TRAN_BAL: cardData?.TRAN_BAL,
            UNCL_BAL: cardData?.UNCL_BAL,
            LIMIT_AMOUNT: cardData?.LIMIT_AMOUNT,
            DRAWING_POWER: cardData?.DRAWING_POWER,
            AMOUNT: field?.value,
            OD_APPLICABLE: cardData?.OD_APPLICABLE,
            OP_DATE: cardData?.OP_DATE,
            INST_NO: cardData?.INST_NO,
            INST_RS: cardData?.INST_RS,
            PENDING_AMOUNT: cardData?.PENDING_AMOUNT,
            STATUS: cardData?.STATUS,
            TYPE: "C",
            SCREEN_REF:
              formState?.screenFlag === "CASHREC" ? "TRN/039" : "TRN/040",
            TRAN_CD: "",
          };
          const postData = await API?.getAmountValidation(reqPara);
          for (let i = 0; i < postData?.length; i++) {
            if (postData?.[i]?.O_STATUS === "999") {
              const btnName = await formState.MessageBox({
                messageTitle: "ValidationFailed",
                message: postData?.[i]?.O_MESSAGE,
                icon: "ERROR",
              });
              if (btnName === "Ok") {
                return {
                  RECEIPT: {
                    value: "",
                    ignoreUpdate: true,
                    isFieldFocused: false,
                  },
                };
              }
            } else if (postData?.[i]?.O_STATUS === "99") {
              const btnName = await formState.MessageBox({
                messageTitle: "Confirmation",
                message: postData?.[i]?.O_MESSAGE,
                buttonNames: ["Yes", "No"],
              });
              if (btnName === "No") {
                return {
                  RECEIPT: {
                    value: "",
                    ignoreUpdate: true,
                    isFieldFocused: false,
                  },
                };
              }
            } else if (postData?.[i]?.O_STATUS === "9") {
              const btnName = await formState.MessageBox({
                messageTitle: "Alert",
                message: postData?.[i]?.O_MESSAGE,
                icon: "WARNING",
              });
            } else if (postData?.[i]?.O_STATUS === "0") {
              formState.setDataOnFieldChange("RECEIPT", {
                field,
                dependentFieldsValues,
              });
            }
          }

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
        if (formState?.screenFlag === "CASHPAY") {
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
        if (formState?.isSubmitting) return {};
        if (
          !dependentFieldsValues?.ACCT_CD?.error &&
          Boolean(dependentFieldsValues?.ACCT_CD?.value) &&
          Boolean(dependentFieldsValues?.BRANCH_CD?.value) &&
          Boolean(dependentFieldsValues?.ACCT_TYPE?.value) &&
          Boolean(field?.value)
        ) {
          const cardData = await formState?.getCardColumnValue();
          const reqPara = {
            BRANCH_CD: dependentFieldsValues?.BRANCH_CD?.value ?? "",
            ACCT_TYPE: dependentFieldsValues?.ACCT_TYPE?.value ?? "",
            ACCT_CD: dependentFieldsValues?.ACCT_CD?.value ?? "",
            TYPE_CD:
              formState?.screenFlag === "CASHREC"
                ? "1   "
                : formState?.screenFlag === "CASHPAY"
                ? "4   "
                : "",
            COMP_CD: authState?.companyID ?? "",
            CHEQUE_NO: dependentFieldsValues?.CHEQUE_NO?.value ?? "",
            AVALIABLE_BAL: cardData?.WITHDRAW_BAL,
            SHADOW_CL: cardData?.TRAN_BAL,
            HOLD_BAL: cardData?.HOLD_BAL,
            LEAN_AMT: cardData?.LIEN_AMT,
            AGAINST_CLEARING: cardData?.AGAINST_CLEARING,
            MIN_BALANCE: cardData?.MIN_BALANCE,
            CONF_BAL: cardData?.CONF_BAL,
            TRAN_BAL: cardData?.TRAN_BAL,
            UNCL_BAL: cardData?.UNCL_BAL,
            LIMIT_AMOUNT: cardData?.LIMIT_AMOUNT,
            DRAWING_POWER: cardData?.DRAWING_POWER,
            AMOUNT: field?.value,
            OD_APPLICABLE: cardData?.OD_APPLICABLE,
            OP_DATE: cardData?.OP_DATE,
            INST_NO: cardData?.INST_NO,
            INST_RS: cardData?.INST_RS,
            PENDING_AMOUNT: cardData?.PENDING_AMOUNT,
            STATUS: cardData?.STATUS,
            TYPE: "C",
            SCREEN_REF:
              formState?.screenFlag === "CASHREC" ? "TRN/039" : "TRN/040",
            TRAN_CD: "",
          };
          const postData = await API?.getAmountValidation(reqPara);
          for (let i = 0; i < postData?.length; i++) {
            if (postData?.[i]?.O_STATUS === "999") {
              const btnName = await formState.MessageBox({
                messageTitle: "ValidationFailed",
                message: postData?.[i]?.O_MESSAGE,
                icon: "ERROR",
              });
              if (btnName === "Ok") {
                return {
                  PAYMENT: {
                    value: "",
                    ignoreUpdate: true,
                    isFieldFocused: false,
                  },
                };
              }
            } else if (postData?.[i]?.O_STATUS === "99") {
              const btnName = await formState.MessageBox({
                messageTitle: "Confirmation",
                message: postData?.[i]?.O_MESSAGE,
                buttonNames: ["Yes", "No"],
              });
              if (btnName === "No") {
                return {
                  PAYMENT: {
                    value: "",
                    ignoreUpdate: true,
                    isFieldFocused: false,
                  },
                };
              }
            } else if (postData?.[i]?.O_STATUS === "9") {
              const btnName = await formState.MessageBox({
                messageTitle: "Alert",
                message: postData?.[i]?.O_MESSAGE,
                icon: "WARNING",
              });
            } else if (postData?.[i]?.O_STATUS === "0") {
              formState.setDataOnFieldChange("PAYMENT", {
                field,
                dependentFieldsValues,
              });
            }
          }
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

export const cashReportMetaData = {
  title: "View Transactions",
  disableGroupBy: "",
  hideFooter: false,
  hideAmountIn: true,
  retrievalType: "",
  groupBy: [""],
  columns: [
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
        componentType: "spacer",
      },
      name: "SPCER",
      GridProps: {
        xs: 0.0,
        md: 1.5,
        sm: 1.3,
        lg: 10.8,
        xl: 10.8,
      },
    },
    // {
    //   render: {
    //     componentType: "formbutton",
    //   },
    //   name: "ADDNEWROW",
    //   label: "AddRow",
    //   endsIcon: "AddCircleOutlineRounded",
    //   rotateIcon: "scale(2)",
    //   placeholder: "",
    //   type: "text",
    //   tabIndex: "-1",
    //   iconStyle: {
    //     fontSize: "25px !important",
    //   },
    //   GridProps: { xs: 2.2, sm: 2, md: 1.8, lg: 1.2, xl: 1.2 },
    // },
    {
      render: {
        componentType: "arrayField",
      },
      name: "singleDenoRow",
      isRemoveButton: true,
      displayCountName: "row",
      isScreenStyle: true,
      addRowFn: (data) => {
        const rowsArray = Array.isArray(data?.singleDenoRow)
          ? data?.singleDenoRow
          : [];
        if (rowsArray?.length > 0) {
          const row = rowsArray[rowsArray?.length - 1];
          if (Boolean(row?.TRX)) {
            if (Boolean(row?.TRX === "1")) {
              if (
                Boolean(row?.BRANCH_CD) &&
                Boolean(row?.ACCT_TYPE) &&
                Boolean(row?.ACCT_CD) &&
                Boolean(row?.TRX) &&
                Boolean(row?.SDC) &&
                Boolean(row?.REMARK) &&
                Boolean(row?.RECEIPT)
              ) {
                return true;
              }
              return false;
            } else if (Boolean(row?.TRX === "4")) {
              if (
                Boolean(row?.BRANCH_CD) &&
                Boolean(row?.ACCT_TYPE) &&
                Boolean(row?.ACCT_CD) &&
                Boolean(row?.TRX) &&
                Boolean(row?.TOKEN) &&
                Boolean(row?.SDC) &&
                Boolean(row?.REMARK) &&
                Boolean(row?.CHQNO) &&
                Boolean(row?.CHQ_DT) &&
                Boolean(row?.PAYMENT)
              ) {
                return true;
              }
              return false;
            }
            return false;
          }
          return false;
        }
        return false;
      },
      disagreeButtonName: "No",
      agreeButtonName: "Yes",
      isDivider: false,
      errorTitle: "Are you Sure you want to delete this row?",
      removeRowFn: "deleteFormArrayFieldData",
      changeRowOrder: true,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: { componentType: "_accountNumber" },
          branchCodeMetadata: {
            postValidationSetCrossFieldValues: async (
              field,
              formState,
              authState,
              dependentFieldsValues
            ) => {
              return {
                ACCT_CD: { value: "", ignoreUpdate: true },
                FLAG_HIDE: { value: "", ignoreUpdate: true },
                TRX: { value: "1", ignoreUpdate: true },
                CHQNO: { value: "", ignoreUpdate: true },
                CHQ_DT: {
                  value: authState?.workingDate ?? "",
                  ignoreUpdate: true,
                },
                RECEIPT: { value: "", ignoreUpdate: true },
                PAYMENT: { value: "", ignoreUpdate: true },
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
              formState.setDataOnFieldChange("ACCT_TYPE", {
                currentField: field,
                branchCode:
                  dependentFieldValues?.["singleDenoRow.BRANCH_CD"]?.value ??
                  "",
              });
              return {
                ACCT_CD: { value: "", ignoreUpdate: true },
                FLAG_HIDE: { value: "", ignoreUpdate: true },
                TRX: { value: "1", ignoreUpdate: true },
                CHQNO: { value: "", ignoreUpdate: true },
                CHQ_DT: {
                  value: authState?.workingDate ?? "",
                  ignoreUpdate: true,
                },
                RECEIPT: { value: "", ignoreUpdate: true },
                PAYMENT: { value: "", ignoreUpdate: true },
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
                    SCREEN_REF: "TRN/041",
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
                            ACCT_CD: { value: "", ignoreUpdate: true },
                            FLAG_HIDE: { value: "", ignoreUpdate: true },
                            TRX: { value: "1", ignoreUpdate: true },
                            CHQNO: { value: "", ignoreUpdate: true },
                            CHQ_DT: {
                              value: authState?.workingDate ?? "",
                              ignoreUpdate: true,
                            },
                            RECEIPT: { value: "", ignoreUpdate: true },
                            PAYMENT: { value: "", ignoreUpdate: true },
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
                            ACCT_CD: { value: "", ignoreUpdate: true },
                            FLAG_HIDE: { value: "", ignoreUpdate: true },
                            TRX: { value: "1", ignoreUpdate: true },
                            CHQNO: { value: "", ignoreUpdate: true },
                            CHQ_DT: {
                              value: authState?.workingDate ?? "",
                              ignoreUpdate: true,
                            },
                            RECEIPT: { value: "", ignoreUpdate: true },
                            PAYMENT: { value: "", ignoreUpdate: true },
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
                    ACCT_CD: { value: accountCode ?? "", ignoreUpdate: true },
                    FLAG_HIDE: { value: "A", ignoreUpdate: true },
                    TRX: { value: "1", ignoreUpdate: true },
                    CHQNO: {
                      value: apiResponse?.CHEQUE_NO ?? "",
                      ignoreUpdate: true,
                    },
                    CHQ_DT: {
                      value: authState?.workingDate ?? "",
                      ignoreUpdate: true,
                    },
                    RECEIPT: { value: "", ignoreUpdate: true },
                    PAYMENT: { value: "", ignoreUpdate: true },
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
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["TRX is required"] }],
          },
          options: [
            { label: "1 - CASH DEPOSITE", value: "1" },
            { label: "4 - CASH WITHDRAWAL", value: "4" },
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
              SCROLL: { value: "", ignoreUpdate: true },
              TOKEN: { value: "", ignoreUpdate: true },
              SDC: { value: sdcValue ?? "", ignoreUpdate: true },
              REMARK: { value: "", ignoreUpdate: true },
              CHQ_DT: {
                value: authState?.workingDate ?? "",
                ignoreUpdate: true,
              },
              RECEIPT: { value: "", ignoreUpdate: true },
              PAYMENT: { value: "", ignoreUpdate: true },
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
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Token is required"] }],
          },
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
            dependentFieldsValues
          ) => {
            const branchCode =
              dependentFieldsValues?.["singleDenoRow.BRANCH_CD"]?.value ?? "";
            const acctType =
              dependentFieldsValues?.["singleDenoRow.ACCT_TYPE"]?.value ?? "";
            const acctCode =
              dependentFieldsValues?.["singleDenoRow.ACCT_CD"]?.value ?? "";
            if (
              !dependentFieldsValues?.["singleDenoRow.ACCT_CD"]?.error &&
              Boolean(acctCode) &&
              Boolean(branchCode) &&
              Boolean(acctType) &&
              Boolean(field?.value)
            ) {
              const apiRequest = {
                COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: branchCode ?? "",
                ACCT_TYPE: acctType ?? "",
                ACCT_CD: acctCode ?? "",
                TOKEN_NO: field?.value ?? "",
                SCREEN_REF: "TRN/041",
              };
              const tokenValidate: any = await API?.getTokenValidation(
                apiRequest
              );

              const getButtonName = async (obj) => {
                let btnName = await formState.MessageBox(obj);
                return { btnName, obj };
              };
              for (let i = 0; i < tokenValidate?.length; i++) {
                const status: any = tokenValidate[i]?.O_STATUS;
                const message = tokenValidate[i]?.O_MESSAGE;
                if (status === "999") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "ValidationFailed",
                    message,
                  });
                  return {
                    TOKEN: {
                      value: "",
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    },
                  };
                } else if (status === "99") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "RiskCategoryAlert",
                    message,
                    buttonNames: ["Yes", "No"],
                  });
                  if (btnName === "No") {
                    return {
                      TOKEN: {
                        value: "",
                        isFieldFocused: false,
                        ignoreUpdate: true,
                      },
                    };
                  }
                } else if (status === "9") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "Alert",
                    message,
                  });
                }
              }
            }
          },
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (dependentFieldsValues?.["singleDenoRow.TRX"]?.value === "4") {
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
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["SDC is required"] }],
          },
          defaultValue: "",
          type: "select",
          options: API.getSDCList,
          _optionsKey: "getSDCList",
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
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Remark is required"] }],
          },
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
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Cheque No. is required"] }],
          },
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
                BRANCH_CD: branchCd,
                ACCT_TYPE: acctyType,
                ACCT_CD: acctCd,
                CHEQUE_NO: chequeNo,
                TYPE_CD: dependentFieldValues?.["singleDenoRow.TRX"]?.value,
                SCREEN_REF: "TRN/041",
              };

              const apiResponse = await API?.getChqValidation(reqParameters);

              const getBtnName = async (msgObj) => {
                let btnNm = await formState?.MessageBox(msgObj);
                return { btnNm, msgObj };
              };
              for (let i = 0; i < apiResponse?.length; i++) {
                if (apiResponse[i]?.ERR_CODE === "999") {
                  const { btnNm, msgObj } = await getBtnName({
                    messageTitle: "ValidationFailed",
                    message: apiResponse[i]?.ERR_MSG,
                  });
                  if (btnNm === "Ok") {
                    return {
                      CHQNO: {
                        value: "",
                        ignoreUpdate: true,
                      },
                      CHQ_DT: {
                        CHQ_DT: { value: authState?.workingDate ?? "" },
                        ignoreUpdate: true,
                      },
                      RECEIPT: {
                        value: "",
                        ignoreUpdate: true,
                      },
                      PAYMENT: {
                        value: "",
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
                        ignoreUpdate: true,
                      },
                      CHQ_DT: {
                        CHQ_DT: { value: authState?.workingDate ?? "" },
                        ignoreUpdate: true,
                      },
                      RECEIPT: {
                        value: "",
                        ignoreUpdate: true,
                      },
                      PAYMENT: {
                        value: "",
                        ignoreUpdate: true,
                      },
                      FLAG_CHQ: {
                        value: "",
                        ignoreUpdate: true,
                      },
                    };
                  } else if (btnNm === "Yes") {
                    return {
                      FLAG_CHQ: {
                        value: "A",
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
                    FLAG_CHQ: {
                      value: "A",
                      ignoreUpdate: true,
                    },
                  };
                } else if (apiResponse[i]?.ERR_CODE === "0") {
                  return {
                    FLAG_CHQ: {
                      value: "A",
                      ignoreUpdate: true,
                    },
                  };
                }
              }
            }
          },
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (dependentFieldsValues?.["singleDenoRow.TRX"]?.value === "4") {
              return false;
            } else {
              return true;
            }
          },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "CHQ_DT",
          isWorkingDate: true,
          label: "Chq.Date",
          placeholder: "Chq.D",
          type: "number",
          dependentFields: ["TRX", "CHQNO", "BRANCH_CD"],
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Cheque Date is required"] }],
          },
          postValidationSetCrossFieldValues: async (
            field,
            formState,
            authState,
            dependentFieldsValues
          ) => {
            const branchCode =
              dependentFieldsValues?.["singleDenoRow.BRANCH_CD"]?.value ?? "";
            const chequeNo =
              dependentFieldsValues?.["singleDenoRow.CHQNO"]?.value ?? "";
            const typeCd =
              dependentFieldsValues?.["singleDenoRow.TRX"]?.value ?? "";
            if (
              !dependentFieldsValues?.["singleDenoRow.ACCT_CD"]?.error &&
              Boolean(branchCode) &&
              Boolean(field?.value)
            ) {
              const apiRequest = {
                BRANCH_CD: branchCode ?? "",
                TYPE_CD: typeCd ?? "",
                CHEQUE_NO: chequeNo ?? "",
                CHEQUE_DT: field?.value ?? "",
              };
              const chequeDateValidate: any = await API?.getChqDateValidation(
                apiRequest
              );

              const getButtonName = async (obj) => {
                let btnName = await formState.MessageBox(obj);
                return { btnName, obj };
              };
              for (let i = 0; i < chequeDateValidate?.length; i++) {
                const status: any = chequeDateValidate[i]?.STATUS;
                const message = chequeDateValidate[i]?.MESSAGE1;
                if (status === "999") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "ValidationFailed",
                    message,
                  });
                  return {
                    TOKEN: {
                      value: "",
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    },
                  };
                } else if (status === "99") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "RiskCategoryAlert",
                    message,
                    buttonNames: ["Yes", "No"],
                  });
                  if (btnName === "No") {
                    return {
                      TOKEN: {
                        value: "",
                        isFieldFocused: false,
                        ignoreUpdate: true,
                      },
                    };
                  }
                } else if (status === "9") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "Alert",
                    message,
                  });
                }
              }
            }
          },
          shouldExclude(fieldData, dependentFieldsValues, formState) {
            if (dependentFieldsValues?.["singleDenoRow.TRX"]?.value === "4") {
              return false;
            } else {
              return true;
            }
          },
          GridProps: { xs: 6, sm: 3, md: 2, lg: 1, xl: 1 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "RECEIPT",
          label: "Receipt",
          placeholder: "Receipt",
          required: true,
          FormatProps: {
            allowNegative: false,
          },
          validate: (currentField, dependentFields) => {
            if (
              !currentField?.value &&
              dependentFields?.["singleDenoRow.TRX"]?.value === "1"
            ) {
              return "Receipt Is Required";
            } else {
              return "";
            }
          },
          dependentFields: [
            "ACCT_CD",
            "BRANCH_CD",
            "ACCT_TYPE",
            "TRX",
            "singleDenoRow",
            "FLAG_HIDE",
            "CHQNO",
          ],
          postValidationSetCrossFieldValues: async (
            field,
            formState,
            authState,
            dependentFieldsValues
          ) => {
            const branchCode =
              dependentFieldsValues?.["singleDenoRow.BRANCH_CD"]?.value ?? "";
            const acctType =
              dependentFieldsValues?.["singleDenoRow.ACCT_TYPE"]?.value ?? "";
            const acctCode =
              dependentFieldsValues?.["singleDenoRow.ACCT_CD"]?.value ?? "";
            const typeCode =
              dependentFieldsValues?.["singleDenoRow.TRX"]?.value ?? "";
            const chequeNo =
              dependentFieldsValues?.["singleDenoRow.CHQNO"]?.value ?? "";
            if (
              !dependentFieldsValues?.["singleDenoRow.ACCT_CD"]?.error &&
              Boolean(acctCode) &&
              Boolean(branchCode) &&
              Boolean(acctType) &&
              Boolean(field?.value)
            ) {
              const cardData = await formState?.getCardColumnValue();
              const apiRequest = {
                BRANCH_CD: branchCode,
                ACCT_TYPE: acctType,
                ACCT_CD: acctCode,
                TYPE_CD: typeCode,
                COMP_CD: authState?.companyID ?? "",
                CHEQUE_NO: chequeNo,
                AVALIABLE_BAL: cardData?.WITHDRAW_BAL,
                SHADOW_CL: cardData?.TRAN_BAL,
                HOLD_BAL: cardData?.HOLD_BAL, ///////
                LEAN_AMT: cardData?.LIEN_AMT,
                AGAINST_CLEARING: cardData?.AGAINST_CLEARING, ///////
                MIN_BALANCE: cardData?.MIN_BALANCE, ///////
                CONF_BAL: cardData?.CONF_BAL,
                TRAN_BAL: cardData?.TRAN_BAL,
                UNCL_BAL: cardData?.UNCL_BAL,
                LIMIT_AMOUNT: cardData?.LIMIT_AMOUNT,
                DRAWING_POWER: cardData?.DRAWING_POWER,
                AMOUNT: field?.value ?? "",
                OD_APPLICABLE: cardData?.OD_APPLICABLE,
                OP_DATE: cardData?.OP_DATE,
                INST_NO: cardData?.INST_NO,
                INST_RS: cardData?.INST_RS,
                PENDING_AMOUNT: cardData?.PENDING_AMOUNT,
                STATUS: cardData?.STATUS,
                TYPE: "C",
                SCREEN_REF: "TRN/041",
                TRAN_CD: "",
              };
              const amountValidate: any = await API?.getAmountValidation(
                apiRequest
              );

              const getButtonName = async (obj) => {
                let btnName = await formState.MessageBox(obj);
                return { btnName, obj };
              };
              for (let i = 0; i < amountValidate?.length; i++) {
                const status: any = amountValidate[i]?.O_STATUS;
                const message = amountValidate[i]?.O_MESSAGE;
                if (status === "999") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "ValidationFailed",
                    message,
                  });
                  return {
                    RECEIPT: {
                      value: "",
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    },
                  };
                } else if (status === "99") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "RiskCategoryAlert",
                    message,
                    buttonNames: ["Yes", "No"],
                  });
                  if (btnName === "No") {
                    return {
                      RECEIPT: {
                        value: "",
                        isFieldFocused: false,
                        ignoreUpdate: true,
                      },
                    };
                  }
                } else if (status === "9") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "Alert",
                    message,
                  });
                }
              }
              if (field?.value) {
                return {
                  RECEIPT_TOTAL: {
                    value: field.value ?? "0",
                    ignoreUpdate: true,
                  },
                };
              } else {
                return {
                  RECEIPT_TOTAL: { value: "", ignoreUpdate: true },
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
          // type: "text",
          required: true,
          // validationRun: "all",
          FormatProps: {
            allowNegative: false,
          },
          validate: (currentField, dependentFields) => {
            if (
              !currentField?.value &&
              dependentFields?.["singleDenoRow.TRX"]?.value === "4"
            ) {
              return "Payment Is Required";
            } else {
              return "";
            }
          },
          // schemaValidation: {
          //   type: "string",
          //   rules: [{ name: "required", params: ["Payment Is Required"] }],
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
            const branchCode =
              dependentFieldsValues?.["singleDenoRow.BRANCH_CD"]?.value ?? "";
            const acctType =
              dependentFieldsValues?.["singleDenoRow.ACCT_TYPE"]?.value ?? "";
            const acctCode =
              dependentFieldsValues?.["singleDenoRow.ACCT_CD"]?.value ?? "";
            const typeCode =
              dependentFieldsValues?.["singleDenoRow.TRX"]?.value ?? "";
            const chequeNo =
              dependentFieldsValues?.["singleDenoRow.CHQNO"]?.value ?? "";
            if (
              !dependentFieldsValues?.["singleDenoRow.ACCT_CD"]?.error &&
              Boolean(acctCode) &&
              Boolean(branchCode) &&
              Boolean(acctType) &&
              Boolean(field?.value)
            ) {
              const cardData = await formState?.getCardColumnValue();
              const apiRequest = {
                BRANCH_CD: branchCode,
                ACCT_TYPE: acctType,
                ACCT_CD: acctCode,
                TYPE_CD: typeCode,
                COMP_CD: authState?.companyID ?? "",
                CHEQUE_NO: chequeNo,
                AVALIABLE_BAL: cardData?.WITHDRAW_BAL,
                SHADOW_CL: cardData?.TRAN_BAL,
                HOLD_BAL: cardData?.HOLD_BAL, ///////
                LEAN_AMT: cardData?.LIEN_AMT,
                AGAINST_CLEARING: cardData?.AGAINST_CLEARING, ///////
                MIN_BALANCE: cardData?.MIN_BALANCE, ///////
                CONF_BAL: cardData?.CONF_BAL,
                TRAN_BAL: cardData?.TRAN_BAL,
                UNCL_BAL: cardData?.UNCL_BAL,
                LIMIT_AMOUNT: cardData?.LIMIT_AMOUNT,
                DRAWING_POWER: cardData?.DRAWING_POWER,
                AMOUNT: field?.value ?? "",
                OD_APPLICABLE: cardData?.OD_APPLICABLE,
                OP_DATE: cardData?.OP_DATE,
                INST_NO: cardData?.INST_NO,
                INST_RS: cardData?.INST_RS,
                PENDING_AMOUNT: cardData?.PENDING_AMOUNT,
                STATUS: cardData?.STATUS,
                TYPE: "C",
                SCREEN_REF: "TRN/041",
                TRAN_CD: "",
              };
              const amountValidate: any = await API?.getAmountValidation(
                apiRequest
              );
              const getButtonName = async (obj) => {
                let btnName = await formState.MessageBox(obj);
                return { btnName, obj };
              };
              for (let i = 0; i < amountValidate?.length; i++) {
                const status: any = amountValidate[i]?.O_STATUS;
                const message = amountValidate[i]?.O_MESSAGE;
                if (status === "999") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "ValidationFailed",
                    message,
                  });
                  return {
                    PAYMENT: {
                      value: "",
                      isFieldFocused: false,
                      ignoreUpdate: true,
                    },
                  };
                } else if (status === "99") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "RiskCategoryAlert",
                    message,
                    buttonNames: ["Yes", "No"],
                  });
                  if (btnName === "No") {
                    return {
                      PAYMENT: {
                        value: "",
                        isFieldFocused: false,
                        ignoreUpdate: true,
                      },
                    };
                  }
                } else if (status === "9") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: "Alert",
                    message,
                  });
                }
              }
              if (field?.value) {
                return {
                  PAYMENT_TOTAL: {
                    value: field.value ?? "0",
                    ignoreUpdate: true,
                  },
                };
              } else {
                return {
                  PAYMENT_TOTAL: { value: "", ignoreUpdate: true },
                };
              }
            }
          },
          isReadOnly: (fieldValue, dependentFields, formState) => {
            const TRX = dependentFields?.["singleDenoRow.TRX"]?.value;
            const FLAG_HIDE =
              dependentFields?.["singleDenoRow.FLAG_HIDE"]?.value;
            const FLAG_CHQ = dependentFields?.["singleDenoRow.FLAG_CHQ"]?.value;
            const CHQNO = dependentFields?.["singleDenoRow.CHQNO"]?.value;
            const ACCT_CD = dependentFields?.["singleDenoRow.ACCT_CD"]?.value;
            if (
              TRX === "4" &&
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
    // {
    //   render: {
    //     componentType: "spacer",
    //   },
    //   name: "SPCER",
    //   GridProps: {
    //     xs: 0.0,
    //     md: 1.5,
    //     sm: 1.3,
    //     lg: 5,
    //     xl: 5,
    //   },
    // },
    // {
    //   render: {
    //     componentType: "hidden",
    //   },
    //   name: "BTN_DIS_R",
    //   defaultValue: "",
    // },
    // {
    //   render: {
    //     componentType: "hidden",
    //   },
    //   name: "BTN_DIS_P",
    //   defaultValue: "",
    // },
    {
      render: {
        componentType: "amountField",
      },
      name: "RECEIPT_TOTAL",
      label: "Receipt Total",
      placeholder: "Receipt Total",
      dependentFields: ["singleDenoRow"],
      type: "text",
      validationRun: "onBlur",
      defaultValue: "0",
      setValueOnDependentFieldsChange: (dependentFieldState) => {
        let accumulatedTakeoverLoanAmount = (
          Array.isArray(dependentFieldState?.["singleDenoRow"])
            ? dependentFieldState?.["singleDenoRow"]
            : []
        ).reduce((accum, obj) => accum + Number(obj?.RECEIPT?.value), 0);

        return accumulatedTakeoverLoanAmount;
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
      type: "text",
      validationRun: "onBlur",
      setValueOnDependentFieldsChange: (dependentFieldState) => {
        let accumulatedTakeoverLoanAmount = (
          Array.isArray(dependentFieldState?.["singleDenoRow"])
            ? dependentFieldState?.["singleDenoRow"]
            : []
        ).reduce((accum, obj) => accum + Number(obj?.PAYMENT?.value), 0);

        return accumulatedTakeoverLoanAmount;
      },
      isReadOnly: true,
      GridProps: { xs: 5.7, sm: 3, md: 3, lg: 1.5, xl: 1.5 },
    },
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
      name: "DENOBTN",
      label: "Denomination",
      endsIcon: "",
      rotateIcon: "",
      placeholder: "",
      type: "text",
      // dependentFields: ["BTN_DIS_R", "BTN_DIS_P"],
      // shouldExclude(fieldData, dependentVal, formState) {
      //   console.log(dependentVal, "dependentValdependentVal?/");
      //   if (
      //     Boolean(dependentVal?.BTN_DIS_R?.value === "Y") ||
      //     Boolean(dependentVal?.BTN_DIS_P?.value === "Y")
      //   ) {
      //     return false;
      //   } else {
      //     return true;
      //   }
      // },
      GridProps: {
        xs: 2.5,
        sm: 1.5,
        md: 1.5,
        lg: 1,
        xl: 1,
      },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "RELEASE",
      label: "Release",
      endsIcon: "",
      rotateIcon: "",
      placeholder: "",
      type: "text",
      // dependentFields: ["BTN_DIS_R", "BTN_DIS_P"],
      // shouldExclude(fieldData, dependentVal, formState) {
      //   console.log(dependentVal, "dependentValdependentVal?/");
      //   if (
      //     Boolean(dependentVal?.BTN_DIS_R?.value === "Y") ||
      //     Boolean(dependentVal?.BTN_DIS_P?.value === "Y")
      //   ) {
      //     return false;
      //   } else {
      //     return true;
      //   }
      // },
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
