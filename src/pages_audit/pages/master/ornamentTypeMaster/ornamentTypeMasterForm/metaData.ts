export const OrnamentTypeMasterFormMetaData = {
  form: {
    name: "ornamentTypeMaster",
    label: "OrnamentTypeMasterForm",
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
      rateOfInt: {
        fullWidth: true,
      },
    },
  },

  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "CODE",
      label: "Code",
      placeholder: "EnterCode",
      type: "text",
      maxLength: 4,
      isFieldFocused: true,
      autoComplete: "off",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["CodeisRequired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 3 },
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
    },

    {
      render: {
        componentType: "textField",
      },
      name: "DESCRIPTION",
      label: "Description",
      placeholder: "EnterDescription",
      maxLength: 50,
      type: "text",
      autoComplete: "off",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["DescriptionisRequired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 6 },
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
    },

    {
      render: {
        componentType: "rateOfInt",
      },
      name: "ORN_MARGIN",
      label: "Margin%",
      autoComplete: "off",
      required: true,
      fullWidth: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["MarginisRequired"] }],
      },
      GridProps: {
        xs: 12,
        sm: 4,
        md: 4,
        lg: 4,
        xl: 3,
      },
      FormatProps: {
        isAllowed: (values) => {
          //@ts-ignore
          if (parseFloat(values?.value) >= 100.01) {
            return false;
          }
          return true;
        },
      },
    },
  ],
};