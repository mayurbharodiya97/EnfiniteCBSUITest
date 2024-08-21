import * as API from './api'
import { GeneralAPI } from 'registry/fns/functions';
import { format } from 'date-fns';
import { GridMetaDataType } from "components/dataTableStatic";
import { t } from 'i18next';

export const RecurringCalculatotMetaData = {
    form: {
      name: "recurringCalculator",
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
        },
        formbutton: {
          fullWidth: true,
        }
      },
    },
    fields: [
      {
        render: { componentType: "autocomplete" },
        name: "ACCT_TYPE",
        label: "AccountType",
        placeholder:"AccountType",
        options: (dependentValue, formState, _, authState) => GeneralAPI.get_Account_Type({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode, USER_NAME: authState?.user?.id,   DOC_CD: formState?.docCd ?? "",}),
        _optionsKey: "getaccttype",
        required: true,
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: [t("AccountTypeReqired")] },
          ],
        },
        GridProps: { xs: 6, sm: 4, md: 4, lg: 4, xl: 4 },
      },
      {
        render: { componentType: "autocomplete" },
        name: "CATEG_CD",
        label: "Category",
        placeholder:"Category",
        options: (dependentValue, formState, _, authState) => API.getCategoryType({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}),
        _optionsKey: "getcategory",
        GridProps: {  xs: 6, sm: 3, md: 4, lg: 4, xl: 4  },
        required: true,
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["Categoryisrequired"] },
          ],
        },
      },
      {
        render: {
            componentType: "datePicker",
        },
        name: "START_DT",
        label: "StartDate",
        fullWidth: true,
        GridProps: { xs: 6, sm: 4, md: 2, lg: 2, xl: 2 },
    },
    {
        render: {
          componentType: "autocomplete",
        },
        name: "DATA_VAL",
        label: "IntType",
        placeholder: "IntType",
        defaultValue:"1",
        isReadOnly:true,
        options: (dependentValue, formState, _, authState) => API.getIntType({ENT_COMP_CD: authState?.companyID, ENT_BRANCH_CD: authState?.user?.branchCode}),
        _optionsKey: "getIntType",
        GridProps: { xs: 6, sm: 4, md: 2, lg: 2, xl: 2 },
      },
      {
        render: { componentType: "autocomplete" },
        name: "INST_NO",
        label: "InstallmentType",
        placeholder:"InstallmentType",
        options: (dependentValue, formState, _, authState) => API.getInstallmentPeriodData({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}),
        _optionsKey: "getInstallPeriod",
        required: true,
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["InstallmentTypeisrequired"] },
          ],
        },
        dependentFields: ["START_DT","DATA_VAL"],
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};

          const reqParameters = {
            START_DATE: format(new Date(dependentFieldValues?.START_DT?.value), "dd/MMM/yyyy"),
            INSTALLMENT_TYPE: dependentFieldValues?.DATA_VAL?.value,
            INSTALLMENT : currentField?.value,
          };

          const postData = await API.getDueDate(reqParameters);
          return {
            DUE_DATE: {
              value:postData[0].DUE_DATE,
              isFieldFocused: true,
              ignoreUpdate: true,
            },
          };
        },
        GridProps: { xs: 6, sm: 4, md: 4, lg: 4, xl: 4 },
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "INSTALLMENT_TYPE",
        label: "Int Type.",
        dependentFields: ["INST_NO"],
        setValueOnDependentFieldsChange: (dependentFields) => {
          return dependentFields["INST_NO"]?.optionData?.[0]
            ?.INSTALLMENT_TYPE
        },
        GridProps: { xs: 6, sm: 4, md: 2, lg: 2, xl: 2 },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "INST_AMT",
        label: "InstAmount",
        type: "text",
        fullWidth: true,
        GridProps: {xs: 6, sm: 3, md: 2, lg: 2, xl: 2},
        dependentFields: ["ACCT_TYPE", "CATEG_CD", "START_DT", "PERIOD_NM","INST_AMT","INST_NO","INSTALLMENT_TYPE"],
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};

          const reqParameters = {
            ENT_COMP_CD: authState?.companyID,
            ENT_BRANCH_CD: authState?.user?.branchCode,
            ACCT_TYPE: dependentFieldValues?.ACCT_TYPE?.value.trim(),
            START_DT: format(new Date(dependentFieldValues?.START_DT?.value), "dd/MMM/yyyy"),
            CATAG_CD: dependentFieldValues?.CATEG_CD?.value.trim(),
            INSTALLMENT_TYPE: dependentFieldValues?.INSTALLMENT_TYPE?.value,
            INST_NO: dependentFieldValues?.INST_NO?.value,
            INST_AMT:currentField?.value,
          };

          const postData = await API.getIntRate(reqParameters);
          return {
            INT_RATE: {
              value:postData[0]?.INT_RATE,
              isFieldFocused: true,
              ignoreUpdate: true,
            },
          };
        },

      },
      {
        render: {
          componentType: "rateOfIntWithoutValidation",
        },
        name: "INT_RATE",
        label: "IntRate",
        type: "text",
        fullWidth: true,
        className: "textInputFromRight",
        GridProps: {xs: 4, sm: 4, md: 2, lg: 2, xl: 2},

      },
      {
        render: {
            componentType: "datePicker",
        },
        name: "DUE_DATE",
        label: "DueDate",
        fullWidth: true,
        isReadOnly:true,
        GridProps: { xs: 4, sm: 4, md: 2, lg: 2, xl: 2 },
    },
    {
        render: {
          componentType: "amountField",
        },
        name: "DUE_AMT",
        label: "DueAmount",
        placeholder: "DueAmount",
        isReadOnly:true,
        type: "text",
        GridProps: { xs: 4, sm: 3, md: 2, lg: 2, xl: 2 },
        runValidationOnDependentFieldsChange: false,
        dependentFields: ["INST_NO","DATA_VAL","INSTALLMENT_TYPE","INST_AMT","INT_RATE","START_DT","ENT_COMP_CD","ENT_BRANCH_CD"],
        setValueOnDependentFieldsChange: async (dependentFields) => {
          const reqParameters = {
            ENT_COMP_CD: dependentFields?.ENT_COMP_CD.value,
            ENT_BRANCH_CD: dependentFields?.ENT_BRANCH_CD.value,
            INT_TYPE: dependentFields?.DATA_VAL.value,
            INST_NO: dependentFields?.INST_NO.value,
            INST_TYPE: dependentFields?.INSTALLMENT_TYPE.value,
            INST_AMT: dependentFields?.INST_AMT.value,
            INT_RATE: dependentFields?.INT_RATE.value,
            START_DT: format(new Date(dependentFields?.START_DT.value), "dd/MMM/yyyy"),
            SCREEN_REF: "TRN/502"
          };
         
            const postData = await API.getRecurringCalculateData(reqParameters);
            return  postData[0]?.DUE_AMT
           
        },
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "ENT_COMP_CD",
        label: "",
        type: "text",
        GridProps: { xs: 6, sm: 3, md: 2, lg: 2, xl: 2 },
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "ENT_BRANCH_CD",
        label: "",
        type: "text",
        GridProps: { xs: 6, sm: 3, md: 2, lg: 2, xl: 2 },
      },
    ],
  };

  export const RecurringGridMetaData: GridMetaDataType = {
    gridConfig: {
      dense: true,
      gridLabel: "",
      rowIdColumn: "INST_DT",
      defaultColumnConfig: {
        width: 200,
        maxWidth: 450,
        minWidth: 100,
      },
      allowColumnReordering: true,
      disableSorting: false,
      hideHeader: false,
      disableGroupBy: true,
      disableGlobalFilter:true,
      enablePagination: false,
      defaultPageSize: 20,
      containerHeight: {
        min: "35vh",
        max: "35vh",
      },
      allowFilter: false,
      allowColumnHiding: false,
      allowRowSelection: false,
      isCusrsorFocused: true,
    },
    columns: [
      {
        accessor: "SR_NO",
        columnName: "SrNo",
        sequence: 2,
        isAutoSequence:true,
        alignment: "left",
        componentType: "default",
        width: 80,
        minWidth: 50,
        maxWidth: 100,
      },
      {
        accessor: "INST_DT",
        columnName: "Period",
        sequence: 4,
        alignment: "center",
        componentType: "date",
        width: 100,
        minWidth: 80,
        maxWidth: 120,
      },
      {
        accessor: "INST_AMT",
        columnName: "InstallmentAmount",
        sequence: 4,
        alignment: "right",
        componentType: "currency",
        width: 150,
        minWidth: 100,
        maxWidth: 180,
        isDisplayTotal:true,
        FormatProps: {
        decimalScale: 2,
        fixedDecimalScale: true,
        }
        
      },
      {
        accessor: "BALANCE_AMT",
        columnName: "Balance",
        sequence: 4,
        alignment: "right",
        componentType: "currency",
        width: 150,
        minWidth: 100,
        maxWidth: 180,
        isDisplayTotal:true,
        FormatProps: {
          decimalScale: 2,
          fixedDecimalScale: true,
          }
      },
      {
        accessor: "MONTH_INT",
        columnName: "InterestAmount",
        sequence: 4,
        alignment: "right",
        componentType: "currency",
        width: 200,
        minWidth: 100,
        maxWidth: 300,
        isDisplayTotal:true,
        FormatProps: {
          decimalScale: 2,
          fixedDecimalScale: true,
          }
      },
      {
        accessor: "CUM_INT",
        columnName: "RunningIntAmt",
        sequence: 4,
        alignment: "right",
        componentType: "currency",
        width: 150,
        minWidth: 100,
        maxWidth: 180,
      },
      
    ],
  };
  

