// import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { getProMiscData, getMenulistData } from "../api";
export const DynamicGridConfigMetaData = {
  masterForm: {
    form: {
      name: "DynamicGridConfig",
      label: "Dynamic Grid Configure",
      resetFieldOnUnmount: false,
      validationRun: "onBlur",
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
    },
    fields: [
      // {
      //   render: {
      //     componentType: "select",
      //   },
      //   name: "DOC_CD",
      //   label: "Screen Name",
      //   placeholder: "",
      //   type: "text",
      //   //@ts-ignore
      //   options: "getTbgDocMstData",
      //   _optionsKey: "getTbgDocMstData",
      //   fullWidth: true,
      //   required: true,
      //   schemaValidation: {
      //     type: "string",
      //     rules: [
      //       { name: "required", params: ["Screen Name is required."] },
      //       { name: "SCREEN_NAME", params: ["Please enter Screen Name."] },
      //     ],
      //   },
      // },
      {
        render: {
          componentType: "textField",
        },
        name: "DOC_CD",
        label: "Document Code",
        placeholder: "",
        type: "text",
        fullWidth: true,
        maxLength: 12,
        showMaxLength: false,
        required: true,
        __EDIT__: { isReadOnly: true },
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["Document Code is required."] },
            { name: "DOC_CD", params: [12, "Please enter Document Code."] },
          ],
        },
        GridProps: {
          xs: 12,
          md: 3,
          sm: 4,
        },
      },
      {
        render: {
          componentType: "select",
        },
        name: "DOC_ICON",
        label: "Doc Icon",
        placeholder: "",
        type: "text",
        fullWidth: true,
        required: true,
        options: () => getProMiscData("menu_icon"),
        _optionsKey: "getproMiscDataMenuIcon",
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["Doc Icon is required."] },
            { name: "DOC_ICON", params: ["Please enter Doc Icon."] },
          ],
        },
      },
      {
        render: {
          componentType: "select",
        },
        name: "DOC_TYPE",
        label: "Menulist Group",
        fullWidth: true,
        options: () => getMenulistData(),
        _optionsKey: "getMenulistData",
        // required: true,
        // schemaValidation: {
        //   type: "string",
        //   rules: [
        //     { name: "required", params: ["Menulist Group is required."] },
        //     { name: "DOC_TYPE", params: ["Please enter Menulist Group."] },
        //   ],
        // },
      },

      {
        render: {
          componentType: "textField",
        },
        name: "DESCRIPTION",
        label: "Document Title",
        placeholder: "",
        type: "text",
        fullWidth: true,
        required: true,
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["Description is required."] },
            { name: "DESCRIPTION", params: ["Please enter Description."] },
          ],
        },
        GridProps: {
          xs: 12,
          md: 3,
          sm: 4,
        },
      },
      {
        render: {
          componentType: "select",
        },
        name: "RETRIEVAL_TYPE",
        label: "Retrieval Type",
        placeholder: "",
        type: "text",
        fullWidth: true,
        defaultValue: "CUSTOM",
        required: true,
        options: [
          {
            label: "From And TO Date",
            value: "DATE",
          },
          {
            label: "Date And Customer List",
            value: "CUSTOMERLIMIT",
          },
          {
            label: "Date And User Name",
            value: "DATEUSERNM",
          },
          {
            label: "Custom As Per Query",
            value: "CUSTOM",
          },
        ],
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["Retrieval Type is required."] },
            {
              name: "RETRIEVAL_TYPE",
              params: ["Please enter Retrieval Type."],
            },
          ],
        },
        GridProps: {
          xs: 12,
          md: 3,
          sm: 4,
        },
      },
      {
        render: {
          componentType: "checkbox",
        },
        name: "DISABLE_GROUP_BY",
        label: "Disable Group By",
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
        name: "DENSE",
        label: "Dense",
        defaultValue: true,
        GridProps: {
          xs: 12,
          md: 3,
          sm: 3,
        },
      },
      // {
      //   render: {
      //     componentType: "checkbox",
      //   },
      //   name: "GRID_LABEL",
      //   label: "Grid Label",
      //   defaultValue: true,
      //   GridProps: {
      //     xs: 12,
      //     md: 3,
      //     sm: 3,
      //   },
      // },
      {
        render: {
          componentType: "checkbox",
        },
        name: "ROWID_COLUMN",
        label: "RowId Column",
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
        name: "ALLOW_COLUMN_REORDERING",
        label: "Allow Column Reordering",
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
        name: "ENABLE_PAGINATION",
        label: "Enable Pagination",
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
        name: "ALLOW_ROW_SELECTION",
        label: "Allow RowSelection",
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
        name: "IS_CUSRSORFOCUSED",
        label: "Is Cusrsor Focused",
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
        name: "DEFAULT_PAGE_SIZE",
        label: "Default PageSize",
        // defaultValue: true,
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
        name: "PAGE_SIZES",
        label: "Page Sizes",
        placeholder: "",
        options: () => getProMiscData("pageSizes"),
        _optionsKey: "getproMiscData",
        defaultValue: "",
        type: "text",

        // allowToggleVisiblity: true,
        // maxLength: 10,
        // required: true,
        fullWidth: true,
        schemaValidation: {
          type: "string",
        },
        GridProps: {
          xs: 12,
          md: 3,
          sm: 3,
        },
      },
    ],
  },
  detailsGrid: {
    gridConfig: {
      dense: true,
      gridLabel: "Details",
      rowIdColumn: "SR_CD",
      defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
      allowColumnReordering: true,
      hideHeader: true,
      disableGroupBy: true,
      enablePagination: false,
      containerHeight: { min: "42vh", max: "42vh" },
      allowRowSelection: false,
      hiddenFlag: "_hidden",
      disableLoader: true,
    },
    columns: [
      {
        accessor: "SR_CD",
        columnName: "Serial No.",
        componentType: "default",
        sequence: 1,
        alignment: "right",
        width: 86,
        maxWidth: 120,
        minWidth: 70,
      },

      {
        accessor: "COLUMN_ACCESSOR",
        columnName: "Column Accessor",
        componentType: "default",
        required: true,
        validation: (value, data) => {
          if (!Boolean(value)) {
            return "This field is required.";
          }
          return "";
        },
        sequence: 2,
        width: 160,
        maxWidth: 300,
        minWidth: 120,
      },
      {
        accessor: "COLUMN_NAME",
        columnName: "Column Name",
        componentType: "editableTextField",
        required: true,
        validation: (value, data) => {
          if (!Boolean(value)) {
            return "This field is required.";
          }
          return "";
        },
        sequence: 3,
        width: 200,
        maxWidth: 300,
        minWidth: 150,
      },
      {
        accessor: "COMPONENT_TYPE",
        columnName: "Component Type",
        componentType: "editableSelect",
        options: () => getProMiscData("Component_Type"),
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
        sequence: 4,
        width: 200,
        maxWidth: 350,
        minWidth: 180,
      },
      {
        accessor: "SEQ_NO",
        columnName: "Column Sequence",
        componentType: "editableNumberFormat",
        required: true,
        validation: (value, data) => {
          if (!Boolean(value)) {
            return "This field is required.";
          }
          return "";
        },
        alignment: "left",
        sequence: 5,
        width: 140,
        maxWidth: 180,
        minWidth: 150,
      },

      {
        accessor: "COLUMN_WIDTH",
        columnName: "Column Width",
        componentType: "editableTextField",
        required: true,
        validation: (value, data) => {
          if (!Boolean(value)) {
            return "This field is required.";
          }
          return "";
        },
        alignment: "right",
        sequence: 6,
        width: 120,
        maxWidth: 180,
        minWidth: 80,
      },

      {
        accessor: "ALIGNMENT",
        columnName: "Column Alignment",
        componentType: "editableSelect",
        options: () => getProMiscData("alignment"),
        _optionsKey: "getproMiscDataalignment",
        sequence: 7,
        width: 160,
        maxWidth: 300,
        minWidth: 120,
      },

      {
        accessor: "IS_VISIBLE",
        columnName: "Is Visible",
        componentType: "editableCheckbox",
        sequence: 8,
        alignment: "left",
        defaultValue: true,
        placeholder: "",
        width: 90,
        minWidth: 50,
        maxWidth: 100,
      },
    ],
  },
};
