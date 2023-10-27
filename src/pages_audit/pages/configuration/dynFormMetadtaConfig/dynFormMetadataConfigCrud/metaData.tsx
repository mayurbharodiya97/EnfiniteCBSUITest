import { getProMiscData } from "../../dynamicGridConfig/api";
import { GridMetaDataType } from "components/dataTableStatic";
import { getSourceListData } from "../api";
import { GeneralAPI } from "registry/fns/functions";
export const DynamicFormConfigMetaData = {
  form: {
    name: "Dynamicmetadataconfigure",
    label: "Dynamic Metadata Configure",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    // allowColumnHiding: true,
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
      datetimePicker: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "autocomplete",
      },
      name: "DOC_CD",
      label: "Document Code",
      placeholder: "",
      type: "text",
      //@ts-ignore
      options: "getTbgDocMstData",
      _optionsKey: "getTbgDocMstData",
      fullWidth: true,
      required: true,
      GridProps: { xs: 12, sm: 4, md: 3, lg: 4, xl: 1.5 },
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Document Code is required."] },
          { name: "DOC_CD", params: ["Please enter Document Code."] },
        ],
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DESCRIPTION",
      label: "Metadata Description",
      placeholder: "Metadata Description",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
      maxLength: 50,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Metadata Description is required."] },
        ],
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "FORM_NAME",
      label: "Form name",
      placeholder: "Form name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
      maxLength: 50,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Metadata Description is required."] },
        ],
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "FORM_LABEL",
      label: "Form label",
      placeholder: "Form label",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
      maxLength: 50,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Form label is required."] }],
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "SUBMITACTION",
      label: "Submit Action",
      placeholder: "Submit Action",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
      maxLength: 10,
      options: [{ label: "home", value: "home" }],
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Submit Action is required."] }],
      },
    },
    {
      render: { componentType: "autocomplete" },

      name: "VALIDATIONRUN",
      label: "For Form Metadata Validation Run",
      // required: true,
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },

      fullWidth: true,
      options: [
        { label: "onBlur", value: "onBlur" },
        { label: "onChange", value: "onChange" },
        { label: "all", value: "all" },
      ],
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Validation Run is required."] },
          { name: "VALIDATIONRUN", params: ["Please enter Validation Run."] },
        ],
      },

      // autoComplete: "off",
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "RESETFIELDONUNMOUNT",
      label: "Reset Field On Unmount",
      defaultValue: true,
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "POPULATE",
      label: "Populate",
      endsIcon: "YoutubeSearchedFor",
      rotateIcon: "scale(1.5)",
      placeholder: "",
      type: "text",

      // GridProps: { xs: 12, sm: 4, md: 3, lg: 2.5, xl: 1.5 },
      GridProps: {
        xs: 12,
        md: 1,
        sm: 1,
      },
    },
  ],
};
export const DynamicFormConfigGridMetaDataView: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Search Criteria Data",
    rowIdColumn: "LINE_ID",
    searchPlaceholder: "Accounts",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    // allowColumnReordering: true,
    disableSorting: false,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [10, 20, 30],
    defaultPageSize: 20,
    containerHeight: {
      min: "42vh",
      max: "45vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
  },
  // filters: [],
  columns: [
    {
      accessor: "LINE_ID",
      columnName: "Serial No.",
      componentType: "default",
      sequence: 1,
      alignment: "right",
      width: 86,
      maxWidth: 120,
      isReadOnly: true,
      minWidth: 70,
    },

    {
      accessor: "FIELD_NAME",
      columnName: "Field Name",
      componentType: "editableTextField",
      required: true,
      isReadOnly: true,
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 2,
      width: 200,
      maxWidth: 300,
      minWidth: 150,
    },
    {
      accessor: "COMPONENT_TYPE",
      columnName: "Component Type",
      componentType: "editableSelect",
      // componentType: "editableAutocomplete",
      options: () => getProMiscData("FIELD_COMPONENT_TYPE"),
      _optionsKey: "getproMiscData",
      isReadOnly: true,
      enableDefaultOption: true,
      required: true,
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 3,
      width: 200,
      maxWidth: 350,
      minWidth: 180,
    },

    {
      accessor: "FIELD_LABEL",
      columnName: "Field Label",
      componentType: "editableTextField",
      required: true,
      isReadOnly: true,
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 5,
      width: 200,
      maxWidth: 300,
      minWidth: 150,
    },

    {
      accessor: "FIELD_REQUIRED",
      columnName: "Field Required",
      componentType: "editableTextField",
      required: true,
      isReadOnly: true,
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 6,
      width: 200,
      maxWidth: 300,
      minWidth: 150,
    },
    {
      accessor: "XL",
      columnName: "xl",
      componentType: "editableTextField",
      defaultValue: "1.5",
      required: true,
      isReadOnly: true,
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 7,
      width: 100,
      maxWidth: 300,
      minWidth: 150,
    },
    {
      accessor: "MD",
      columnName: "md",
      componentType: "editableTextField",
      defaultValue: "3",
      required: true,
      isReadOnly: true,
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 8,
      width: 100,
      maxWidth: 300,
      minWidth: 150,
    },
    {
      accessor: "SM",
      columnName: "sm",
      componentType: "editableTextField",
      defaultValue: "4",
      required: true,
      isReadOnly: true,
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 9,
      width: 100,
      maxWidth: 300,
      minWidth: 150,
    },
    {
      accessor: "XS",
      columnName: "xs",
      componentType: "editableTextField",
      defaultValue: "12",
      required: true,
      isReadOnly: true,
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 10,
      width: 100,
      maxWidth: 300,
      minWidth: 150,
    },
    {
      accessor: "LG",
      columnName: "lg",
      componentType: "editableTextField",
      required: true,
      isReadOnly: true,
      defaultValue: "2.5",
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 11,
      width: 100,
      maxWidth: 300,
      minWidth: 150,
    },
  ],
};
export const DynamicFormConfigGridMetaDataEdit: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Search Criteria Data",
    rowIdColumn: "LINE_ID",
    searchPlaceholder: "Accounts",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    // allowColumnReordering: true,
    disableSorting: false,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [10, 20, 30],
    defaultPageSize: 20,
    containerHeight: {
      min: "42vh",
      max: "45vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
  },
  // filters: [],
  columns: [
    {
      accessor: "LINE_ID",
      columnName: "Serial No.",
      componentType: "default",
      sequence: 1,
      alignment: "right",
      width: 86,
      maxWidth: 120,
      minWidth: 70,
    },

    {
      accessor: "FIELD_NAME",
      columnName: "Field Name",
      componentType: "editableTextField",
      required: true,
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 2,
      width: 200,
      maxWidth: 300,
      minWidth: 150,
    },
    {
      accessor: "COMPONENT_TYPE",
      columnName: "Component Type",
      componentType: "editableSelect",
      options: () => getProMiscData("FIELD_COMPONENT_TYPE"),
      _optionsKey: "getproMiscDataComponentType",
      enableDefaultOption: true,
      required: true,
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 3,
      width: 200,
      maxWidth: 350,
      minWidth: 180,
    },
    {
      accessor: "FIELD_LABEL",
      columnName: "Field Label",
      componentType: "editableTextField",
      required: true,
      isReadOnly: true,
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 5,
      width: 200,
      maxWidth: 300,
      minWidth: 150,
    },

    {
      accessor: "FIELD_REQUIRED",
      columnName: "Field Required",
      componentType: "editableTextField",
      required: true,
      isReadOnly: true,
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 6,
      width: 200,
      maxWidth: 300,
      minWidth: 150,
    },
    {
      accessor: "XL",
      columnName: "xl",
      componentType: "editableTextField",
      required: true,
      isReadOnly: true,
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 7,
      width: 100,
      maxWidth: 300,
      minWidth: 150,
    },
    {
      accessor: "MD",
      columnName: "md",
      componentType: "editableTextField",
      defaultValue: "3",
      required: true,
      isReadOnly: true,
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 8,
      width: 100,
      maxWidth: 300,
      minWidth: 150,
    },
    {
      accessor: "SM",
      columnName: "sm",
      componentType: "editableTextField",
      required: true,
      isReadOnly: true,
      defaultValue: "4",
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 9,
      width: 100,
      maxWidth: 300,
      minWidth: 150,
    },
    {
      accessor: "XS",
      columnName: "xs",
      componentType: "editableTextField",
      required: true,
      isReadOnly: true,
      defaultValue: "12",
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 10,
      width: 100,
      maxWidth: 300,
      minWidth: 150,
    },
    {
      accessor: "LG",
      columnName: "lg",
      componentType: "editableTextField",
      required: true,
      isReadOnly: true,
      defaultValue: "2.5",
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 11,
      width: 100,
      maxWidth: 300,
      minWidth: 150,
    },
    {
      columnName: "Config.Props",
      componentType: "buttonRowCell",
      accessor: "VIEW_DETAIL",
      sequence: 4,
      buttonLabel: "...",
      isVisible: true,
      dependentOptionField: "COMPONENT_TYPE",
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
  ],
};
export const DynamicFormConfigGridMetaDataAdd: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Search Criteria Data",
    rowIdColumn: "LINE_ID",
    searchPlaceholder: "Accounts",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    // allowColumnReordering: true,
    disableSorting: false,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [10, 20, 30],
    defaultPageSize: 20,
    containerHeight: {
      min: "42vh",
      max: "45vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
  },
  // filters: [],
  columns: [
    {
      accessor: "LINE_ID",
      columnName: "Serial No.",
      componentType: "default",
      sequence: 1,
      alignment: "right",
      width: 86,
      maxWidth: 120,
      minWidth: 70,
    },

    {
      accessor: "FIELD_NAME",
      columnName: "Field Name",
      componentType: "editableTextField",
      required: true,
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 2,
      width: 200,
      maxWidth: 300,
      minWidth: 150,
    },
    {
      accessor: "COMPONENT_TYPE",
      columnName: "Component Type",
      componentType: "editableSelect",
      options: () => getProMiscData("FIELD_COMPONENT_TYPE"),
      _optionsKey: "getproMiscDataComponentType",
      enableDefaultOption: true,
      required: true,
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 3,
      width: 200,
      maxWidth: 350,
      minWidth: 180,
    },
    {
      accessor: "FIELD_LABEL",
      columnName: "Field Label",
      componentType: "editableTextField",
      required: true,
      isReadOnly: true,
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 5,
      width: 200,
      maxWidth: 300,
      minWidth: 150,
    },
    {
      accessor: "FIELD_REQUIRED",
      columnName: "Field Required",
      componentType: "editableTextField",
      required: true,
      isReadOnly: true,
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 6,
      width: 200,
      maxWidth: 300,
      minWidth: 150,
    },
    {
      accessor: "XL",
      columnName: "xl",
      componentType: "editableTextField",
      required: true,
      isReadOnly: true,
      defaultValue: "1.5",
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 7,
      width: 100,
      maxWidth: 300,
      minWidth: 150,
    },
    {
      accessor: "MD",
      columnName: "md",
      componentType: "editableTextField",
      defaultValue: "3",
      required: true,
      isReadOnly: true,
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 8,
      width: 100,
      maxWidth: 300,
      minWidth: 150,
    },
    {
      accessor: "SM",
      columnName: "sm",
      componentType: "editableTextField",
      required: true,
      isReadOnly: true,
      defaultValue: "4",
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 9,
      width: 100,
      maxWidth: 300,
      minWidth: 150,
    },
    {
      accessor: "XS",
      columnName: "xs",
      componentType: "editableTextField",
      required: true,
      isReadOnly: true,
      defaultValue: "12",
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 10,
      width: 100,
      maxWidth: 300,
      minWidth: 150,
    },
    {
      accessor: "LG",
      columnName: "lg",
      componentType: "editableTextField",
      required: true,
      isReadOnly: true,
      defaultValue: "2.5",
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        return "";
      },
      sequence: 11,
      width: 100,
      maxWidth: 300,
      minWidth: 150,
    },
  ],
};

