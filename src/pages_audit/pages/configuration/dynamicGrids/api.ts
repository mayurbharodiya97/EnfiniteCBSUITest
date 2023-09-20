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
      DOC_CD: data[0].DOC_CD,
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
    return result;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getDynGridData = async ({
  doccd,
  companyID,
  branchID,
  customerID,
  TRAN_CD,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDYNAMICGRIDDATA", {
      DOC_CD: doccd,
      COMP_CD: companyID,
      BRANCH_CD: branchID,
      CUSTOMER_ID: customerID,
      TRAN_CD: TRAN_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDynActionButtonData = async ({
  DOC_CD,
  COMP_CD,
  BRANCH_CD,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETGRIDACTIONLST", {
      DOC_CD: DOC_CD,
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    const result = data.map((item) => {
      return {
        actionLabel: item?.ACTIONLABEL,
        actionName: item?.ACTIONNAME,
        multiple: item?.MULTIPLE === "Y" ? true : false,
        actionIcon: item?.ACTIONICON,
        tooltip: item?.TOOLTIP,
        rowDoubleClick: item?.ROWDOUBLECLICK === "Y" ? true : false,
        alwaysAvailable: item?.ALWAYSAVAILABLE === "Y" ? true : false,
        shouldExclude: item?.SHOULDEXCLUDE,
        isNodataThenShow: item?.ISNODATATHENSHOW === "Y" ? true : false,
        onEnterSubmit: item?.ONENTERSUBMIT,
        startsIcon: item?.ICON_TYPE,
        endsIcon: item?.ACTIONNAME,
        rotateIcon: item?.ACTIONNAME,
        COMP_CD: item?.COMP_CD,
        DOC_CD: item?.DOC_CD,
        FORM_METADATA_SR_CD: item?.FORM_METADATA_SR_CD,
        BRANCH_CD: item?.BRANCH_CD,
        SR_CD: item?.SR_CD,
      };
    });
    return result;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
