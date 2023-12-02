import { GridMetaDataType } from "components/dataTableStatic";
export const CtsoutwardGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Cheque Detail",
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
    hideHeader: true,
    hideFooter: true,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "24vh",
      max: "30vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      accessor: "id",
      columnName: "Sr.No.",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 80,
      maxWidth: 100,
      // isAutoSequence: true,
    },
    {
      accessor: "CHEQUE_NO",
      columnName: "Cheque No.",
      componentType: "editableNumberFormat",
      sequence: 2,
      alignment: "left",
      width: 120,
      maxWidth: 250,
      minWidth: 120,
    },
    {
      accessor: "BANK_CD",
      columnName: "Bank",
      componentType: "editableTextField",
      sequence: 3,
      alignment: "center",
      width: 200,
      maxWidth: 300,
      minWidth: 250,
      defaultValue: "",
      // schemaValidation: {
      //   type: "string",
      //   rules: [
      //     { name: "required", params: ["This field is required"] },
      //     {
      //       name: "HOLIDAY_DESC",
      //       params: ["Please Entered Holiday Description."],
      //     },
      //   ],
      // },
    },

    {
      columnName: "",
      componentType: "buttonRowCell",
      accessor: "BANK_NAME",
      sequence: 4,
      buttonLabel: "...",
      isVisible: true,
      width: 60,
      minWidth: 80,
      maxWidth: 100,
    },
    {
      accessor: "PAYEE_AC_NO",
      columnName: "Payee A/C No.",
      componentType: "editableNumberFormat",
      sequence: 5,
      alignment: "left",
      width: 140,
      maxWidth: 250,
      minWidth: 120,
    },
    {
      accessor: "CHEQUE_DATE",
      columnName: "Cheque Date",
      sequence: 6,
      componentType: "editableDatePicker",
      dateFormat: "dd/MM/yyyy",
      required: true,
      // defaultValue: new Date(),
      placeholder: "",
      width: 140,
      minWidth: 150,
      maxWidth: 250,
      // validation: (value, data) => {
      //   if (!Boolean(value)) {
      //     return "This field is required.";
      //   }
      //   let toDate = new Date(value);
      //   let fromDate = new Date(data?.FROM_DT);
      //   if (lessThanDate(toDate, fromDate)) {
      //     return `To Date Should be Greater Than From Date.`;
      //   }
      //   return "";
      // },
    },

    {
      accessor: "DESCRIPTION",
      columnName: "Description",
      componentType: "editableTextField",
      sequence: 7,
      alignment: "center",
      width: 200,
      maxWidth: 300,
      minWidth: 250,
      defaultValue: "",
      // schemaValidation: {
      //   type: "string",
      //   rules: [
      //     { name: "required", params: ["This field is required"] },
      //     {
      //       name: "HOLIDAY_DESC",
      //       params: ["Please Entered Holiday Description."],
      //     },
      //   ],
      // },
    },
    {
      accessor: "CHQ_MICR_CD",
      columnName: "CHQ Micr",
      sequence: 8,
      alignment: "right",
      componentType: "editableNumberFormat",
      // placeholder: "0.00",
      width: 80,
      minWidth: 100,
      maxWidth: 150,
      // className: "textInputFromRight",

      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This field is required"] }],
      },
    },
    {
      accessor: "NAME",
      columnName: "Day Name",
      componentType: "default",
      sequence: 9,
      alignment: "center",
      width: 180,
      maxWidth: 250,
      minWidth: 120,
      isVisible: false,
    },
    {
      accessor: "AMOUNT",
      columnName: "Amount",
      sequence: 10,
      alignment: "right",
      componentType: "editableNumberFormat",
      isDisabledOnBlurEvent: false,
      placeholder: "0.00",
      width: 200,
      minWidth: 180,
      maxWidth: 250,
      className: "textInputFromRight",
      FormatProps: {
        thousandSeparator: true,
        thousandsGroupStyle: "lakh",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 2,
        //   isAllowed: (values) => {
        //     if (values?.value?.length > 15) {
        //       return false;
        //     }
        //     if (values.floatValue === 0) {
        //       return false;
        //     }
        //     return true;
        //   },
        // },
        // schemaValidation: {
        //   type: "string",
        //   rules: [{ name: "required", params: ["This field is required"] }],
        // },
      },
    },
  ],
};