//     form: {
//       name: "Si Detail View",
//       label: "SI Execute Detail View",
//       resetFieldOnUnmount: false,
//       validationRun: "onBlur",
//       render: {
//         ordering: "auto",
//         renderType: "simple",
//         gridConfig: {
//           item: {
//             xs: 12,
//             sm: 4,
//             md: 4,
//           },
//           container: {
//             direction: "row",
//             spacing: 1,
//           },
//         },
//       },
//     },
//     fields: [
//       {
//         render: {
//           componentType: "datePicker",
//         },
//         name: "EXECUTE_DT",
//         label: "Execute Date",
//         type: "text",
//         isReadOnly:true,
//         fullWidth: true,
//         GridProps: { xs: 6, sm: 6, md: 2, lg: 2, xl: 2},
//       },
//       {
//         render: {
//           componentType: "datePicker",
//         },
//         name: "PROCESS_DT",
//         label: "Process Date",
//         type: "text",
//         fullWidth: true,
//         isReadOnly:true,
//         GridProps: {  xs: 6, sm: 6, md: 2, lg: 2, xl: 2 },
//       },
//       {
//         render: {
//           componentType: "textField",
//         },
//         name: "SI_EXECUTE_FLG_DIS",
//         label: "SI Execute Process",
//         type: "text",
//         fullWidth: true,
//         isReadOnly:true,
//         GridProps: { xs: 6, sm: 6,md: 2, lg: 2, xl: 2},
//       },
//       {
//         render: {
//           componentType: "hidden",
//         },
//         name: "SI_EXECUTE_FLG",
//         label: "SI Execute FLAG"
//       },
//       {
//         render: {
//           componentType: "textField",
//         },
//         name: "REASON",
//         label: "Reason",
//         type: "text",
//         fullWidth: true,
//         isReadOnly:true,
//         GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
//       },
//       {
//         render: { 
          
