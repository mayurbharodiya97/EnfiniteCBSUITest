
import * as API from '../api'
import { GeneralAPI } from "registry/fns/functions";
import { utilFunction } from "components/utils";
import { format } from 'date-fns';
import { t } from 'i18next';

export const StandingInstructionMainMetaData = {
  form: {
    name: "Standing Instruction Entry (TRN/394)",
    label: "",
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
      select: {
        fullWidth: true,
      },
      textField: {
        fullWidth: true,
      },
      datePicker: {
        fullWidth: true,
      },
      numberFormat: {
        fullWidth: true,
      },
      _accountNumber: {
        fullWidth: true,
      },
      arrayField: {
        fullWidth: true,
      },
      amountField: {
        fullWidth: true,
      }
    },
  },
  fields: [
    {
      render: { componentType: "autocomplete" },
      name: "COMM_TYPE_DESC",
      label: "Comm. Type",
      placeholder:"CommisionType",
      options: API.getcommisiontype,
      _optionsKey: "getcommisiontype",
      // defaultValue: "B",
      GridProps: { xs: 12, sm: 12, md: 6, lg: 6, xl: 6 },
    },
    {
      render: { componentType: "textField" },
      name: "DESCRIPTION",
      label: "Description",
      type: "text",
      required: true,
      placeholder: "Description",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: [t("DescriptionisRequired")] }],
      },
      GridProps: { xs: 12, sm: 12, md: 6, lg: 6, xl: 6},
    },
    {
      render: {
        componentType: "arrayField",
      },
      
      name: "SI_SDT",
      changeRowOrder: true,
      addRowFn: (data) => {
        const dataArray = Array.isArray(data?.SI_SDT) ? data.SI_SDT : [];
        if (dataArray.length > 0) {
            const firstItem = dataArray[0];

            if (
                firstItem.CR_ACCT_CD.trim() &&
                firstItem.CR_ACCT_TYPE.trim() &&
                firstItem.DR_ACCT_CD.trim() &&
                firstItem.DR_ACCT_TYPE.trim() &&
                firstItem.SI_AMOUNT.trim() &&
                firstItem.EXECUTE_DAY.trim() &&
                firstItem.FEQ_VALUE.trim() &&
                firstItem.FEQ_TYPE.trim() &&
                firstItem.START_DT && 
                firstItem.VALID_UPTO
            ) {
                return true;
            }
        }
        return false;
    },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: { componentType: "_accountNumber" },
          branchCodeMetadata: {
            label: "EnterCreditBranchCode",
            name: "CR_BRANCH_CD",
            __VIEW__: { isReadOnly: true },
            GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
          },
          accountTypeMetadata: {
            label: "EnterCreditAccountType",
            name: "CR_ACCT_TYPE",
            options: (dependentValue, formState, _, authState) => {
              return GeneralAPI.get_Account_Type({
                COMP_CD: authState?.companyID,
                BRANCH_CD: authState?.user?.branchCode,
                USER_NAME: authState?.user?.id,
                DOC_CD: "SICRTYPE",
              });

            },
            _optionsKey: "credit_acct_type",
            GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
          },
          accountCodeMetadata: {
            label: "EnterCreditAccountNo",
            name: "CR_ACCT_CD",
            autoComplete: "off",
            maxLength: 20,
            dependentFields: ["CR_ACCT_TYPE", "CR_BRANCH_CD", "DR_ACCT_CD","DR_ACCT_TYPE","DEF_TRAN_CD","EXECUTE_DAY","DR_ACCT_TYPE"],
            postValidationSetCrossFieldValues: async (
              currentField,
              formState,
              authState,
              dependentFieldValues
            ) => {
              if (formState?.isSubmitting) return {};

              const reqData = {
                BRANCH_CD: authState.user.branchCode,
                COMP_CD: authState?.companyID,
                CR_ACCT_TYPE: dependentFieldValues?.["SI_SDT.CR_ACCT_TYPE"]?.value,
                CR_ACCT_CD: utilFunction.getPadAccountNumber(
                  currentField?.value,
                  dependentFieldValues?.CR_ACCT_TYPE?.optionData
                ),
                CR_BRANCH_CD:dependentFieldValues?.["SI_SDT.CR_BRANCH_CD"]?.value,
                EXECUTE_DAY:dependentFieldValues?.["SI_SDT.EXECUTE_DAY"]?.value,
                DR_ACCT_CD:dependentFieldValues?.["SI_SDT.DR_ACCT_CD"]?.value,
                DR_ACCT_TYPE:dependentFieldValues?.["SI_SDT.DR_ACCT_TYPE"]?.value,
                DEF_TRAN_CD:dependentFieldValues?.["SI_SDT.DEF_TRAN_CD"]?.value,
                SCREEN_REF: "TRN/394",
              };
      
              if (

                dependentFieldValues?.["SI_SDT.CR_BRANCH_CD"]?.value &&
                dependentFieldValues?.["SI_SDT.CR_ACCT_TYPE"]?.value
              ) {
                const postData = await API.getCreditAccountvalidation({reqData});

                let btn99, returnVal;

                const getButtonName = async (obj) => {
                  let btnName = await formState.MessageBox(obj);
                  return { btnName, obj };
                };
    
                for (let i = 0; i < postData.length; i++) {
             
                  if (postData[i]?.O_STATUS === "999") {
                    const { btnName, obj } = await getButtonName({
                      messageTitle: t("ValidationFailed"),
                      message: postData[i]?.O_MESSAGE,
                    });
                    returnVal = "";
                  } else if (postData[i]?.O_STATUS === "99") {
                    const { btnName, obj } = await getButtonName({
                      messageTitle: t("Confirmation"),
                      message: postData[i]?.O_MESSAGE,
                      buttonNames: ["Yes", "No"],
                    });
                    btn99 = btnName;
                    if (btnName === "No") {
                      returnVal = "";
                    }
                  } else if (postData[i]?.O_STATUS === "9") {
                    if (btn99 !== "No") {
                      const { btnName, obj } = await getButtonName({
                        messageTitle: t("Alert"),
                        message: postData[i]?.O_MESSAGE,
                      });
                    }
                    returnVal = "";
                  } else if (postData[i]?.O_STATUS === "0") {
                    if (btn99 !== "No") {
                      returnVal = postData[i];
                    } else {
                      returnVal = "";
                    }
                  }
                }
                btn99 = 0;
                return {
                  CR_ACCT_CD:
                    returnVal !== ""
                      ? {
                          value: utilFunction.getPadAccountNumber(
                            currentField?.value,
                            dependentFieldValues?.CR_ACCT_TYPE?.optionData
                          ),
                          ignoreUpdate: true,
                          isFieldFocused: false,
                        }
                      : {
                          value: "",
                          isFieldFocused: true,
                          ignoreUpdate: true,
                        },
                        SI_AMOUNT: {
                          value: returnVal?.SI_AMOUNT ?? "",
                        },
                        SI_CHARGE:{
                          value: returnVal?.SI_CHARGE ?? "",
                        },
                        FEQ_VALUE:{
                          value: returnVal?.FEQ_VALUE ?? "",
                        },
                        EXECUTE_DAY:{
                          value: returnVal?.EXECUTE_DAY ?? "",
                        },
                        FEQ_TYPE:{
                          value: returnVal?.FEQ_TYPE ?? "",
                        },
                        // START_DT:{
                        //   value: returnVal?.START_DT ?? "",
                        // },
                         
                };
              }
            },
            AlwaysRunPostValidationSetCrossFieldValues: {
              alwaysRun: true,
              touchAndValidate: false,
            },
            runPostValidationHookAlways: false,
            FormatProps: {
              isAllowed: (values) => {
                //@ts-ignore
                if (values?.value?.length > 20) {
                  return false;
                }
                return true;
              },
            },
            fullWidth: true,
            GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
          },

        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "START_DT",
          label: "StartDate",
        defaultValue: new Date(),
          fullWidth: true,
          dateFormat: "dd/MMM/yyyy",
          GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
          runValidationOnDependentFieldsChange: true,
          required: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: [t("StartDateisrequired.")] },
            ],
          },
          validate: (fieldValue,dependentFields) => {
            if (format(fieldValue.value, "dd/MM/yyyy") < format(new Date(), "dd/MM/yyyy")) {
                  return t("CompareDate");
                }
            }
          },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "EXECUTE_DAY",
          label: "ExecuteOnDay",
          placeholder: "EnterExecuteOnDay",
          type: "text",
          fullWidth: true,
          required: true,
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: false,
          },
          validate: (fieldValue) => {
            if (fieldValue.value < 1 || fieldValue.value > 29) {
              return "EexecuteValidation";
            }
          },
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["ExecuteOnDayisRequired"] }],
          },
          GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "FEQ_TYPE",
          label: "FrequncyType",
          placeholder: "EnterFrequncyType",
          type: "text",
          options: [
            { label: "Day(s)", value: "D" },
            { label: "Month(s)", value: "M" },
            { label: "Quartely", value: "Q" },
            { label: "Half Yearly", value: "H" },
            { label: "Year(s)", value: "Y" },
          ],
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["FrequncyTypeisRequired"] }],
          },
          GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
        },

        {
          render: {
            componentType: "numberFormat",
          },
          name: "FEQ_VALUE",
          label: "FrequencyValue",
          placeholder: "EnterFrequncyValue",
          type: "text",
          fullWidth: true,
          required: true,
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: false,
            isAllowed: (values) => {
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: [t("FrequencyValueisRequired")] }],
          },

          GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
        },
        {
          render: { componentType: "_accountNumber" },
          branchCodeMetadata: {
            label: "EnterDebitBranchCode",
            name: "BRANCH_CD",
            __VIEW__: { isReadOnly: true },
            GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
          },
          accountTypeMetadata: {
            label: "EnterDebitAccountType",
            name: "DR_ACCT_TYPE",
            options: (dependentValue, formState, _, authState) => {
              return GeneralAPI.get_Account_Type({
                COMP_CD: authState?.companyID,
                BRANCH_CD: authState?.user?.branchCode,
                USER_NAME: authState?.user?.id,
                DOC_CD: "SIDRTYPE",
              });

            },
            _optionsKey: "debit_acct_type",
            GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
          },
          accountCodeMetadata: {
            label: "EnterDebitAccountNo",
            name: "DR_ACCT_CD",
            autoComplete: "off",
            maxLength: 20,
            dependentFields: ["DR_ACCT_TYPE", "BRANCH_CD", "CR_ACCT_CD", "CR_ACCT_TYPE", "CR_BRANCH_CD", "ENT_COMP_CD", "ENT_BRANCH_CD","DEF_TRAN_CD","EXECUTE_DAY"],
            postValidationSetCrossFieldValues: async (
              currentField,
              formState,
              authState,
              dependentFieldValues
            ) => {
              if (formState?.isSubmitting) return {};

              const reqData = {
                BRANCH_CD: authState.user.branchCode,
                COMP_CD: authState?.companyID,
                ACCT_TYPE: dependentFieldValues?.["SI_SDT.CR_ACCT_TYPE"]?.value,
                ACCT_CD: dependentFieldValues?.["SI_SDT.CR_ACCT_CD"].value,
                DR_BRANCH_CD:dependentFieldValues?.["SI_SDT.BRANCH_CD"]?.value,
                DR_ACCT_TYPE:dependentFieldValues?.["SI_SDT.DR_ACCT_TYPE"]?.value,
                DR_ACCT_CD: utilFunction.getPadAccountNumber(
                  currentField?.value,
                  dependentFieldValues?.DR_ACCT_TYPE?.optionData
                ),
                DEF_TRAN_CD:dependentFieldValues?.["SI_SDT.DEF_TRAN_CD"]?.value,
                EXECUTE_DAY:dependentFieldValues?.["SI_SDT.EXECUTE_DAY"]?.value,
                SCREEN_REF: "TRN/394",
              };
              if (

                dependentFieldValues?.["SI_SDT.BRANCH_CD"]?.value &&
                dependentFieldValues?.["SI_SDT.DR_ACCT_TYPE"]?.value
              ) {
                const postData = await API.getDebitAccountvalidation({reqData});
                let btn99, returnVal;

                const getButtonName = async (obj) => {
                  let btnName = await formState.MessageBox(obj);
                  return { btnName, obj };
                };
    
                for (let i = 0; i < postData.length; i++) {
                 
                  if (postData[i]?.O_STATUS === "999") {
                    const { btnName, obj } = await getButtonName({
                      messageTitle: t("ValidationFailed"),
                      message: postData[i]?.O_MESSAGE,
                    });
                    returnVal = "";
                  } else if (postData[i]?.O_STATUS === "99") {
                    const { btnName, obj } = await getButtonName({
                      messageTitle: t("Confirmation"),
                      message: postData[i]?.O_MESSAGE,
                      buttonNames: ["Yes", "No"],
                    });
                    btn99 = btnName;
                    if (btnName === "No") {
                      returnVal = "";
                    }
                  } else if (postData[i]?.O_STATUS === "9") {
                    if (btn99 !== "No") {
                      const { btnName, obj } = await getButtonName({
                        messageTitle: t("Alert"),
                        message: postData[i]?.O_MESSAGE,
                      });
                    }
                    returnVal = "";
                  } else if (postData[i]?.O_STATUS === "0") {
                    if (btn99 !== "No") {
                      returnVal = postData[i];
                    } else {
                      returnVal = "";
                    }
                  }
                }
                btn99 = 0;
                return {
                  DR_ACCT_CD:
                    returnVal !== ""
                      ? {
                          value: utilFunction.getPadAccountNumber(
                            currentField?.value,
                            dependentFieldValues?.DR_ACCT_TYPE?.optionData
                          ),
                          ignoreUpdate: true,
                          isFieldFocused: false,
                        }
                      : {
                          value: "",
                          isFieldFocused: true,
                          ignoreUpdate: true,
                        },
                      }
    
              }
                
            },
            AlwaysRunPostValidationSetCrossFieldValues: {
              alwaysRun: true,
              touchAndValidate: false,
            },
            runPostValidationHookAlways: false,
            FormatProps: {
              isAllowed: (values) => {
                //@ts-ignore
                if (values?.value?.length > 20) {
                  return false;
                }
                return true;
              },
            },
            fullWidth: true,
            GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
      
          },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "SI_AMOUNT",
          label: "SIAmount",
          placeholder: "",
          type: "text",
          dependentFields: ["DR_ACCT_TYPE", "DR_ACCT_CD", "DEF_TRAN_CD", "BRANCH_CD","SI_AMOUNT_PROTECT"],
          isReadOnly: (fieldValue, dependentFields, formState) => {
            if(dependentFields.SI_AMOUNT_PROTECT.value === "Y")
              {
                return true;
              }
           },
          FormatProps: {
            allowNegative: false,
          },
          
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            if (formState?.isSubmitting) return {};
            // const ACCT_CD = dependentFieldValues?.["SI_SDT.DR_ACCT_CD"]?.value;

            const reqParameters = {
              COMP_CD: authState?.companyID,
              BRANCH_CD: dependentFieldValues?.["SI_SDT.BRANCH_CD"]?.value,
              ACCT_TYPE: dependentFieldValues?.["SI_SDT.DR_ACCT_TYPE"]?.value,
              ACCT_CD: dependentFieldValues?.["SI_SDT.DR_ACCT_CD"]?.value,
              AMOUNT: currentField?.value,
              DEF_TRAN_CD: dependentFieldValues?.["SI_SDT.DEF_TRAN_CD"]?.value,
              DOC_CD: formState?.docCd ?? "",
            };

            const postData = await API.getSiCharge(reqParameters);
            return {
              SI_CHARGE: {
                value:postData
                ? postData[0]?.SI_CHARGE ?? ""
                : "",
                isFieldFocused: true,
                ignoreUpdate: true,
              },
            };
          },
          required: true,
          GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: [t("SIAmountisRequired")] }],
          },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "SI_CHARGE",
          label: "SI Charge",
          type: "text",
          FormatProps: {
            allowNegative: false,
          },

          fullWidth: true,
          GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "DEF_TRAN_CD",
          label: "",
          type: "text",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "COMP_CD",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "SI_AMOUNT_PROTECT",
          label: "Si_amount_protext"
          
        },
        {
          render: {
            componentType: "textField",
          },
          name: "REMARKS",
          label: "Remark",
          placeholder: "Enter Remark",
          type: "text",
          GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
        },
        {
          render: {
            componentType: "datePicker",
          },
          name: "VALID_UPTO",
          label: "ValidUpTo",
          placeholder: "",
          // dateFormat: "dd/MMM/yyyy",
          required: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["ValidUptoDateisrequired"] },
            ],
          },
          dependentFields:["START_DT"],
          runValidationOnDependentFieldsChange: true,
          validate: (fieldValue, dependentFields) => {
            if (fieldValue && fieldValue.value <= dependentFields?.["SI_SDT.START_DT"]?.value) {
                  return t("StartDateValidDateCompare");
            }
          },
          GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
        },
      ],
    },


  ],
};
// export const StandingInstructionSubMetaData: any = {
//   form: {
//     name: "Standing Instruction Entry (TRN/394)",
//     label: "Standing Instruction Entry (TRN/394)",
//     resetFieldOnUmnount: false,
//     hideHeader:false,
//     validationRun: "onBlur",
//     submitAction: "home",
//     render: {
//       ordering: "auto",
//       renderType: "simple",

