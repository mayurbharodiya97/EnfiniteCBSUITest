import { FilterFormMetaType } from "components/formcomponent";

export const CustomerSearchingFilterForm: FilterFormMetaType = {
  gridConfig: {
    dense: true,
    title: "Customer Searching",
    allowColumnHiding: true,
    submitButtonName: "Get Details",
  },
  fields: [
    {
      name: "CUSTOM_USER_NM",
      defaultValue: "",
      isVisible: true,
      gridconfig: { xs: 6, sm: 3 },
      defaultfocus: true,
      label: "Login ID",
      autoComplete: "off",
      placeholder: "Login ID",
      isColumnHidingDisabled: true,
      entertoSubmit: true,
    },
    {
      name: "REG_CARD_ACCT_NO",
      label: "Account/Card Number",
      placeholder: "Account/Card Number",
      type: "number",
    },
    {
      name: "PRIMARY_CBNUMBER",
      label: "Client ID/CB Number",
      placeholder: "Client ID/CB Number",
    },
    {
      name: "MOBILE_NO",
      label: "Mobile No.",
      placeholder: "Mobile Number",
      type: "number",
    },

    {
      name: "NID",
      label: "National ID",
      placeholder: "National ID",
      isVisible: false,
    },
    {
      name: "TIN",
      label: "TIN",
      placeholder: "TIN",
      isVisible: false,
    },
    {
      name: "FATHERS_NAME",
      label: "Father Name",
      placeholder: "Father Name",
      isVisible: false,
    },
    {
      name: "MOTHERS_NAME",
      label: "Mother Name",
      placeholder: "Mother Name",
      isVisible: false,
    },
    {
      name: "CUST_NAME",
      label: "Customer Name",
      placeholder: "Customer Name",
      gridconfig: { xs: 12, sm: 6 },
      isVisible: false,
    },
    {
      name: "MAIL_ID",
      label: "Email ID",
      placeholder: "Email ID",
      gridconfig: { xs: 12, sm: 6 },
      isVisible: false,
    },
  ],
};
