import { GeneralAPI } from "registry/fns/functions";
// const GetMiscValue = () => GeneralAPI.GetMiscValue("BEN_RESTRICT");
export const BeneresMasterFormMetadata = {
  form: {
    name: "BeneresForm",
    label: "Beneficiary Restriction Master",
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
      name: "BEN_LABEL",
      label: "Beneficiary Label",
      placeholder: "",
      options: () => GeneralAPI.GetMiscValue("BEN_RESTRICT"),
      _optionKey: "benRestric",
      defaultValue: "",
      fullWidth: true,
      required: true,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Beneficiary Label is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Beneficiary Label."] },
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
      name: "BEN_VALUE",
      label: "Beneficiary Value",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 300,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Beneficiary Value is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Beneficiary Value."] },
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
        componentType: "hidden",
      },
      name: "TRAN_CD",

      GridProps: {
        xs: 12,
        md: 3,
        sm: 4,
      },
    },
  ],
};