//       gridConfig: {
//         item: {
//           xs: 12,
//           sm: 6,
//           md: 6,
//         },
//         container: {
//           direction: "row",
//           spacing: 1,
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
//       _accountNumber:{
//         fullWidth: true,
//       },
//       arrayField:{
//         fullWidth: true,
//       },
//       amountField:{
//         fullWidth: true,
//       }
//     },
//   },
//   fields: [
//     {
//       render: {
//         componentType: "arrayField",
//       },
//       name: "siDetail",
//       GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
//       _fields: [
//         {
//           render: { componentType: "_accountNumber" },
//           branchCodeMetadata: {
//             label:"Enter Credit Branch Code",
//             name: "CR_BRANCH_CD",
//             __VIEW__: { isReadOnly: true },
//             GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
//           },
//           accountTypeMetadata: {
//             label:"Enter Credit Account Type",
//             name: "CR_ACCT_TYPE",
//             options: (dependentValue, formState, _, authState) => {
//               return GeneralAPI.get_Account_Type({
//                 COMP_CD: authState?.companyID,
//                 BRANCH_CD: authState?.user?.branchCode,
//                 USER_NAME: authState?.user?.id,
//                 DOC_CD: "SICRTYPE",
//               });

//             },
//             _optionsKey: "credit_acct_type",
//             GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
//           },
//           accountCodeMetadata: {
//             label:"Enter Credit Account No.",
//             name: "CR_ACCT_CD",
//             autoComplete: "off",
//             maxLength: 20,
//             dependentFields: ["CR_ACCT_TYPE", "CR_BRANCH_CD"],
//                 postValidationSetCrossFieldValues: async (
//                   currentField,
//                   formState,
//                   authState,
//                   dependentFieldValues
//                 ) => {
//                   if (formState?.isSubmitting) return {};

