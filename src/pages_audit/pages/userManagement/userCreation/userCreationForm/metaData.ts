import { utilFunction } from "components/utils";
import { format } from "date-fns";
import { GeneralAPI } from "registry/fns/functions";

export const UserCreationFormMetadata = {
  form: {
    name: "userCreateForm",
    label: "Admin User Maintenance",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",

    render: {
      ordering: "sequence",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 4,
          md: 4,
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
      name: "USER_NAME",
      sequence: 1,
      label: "User ID",
      placeholder: "Enter User ID",
      type: "text",
      required: true,
      maxLength: 16,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["User ID is required."] }],
      },
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
      __EDIT__: { isReadOnly: true },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DESCRIPTION",
      sequence: 2,
      label: "User Name",
      placeholder: "Enter User full name here",
      type: "text",
      required: true,
      maxLength: 32,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["User Name is required."] }],
      },
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
      name: "USER_LEVEL",
      sequence: 3,
      label: "User Level",
      placeholder: "Select User Level",
      options: [
        { label: "ADMIN", value: "4" },
        { label: "HEAD", value: "3" },
        { label: "CHECKER", value: "2" },
        { label: "MAKER", value: "1" },
        { label: "VIEW ONLY", value: "0" },
      ],
      _optionsKey: "GetUserLevel",
      enableDefaultOption: true,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["User level is required."] }],
      },
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    {
      render: { componentType: "passwordField", group: 0 },
      name: "USER_PASSWORD",
      sequence: 7,
      type: "password",
      label: "New Password",
      placeholder: "New Password",
      GridProps: { xs: 6, md: 4, sm: 4 },
      fullWidth: true,
      required: true,
      autoComplete: "off",
      maxLength: 16,
      allowToggleVisiblity: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This is a required field"] }],
      },
      validate: (currentField) => {
        return utilFunction.ValidatePassword(currentField?.value);
      },
      __EDIT__: { render: { componentType: "hidden", group: 0 } },
    },
    {
      render: { componentType: "passwordField", group: 0 },
      name: "CONFIRM_PASSWORD",
      sequence: 8,
      type: "password",
      label: "Confirm Password",
      placeholder: "Confirm Password",
      GridProps: { xs: 6, md: 4, sm: 4 },
      fullWidth: true,
      required: true,
      autoComplete: "off",
      maxLength: 16,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This is a required field"] }],
      },
      dependentFields: ["USER_PASSWORD"],
      runValidationOnDependentFieldsChange: true,
      validate: (currentField, dependentFields) => {
        if (currentField?.value !== dependentFields?.USER_PASSWORD?.value) {
          return "New Password and Confirm Password did not matched";
        } else {
          return "";
        }
      },
      __EDIT__: { render: { componentType: "hidden", group: 0 } },
    },

    {
      render: {
        componentType: "select",
      },
      name: "GROUP_NAME",
      sequence: 6,
      label: "Group Name",
      placeholder: "",
      type: "text",
      required: true,
      options: () => {
        return GeneralAPI.GetSecurityGroupingList();
      },
      enableDefaultOption: true,
      _optionsKey: "GetSecurityGroupingList",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Group Name is required."] }],
      },
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "ALLOW_RELEASE",
      sequence: 9,
      label: "Allow Release",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },

    {
      render: {
        componentType: "phoneNumber",
      },
      name: "CONTACT2",
      sequence: 4,
      label: "Mobile No",
      placeholder: "Mobile No",
      type: "text",
      required: true,
      maxLength: 11,
      StartAdornment: "+88",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Mobile no is required."] }],
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
      name: "EMAIL_ID",
      sequence: 5,
      label: "Email ID",
      placeholder: "Enter the Email ID.",
      type: "text",
      required: true,
      maxLength: 100,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Email ID is required"] },
          { name: "email", params: ["Email ID is invalid"] },
        ],
      },

      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ACTIVE_FLAG",
      sequence: 12,
      label: "Active",
      placeholder: "",
      default: true,
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
      __EDIT__: { render: { componentType: "checkbox", group: 0 } },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "INACTIVE_DATE",
      sequence: 13,
      label: "Inactive Date",
      isReadOnly: true,
      placeholder: "",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
      dependentFields: ["ACTIVE_FLAG"],
      runValidationOnDependentFieldsChange: true,
      setValueOnDependentFieldsChange: (dependent) => {
        if (
          typeof dependent["ACTIVE_FLAG"]?.value === "boolean" &&
          !Boolean(dependent["ACTIVE_FLAG"]?.value)
        ) {
          return format(new Date(), "dd/MM/yyyy HH:mm:ss");
        }
        return null;
      },
      shouldExclude: (val1, dependent) => {
        if (
          typeof dependent["ACTIVE_FLAG"]?.value === "boolean" &&
          Boolean(dependent["ACTIVE_FLAG"]?.value)
        ) {
          return true;
        }
        return false;
      },
      __EDIT__: { render: { componentType: "textField", group: 0 } },
    },
    {
      render: {
        componentType: "select",
      },
      name: "USER_SUB_TYPE",
      sequence: 10,
      label: "User Sub Type",
      placeholder: "",
      options: () => {
        return GeneralAPI.GetMiscValue("USER_SUB_TYPE");
      },
      enableDefaultOption: true,
      _optionsKey: "GetSubTypeMiscValue",
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
      sequence: 14,
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
      name: "NOTIF_TEMPL_TRAN_CD",
      sequence: 11,
      label: "Notification Template",
      placeholder: "",
      options: () => {
        return GeneralAPI.GetUsersNotificationTemplateList();
      },
      enableDefaultOption: true,
      _optionsKey: "GetUsersNotificationTemplateList",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
  ],
};
