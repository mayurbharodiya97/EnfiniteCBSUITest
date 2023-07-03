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
        componentType: "accountNumberOptional",
      },
      name: "ACCOUNT",
      label: "Account No.",
      placeholder: "Account Number",
      defaultValue: "",
      type: "text",
      // allowToggleVisiblity: true,
      maxLength: 20,
      required: false,
      fullWidth: true,
      autoComplete: false,
      validate: (columnValue, allField, flag) => {
        if (columnValue.value.length >= 20) {
          return "The length of your Account No. is greater than 20 character";
        }
        return "";
      },
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CUSTOMER",
      label: "CustomerId",
      maxLength: 12,
      schemaValidation: {
        type: "string",
      },
      validate: (columnValue, allField, flag) => {
        if (columnValue.value.length >= 12) {
          return "The length of your Customer Id is greater than 12 character";
        }
        return "";
      },
      placeholder: "Customer Id",
      type: "text",
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
      },
    },
    {
      render: {
        componentType: "phoneNumberOptional",
      },
      name: "MOBILE",
      label: "MobileNo",
      maxLength: 10,
      placeholder: "Mobile Number",
      type: "string",
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
      },
      validate: (columnValue, allField, flag) => {
        if (columnValue.value.length <= 0) {
          return "";
        } else if (columnValue.value.length >= 11) {
          return "The length of your Mobile Number is greater than 10 character";
        } else if (columnValue.value.length <= 9) {
          return "The length of your Mobile Number is less than 10 character";
        }
        return "";
      },
    },
    {
      render: {
        componentType: "panCardOptional",
      },
      name: "PAN",
      label: "Pan No.",
      placeholder: "Pancard Number",
      maxLength: 10,
      type: "text",
      schemaValidation: {
        type: "string",
      },
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
      },
      validate: (columnValue, allField, flag) => {
        let regex = /^([A-Z]){5}([0-9]){4}([A-Z]){1}?$/;

        if (columnValue.value.length <= 0) {
          return "";
        } else if (/[a-z]/.test(columnValue.value)) {
          return "Please enter uppercase letters only";
        } else if (!regex.test(columnValue.value)) {
          return "Please Enter Valid Format";
        }
        return "";
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
    gridLabel: "Account Inquiry Data",
    rowIdColumn: "WITHDRAW_BAL",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
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
      accessor: "ACCT_NM",
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
      accessor: "CUSTOMER_ID",
      columnName: "Customer Id",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "CONTACT2",
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
      columnName: "Pan No",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "WITHDRAW_BAL",
      columnName: "Withdraw Balance",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "E_MAIL_ID",
      columnName: "Email Id",
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
      componentType: "date",
      dateFormat: "dd/MM/yyyy HH:mm:ss",
      // dateFormat: "dd/MM/yyyy hh:mm aaa",
      isReadOnly: true,
      width: 140,
      minWidth: 140,
      maxWidth: 140,
    },
    {
      accessor: "DISPLAY_STATUS",
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
      columnName: "CloseDate",
      sequence: 10,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy HH:mm:ss",
      // dateFormat: "dd/MM/yyyy hh:mm aaa",
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
      name: "ACCT_NM",
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
      label: "From Date :-",
      dateFormat: "dd/MM/yyyy HH:mm:ss",
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
      dateFormat: "dd/MM/yyyy HH:mm:ss",
      // dateFormat: "dd/MM/yyyy hh:mm aaa",
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
    label: "Account Detail",
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
      name: "ACCT_NM",
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
      name: "CUSTOMER_ID",
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
      name: "CONTACT2",
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
      name: "DISPLAY_STATUS",
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
      name: "OP_DATE",
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
