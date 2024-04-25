export const NpaCategoryMasterFormMetadata = {
  form: {
    name: "npaCategoryMaster",
    label: "NPA Category Master",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 12,
          xl: 12,
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
      Divider: {
        fullWidth: true,
      },
      rateOfIntWithoutValidation: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "NPA_CD",
      label: "Code",
      required: true,
      maxLength: 4,
      placeholder: "Enter Code",
      __EDIT__: { isReadOnly: true },

      validate: (columnValue) => {
        let specialChar = /^[^!&]*$/;
        if (columnValue.value && !specialChar.test(columnValue.value)) {
          return "'!' and '&' not allowed";
        }
        return "";
      },

      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Code is required."] },
          {
            name: "NPA_CD",
            params: ["Please enter Code."],
          },
        ],
      },
      isFieldFocused: true,
      GridProps: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
        xl: 6,
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "NPA_CD_PARENT",
      label: "Parent",
      __EDIT__: { isReadOnly: true },
      __VIEW__: {
        SelectProps: { IconComponent: () => null },
      },
      options: [
        { label: "01 STANDARD", value: "01  " },
        { label: "02 SUB-STANDARD", value: "02  " },
        { label: "03 DOUBTFUL", value: "03  " },
        { label: "04 LOSS", value: "04  " },
      ],
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Parent is required."] }],
      },
      GridProps: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
        xl: 6,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DESCRIPTION",
      label: "Name",
      required: true,
      maxLength: 100,
      placeholder: "Enter Name",
      txtTransform: "uppercase",
      validate: (columnValue) => {
        let specialChar = /^[^!&]*$/;
        if (columnValue.value && !specialChar.test(columnValue.value)) {
          return "'!' and '&' not allowed";
        }
        return "";
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Name is required."] }],
      },
      GridProps: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
        xl: 12,
      },
    },

    {
      render: {
        componentType: "select",
      },
      name: "ASSET_CLS_CD",
      label: "A5 asset Classification Code",
      defaultOptionLabel: "Select option",
      __VIEW__: {
        SelectProps: { IconComponent: () => null },
      },
      options: [
        { label: "A STANDARD", value: "A" },
        { label: "B SUB-STANDARD", value: "B" },
        { label: "C DOUTFUL", value: "C" },
        { label: "D LOSS", value: "D" },
        { label: "E SPECIAL MENTION", value: "E" },
      ],
      GridProps: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
        xl: 6,
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "PENAL_ON_OD_OS",
      label: "Calculate Penal Interest On",
      __VIEW__: {
        SelectProps: { IconComponent: () => null },
      },
      defaultValue: "D",
      options: [
        { label: "Overdue Amount", value: "D" },
        { label: "Outstanding Amount", value: "S" },
      ],
      GridProps: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
        xl: 6,
      },
    },

    {
      render: {
        componentType: "Divider",
      },
      dividerText: "Provision Rate",
      name: "Rate",
    },

    {
      render: {
        componentType: "rateOfIntWithoutValidation",
      },
      name: "SECURE_PROV_PERC",
      label: "Secure Rate",
      placeholder: "Enter Provision Secure Rate",
      fullWidth: true,
      FormatProps: {
        allowNegative: false,
      },
      GridProps: { xs: 12, sm: 12, md: 6, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "rateOfIntWithoutValidation",
      },
      name: "UNSECURE_PROV_PERC",
      label: "Un-Secure Rate",
      placeholder: "Enter Provision Un-Secure Rate",
      fullWidth: true,
      FormatProps: {
        allowNegative: false,
      },
      GridProps: { xs: 12, sm: 12, md: 6, lg: 6, xl: 6 },
    },
  ],
};
