import * as API from "../api";

export const ActionTakenMasterFormMetaData = {
  form: {
    name: "actionTakenMaster",
    label: "Action Taken Master",
    validationRun: "onBlur",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 6,
          md: 6,
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
      autocomplete: {
        fullWidth: true,
      },
      checkbox: {
        fullWidth: true,
      },
    },
  },

  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "ACTION_TAKEN_CD",
      label: "Code",
      placeholder: "Enter Code",
      type: "text",
      maxLength: 4,
      autoComplete: "off",
      isFieldFocused: true,
      GridProps: { xs: 12, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
      validate: (columnValue) => {
        let specialChar = /^[^!&]*$/;
        if (columnValue.value && !specialChar.test(columnValue.value)) {
          return "Special character '!' and '&' not allowed";
        }
        return "";
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "DESCRIPTION",
      label: "Description",
      placeholder: "Enter Description",
      maxLength: 50,
      type: "text",
      autoComplete: "off",
      GridProps: { xs: 12, sm: 5, md: 4, lg: 4.5, xl: 4.5 },
      validate: (columnValue) => {
        let specialChar = /^[^!&]*$/;
        if (columnValue.value && !specialChar.test(columnValue.value)) {
          return "Special character '!' and '&' not allowed";
        }
        return "";
      },
    },

    {
      render: { componentType: "autocomplete" },
      name: "SUIT_FILED_STATUS_CD",
      label: "A4 Suit File Status Code",
      options: API.getSuitFldStdMstData,
      _optionsKey: "getSuitFldStdMstData",
      __VIEW__: { isReadOnly: true },
      defaultValue: "A ",
      GridProps: { xs: 12, sm: 5, md: 4, lg: 4.5, xl: 4.5 },
    },

    {
      render: { componentType: "checkbox" },
      name: "LEGAL_PROCESS",
      label: "Legal Process",
      defaultValue: false,
      GridProps: { xs: 12, sm: 12, md: 2, lg: 1.5, xl: 1.5 },
    },
  ],
};
