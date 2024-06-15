import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
export const stockViewEditMSTMetaData: MasterDetailsMetaData = {
  masterForm: {
    form: {
      name: "Upload-View-doc",
      label: "ViewUploadDocument",
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
        label: "BranchCode",
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
        label: "AccountType",
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
        label: "AccountNumber",
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
        label: "AccountName",
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
        label: "AccountLimitAmt",
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
        label: "StatementDate",
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
        label: "StatementValidTillDate",
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
        label: "NoOfShare",
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
        label: "StockValue",
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
        label: "Margin%",
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
        label: "RecievedDate",
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
        label: "StockDescription",
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
        label: "DrawingPower",
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
      containerHeight: { min: "29vh", max: "29vh" },
      allowRowSelection: false,
      hiddenFlag: "_hidden",
      disableLoader: false,
      // paginationText: "Configured Messages",
    },
    columns: [
      {
        accessor: "SR_CDZ",
        columnName: "SrNo",
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
        columnName: "DocumentDescription",
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
        // isReadOnly: true,
        // __EDIT__: { isReadOnly: false, componentType: "editableTextField" },
      },
      {
        accessor: "ACTIVE",
        columnName: "Active",
        componentType: "editableCheckbox",
        alignment: "center",
        // defaultValue: "Y",
        isReadOnly: true,
        sequence: 2,
        width: 80,
        minWidth: 70,
        maxWidth: 120,
      },
      {
        accessor: "DOC_DATA",
        columnName: "DocumentImage",
        componentType: "icondefault",
        sequence: 2,
        alignment: "center",
        width: 140,
        maxWidth: 180,
        minWidth: 90,
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
        },
      },

      {
        columnName: "ViewUploadDocument",
        componentType: "buttonRowCell",
        accessor: "VIEW_DOC",
        alignment: "center",
        buttonLabel: "",
        sequence: 3,
        width: 164,
        maxWidth: 180,
        minWidth: 90,
        isVisible: true,
        isVisibleInNew: true,
        isColumnName: (initialValue, original) => {
          return original?.DOC_DATA ? "View" : "Upload";
        },
        shouldExclude: (initialValue, original) => {
          if (original?.DOC_DEC) {
            return false;
          }
          return true;
        },
      },
      {
        columnName: "DocumentDownload",
        componentType: "buttonRowCell",
        accessor: "DOWNLOAD",
        alignment: "center",
        buttonLabel: "Download",
        sequence: 3,
        width: 160,
        maxWidth: 180,
        minWidth: 120,
        isVisible: true,
        isVisibleInNew: true,
        shouldExclude: (initialValue, original) => {
          if (original?.DOC_DATA) {
            return false;
          }
          return true;
        },
      },
      {
        columnName: "Action",
        buttonLabel: "Delete",
        componentType: "deleteRowCell",
        accessor: "_hidden",
        sequence: 3,
        width: 90,
        alignment: "center",
        maxWidth: 120,
        minWidth: 90,
        shouldExclude: (initialValue, original) => {
          if (Boolean(original?._isNewRow)) {
            return false;
          }
          return true;
        },
      },
    ],
  },
};
