import { FilterFormMetaType } from "components/formcomponent";
import { AuthContext } from "pages_audit/auth";

export const ChequebookentryFilterForm: FilterFormMetaType = {
  gridConfig: {
    dense: true,
    title: "Cheque Book Issue Entry",
    allowColumnHiding: false,
    submitButtonName: "Post",
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
