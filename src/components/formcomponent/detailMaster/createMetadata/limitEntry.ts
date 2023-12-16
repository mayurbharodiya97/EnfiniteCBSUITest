import { GeneralAPI } from "registry/fns/functions";
// import { getReportData } from "../detailStatic";

export const limitEntryMetadata = {
  masterForm: {
    form: {
      name: "limitEntry",
      label: "Limit Entry",
      resetFieldOnUnmount: false,
      validationRun: "onChange",
      submitAction: "home",
      hideHeader: true,
      formStyle: {
        background: "white",
        height: "calc(100vh - 390px)",
        overflowY: "auto",
        overflowX: "hidden",
      },
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
            height: "35vh",
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
      apiKey: {
        BRANCH_CD: "BRANCH_CD",
        ACCT_TYPE: "ACCT_TYPE",
        ACCT_CD: "ACCT_CD",
      },
    },
    fields: [
      {
        render: {
          componentType: "autocomplete",
        },
        name: "BRANCH_CD",
        label: "Branch",
        placeholder: "Branch Code",
        type: "text",
        required: true,
        // maxLength: 16,
        options: GeneralAPI.getBranchCodeList,
        _optionsKey: "getBranchCodeList",
        GridProps: {
          xs: 12,
          md: 3,
          sm: 3,
          lg: 3,
          xl: 3,
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
        name: "ACCT_TYPE",
        label: "AccountType",
        placeholder: "EnterAccountType",
        type: "text",
        required: true,
        options: GeneralAPI.getAccountTypeList,
        _optionsKey: "getAccountTypeList",
        GridProps: {
          xs: 12,
          md: 3,
          sm: 3,
          lg: 3,
          xl: 3,
        },
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["Account Type is required."] }],
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "ACCT_CD",
        label: "ACNo",
        placeholder: "EnterAcNo",
        type: "text",
        fullWidth: true,
        required: true,
        maxLength: 20,
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["Account No. is required."] }],
        },
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
        name: "FR",
        label: "Tran. balance",
        placeholder: "",
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
          componentType: "autocomplete",
        },
        name: "NO_OF_CHEQUE",
        label: "Limit Type",
        placeholder: "Enter no of Cheque book",
        type: "text",
        options: () => {
          return [
            { value: "Normal Limit", label: "Normal Limit" },
            { value: "Ad-hoc Limit", label: "Ad-hoc Limit" },
          ];
        },
        _optionsKey: "getChequeLeavesList",
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
          lg: 2.5,
          xl: 2.5,
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "SECURITY_CODE",
        label: "Security",
        placeholder: "",
        type: "text",
        isReadOnly: true,
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
          lg: 2.5,
          xl: 2.5,
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "SERVICE_CHARGE",
        label: "San. Limit",
        placeholder: "",
        type: "text",
        required: true,
        GridProps: {
          xs: 12,
          md: 2,
          sm: 2,
          lg: 2,
          xl: 2,
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "GST",
        label: "Type",
        placeholder: "",
        type: "text",
        required: true,
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
          lg: 2.5,
          xl: 2.5,
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "REQUISITION_DT",
        // sequence: 9,
        label: "FD No.",
        placeholder: "",
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
          lg: 2.5,
          xl: 2.5,
        },
      },
      {
        render: {
          componentType: "datePicker",
        },
        name: "REQUTION_DT",
        // sequence: 9,
        label: "Entry",
        placeholder: "",
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
          componentType: "datePicker",
        },
        name: "REQUTION_D",
        // sequence: 9,
        label: "Effective",
        placeholder: "",
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
          componentType: "datePicker",
        },
        name: "EXPIRY_DT",
        // sequence: 9,
        label: "Expiry",
        placeholder: "",
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
          componentType: "datePicker",
        },
        name: "RESOLUTION_DATE",
        // sequence: 9,
        label: "Resolution",
        placeholder: "",
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
        name: "ACCT_M",
        // sequence: 1,
        label: "Sec. Value",
        type: "text",
        // required: true,
        // maxLength: 16,
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
        name: "REMARKS",
        // sequence: 10,
        label: "Margin %",
        placeholder: "Enter remark.",
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
        name: "REMARKS",
        // sequence: 10,
        label: "Sec. Limit",
        placeholder: "Enter remark.",
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
        name: "REMARKS",
        // sequence: 10,
        label: "Over Drawn %",
        placeholder: "Enter remark.",
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
        name: "REMARKS",
        // sequence: 10,
        label: "Int. Amount",
        placeholder: "Enter remark.",
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
        name: "REMARKS",
        // sequence: 10,
        label: "Int. Margin %",
        placeholder: "Enter remark.",
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
        name: "REMARKS",
        // sequence: 10,
        label: "Sec. Int. Limit",
        placeholder: "Enter remark.",
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
        name: "LIMIT_AMOUNT",
        // sequence: 10,
        label: "Limit Amount",
        placeholder: "Enter remark.",
        GridProps: {
          xs: 12,
          md: 3,
          sm: 3,
          lg: 3,
          xl: 3,
        },
      },
    ],
  },
  detailsGrid: {
    gridConfig: {
      dense: true,
      gridLabel: "Limit Entry",
      rowIdColumn: "TRAN_CD",
      defaultColumnConfig: {
        width: 150,
        maxWidth: 250,
        minWidth: 100,
      },
      allowColumnReordering: true,
      disableSorting: false,
      disableGroupBy: true,
      enablePagination: true,
      hideFooter: true,
      pageSizes: [10, 20, 30],
      defaultPageSize: 10,
      containerHeight: {
        min: "31vh",
        max: "31vh",
      },
      allowFilter: false,
      allowColumnHiding: false,
      allowRowSelection: false,
    },
    filters: [],
    columns: [
      {
        accessor: "ID",
        columnName: "Sr.No.",
        sequence: 1,
        alignment: "center",
        componentType: "default",
        width: 70,
        minWidth: 70,
        maxWidth: 200,
        isAutoSequence: true,
      },
      {
        accessor: "ENTRY_DT",
        columnName: "Entry Date",
        sequence: 2,
        alignment: "center",
        componentType: "date",
        dateFormat: "dd/MM/yyyy",
        width: 120,
        minWidth: 100,
        maxWidth: 200,
      },
      {
        accessor: "TT",
        columnName: "Effective Date",
        sequence: 3,
        alignment: "center",
        componentType: "date",
        dateFormat: "dd/MM/yyyy",
        width: 120,
        minWidth: 100,
        maxWidth: 200,
      },
      {
        accessor: "EXPIRY_DT",
        columnName: "Expiry Date",
        sequence: 3,
        alignment: "center",
        componentType: "date",
        dateFormat: "dd/MM/yyyy",
        width: 120,
        minWidth: 100,
        maxWidth: 200,
      },
      {
        accessor: "INT_RATE",
        columnName: "Int Rate",
        sequence: 4,
        alignment: "center",
        componentType: "default",
        width: 120,
        minWidth: 100,
        maxWidth: 200,
        isVisible: true,
      },
      {
        accessor: "MARGIN",
        columnName: "Margin",
        sequence: 5,
        alignment: "center",
        componentType: "default",
        width: 120,
        minWidth: 150,
        maxWidth: 200,
      },
      {
        accessor: "PENAL_RATE",
        columnName: "Over Rate",
        sequence: 6,
        alignment: "center",
        componentType: "default",
        width: 120,
        minWidth: 100,
        maxWidth: 400,
      },
      {
        accessor: "SECURITY_CODE",
        columnName: "Security Value",
        sequence: 6,
        alignment: "center",
        componentType: "default",
        width: 120,
        minWidth: 100,
        maxWidth: 400,
      },
      {
        accessor: "LIMIT_AMOUNT",
        columnName: "Limit Amount",
        sequence: 7,
        alignment: "center",
        componentType: "default",
        width: 120,
        minWidth: 120,
        maxWidth: 250,
      },
      {
        accessor: "SE",
        columnName: "Description",
        sequence: 8,
        alignment: "center",
        componentType: "default",
        width: 120,
        minWidth: 100,
        maxWidth: 200,
      },
      {
        accessor: "REMARKS",
        columnName: "Resolution Date",
        sequence: 9,
        alignment: "center",
        componentType: "date",
        width: 150,
        minWidth: 100,
        maxWidth: 200,
      },
      {
        accessor: "FORCE_EXP_DT",
        columnName: "Force Expire",
        sequence: 10,
        alignment: "center",
        componentType: "date",
        width: 120,
        minWidth: 100,
        maxWidth: 200,
        // color: (value) => {
        //   if ((value || "unlock").toLowerCase() === "unlock") {
        //     return "green";
        //   }
        //   return "red";
        // },
      },
    ],
  },
};
