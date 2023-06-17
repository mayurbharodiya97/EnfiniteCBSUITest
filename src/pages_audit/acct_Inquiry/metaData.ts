// import { getChargeAllow } from "../../../configurations/serviceWiseConfig/viewEditDetail/api";
// import { GeneralAPI } from "registry/fns/functions";
import { GridMetaDataType } from "components/dataTableStatic";
export const AccountInquiryMetadata = {
  form: {
    name: "merchantOnboarding",
    label: "Account Inquiry",
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
      label: "Account No.",
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
      label: "Customer Id",
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
      label: "Mobile No.",
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
      label: "Pan No.",
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
      columnName: "Account No.",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "ACCT_NAME",
      columnName: "Account/Person Name",
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
      columnName: "Customer Id",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "MOB_NO",
      columnName: "Mobile No.",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "PAN_NO",
      columnName: "Pan No.",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },

    {
      accessor: "OPENIND_DT",
      columnName: "Opening Date",
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
      columnName: "Status",
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
      columnName: "Close Date",
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
    label: "Passbook/Statement Print Option",
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
      label: "Account No.",
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
      label: "Account/Person Name",
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
          label: "Passbook",
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
      label: "From Date :-",
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
      label: "To Date :-",
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
      label: "Pan No.",
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
    label: "Customer Detail",
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
      label: "Account No.",
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
      label: "Account/Person Name",
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
      label: "Customer Id",
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
      label: "Mobile No.",
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
      label: "Pan No.",
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
      label: "Status",
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
      label: "Opening Date",
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
      label: "Close Date",
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
