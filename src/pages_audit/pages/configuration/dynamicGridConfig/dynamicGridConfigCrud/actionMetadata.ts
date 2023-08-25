import { GeneralAPI } from "registry/fns/functions";
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
      },
      name: "actionsDetails",
      removeRowFn: "deleteFormArrayFieldData",
      arrayFieldIDName: "DOC_CD",
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
          name: "SR_CD",
          label: "sr.cd",
          placeholder: "",
          GridProps: {
            xs: 12,
            md: 3,
            sm: 3,
          },
        },
        {
          render: {
            componentType: "select",
          },
          name: "ACTION_CD",
          label: "Actions",
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
          name: "ACTIONNAME",
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
          },
          name: "ACTIONLABEL",
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
          },
          name: "ACTIONICON",
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
          name: "ROWDOUBLECLICK",
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
          name: "ALWAYSAVAILABLE",
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
          name: "ISNODATATHENSHOW",
          label: "Is Nodata Then Show",
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
          },
          name: "SHOULDEXCLUDE",
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
          },
          name: "ONENTERSUBMIT",
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
          },
          name: "STARTSICON",
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
          },
          name: "ENDSICON",
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
            componentType: "select",
          },
          name: "FORM_METADATA_SR_CD",
          label: "Metadata List",
          options: "getMetadataList",
          _optionsKey: "getMetadataList",
          requestProps: "DOC_CD",
          GridProps: {
            xs: 12,
            md: 3,
            sm: 3,
          },
        },

        // {
        //   render: {
        //     componentType: "textField",
        //   },
        //   name: "ROTATEICON",
        //   label: "Rotate Icon",
        //   placeholder: "Rotate Icon",
        //   GridProps: {
        //     xs: 12,
        //     md: 3,
        //     sm: 3,
        //   },
        // },
      ],
    },
  ],
};
