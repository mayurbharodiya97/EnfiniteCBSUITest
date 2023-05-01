import { GridMetaDataType } from "components/dataTableStatic";
import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { GetMiscValue } from "../api";

export const FromSourceConfigDetailsMetaData: MasterDetailsMetaData = {
  masterForm: {
    form: {
      name: "editfromSourceTemplate",
      label: "From Source Key Template",
      resetFieldOnUmnount: false,
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
        render: {
          componentType: "select",
        },
        name: "DB_COLUMN",
        label: "Response Key",
        placeholder: "Please select Response Key",
        options: () => GetMiscValue(),
        _optionsKey: "GetMiscValue",
        defaultValue: "",
        fullWidth: true,
        validate: "getValidateValue",
        GridProps: {
          xs: 12,
          md: 4,
          sm: 4,
        },
      },
      {
        render: { componentType: "textField" },
        name: "DESCRIPTION",
        label: "Description",
        placeholder: "",
        required: true,
        maxLength: 300,
        showMaxLength: false,
        GridProps: { xs: 12, md: 8, sm: 8 },
        fullWidth: true,
        validate: "getValidateValue",
        autoComplete: "off",
      },
      {
        render: { componentType: "hidden" },
        name: "TRAN_CD",
      },
    ],
  },
  detailsGrid: {
    gridConfig: {
      dense: true,
      gridLabel: "FromSourceDetails",
      rowIdColumn: "SR_CD",
      defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
      allowColumnReordering: true,
      hideHeader: true,
      disableGroupBy: true,
      enablePagination: true,
      containerHeight: { min: "40vh", max: "40vh" },
      allowRowSelection: false,
      hiddenFlag: "_hidden",
      disableLoader: true,
    },
    columns: [
      {
        accessor: "SR_CD",
        columnName: "Sr. No",
        componentType: "default",
        sequence: 1,
        alignment: "right",
        width: 70,
        maxWidth: 150,
        minWidth: 60,
      },
      {
        accessor: "DB_VALUE",
        columnName: "Response Value",
        sequence: 6,
        componentType: "editableTextField",
        placeholder: "",
        width: 400,
        minWidth: 200,
        maxWidth: 600,
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["This field is required"] }],
        },
      },
      {
        columnName: "Action",
        componentType: "deleteRowCell",
        accessor: "_hidden",
        sequence: 12,
      },
    ],
  },
};
