import { GridMetaDataType } from "components/dataTableStatic";
import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";

export const UserPushnotifDetailsMetaData: MasterDetailsMetaData = {
  masterForm: {
    form: {
      name: "editUserPushnotif",
      label: "User Push Notification Template",
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
        render: { componentType: "textField" },
        name: "DESCRIPTION",
        label: "Push Notification Template Name",
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
      gridLabel: "UserPushnotifDetails",
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
        accessor: "USER_NAME",
        columnName: "USER Login ID",
        sequence: 2,
        componentType: "editableTextField",
        placeholder: "",
        width: 200,
        minWidth: 180,
        maxWidth: 250,
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
