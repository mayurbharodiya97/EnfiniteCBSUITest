import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { GetMiscValue } from "../api";
// import { getCardCategorySource } from "registry/fns/functions/calculation";

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
          componentType: "select",
        },
        name: "CARD_PERFIX",
        label: "Card Prefix",
        placeholder: "Select Card Prefix",
        type: "text",
        fullWidth: true,
        required: true,
        options: [
          { label: "1", value: 1 },
          { label: "2", value: 2 },
          { label: "3", value: 3 },
          { label: "4", value: 4 },
          { label: "5", value: 5 },
          { label: "6", value: 6 },
          { label: "7", value: 7 },
          { label: "8", value: 8 },
          { label: "9", value: 9 },
          { label: "10", value: 10 },
        ],
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["Card Prefix is required."] }],
        },
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
        name: "CATEGORY_CD",
        label: "Card Category",
        placeholder: "Select Card Category",
        type: "text",
        fullWidth: true,
        required: true,
        options: () => GetMiscValue(),
        _optionsKey: "GetMiscValue",
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["Card Category is required."] }],
        },
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
          md: 6,
          sm: 6,
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