//           componentType: "_accountNumber" },
//           name:"data",
//         branchCodeMetadata: {
//           label: "Debit Branch Code",
//           name: "BRANCH_CD",
//           __VIEW__: { isReadOnly: true },
//           GridProps: { xs: 6, sm: 6,md: 3, lg: 3, xl: 3},
//         },
//         accountTypeMetadata: {
//           label: "Debit Account Type",
//           name: "DR_ACCT_TYPE",
//           options: (dependentValue, formState, _, authState) => {
//             return GeneralAPI.get_Account_Type({
//               COMP_CD: authState?.companyID,
//               BRANCH_CD: authState?.user?.branchCode,
//               USER_NAME: authState?.user?.id,
//               DOC_CD: "SIDRTYPE",
//             });
  
//           },
//           _optionsKey: "debit_acct_type",
//           GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3},
//         },
//         accountCodeMetadata: {
//           label: "Debit Account No.",
//           name: "DR_ACCT_CD",
//           autoComplete: "off",
//           maxLength: 20,
//           dependentFields: ["DR_ACCT_TYPE", "BRANCH_CD", "CR_ACCT_CD", "CR_ACCT_TYPE", "CR_BRANCH_CD", "ENT_BRANCH_CD", "ENT_COMP_CD"],
//           postValidationSetCrossFieldValues: async (
//             currentField,
//             formState,
//             authState,
//             dependentFieldValues
//           ) => {
//             if (formState?.isSubmitting) return {};
  
