import { GridMetaDataType } from "components/dataTableStatic";

export const InwardClearingRetrievalMetadata = {
  form: {
    name: "InwardClearingForm",
    label: "Parameters",
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
        componentType: "radio",
      },
      name: "FLAG",
      label: "",
      RadioGroupProps: { row: true },
      defaultValue: "E",
      options: [
        {
          label: "Only Error",
          value: "E",
        },
        { label: "All", value: "A" },
        { label: "Confirmation Pending", value: "P" },
        { label: "Draft/Banker Cheques", value: "D" },
        { label: "Share Dividend Warrant", value: "S" },
      ],

      GridProps: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
        xl: 12,
      },
    },
    {
      render: {
        componentType: "radio",
      },
      name: "RETRIEVE",
      label: "",
      RadioGroupProps: { row: true },
      defaultValue: "E",
      options: [
        {
          label: "Enter Branch",
          value: "E",
        },
        { label: "A/C Branch", value: "A" },
      ],

      GridProps: {
        xs: 5,
        sm: 5,
        md: 5,
        lg: 5,
        xl: 5,
      },
    },
  ],
};

export const InwardCleaingGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Inward Clearing Process(TRN/650)",
    rowIdColumn: "SR_NO",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 30, 50, 80],
    defaultPageSize: 20,
    containerHeight: {
      min: "67vh",
      max: "67vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  filters: [],

  columns: [
    {
      accessor: "CHEQUE_NO",
      columnName: "Cheque No.",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 90,
      minWidth: 100,
      maxWidth: 180,
    },
    {
      accessor: "AMOUNT",
      columnName: "Amount",
      sequence: 2,
      alignment: "right",
      componentType: "currency",
      width: 100,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      accessor: "BRANCH_CD",
      columnName: "Branch Code",
      sequence: 3,
      alignment: "center",
      componentType: "default",
      placeholder: "",
      width: 120,
      minWidth: 130,
      maxWidth: 160,
    },

    {
      accessor: "ACCT_TYPE",
      columnName: "Account Type",
      sequence: 4,
      alignment: "right",
      componentType: "default",
      width: 80,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "ACCT_CD",
      columnName: "Account Number",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "ACCT_NM",
      columnName: "Account Name",
      sequence: 6,
      alignment: "center",
      componentType: "default",
      width: 200,
      minWidth: 250,
      maxWidth: 350,
    },

    {
      columnName: "",
      componentType: "buttonRowCell",
      accessor: "SIGN_PATH",
      sequence: 7,
      buttonLabel: "Cheque/Sign",
      isVisible: true,
      width: 100,
      minWidth: 120,
      maxWidth: 140,
    },
    {
      columnName: "",
      componentType: "buttonRowCell",
      accessor: "POST_CONF",
      sequence: 8,
      isVisible: true,
      width: 100,
      minWidth: 50,
      maxWidth: 150,
      isColumnName: (initialValue) => {
        if (initialValue) {
          return initialValue === "C" ? "Confirm" : "Post";
        }
      },
    },
    {
      columnName: "",
      componentType: "buttonRowCell",
      accessor: "VIEW_DETAIL",
      sequence: 9,
      buttonLabel: "View Detail",
      isVisible: true,
      width: 130,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      accessor: "CHEQUE_DT",
      columnName: "Cheque Date",
      sequence: 10,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 150,
      maxWidth: 300,
    },
    {
      accessor: "FROM_BANK_CD",
      columnName: "From Bank",
      sequence: 11,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 110,
      maxWidth: 200,
    },
    {
      accessor: "MICR_TRAN_CD",
      columnName: "MICR",
      sequence: 12,
      alignment: "left",
      componentType: "default",
      width: 75,
      minWidth: 80,
      maxWidth: 100,
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 13,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 350,
      maxWidth: 450,
    },
    {
      accessor: "WIDTH_BAL",
      columnName: "Withdraw.Balance",
      sequence: 14,
      alignment: "right",
      componentType: "currency",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "OTHER_REMARKS",
      columnName: "Mode Of Operation",
      sequence: 15,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 200,
      maxWidth: 250,
    },
  ],
};
