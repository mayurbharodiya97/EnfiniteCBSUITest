import { FilterFormMetaType } from "components/formcomponent";

export const CustomerDetailsForm: FilterFormMetaType = {
  gridConfig: {
    dense: true,
    title: "Customer Details",
    allowColumnHiding: false,
    submitButtonName: "Password Reset",
    // submitButtonHide: true,
    HideHeader: true,
    isDisplayOnly: true,
  },
  fields: [
    {
      accessor: "CUSTOM_USER_NM",
      name: "username",
      gridconfig: { xs: 6, sm: 3 },
      label: "Login ID",
      placeholder: "Login ID",
    },
    {
      accessor: "CUST_NAME",
      name: "customername",
      label: "Customer Name",
      placeholder: "Customer Name",
      gridconfig: { xs: 12, sm: 6 },
    },
  ],
};
