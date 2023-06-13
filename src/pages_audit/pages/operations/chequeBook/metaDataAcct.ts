import { AuthContext } from "pages_audit/auth";
import { format } from "date-fns";
import { MetaDataType } from "components/dyanmicForm";
export const AcctViewMetadata: MetaDataType = {
  form: {
    name: "accountView",
    label: "Account Detail View",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",

    render: {
      ordering: "sequence",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 3,
          md: 3,
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
        componentType: "textField",
      },
      name: "ACCT_NM",
      // sequence: 1,
      label: "Name",
      type: "text",
      // required: true,
      // maxLength: 16,

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
      name: "SCR_ADD",
      sequence: 2,
      label: "Address",
      // placeholder: "Select No of Leaves",
      // enableDefaultOption: true,
      // required: true,
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
      name: "CONTACT",
      // sequence: 3,
      label: "Contact Details",
      // placeholder: "Enter no of Cheque book",
      type: "text",
      // required: true,
      // maxLength: 32,
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["User Name is required."] }],
      // },
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
      name: "WITHDRAW_BAL",
      // sequence: 5,
      label: "Withdrawalable Balance",
      placeholder: "",
      type: "text",
      // required: true,
      // options: () => {
      //   return GeneralAPI.GetSecurityGroupingList();
      // },
      // enableDefaultOption: true,
      // _optionsKey: "GetSecurityGroupingList",
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["Group Name is required."] }],
      // },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "CUSTOMER_ID",
      // sequence: 4,
      label: "Customer Id",
      placeholder: "",
      type: "text",
      // required: true,
      // maxLength: 11,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_MODE",
      // sequence: 7,
      label: "Mode Of Operation",
      placeholder: "",
      type: "text",
      // required: true,
      // maxLength: 100,

      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PAN_NO",
      // sequence: 8,
      label: "PAN No.",
      placeholder: "",
      type: "text",
      // required: true,
      // maxLength: 100,

      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "UNIQUE_ID",
      // sequence: 9,
      label: "National ID",
      placeholder: "",
      // options: () => {
      //   return GeneralAPI.GetMiscValue("USER_SUB_TYPE");
      // },
      // enableDefaultOption: true,
      // _optionsKey: "GetSubTypeMiscValue",
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
      },
    },
  ],
};

/*
export const ChequeBookEntryForm = {
  gridConfig: {
    dense: true,
    title: "Cheque Book Issue Entry",
    allowColumnHiding: false,
    submitButtonName: "History",
    HideHeader: true,
  },
  fields: [
    {
      accessor: "ACCT_CD",
      name: "ACCT_CD",
      defaultValue: "",
      gridconfig: { xs: 6, sm: 3 },
      label: "Account No",
      autoComplete: "off",
      placeholder: "Enter Account No. here.",
    },
    {
      accessor: "NO_OF_LEAVE",
      name: "NO_OF_LEAVE",
      label: "No of Leaves",
      placeholder: "No of Leaves here.",
      type: "number",
      gridconfig: { xs: 3, sm: 2 },
    },
    {
      accessor: "NO_OF_CHEQUEBOOK",
      name: "NO_OF_CHEQUEBOOK",
      label: "No of Cheque book(s)",
      placeholder: "",
      type: "number",
      defaultValue: "1",
      gridconfig: { xs: 3, sm: 2 },
    },
    {
      accessor: "CHARACTERISTICS",
      name: "CHARACTERISTICS",
      label: "Characteristics",
      gridconfig: { xs: 6, sm: 2 },
      defaultValue: "B",
      isVisible: true,
      autoComplete: "off",
      placeholder: "Select Option",
      isColumnHidingDisabled: true,
      entertoSubmit: true,
      type: "select",
      optiondata: [
        { label: "Bearer", value: "B" },
        { label: "Order", value: "O" },
      ],
      validate: (columnValue, allField, flag) => {
        if (!Boolean(columnValue)) {
          return "This field is required.";
        }
        return "";
      },
    },
    {
      accessor: "PAYABLE_AT_PAR",
      name: "PAYABLE_AT_PAR",
      label: "Payable At Par",
      gridconfig: { xs: 3, sm: 2 },
      defaultValue: "Y",
      isVisible: true,
      autoComplete: "off",
      placeholder: "Select Option",
      isColumnHidingDisabled: true,
      entertoSubmit: true,
      type: "select",
      optiondata: [
        { label: "Yes", value: "Y" },
        { label: "No", value: "N" },
      ],
      validate: (columnValue, allField, flag) => {
        if (!Boolean(columnValue)) {
          return "This field is required.";
        }
        return "";
      },
    },
    {
      accessor: "SERVICE_CHARGE",
      name: "SERVICE_CHARGE",
      label: "Service Charge",
      type: "number",
      // defaultValue: "0",
      isDisabled: true,
      gridconfig: { xs: 3, sm: 2 },
    },
    {
      accessor: "GST",
      name: "GST",
      label: "GST",
      type: "number",
      // defaultValue: "0",
      isDisabled: true,
      gridconfig: { xs: 3, sm: 2 },
    },
    {
      accessor: "REQUISITION_DATE",
      name: "REQUISITION_DATE",
      label: "Requisition Date",
      type: "date",
      // defaultValue: "today",
      gridconfig: { xs: 3, sm: 2 },
    },
    {
      accessor: "REMARKS",
      name: "Remarks",
      label: "Remarks",
      placeholder: "Enter Remarks",
      gridconfig: { xs: 6, sm: 4 },
    },
  ],
};
*/
