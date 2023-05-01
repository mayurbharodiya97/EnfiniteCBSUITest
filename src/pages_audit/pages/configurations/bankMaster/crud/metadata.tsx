export const CRUDBankMasterMetadata = {
  form: {
    name: "bankMasterEdit",
    label: "Bank Master",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    componentProps: {},
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
  },
  fields: [
    {
      render: { componentType: "numberFormat" },
      name: "ROUTING_NO",
      label: "Routing Number",
      placeholder: "",
      required: true,
      showMaxLength: false,
      GridProps: { xs: 6, md: 6, sm: 3 },
      fullWidth: true,
      autoComplete: "off",
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 11) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This Field is required"] }],
      },
      __VIEW__: { isReadOnly: true },
      __EDIT__: { isReadOnly: true },
      __NEW__: { autoFocus: true },
    },

    {
      render: { componentType: "numberFormat" },
      name: "BANK_CD",
      label: "Bank Code",
      placeholder: "",
      required: true,
      maxLength: 6,
      showMaxLength: false,
      GridProps: { xs: 6, md: 6, sm: 3 },
      fullWidth: true,
      autoComplete: "off",
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 6) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This Field is required"] }],
      },
    },
    {
      render: { componentType: "textField" },
      name: "BANK_NM",
      label: "Bank Name",
      placeholder: "",
      required: true,
      maxLength: 100,
      showMaxLength: false,
      GridProps: { xs: 12, md: 6, sm: 6 },
      fullWidth: true,
      autoComplete: "off",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This Field is required"] }],
      },
    },
    {
      render: { componentType: "numberFormat" },
      name: "NPSB_BANK_CD",
      label: "NPSB Bank Code",
      placeholder: "",
      required: true,
      maxLength: 8,
      showMaxLength: false,
      GridProps: { xs: 6, md: 6, sm: 3 },
      fullWidth: true,
      autoComplete: "off",
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 8) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This Field is required"] }],
      },
    },

    {
      render: { componentType: "numberFormat" },
      name: "BRANCH_CD",
      label: "Branch Code",
      placeholder: "",
      required: true,
      maxLength: 6,
      showMaxLength: false,
      GridProps: { xs: 6, md: 6, sm: 3 },
      fullWidth: true,
      autoComplete: "off",
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 4) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This Field is required"] }],
      },
    },
    {
      render: { componentType: "textField" },
      name: "BRANCH_NM",
      label: "Branch Name",
      placeholder: "",
      required: true,
      maxLength: 100,
      showMaxLength: false,
      GridProps: { xs: 12, md: 6, sm: 6 },
      fullWidth: true,
      autoComplete: "off",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This Field is required"] }],
      },
    },
    {
      render: { componentType: "numberFormat" },
      name: "NEW_DIST_CD",
      label: "Distric Code",
      placeholder: "",
      required: true,
      maxLength: 300,
      showMaxLength: false,
      GridProps: { xs: 6, md: 6, sm: 3 },
      fullWidth: true,
      autoComplete: "off",
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 4) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This Field is required"] }],
      },
    },
    {
      render: { componentType: "checkbox" },
      name: "NPSB_ENABLED",
      label: "NPSB ENABLED",
      showMaxLength: false,
      GridProps: { xs: 6, md: 6, sm: 3 },
      fullWidth: true,
      autoComplete: "off",
    },
    {
      render: { componentType: "checkbox" },
      name: "BEFTN_ENABLED",
      label: "BEFTN ENABLED",
      showMaxLength: false,
      GridProps: { xs: 6, md: 6, sm: 3 },
      fullWidth: true,
      autoComplete: "off",
    },
    {
      render: { componentType: "checkbox" },
      name: "RTGS_ENABLED",
      label: "RTGS ENABLED",
      showMaxLength: false,
      GridProps: { xs: 6, md: 6, sm: 3 },
      fullWidth: true,
      autoComplete: "off",
    },
  ],
};
