import { GridMetaDataType } from "@acuteinfo/common-base";

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
          label: "OnlyError",
          value: "E",
        },
        { label: "All", value: "A" },
        { label: "ConfirmationPending", value: "P" },
        { label: "DraftBankerCheques", value: "D" },
        { label: "ShareDividendWarrant", value: "S" },
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
          label: "EnterBranch",
          value: "E",
        },
        { label: "ACBranch", value: "A" },
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
    gridLabel: "",
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
    hideActionBar: true,
  },
  filters: [],

  columns: [
    {
      accessor: "CHEQUE_NO",
      columnName: "ChequeNo",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 110,
      minWidth: 100,
      maxWidth: 200,
      isDisplayTotal: true,
      footerLabel: "Total Cheques :",
      setFooterValue(total, rows) {
        return [rows.length ?? 0];
      },
    },
    {
      accessor: "AMOUNT",
      columnName: "Amount",
      sequence: 2,
      alignment: "right",
      componentType: "currency",
      width: 150,
      minWidth: 100,
      maxWidth: 350,
      isDisplayTotal: true,
      footerLabel: "Total Amount :",
      setFooterValue(total, rows) {
        // Filter rows where TYPE_CD is 1, 2, or 3
        const sum =
          rows?.reduce(
            (acc, { original }) => acc + Number(original.AMOUNT),
            0
          ) ?? 0;
        const formattedSum = sum.toFixed(2);
        return [formattedSum];
      },
    },
    {
      accessor: "BRANCH_CD",
      columnName: "BranchCode",
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
      columnName: "AccountType",
      sequence: 4,
      alignment: "right",
      componentType: "default",
      width: 80,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "ACCT_CD",
      columnName: "AccountNo",
      sequence: 5,
      alignment: "center",
      componentType: "default",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "ACCT_NM",
      columnName: "AccountName",
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
      buttonLabel: "ChequeSign",
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
      setButtonName: (initialValue) => {
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
      buttonLabel: "ViewDetail",
      isVisible: true,
      width: 130,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      accessor: "CHEQUE_DT",
      columnName: "ChequeDate",
      sequence: 10,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 100,
      minWidth: 150,
      maxWidth: 300,
    },
    {
      accessor: "FROM_BANK_CD",
      columnName: "FromBank",
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
      columnName: "WithdrawBalance",
      sequence: 14,
      alignment: "right",
      componentType: "currency",
      width: 170,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "OTHER_REMARKS",
      columnName: "ModeOfOperation",
      sequence: 15,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 200,
      maxWidth: 250,
    },
  ],
};
