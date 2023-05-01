import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { getSchemeSource } from "registry/fns/functions/calculation";

export const DynamicReportConfigMetaData: MasterDetailsMetaData = {
  masterForm: {
    form: {
      name: "addDynamicRptConfig",
      label: "Dynamic Report Configure",
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
      {
        render: { componentType: "hidden" },
        name: "TRAN_CD",
      },
      {
        render: {
          componentType: "textField",
        },
        name: "TITLE",
        label: "Title",
        placeholder: "",
        type: "text",
        fullWidth: true,
        required: true,
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["Title is required."] },
            { name: "TITLE", params: ["Please enter Title."] },
          ],
        },
        GridProps: {
          xs: 12,
          md: 3,
          sm: 6,
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "DESCRIPTION",
        label: "Description",
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
          sm: 6,
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "RETRIEVAL_TYPE",
        label: "Retrieval Type",
        placeholder: "",
        type: "text",
        fullWidth: true,
        required: true,
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
        name: "HIDE_AMOUNT_IN",
        label: "Hide Amount In",
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
        name: "HIDE_FOOTER",
        label: "Hide Footer",
        defaultValue: true,
        GridProps: {
          xs: 12,
          md: 3,
          sm: 2,
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
        sequence: 2,
        width: 200,
        maxWidth: 300,
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
        sequence: 2,
        width: 120,
        maxWidth: 180,
        minWidth: 80,
      },
      {
        accessor: "COLUMN_TYPE",
        columnName: "Column Type",
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
        maxWidth: 350,
        minWidth: 180,
      },
      {
        accessor: "COLUMN_FORMAT",
        columnName: "Column Format",
        componentType: "editableTextField",
        sequence: 2,
        width: 160,
        maxWidth: 300,
        minWidth: 120,
      },
      {
        accessor: "COLUMN_FILTER_TYPE",
        columnName: "Column Filter Type",
        componentType: "editableTextField",
        sequence: 2,
        width: 160,
        maxWidth: 300,
        minWidth: 120,
      },
      {
        accessor: "IS_VISIBLE",
        columnName: "Is Visible",
        componentType: "editableCheckbox",
        sequence: 6,
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

export const EditViewDynamicReportConfigMetaData: MasterDetailsMetaData = {
  masterForm: {
    form: {
      name: "addDynamicRptConfig",
      label: "Dynamic Report Configure",
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
      {
        render: { componentType: "hidden" },
        name: "TRAN_CD",
      },
      {
        render: {
          componentType: "textField",
        },
        name: "TITLE",
        label: "Title",
        placeholder: "",
        type: "text",
        fullWidth: true,
        required: true,
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["Title is required."] },
            { name: "TITLE", params: ["Please enter Title."] },
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
        name: "DESCRIPTION",
        label: "Description",
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
          md: 4,
          sm: 4,
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "RETRIEVAL_TYPE",
        label: "Retrieval Type",
        placeholder: "",
        type: "text",
        fullWidth: true,
        required: true,
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
          md: 4,
          sm: 4,
        },
      },
      {
        render: {
          componentType: "checkbox",
        },
        name: "ACTIVE",
        label: "Active",
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
        name: "HIDE_AMOUNT_IN",
        label: "Hide Amount In",
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
        name: "HIDE_FOOTER",
        label: "Hide Footer",
        defaultValue: true,
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
        isAutoSequence: true,
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
        sequence: 2,
        width: 200,
        maxWidth: 300,
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
        sequence: 2,
        width: 120,
        maxWidth: 180,
        minWidth: 80,
      },
      {
        accessor: "COLUMN_TYPE",
        columnName: "Column Type",
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
        maxWidth: 350,
        minWidth: 180,
      },
      {
        accessor: "COLUMN_FORMAT",
        columnName: "Column Format",
        componentType: "editableTextField",
        sequence: 2,
        width: 160,
        maxWidth: 300,
        minWidth: 120,
      },
      {
        accessor: "COLUMN_FILTER_TYPE",
        columnName: "Column Filter Type",
        componentType: "editableTextField",
        sequence: 2,
        width: 160,
        maxWidth: 300,
        minWidth: 120,
      },
      {
        accessor: "IS_VISIBLE",
        columnName: "Is Visible",
        componentType: "editableCheckbox",
        sequence: 6,
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
