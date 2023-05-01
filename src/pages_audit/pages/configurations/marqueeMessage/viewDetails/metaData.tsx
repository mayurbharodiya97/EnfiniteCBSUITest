import { MetaDataType } from "components/dyanmicForm";

export const MarqueeMessageDetailsMetaData: MetaDataType = {
  form: {
    name: "Marquee Message",
    label: "Marquee Text Configuration",
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
      name: "CHANNEL",
      label: "channel",
      placeholder: "Select",
      defaultOptionLabel: "Channel",
      options: [
        { label: "Internet Banking", value: "I" },
        { label: "Mobile Banking", value: "M" },
      ],
      GridProps: { xs: 10, md: 10, sm: 4 },
    },
    {
      render: {
        componentType: "datetimePicker",
      },
      name: "VALID_FROM_DT",
      label: "Effective From",
      placeholder: "",
      format: "dd/MM/yyyy",
      GridProps: { xs: 10, md: 10, sm: 4 },
      __EDIT__: { GridProps: { xs: 10, md: 10, sm: 3 } },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Effective From is required."] }],
      },
      // dependentFields: ["VALID_TO_DT"],
      // runValidationOnDependentFieldsChange: true,
      // validate: {
      //   conditions: {
      //     all: [
      //       {
      //         fact: "dependentFields",
      //         path: "$.VALID_TO_DT.value",
      //         operator: "greaterThanInclusiveDate",
      //         value: { fact: "currentField", path: "$.value" },
      //       },
      //     ],
      //   },
      //   success: "",
      //   failure: "Effective From should be less than or equal Effective To.",
      // },
    },
    {
      render: {
        componentType: "datetimePicker",
      },
      name: "VALID_TO_DT",
      label: "Effective To",
      placeholder: "",
      format: "dd/MM/yyyy",
      GridProps: { xs: 10, md: 10, sm: 4 },
      __EDIT__: { GridProps: { xs: 10, md: 10, sm: 3 } },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Effective To is required."] }],
      },
      dependentFields: ["VALID_FROM_DT"],
      runValidationOnDependentFieldsChange: true,
      validate: {
        conditions: {
          all: [
            {
              fact: "dependentFields",
              path: "$.VALID_FROM_DT.value",
              operator: "lessThanInclusiveDate",
              value: { fact: "currentField", path: "$.value" },
            },
          ],
        },
        success: "",
        failure:
          "Effective To should be greater than or equal to Effective From.",
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "STATUS",
      label: "Active",
      // defaultValue: true,
      __EDIT__: { render: { componentType: "checkbox" } },
      GridProps: { xs: 10, md: 10, sm: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MSG_ALERT",
      label: "Marquee Text (English)",
      placeholder: "",
      multiline: true,
      minRows: 2,
      maxRows: 2,
      GridProps: { xs: 10, md: 10, sm: 12 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MSG_ALERT_BN",
      label: "Marquee Text (Local)",
      placeholder: "",
      multiline: true,
      minRows: 2,
      maxRows: 2,
      GridProps: { xs: 10, md: 10, sm: 12 },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "COMP_CD",
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "SR_NO",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TRAN_CD",
    },
  ],
};
