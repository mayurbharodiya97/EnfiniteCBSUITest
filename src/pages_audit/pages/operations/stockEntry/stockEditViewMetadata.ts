import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";

// export const stockViewEditFormMetaData = {
//   form: {
//     name: "stockViewEditFormMetaData",
//     label: "Stock Detail",
//     resetFieldOnUnmount: false,
//     validationRun: "onBlur",
//     submitAction: "home",
//     hideHeader: true,
//     // formStyle: {
//     //   background: "white",
//     //   height: "calc(100vh - 390px)",
//     //   overflowY: "auto",
//     //   overflowX: "hidden",
//     // },
//     render: {
//       ordering: "auto",
//       // ordering: "sequence",
//       renderType: "simple",
//       gridConfig: {
//         item: {
//           xs: 12,
//           sm: 4,
//           md: 4,
//         },
//         container: {
//           direction: "row",
//           spacing: 1,
//           height: "35vh",
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
//     },
//   },
//   fields: [
//     {
//       render: {
//         componentType: "branchCode",
//       },
//       name: "BRANCH_CD",
//       label: "Branch",
//       placeholder: "Branch",
//       type: "text",
//       GridProps: {
//         xs: 12,
//         md: 3,
//         sm: 3,
//         lg: 3,
//         xl: 3,
//       },
//     },
//     {
//       render: {
//         componentType: "autocomplete",
//       },
//       name: "ACCT_TYPE",
//       label: "Account Type",
//       placeholder: "EnterAccountType",

//       GridProps: {
//         xs: 12,
//         md: 3,
//         sm: 3,
//         lg: 3,
//         xl: 3,
//       },
//     },
//     {
//       render: {
//         componentType: "textField",
//       },
//       name: "ACCT_CD",
//       label: "Account Number",
//       placeholder: "EnterAcNo",
//       type: "text",
//       GridProps: {
//         xs: 12,
//         md: 2,
//         sm: 2,
//         lg: 3,
//         xl: 3,
//       },
//     },
//     {
//       render: {
//         componentType: "textField",
//       },
//       name: "ACCT_NM",
//       label: "Account Name",
//       placeholder: "Account Name",
//       type: "text",
//       isReadOnly: true,
//       GridProps: {
//         xs: 12,
//         md: 3,
//         sm: 3,
//         lg: 3,
//         xl: 3,
//       },
//     },

//     {
//       render: {
//         componentType: "textField",
//       },
//       name: "TRAN_BAL",
//       label: "Balance",
//       placeholder: "Balance",
//       type: "text",
//       GridProps: {
//         xs: 12,
//         md: 2.4,
//         sm: 2.4,
//         lg: 2.4,
//         xl: 2.4,
//       },
//     },
//     {
//       render: {
//         componentType: "textField",
//       },
//       name: "ACCT_MST_LIMIT",
//       label: "Account Limit Amount",
//       placeholder: "Account Limit Entry",
//       type: "text",
//       // defaultValue: "2",
//       // enableDefaultOption: true,
//       GridProps: {
//         xs: 12,
//         md: 2.4,
//         sm: 2.4,
//         lg: 2.4,
//         xl: 2.4,
//       },
//     },
//     {
//       render: {
//         componentType: "autocomplete",
//       },
//       name: "SECURITY_CD",
//       label: "Security",

//       GridProps: {
//         xs: 12,
//         md: 2.4,
//         sm: 2.4,
//         lg: 2.4,
//         xl: 2.4,
//       },
//     },

//     {
//       render: {
//         componentType: "datePicker",
//       },
//       name: "NNNNNNN",
//       // sequence: 9,
//       label: "Statement Date",
//       GridProps: {
//         xs: 12,
//         md: 2.4,
//         sm: 2.4,
//         lg: 2.4,
//         xl: 2.4,
//       },
//     },
//     {
//       render: {
//         componentType: "datePicker",
//       },
//       name: "HHHHHHHHHHH",
//       // sequence: 9,
//       label: "STMT Valid Till Date",
//       GridProps: {
//         xs: 12,
//         md: 2.4,
//         sm: 2.4,
//         lg: 2.4,
//         xl: 2.4,
//       },
//     },
//     {
//       render: {
//         componentType: "autocomplete",
//       },
//       name: "SCRIPT_CD",
//       label: "Script",
//       placeholder: "Script ",

//       GridProps: {
//         xs: 12,
//         md: 2.4,
//         sm: 2.4,
//         lg: 2.4,
//         xl: 2.4,
//       },
//     },
//     {
//       render: {
//         componentType: "textField",
//       },
//       name: "NO_OF_SHARE",
//       label: "No. of Share",
//       type: "text",
//       placeholder: "No. of Share",
//       GridProps: {
//         xs: 12,
//         md: 2.4,
//         sm: 2.4,
//         lg: 2.4,
//         xl: 2.4,
//       },
//     },

