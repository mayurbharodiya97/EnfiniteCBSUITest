import { GridMetaDataType } from "components/dataTableStatic";
import { isValid } from "date-fns";

export const RetrieveFormConfigMetaData = {
  form: {
    name: "RetrieveFormConfigMetaData",
    label: "RTGS/NEFT Retrieve Information",
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
        componentType: "spacer",
      },

      GridProps: {
        xs: 0,
        md: 1,
        sm: 3.9,
        lg: 3.9,
        xl: 3.9,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "FROM_DT",
      label: "From Date",
      placeholder: "",
      fullWidth: true,
      format: "dd/MM/yyyy",
      GridProps: { xs: 12, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["From Date is required."] }],
      },
      validate: (value) => {
        if (Boolean(value?.value) && !isValid(value?.value)) {
          return "Must be a valid date";
        }
        return "";
      },
      onFocus: (date) => {
        date.target.select();
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "TO_DT",
      label: "To Date",
      placeholder: "",
      fullWidth: true,
      format: "dd/MM/yyyy",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["To Date is required."] }],
      },
      validate: (currentField, dependentField) => {
        if (Boolean(currentField?.value) && !isValid(currentField?.value)) {
          return "Must be a valid date";
        }
        if (
          new Date(currentField?.value) <
          new Date(dependentField?.FROM_DT?.value)
        ) {
          return "To Date should be greater than or equal to From Date.";
        }
        return "";
      },
      onFocus: (date) => {
        date.target.select();
      },
      dependentFields: ["FROM_DT"],
      runValidationOnDependentFieldsChange: true,
      GridProps: { xs: 12, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "RETRIEVE",
      label: "Retrieve",
      endsIcon: "YoutubeSearchedFor",
      rotateIcon: "scale(1.5)",
      placeholder: "",
      type: "text",
      GridProps: { xs: 1.2, sm: 1.2, md: 1.2, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "VIEW_ALL",
      label: "View All",
      endsIcon: "YoutubeSearchedFor",
      rotateIcon: "scale(1.5)",
      placeholder: "",
      type: "text",
      GridProps: { xs: 1.2, sm: 1.2, md: 1.2, lg: 1, xl: 1 },
    },
  ],
};
export const RtgsConfirmGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Retrieve Grid",
    rowIdColumn: "SR_NO",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [15, 25, 50],
    defaultPageSize: 15,
    containerHeight: {
      min: "48vh",
      max: "48vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
  },
  filters: [],
  columns: [
    {
      accessor: "id",
      columnName: "Sr.No.",
      sequence: 1,
      alignment: "rigth",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "TRAN_TYPE",
      columnName: "Entry Type",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "MSG_FLOW",
      columnName: "Msg Flow",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    }, {
      accessor: "TRAN_DT",
      columnName: "Tran Date",
      sequence: 4,
      alignment: "left",
      componentType: "date",
      placeholder: "",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },

    {
      accessor: "SLIP_NO",
      columnName: "Slip No.",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "BR_IFSCCODE",
      columnName: "Br Ifsc Code",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },


    {
      accessor: "COMP_CD",
      columnName: "Bank",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "BRANCH_CD",
      columnName: "Branch",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "ACCT_TYPE",
      columnName: "Type",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "ACCT_CD",
      columnName: "A/C No.",
      sequence: 10,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },
    {
      accessor: "ACCT_NM",
      columnName: "Name",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 350,
      minWidth: 380,
      maxWidth: 400,
    },
    {
      accessor: "CHEQUE_NO",
      columnName: "Cheque",
      sequence: 12,
      alignment: "left",
      componentType: "date",
      placeholder: "",
      width: 150,
      minWidth: 120,
      maxWidth: 200,
      dateFormat: "dd/MM/yyyy HH:mm:ss",
    },
    {
      accessor: "AMOUNT",
      columnName: "Amount",
      sequence: 13,
      alignment: "left",
      componentType: "currency",
      placeholder: "",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "COMM_AMT",
      columnName: "Comm. Amount",
      sequence: 14,
      alignment: "left",
      componentType: "currency",
      placeholder: "",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "SER_CHRG_AMT",
      columnName: "Service Charge Amount",
      sequence: 15,
      alignment: "left",
      componentType: "currency",
      placeholder: "",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },

    {
      accessor: "ENTERED_BY",
      columnName: "User",
      sequence: 16,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "BR_CONFIRMED",
      columnName: "Br Confirmed",
      sequence: 17,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },

    {
      accessor: "VERIFIED_BY",
      columnName: "Verified By",
      sequence: 18,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "VERIFIED_DATE",
      columnName: "Verified Date",
      sequence: 19,
      alignment: "left",
      componentType: "date",
      placeholder: "",
      width: 150,
      minWidth: 120,
      maxWidth: 200,
      dateFormat: "dd/MM/yyyy HH:mm:ss",
    },
    {
      accessor: "HO_CONFIRM",
      columnName: "Ho Confirmed",
      sequence: 20,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "HO_VERIFIED_BY",
      columnName: "Ho. Verified By",
      sequence: 21,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "MSG_RELEASE",
      columnName: "Msg Release",
      sequence: 22,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "DEF_TRAN_CD",
      columnName: "Def.Tran Cd",
      sequence: 23,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 110,
      minWidth: 80,
      maxWidth: 200,
    },
  ],
};

