// import { getChargeAllow } from "../../../configurations/serviceWiseConfig/viewEditDetail/api";
// import { GeneralAPI } from "registry/fns/functions";
import { GridMetaDataType } from "components/dataTableStatic";
export const AccountInquiryMetadata = {
  form: {
    name: "merchantOnboarding",
    label: "AccountInquiry",
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
          spacing: 2,
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
        componentType: "textField",
      },
      name: "ACCOUNT",
      label: "AccountNo",
      placeholder: "",
      defaultValue: "",
      type: "text",
      // allowToggleVisiblity: true,
      maxLength: 20,
      required: false,
      fullWidth: true,
      autoComplete: false,
      schemaValidation: {
        type: "string",
      },
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CUSTOMER",
      label: "CustomerId",
      maxLength: 12,
      schemaValidation: {
        type: "string",
      },
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MOBILE",
      label: "MobileNo",
      maxLength: 10,
      schemaValidation: {
        type: "string",
      },
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
      },
    },
    {
      render: {
        componentType: "panCardOptional",
      },
      name: "PAN",
      label: "PanNo",
      placeholder: "",
      maxLength: 10,
      type: "text",
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
      },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "PID_DESCRIPTION",
      label: "Retrieve",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 1,
        sm: 1,
      },
    },
  ],
};
export const AccountInquiryGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Customer Searching",
    rowIdColumn: "CUST_ID",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "42vh",
      max: "50vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
  },
  // filters: [],
  columns: [
    {
      accessor: "ACCT_NO",
      columnName: "AccountNo",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "ACCT_NAME",
      columnName: "AccountPersonName",
      sequence: 4,
      alignment: "center",
      componentType: "default",
      width: 180,
      minWidth: 180,
      isReadOnly: true,
      maxWidth: 180,
    },
    {
      accessor: "CUST_ID",
      columnName: "CustomerId",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "MOB_NO",
      columnName: "MobileNo",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "PAN_NO",
      columnName: "PanNo",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },

    {
      accessor: "OPENIND_DT",
      columnName: "OpeningDate",
      sequence: 8,
      alignment: "center",
      componentType: "default",
      isReadOnly: true,
      width: 140,
      minWidth: 140,
      maxWidth: 140,
    },
    {
      accessor: "STATUS",
      columnName: "STATUS",
      sequence: 9,
      alignment: "center",
      componentType: "default",
      isReadOnly: true,
      width: 100,
      minWidth: 100,
      maxWidth: 100,
    },
    {
      accessor: "CLOSE_DT",
      columnName: "CloseDate",
      sequence: 10,
      alignment: "center",
      componentType: "default",
      isReadOnly: true,
      width: 100,
      minWidth: 100,
      maxWidth: 100,
    },
  ],
};
export const PassbookStatement = {
  form: {
    name: "passbookstatement",
    label: "PassbookStatementPrintOption",
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
          spacing: 2,
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
        componentType: "textField",
      },
      name: "ACCT_NO",
      label: "AccountNo",
      placeholder: "Account Number",
      defaultValue: "",
      type: "text",
      isReadOnly: true,
      // allowToggleVisiblity: true,
      // maxLength: 10,
      // required: true,
      fullWidth: true,
      autoComplete: false,
      schemaValidation: {
        type: "string",
      },
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NAME",
      label: "AccountPersonName",
      placeholder: "Account/Person Name",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },
    {
      render: {
        componentType: "radio",
      },
      name: "PD_DESCRIPTION",
      label: "",
      RadioGroupProps: { row: true },
      defaultValue: "P",
      options: [
        {
          label: "passbook",
          value: "P",
        },
        { label: "Statement", value: "S" },
      ],
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      render: {
        componentType: "radio",
      },
      name: "PID_DESCRIPTION",
      label: "",
      RadioGroupProps: { row: true },
      defaultValue: "D",
      options: [
        {
          label: "Front Page",
          value: "F",
        },
        { label: "First Page", value: "R" },
        { label: "Detail", value: "D" },
      ],
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "PID_DESTION",
      label: "FromDate",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "PID_DEIPTION",
      label: "ToDate",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "PID_CRIPTN",
      label: "PanNo",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },

    {
      render: {
        componentType: "select",
      },
      name: "PD_DESCRIPTION",
      label: "Template",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 7,
        sm: 7,
      },
    },
  ],
};
export const ViewDetailMetadata = {
  form: {
    name: "passbookstatement",
    label: "CustomerDetail",
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
          spacing: 2,
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
        componentType: "textField",
      },
      name: "ACCT_NO",
      label: "AccountNo",
      placeholder: "Account Number",
      defaultValue: "",
      type: "text",
      // allowToggleVisiblity: true,
      // maxLength: 10,
      // required: true,
      isReadOnly: true,
      fullWidth: true,
      autoComplete: false,
      schemaValidation: {
        type: "string",
      },
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      isReadOnly: true,
      name: "ACCT_NAME",
      label: "AccountPersonName",
      placeholder: "Account/Person Name",
      type: "text",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CUST_ID",
      label: "CustomerId",
      placeholder: "Customer Id",
      isReadOnly: true,
      type: "text",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MOB_NO",
      label: "MobileNo",
      placeholder: "Mobile Number",
      isReadOnly: true,
      type: "text",
      isrequired: true,
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PAN_NO",
      label: "PanNo",
      isReadOnly: true,
      placeholder: "Pan Number",
      type: "text",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_STATUS",
      isReadOnly: true,
      label: "STATUS",
      placeholder: "Status",
      type: "text",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "OPENIND_DT",
      label: "OpeningDate",
      isReadOnly: true,
      placeholder: "Opening Date",
      type: "text",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CLOSE_DT",
      label: "CloseDate",
      placeholder: "Close Date",
      isReadOnly: true,
      type: "text",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
  ],
};
