import * as API from "./api";
import { t } from "i18next";

export const EMICalculateMetaData = {
  form: {
    name: "emiCalculator",
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
      },
    },
  },
  fields: [
    {
      render: { componentType: "autocomplete" },
      name: "INST_TYPE",
      label: "InstallmentType",
      placeholder: "InstallmentType",
      options: (authState) =>
        API.getEMIInstType({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "getEMIInstType",
      defaultValue: "1",
      GridProps: { xs: 6, sm: 3, md: 3, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "INST_AMT",
      label: "LoanAmount",
      type: "text",
      fullWidth: true,
      required: true,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: false,
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: [t("LoanAmountisrequired")] }],
      },
      GridProps: { xs: 6, sm: 3, md: 3, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "INT_RATE",
      label: "IntRate",
      type: "text",
      fullWidth: true,
      className: "textInputFromRight",
      required: true,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: false,
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: [t("InterestRateisrequired")] }],
      },
      GridProps: { xs: 6, sm: 3, md: 3, lg: 3, xl: 3 },
    },
    {
      render: { componentType: "autocomplete" },
      name: "INST_FUND",
      label: "InterestFunded",
      placeholder: "InterestFunded",
      options: (authState) =>
        API.getEMICalcIntFund({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "getEMICalcIntFund",
      GridProps: { xs: 6, sm: 3, md: 3, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "divider",
      },
      name: "InstallmentDetails",
      label: "InstallmentDetails",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: { componentType: "select" },
      name: "PERIOD",
      label: "Period",
      placeholder: "Period",
      options: (authState) =>
        API.getEMICalcPeriod({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        }),
      _optionsKey: "getEMICalcPeriod",
      GridProps: { xs: 6, sm: 4, md: 4, lg: 4, xl: 4 },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: [t("InstallmentPeriodisrequired")] },
        ],
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      className: "textInputFromRight",
      name: "No",
      label: "No.",
      required: true,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 3) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: [t("NoofInstallmentisrequired")] }],
      },
      GridProps: { xs: 6, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "arrayField",
      },
      name: "EMI_DETAIL1",
      isVisible: false,
      changeRowOrder: true,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        // {
        //   render: {
        //     componentType: "numberFormat",
        //   },
        //   name: "SR_NO",
        //   label: "SrNo",
        //   type: "text",
        // className: "textInputFromRight",
        //   fullWidth: true,
        //   GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
        // },
        {
          render: {
            componentType: "datePicker",
          },
          name: "DISBURSE_DATE",
          label: "DisburseDate",
          type: "text",
          fullWidth: true,
          GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
          postValidationSetCrossFieldValues: async (
            currentField,
            formState,
            authState,
            dependentFieldValues
          ) => {
            if (formState?.isSubmitting) return {};

            const reqParameters = {
              A_FLAG: "INST_START_DT",
              A_INST_NO: "5",
              A_INST_TYPE: "1",
              A_INT_RATE: "5.00",
              A_INST_PERIOD: "12",
              A_INT_SKIP_FLAG: "Y",
              A_SR_CD: "1",
              A_PREV_DISBUR_DT: "02/SEP/2023",
              A_DISBURSEMENT_DT: "03/SEP/2024",
              A_INST_START_DT: "03/SEP/2024",
              A_DISBURS_AMT: "1000.00",
              A_TOT_LOAN_AMT: "1000.00",
              A_GD_DATE: "03/SEP/2024",
              A_SCREEN_REF: "RPT/1199",
              A_LANG: "en",
              A_USER: "kinjal",
              A_USER_LEVEL: "4",
            };

            const postData = await API.validateDisburseDetail(reqParameters);
            // console.log(postData)
            formState.setDataOnFieldChange("EMI_SCHEDULE", {
              validateData: {
                TO_INST: postData[0].TO_INST,
                FROM_INST: postData[0].FROM_INST,
                REM_INST: postData[0].REM_INST,
                EMI_RS: postData[0].EMI_RS,
              },
              isVisible: true,
            });
            return {
              TO_INST: {
                value: postData[0].TO_INST,
                isFieldFocused: true,
                ignoreUpdate: true,
              },
            };
          },
        },

        {
          render: {
            componentType: "datePicker",
          },
          name: "INST_START_DATE",
          label: "InstStartDate",
          placeholder: "Enter Remark",
          type: "text",
          GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "LOAN_AMT",
          label: "LoanAmount",
          type: "text",
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: false,
          },
          fullWidth: true,
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: [t("DisburseAmountisrequired")] },
            ],
          },
          GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
        },
        {
          render: {
            componentType: "formbutton",
          },
          name: "VIEW",
          label: "VIEW",
          GridProps: { xs: 2.2, sm: 2, md: 1.8, lg: 1.2, xl: 1.2 },
        },
      ],
    },

    //       {
    //         render: {
    //           componentType: "arrayField",
    //         },
    //         name: "EMI_DETAIL2",
    //         changeRowOrder: true,
    //         GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    //         _fields: [
    //           {
    //             render: {
    //               componentType: "numberFormat",
    //             },
    //             name: "SR_NO",
    //             label: "SrNo",
    //             type: "text",
    //           className: "textInputFromRight",
    //             fullWidth: true,
    //             GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
    //           },
    //                {
    //             render: {
    //               componentType: "numberFormat",
    //             },
    //             name: "FROM_INST",
    //             label: "FromInst",
    //             className: "textInputFromRight",
    //             type: "text",
    //             fullWidth: true,
    //             FormatProps: {
    //               allowNegative: false,
    //               allowLeadingZeros: false,
    //             },
    //             GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
    //             postValidationSetCrossFieldValues: async (
    //               currentField,
    //               formState,
    //               authState,
    //               dependentFieldValues
    //             ) => {
    //               if (formState?.isSubmitting) return {};

    //               const reqParameters = {
    // A_FLAG :"FROM_INST",
    // A_INST_NO:"5",
    // A_FROM_INST:"2",
    // A_TO_INST:"5",
    // A_EMI_RS:"10,000.00",

    // A_PREV_FROM_INST:"5",
    // A_GD_DATE:"02/SEP/2024"  ,
    // A_SCREEN_REF:"RPT/1199" ,
    // A_LANG:"en"       ,
    // A_USER:"kinjal"   ,
    // A_USER_LEVEL:"4"  ,
    //               };

    //               const postData = await API.validateCheckEmiSchedule(reqParameters);
    //               console.log(postData)
    //               return {
    //                 DUE_DATE: {
    //                   value:postData[0].DUE_DATE,
    //                   isFieldFocused: true,
    //                   ignoreUpdate: true,
    //                 },
    //               };
    //             },
    //           },
    //           {
    //             render: {
    //               componentType: "numberFormat",
    //             },
    //             name: "TO_INST",
    //             label: "ToInst",
    //             type: "text",
    //             className: "textInputFromRight",
    //             FormatProps: {
    //               allowNegative: false,
    //               allowLeadingZeros: false,
    //             },
    //             fullWidth: true,
    //             GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
    //           },
    //           {
    //             render: {
    //               componentType: "numberFormat",
    //             },
    //             name: "NO_OF_INST",
    //             label: "NoofInstallment",
    //             className: "textInputFromRight",
    //             type: "text",
    //             fullWidth: true,
    //             FormatProps: {
    //               allowNegative: false,
    //               allowLeadingZeros: false,
    //             },
    //             GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
    //           },
    //           {
    //             render: {
    //               componentType: "amountField",
    //             },
    //             name: "EMI_RS",
    //             label: "InstallmentAmount",
    //             type: "text",
    //             FormatProps: {
    //               allowNegative: false,
    //               allowLeadingZeros: false,
    //             },
    //             fullWidth: true,
    //             GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
    //           },
    //         ],
    //       },
  ],
};