export const PropsComponentFormMetaData: any = {
  form: {
    refID: 1667,
    name: "PropsComponentFormMetaData",
    label: "PropsComponentFormMetaData",
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
      render: {
        componentType: "arrayField",
      },
      fixedRows: true,
      isDisplayCount: false,
      isCustomStyle: true,
      name: "propsDetails",
      removeRowFn: "deleteFormArrayFieldData",
      arrayFieldIDName: "DOC_CD",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "textField",
          },
          name: "PROPS_ID",
          label: "Props ID",
          placeholder: "Props ID",
          isReadOnly: true,
          GridProps: { xs: 6, sm: 2, md: 2, lg: 2, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "PROPS_VALUE",
          label: "Props Value",
          placeholder: "Props Value",
          GridProps: { xs: 6, sm: 2, md: 3, lg: 3, xl: 1.5 },
          shouldExclude: (val1, dependent) => {
            if (
              dependent["propsDetails.PROPS_ID"]?.value === "options" ||
              dependent["propsDetails.PROPS_ID"]?.value === "schemaValidation"
            ) {
              return true;
            }
            return false;
          },
          runValidationOnDependentFieldsChange: true,
          dependentFields: ["PROPS_ID", "OPTION_VALUE"],
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
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["Source Type is required."] },
              { name: "SOURCE_TYPE", params: ["Please enter Source Type."] },
            ],
          },
          runValidationOnDependentFieldsChange: true,
          shouldExclude: (val1, dependent) => {
            if (
              dependent["propsDetails.OPTION_VALUE"]?.dependentFields?.[0] ===
              "propsDetails[4].PROPS_ID"
            ) {
              return false;
            }

            return true;
          },
          dependentFields: ["OPTION_VALUE"],
          disableCaching: true,
          autoComplete: "off",
          //@ts-ignore
          isFieldFocused: true,
        },
        {
          render: {
            componentType: "select",
          },
          name: "OPTION_VALUE",
          label: "Options Value",
          placeholder: "Props Value",
          GridProps: { xs: 6, sm: 2, md: 3, lg: 3, xl: 1.5 },
          shouldExclude: (val1, dependent) => {
            if (
              dependent["propsDetails.PROPS_ID"]?.value === "options" ||
              dependent["propsDetails.PROPS_ID"]?.value === "schemaValidation"
            ) {
              return false;
            }
            return true;
          },
          runValidationOnDependentFieldsChange: true,
          dependentFields: ["PROPS_ID"],
          options: getSourceListData,
          _optionsKey: "getSourceListData",
          disableCaching: true,
        },

        {
          render: {
            componentType: "select",
          },
          name: "DISPLAY_VALUE",
          label: "Display Value",
          type: "text",
          // options: GeneralAPI.getDynDropdownData,
          options: (value) => {
            if (value?.["propsDetails[4].OPTION_VALUE"]?.value ?? "") {
              return GeneralAPI.getDynDropdownData(
                value?.["propsDetails[4].OPTION_VALUE"]?.value
              );
            }
            return [];
          },
          disableCaching: true,
          _optionsKey: "getDynDropdownData",
          runValidationOnDependentFieldsChange: true,
          dependentFields: ["OPTION_VALUE", "SOURCE_TYPE"],
          shouldExclude: (val1, dependent) => {
            // console.log("getValidateValue", dependent);
            const regex = /^[A-Z]+$/;
            if (regex.test(dependent["propsDetails.OPTION_VALUE"]?.value)) {
              return false;
            }

            return true;
          },
          // shouldExclude: (fieldData, dependentFieldsValues, formState) => {
          //   if (
          //     dependentFieldsValues["propsDetails.OPTION_VALUE"]
          //       ?.optionData?.[0]?.SOURCE_TYPE === "DS"
          //   ) {
          //     return false;
          //   }
          //   return true;
          // },
          GridProps: { xs: 6, sm: 3, md: 3, lg: 3, xl: 1.5 },
        },
        {
          render: {
            componentType: "select",
          },
          name: "DATA_VALUE",
          label: "Data Value",
          placeholder: "Data Value",
          GridProps: { xs: 6, sm: 3, md: 3, lg: 2.5, xl: 2.5 },
          options: (value) => {
            if (value?.["propsDetails[4].OPTION_VALUE"]?.value ?? "") {
              return GeneralAPI.getDynDropdownData(
                value?.["propsDetails[4].OPTION_VALUE"]?.value
              );
            }
            return [];
          },
          disableCaching: true,
          _optionsKey: "getDynDropdown",
          runValidationOnDependentFieldsChange: true,
          dependentFields: ["OPTION_VALUE"],
          shouldExclude: (val1, dependent) => {
            const regex = /^[A-Z]+$/;
            if (regex.test(dependent["propsDetails.OPTION_VALUE"]?.value)) {
              return false;
            }

            return true;
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "SCHEMA_MESSAGE",
          label: "SchemaValidation Message",
          placeholder: "Props Value",
          GridProps: { xs: 6, sm: 2, md: 3, lg: 3, xl: 1.5 },
          shouldExclude: (val1, dependent) => {
            if (
              dependent["propsDetails.PROPS_ID"]?.value === "schemaValidation"
            ) {
              if (dependent["propsDetails.OPTION_VALUE"]?.value) {
                return false;
              }
            }
            return true;
          },
          runValidationOnDependentFieldsChange: true,
          dependentFields: ["PROPS_ID", "OPTION_VALUE"],
        },
      ],
    },
  ],
};
