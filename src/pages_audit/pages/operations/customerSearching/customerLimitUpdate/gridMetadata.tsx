import { GridMetaDataType } from "components/dataTableStatic";
import { FilterFormMetaType } from "components/formcomponent";

export const CustomerDetailsForm: FilterFormMetaType = {
  gridConfig: {
    dense: true,
    title: "User Wise Limit Configuration",
    allowColumnHiding: false,
    submitButtonName: "Fetch Data",
    submitButtonHide: true,
    HideHeader: true,
    isDisplayOnly: true,
  },
  fields: [
    {
      accessor: "CUSTOM_USER_NM",
      name: "username",
      gridconfig: { xs: 6, sm: 3 },
      label: "Login ID",
    },

    {
      accessor: "CUST_NAME",
      name: "cust_name",
      gridconfig: { xs: 9, sm: 4 },
      label: "Customer Name",
    },
  ],
};

export const CustomerDetailsGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Customer Details",
    rowIdColumn: "id",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: true,
    hideHeader: true,
    hideFooter: false,
    disableGroupBy: true,
    enablePagination: false,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "45vh",
      max: "55vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    disableGlobalFilter: false,
    allowRowSelection: false,
    disableLoader: true,
    hiddenFlag: "_hidden",
  },
  filters: [],
  columns: [
    {
      accessor: "id",
      columnName: "Sr.No.",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 70,
      minWidth: 70,
      maxWidth: 200,
      isAutoSequence: true,
    },
    {
      accessor: "TRN_TYPE",
      columnName: "Transaction Type",
      sequence: 2,
      alignment: "left",
      componentType: "editableSelect",
      width: 240,
      minWidth: 100,
      maxWidth: 400,
      required: true,
      defaultOptionLabel: "Select Transaction Type",
      options: "GetMiscValue",
      _optionsKey: "GetMiscValue",
      requestProps: "TRAN_TYPE",
      validation: (value, data, prev) => {
        if (!Boolean(value)) {
          return "This is a required field";
        } else {
          let response = "";
          prev?.forEach((item) => {
            if (item.TRN_TYPE && item.TRN_TYPE === value) {
              response = "This type already exists.";
              return;
            }
          });
          return response;
        }
      },
      __EDIT__: { isReadOnly: true },
    },
    {
      accessor: "DAILY_AMT",
      columnName: "Daily Limit",
      sequence: 3,
      alignment: "right",
      componentType: "editableNumberFormat",
      placeholder: "0.00",
      width: 160,
      minWidth: 100,
      maxWidth: 250,
      className: "textInputFromRight",
      FormatProps: {
        thousandSeparator: true,
        thousandsGroupStyle: "lakh",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 2,
        isAllowed: (values) => {
          if (values?.value?.length > 14) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        } else if (
          Boolean(data?.WEEKLY_AMT) &&
          parseFloat(data?.WEEKLY_AMT) < parseFloat(value)
        ) {
          return "Daily limit should be less than weekly limit.";
        } else if (
          Boolean(data?.MONTHLY_AMT) &&
          parseFloat(data?.MONTHLY_AMT) < parseFloat(value)
        ) {
          return "Daily limit should be less than Monthly limit.";
        } else {
          return "";
        }
      },
    },
    {
      accessor: "WEEKLY_AMT",
      columnName: "Weekly Limit",
      sequence: 4,
      alignment: "right",
      componentType: "editableNumberFormat",
      placeholder: "0.00",
      width: 160,
      minWidth: 100,
      maxWidth: 250,
      className: "textInputFromRight",
      FormatProps: {
        thousandSeparator: true,
        thousandsGroupStyle: "lakh",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 2,
        isAllowed: (values) => {
          if (values?.value?.length > 14) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      validation: (value, data) => {
        if (
          Boolean(value) &&
          Boolean(data?.DAILY_AMT) &&
          parseFloat(value) < parseFloat(data?.DAILY_AMT)
        ) {
          return "Weekly Limit should be more";
        }
        return "";
      },
    },
    {
      accessor: "MONTHLY_AMT",
      columnName: "Monthly Limit",
      sequence: 5,
      alignment: "right",
      componentType: "editableNumberFormat",
      placeholder: "0.00",
      width: 160,
      minWidth: 100,
      maxWidth: 250,
      className: "textInputFromRight",
      FormatProps: {
        thousandSeparator: true,
        thousandsGroupStyle: "lakh",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 2,
        isAllowed: (values) => {
          if (values?.value?.length > 14) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
    },
    {
      accessor: "MIN_AMT",
      columnName: "Minimum Amount",
      sequence: 6,
      alignment: "right",
      componentType: "editableNumberFormat",
      placeholder: "0.00",
      width: 160,
      minWidth: 100,
      maxWidth: 250,
      className: "textInputFromRight",
      FormatProps: {
        thousandSeparator: true,
        thousandsGroupStyle: "lakh",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 2,
        isAllowed: (values) => {
          if (values?.value?.length > 14) {
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
        rules: [{ name: "required", params: ["This field is required"] }],
      },
    },
    {
      accessor: "MAX_AMT",
      columnName: "Maximum Amount",
      sequence: 7,
      alignment: "right",
      componentType: "editableNumberFormat",
      placeholder: "0.00",
      width: 160,
      minWidth: 100,
      maxWidth: 250,
      className: "textInputFromRight",
      FormatProps: {
        thousandSeparator: true,
        thousandsGroupStyle: "lakh",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 2,
        isAllowed: (values) => {
          if (values?.value?.length > 14) {
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
        rules: [{ name: "required", params: ["This field is required"] }],
      },
    },
    {
      accessor: "CARD_MIN_AMT",
      columnName: "Card Minimum Amt.",
      sequence: 8,
      alignment: "right",
      componentType: "editableNumberFormat",
      placeholder: "0.00",
      width: 160,
      minWidth: 100,
      maxWidth: 250,
      className: "textInputFromRight",
      FormatProps: {
        thousandSeparator: true,
        thousandsGroupStyle: "lakh",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 2,
        isAllowed: (values) => {
          if (values?.value?.length > 14) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
    },
    {
      accessor: "MAX_DAY_CNT",
      columnName: "Max Daily Count",
      sequence: 9,
      alignment: "right",
      componentType: "editableNumberFormat",
      placeholder: "0.00",
      width: 160,
      minWidth: 100,
      maxWidth: 250,
      className: "textInputFromRight",
      FormatProps: {
        thousandSeparator: true,
        thousandsGroupStyle: "lakh",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 2,
        isAllowed: (values) => {
          if (values?.value?.length > 14) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
    },
    {
      accessor: "MAX_MONTH_CNT",
      columnName: "Max Monthly Count",
      sequence: 10,
      alignment: "right",
      componentType: "editableNumberFormat",
      placeholder: "0.00",
      width: 160,
      minWidth: 100,
      maxWidth: 250,
      className: "textInputFromRight",
      FormatProps: {
        thousandSeparator: true,
        thousandsGroupStyle: "lakh",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 2,
        isAllowed: (values) => {
          if (values?.value?.length > 14) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
    },
    {
      columnName: "Action",
      componentType: "deleteRowCell",
      accessor: "_hidden",
      sequence: 11,
    },
  ],
};

export const CustomerConfirmMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Customer Details",
    rowIdColumn: "TRN_TYPE",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: true,
    hideHeader: true,
    hideFooter: false,
    disableGroupBy: true,
    enablePagination: false,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "45vh",
      max: "55vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    disableGlobalFilter: false,
    allowRowSelection: false,
    disableLoader: true,
    hiddenFlag: "_hidden",
  },
  filters: [],
  columns: [
    {
      accessor: "id",
      columnName: "Sr.No.",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 70,
      minWidth: 70,
      maxWidth: 200,
      isAutoSequence: true,
    },
    {
      accessor: "TRANSACTION_TYPE",
      columnName: "Transaction Type",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 100,
      maxWidth: 400,
    },
    {
      accessor: "DAILY_AMT",
      columnName: "Daily Limit",
      sequence: 3,
      alignment: "right",
      componentType: "default",
      placeholder: "0.00",
      width: 220,
      minWidth: 100,
      maxWidth: 250,
      className: "textInputFromRight",
      FormatProps: {
        thousandSeparator: true,
        thousandsGroupStyle: "lakh",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 2,
        isAllowed: (values) => {
          if (values?.value?.length > 14) {
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
        rules: [{ name: "required", params: ["This field is required"] }],
      },
    },
    {
      accessor: "WEEKLY_AMT",
      columnName: "Weekly Limit",
      sequence: 4,
      alignment: "right",
      componentType: "default",
      placeholder: "0.00",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "MONTHLY_AMT",
      columnName: "Monthly Limit",
      sequence: 5,
      alignment: "right",
      componentType: "default",
      placeholder: "0.00",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "MIN_AMT",
      columnName: "Minimum Amount",
      sequence: 6,
      alignment: "right",
      componentType: "default",
      placeholder: "0.00",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "MAX_AMT",
      columnName: "Maximum Amount",
      sequence: 7,
      alignment: "right",
      componentType: "default",
      placeholder: "0.00",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "CARD_MIN_AMT",
      columnName: "Card Minimum Amt.",
      sequence: 8,
      alignment: "right",
      componentType: "default",
      placeholder: "0.00",
      width: 150,
      minWidth: 100,
      maxWidth: 400,
    },
    {
      accessor: "MAX_DAY_CNT",
      columnName: "Max Daily Count",
      sequence: 9,
      alignment: "right",
      componentType: "default",
      placeholder: "0.00",
      width: 150,
      minWidth: 100,
      maxWidth: 400,
    },
    {
      accessor: "MAX_MONTH_CNT",
      columnName: "Max Monthly Count",
      sequence: 10,
      alignment: "right",
      componentType: "default",
      placeholder: "0.00",
      width: 150,
      minWidth: 100,
      maxWidth: 400,
    },
  ],
};