//                   const reqParameters = {
//                     BRANCH_CD: dependentFieldValues?.["siDetail.CR_BRANCH_CD"]?.value,
//                     COMP_CD: authState?.companyID,
//                     ACCT_TYPE: dependentFieldValues?.["siDetail.CR_ACCT_TYPE"]?.value,
//                    ACCT_CD: utilFunction.getPadAccountNumber(
//                     currentField?.value,
//                             dependentFieldValues?.CR_ACCT_TYPE?.optionData
//                   ),
//                     SCREEN_REF: "TRN/394",
//                   };

//                   if (

//                     dependentFieldValues?.["siDetail.CR_BRANCH_CD"]?.value &&
//                     dependentFieldValues?.["siDetail.CR_ACCT_TYPE"]?.value
//                   ) {
//                     const postData = await GeneralAPI.getAccNoValidation(reqParameters);

//                     if (postData?.RESTRICTION) {
//                       formState.MessageBox({
//                         messageTitle: "Validation Failed...!",
//                         message: postData.RESTRICTION,
//                         buttonNames: ["Ok"],
//                       });
//                       return {
//                         CR_ACCT_CD: { value: "" },
//                         CR_ACCT_TYPE: { value: "" },
//                       };
//                     }

//                     if (postData?.MESSAGE1) {
//                       formState.MessageBox({
//                         messageTitle: "Validation Alert",
//                         message: postData.MESSAGE1,
//                         buttonNames: ["Ok"],
//                       });
//                     }

//                     // alert start
//                           const reqPara = {

//                     ENT_BRANCH_CD:authState?.user?.branchCode ?? "",
//                     ENT_COMP_CD: authState?.companyID ?? "",
//                     BRANCH_CD: authState?.user?.branchCode ?? "",
//                     COMP_CD: authState?.companyID ?? "",
//                     ACCT_TYPE: dependentFieldValues?.["siDetail.CR_ACCT_TYPE"]?.value,
//                     FLAG:'C',
//                    ACCT_CD: utilFunction.getPadAccountNumber(
//                     currentField?.value,
//                             dependentFieldValues?.CR_ACCT_TYPE?.optionData
//                   ),
//                     SCREEN_REF: "TRN/394",
//                   };

//                     if (

//                       dependentFieldValues?.["siDetail.CR_BRANCH_CD"]?.value &&
//                       dependentFieldValues?.["siDetail.CR_ACCT_TYPE"]?.value
//                     ) {
//                       const postData1 = await API.GetCrDrAcctAlertMsg(reqPara);
//                       const CNT = postData1[0].CNT;


//                     if (CNT > 0) {
//                       const btnName = await formState.MessageBox({
//                         messageTitle: t("Alert"),
//                         message: "This A/c is already used in SI. Do you want to continue?",
//                         buttonNames: ["Yes", "No"],
//                       });

//                       if (btnName === "No") {
//                         alert("hello");
//                       }
//                     }
//                   }
//         // alert end

//                     return {
//                               CR_ACCT_CD:
//                               postData[0] !== ""
//                       ? {
//                           value: currentField?.value.padStart(6, "0")?.padEnd(20, " "),
//                           ignoreUpdate: true,
//                           isFieldFocused: false,
//                         }
//                       : {
//                           value: "",
//                           isFieldFocused: true,
//                           ignoreUpdate: true,
//                         },
//                     };
//                   }
//                 },

//             runPostValidationHookAlways: true,
//             FormatProps: {
//               isAllowed: (values) => {
//                 //@ts-ignore
//                 if (values?.value?.length > 20) {
//                   return false;
//                 }
//                 return true;
//               },
//             },
//             fullWidth: true,
//             GridProps: { xs: 6, sm: 6, md: 3, lg: 2, xl: 2 },
//           },

//         },
//         {
//           render: {
//             componentType: "datePicker",
//           },
//           name: "START_DT",
//           label: "Start Date",
//           type: "text",
//           fullWidth: true,

//           GridProps: { xs: 6, sm: 6, md: 2, lg: 2, xl: 2 },
//         },
//         {
//           render: {
//             componentType: "textField",
//           },
//           name: "EXECUTE_DAY",
//           label: "Execute On Day",
//           placeholder:"Enter Execute On Day",
//           fullWidth: true,
//           GridProps: { xs: 6, sm: 6, md: 2, lg: 2, xl:2 },
//         },

//         {
//           render: {
//             componentType: "select",
//           },
//           name: "FEQ_TYPE",
//           label: "Frequncy Type",
//           placeholder:"Enter Frequncy Type",
//           type: "text",
//           options: [
//             { label: "Day(s)", value: "D"},
//             { label: "Month(s)", value: "M"},
//             { label: "Quartely", value: "Q"},
//             { label: "Half Yearly", value: "H"},
//             { label: "Year(s)", value: "Y"},
//           ],
//           required: true,
//           GridProps: { xs: 6, sm: 6, md: 2, lg: 2, xl:2 },
//         },

//         {
//           render: {
//             componentType: "numberFormat",
//           },
//           name: "FEQ_VALUE",
//           label: "Frequency Value",
//           placeholder:"Enter Frequncy Value",
//           type: "text",
//           fullWidth: true,
//           required: true,
//           FormatProps: {
//             allowNegative: false,
//             allowLeadingZeros: false,
//             isAllowed: (values) => {
//               if (values.floatValue === 0) {
//                 return false;
//               }
//               return true;
//             },
//           },

//           GridProps: { xs: 6, sm: 6, md: 2, lg: 2, xl:2 },
//         },
//         {
//           render: { componentType: "_accountNumber" },
//           branchCodeMetadata: {
//             label:"Enter Debit Branch Code",
//             name: "DR_BRANCH_CD",
//             __VIEW__: { isReadOnly: true },
//             GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
//           },
//           accountTypeMetadata: {
//             label:"Enter Debit Account Type",
//             name: "DR_ACCT_TYPE",
//             options: (dependentValue, formState, _, authState) => {
//               return GeneralAPI.get_Account_Type({
//                 COMP_CD: authState?.companyID,
//                 BRANCH_CD: authState?.user?.branchCode,
//                 USER_NAME: authState?.user?.id,
//                 DOC_CD: "SIDRTYPE",
//               });

//             },
//             _optionsKey: "debit_acct_type",
//             GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
//           },
//           accountCodeMetadata: {
//             label:"Enter Debit Account No.",
//             name: "DR_ACCT_CD",
//             autoComplete: "off",
//             maxLength: 20,
//             dependentFields: ["DR_ACCT_TYPE", "DR_BRANCH_CD","CR_ACCT_CD","CR_ACCT_TYPE","CR_BRANCH_CD"],
//                 postValidationSetCrossFieldValues: async (
//                   currentField,
//                   formState,
//                   authState,
//                   dependentFieldValues
//                 ) => {
//                   if (formState?.isSubmitting) return {};

//                   const reqParameters = {
//                     BRANCH_CD: dependentFieldValues?.["siDetail.DR_BRANCH_CD"]?.value,
//                     COMP_CD: authState?.companyID,
//                     ACCT_TYPE: dependentFieldValues?.["siDetail.DR_ACCT_TYPE"]?.value,
//                    ACCT_CD: utilFunction.getPadAccountNumber(
//                     currentField?.value,
//                             dependentFieldValues?.DR_ACCT_TYPE?.optionData
//                   ),
//                     SCREEN_REF: "TRN/394",
//                   };

//                   if (

//                     dependentFieldValues?.["siDetail.DR_BRANCH_CD"]?.value &&
//                     dependentFieldValues?.["siDetail.DR_ACCT_TYPE"]?.value
//                   ) {
//                     const postData = await GeneralAPI.getAccNoValidation(reqParameters);

//                     if (postData?.RESTRICTION) {
//                       formState.MessageBox({
//                         messageTitle: "Validation Failed...!",
//                         message: postData.RESTRICTION,
//                         buttonNames: ["Ok"],
//                       });
//                       return {
//                         DR_ACCT_CD: { value: "" },
//                         DR_ACCT_TYPE: { value: "" },
//                       };
//                     }

//                     if (postData?.MESSAGE1) {
//                       formState.MessageBox({
//                         messageTitle: "Validation Alert",
//                         message: postData.MESSAGE1,
//                         buttonNames: ["Ok"],
//                       });
//                     }

//                     // alert start
//                           const reqPara = {