export const EMICalculatorSecondPartMetaData = {
  form: {
    name: "Standing Instruction Entry (TRN/394)",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    hideHeader: false,
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
    },
  },
  fields: [
    {
      render: {
        componentType: "arrayField",
      },
      name: "EMI_DETAIL2",
      changeRowOrder: true,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "numberFormat",
          },
          name: "SR_NO",
          label: "SrNo",
          type: "text",
          className: "textInputFromRight",
          fullWidth: true,
          GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "FROM_INST",
          label: "FromInst",
          className: "textInputFromRight",
          type: "text",
          fullWidth: true,
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: false,
          },
          GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
          //             postValidationSetCrossFieldValues: async (
          //               currentField,
          //               formState,
          //               authState,
          //               dependentFieldValues
          //             ) => {
          //               if (formState?.isSubmitting) return {};

          //               const reqParameters = {

          // A_INST_NO:"5",
          // A_FROM_INST:"2",
          // A_TO_INST:"5",
          // A_EMI_RS:"10,000.00",
          // A_PREV_FROM_INST:"5",
          // A_GD_DATE:"02/SEP/2024"  ,
          // A_SCREEN_REF:"RPT/1199" ,
          // A_FLAG:"FROM_INST",
          // A_LANG:"en"       ,
          // A_USER:"kinjal"   ,
          // A_USER_LEVEL:"4"  ,
          //               };

          //               const postData = await API.validateCheckEmiSchedule(reqParameters);
          //               console.log(postData)
          //               return {
          //                 DUE_DATE: {
          //                   value:postData[0].DUE_DATE,
          //                   isFieldFocused: true,
          //                   ignoreUpdate: true,
          //                 },
          //               };
          //             },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "TO_INST",
          label: "ToInst",
          type: "text",
          className: "textInputFromRight",
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: false,
          },
          fullWidth: true,
          GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "NO_OF_INST",
          label: "NoofInstallment",
          className: "textInputFromRight",
          type: "text",
          fullWidth: true,
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: false,
          },
          GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "INST_AMOUNT",
          label: "InstallmentAmount",
          type: "text",
          FormatProps: {
            allowNegative: false,
            allowLeadingZeros: false,
          },
          fullWidth: true,
          GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
        },
      ],
    },
  ],
};

