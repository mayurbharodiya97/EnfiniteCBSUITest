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
    {
      render: {
        componentType: "textField",
      },
      name: "DDW_NAME",
      label: "Dropdown Name",
      placeholder: "",
      type: "text",
      fullWidth: true,
      maxLength: 12,
      showMaxLength: false,
      // required: true,
      // // __EDIT__: { isReadOnly: true },
      // schemaValidation: {
      //   type: "string",
      //   rules: [
      //     { name: "required", params: ["Document Code is required."] },
      //     { name: "DOC_CD", params: [12, "Please enter Document Code."] },
      //   ],
      // },
      GridProps: { xs: 6, sm: 2, md: 2, lg: 1.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "DDW_LIST",
      label: "Dropdown Source",
      defaultValue: "Dynamic SQL",
      options: [
        { label: "Dynamic SQL", value: "Dynamic SQL" },
        { label: "Register Function", value: "Register Function" },
        { label: "Defualt Option", value: "Defualt Option" },
      ],
      _optionsKey: "GetDropdownList",
      GridProps: { xs: 12, sm: 3, md: 3, lg: 2.5, xl: 1.5 },
    },

    {
      render: {
        componentType: "select",
      },
      name: "API_LIST",
      label: "API List",
      options: () => getDynApiListData(),
      _optionsKey: "getDynApiListData",
      // options: "getMetadataList",
      // _optionsKey: "getMetadataList",
      // requestProps: "DOC_CD",
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
      runValidationOnDependentFieldsChange: true,
      dependentFields: ["DDW_LIST"],
      shouldExclude: (val1, dependent) => {
        if (dependent["DDW_LIST"]?.value === "Dynamic SQL") {
          return false;
        }
        return true;
      },
    },

    {
      render: {
        componentType: "select",
      },
      name: "REGISTER_API_LIST",
      label: "API List",
      options: () => getProMiscData("REGISTER_JS_FUNC"),
      _optionsKey: "getproMiscDataMenuIcon",
      GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 1.5 },
      runValidationOnDependentFieldsChange: true,
      dependentFields: ["DDW_LIST"],
      shouldExclude: (val1, dependent) => {
        if (dependent["DDW_LIST"]?.value === "Register Function") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REGISTER_FN",
      label: "Register Function",
      placeholder: "Register Function",
      GridProps: { xs: 12, sm: 3, md: 4, lg: 6, xl: 2.5 },
      runValidationOnDependentFieldsChange: true,
      dependentFields: ["DDW_LIST"],
      shouldExclude: (val1, dependent) => {
        if (dependent["DDW_LIST"]?.value === "Register Function") {
          return false;
        }
        return true;
      },
    },
    // {
    //   render: {
    //     componentType: "textField",
    //   },
    //   name: "DISPLAY_VALUE",
    //   label: "Dynamic Source Config.",
    //   placeholder: "Dynamic Source Config.",
    //   GridProps: { xs: 12, sm: 3, md: 3, lg: 2.5, xl: 2.5 },
    //   runValidationOnDependentFieldsChange: true,
    //   dependentFields: ["DDW_LIST"],
    //   shouldExclude: (val1, dependent) => {
    //     if (dependent["DDW_LIST"]?.value === "Dynamic SQL") {
    //       return false;
    //     }
    //     return true;
    //   },
    // },
    // {
    //   render: {
    //     componentType: "select",
    //   },
    //   name: "DISPLAY_VALUE",
    //   label: "Display Label",
    //   placeholder: "Label",
    //   GridProps: { xs: 12, sm: 3, md: 3, lg: 2.5, xl: 2.5 },
    //   runValidationOnDependentFieldsChange: true,
    //   dependentFields: ["DDW_LIST"],
    //   shouldExclude: (val1, dependent) => {
    //     if (dependent["DDW_LIST"]?.value === "Dynamic SQL") {
    //       return false;
    //     }
    //     return true;
    //   },
    // },
    // {
    //   render: {
    //     componentType: "select",
    //   },
    //   name: "DATA_VALUE",
    //   label: "Data Value",
    //   placeholder: "Value",
    //   GridProps: { xs: 12, sm: 3, md: 3, lg: 2.5, xl: 2.5 },
    //   runValidationOnDependentFieldsChange: true,
    //   dependentFields: ["DDW_LIST"],
    //   shouldExclude: (val1, dependent) => {
    //     if (dependent["DDW_LIST"]?.value === "Dynamic SQL") {
    //       return false;
    //     }
    //     return true;
    //   },
    // },
    {
      render: {
        componentType: "arrayField",
      },
      name: "actionsDetails",
      removeRowFn: "deleteFormArrayFieldData",
      arrayFieldIDName: "DOC_CD",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      dependentFields: ["DDW_LIST"],
      shouldExclude: (fieldData, dependentFieldsValues, formState) => {
        if (dependentFieldsValues?.DDW_LIST?.value === "Defualt Option") {
          return false;
        }
        return true;
      },
      _fields: [
        {
          render: {
            componentType: "hidden",
          },
          name: "SR_CD",
          label: "sr.cd",
          placeholder: "",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
        },
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
