export const getApiFormMetadata: any = {
  form: {
    refID: 1667,
    name: "ActionsMetaData",
    label: "Select-Get API Configuration",
    resetFieldOnUmnount: false,
    validationRun: "onBlur",
    submitAction: "home",
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
          spacing: 2,
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
    },
  },
  fields: [
    {
      render: { componentType: "textField", group: 0 },
      name: "ACTION",
      sequence: 1,
      type: "text",
      label: "Action",
      // isReadOnly: true,
      placeholder: "Action Name",
      maxLength: 100,
      GridProps: { xs: 12, md: 4, sm: 4, xl: 4, lg: 4 },
    },
    {
      render: { componentType: "textField", group: 0 },
      name: "GET_API_TYPE",
      sequence: 6,
      type: "text",
      label: "Get Api Type",
      // isReadOnly: true,
      defaultValue: "SELECT",
      placeholder: "User Group",
      GridProps: { xs: 12, md: 4, sm: 4, xl: 4, lg: 4 },
    },

    {
      render: { componentType: "autocomplete", group: 0 },
      name: "DOC_CD",
      sequence: 8,
      defaultValue: "DEFAULT",
      type: "text",
      label: "DOC_CD",
      options: "getTbgDocMstData",
      _optionsKey: "getTbgDocMstData",
      isReadOnly: true,
      // placeholder: "Default",
      GridProps: { xs: 12, md: 4, sm: 4, xl: 4, lg: 4 },
    },
    {
      render: {
        componentType: "arrayField",
      },
      name: "requestParameters",
      removeRowFn: "deleteFormArrayFieldData",
      label: "Request Parameter(s)",
      arrayFieldIDName: "DOC_CD",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "textField",
          },
          name: "REQ_PARA",
          label: "Request Parameter Name",
          placeholder: "Request Parameter",
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["Action is required."] }],
          },

          GridProps: { xs: 12, md: 4, sm: 4, xl: 4, lg: 4 },
        },

        {
          render: {
            componentType: "autocomplete",
          },
          name: "REQ_PARA_TYPE",
          label: "Data Type",
          defaultValue: "STRING",
          options: [
            { label: "STRING", value: "STRING" },
            { label: "NUMBER", value: "NUMBER" },
            { label: "DATE", value: "DATE" },
          ],

          GridProps: { xs: 12, md: 4, sm: 4, xl: 4, lg: 4 },
        },

        {
          render: {
            componentType: "numberFormat",
          },
          name: "WHERE_SEQ_ID",
          label: "Sequence Id",
          placeholder: "Where sequence id",
          GridProps: { xs: 12, md: 3.5, sm: 3.5, xl: 3.5, lg: 3.5 },
          maxLength: 3,
          FormatProps: {
            isAllowed: (values) => {
              if (
                values?.value === "-" ||
                values.floatValue === 0 ||
                values?.value.length > 3
              ) {
                return false;
              }
              return true;
            },
          },
        },
      ],
    },
  ],
};