// export const EMICalculateMetaData1 = {
//   masterForm: {
//     form: {
//       name: "emicalculator",
//       label: "",
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
//           componentType: "arrayField",
//         },
//         name: "EMI_DETAIL1",
//         isVisible:false,
//         changeRowOrder: true,
//         GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
//         _fields: [
//           // {
//           //   render: {
//           //     componentType: "numberFormat",
//           //   },
//           //   name: "SR_NO",
//           //   label: "SrNo",
//           //   type: "text",
//           // className: "textInputFromRight",
//           //   fullWidth: true,
//           //   GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
//           // },
//           {
//             render: {
//               componentType: "datePicker",
//             },
//             name: "DISBURSE_DATE",
//             label: "Disburse Date",
//             type: "text",
//             fullWidth: true,
//             GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
//           },

//           {
//             render: {
//               componentType: "datePicker",
//             },
//             name: "INST_START_DATE",
//             label: "Inst. Start Date",
//             placeholder: "Enter Remark",
//             type: "text",
//             GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
//           },
//           {
//             render: {
//               componentType: "amountField",
//             },
//             name: "LOAN_AMT",
//             label: "Loan Amount",
//             type: "text",
//             FormatProps: {
//               allowNegative: false,
//             },
//             fullWidth: true,
//             GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
//           },
//           // {
//           //   render: {
//           //     componentType: "formbutton",
//           //   },
//           //   name: "ADDNEWROW",
//           //   label: "AddRow",
//           //   endsIcon: "AddCircleOutlineRounded",
//           //   rotateIcon: "scale(2)",
//           //   placeholder: "",
//           //   type: "text",
//           //   tabIndex: "-1",
//           //   iconStyle: {
//           //     fontSize: "25px !important",
//           //   },
//           //   __VIEW__: { render: { componentType: "hidden" } },
//           //   GridProps: { xs: 2.2, sm: 2, md: 1.8, lg: 1.2, xl: 1.2 },
//           // },
//           {
//               render: {
//                 componentType: "arrayField",
//               },
//               name: "EMI_DETAIL2",
//               changeRowOrder: true,
//               GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
//               _fields: [
//                 // {
//                 //   render: {
//                 //     componentType: "numberFormat",
//                 //   },
//                 //   name: "SR_NO",
//                 //   label: "SrNo",
//                 //   type: "text",
//                 // className: "textInputFromRight",
//                 //   fullWidth: true,
//                 //   GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
//                 // },
//                      {
//                   render: {
//                     componentType: "numberFormat",
//                   },
//                   name: "FROM_INST",
//                   label: "From Inst.",
//                   className: "textInputFromRight",
//                   type: "text",
//                   fullWidth: true,
//                   GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
//                 },
//                 {
//                   render: {
//                     componentType: "numberFormat",
//                   },
//                   name: "TO_INST",
//                   label: "To Inst.",
//                   type: "text",
//                   className: "textInputFromRight",
//                   fullWidth: true,
//                   GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
//                 },
//                 {
//                   render: {
//                     componentType: "numberFormat",
//                   },
//                   name: "NO_OF_INST",
//                   label: "No.of Installment",
//                   className: "textInputFromRight",
//                   type: "text",
//                   fullWidth: true,
//                   GridProps: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
//                 },
//                 {
//                   render: {
//                     componentType: "amountField",
//                   },
//                   name: "INST_AMOUNT",
//                   label: "Installment Amount",
//                   type: "text",
//                   FormatProps: {
//                     allowNegative: false,
//                   },
//                   fullWidth: true,
//                   GridProps: { xs: 6, sm: 6, md: 3, lg: 3, xl: 3 },
//                 },
//               ],
//             },
//         ],