//                     ENT_BRANCH_CD:authState?.user?.branchCode ?? "",
//                     ENT_COMP_CD: authState?.companyID ?? "",
//                     BRANCH_CD: authState?.user?.branchCode ?? "",
//                     COMP_CD: authState?.companyID ?? "",
//                     ACCT_TYPE: dependentFieldValues?.["siDetail.DR_ACCT_TYPE"]?.value,
//                     FLAG:'D',
//                    ACCT_CD: utilFunction.getPadAccountNumber(
//                     currentField?.value,
//                             dependentFieldValues?.DR_ACCT_TYPE?.optionData
//                   ),
//                     SCREEN_REF: "TRN/394",
//                   };

//                     if (

//                       dependentFieldValues?.["siDetail.DR_BRANCH_CD"]?.value &&
//                       dependentFieldValues?.["siDetail.DR_ACCT_TYPE"]?.value
//                     ) {
//                       const postData1 = await API.GetCrDrAcctAlertMsg(reqPara);
//                       const CNT = postData1[0].CNT;

//                     if (CNT > 0) {
//                       formState.MessageBox({
//                         messageTitle: t("Alert"),
//                         message: "This A/c is already used in SI  Do you want to continue?",
//                         buttonNames: ["Yes", "No"],
//                       });
//                     }
//                   }
//         // alert end

//                     return {
//                               DR_ACCT_CD:
//                               postData[0] !== ""
//                       ? {
//                           value: currentField?.value.padStart(6, "0")?.padEnd(20, " "),
//                           ignoreUpdate: true,
//                           isFieldFocused: false,
//                         }
//                       : {
//                           value: "",
//                           isFieldFocused: true,
//                           ignoreUpdate: true,
//                         },
//                     };
//                   }
//                 },

//             runPostValidationHookAlways: true,
//             FormatProps: {
//               isAllowed: (values) => {
//                 //@ts-ignore
//                 if (values?.value?.length > 20) {
//                   return false;
//                 }
//                 return true;
//               },
//             },
//             fullWidth: true,
//             GridProps: { xs: 6, sm: 6, md: 3, lg: 2, xl: 2 },
//           },

//         },
//         {
//           render: {
//             componentType: "amountField",
//           },
//           name: "SI_AMOUNT",
//           label: "SI Amount",
//           placeholder: "",
//           type: "text",
//           FormatProps: {
//             allowNegative: false,
//           },
//           required: true,
//           GridProps: { xs: 6, sm: 6, md: 2, lg: 2, xl:2 },
//         },
//         {
//           render: {
//             componentType: "amountField",
//           },
//           name: "SI_CHARGE",
//           label: "SI Charge",
//           type: "text",
//           FormatProps: {
//             allowNegative: false,
//           },
//           fullWidth: true,
//           GridProps: {  xs: 6, sm: 6, md: 2, lg: 2, xl:2 },
//         },

//         {
//           render: {
//             componentType: "textField",
//           },
//           name: "REMARKS",
//           label: "Remark",
//           placeholder: "Enter Remark",
//           type: "text",
//           GridProps: { xs: 6, sm: 6, md: 2, lg: 2, xl: 2},
//         },
//         {
//           render: {
//             componentType: "datePicker",
//           },
//           name: "VALID_UPTO",
//           label: "Valid UpTo",
//           placeholder: "",
//           type: "text",
//           required: true,
//           GridProps: { xs: 6, sm: 6, md: 2, lg: 2, xl: 2 },
//         },
//       ],
//     },

//   ],
// };


