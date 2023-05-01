import { MetaDataType } from "components/dyanmicForm";
import { GetMiscValue } from "../api";

export const AppVersionMasterMetadata: MetaDataType = {
  form: {
    name: "appVersionMaster",
    label: "Application Version Master",
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
      name: "DEVICE_OS",
      label: "Device O.S.",
      placeholder: "Please select Parent Type",
      options: () => GetMiscValue(),
      _optionsKey: "GetMiscValue",
      defaultValue: "",
      fullWidth: true,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Device O.S. is required."] },
          { name: "DEVICE_OS", params: ["Please select Device O.S."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
      __EDIT__: { isReadOnly: true },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "VERSION_NO",
      label: "Version",
      placeholder: "",
      type: "text",
      fullWidth: true,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Version is required."] },
          { name: "VERSION_NO", params: ["Please enter Version."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
      __EDIT__: { isReadOnly: true },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "IS_POPUP",
      label: "Popup Message",
      defaultValue: false,
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
      __EDIT__: { render: { componentType: "checkbox" } },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "IS_FORCE_UPDATE",
      label: "Force Update",
      defaultValue: false,
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
      __EDIT__: { render: { componentType: "checkbox" } },
    },
  ],
};
