import { utilFunction } from "components/utils";
export const EntryDescMasterFormMetadata = {
  form: {
    name: "entryDescriptionMaster",
    label: "Entry Description Master",
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
    },
  },
  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "SP_CD",
      label: "Code",
      required: true,
      maxLength: 4,
      txtTransform: "uppercase",
      placeholder: "Enter Code",
      isFieldFocused: true,
      __EDIT__: {
        isReadOnly: true,
        isFieldFocused: false,
      },

      validate: (columnValue, ...rest) => {
        let specialChar = /^[^!&]*$/;
        if (columnValue?.value && !specialChar.test(columnValue.value)) {
          return "'!' and '&' not allowed";
        }

        // const duplicate = utilFunction.checkDupliCateValue(
        //   columnValue,
        //   ...rest
        // );
        // return duplicate || "";
      },
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Code is required."] },
          { name: "specialChar", params: ["'!' and '&' not allowed"] },
        ],
      },
      GridProps: {
        xs: 12,
        sm: 12,
        md: 4,
        lg: 4,
        xl: 4,
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "PARENT_TYPE",
      label: "Parent Type",
      options: [
        { label: "Interest", value: "INT " },
        { label: "Static Amount", value: "STA " },
        { label: "Loan Installment", value: "LOIN" },
        { label: "Debt Service Reserve A/c", value: "DSRA" },
        { label: "Security Deposit", value: "SD  " },
      ],
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Parent Type is required."] }],
      },
      __VIEW__: {
        SelectProps: { IconComponent: () => null },
      },
      __EDIT__: {
        isFieldFocused: true,
      },
      GridProps: {
        xs: 12,
        sm: 12,
        md: 4,
        lg: 4,
        xl: 4,
      },
    },
    {
      render: {
        componentType: "textFieldCheckDupliCateValue",
      },
      name: "SP_NM",
      label: "Description",
      required: true,
      maxLength: 50,
      placeholder: "Enter Description",
      txtTransform: "uppercase",
      validate: (columnValue, ...rest) => {
        let specialChar = /^[^!&]*$/;
        if (columnValue?.value && !specialChar.test(columnValue.value)) {
          return "'!' and '&' not allowed";
        }
      },

      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Description is required."] }],
      },
      GridProps: {
        xs: 12,
        sm: 12,
        md: 4,
        lg: 4,
        xl: 4,
      },
    },
  ],
};
