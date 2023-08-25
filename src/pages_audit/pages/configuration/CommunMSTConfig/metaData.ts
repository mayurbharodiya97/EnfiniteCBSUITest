import { GridMetaDataType } from "components/dataTableStatic";
import { getMiscListData } from "./api";
// import { GetMiscValue } from "../../staticReports/api";
// import { GetMiscValue } from "../../api";
export const FundTrfRetrievalMetadata = {
  form: {
    name: "enterRetrievalParamaters",
    label: "Enter Retrieval Parameters",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 12,
          md: 12,
        },
        container: {
          direction: "row",
          spacing: 2,
        },
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "select",
      },
      name: "CATEGORY_CD",
      // name: "Category-cd",
      label: "Category-cd",
      placeholder: "",
      defaultOptionLabel: "Select Trn Type",
      options: getMiscListData,
      _optionsKey: "getMiscListData",
      defaultValue: "",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },
  ],
};

export const MiscMasteConfigGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Misc Master Configuration",
    rowIdColumn: "DATA_VALUE",
    searchPlaceholder: "Accounts",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "68vh",
      max: "68vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
  },
  // filters: [],
  columns: [
    {
      accessor: "ACC_NO",
      columnName: "Sr. No.",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 80,
      minWidth: 60,
      maxWidth: 100,
      isAutoSequence: true,
    },
    {
      columnName: "Display Name",
      accessor: "DISPLAY_NM",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 300,
      minWidth: 250,
      isReadOnly: true,
      maxWidth: 350,
    },
    {
      columnName: "Data Value",
      accessor: "DATA_VALUE",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      columnName: "Display Value",
      accessor: "DISPLAY_VALUE",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 180,
      minWidth: 140,
      maxWidth: 240,
    },
    {
      columnName: "Remarks",
      accessor: "REMARKS",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 220,
      minWidth: 150,
      maxWidth: 260,
    },
  ],
};
