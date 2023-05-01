import { FilterFormMetaType } from "components/formcomponent";

export const PasswordResetForm: FilterFormMetaType = {
  gridConfig: {
    dense: true,
    title: "Password Reset Confirmation",
    allowColumnHiding: false,
    submitButtonName: "Password Reset",
    submitButtonHide: true,
    HideHeader: true,
    isDisplayOnly: true,
  },
  fields: [
    {
      accessor: "USER_NM",
      name: "user_nm",
      gridconfig: { xs: 6, sm: 2 },
      label: "Login ID",
      placeholder: "Login ID",
    },
    {
      accessor: "CUST_NAME",
      name: "cust_name",
      gridconfig: { xs: 6, sm: 2 },
      label: "Name",
      placeholder: "Name",
    },
    {
      accessor: "MASK_REG_ACCT_CD",
      name: "mask_reg_acct_cd",
      gridconfig: { xs: 6, sm: 2 },
      label: "Primary Account/Card",
      placeholder: "Primary Account/Card",
    },
    {
      accessor: "REG_CB_NUMBER",
      name: "reg_cb_number",
      label: "Primary CB Number",
      placeholder: "Primary CB Number",
      gridconfig: { xs: 6, sm: 2 },
    },
    {
      accessor: "MOBILE_NO",
      name: "mobile_no",
      label: "Mobile Number",
      placeholder: "Mobile Number",
      isVisible: false,
      gridconfig: { xs: 6, sm: 2 },
    },
    {
      accessor: "EMAIL_ID",
      name: "email_id",
      label: "E-Mail",
      placeholder: "E-Mail",
      isVisible: false,
      gridconfig: { xs: 6, sm: 3 },
    },
    {
      accessor: "LAST_LOGIN_DT",
      name: "last_login_dt",
      label: "Last Login Date",
      placeholder: "Last Login Date",
      gridconfig: { xs: 6, sm: 2 },
    },

    {
      accessor: "PASSWORD_CHANGE_DT",
      name: "password_change_dt",
      label: "Password Change Date",
      placeholder: "Password Change Date",
      gridconfig: { xs: 6, sm: 2 },
    },
  ],
};
