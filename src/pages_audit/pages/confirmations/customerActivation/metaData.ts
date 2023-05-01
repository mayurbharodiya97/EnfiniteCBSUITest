import { FilterFormMetaType } from "components/formcomponent";

export const PasswordResetForm: FilterFormMetaType = {
  gridConfig: {
    dense: true,
    title: "Customer Activation Confirmation",
    allowColumnHiding: false,
    submitButtonName: "Password Reset",
    submitButtonHide: true,
    HideHeader: true,
    isDisplayOnly: true,
  },
  fields: [
    {
      accessor: "REG_USING",
      name: "reg_using",
      gridconfig: { xs: 6, sm: 2 },
      label: "Activation Using",
      placeholder: "",
    },
    {
      accessor: "DESC_ACCT_NO",
      name: "desc_acct_no",
      gridconfig: { xs: 6, sm: 2 },
      label: "Account/Card Number",
      placeholder: "",
    },
    {
      accessor: "USER_NAME",
      name: "user_name",
      gridconfig: { xs: 6, sm: 2 },
      label: "Login ID",
      placeholder: "",
    },
    {
      accessor: "CUST_NAME",
      name: "cust_name",
      gridconfig: { xs: 6, sm: 2 },
      label: "Name",
      placeholder: "Name",
    },
    {
      accessor: "BIRTH_DT",
      name: "birth_dt",
      label: "Birth Date",
      isVisible: false,
      placeholder: "",
      gridconfig: { xs: 6, sm: 2 },
    },
    {
      accessor: "MOBILE_NO",
      name: "mobile_no",
      label: "Mobile Number",
      placeholder: "Mobile Number",
      gridconfig: { xs: 6, sm: 2 },
    },
    {
      accessor: "EMAIL_ID",
      name: "email_id",
      label: "E-Mail",
      placeholder: "E-Mail",
      gridconfig: { xs: 6, sm: 2 },
    },
  ],
};