//     {
//       render: {
//         componentType: "textField",
//       },
//       name: "STOCK_VALUE",
//       label: "Stock Value",
//       placeholder: "Stock Value",
//       type: "text",
//       GridProps: {
//         xs: 12,
//         md: 2.4,
//         sm: 2.4,
//         lg: 2.4,
//         xl: 2.4,
//       },
//     },
//     {
//       render: {
//         componentType: "textField",
//       },
//       name: "WWWWWWWWW",
//       label: "Net Value",
//       type: "text",
//       placeholder: "Net Value",
//       GridProps: {
//         xs: 12,
//         md: 2.4,
//         sm: 2.4,
//         lg: 2.4,
//         xl: 2.4,
//       },
//     },
//     {
//       render: {
//         componentType: "textField",
//       },
//       name: "MARGIN",
//       label: "Margin",
//       type: "text",
//       placeholder: "Margin",
//       GridProps: {
//         xs: 12,
//         md: 2.4,
//         sm: 2.4,
//         lg: 2.4,
//         xl: 2.4,
//       },
//     },
//     {
//       render: {
//         componentType: "textField",
//       },
//       name: "STOCK_DESC",
//       label: "Stock Decription",
//       type: "text",
//       placeholder: "Stock Description",
//       GridProps: {
//         xs: 12,
//         md: 3.2,
//         sm: 3.2,
//         lg: 3.2,
//         xl: 3.2,
//       },
//     },
//     {
//       render: {
//         componentType: "textField",
//       },
//       name: "REMARKS",
//       label: "Remarks",
//       type: "text",
//       placeholder: "Remarks",
//       GridProps: {
//         xs: 12,
//         md: 3.2,
//         sm: 3.2,
//         lg: 3.2,
//         xl: 3.2,
//       },
//     },
//     {
//       render: {
//         componentType: "textField",
//       },
//       name: "DRAWING_POWER",
//       label: "Drawing Power",
//       type: "text",
//       placeholder: "Drawing Power",
//       GridProps: {
//         xs: 12,
//         md: 3.2,
//         sm: 3.2,
//         lg: 3.2,
//         xl: 3.2,
//       },
//     },

//     {
//       render: {
//         componentType: "datePicker",
//       },
//       name: "RECEIVED_DT",
//       label: "Received Date",
//       type: "text",
//       GridProps: {
//         xs: 12,
//         md: 2.4,
//         sm: 2.4,
//         lg: 2.4,
//         xl: 2.4,
//       },
//     },
//   ],
// };

