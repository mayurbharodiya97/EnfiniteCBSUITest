export const NpaCategoryMasterFormMetadata = {
  form: {
    name: "npaCategoryMaster",
    label: "NPACategoryMaster",
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
      placeholder: "EnterCode",
      __EDIT__: { isReadOnly: true },
      __NEW__: { isFieldFocused: true },

      validate: (columnValue, ...rest) => {
        let specialChar = /^[^!&]*$/;
        if (columnValue?.value && !specialChar.test(columnValue.value)) {
          return "'!' and '&' not allowed";
        }

        // Duplication validation

        const gridData = rest[1]?.gridData;
        const accessor: any = columnValue.fieldKey.split("/").pop();
        const fieldValue = columnValue.value?.trim().toLowerCase();
        const rowColumnValue = rest[1]?.rows?.[accessor]?.trim().toLowerCase();

        if (fieldValue === rowColumnValue) {
          return "";
        }

        if (gridData) {
          for (let i = 0; i < gridData.length; i++) {
            const ele = gridData[i];
            const trimmedColumnValue = ele?.[accessor]?.trim().toLowerCase();

            if (trimmedColumnValue === fieldValue) {
              return `${fieldValue} is already entered at Sr. No: ${i + 1}`;
            }
          }
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
      GridProps: {
        xs: 12,
        sm: 6,
        md: 4,
        lg: 4,
        xl: 4,
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
        sm: 6,
        md: 4,
        lg: 4,
        xl: 4,
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
      placeholder: "EnterName",
      txtTransform: "uppercase",
      __EDIT__: { isFieldFocused: true },
      validate: (columnValue, ...rest) => {
        let specialChar = /^[^!&]*$/;
        if (columnValue?.value && !specialChar.test(columnValue.value)) {
          return "'!' and '&' not allowed";
        }

        // Duplication validation

        const gridData = rest[1]?.gridData;
        const accessor: any = columnValue.fieldKey.split("/").pop();
        const fieldValue = columnValue.value?.trim().toLowerCase();
        const rowColumnValue = rest[1]?.rows?.[accessor]?.trim().toLowerCase();

        if (fieldValue === rowColumnValue) {
          return "";
        }

        if (gridData) {
          for (let i = 0; i < gridData.length; i++) {
            const ele = gridData[i];
            const trimmedColumnValue = ele?.[accessor]?.trim().toLowerCase();

            if (trimmedColumnValue === fieldValue) {
              return `${fieldValue} is already entered at Sr. No: ${i + 1}`;
            }
          }
        }
        return "";
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Name is required."] }],
      },
      GridProps: {
        xs: 12,
        sm: 6,
        md: 4,
        lg: 4,
        xl: 4,
      },
    },

    {
      render: {
        componentType: "select",
      },
      name: "ASSET_CLS_CD",
      label: "AssetClassificationCode",
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
        sm: 6,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "PENAL_ON_OD_OS",
      label: "CalculatePenalInterestOn",
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
        sm: 6,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "rateOfIntWithoutValidation",
      },
      name: "SECURE_PROV_PERC",
      label: "ProvisionSecureRate",
      placeholder: "Enter Provision Secure Rate",
      defaultValue: "0",
      fullWidth: true,
      FormatProps: {
        allowNegative: false,
      },
      GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "rateOfIntWithoutValidation",
      },
      name: "UNSECURE_PROV_PERC",
      label: "ProvisionUnSecureRate",
      placeholder: "Enter Provision Un-Secure Rate",
      defaultValue: "0",
      fullWidth: true,
      FormatProps: {
        allowNegative: false,
      },
      GridProps: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
    },
  ],
};
