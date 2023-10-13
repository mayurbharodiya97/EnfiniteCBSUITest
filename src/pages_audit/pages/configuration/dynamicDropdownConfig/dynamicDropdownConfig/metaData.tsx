import { getProMiscData } from "../../dynamicGridConfig/api";
import { getDynApiListData } from "../api";

export const DynamicDropdownConfigMetaData = {
  form: {
    name: "DynamicDropdownConfigure",
    label: "Dynamic Dropdown Configure",
    resetFieldOnUnmount: false,
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
    // {
    //   render: {
    //     componentType: "textField",
    //   },
    //   name: "DDLB_NAME",
    //   label: "Dropdown Name",
    //   placeholder: "",
    //   type: "text",
    //   fullWidth: true,
    //   maxLength: 12,
    //   showMaxLength: false,
    //   // required: true,
    //   // // __EDIT__: { isReadOnly: true },
    //   // schemaValidation: {
    //   //   type: "string",
    //   //   rules: [
    //   //     { name: "required", params: ["Document Code is required."] },
    //   //     { name: "DOC_CD", params: [12, "Please enter Document Code."] },
    //   //   ],
    //   // },
    //   GridProps: { xs: 6, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
    // },
    {
      render: {
        componentType: "textField",
      },
      name: "DDLB_NAME",
      label: "Dropdown Name",
      placeholder: "Dropdown Name",
      type: "text",
      required: true,
      GridProps: { xs: 6, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
    },
    {
      render: { componentType: "select" },
      name: "SOURCE_TYPE",
      label: "Dropdown Source",

      options: [
        { label: "Dynamic SQL", value: "DS" },
        { label: "Register Function", value: "RF" },
        { label: "Defualt Option", value: "DO" },
      ],
      // _optionsKey: "defualt",
      defaultValue: "Dynamic SQL",
      required: true,
      GridProps: { xs: 12, sm: 2, md: 3, lg: 2.5, xl: 1.5 },
      fullWidth: true,
      // validate: "getValidateValue",
      autoComplete: "off",
      //@ts-ignore
      isFieldFocused: true,
    },
    {
      render: { componentType: "autocomplete" },
      name: "SOURCE_NAME",
      label: "API List",
      type: "text",
      fullWidth: true,
      required: true,
      options: (value) => {
        if (value?.SOURCE_TYPE?.value === "DS") {
          return getDynApiListData();
        } else if (value?.SOURCE_TYPE?.value === "RF") {
          return getProMiscData("REGISTER_JS_FUNC");
        }
      },
      _optionsKey: "getProMiscData",
      dependentFields: ["SOURCE_TYPE"],
      disableCaching: true,
      GridProps: { xs: 12, sm: 2, md: 3, lg: 2.5, xl: 1.5 },
      runValidationOnDependentFieldsChange: true,
      shouldExclude: (val1, dependent) => {
        if (dependent["SOURCE_TYPE"]?.value === "DO") {
          return true;
        }
        return false;
      },
      autoComplete: "off",
    },
    {
      render: {
        componentType: "arrayField",
      },
      name: "DDW_OPTION",
      removeRowFn: "deleteFormArrayFieldData",
      arrayFieldIDName: "DDW_OPTION",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      dependentFields: ["SOURCE_TYPE"],
      shouldExclude: (fieldData, dependentFieldsValues, formState) => {
        // console.log("dependentFieldsValues", dependentFieldsValues);
        if (dependentFieldsValues?.SOURCE_TYPE?.value === "DO") {
          return false;
        }
        return true;
      },
      _fields: [
        {
          render: {
            componentType: "textField",
          },
          name: "DISPLAY_VALUE",
          label: "Display Value",
          placeholder: "Display Value",
          GridProps: { xs: 12, sm: 3, md: 4, lg: 6, xl: 2.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "DATA_VALUE",
          label: "Data Value",
          placeholder: "Data Value",
          GridProps: { xs: 12, sm: 3, md: 4, lg: 6, xl: 2.5 },
        },
      ],
    },
  ],
};
