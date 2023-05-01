export const AtmLocMasterFormMetadata = {
  form: {
    name: "ATMLocForm",
    label: "ATM Location Master",
    resetFieldOnUmnount: false,
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
      name: "TERMINAL_ID",
      label: "ATM Terminal ID",
      placeholder: "",
      type: "text",
      maxLength: 20,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Terminal ID is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Terminal ID."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
      __EDIT__: { isReadOnly: true },
      __NEW__: { isReadOnly: false, isFieldFocused: true },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ATM_NM",
      label: "ATM Name",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 100,
      showMaxLength: false,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["ATM Name is required."] },
          { name: "DATATYPE_CD", params: ["Please enter ATM Name."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 9,
      },
      __EDIT__: { isFieldFocused: true },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD1",
      label: "Address 1",
      placeholder: "",
      maxLength: 100,
      type: "text",
      required: true,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Address 1 is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Address 1."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 9,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD2",
      label: "Address 2",
      placeholder: "",
      type: "text",
      required: false,
      maxLength: 100,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 9,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD3",
      label: "Address 3",
      placeholder: "",
      type: "text",
      required: false,
      maxLength: 100,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 9,
      },
    },

    {
      render: {
        componentType: "spacer",
      },

      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DIST_CD",
      label: "District Code",
      placeholder: "",
      maxLength: 4,
      type: "text",
      schemaValidation: {
        type: "string",
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "POSTAL_CODE",
      label: "Postal Code",
      placeholder: "",
      type: "text",
      maxLength: 10,
      required: true,
      schemaValidation: {
        type: "string",
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LATITUDE",
      label: "Latitude",
      placeholder: "",
      type: "text",
      maxLength: 10,
      required: true,
      schemaValidation: {
        type: "string",
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LONGITUDE",
      label: "Longitude",
      placeholder: "",
      type: "text",
      maxLength: 10,
      required: true,
      schemaValidation: {
        type: "string",
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
    },
  ],
};
