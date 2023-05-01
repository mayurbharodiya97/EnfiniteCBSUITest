import { getUsecase } from "./api";

export const FileconfigMasterFormMetadata = {
  form: {
    name: "FileconfigForm",
    label: "Guideline File Upload",
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
      name: "PARAMETER_NO",
      label: "Use case",
      placeholder: "Please select Usecase",
      options: () => getUsecase(),
      _optionsKey: "getUsecase",
      defaultValue: "",
      fullWidth: true,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Usecase is required."] },
          { name: "PARAMETER_NO", params: ["Please select Usecase"] },
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
      name: "DESCRIPTION",
      label: "Description",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 10,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Description is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Description."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
      __EDIT__: { isFieldFocused: true },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "FILE_NAME",
      label: "File Name",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 20,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["File Name is required."] },
          { name: "DATATYPE_CD", params: ["Please enter File Name."] },
        ],
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
      name: "FILE_TYPE",
      label: "File Type",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 20,
      showMaxLength: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["File Name is required."] },
          { name: "DATATYPE_CD", params: ["Please enter File Name."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TRAN_CD",

      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
    },
  ],
};
