import { FilterFormMetaType } from "components/formcomponent";

export const CustomerSearchingFilterForm: FilterFormMetaType = {
  gridConfig: {
    dense: true,
    title: "Customer Activation",
    allowColumnHiding: true,
    submitButtonName: "Fetch Details",
  },
  fields: [
    {
      accessor: "REG_WITH",
      name: "REG_WITH",
      defaultValue: "A",
      isVisible: true,
      gridconfig: { xs: 6, sm: 3 },
      label: "Activation Using",
      autoComplete: "off",
      placeholder: "Select Option",
      isColumnHidingDisabled: true,
      entertoSubmit: true,
      type: "select",
      optiondata: [
        { label: "Account Number", value: "A" },
        { label: "Card Number", value: "C" },
      ],
      validate: (columnValue, allField, flag) => {
        if (!Boolean(columnValue)) {
          return "This field is required.";
        }
        return "";
      },
    },
    {
      accessor: "REG_ACCT_CARD_NO",
      name: "REG_ACCT_CARD_NO",
      defaultValue: "",
      isVisible: true,
      gridconfig: { xs: 6, sm: 3 },
      defaultfocus: true,
      label: "Account/Card Number",
      autoComplete: "off",
      placeholder: "Account/Card Number",
      isColumnHidingDisabled: true,
      entertoSubmit: true,
      validate: (columnValue, allField, flag) => {
        if (!Boolean(columnValue)) {
          return "This field is required.";
        }
        return "";
      },
    },
    {
      accessor: "CUST_NAME",
      name: "CUST_NAME",
      label: "Name",
      placeholder: "Name",
      isDisabled: true,
      gridconfig: { xs: 6, sm: 6 },
    },
    {
      accessor: "CUSTOM_USER_NM",
      name: "CUSTOM_USER_NM",
      defaultValue: "",
      isVisible: true,
      gridconfig: { xs: 6, sm: 3 },
      label: "Login ID",
      autoComplete: "off",
      placeholder: "Login ID",
      isColumnHidingDisabled: true,
      validate: (columnValue, allField, flag) => {
        if (!Boolean(columnValue) && flag === "SECOND") {
          return "This field is required.";
        }
        return "";
      },
    },
    {
      accessor: "MOBILE_NO",
      name: "MOBILE_NO",
      label: "Mobile Number",
      placeholder: "Mobile Number",
      type: "number",
      isDisabled: true,
      gridconfig: { xs: 6, sm: 3 },
    },
    {
      accessor: "BIRTH_DT",
      name: "BIRTH_DT",
      label: "Birth Date",
      placeholder: "Birth Date",
      isDisabled: true,
      gridconfig: { xs: 6, sm: 2 },
    },
    {
      accessor: "MAIL_ID",
      name: "MAIL_ID",
      label: "E-Mail Address",
      placeholder: "E-Mail Address",
      isDisabled: true,
      gridconfig: { xs: 6, sm: 4 },
    },
  ],
};