//             const reqParameters = {
//               BRANCH_CD: dependentFieldValues?.BRANCH_CD?.value,
//               COMP_CD: authState?.companyID,
//               ACCT_TYPE: dependentFieldValues?.DR_ACCT_TYPE?.value,
//               ACCT_CD: utilFunction.getPadAccountNumber(
//                 currentField?.value,
//                 dependentFieldValues?.DR_ACCT_TYPE?.optionData
//               ),
//               SCREEN_REF: "TRN/394",
//             };
  
//             if (
  
//               dependentFieldValues?.BRANCH_CD?.value &&
//               dependentFieldValues?.DR_ACCT_TYPE?.value
//             ) {
//               const postData = await GeneralAPI.getAccNoValidation(reqParameters);
    
//               let btn99, returnVal;

//               const getButtonName = async (obj) => {
//                 let btnName = await formState.MessageBox(obj);
//                 return { btnName, obj };
//               };
  
//               for (let i = 0; i < postData.MSG.length; i++) {
           
//                 if (postData.MSG[i]?.O_STATUS === "999") {
//                   const { btnName, obj } = await getButtonName({
//                     messageTitle: "ValidationFailed",
//                     message: postData.MSG[i]?.O_MESSAGE,
//                   });
//                   returnVal = "";
//                 } else if (postData.MSG[i]?.O_STATUS === "99") {
//                   const { btnName, obj } = await getButtonName({
//                     messageTitle: "Confirmation",
//                     message: postData[i]?.O_MESSAGE,
//                     buttonNames: ["Yes", "No"],
//                   });
//                   btn99 = btnName;
//                   if (btnName === "No") {
//                     returnVal = "";
//                   }
//                 } else if (postData.MSG[i]?.O_STATUS === "9") {
//                   if (btn99 !== "No") {
//                     const { btnName, obj } = await getButtonName({
//                       messageTitle: "Alert",
//                       message: postData.MSG[i]?.O_MESSAGE,
//                     });
//                   }
//                   returnVal = postData[i];
//                 } else if (postData.MSG[i]?.O_STATUS === "0") {
//                   if (btn99 !== "No") {
//                     returnVal = postData[i];
//                   } else {
//                     returnVal = "";
//                   }
//                 }
//               }
//               btn99 = 0;
  
//               if (dependentFieldValues?.["CR_ACCT_CD"]?.value === utilFunction.getPadAccountNumber(
//                 currentField?.value,
//                 dependentFieldValues?.DR_ACCT_CD?.optionData
//               )
//               ) {
//                 await formState.MessageBox({
//                   messageTitle: "ValidationFailed",
//                   message: "Please enter another A/C No",
//                   buttonNames: ["OK"],
//                 });
//                 return {
//                   DR_ACCT_CD: { value: "" },
//                 };
//               }
//               return {
//                 DR_ACCT_CD:
//                   postData[0] !== ""
//                     ? {
//                       value: currentField?.value.padStart(6, "0")?.padEnd(20, " "),
//                       ignoreUpdate: true,
//                       isFieldFocused: false,
//                     }
//                     : {
//                       value: "",
//                       isFieldFocused: true,
//                       ignoreUpdate: true,
//                     },
//               };
//             }
//           },
  
//           // runPostValidationHookAlways: true,
//           FormatProps: {
//             isAllowed: (values) => {
//               //@ts-ignore
//               if (values?.value?.length > 20) {
//                 return false;
//               }
//               return true;
//             },
//           },
//           fullWidth: true,
//           GridProps: { xs: 6, sm: 6, md: 3, lg: 2, xl: 2 },
//         },
  
