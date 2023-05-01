import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
// import { getCardCategorySource } from "registry/fns/functions/calculation";
import { GetLeafTemplateDD, GetParentTypeDD } from "../api";

export const cardCategoryMasterDetailsMetaData: MasterDetailsMetaData = {
  masterForm: {
    form: {
      name: "addCardCategoryMaster",
      label: "Card Category Master",
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
        name: "CARD_PERFIX",
        label: "Card Prefix",
        placeholder: "Enter Card Prefix",
        type: "text",
        isReadOnly: false,
        fullWidth: true,
        required: true,
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["Card Prefix is required."] }],
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
        name: "CATEGORY_CD",
        label: "Card Category",
        placeholder: "Enter Card Category",
        type: "text",
        isReadOnly: false,
        fullWidth: true,
        required: true,
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["Card Category is required."] }],
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
        label: "Card Description",
        placeholder: "Enter Card Description",
        type: "text",
        isReadOnly: false,
        fullWidth: true,
        required: true,
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["Card Description is required."] },
          ],
        },
        GridProps: {
          xs: 12,
          md: 4,
          sm: 4,
        },
      },
    ],
  },
  detailsGrid: {
    gridConfig: {
      dense: true,
      gridLabel: "Card Sub Categories",
      rowIdColumn: "SR_CD",
      defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
      allowColumnReordering: true,
      hideHeader: true,
      disableGroupBy: true,
      enablePagination: false,
      containerHeight: { min: "40vh", max: "40vh" },
      allowRowSelection: false,
      hiddenFlag: "_hidden",
      disableLoader: true,
    },
    columns: [
      {
        accessor: "SR_CD",
        columnName: "Serial No",
        componentType: "default",
        sequence: 1,
        alignment: "right",
        width: 100,
        maxWidth: 150,
        minWidth: 70,
      },
      {
        accessor: "SUB_CATEGORY",
        columnName: "Sub Category",
        componentType: "editableTextField",
        placeholder: "Enter Sub Category",
        required: true,
        validation: (value, data) => {
          if (!Boolean(value)) {
            return "This field is required.";
          }
          return "";
        },
        sequence: 2,
        alignment: "left",
        width: 250,
        maxWidth: 350,
        minWidth: 200,
      },
      {
        columnName: "Action",
        componentType: "deleteRowCell",
        accessor: "_hidden",
        sequence: 11,
      },
    ],
  },
};