export const StandingInstructionViewMetaData: any = {
  form: {
    name: "Standing Instruction Entry (TRN/394)",
    label: "",
    resetFieldOnUmnount: false,
    hideHeader: false,
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
              componentType: "datePicker",
            },
            name: "EXECUTE_DT",
            label: "ExecuteDate",
            type: "text",
            isReadOnly:true,
            fullWidth: true,
            GridProps: { xs: 6, sm: 6, md: 2, lg: 2, xl: 2},
          },
          {
            render: {
              componentType: "datePicker",
            },
            name: "PROCESS_DT",
            label: "ProcessDate",
            type: "text",
            fullWidth: true,
            isReadOnly:true,
            GridProps: {  xs: 6, sm: 6, md: 2, lg: 2, xl: 2 },
          },
          {
            render: {
              componentType: "textField",
            },
            name: "SI_EXECUTE_FLG_DIS",
            label: "SIExecuteProcess",
            type: "text",
            fullWidth: true,
            isReadOnly:true,
            GridProps: { xs: 6, sm: 6,md: 2, lg: 2, xl: 2},
          },
          {
            render: {
              componentType: "hidden",
            },
            name: "SI_EXECUTE_FLG",
            label: "SIExecuteFLAG"
          },
          {
            render: {
              componentType: "textField",
            },
            name: "REASON",
            label: "Reason",
            type: "text",
            fullWidth: true,
            isReadOnly:true,
            GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
          },
          {
            render: { 
              
              componentType: "_accountNumber" },
              name:"data",
            branchCodeMetadata: {
              label: "DebitBranchCode",
              name: "BRANCH_CD",
              __VIEW__: { isReadOnly: true },
              GridProps: { xs: 6, sm: 6,md: 3, lg: 3, xl: 3},
            },
            accountTypeMetadata: {
              label: "DebitAcctType",
              name: "DR_ACCT_TYPE",
              options: (dependentValue, formState, _, authState) => {
                return GeneralAPI.get_Account_Type({
                  COMP_CD: authState?.companyID,
                  BRANCH_CD: authState?.user?.branchCode,
                  USER_NAME: authState?.user?.id,
                  DOC_CD: "SIDRTYPE",
                });
      
              },
              _optionsKey: "debit_acct_type",
              GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3},
            },
            accountCodeMetadata: {
              label: "DebitAcctNo",
              name: "DR_ACCT_CD",
              autoComplete: "off",
              maxLength: 20,
              dependentFields: ["CR_ACCT_CD", "CR_ACCT_TYPE", "BRANCH_CD","EXECUTE_DAY","DR_ACCT_CD","DR_ACCT_TYPE","DEF_TRAN_CD"],
              postValidationSetCrossFieldValues: async (
                currentField,
                formState,
                authState,
                dependentFieldValues
              ) => {
              // console.log(formState.isButtonClick);
              //   // if(formState.isButtonClick !== "N")
              //   // {
            
                  if (formState?.isSubmitting) return {};
      
                  const reqData = {
                    BRANCH_CD: authState.user.branchCode,
                    COMP_CD: authState?.companyID,
                    ACCT_TYPE: dependentFieldValues?.CR_ACCT_TYPE?.value,
                    ACCT_CD: dependentFieldValues?.CR_ACCT_CD?.value,
                    DR_BRANCH_CD:dependentFieldValues?.BRANCH_CD?.value,
                    DR_ACCT_TYPE:dependentFieldValues?.DR_ACCT_TYPE?.value,
                    DR_ACCT_CD: utilFunction.getPadAccountNumber(
                      currentField?.value,
                      dependentFieldValues?.DR_ACCT_TYPE?.optionData
                    ),
                    DEF_TRAN_CD:dependentFieldValues?.DEF_TRAN_CD?.value,
                    EXECUTE_DAY:dependentFieldValues?.EXECUTE_DAY?.value,
                    SCREEN_REF: "TRN/394",
                  };
                  if (
    
                    dependentFieldValues?.BRANCH_CD?.value &&
                    dependentFieldValues?.DR_ACCT_TYPE?.value
                  ) {
                    const postData = await API.getDebitAccountvalidation({reqData});
        
                  let btn99, returnVal;
    
                  const getButtonName = async (obj) => {
                    let btnName = await formState.MessageBox(obj);
                    return { btnName, obj };
                  };
      
                  for (let i = 0; i < postData.length; i++) {
               
                    if (postData[i]?.O_STATUS === "999") {
                      const { btnName, obj } = await getButtonName({
                        messageTitle: t(t("ValidationFailed")),
                        message: postData[i]?.O_MESSAGE,
                      });
                      returnVal = "";
                    } else if (postData[i]?.O_STATUS === "99") {
                      const { btnName, obj } = await getButtonName({
                        messageTitle: t(t("Confirmation")),
                        message: postData[i]?.O_MESSAGE,
                        buttonNames: ["Yes", "No"],
                      });
                      btn99 = btnName;
                      if (btnName === "No") {
                        returnVal = "";
                      }
                    } else if (postData[i]?.O_STATUS === "9") {
                      if (btn99 !== "No") {
                        const { btnName, obj } = await getButtonName({
                          messageTitle: t(t("Alert")),
                          message: postData[i]?.O_MESSAGE,
                        });
                      }
                      returnVal = "";
                    } else if (postData[i]?.O_STATUS === "0") {
                      if (btn99 !== "No") {
                        returnVal = postData[i];
                      } else {
                        returnVal = "";
                      }
                    }
                  }
                  btn99 = 0;
                  return {
                    DR_ACCT_CD:
                      postData[0] !== ""
                        ? {
                          value: currentField?.value.padStart(6, "0")?.padEnd(20, " "),
                          ignoreUpdate: true,
                          isFieldFocused: false,
                        }
                        : {
                          value: "",
                          isFieldFocused: true,
                          ignoreUpdate: true,
                        },
                  };
                // }
                }
              },
      AlwaysRunPostValidationSetCrossFieldValues: {
              alwaysRun: true,
              touchAndValidate: false,
            },
              runPostValidationHookAlways: false,
              runValidationOnDependentFieldsChange: false,
              FormatProps: {
                isAllowed: (values) => {
                  //@ts-ignore
                  if (values?.value?.length > 20) {
                    return false;
                  }
                  return true;
                },
              },
              fullWidth: true,
              GridProps: { xs: 6, sm: 6, md: 3, lg: 2, xl: 2 },
            },
      
          },
          {
            render: { componentType: "_accountNumber" },
            name:"data",
            branchCodeMetadata: {
              label: "CreditBranchCode",
              name: "CR_BRANCH_CD",
              isReadOnly:true,
              __EDIT__: { isReadOnly: true },
              GridProps: { xs: 6, sm: 6,md: 3, lg: 3, xl: 3 },
            },
            accountTypeMetadata: {
              label: "CreditAcctType",
              isReadOnly:true,
              name: "CR_ACCT_TYPE",
              options: (dependentValue, formState, _, authState) => {
                return GeneralAPI.get_Account_Type({
                  COMP_CD: authState?.companyID,
                  BRANCH_CD: authState?.user?.branchCode,
                  USER_NAME: authState?.user?.id,
                  DOC_CD: "SICRTYPE",
                });
      
              },
              _optionsKey: "credit_acct_type",
              GridProps: { xs: 6, sm: 6, md: 2, lg: 2, xl: 2},
            },
            accountCodeMetadata: {
              label: "CreditAcctNo",
              name: "CR_ACCT_CD",
              autoComplete: "off",
              maxLength: 20,
              isReadOnly:true,
              dependentFields: ["CR_ACCT_CD", "CR_ACCT_TYPE", "CR_BRANCH_CD","EXECUTE_DAY","DR_ACCT_CD","DR_ACCT_TYPE","DEF_TRAN_CD"],
              postValidationSetCrossFieldValues: async (
                currentField,
                formState,
                authState,
                dependentFieldValues
              ) => {
                if (formState?.isSubmitting) return {};
                if(currentField.readOnly === false)
                  
                {
  
          
                  const reqData = {
                    BRANCH_CD: authState.user.branchCode,
                    COMP_CD: authState?.companyID,
                    CR_ACCT_TYPE: dependentFieldValues?.CR_ACCT_TYPE?.value,
                    CR_ACCT_CD: utilFunction.getPadAccountNumber(
                      currentField?.value,
                      dependentFieldValues?.CR_ACCT_TYPE?.optionData
                    ),
                    CR_BRANCH_CD:dependentFieldValues?.CR_BRANCH_CD?.value,
                    EXECUTE_DAY:dependentFieldValues?.EXECUTE_DAY?.value,
                    DR_ACCT_CD:dependentFieldValues?.DR_ACCT_CD?.value,
                    DR_ACCT_TYPE:dependentFieldValues?.DR_ACCT_TYPE?.value,
                    DEF_TRAN_CD:dependentFieldValues?.DEF_TRAN_CD?.value,
                    SCREEN_REF: "TRN/394",
                  };
      
                  if (
    
                    dependentFieldValues?.["CR_BRANCH_CD"]?.value &&
                    dependentFieldValues?.["CR_ACCT_TYPE"]?.value
                  ) {
                    const postData = await API.getCreditAccountvalidation({reqData});
    
          
                    let btn99, returnVal;
      
                    const getButtonName = async (obj) => {
                      let btnName = await formState.MessageBox(obj);
                      return { btnName, obj };
                    };
        
                    for (let i = 0; i < postData.length; i++) {
                 
                      if (postData[i]?.O_STATUS === "999") {
                        const { btnName, obj } = await getButtonName({
                          messageTitle: t("ValidationFailed"),
                          message: postData[i]?.O_MESSAGE,
                        });
                        returnVal = "";
                      } else if (postData[i]?.O_STATUS === "99") {
                        const { btnName, obj } = await getButtonName({
                          messageTitle: t("Confirmation"),
                          message: postData[i]?.O_MESSAGE,
                          buttonNames: ["Yes", "No"],
                        });
                        btn99 = btnName;
                        if (btnName === "No") {
                          returnVal = "";
                        }
                      } else if (postData[i]?.O_STATUS === "9") {
                        if (btn99 !== "No") {
                          const { btnName, obj } = await getButtonName({
                            messageTitle: t("Alert"),
                            message: postData[i]?.O_MESSAGE,
                          });
                        }
                        returnVal = "";
                      } else if (postData[i]?.O_STATUS === "0") {
                        if (btn99 !== "No") {
                          returnVal = postData[i];
                        } else {
                          returnVal = "";
                        }
                      }
                    }
                    btn99 = 0;
            
                    return {
                      CR_ACCT_CD:
                        postData[0] !== ""
                          ? {
                            value: currentField?.value.padStart(6, "0")?.padEnd(20, " "),
                            ignoreUpdate: true,
                            isFieldFocused: false,
                          }
                          : {
                            value: "",
                            isFieldFocused: true,
                            ignoreUpdate: true,
                          },
                    };
                  }
                }
               
              },
              runValidationOnDependentFieldsChange: false,
              runPostValidationHookAlways: true,
              FormatProps: {
                isAllowed: (values) => {
                  //@ts-ignore
                  if (values?.value?.length > 20) {
                    return false;
                  }
                  return true;
                },
              },
              fullWidth: true,
              GridProps: { xs: 6, sm: 6, md: 2, lg: 2, xl: 2},
            },
      
          },
          {
            render: {
              componentType: "amountField",
            },
            name: "SI_AMOUNT",
            label: "SIAmount",
            placeholder: "",
            type: "text",
            dependentFields: ["DR_ACCT_TYPE", "DR_ACCT_CD", "DEF_TRAN_CD", "BRANCH_CD", "COMP_CD"],
            fullWidth:true,
            FormatProps: {
              allowNegative: false,
            },
            postValidationSetCrossFieldValues: async (
              currentField,
              formState,
              authState,
              dependentFieldValues
            ) => {
              // if(formState.isButtonClick !== "N")
              // {
                if (formState?.isSubmitting) return {};
      
                const reqParameters = {
                  COMP_CD: dependentFieldValues?.["COMP_CD"]?.value,
                  BRANCH_CD: dependentFieldValues?.["BRANCH_CD"]?.value,
                  ACCT_TYPE: dependentFieldValues?.["DR_ACCT_TYPE"]?.value,
                  ACCT_CD: dependentFieldValues?.["DR_ACCT_CD"]?.value,
                  AMOUNT: currentField?.value,
                  DEF_TRAN_CD: dependentFieldValues?.["DEF_TRAN_CD"]?.value,
                  DOC_CD: formState?.docCd ?? "",
                };
                const postData = await API.getSiCharge(reqParameters);
                return {
                  
                  SI_CHARGE: {
                    value:postData
                        ? postData[0]?.SI_CHARGE ?? ""
                        : "",
                    ignoreUpdate: true,
                  },
                // };
              
              }
            
            },
            GridProps: { xs: 6, sm: 6,md: 2, lg: 2, xl:2 },
            runPostValidationHookAlways: false,
            runValidationOnDependentFieldsChange: false,
            AlwaysRunPostValidationSetCrossFieldValues: {
              alwaysRun: true,
              touchAndValidate: false,
            },
      
          },
          {
            render: {
              componentType: "amountField",
            },
            name: "SI_CHARGE",
            label: "SICharge",
            type: "text",
            fullWidth: true,
            GridProps: {xs: 6, sm: 6, md: 3, lg: 3, xl: 3},
          },
          {
            render: {
              componentType: "textField",
            },
            name: "REMARKS",
            label: "Remark",
            fullWidth:true,
            placeholder: "",
            type: "text",
            GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3},
          },
          {
            render: {
              componentType: "formbutton"
            },
            name: "populate",
            label: "Populate",
            placeholder: "",
            GridProps: {xs: 3, sm: 3, md: 1, lg: 1, xl: 1,},
            dependentFields: ["SI_EXECUTE_FLG"],
            shouldExclude(fieldData, dependentFields, formState) {
              if (dependentFields?.SI_EXECUTE_FLG?.value === "N") {
                return false;
              } else {
                return true;
              }
            },
          },
          {
            render: {
              componentType: "hidden",
            },
            name: "DEF_TRAN_CD",
            label:"HIDDEN FLAG"
          },   
          {
            render: {
              componentType: "hidden",
            },
            name: "COMP_CD",
            label:"HIDDEN FLAG"
          },   

          
        ],
}