//       },
//       {
//         render: { componentType: "_accountNumber" },
//         name:"data",
//         branchCodeMetadata: {
//           label: "Credit Branch Code",
//           name: "CR_BRANCH_CD",
//           isReadOnly:true,
//           __EDIT__: { isReadOnly: true },
//           GridProps: { xs: 6, sm: 6,md: 3, lg: 3, xl: 3 },
//         },
//         accountTypeMetadata: {
//           label: "Credit Account Type",
//           isReadOnly:true,
//           name: "CR_ACCT_TYPE",
//           options: (dependentValue, formState, _, authState) => {
//             return GeneralAPI.get_Account_Type({
//               COMP_CD: authState?.companyID,
//               BRANCH_CD: authState?.user?.branchCode,
//               USER_NAME: authState?.user?.id,
//               DOC_CD: "SICRTYPE",
//             });
  
//           },
//           _optionsKey: "credit_acct_type",
//           GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
//         },
//         accountCodeMetadata: {
//           label: "Credit Account No.",
//           name: "CR_ACCT_CD",
//           autoComplete: "off",
//           maxLength: 20,
//           isReadOnly:true,
//           dependentFields: ["ENT_BRANCH_CD", "ENT_COMP_CD", "CR_ACCT_CD", "CR_ACCT_TYPE", "CR_BRANCH_CD"],
//           postValidationSetCrossFieldValues: async (
//             currentField,
//             formState,
//             authState,
//             dependentFieldValues
//           ) => {
//             if (formState?.isSubmitting) return {};
  
//             const reqParameters = {
//               BRANCH_CD: dependentFieldValues?.CR_BRANCH_CD?.value,
//               COMP_CD: authState?.companyID,
//               ACCT_TYPE: dependentFieldValues?.CR_ACCT_TYPE?.value,
//               ACCT_CD: utilFunction.getPadAccountNumber(
//                 currentField?.value,
//                 dependentFieldValues?.CR_ACCT_TYPE?.optionData
//               ),
//               SCREEN_REF: "TRN/394",
//             };
  
//             if (
  
//               dependentFieldValues?.CR_BRANCH_CD?.value &&
//               dependentFieldValues?.CR_ACCT_TYPE?.value
//             ) {
//               const postData = await GeneralAPI.getAccNoValidation(reqParameters);
    
//               let btn99, returnVal;

//               const getButtonName = async (obj) => {
//                 let btnName = await formState.MessageBox(obj);
//                 return { btnName, obj };
//               };
  
//               for (let i = 0; i < postData.MSG.length; i++) {
           
//                 if (postData.MSG[i]?.O_STATUS === "999") {
//                   const { btnName, obj } = await getButtonName({
//                     messageTitle: "ValidationFailed",
//                     message: postData.MSG[i]?.O_MESSAGE,
//                   });
//                   returnVal = "";
//                 } else if (postData.MSG[i]?.O_STATUS === "99") {
//                   const { btnName, obj } = await getButtonName({
//                     messageTitle: "Confirmation",
//                     message: postData[i]?.O_MESSAGE,
//                     buttonNames: ["Yes", "No"],
//                   });
//                   btn99 = btnName;
//                   if (btnName === "No") {
//                     returnVal = "";
//                   }
//                 } else if (postData.MSG[i]?.O_STATUS === "9") {
//                   if (btn99 !== "No") {
//                     const { btnName, obj } = await getButtonName({
//                       messageTitle: "Alert",
//                       message: postData.MSG[i]?.O_MESSAGE,
//                     });
//                   }
//                   returnVal = postData[i];
//                 } else if (postData.MSG[i]?.O_STATUS === "0") {
//                   if (btn99 !== "No") {
//                     returnVal = postData[i];
//                   } else {
//                     returnVal = "";
//                   }
//                 }
//               }
//               btn99 = 0;
  
             
//               if (dependentFieldValues?.["DR_ACCT_CD"]?.value === utilFunction.getPadAccountNumber(
//                 currentField?.value,
//                 dependentFieldValues?.CR_ACCT_CD?.optionData
//               )
//               ) {
//                 const btnname = await formState.MessageBox({
//                   messageTitle: "ValidationFailed",
//                   message: "Please enter another A/C No",
//                   buttonNames: ["OK"],
//                 });
//                 return {
//                   CR_ACCT_CD: { value: "" },
//                 };
  
//               }
//               // alert end
  