export const stockViewEditMSTMetaData: MasterDetailsMetaData = {
  masterForm: {
    form: {
      name: "LangMsgConfig",
      label: "Language Wise Message Configuration",
      resetFieldOnUnmount: false,
      validationRun: "onBlur",
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
    },
    fields: [
      {
        render: {
          componentType: "textField",
        },
        name: "BRANCH_CD",
        label: "Branch",
        placeholder: "Branch",
        type: "text",
        fullWidth: true,
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
        name: "ACCT_TYPE",
        label: "Account Type",
        placeholder: "EnterAccountType",
        fullWidth: true,
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
        name: "ACCT_CD",
        label: "Account Number",
        placeholder: "EnterAcNo",
        fullWidth: true,
        type: "text",
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
        label: "Account Name",
        placeholder: "Account Name",
        fullWidth: true,
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
        name: "TRAN_BAL",
        label: "Balance",
        placeholder: "Balance",
        fullWidth: true,
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
          componentType: "textField",
        },
        name: "ACCT_MST_LIMIT",
        fullWidth: true,
        label: "Account Limit Amount",
        placeholder: "Account Limit Entry",
        type: "text",
        // defaultValue: "2",
        // enableDefaultOption: true,
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
        fullWidth: true,
        name: "SECURITY_CD",
        label: "Security",

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
        fullWidth: true,
        name: "NNNNNNN",
        // sequence: 9,
        label: "Statement Date",
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
        name: "HHHHHHHHHHH",
        fullWidth: true,
        // sequence: 9,
        label: "STMT Valid Till Date",
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
        name: "SCRIPT_CD",
        fullWidth: true,
        label: "Script",
        placeholder: "Script ",

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
        name: "NO_OF_SHARE",
        fullWidth: true,
        label: "No. of Share",
        type: "text",
        placeholder: "No. of Share",
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
        name: "STOCK_VALUE",
        fullWidth: true,
        label: "Stock Value",
        placeholder: "Stock Value",
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
          componentType: "textField",
        },
        name: "WWWWWWWWW",
        label: "Net Value",
        type: "text",
        fullWidth: true,
        placeholder: "Net Value",
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
        name: "MARGIN",
        fullWidth: true,
        label: "Margin",
        type: "text",
        placeholder: "Margin",
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
        name: "STOCK_DESC",
        label: "Stock Decription",
        type: "text",
        fullWidth: true,
        placeholder: "Stock Description",
        GridProps: {
          xs: 12,
          md: 3.2,
          sm: 3.2,
          lg: 3.2,
          xl: 3.2,
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "REMARKS",
        fullWidth: true,
        label: "Remarks",
        type: "text",
        placeholder: "Remarks",
        GridProps: {
          xs: 12,
          md: 3.2,
          sm: 3.2,
          lg: 3.2,
          xl: 3.2,
        },
      },
      {
        render: {
          componentType: "textField",
        },
        fullWidth: true,
        name: "DRAWING_POWER",
        label: "Drawing Power",
        type: "text",
        placeholder: "Drawing Power",
        GridProps: {
          xs: 12,
          md: 3.2,
          sm: 3.2,
          lg: 3.2,
          xl: 3.2,
        },
      },

      {
        render: {
          componentType: "datePicker",
        },
        name: "RECEIVED_DT",
        label: "Received Date",
        fullWidth: true,
        type: "text",
        GridProps: {
          xs: 12,
          md: 2.4,
          sm: 2.4,
          lg: 2.4,
          xl: 2.4,
        },
      },
    ],
  },
  detailsGrid: {
    gridConfig: {
      dense: true,
      gridLabel: "Document Detail",
      rowIdColumn: "SR_CD",
      defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
      allowColumnReordering: true,
      hideHeader: true,
      disableGroupBy: true,
      enablePagination: true,
      containerHeight: { min: "40vh", max: "40vh" },
      allowRowSelection: false,
      hiddenFlag: "_hidden",
      disableLoader: true,
      // paginationText: "Configured Messages",
    },
    columns: [
      {
        accessor: "SR_CD",
        columnName: "Sr No.",
        componentType: "default",
        sequence: 1,
        alignment: "center",
        width: 100,
        maxWidth: 150,
        minWidth: 70,
        isAutoSequence: true,
      },
      {
        accessor: "COMP_CD",
        columnName: "company",
        componentType: "default",
        placeholder: " ",
        isVisible: false,
        sequence: 2,
      },
      {
        accessor: "ACCT_TYPE",
        columnName: "accoutType",
        componentType: "default",
        placeholder: " ",
        isVisible: false,
        sequence: 2,
      },
      {
        accessor: "ENTERED_BRANCH_CD",
        columnName: "enteredBranch",
        componentType: "default",
        placeholder: " ",
        isVisible: false,
        sequence: 2,
      },
      {
        accessor: "ENTERED_COMP_CD",
        columnName: "enteredBranch",
        componentType: "default",
        placeholder: " ",
        isVisible: false,
        sequence: 2,
      },
      {
        accessor: "REF_TRAN_CD",
        columnName: "enteredBranch",
        componentType: "default",
        placeholder: " ",
        isVisible: false,
        sequence: 2,
      },
      {
        accessor: "REF_SR_CD",
        columnName: "enteredBranch",
        componentType: "default",
        placeholder: " ",
        isVisible: false,
        sequence: 2,
      },
      {
        accessor: "TABLE_NM",
        columnName: "enteredBranch",
        componentType: "default",
        placeholder: " ",
        // isVisible: false,
        sequence: 2,
      },
      {
        accessor: "ACTIVE",
        columnName: "enteredBranch",
        componentType: "default",
        placeholder: " ",
        // isVisible: false,
        sequence: 2,
      },

      {
        accessor: "DOC_DEC",
        columnName: "Document Description",
        componentType: "editableTextField",
        placeholder: " ",
        sequence: 2,
        alignment: "left",
        width: 160,
        maxWidth: 200,
        minWidth: 100,
      },
      {
        accessor: "DOC_DATA",
        columnName: "Document Description",
        componentType: "editableTextField",
        placeholder: " ",
        sequence: 2,
        alignment: "left",
        width: 160,
        maxWidth: 200,
        minWidth: 100,
      },

      {
        columnName: "Upload/View",
        componentType: "buttonRowCell",
        accessor: "SDJKCNDJKVNJKV",
        sequence: 3,
        width: 140,
        maxWidth: 180,
        minWidth: 90,
        isVisible: false,
        isVisibleInNew: true,
        __EDIT__: { isVisible: true },
      },
      // {
      //   columnName: "Action",
      //   componentType: "deleteRowCell",
      //   accessor: "_hidden",
      //   sequence: 3,
      //   width: 90,
      //   maxWidth: 120,
      //   minWidth: 90,
      // },
    ],
  },
};