export const siasExecute = {
  form: {
    name: "Consider SI as Executed",
    label: "ConsiderSIasExecuted",
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
      select: {
        fullWidth: true,
      },
      textField: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: { componentType: "_accountNumber" },
      branchCodeMetadata: {
        label: "EnterDebitBranchCode",
        name: "BRANCH_CD",
        __VIEW__: { isReadOnly: true },
        GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
      },
      accountTypeMetadata: {
        label: "EnterDebitAccountType",
        name: "ACCT_TYPE",
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: formState?.docCd ?? "",
          });

        },
        _optionsKey: "Debit_acct_type",
        GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
      },
      accountCodeMetadata: {
        label: "EnterDebitAccountNo",
        name: "ACCT_CD",
        autoComplete: "off",
        maxLength: 20,
        dependentFields: ["ACCT_TYPE", "BRANCH_CD"],
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};

          const reqParameters = {
            BRANCH_CD: dependentFieldValues?.BRANCH_CD?.value,
            COMP_CD: authState?.companyID,
            ACCT_TYPE: dependentFieldValues?.ACCT_TYPE?.value,
            ACCT_CD: utilFunction.getPadAccountNumber(
              currentField?.value,
              dependentFieldValues?.ACCT_TYPE?.optionData
            ),
            SCREEN_REF: "TRN/394",
          };

          if (

            dependentFieldValues?.BRANCH_CD?.value &&
            dependentFieldValues?.ACCT_TYPE?.value
          ) {
            const postData = await GeneralAPI.getAccNoValidation(reqParameters);
           
           
            let btn99, returnVal;

            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };

            for (let i = 0; i < postData.MSG.length; i++) {
         
              if (postData.MSG[i]?.O_STATUS === "999") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: t("ValidationFailed"),
                  message: postData.MSG[i]?.O_MESSAGE,
                });
                returnVal = "";
              } else if (postData.MSG[i]?.O_STATUS === "99") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: t("Confirmation"),
                  message: postData[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                });
                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData.MSG[i]?.O_STATUS === "9") {
                if (btn99 !== "No") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: t("Alert"),
                    message: postData.MSG[i]?.O_MESSAGE,
                  });
                }
                returnVal = postData[i];
              } else if (postData.MSG[i]?.O_STATUS === "0") {
                if (btn99 !== "No") {
                  returnVal = postData[i];
                } else {
                  returnVal = "";
                }
              }
            }
            btn99 = 0;
    
            return {
              ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldValues?.ACCT_TYPE?.optionData
                      ),
                      ignoreUpdate: true,
                      isFieldFocused: false,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
              ACCT_NM: { value: postData.ACCT_NM || "" },
            };
          }
        },
        AlwaysRunPostValidationSetCrossFieldValues: {
          alwaysRun: true,
          touchAndValidate: false,
        },
        runPostValidationHookAlways: true,
        FormatProps: {
          isAllowed: (values) => {
            //@ts-ignore
            if (values?.value?.length > 20) {
              return false;
            }
            return true;
          },
        },
        fullWidth: true,
        GridProps: { xs: 12, sm: 6, md: 3, lg: 2, xl: 2 },
      },

    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "DebitAccountHolderName",
      isReadOnly: true,
      placeholder: "AccountName",
      type: "text",
      GridProps: {
        xs: 12,
        sm: 6,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },
  ],
};


export const AddSubDataMetaData = {
  form: {
    name: "Standing Instruction Entry",
    label: "",
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
      select: {
        fullWidth: true,
      },
      textField: {
        fullWidth: true,
      },
      datePicker: {
        fullWidth: true,
      },
      numberFormat: {
        fullWidth: true,
      },
      _accountNumber: {
        fullWidth: true,
      },
      arrayField: {
        fullWidth: true,
      },
      amountField: {
        fullWidth: true,
      }
    },
  },
  fields: [
    {
      render: { componentType: "_accountNumber" },
      branchCodeMetadata: {
        label: "CreditBranchCode",
        name: "CR_BRANCH_CD",
        __VIEW__: { isReadOnly: true },
        GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
      },
      accountTypeMetadata: {
        label: "CreditAcctType",
        name: "CR_ACCT_TYPE",
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "SICRTYPE",
          });

        },
        _optionsKey: "credit_acct_type",
        GridProps: { xs: 12, sm: 6,md: 2, lg: 2, xl: 2 },
      },
      accountCodeMetadata: {
        label: "CreditAcctNo",
        name: "CR_ACCT_CD",
        autoComplete: "off",
        maxLength: 20,
        dependentFields: ["DR_ACCT_CD", "DR_ACCT_TYPE", "DR_BRANCH_CD","CR_ACCT_TYPE", "CR_BRANCH_CD","EXECUTE_DAY","DEF_TRAN_CD",],
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};

          const reqData = {
            
            BRANCH_CD: authState.user.branchCode,
            COMP_CD: authState?.companyID,
            CR_ACCT_CD: utilFunction.getPadAccountNumber(
              currentField?.value,
              dependentFieldValues?.CR_ACCT_TYPE?.optionData
            ),
            CR_BRANCH_CD:dependentFieldValues?.CR_BRANCH_CD?.value,
            CR_ACCT_TYPE:dependentFieldValues?.CR_ACCT_TYPE?.value,
            EXECUTE_DAY:dependentFieldValues?.EXECUTE_DAY?.value,
            DR_ACCT_CD:dependentFieldValues?.DR_ACCT_CD?.value,
            DR_ACCT_TYPE:dependentFieldValues?.DR_ACCT_TYPE?.value,
            DEF_TRAN_CD:dependentFieldValues?.["DEF_TRAN_CD"]?.value,
            SCREEN_REF: "TRN/394",
          };

          if (

            dependentFieldValues?.CR_BRANCH_CD?.value &&
            dependentFieldValues?.CR_ACCT_TYPE?.value
          ) {
            const postData = await API.getCreditAccountvalidation({reqData});

            let btn99, returnVal;

            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };

            for (let i = 0; i < postData.length; i++) {
         
              if (postData[i]?.O_STATUS === "999") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: t("ValidationFailed"),
                  message: postData[i]?.O_MESSAGE,
                });
                returnVal = "";
              } else if (postData[i]?.O_STATUS === "99") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: t("Confirmation"),
                  message: postData[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                });
                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData[i]?.O_STATUS === "9") {
                if (btn99 !== "No") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: t("Alert"),
                    message: postData[i]?.O_MESSAGE,
                  });
                }
                returnVal = "";
              } else if (postData[i]?.O_STATUS === "0") {
                if (btn99 !== "No") {
                  returnVal = postData[i];
                } else {
                  returnVal = "";
                }
              }
            }
            btn99 = 0;
            return {
              CR_ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldValues?.CR_ACCT_TYPE?.optionData
                      ),
                      ignoreUpdate: true,
                      isFieldFocused: false,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
                    SI_AMOUNT: {
                      value: returnVal?.SI_AMOUNT ?? "",
                    },
                    SI_CHARGE:{
                      value: returnVal?.SI_CHARGE ?? "",
                    },
                    FEQ_VALUE:{
                      value: returnVal?.FEQ_VALUE ?? "",
                    },
                    EXECUTE_DAY:{
                      value: returnVal?.EXECUTE_DAY ?? "",
                    },
                    FEQ_TYPE:{
                      value: returnVal?.FEQ_TYPE ?? "",
                    },
                    SI_AMOUNT_PROTECT:{
                      value: returnVal?.SI_AMOUNT_PROTECT ?? "",
                    },
                    FLAG_ENABLE_DISABLE:{
                      value: returnVal?.FLAG_ENABLE_DISABLE ?? "",
                    },
          }
          }
        },

        runPostValidationHookAlways: false,
          AlwaysRunPostValidationSetCrossFieldValues: {
                      alwaysRun: true,
                      touchAndValidate: true,
                    },
        FormatProps: {
          isAllowed: (values) => {
            //@ts-ignore
            if (values?.value?.length > 20) {
              return false;
            }
            return true;
          },
        },
        fullWidth: true,
        GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
      },

    },
    {
      render: {
          componentType: "datePicker",
      },
      name: "START_DT",
      label: "StartDate",
      defaultValue: new Date(),
      fullWidth: true,
      format: "dd/MM/yyyy",
      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["StartDateisrequired."] },
        ],
      },
      validate: (fieldValue,dependentFields) => {
        if (format(fieldValue.value, "dd/MM/yyyy") < format(new Date(), "dd/MM/yyyy")) {
              return "CompareDate";
            }
        }

  },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "EXECUTE_DAY",
      label: "ExecuteOnDay",
      placeholder: "EnterExecuteOnDay",
      type: "text",
      fullWidth: true,
      required: true,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: false,
      },
      validate: (fieldValue) => {
        if (fieldValue.value < 1 || fieldValue.value > 29) {
          return t("EexecuteValidation");
        }
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: [t("ExecuteOnDayisRequired")] }],
      },
      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "FEQ_TYPE",
      label: "FrequncyType",
      placeholder: "EnterFrequncyType",
      type: "text",
      options: [
        { label: "Day(s)", value: "D" },
        { label: "Month(s)", value: "M" },
        { label: "Quartely", value: "Q" },
        { label: "Half Yearly", value: "H" },
        { label: "Year(s)", value: "Y" },
      ],
      required: true,
      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: [t("FrequencyTypeisRequired")] }],
      },
    },

    {
      render: {
        componentType: "numberFormat",
      },
      name: "FEQ_VALUE",
      label: "FrequencyValue",
      placeholder: "EnterFrequncyValue",
      type: "text",
      fullWidth: true,
      required: true,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: false,
        isAllowed: (values) => {
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: [t("FrequencyValueisRequired")] }],
      },
      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
    },
    {
      render: { componentType: "_accountNumber" },
      branchCodeMetadata: {
        label: "DebitBranchCode",
        name: "BRANCH_CD",
        __VIEW__: { isReadOnly: true },
        GridProps: { xs: 12, sm: 6,md: 2, lg: 2, xl: 2 },
      },
      accountTypeMetadata: {
        label: "DebitAcctType",
        name: "DR_ACCT_TYPE",
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "SIDRTYPE",
          });

        },
        _optionsKey: "debit_acct_type",
        GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
      },
      accountCodeMetadata: {
        label: "DebitAcctNo",
        name: "DR_ACCT_CD",
        autoComplete: "off",
        maxLength: 20,
        dependentFields: ["DR_ACCT_TYPE", "BRANCH_CD", "CR_ACCT_CD", "DEF_TRAN_CD","CR_ACCT_TYPE", "CR_BRANCH_CD","EXECUTE_DAY"],
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (
            currentField.value &&
            dependentFieldValues?.BRANCH_CD?.value &&
            dependentFieldValues?.DR_ACCT_TYPE?.value
          ) {
            const reqData = {
              BRANCH_CD: authState.user.branchCode,
              COMP_CD: authState?.companyID,
              ACCT_TYPE: dependentFieldValues?.CR_ACCT_TYPE?.value,
              ACCT_CD: dependentFieldValues?.CR_ACCT_CD.value,
              DR_BRANCH_CD:dependentFieldValues?.BRANCH_CD?.value,
              DR_ACCT_TYPE:dependentFieldValues?.DR_ACCT_TYPE?.value,
              DR_ACCT_CD:utilFunction.getPadAccountNumber(
                currentField?.value,
                dependentFieldValues?.DR_ACCT_TYPE?.optionData
              ),
              DEF_TRAN_CD:dependentFieldValues?.["DEF_TRAN_CD"]?.value,
              EXECUTE_DAY:dependentFieldValues?.["EXECUTE_DAY"]?.value,
              SCREEN_REF:"TRN/394"
            };
            const postData = await API.getDebitAccountvalidation({reqData});
            let btn99, returnVal;

            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };

            for (let i = 0; i < postData.length; i++) {
             
              if (postData[i]?.O_STATUS === "999") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: t("ValidationFailed"),
                  message: postData[i]?.O_MESSAGE,
                });
                returnVal = "";
              } else if (postData[i]?.O_STATUS === "99") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: t("Confirmation"),
                  message: postData[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                });
                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData[i]?.O_STATUS === "9") {
                if (btn99 !== "No") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: t("Alert"),
                    message: postData[i]?.O_MESSAGE,
                  });
                }
                returnVal = "";
              } else if (postData[i]?.O_STATUS === "0") {
                if (btn99 !== "No") {
                  returnVal = postData[i];
                } else {
                  returnVal = "";
                }
              }
            }
            btn99 = 0;
            return {
              DR_ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldValues?.DR_ACCT_TYPE?.optionData
                      ),
                      ignoreUpdate: true,
                      isFieldFocused: false,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },

          }
          }
        },
        AlwaysRunPostValidationSetCrossFieldValues: {
          alwaysRun: true,
          touchAndValidate: false,
        },
        runPostValidationHookAlways: false,
        FormatProps: {
          isAllowed: (values) => {
            //@ts-ignore
            if (values?.value?.length > 20) {
              return false;
            }
            return true;
          },
        },
        fullWidth: true,
        GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
      },

    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SI_AMOUNT",
      label: "SIAmount",
      placeholder: "",
      type: "text",
      dependentFields: ["DR_ACCT_TYPE", "DR_ACCT_CD", "DEF_TRAN_CD", "BRANCH_CD", "COMP_CD","SI_AMOUNT_PROTECT"],

      FormatProps: {
        allowNegative: false,
      },
       isReadOnly: (fieldValue, dependentFields, formState) => {
        if(dependentFields.SI_AMOUNT_PROTECT.value === "Y")
          {
            return true;
          }
       },
    
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFieldValues
      ) => {
        if (
          currentField.value &&
          dependentFieldValues?.BRANCH_CD?.value &&
          dependentFieldValues?.DR_ACCT_TYPE?.value
        ) {
        if (formState?.isSubmitting) return {};
        
        const reqParameters = {
          COMP_CD: dependentFieldValues?.["COMP_CD"]?.value,
          BRANCH_CD: dependentFieldValues?.["BRANCH_CD"]?.value,
          ACCT_TYPE: dependentFieldValues?.["DR_ACCT_TYPE"]?.value,
          ACCT_CD: dependentFieldValues?.["DR_ACCT_CD"]?.value,
          AMOUNT: currentField?.value,
          DEF_TRAN_CD: dependentFieldValues?.["DEF_TRAN_CD"]?.value,
          DOC_CD: formState?.docCd ?? "",
        };
        const postData = await API.getSiCharge(reqParameters);      
        return {
          
          SI_CHARGE: {
            value:postData
                ? postData[0]?.SI_CHARGE ?? ""
                : "",
            ignoreUpdate: true,
          },
        };
        };
      },
      required: true,
      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: [t("SIAmountisRequired")] }],
      },

    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SI_CHARGE",
      label: "SICharge",
      type: "text",
      FormatProps: {
        allowNegative: false,
      },
      fullWidth: true,
      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
      dependentFields:["FLAG_ENABLE_DISABLE"],
      isReadOnly: (fieldValue, dependentFields, formState) => {
        if(dependentFields.FLAG_ENABLE_DISABLE.value === "Y")
          {
          return true
          }
       },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "DEF_TRAN_CD",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "SI_AMOUNT_PROTECT",
      label: "Si_amount_protext"
      
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "FLAG_ENABLE_DISABLE",
      label: "FLAG_ENABLE_DISABLE"
      
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "COMP_CD",
      label: "compnay cd"
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      label: "Remark",
      placeholder: "EnterRemark",
      type: "text",
      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
          componentType: "datePicker",
      },
      name: "VALID_UPTO",
      label: "ValidUpTo",
      placeholder: "",
      fullWidth: true,
      format: "dd/MM/yyyy",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: [t("ValidUptoDateisrequired.")] },
        ],
      },
      dependentFields: ["START_DT"],
      validate: (currentField, dependentField) => {
          if (
              new Date(currentField?.value) <=
              new Date(dependentField?.START_DT?.value)
          ) {
              return t("StartDateValidDateCompare");
          }
          return "";
      },
      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
  },
  ],
}


