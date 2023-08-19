import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";
import { filters } from "components/report";

export const getDynamicGridMetaData = async ({ docID, COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDYNAMICGRIDMETADATA", {
      DOC_CD: docID,
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });

  if (status === "0") {
    const columns = data[0]?.COLUMNS?.map((one) => {
      return {
        columnName: one.COLUMN_NAME,
        accessor: one.COLUMN_ACCESSOR,
        componentType: one.COMPONENT_TYPE,
        alignment: one.ALIGNMENT,
        sequence: one.SEQ_NO,
        width: one.COLUMN_WIDTH,
        minWidth: 100,
        maxWidth: 200,
        isVisible: one?.IS_VISIBLE === "Y" ? true : false,
      };
    });

    let result = {
      gridConfig: {
        dense: data[0].DENSE,
        gridLabel: data[0].DESCRIPTION,
        rowIdColumn: data[0].ROWID_COLUMN,
        defaultColumnConfig: {
          width: 400,
          maxWidth: 450,
          minWidth: 300,
        },
        allowColumnReordering: data[0].ALLOW_COLUMN_REORDERING,
        disableGroupBy: data[0].DISABLE_GROUP_BY,
        enablePagination: data[0].ENABLE_PAGINATION,
        pageSizes: [data[0].PAGE_SIZES],
        defaultPageSize: data[0].DEFAULT_PAGE_SIZE,
        containerHeight: {
          min: "67vh",
          max: "67vh",
        },
        allowRowSelection: data[0].ALLOW_ROW_SELECTION,
        isCusrsorFocused: data[0].IS_CUSRSORFOCUSED,
      },
      filters: [],
      columns: columns,
      // fields: filter,
    };
    console.log("result", result);
    return result;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