export const DualConfHistoryGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Dual Confirmation History",
    rowIdColumn: "TRAN_CD",
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
    pageSizes: [15, 25, 50],
    defaultPageSize: 15,
    containerHeight: {
      min: "50vh",
      max: "50vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
  },
  filters: [],
  columns: [
    {
      accessor: "ID",
      columnName: "Sr.No.",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 70,
      maxWidth: 200,
      isAutoSequence: true,
    },
    {
      accessor: "TRN_CONF_CNT",
      columnName: "Entry Type",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "ENTERED_BY",
      columnName: "Enter By",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "Date",
      sequence: 4,
      alignment: "left",
      componentType: "date",
      placeholder: "",
      width: 100,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      accessor: "MACHINE_NM",
      columnName: "Machine",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    },
  ],
};


export const RtgsOrderingBranchConfirmFormMetaData = {
  form: {
    name: "rtgsEntry",
    label: "RTGS Entry(MST/552)",
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
        componentType: "autocomplete",
      },
      name: "ENTRY_TYPE",
      label: "RTGS/NEFT",
      defaultValue: "RTGS",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "TRAN_DT",
      label: "Date",
      placeholder: "",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "TRAN_TYPE",
      label: "Transaction Type",
      defaultValue: "R42",
      GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
      disableCaching: true,

    },

    {
      render: {
        componentType: "hidden",
      },
      name: "BR_CONFIRMED",
      label: "",
      type: "text",

      GridProps: { xs: 6, sm: 1, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SLIP_NO",
      label: "Slip No.",
      type: "text",
      GridProps: { xs: 6, sm: 1.1, md: 1.1, lg: 1.1, xl: 1.1 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "DEF_TRAN_CD",
      label: "Comm. Type",
      defaultValue: "149",
      GridProps: { xs: 12, sm: 2.4, md: 2.4, lg: 2.4, xl: 2.4 },
    },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "BR_IFSCCODE",
      label: "IFSC",
      defaultValue: "SBI0000KBCB",
      GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },
    {
      render: {
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2.2 },
        textFieldStyle: {
          "& .MuiInputBase-root": {
            background: "var(--theme-color5)",
            color: "var(--theme-color2) !important",
          },
          "& .MuiInputBase-input": {
            background: "var(--theme-color5)",
            color: "var(--theme-color2) !important",
            "&.Mui-disabled": {
              color: "var(--theme-color2) !important",
              "-webkit-text-fill-color": "var(--theme-color2) !important",
            },
          },
        },
      },
      accountTypeMetadata: {
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2.2 },
        isFieldFocused: true,
        defaultfocus: true,
        textFieldStyle: {
          "& .MuiInputBase-root": {
            background: "var(--theme-color5)",
            color: "var(--theme-color2) !important",
          },
          "& .MuiInputBase-input": {
            background: "var(--theme-color5)",
            color: "var(--theme-color2) !important",
            "&.Mui-disabled": {
              color: "var(--theme-color2) !important",
              "-webkit-text-fill-color": "var(--theme-color2) !important",
            },
          },
        },
      },
      accountCodeMetadata: {
        fullWidth: true,
        textFieldStyle: {
          "& .MuiInputBase-input": {
            background: "var(--theme-color5)",
            color: "var(--theme-color2) !important",
            "&.Mui-disabled": {
              color: "var(--theme-color2) !important",
              "-webkit-text-fill-color": "var(--theme-color2) !important",
            },
          },
        },
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "PARA_BNFCRY",
      label: "",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TYPE_CD",
      label: "",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NAME",
      label: "A/C Name",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 3.5, md: 3.5, lg: 3.5, xl: 3.3 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TRAN_BAL",
      label: "Shadow.Balance",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "LIMIT_AMOUNT",
      label: "Limit",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_MODE",
      label: "A/C Mode",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "Ord.A/C Name",
      type: "text",
      fullWidth: true,
      GridProps: { xs: 12, sm: 3.5, md: 3.5, lg: 3.5, xl: 3.5 },
      required: true,
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD1",
      label: "A/C Address",
      type: "text",
      fullWidth: true,

      GridProps: { xs: 12, sm: 3.3, md: 3.3, lg: 3.3, xl: 3.3 },

    },

    {
      render: {
        componentType: "phoneNumber",
      },
      name: "CONTACT_INFO",
      label: "Contact Number",
      placeholder: "Mobile Number",
      type: "string",
      GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_NO",
      label: "Cheque No.",
      placeholder: "Cheque No.",
      type: "text",
      autoComplete: "off",
      GridProps: { xs: 6, sm: 1.3, md: 1.3, lg: 1.3, xl: 1.3 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "CHEQUE_DT",
      label: "Cheque Date",
      placeholder: "",
      format: "dd/MM/yyyy",
      type: "text",
      GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      label: "Remarks",
      type: "text",
      GridProps: { xs: 12, sm: 3.6, md: 3.6, lg: 3.6, xl: 3.6 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "AMOUNT",
      label: "Amount",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "COMM_AMT",
      label: "Comm.",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 1.2,
        sm: 1.2,
        lg: 1.2,
        xl: 1.2,
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ENABLE_DISABLE",
      label: "",

    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SER_CHRG_AMT",
      label: "GST",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 1.2,
        sm: 1.2,
        lg: 1.2,
        xl: 1.2,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TOTAL",
      label: "Total Amount",
      placeholder: "",
      type: "text",
      FormatProps: {
        allowNegative: false,
      },
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.2, md: 2.2, lg: 2.2, xl: 2.2 },

      dependentFields: ["AMOUNT", "SER_CHRG_AMT", "COMM_AMT"],

      setValueOnDependentFieldsChange: (dependentFields) => {
        let value =
          parseInt(dependentFields?.SER_CHRG_AMT?.value) +
          parseInt(dependentFields?.AMOUNT?.value) +
          parseInt(dependentFields?.COMM_AMT?.value);
        return value ?? "--";
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ENTERED_BY",
      label: "Maker",
      placeholder: "",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      __VIEW__: { render: { componentType: "textField" } },
      __EDIT__: { render: { componentType: "textField" } },
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 2.5 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ENTERED_DATE",
      label: "Maker Time",
      placeholder: "",
      type: "text",
      format: "dd/MM/yyyy HH:mm:ss",
      __VIEW__: { render: { componentType: "datetimePicker" } },
      __EDIT__: { render: { componentType: "datetimePicker" } },
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "CONF_STATUS",
      label: "Confirm status",
      placeholder: "",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      __VIEW__: { render: { componentType: "textField" } },
      __EDIT__: { render: { componentType: "textField" } },
      GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
    },

    // {
    //   render: {
    //     componentType: "typography",
    //   },
    //   name: "A/C Balance",
    //   label: "A/C Balance",
    //   GridProps: { xs: 12, sm: 12, md: 12 },
    //   TypographyProps: {
    //     style: {
    //       // color: "red",
    //       whiteSpace: "pre-line",
    //       fontSize: "1rem",
    //       // position: "absolute",
    //       // bottom: 0,
    //     },
    //   },
    // },
    // {
    //   render: {
    //     componentType: "autocomplete",
    //   },
    //   name: "HO_TRAN_TYPE",
    //   label: "Transaction Type",
    //   defaultValue: "R42",
    //   GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
    //   disableCaching: true,

    // },
    // {
    //   render: {
    //     componentType: "textField",
    //   },
    //   name: "HO_ACCT_CD",
    //   label: "A/C No.",
    //   placeholder: "",
    //   type: "text",
    //   isReadOnly: true,
    //   GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 2.5 },
    // },
    // {
    //   render: {
    //     componentType: "textField",
    //   },
    //   name: "ACCT_NM",
    //   label: "A/C Name.",
    //   placeholder: "",
    //   type: "text",
    //   isReadOnly: true,
    //   GridProps: { xs: 12, sm: 3.9, md: 3.9, lg: 3.9, xl: 3.9 },
    // },
    // {
    //   render: {
    //     componentType: "textField",
    //   },
    //   name: "WITH_BAL",
    //   label: "A/C Balance",
    //   placeholder: "",
    //   type: "text",
    //   isReadOnly: true,
    //   GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 2.5 },
    // },

    // {
    //   render: {
    //     componentType: "hidden",
    //   },
    //   name: "VERIFIED_BY",
    //   label: "Checker",
    //   placeholder: "",
    //   type: "text",
    //   fullWidth: true,
    //   isReadOnly: true,
    //   dependentFields: ["CONFIRMED"],
    //   __VIEW__: { render: { componentType: "textField" } },
    //   shouldExclude: (_, dependentFieldsValues, __) => {
    //     if (dependentFieldsValues?.CONFIRMED?.value === "Pending") {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   },
    //   GridProps: { xs: 12, sm: 1.3, md: 1.2, lg: 1.2, xl: 1.5 },
    // },
    // {
    //   render: {
    //     componentType: "hidden",
    //   },
    //   name: "VERIFIED_DATE",
    //   label: "Checker Time",
    //   placeholder: "",
    //   type: "text",
    //   format: "dd/MM/yyyy HH:mm:ss",
    //   __VIEW__: { render: { componentType: "datetimePicker" } },
    //   fullWidth: true,
    //   isReadOnly: true,
    //   dependentFields: ["CONFIRMED"],
    //   shouldExclude: (_, dependentFieldsValues, __) => {
    //     if (dependentFieldsValues?.CONFIRMED?.value === "Pending") {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   },
    //   GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
    // },
  ],
};
export const RtgsOrderingHOConfirmFormMetaData = {
  form: {
    name: "rtgsEntry",
    label: "RTGS Entry(MST/552)",
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
        componentType: "autocomplete",
      },
      name: "ENTRY_TYPE",
      label: "RTGS/NEFT",
      defaultValue: "RTGS",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "TRAN_DT",
      label: "Date",
      placeholder: "",
      isReadOnly: true,
      GridProps: { xs: 6, sm: 1.5, md: 1.5, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "TRAN_TYPE",
      label: "Transaction Type",
      defaultValue: "R42",
      GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
      disableCaching: true,

    },

    {
      render: {
        componentType: "hidden",
      },
      name: "BR_CONFIRMED",
      label: "",
      type: "text",

      GridProps: { xs: 6, sm: 1, md: 1, lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SLIP_NO",
      label: "Slip No.",
      type: "text",
      GridProps: { xs: 6, sm: 1.1, md: 1.1, lg: 1.1, xl: 1.1 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "HO_DEF_TRAN_CD",
      label: "Ho Comm. Type",
      defaultValue: "149",
      GridProps: { xs: 12, sm: 2.4, md: 2.4, lg: 2.4, xl: 2.4 },
    },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "BR_IFSCCODE",
      label: "IFSC",
      defaultValue: "SBI0000KBCB",
      GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },
    {
      render: {
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2.2 },
        textFieldStyle: {
          "& .MuiInputBase-root": {
            background: "var(--theme-color5)",
            color: "var(--theme-color2) !important",
          },
          "& .MuiInputBase-input": {
            background: "var(--theme-color5)",
            color: "var(--theme-color2) !important",
            "&.Mui-disabled": {
              color: "var(--theme-color2) !important",
              "-webkit-text-fill-color": "var(--theme-color2) !important",
            },
          },
        },
      },
      accountTypeMetadata: {
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2.2 },
        isFieldFocused: true,
        defaultfocus: true,
        textFieldStyle: {
          "& .MuiInputBase-root": {
            background: "var(--theme-color5)",
            color: "var(--theme-color2) !important",
          },
          "& .MuiInputBase-input": {
            background: "var(--theme-color5)",
            color: "var(--theme-color2) !important",
            "&.Mui-disabled": {
              color: "var(--theme-color2) !important",
              "-webkit-text-fill-color": "var(--theme-color2) !important",
            },
          },
        },
      },
      accountCodeMetadata: {
        fullWidth: true,
        textFieldStyle: {
          "& .MuiInputBase-input": {
            background: "var(--theme-color5)",
            color: "var(--theme-color2) !important",
            "&.Mui-disabled": {
              color: "var(--theme-color2) !important",
              "-webkit-text-fill-color": "var(--theme-color2) !important",
            },
          },
        },
        GridProps: { xs: 12, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "PARA_BNFCRY",
      label: "",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TYPE_CD",
      label: "",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NAME",
      label: "A/C Name",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 3.5, md: 3.5, lg: 3.5, xl: 3.3 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TRAN_BAL",
      label: "Shadow.Balance",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "LIMIT_AMOUNT",
      label: "Limit",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_MODE",
      label: "A/C Mode",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "Ord.A/C Name",
      type: "text",
      fullWidth: true,
      GridProps: { xs: 12, sm: 3.5, md: 3.5, lg: 3.5, xl: 3.5 },
      required: true,
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD1",
      label: "A/C Address",
      type: "text",
      fullWidth: true,

      GridProps: { xs: 12, sm: 3.3, md: 3.3, lg: 3.3, xl: 3.3 },

    },

    {
      render: {
        componentType: "phoneNumber",
      },
      name: "CONTACT_INFO",
      label: "Contact Number",
      placeholder: "Mobile Number",
      type: "string",
      GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CHEQUE_NO",
      label: "Cheque No.",
      placeholder: "Cheque No.",
      type: "text",
      autoComplete: "off",
      GridProps: { xs: 6, sm: 1.3, md: 1.3, lg: 1.3, xl: 1.3 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "CHEQUE_DT",
      label: "Cheque Date",
      placeholder: "",
      format: "dd/MM/yyyy",
      type: "text",
      GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      label: "Remarks",
      type: "text",
      GridProps: { xs: 12, sm: 3.6, md: 3.6, lg: 3.6, xl: 3.6 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "AMOUNT",
      label: "Amount",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "COMM_AMT",
      label: "Comm.",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 1.2,
        sm: 1.2,
        lg: 1.2,
        xl: 1.2,
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ENABLE_DISABLE",
      label: "",

    },
    {
      render: {
        componentType: "amountField",
      },
      name: "SER_CHRG_AMT",
      label: "GST",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 1.2,
        sm: 1.2,
        lg: 1.2,
        xl: 1.2,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "TOTAL",
      label: "Total Amount",
      placeholder: "",
      type: "text",
      FormatProps: {
        allowNegative: false,
      },
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.2, md: 2.2, lg: 2.2, xl: 2.2 },

      dependentFields: ["AMOUNT", "SER_CHRG_AMT", "COMM_AMT"],

      setValueOnDependentFieldsChange: (dependentFields) => {
        let value =
          parseInt(dependentFields?.SER_CHRG_AMT?.value) +
          parseInt(dependentFields?.AMOUNT?.value) +
          parseInt(dependentFields?.COMM_AMT?.value);
        return value ?? "--";
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ENTERED_BY",
      label: "Maker",
      placeholder: "",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      __VIEW__: { render: { componentType: "textField" } },
      __EDIT__: { render: { componentType: "textField" } },
      GridProps: { xs: 12, sm: 1.2, md: 1.2, lg: 1.2, xl: 1.2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ENTERED_DATE",
      label: "Maker Time",
      placeholder: "",
      type: "text",
      format: "dd/MM/yyyy HH:mm:ss",
      __VIEW__: { render: { componentType: "datetimePicker" } },
      __EDIT__: { render: { componentType: "datetimePicker" } },
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.2, md: 2.2, lg: 2.2, xl: 2.2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "VERIFIED_BY",
      label: "Br.Confirmed By",
      placeholder: "",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      __VIEW__: { render: { componentType: "textField" } },
      __EDIT__: { render: { componentType: "textField" } },
      GridProps: { xs: 12, sm: 2.2, md: 2.2, lg: 2.2, xl: 2.2 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "HO_VERIFIED_BY",
      label: "Ho Verified By",
      placeholder: "",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      __VIEW__: { render: { componentType: "textField" } },
      __EDIT__: { render: { componentType: "textField" } },
      GridProps: { xs: 12, sm: 2.2, md: 2.2, lg: 2.2, xl: 2.2 },
    },


    {
      render: {
        componentType: "hidden",
      },
      name: "CONF_STATUS",
      label: "Confirm status",
      placeholder: "",
      type: "text",
      fullWidth: true,
      isReadOnly: true,
      __VIEW__: { render: { componentType: "textField" } },
      __EDIT__: { render: { componentType: "textField" } },
      GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
    },

    {
      render: {
        componentType: "typography",
      },
      name: "A/C Balance",
      label: "A/C Balance",
      GridProps: { xs: 12, sm: 12, md: 12 },
      TypographyProps: {
        style: {
          // color: "red",
          whiteSpace: "pre-line",
          fontSize: "1rem",
          // position: "absolute",
          // bottom: 0,
        },
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "HO_TRAN_TYPE",
      label: "Transaction Type",
      defaultValue: "R42",
      GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
      disableCaching: true,

    },
    {
      render: {
        componentType: "textField",
      },
      name: "HO_ACCT_CD",
      label: "A/C No.",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 2.5 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "A/C Name.",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 3.9, md: 3.9, lg: 3.9, xl: 3.9 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "WITH_BAL",
      label: "A/C Balance",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 2.5, xl: 2.5 },
    },

    // {
    //   render: {
    //     componentType: "hidden",
    //   },
    //   name: "VERIFIED_BY",
    //   label: "Checker",
    //   placeholder: "",
    //   type: "text",
    //   fullWidth: true,
    //   isReadOnly: true,
    //   dependentFields: ["CONFIRMED"],
    //   __VIEW__: { render: { componentType: "textField" } },
    //   shouldExclude: (_, dependentFieldsValues, __) => {
    //     if (dependentFieldsValues?.CONFIRMED?.value === "Pending") {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   },
    //   GridProps: { xs: 12, sm: 1.3, md: 1.2, lg: 1.2, xl: 1.5 },
    // },
    // {
    //   render: {
    //     componentType: "hidden",
    //   },
    //   name: "VERIFIED_DATE",
    //   label: "Checker Time",
    //   placeholder: "",
    //   type: "text",
    //   format: "dd/MM/yyyy HH:mm:ss",
    //   __VIEW__: { render: { componentType: "datetimePicker" } },
    //   fullWidth: true,
    //   isReadOnly: true,
    //   dependentFields: ["CONFIRMED"],
    //   shouldExclude: (_, dependentFieldsValues, __) => {
    //     if (dependentFieldsValues?.CONFIRMED?.value === "Pending") {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   },
    //   GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
    // },
  ],
};

export const rtgBenDetailConfirmFormMetaData: any = {
  form: {
    refID: 1667,
    name: "beneficiaryDtlFormMetaData",
    label: "Beneficiary Detail",
    resetFieldOnUmnount: false,
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
      GridProps: { xs: 0, md: 8, sm: 8, lg: 8, xl: 8 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ORDERING_AMOUNT",
      label: "Ordering Amount",
      placeholder: "",
      isReadOnly: true,
      type: "text",
      textFieldStyle: {
        "& .MuiInputBase-root": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
        },
        "& .MuiInputBase-input": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
          "&.Mui-disabled": {
            color: "var(--theme-color2) !important",
            "-webkit-text-fill-color": "var(--theme-color2) !important",
          },
        },
      },
      __VIEW__: { render: { componentType: "hidden" } },

      GridProps: { xs: 6, sm: 2, md: 2.2, lg: 2, xl: 1.5 },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "BENIFICIARY_AMOUNT",
      label: "Total Benificiary Amount",
      placeholder: "",
      isReadOnly: true,
      type: "text",
      validationRun: "onBlur",
      defaultValue: "0",
      textFieldStyle: {
        "& .MuiInputBase-root": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
        },
        "& .MuiInputBase-input": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
          "&.Mui-disabled": {
            color: "var(--theme-color2) !important",
            "-webkit-text-fill-color": "var(--theme-color2) !important",
          },
        },
      },
      __VIEW__: { render: { componentType: "hidden" } },

      dependentFields: ["beneficiaryAcDetails"],
      setValueOnDependentFieldsChange: (dependentFieldState) => {
        let accumulatedTakeoverLoanAmount = (
          Array.isArray(dependentFieldState?.["beneficiaryAcDetails"])
            ? dependentFieldState?.["beneficiaryAcDetails"]
            : []
        ).reduce((accum, obj) => accum + Number(obj.AMOUNT?.value), 0);

        return accumulatedTakeoverLoanAmount;
      },
      GridProps: { xs: 6, sm: 2, md: 2.2, lg: 2, xl: 1.5 },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "TOTAL_AMOUNT",
      label: "Total Amount",
      placeholder: "",
      isReadOnly: true,
      type: "text",
      validationRun: "onBlur",
      dependentFields: ["ORDERING_AMOUNT", "BENIFICIARY_AMOUNT"],
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
      },
      setValueOnDependentFieldsChange: (dependentFields) => {
        let value =
          Number(dependentFields?.ORDERING_AMOUNT?.value) -
          Number(dependentFields?.BENIFICIARY_AMOUNT?.value);
        return value ?? "0";
      },
      textFieldStyle: {
        "& .MuiInputBase-root": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
        },
        "& .MuiInputBase-input": {
          background: "var(--theme-color5)",
          color: "var(--theme-color2) !important",
          "&.Mui-disabled": {
            color: "var(--theme-color2) !important",
            "-webkit-text-fill-color": "var(--theme-color2) !important",
          },
        },
      },
      __VIEW__: { render: { componentType: "hidden" } },
      GridProps: { xs: 6, sm: 2, md: 2.2, lg: 2, xl: 1.5 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "ADDNEWROW",
      label: "Add Row",
      endsIcon: "AddCircleOutlineRounded",
      rotateIcon: "scale(2)",
      placeholder: "",
      type: "text",
      tabIndex: "-1",
      iconStyle: {
        fontSize: "25px !important",
      },
      __VIEW__: { render: { componentType: "hidden" } },
      GridProps: { xs: 2.2, sm: 2, md: 1.8, lg: 1.2, xl: 1.2 },
    },
    {
      render: {
        componentType: "arrayField",
      },
      isRemoveButton: true,
      displayCountName: "Beneficiary A/C Detail",
      fixedRows: true,
      isScreenStyle: true,
      disagreeButtonName: "No",
      agreeButtonName: "Yes",
      errorTitle: "Are you Sure you want to delete this row?",
      name: "beneficiaryAcDetails",
      removeRowFn: "deleteFormArrayFieldData",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "hidden",
          },
          name: "SR_CD"
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "TRAN_CD"
        },

        {
          render: {
            componentType: "hidden",
          },
          name: "FILED_HIDDEN"
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "TO_ACCT_NO",
          label: "A/C No",
          defaultValue: "",
          GridProps: { xs: 12, sm: 2.8, md: 2.8, lg: 2.8, xl: 2.8 },
          disableCaching: true,

        },
        {
          render: {
            componentType: "formbutton",
          },
          name: "BENEFICIARY",
          label: "Audit Trail",
          placeholder: "",
          type: "text",
          tabIndex: "-1",
          iconStyle: {
            fontSize: "25px !important",
          },
          shouldExclude(fieldData, dependentFields, formState) {
            if (formState?.isIfscCdData?.[0] === "Y") {
              return false;
            } else {
              return true;
            }
          },
          __VIEW__: { render: { componentType: "hidden" } },
          GridProps: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "TO_ACCT_NM",
          label: "Name",
          type: "text",
          fullWidth: true,
          required: true,
          isReadOnly: true,
          GridProps: { xs: 12, sm: 2.8, md: 2.8, lg: 2.8, xl: 2.8 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "TO_ACCT_TYPE",
          label: "Account Type",
          type: "text",
          fullWidth: true,
          required: true,
          isReadOnly: true,
          GridProps: { xs: 12, sm: 1.4, md: 1.4, lg: 1.4, xl: 1.4 },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "CONTACT_NO",
          label: "Mobile No.",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 1.2, md: 1.2, lg: 1.2, xl: 1.2 },
        },

        {
          render: {
            componentType: "textField",
          },
          name: "TO_EMAIL_ID",
          label: "Email ID",
          type: "text",
          fullWidth: true,
          required: true,
          isReadOnly: true,
          GridProps: { xs: 12, sm: 2.7, md: 2.7, lg: 2.7, xl: 2.7 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "TO_ADD1",
          label: "Address",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          GridProps: { xs: 12, sm: 3.4, md: 3.4, lg: 3.4, xl: 3.4 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "BENEF_REM_EDIT",
        },

        {
          render: {
            componentType: "textField",
          },
          name: "REMARKS",
          label: "Remarks",
          type: "text",
          fullWidth: true,
          dependentFields: ["BENEF_REM_EDIT"],
          isReadOnly(fieldData, dependentFieldsValues, formState) {
            if (dependentFieldsValues?.BENEF_REM_EDIT?.value === "Y") {
              return true;
            } else {
              return false;
            }
          },
          GridProps: { xs: 12, sm: 3.4, md: 3.4, lg: 3.4, xl: 3.4 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "REMITTANCE_INFO",
          label: "Remittance Info.",
          type: "text",
          fullWidth: true,
          GridProps: { xs: 12, sm: 3.2, md: 3.2, lg: 3.2, xl: 3.2 },
          dependentFields: ["BENEF_REM_EDIT"],
          isReadOnly(fieldData, dependentFieldsValues, formState) {
            if (dependentFieldsValues?.BENEF_REM_EDIT?.value === "Y") {
              return true;
            } else {
              return false;
            }
          },
        },
        {
          render: {
            componentType: "amountField",
          },
          name: "AMOUNT",
          label: "Amount",
          placeholder: "",
          type: "text",
          __EDIT__: {
            dependentFields: ["FILED_HIDDEN"],
            isReadOnly: (field, dependentField, formState) => {
              if (dependentField?.["beneficiaryAcDetails.FILED_HIDDEN"]?.value === "Y"
              ) {
                return true;

              } else {
                return false
              }
            }
          },
          FormatProps: {
            allowNegative: false,
          },
          // postValidationSetCrossFieldValues: async (...arr) => {
          //   if (arr[0].value) {
          //     return {
          //       BENIFICIARY_AMOUNT: { value: arr[0].value ?? "0" },
          //     };
          //   } else {
          //     return {
          //       BENIFICIARY_AMOUNT: { value: "" },
          //     };
          //   }
          // },
          AlwaysRunPostValidationSetCrossFieldValues: {
            alwaysRun: true,
            touchAndValidate: false,
          },
          postValidationSetCrossFieldValues: async (...arr) => {
            if (arr[0].value) {
              arr?.[1].setDataOnFieldChange("AMOUNT", "");
              // return {
              //   TOTAL_DR_AMOUNT: { value: arr[0].value ?? "0" },
              // };
            } else {
              // return {
              //   TOTAL_DR_AMOUNT: { value: "" },
              // };
            }
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
        },

        {
          render: {
            componentType: "Divider",
          },
          dividerText: "IFSC Bank Detail",
          name: "Address",
          label: "Address",
        },
        {
          render: {
            componentType: "textField",
          },
          name: "TO_IFSCCODE",
          label: "IFSC",
          type: "text",
          fullWidth: true,
          required: true,
          isReadOnly: true,
          postValidationSetCrossFieldValues: async (
            field,
            formState,
            auth,
            dependentFieldsValues
          ) => {
            formState.setDataOnFieldChange("IFSC_CD", field?.value);
          },
          GridProps: { xs: 12, sm: 2.2, md: 2.2, lg: 2.2, xl: 2.2 },
        },
        {
          render: {
            componentType: "formbutton",
          },
          name: "IFSC",
          label: "Ifsc Detail",
          placeholder: "",
          type: "text",
          tabIndex: "-1",
          iconStyle: {
            fontSize: "25px !important",
          },
          __VIEW__: { render: { componentType: "hidden" } },
          GridProps: { xs: 1.2, sm: 1.2, md: 1.2, lg: 1.2, xl: 1.2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "BANK_NM",
          label: "Bank",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 3.5, md: 3.5, lg: 3.5, xl: 3.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "BRANCH_NM",
          label: "Branch",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 2.7, md: 2.7, lg: 2.7, xl: 2.7 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "CONTACT_DTL",
          label: "Contact",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "CENTRE_NM",
          label: "Center",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 1.8, md: 1.8, lg: 1.8, xl: 1.8 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ADDR",
          label: "Address",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 4.3, md: 4.3, lg: 4.3, xl: 4.3 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "DISTRICT_NM",
          label: "District",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "STATE_NM",
          label: "State",
          placeholder: "",
          type: "text",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
        },
      ],
    },
  ],
};