//       },
//     ],
//   },
//   detailsGrid: {
//     gridConfig: {
//       dense: true,
//       gridLabel: "Document Detail",
//       rowIdColumn: "id",
//       defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
//       allowColumnReordering: true,
//       hideHeader: true,
//       disableGroupBy: true,
//       enablePagination: false,
//       containerHeight: { min: "20vh", max: "29vh" },
//       // allowScroll:true,
//       allowRowSelection: false,
//       hiddenFlag: "_hidden",
//       disableLoader: false,
//     },
//     columns: [
//       {
//         accessor: "id",
//         columnName: "SrNo",
//         componentType: "default",
//         sequence: 1,
//         alignment: "center",
//         width: 75,
//         minWidth: 50,
//         maxWidth: 100,
//         isAutoSequence: true,
//       },
//       {
//         accessor: "FROM_INST",
//         columnName: "From Inst.",
//         componentType: "editableNumberFormat",
//         placeholder: " ",
//         className: "textInputFromRight",
//         sequence: 2,
//         alignment: "left",
//         width: 180,
//         minWidth: 160,
//         maxWidth: 200,
//         FormatProps: {
//           thousandSeparator: true,
//           thousandsGroupStyle: "lakh",
//           allowNegative: false,
//           allowLeadingZeros: false,
//           decimalScale: 2,
//           fixedDecimalScale: true,
//           isAllowed: (values) => {
//             if (values?.value?.length > 3) {
//               return false;
//             }
//             if (values.floatValue === 0) {
//               return false;
//             }
//             return true;
//           },
//         }
//         // isReadOnly: true,
//         // __EDIT__: { isReadOnly: false, componentType: "editableTextField" },
//       },
//        {
//         accessor: "TO_INST",
//         columnName: "To Inst.",
//         componentType: "editableNumberFormat",
//         className: "textInputFromRight",
//         placeholder: " ",
//         sequence: 3,
//         alignment: "left",
//         width: 180,
//         minWidth: 160,
//         maxWidth: 200,
//         FormatProps: {
//           thousandSeparator: true,
//           thousandsGroupStyle: "lakh",
//           allowNegative: false,
//           allowLeadingZeros: false,
//           decimalScale: 2,
//           fixedDecimalScale: true,
//           isAllowed: (values) => {
//             if (values?.value?.length > 3) {
//               return false;
//             }
//             if (values.floatValue === 0) {
//               return false;
//             }
//             return true;
//           },
//       }
//     },
//     {
//       accessor: "NO_OF_INST",
//       columnName: "No.of Installment",
//       componentType: "editableNumberFormat",
//       className: "textInputFromRight",
//       placeholder: " ",
//       sequence: 3,
//       alignment: "left",
//       width: 180,
//       minWidth: 160,
//       maxWidth: 200,
//       FormatProps: {
//         thousandSeparator: true,
//         thousandsGroupStyle: "lakh",
//         allowNegative: false,
//         allowLeadingZeros: false,
//         decimalScale: 2,
//         fixedDecimalScale: true,
//         isAllowed: (values) => {
//           if (values?.value?.length > 3) {
//             return false;
//           }
//           if (values.floatValue === 0) {
//             return false;
//           }
//           return true;
//         },
//     }
//   },
//       {
//         accessor: "LOAN_AMOUNT",
//         columnName: "Loan Amount",
//         componentType: "editableNumberFormat",
//         className: "textInputFromRight",
//         sequence: 3,
//         alignment: "right",
//         width: 180,
//         minWidth: 160,
//         placeholder: "0.00",
//         maxWidth: 200,
//         FormatProps: {
//           thousandSeparator: true,
//           thousandsGroupStyle: "lakh",
//           allowNegative: false,
//           allowLeadingZeros: false,
//           decimalScale: 2,
//           fixedDecimalScale: true,
//           isAllowed: (values) => {
//             if (values?.value?.length > 15) {
//               return false;
//             }
//             if (values.floatValue === 0) {
//               return false;
//             }
//             return true;
//           },
//         },
//       },
//       {
//         columnName: "Action",
//         componentType: "deleteRowCell",
//         accessor: "_hidden",
//         sequence: 5,
//       },
//     ],
//   },

// };
