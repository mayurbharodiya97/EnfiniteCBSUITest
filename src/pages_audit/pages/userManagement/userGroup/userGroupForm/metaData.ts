import { utilFunction } from "components/utils";
import { format } from "date-fns";
import { GeneralAPI } from "registry/fns/functions";
import { number } from "yup/lib/locale";

export const UserGroupFormMetadata = {
  form: {
    name: "userGroupForm",
    label: "Admin User Group Maintenance",
    resetFieldOnUmnount: false,
    validationRun: "onBlur",
    submitAction: "home",

    render: {
      ordering: "sequence",
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
      name: "GROUP_NAME",
      sequence: 1,
      label: "User Group Name",
      placeholder: "Enter User Group Name",
      type: "text",
      required: true,
      maxLength: 16,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["User Group Name is required."] }],
      },
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
      __EDIT__: { isReadOnly: true },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "USER_NAME",
      sequence: 1,
      label: "User Name",
      placeholder: "Enter User Group Name",
      type: "text",
      defaultValue: "1",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
      __EDIT__: { isReadOnly: true },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "RECENT_DOC_NO",
      sequence: 2,
      label: "No. of Screens under Recent Option",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 5,
      schemaValidation: {
        type: "string",
        rules: [
          {
            name: "required",
            params: ["No. of Screens under Recent Option is required."],
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
      name: "PWD_DAYS",
      sequence: 3,
      label: "Login Password Force Expiry Days",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 5,
      schemaValidation: {
        type: "string",
        rules: [
          {
            name: "required",
            params: ["Login Password Force Expiry Days is required."],
          },
        ],
      },
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },
  ],
};
