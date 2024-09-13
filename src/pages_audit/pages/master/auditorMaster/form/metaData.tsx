import { getAuditorMstDSGDDW } from "../api";

export const AuditorMstFormMetaData = {
  form: {
    name: "auditorMaster",
    label: "",
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
      phoneNumberOptional: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: { componentType: "hidden" },
      name: "TRAN_CD",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "AI_NM",
      label: "AuditorName",
      placeholder: "EnterAuditorName",
      maxLength: 100,
      required: true,
      type: "text",
      isFieldFocused: true,
      autoComplete: "off",
      txtTransform: "uppercase",
      preventSpecialCharInput: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["AuditorNameisrequired"] }],
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD1",
      label: "Address1",
      placeholder: "EnterAddress1",
      maxLength: 100,
      type: "text",
      autoComplete: "off",
      txtTransform: "uppercase",
      preventSpecialCharInput: true,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD2",
      label: "Address2",
      placeholder: "EnterAddress2",
      type: "text",
      maxLength: 100,
      autoComplete: "off",
      txtTransform: "uppercase",
      preventSpecialCharInput: true,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "phoneNumberOptional",
      },
      name: "CONTACT1",
      label: "PhoneNo",
      placeholder: "EnterPhoneNo",
      maxLength: 10,
      type: "text",
      autoComplete: "off",
      fullWidth: true,
      preventSpecialCharInput: true,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 6, xl: 6 },
      validate: (columnValue, allField, flag) => {
        if (columnValue.value.length <= 0) {
          return "";
        } else if (columnValue.value.length >= 11) {
          return "The length of your Phone Number is greater than 10 character";
        } else if (columnValue.value.length <= 9) {
          return "The length of your Phone Number is less than 10 character";
        }
        return "";
      },
    },
    {
      render: {
        componentType: "phoneNumberOptional",
      },
      name: "CONTACT2",
      label: "MobileNo",
      placeholder: "EnterMobileNo",
      maxLength: 10,
      fullWidth: true,
      type: "text",
      autoComplete: "off",
      preventSpecialCharInput: true,
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
      GridProps: { xs: 12, sm: 12, md: 12, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "select",
      },
      name: "DESG_CD",
      label: "Designation",
      defaultOptionLabel: "SelectDesignation",
      options: getAuditorMstDSGDDW,
      _optionsKey: "getAuditorMstDSGDDW",
      __VIEW__: {
        SelectProps: { IconComponent: () => null },
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 6, xl: 6 },
    },
  ],
};
