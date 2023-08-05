export const ActionsMetaData: any = {
  form: {
    refID: 1667,
    name: "ActionsMetaData",
    label: "Actions",
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
      render: {
        componentType: "arrayField",
        group: 2,
      },
      name: "actionsDetails",
      removeRowFn: "deleteFormArrayFieldData",
      arrayFieldIDName: "lineNo",
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
      _fields: [
        {
          render: {
            componentType: "hidden",
          },
          name: "lineNo",
        },

        {
          render: {
            componentType: "select",
          },
          name: "ACTIONS",
          label: "Actions",
          defaultValue: "A",
          options: [
            { label: "Add", value: "Add" },
            { label: "View Detail", value: "View-Detail" },
            { label: "Delete", value: "Delete" },
          ],
          postValidationSetCrossFieldValues: "getActionDetailsData",
          GridProps: {
            xs: 12,
            md: 3,
            sm: 3,
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ACTION_NAME",
          label: "Action Name",
          placeholder: "Action Name",
          GridProps: {
            xs: 12,
            md: 3,
            sm: 3,
          },
        },
        {
          render: {
            componentType: "textField",
            group: 2,
          },
          name: "ACTION_LABEL",
          label: "Action Label",
          placeholder: "Action Label",
          GridProps: {
            xs: 12,
            md: 3,
            sm: 3,
          },
        },

        {
          render: {
            componentType: "textField",
            group: 2,
          },
          name: "ACTION_ICON",
          label: "Action Icon",
          placeholder: "Action Icon",
          GridProps: {
            xs: 12,
            md: 3,
            sm: 3,
          },
        },
        {
          render: {
            componentType: "checkbox",
          },
          name: "ROW_DOUBLE_CLICK",
          label: "Row Double Click",
          defaultValue: true,
          GridProps: {
            xs: 12,
            md: 3,
            sm: 3,
          },
        },
        {
          render: {
            componentType: "checkbox",
          },
          name: "ALWAYS_AVALIBALE",
          label: "Always Available",
          defaultValue: true,
          GridProps: {
            xs: 12,
            md: 3,
            sm: 3,
          },
        },
        {
          render: {
            componentType: "checkbox",
          },
          name: "MULTIPLE",
          label: "Multiple",
          defaultValue: true,
          GridProps: {
            xs: 12,
            md: 3,
            sm: 3,
          },
        },
        {
          render: {
            componentType: "textField",
            group: 2,
          },
          name: "SHOULD_EXCLUDE",
          label: "Should Exclude",
          placeholder: "Should Exclude",
          GridProps: {
            xs: 12,
            md: 3,
            sm: 3,
          },
        },
        {
          render: {
            componentType: "textField",
            group: 2,
          },
          name: "ON_ENTER_SUBMIT",
          label: "OnEnter Submit",
          placeholder: "OnEnter Submit",
          GridProps: {
            xs: 12,
            md: 3,
            sm: 3,
          },
        },
        {
          render: {
            componentType: "textField",
            group: 2,
          },
          name: "START_ICON",
          label: "Starts Icon",
          placeholder: "Starts Icon",
          GridProps: {
            xs: 12,
            md: 3,
            sm: 3,
          },
        },
        {
          render: {
            componentType: "textField",
            group: 2,
          },
          name: "END_ICON",
          label: "Ends Icon",
          placeholder: "Ends Icon",
          GridProps: {
            xs: 12,
            md: 3,
            sm: 3,
          },
        },
        {
          render: {
            componentType: "textField",
            group: 2,
          },
          name: "ROTATE_ICON",
          label: "Rotate Icon",
          placeholder: "Rotate Icon",
          GridProps: {
            xs: 12,
            md: 3,
            sm: 3,
          },
        },
      ],
    },
  ],
};