//               return {
//                 CR_ACCT_CD:
//                   postData[0] !== ""
//                     ? {
//                       value: currentField?.value.padStart(6, "0")?.padEnd(20, " "),
//                       ignoreUpdate: true,
//                       isFieldFocused: false,
//                     }
//                     : {
//                       value: "",
//                       isFieldFocused: true,
//                       ignoreUpdate: true,
//                     },
//               };
//             }
//           },
  
//           // runPostValidationHookAlways: true,
//           FormatProps: {
//             isAllowed: (values) => {
//               //@ts-ignore
//               if (values?.value?.length > 20) {
//                 return false;
//               }
//               return true;
//             },
//           },
//           fullWidth: true,
//           GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3},
//         },
  
//       },
//       {
//         render: {
//           componentType: "textField",
//         },
//         name: "SI_AMOUNT",
//         label: "SI Amount",
//         placeholder: "",
//         type: "text",
//         dependentFields: ["DR_ACCT_TYPE", "DR_ACCT_CD", "DEF_TRAN_CD", "BRANCH_CD", "COMP_CD"],
//         fullWidth:true,
//         FormatProps: {
//           allowNegative: false,
//         },
//         // postValidationSetCrossFieldValues: async (
//         //   currentField,
//         //   formState,
//         //   authState,
//         //   dependentFieldValues
//         // ) => {
//         //   if (formState?.isSubmitting) return {};
  
//         //   const reqParameters = {
//         //     COMP_CD: dependentFieldValues?.["COMP_CD"]?.value,
//         //     BRANCH_CD: dependentFieldValues?.["BRANCH_CD"]?.value,
//         //     ACCT_TYPE: dependentFieldValues?.["DR_ACCT_TYPE"]?.value,
//         //     ACCT_CD: dependentFieldValues?.["DR_ACCT_CD"]?.value,
//         //     AMOUNT: currentField?.value,
//         //     DEF_TRAN_CD: dependentFieldValues?.["DEF_TRAN_CD"]?.value,
//         //     DOC_CD: "TRN/394",
//         //   };
//         //   const postData = await API.getSiCharge(reqParameters);
//         //   return {
            
//         //     SI_CHARGE: {
//         //       value:postData
//         //           ? postData[0]?.SI_CHARGE ?? ""
//         //           : "",
//         //       ignoreUpdate: true,
//         //     },
//         //   };
        
//         // },
//         required: true,
//         GridProps: { xs: 6, sm: 6,md: 3, lg: 3, xl:3 },
//         schemaValidation: {
//           type: "string",
//           rules: [{ name: "required", params: ["SI Amount is Required"] }],
//         },
  
//       },
//       {
//         render: {
//           componentType: "textField",
//         },
//         name: "SI_CHARGE",
//         label: "SI Charge",
//         type: "text",
//         fullWidth: true,
//         GridProps: {xs: 6, sm: 6, md: 3, lg: 3, xl: 3},
//       },
//       {
//         render: {
//           componentType: "textField",
//         },
//         name: "REMARKS",
//         label: "Remark",
//         fullWidth:true,
//         placeholder: "",
//         type: "text",
//         GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3},
//       },
//       {
//         render: {
//           componentType: "formbutton"
//         },
//         name: "populate",
//         label: "Populate",
//         placeholder: "",
//         GridProps: {xs: 3, sm: 3, md: 1, lg: 1, xl: 1,},
//         dependentFields: ["SI_EXECUTE_FLG"],
//         shouldExclude(fieldData, dependentFields, formState) {
//           if (dependentFields?.SI_EXECUTE_FLG?.value === "N") {
//             return false;
//           } else {
//             return true;
//           }
//         },
//       },
//       {
//         render: {
//           componentType: "hidden",
//         },
//         name: "DEF_TRAN_CD",
//         label:"HIDDEN FLAG"
//       },   
      
