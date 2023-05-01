import { GetMiscValue } from "../api";

export const MFSConfigEntryMetaData = {
  form: {
    name: "mfsConfig",
    label: "MFS Configuration",
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
        componentType: "select",
      },
      name: "TRN_TYPE",
      label: "MFS Service",
      placeholder: "Select MFS Service",
      type: "text",
      isReadOnly: false,
      required: true,
      options: () => GetMiscValue(),
      _optionsKey: "GetMiscValue",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["MFS Service is required."] }],
      },
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
      __EDIT__: { isReadOnly: true },
      __NEW__: { isReadOnly: false, isFieldFocused: true },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "OPERATOR_ID",
      label: "MFS ID",
      placeholder: "Enter MFS ID",
      type: "text",
      isReadOnly: false,
      maxLength: 10,
      showMaxLength: false,
      required: true,

      autoComplete: "off",
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 10) {
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
        rules: [
          { name: "required", params: ["MFS ID is required."] },
          { name: "DATATYPE_CD", params: ["Please enter MFS ID."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
      __EDIT__: { isReadOnly: true },
      __NEW__: { isReadOnly: false, isFieldFocused: true },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "OPERATOR_NAME",
      label: "MFS Name",
      placeholder: "Enter MFS Name",
      type: "text",
      isReadOnly: false,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["MFS Name is required."] },
          { name: "DATATYPE_CD", params: ["Please enter MFS Name."] },
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
        componentType: "numberFormat",
      },
      name: "MAX_DAY_LIMIT",
      label: "Maximum Daily Transaction Limit",
      placeholder: "",
      type: "text",
      maxLength: 5,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          {
            name: "required",
            params: ["Maximum Daily Transaction Limit is required."],
          },
          {
            name: "DATATYPE_CD",
            params: ["Please enter Maximum Daily Transaction Limit."],
          },
        ],
      },
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
    // {
    //   render: {
    //     componentType: "numberFormat",
    //   },
    //   name: "MAX_DAY_CNT",
    //   label: "Maximum Daily Transaction Count",
    //   placeholder: "",
    //   type: "text",
    //   maxLength: 5,
    //   required: true,
    //   schemaValidation: {
    //     type: "string",
    //     rules: [
    //       {
    //         name: "required",
    //         params: ["Maximum Daily Transaction Count is required."],
    //       },
    //       {
    //         name: "DATATYPE_CD",
    //         params: ["Please enter Maximum Daily Transaction Count."],
    //       },
    //     ],
    //   },
    //   GridProps: {
    //     xs: 12,
    //     md: 3,
    //     sm: 3,
    //   },
    // },
    // {
    //   render: {
    //     componentType: "numberFormat",
    //   },
    //   name: "MAX_MONTH_CNT",
    //   label: "Maximum Monthly Transaction Count",
    //   placeholder: "",
    //   type: "text",
    //   maxLength: 5,
    //   required: true,
    //   schemaValidation: {
    //     type: "string",
    //     rules: [
    //       {
    //         name: "required",
    //         params: ["Maximum Monthly Transaction Count is required."],
    //       },
    //       {
    //         name: "DATATYPE_CD",
    //         params: ["Please enter Maximum Monthly Transaction Count."],
    //       },
    //     ],
    //   },
    //   GridProps: {
    //     xs: 12,
    //     md: 3,
    //     sm: 3,
    //   },
    // },
    {
      render: {
        componentType: "textField",
      },
      name: "TRN_LABEL_EN",
      label: "MFS Label (English)",
      placeholder: "Enter MFS English Language Label",
      type: "text",
      maxLength: 20,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["MFS Label (English) is required."] },
          {
            name: "DATATYPE_CD",
            params: ["Please enter MFS Label (English)."],
          },
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
        componentType: "textField",
      },
      name: "TRN_LABEL_BN",
      label: "MFS Label (Local Language)",
      placeholder: "Enter MFS Local Language Label",
      type: "text",
      maxLength: 20,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          {
            name: "required",
            params: ["MFS Label (Local Language) is required."],
          },
          {
            name: "DATATYPE_CD",
            params: ["Please enter MFS Label (Local Language)."],
          },
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
      name: "TRAN_CD",

      GridProps: {
        xs: 12,
        md: 3,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "OPERATOR_TYPE",
      defaultValue: "W",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 4,
      },
    },
  ],
};
