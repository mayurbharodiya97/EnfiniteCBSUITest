import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
export const stockViewEditMSTMetaData: MasterDetailsMetaData = {
  masterForm: {
    form: {
      name: "Upload-View-doc",
      label: "Upload-View Document",
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
        isReadOnly: true,
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
        isReadOnly: true,
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
        fullWidth: true,
        isReadOnly: true,
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
        fullWidth: true,
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
        fullWidth: true,
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
          componentType: "textField",
        },
        name: "ACCT_MST_LIMIT",
        fullWidth: true,
        label: "Account Limit Amount",
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
          componentType: "textField",
        },
        fullWidth: true,
        name: "SECURITY_CD",
        label: "Security",

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
          componentType: "datePicker",
        },
        fullWidth: true,
        name: "TRAN_DT",
        isReadOnly: true,
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
        name: "ASON_DT",
        fullWidth: true,
        isReadOnly: true,
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
          componentType: "textField",
        },
        name: "NO_OF_SHARE",
        fullWidth: true,
        label: "No. of Share",
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
          componentType: "textField",
        },
        name: "STOCK_VALUE",
        fullWidth: true,
        label: "Stock Value",
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
          componentType: "textField",
        },
        name: "MARGIN",
        fullWidth: true,
        label: "Margin",
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
          componentType: "datePicker",
        },
        name: "RECEIVED_DT",
        label: "Received Date",
        fullWidth: true,
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
          componentType: "textField",
        },
        name: "STOCK_DESC",
        label: "Stock Decription",
        fullWidth: true,
        isReadOnly: true,
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
        isReadOnly: true,
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
        isReadOnly: true,
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
          componentType: "hidden",
        },
        name: "TRAN_CD",
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "ENTERED_COMP_CD",
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "ENTERED_BRANCH_CD",
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
      enablePagination: false,
      containerHeight: { min: "40vh", max: "40vh" },
      allowRowSelection: false,
      hiddenFlag: "_hidden",
      disableLoader: true,
      // paginationText: "Configured Messages",
    },
    columns: [
      {
        accessor: "SR_CDZ",
        columnName: "Sr No.",
        componentType: "default",
        sequence: 1,
        alignment: "center",
        width: 75,
        minWidth: 50,
        maxWidth: 100,
        isAutoSequence: true,
      },
      {
        accessor: "DOC_DEC",
        columnName: "Document Description",
        componentType: "editableTextField",
        placeholder: " ",
        sequence: 2,
        alignment: "left",
        width: 300,
        minWidth: 200,
        maxWidth: 400,
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["This field is required"] }],
        },
      },
      {
        accessor: "ACTIVE",
        columnName: "Active",
        componentType: "editableCheckbox",
        alignment: "center",
        sequence: 2,
        width: 80,
        minWidth: 70,
        maxWidth: 120,
      },
      {
        accessor: "DOC_DATA",
        columnName: "Document Data",
        componentType: "default",
        sequence: 2,
        isVisible: false,
      },

      {
        columnName: "Upload/View",
        componentType: "buttonRowCell",
        accessor: "VIEW_UPLOAD",
        sequence: 3,
        width: 140,
        maxWidth: 180,
        minWidth: 90,
        isVisible: true,
        isVisibleInNew: true,
        shouldExclude: (initialValue, original) => {
          if (original?.DOC_DEC) {
            return false;
          }
          return true;
        },
      },
      {
        columnName: "Action",
        componentType: "deleteRowCell",
        accessor: "_hidden",
        sequence: 3,
        width: 90,
        maxWidth: 120,
        minWidth: 90,
        shouldExclude: (initialValue, original) => {
          if (Boolean(original?._isNewRow)) {
            return false;
          }
          return true;
        },
      },

      {
        accessor: "COMP_CD",
        columnName: "",
        componentType: "default",
        isVisible: false,
        sequence: 2,
      },
      {
        accessor: "ACCT_TYPE",
        columnName: "",
        componentType: "default",
        isVisible: false,
        sequence: 2,
      },
      {
        accessor: "ACCT_CD",
        columnName: "",
        componentType: "default",
        isVisible: false,
        sequence: 2,
      },
      {
        accessor: "ENTERED_BRANCH_CD",
        columnName: "",
        componentType: "default",
        isVisible: false,
        sequence: 2,
      },
      {
        accessor: "ENTERED_COMP_CD",
        columnName: "",
        componentType: "default",
        isVisible: false,
        sequence: 2,
      },
      {
        accessor: "REF_TRAN_CD",
        columnName: "",
        componentType: "default",
        isVisible: false,
        sequence: 2,
      },
      {
        accessor: "REF_SR_CD",
        columnName: "",
        componentType: "default",
        isVisible: false,
        sequence: 2,
      },
      {
        accessor: "SR_CD",
        columnName: "",
        componentType: "default",
        isVisible: false,
        sequence: 2,
      },
      {
        accessor: "TABLE_NM",
        columnName: "",
        componentType: "default",
        isVisible: false,
        sequence: 2,
      },
    ],
  },
};