//     ],
//   },
//   detailsGrid: {
//     gridConfig: {
//       dense: true,
//       gridLabel: "SI Execute Detail View",
//       rowIdColumn: "SUB_LINE_ID",
//       defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
//       allowColumnReordering: true,
//       hideHeader: true,
//       disableGroupBy: true,
//       // enablePagination: true,
//       containerHeight: { min: "30vh", max: "30vh" },
//       allowRowSelection: false,
//       hiddenFlag: "_hidden",
//       disableLoader: true,
//       paginationText: "Records found",
//     },
//     columns: [
//       {
//         accessor: "Sr No.",
//         columnName: "Sr No.",
//         sequence: 1,
//         alignment: "left",
//         componentType: "default",
//         isAutoSequence: true,
//         width: 50,
//         minWidth: 40,
//         maxWidth: 100,
//       },
//       {
//         accessor: "EXECUTE_DT",
//         columnName: "Execute Date",
//         sequence: 2,
//         alignment: "left",
//         componentType: "date",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 150
//       }, 
//       {
//         accessor: "PROCESS_DT",
//         columnName: "Process Date",
//         sequence: 3,
//         alignment: "left",
//         componentType: "date",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 150
//       }, 
//       {
//         accessor: "SI_EXECUTE_FLG_DIS",
//         columnName: "SI Execute Process",
//         sequence: 4,
//         alignment: "left",
//         componentType: "default",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 150,
//       }, 
//       {
//         accessor: "REASON",
//         columnName: "Reason",
//         sequence: 5,
//         alignment: "left",
//         componentType: "default",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 150,
//       }, 
//       {
//         accessor: "BRANCH_CD",
//         columnName: "Debit Branch Code",
//         sequence: 6,
//         alignment: "left",
//         componentType: "default",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 150,
//       },
//       {
//         accessor: "DR_ACCT_TYPE",
//         columnName: "Debit A/C Type",
//         sequence: 6,
//         alignment: "left",
//         componentType: "default",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 150,
//       },
//       {
//         accessor: "DR_ACCT_CD",
//         columnName: "Debit A/C No.",
//         sequence: 6,
//         alignment: "left",
//         componentType: "default",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 150,
//       },
//       {
//         accessor: "CR_BRANCH_CD",
//         columnName: "Credit Branch Code",
//         sequence: 7,
//         alignment: "left",
//         componentType: "default",
//         width: 100,
//         minWidth: 100,
//         maxWidth: 200,
//       },
//       {
//         accessor: "CR_ACCT_TYPE",
//         columnName: "Credit A/C Type",
//         sequence: 8,
//         alignment: "left",
//         componentType: "default",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 350
//       },
//       {
//         accessor: "CR_ACCT_CD",
//         columnName: "Credit A/C No.",
//         sequence: 8,
//         alignment: "left",
//         componentType: "default",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 350
//       },
//       {
//         accessor: "SI_AMOUNT",
//         columnName: "SI Amount",
//         sequence: 9,
//         alignment: "left",
//         componentType: "currency",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 150
//       }, 
//       {
//         accessor: "SI_CHARGE",
//         columnName: "SI Charge",
//         sequence: 10,
//         alignment: "left",
//         componentType: "default",
//         width: 100,
//         minWidth: 50,
//         maxWidth: 150
//       }, 
//       {
//         accessor: "REMARKS",
//         columnName: "Remark",
//         sequence: 11,
//         alignment: "left",
//         componentType: "default",
//         width: 150,
//         minWidth: 100,
//         maxWidth: 350
//       },
//       // {
//       //   columnName: "",
//       //   componentType: "buttonRowCell",
//       //   buttonLabel: "Audit Trail",
//       //   accessor: "_hidden2",
//       //   width: 140,
//       //   sequence: 14,
//       //   alignment: "center",
//       //   shouldExclude: (initialValue, original, prevRows, nextRows) => {
//       //     if (original?.AUDIT_CNT > 0) {
//       //       return false;
//       //     }
//       //     else {
//       //       return true;
//       //     }
//       //   },
//       // },
//       // {
//       //   columnName: "",
//       //   componentType: "buttonRowCell",
//       //   buttonLabel: "Populate",
//       //   accessor: "_hidden1",
//       //   width: 80,
//       //   sequence: 14,
//       //   alignment: "center",
//       //   shouldExclude: (initialValue, original, prevRows, nextRows) => {
  
//       //     if (original?.SI_EXECUTE_FLG == 'N') {
//       //       return false;
//       //     }
//       //     else {
//       //       return true;
//       //     }
//       //   },
//       // },
//     ],
//   },
// };

  