export const EditSubDataMetaData = {
  form: {
    name: "",
    label: "",
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
      select: {
        fullWidth: true,
      },
      textField: {
        fullWidth: true,
      },
      datePicker: {
        fullWidth: true,
      },
      numberFormat: {
        fullWidth: true,
      },
      _accountNumber: {
        fullWidth: true,
      },
      arrayField: {
        fullWidth: true,
      },
      amountField: {
        fullWidth: true,
      }
    },
  },
  fields: [
    {
      render: { componentType: "_accountNumber" },
      branchCodeMetadata: {
        label: "CreditBranchCode",
        name: "CR_BRANCH_CD",
        __VIEW__: { isReadOnly: true },
        GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
        isReadOnly: true,        
      },
      accountTypeMetadata: {
        label: "CreditAcctType",
        name: "CR_ACCT_TYPE",
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "SICRTYPE",
          });

        },
        _optionsKey: "credit_acct_type",
        GridProps: { xs: 12, sm: 6,md: 2, lg: 2, xl: 2 },
       isReadOnly: true , 
      },
      accountCodeMetadata: {
        label: "CreditAcctNo",
        name: "CR_ACCT_CD",
        autoComplete: "off",
        maxLength: 20,
        isReadOnly: true , 
        dependentFields: ["DR_ACCT_CD", "DR_ACCT_TYPE", "DR_BRANCH_CD","CR_ACCT_TYPE", "CR_BRANCH_CD","EXECUTE_DAY","DEF_TRAN_CD",],
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};

          const reqData = {
            
            BRANCH_CD: authState.user.branchCode,
            COMP_CD: authState?.companyID,
            CR_ACCT_CD: utilFunction.getPadAccountNumber(
              currentField?.value,
              dependentFieldValues?.CR_ACCT_TYPE?.optionData
            ),
            CR_BRANCH_CD:dependentFieldValues?.CR_BRANCH_CD?.value,
            CR_ACCT_TYPE:dependentFieldValues?.CR_ACCT_TYPE?.value,
            EXECUTE_DAY:dependentFieldValues?.EXECUTE_DAY?.value,
            DR_ACCT_CD:dependentFieldValues?.DR_ACCT_CD?.value,
            DR_ACCT_TYPE:dependentFieldValues?.DR_ACCT_TYPE?.value,
            DEF_TRAN_CD:dependentFieldValues?.["DEF_TRAN_CD"]?.value,
            SCREEN_REF: "TRN/394",
          };

          if (

            dependentFieldValues?.CR_BRANCH_CD?.value &&
            dependentFieldValues?.CR_ACCT_TYPE?.value
          ) {
            const postData = await API.getCreditAccountvalidation({reqData});

            let btn99, returnVal;

            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };

            for (let i = 0; i < postData.length; i++) {
         
              if (postData[i]?.O_STATUS === "999") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: t("ValidationFailed"),
                  message: postData[i]?.O_MESSAGE,
                });
                returnVal = "";
              } else if (postData[i]?.O_STATUS === "99") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: t("Confirmation"),
                  message: postData[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                });
                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData[i]?.O_STATUS === "9") {
                if (btn99 !== "No") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: t("Alert"),
                    message: postData[i]?.O_MESSAGE,
                  });
                }
                returnVal = "";
              } else if (postData[i]?.O_STATUS === "0") {
                if (btn99 !== "No") {
                  returnVal = postData[i];
                } else {
                  returnVal = "";
                }
              }
            }
            btn99 = 0;
            return {
              CR_ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldValues?.CR_ACCT_TYPE?.optionData
                      ),
                      ignoreUpdate: true,
                      isFieldFocused: false,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },
                    SI_AMOUNT: {
                      value: returnVal?.SI_AMOUNT ?? "",
                    },
                    SI_CHARGE:{
                      value: returnVal?.SI_CHARGE ?? "",
                    },
                    FEQ_VALUE:{
                      value: returnVal?.FEQ_VALUE ?? "",
                    },
                    EXECUTE_DAY:{
                      value: returnVal?.EXECUTE_DAY ?? "",
                    },
                    FEQ_TYPE:{
                      value: returnVal?.FEQ_TYPE ?? "",
                    },
                    SI_AMOUNT_PROTECT:{
                      value: returnVal?.SI_AMOUNT_PROTECT ?? "",
                    },
                    FLAG_ENABLE_DISABLE:{
                      value: returnVal?.FLAG_ENABLE_DISABLE ?? "",
                    },
          }
          }
        },

        runPostValidationHookAlways: false,
          AlwaysRunPostValidationSetCrossFieldValues: {
                      alwaysRun: true,
                      touchAndValidate: true,
                    },
        FormatProps: {
          isAllowed: (values) => {
            //@ts-ignore
            if (values?.value?.length > 20) {
              return false;
            }
            return true;
          },
        },
        fullWidth: true,
        GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
      },

    },
    {
      render: {
          componentType: "datePicker",
      },
      name: "START_DT",
      label: "StartDate",
      fullWidth: true,
      format: "dd/MM/yyyy",
      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
      required: true,
       isReadOnly: true, 
  },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "EXECUTE_DAY",
      label: "ExecuteOnDay",
      placeholder: "EnterExecuteOnDay",
      type: "text",
      fullWidth: true,
      required: true,
     isReadOnly: true, 
      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
    },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "FEQ_TYPE",
      label: "FrequncyType",
      placeholder: "EnterFrequncyType",
      type: "text",
      options: [
        { label: "Day(s)", value: "D" },
        { label: "Month(s)", value: "M" },
        { label: "Quartely", value: "Q" },
        { label: "Half Yearly", value: "H" },
        { label: "Year(s)", value: "Y" },
      ],
      required: true,
      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
      isReadOnly: true, 
    },

    {
      render: {
        componentType: "numberFormat",
      },
      name: "FEQ_VALUE",
      label: "FrequencyValue",
      placeholder: "EnterFrequncyValue",
      type: "text",
      fullWidth: true,
      required: true,
     isReadOnly: true, 
      GridProps: { xs: 6, sm: 6, md: 2, lg: 2, xl: 2 },
    },
    {
      render: { componentType: "_accountNumber" },
      branchCodeMetadata: {
        label: "DebitBranchCode",
        name: "BRANCH_CD",
       isReadOnly: true, 
        GridProps: { xs: 12, sm: 6,md: 2, lg: 2, xl: 2 },
      },
      accountTypeMetadata: {
        label: "DebitAcctType",
        name: "DR_ACCT_TYPE",
        options: (dependentValue, formState, _, authState) => {
          return GeneralAPI.get_Account_Type({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
            USER_NAME: authState?.user?.id,
            DOC_CD: "SIDRTYPE",
          });

        },
        _optionsKey: "debit_acct_type",
        GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
       isReadOnly: true, 
      },
      accountCodeMetadata: {
        label: "DebitAcctNo",
        name: "DR_ACCT_CD",
        autoComplete: "off",
        maxLength: 20,
         isReadOnly: true , 
        dependentFields: ["DR_ACCT_TYPE", "BRANCH_CD", "CR_ACCT_CD", "DEF_TRAN_CD","CR_ACCT_TYPE", "CR_BRANCH_CD","EXECUTE_DAY"],
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};
          if (
            currentField.value &&
            dependentFieldValues?.BRANCH_CD?.value &&
            dependentFieldValues?.DR_ACCT_TYPE?.value
          ) {
            const reqData = {
              BRANCH_CD: authState.user.branchCode,
              COMP_CD: authState?.companyID,
              ACCT_TYPE: dependentFieldValues?.CR_ACCT_TYPE?.value,
              ACCT_CD: dependentFieldValues?.CR_ACCT_CD.value,
              DR_BRANCH_CD:dependentFieldValues?.BRANCH_CD?.value,
              DR_ACCT_TYPE:dependentFieldValues?.DR_ACCT_TYPE?.value,
              DR_ACCT_CD:utilFunction.getPadAccountNumber(
                currentField?.value,
                dependentFieldValues?.DR_ACCT_TYPE?.optionData
              ),
              DEF_TRAN_CD:dependentFieldValues?.["DEF_TRAN_CD"]?.value,
              EXECUTE_DAY:dependentFieldValues?.["EXECUTE_DAY"]?.value,
              SCREEN_REF:"TRN/394"
            };
            const postData = await API.getDebitAccountvalidation({reqData});
            let btn99, returnVal;

            const getButtonName = async (obj) => {
              let btnName = await formState.MessageBox(obj);
              return { btnName, obj };
            };

            for (let i = 0; i < postData.length; i++) {
             
              if (postData[i]?.O_STATUS === "999") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: t("ValidationFailed"),
                  message: postData[i]?.O_MESSAGE,
                });
                returnVal = "";
              } else if (postData[i]?.O_STATUS === "99") {
                const { btnName, obj } = await getButtonName({
                  messageTitle: t("Confirmation"),
                  message: postData[i]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                });
                btn99 = btnName;
                if (btnName === "No") {
                  returnVal = "";
                }
              } else if (postData[i]?.O_STATUS === "9") {
                if (btn99 !== "No") {
                  const { btnName, obj } = await getButtonName({
                    messageTitle: t("Alert"),
                    message: postData[i]?.O_MESSAGE,
                  });
                }
                returnVal = "";
              } else if (postData[i]?.O_STATUS === "0") {
                if (btn99 !== "No") {
                  returnVal = postData[i];
                } else {
                  returnVal = "";
                }
              }
            }
            btn99 = 0;
            return {
              DR_ACCT_CD:
                returnVal !== ""
                  ? {
                      value: utilFunction.getPadAccountNumber(
                        currentField?.value,
                        dependentFieldValues?.DR_ACCT_TYPE?.optionData
                      ),
                      ignoreUpdate: true,
                      isFieldFocused: false,
                    }
                  : {
                      value: "",
                      isFieldFocused: true,
                      ignoreUpdate: true,
                    },

          }
          }
        },
        AlwaysRunPostValidationSetCrossFieldValues: {
          alwaysRun: true,
          touchAndValidate: false,
        },
        runPostValidationHookAlways: false,
        FormatProps: {
          isAllowed: (values) => {
            //@ts-ignore
            if (values?.value?.length > 20) {
              return false;
            }
            return true;
          },
        },
        fullWidth: true,
        GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
      },

    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SI_AMOUNT",
      label: "SIAmount",
      placeholder: "",
      type: "text",
      FormatProps: {
        allowNegative: false,
      },
      isReadOnly: true, 
      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SI_CHARGE",
      label: "SICharge",
      type: "text",
      FormatProps: {
        allowNegative: false,
      },
      fullWidth: true,
      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
      dependentFields:["FLAG_ENABLE_DISABLE"],
      isReadOnly: true , 
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "DEF_TRAN_CD",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "SI_AMOUNT_PROTECT",
      label: "Si_amount_protext"
      
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "FLAG_ENABLE_DISABLE",
      label: "FLAG_ENABLE_DISABLE"
      
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "COMP_CD",
      label: "compnay cd"
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ORG",
      label: "ORG"
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "SI_COUNT",
      label: "ORG"
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      label: "Remark",
      placeholder: "EnterRemark",
      type: "text",
      isReadOnly:true,
      GridProps: { xs: 6, sm: 6, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
          componentType: "datePicker",
      },
      name: "VALID_UPTO",
      label: "ValidUpTo",
      placeholder: "",
      fullWidth: true,
      format: "dd/MM/yyyy",
      required: true,
      isReadOnly: true, 
      GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
  },
  {
    render: {
        componentType: "checkbox",
    },
    name: "DOC_STATUS",
    label: "Status",
    placeholder: "",
    fullWidth: true,
     dependentFields:["ORG","SI_COUNT"],
    shouldExclude: (initialValue, original, prevRows, nextRows) => {
     
      if (original?.SI_COUNT?.value > 0) {
        return false;
      }
      else {
        return true;
      }
    },
    isReadOnly: (fieldValue, dependentFields, formState) => {
      if(dependentFields.ORG.value !== "Y")
        {
          return true;
        }
     },
    GridProps: { xs: 12, sm: 6, md: 2, lg: 2, xl: 2 },
},
  ],
}