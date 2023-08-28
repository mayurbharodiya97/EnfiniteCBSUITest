// import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
// import { getProMiscData } from "./api";
import { getProMiscData } from "../../dynamicGridConfig/api";
import { GridMetaDataType } from "components/dataTableStatic";
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
        componentType: "select",
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
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Screen Name is required."] },
          { name: "SCREEN_NAME", params: ["Please enter Screen Name."] },
        ],
      },
    },
    // {
    //   render: {
    //     componentType: "textField",
    //   },
    //   name: "DOC_CD",
    //   label: "Document Code",
    //   placeholder: "Document Code",
    //   defaultValue: "",
    //   type: "text",
    //   maxLength: 12,
    //   showMaxLength: false,
    //   required: false,
    //   fullWidth: true,
    //   autoComplete: false,
    //   // startsIcon: Account_Number_Svg,
    //   GridProps: {
    //     xs: 12,
    //     md: 2.5,
    //     sm: 2.5,
    //   },
    // },
    {
      render: {
        componentType: "textField",
      },
      name: "DESCRIPTION",
      label: "Metadata Description",
      placeholder: "Metadata Description",
      type: "text",
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
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
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
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
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SUBMITACTION",
      label: "Submit Action",
      placeholder: "Submit Action",
      type: "text",
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
      },
    },
    {
      render: { componentType: "select" },

      name: "VALIDATIONRUN",
      label: "Validation Run",
      // required: true,
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
      },
      fullWidth: true,
      options: [
        { label: "onBlur", value: "onBlur" },
        { label: "onChange", value: "onChange" },
        { label: "all", value: "all" },
      ],
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["This Field is required"] }],
      // },
      // autoComplete: "off",
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "RESETFIELDONUNMOUNT",
      label: "Reset Field On Unmount",
      defaultValue: true,
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
      },
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
      GridProps: {
        xs: 12,
        md: 1,
        sm: 1,
      },
    },
  ],
};

export const DynamicFormConfigGridMetaData: GridMetaDataType = {
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
    defaultPageSize: 10,
    containerHeight: {
      min: "42vh",
      max: "45vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
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
      defaultValue: "DATA_VALUE",
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
      columnName: "Config.Props",
      componentType: "buttonRowCell",
      accessor: "VIEW_DETAIL",
      sequence: 4,
      buttonLabel: "...",
      isVisible: false,
      __EDIT__: { isVisible: true },
      width: 100,
      minWidth: 50,
      maxWidth: 150,
    },
  ],
};

export const FieldComponentGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: " Numbers",
    rowIdColumn: "PROPS_ID",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: false,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "40vh",
      max: "50vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
    disableLoader: true,
  },
  filters: [],
  columns: [
    {
      accessor: "_displaySequence",
      columnName: "Sr. No.",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 80,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "PROPS_ID",
      columnName: "Props ID",
      sequence: 2,
      alignment: "left",
      componentType: "editableTextField",
      placeholder: "",
      width: 200,
      minWidth: 180,
      maxWidth: 250,
      // validation: (value, data, prev) => {
      //   if (!Boolean(value)) {
      //     return "This is a required field";
      //   } else {
      //     let response = "";
      //     prev?.forEach((item) => {
      //       if (item.TENURE && item.TENURE === value) {
      //         response = "This Value already exists.";
      //         return;
      //       }
      //     });
      //     return response;
      //   }
      // },
    },
    {
      accessor: "PROPS_VALUE",
      columnName: "Props Value",
      sequence: 3,
      alignment: "left",
      componentType: "editableTextField",
      placeholder: "",
      width: 200,
      minWidth: 180,
      maxWidth: 250,
    },
    {
      columnName: "Action",
      componentType: "deleteRowCell",
      accessor: "_hidden",
      sequence: 11,
      width: 120,
      minWidth: 120,
      maxWidth: 120,
    },
  ],
};
