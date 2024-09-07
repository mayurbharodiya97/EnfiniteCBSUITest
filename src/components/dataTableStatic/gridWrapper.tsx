import {
  useMemo,
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
  useContext,
} from "react";
import { cloneDeep } from "lodash-es";
import {
  attachAlignmentProps,
  sortColumnsBySequence,
  extractHiddenColumns,
  SplitActions,
  attachCellComponentsToMetaData,
} from "components/dataTable/utils";
import {
  attachMethodsToMetaData,
  attachYupSchemaValidator,
  attachcombinedValidationFns,
} from "./utils";
import { GridMetaDataType, GridWrapperPropTypes } from "./types";
import { DefaultHeaderColumnRenderer } from "./components";
import { DataGrid } from "./grid";
import {
  AutoRefreshProvider,
  useAutoRefreshControls,
} from "../utils/autoRefresh";
import { attachFilterComponentToMetaData } from "components/dataTable/utils";
import { useTranslation } from "react-i18next";
import { FooterCell } from "components/tableCellComponents/footerCell";
import { utilFunction } from "components/utils";
import { AuthContext } from "pages_audit/auth";
import { useLocation } from "react-router-dom";
export const GridWrapperWithAutoRefresh = forwardRef<any, GridWrapperPropTypes>(
  (props, ref) => {
    return (
      <AutoRefreshProvider>
        <GridWrapper {...props} ref={ref} />
      </AutoRefreshProvider>
    );
  }
);

export const GridWrapper = forwardRef<any, GridWrapperPropTypes>(
  (
    {
      finalMetaData,
      data,
      setData,
      actions,
      setAction,
      loading,
      gridProps,
      refetchData,
      defaultSortOrder = [],
      defaultGroupBy = [],
      defaultFilter = [],
      hideHeader = false,
      hideFooter = false,
      autoRefreshInterval = 0,
      onClickActionEvent = () => {},
      controlsAtBottom = false,
      headerToolbarStyle = {},
      onlySingleSelectionAllow = false,
      isNewRowStyle = false,
      defaultSelectedRowId = null,
      ReportExportButton,
      hideActionBar = false,
    },
    ref
  ) => {
    const { pause, resume } = useAutoRefreshControls();
    const metaDataRef = useRef<any>(null);
    const { t } = useTranslation();
    const authController = useContext(AuthContext);
    if (metaDataRef.current === null) {
      metaDataRef.current = transformMetaData({
        metaData: finalMetaData,
        actions,
        setAction,
        authController,
      });
    }
    let currentPath = useLocation().pathname;

    //console.log(data);
    let dataRef = useRef(data);
    dataRef.current = data;
    let metaData = metaDataRef.current;
    // console.table(metaData);
    /* eslint-disable react-hooks/exhaustive-deps */
    //console.log(metaData);
    const columns = useMemo(() => {
      //console.log("columns", metaData.columns);
      if (Array.isArray(metaData.columns)) {
        return metaData.columns.map((item) => {
          return { ...item, columnName: t(item.columnName) };
        });
      }
      return metaData.columns ?? [];
    }, [t]);
    //console.log(columns);
    const filterMeta = useMemo(() => metaData.filters, []);
    const mydefaultFilter = useMemo(() => defaultFilter, []);
    const columnsValidator = useMemo(() => {
      return columns.reduce((accum, one) => {
        accum[one.accessor] = one.validation;
        return accum;
      }, {});
    }, [columns]);
    //console.log(columnsValidator);
    const columnsObj = useMemo(() => {
      return columns.reduce((accum, one) => {
        accum[one.accessor] = "";
        return accum;
      }, {});
    }, [columns]);
    const defaultColumn = useMemo(
      () => ({
        width: 150,
        maxWidth: 200,
        minWidth: 50,
        Footer: FooterCell,
        Header: DefaultHeaderColumnRenderer,
        ...metaData?.gridConfig?.defaultColumnConfig,
      }),
      [metaData?.gridConfig?.defaultColumnConfig]
    );
    const getRowId = useCallback(
      (row) => row[metaData?.gridConfig?.rowIdColumn],
      [metaData?.gridConfig?.rowIdColumn]
    );
    const myDefaultSortOrder = useMemo(() => defaultSortOrder, []);
    const myDefaultGroupBy = useMemo(() => defaultGroupBy, []);
    //console.log("data", data);
    const updateGridData = useCallback(
      (rowIndex, columnID, value, touched, error, updateFlag = "S") => {
        let displaySeqNumber = 0;
        setData((old) =>
          old.map((row, index) => {
            const isUpdateAllRows = updateFlag === "A";
            const shouldUpdateRow = isUpdateAllRows || index === rowIndex;

            if (!shouldUpdateRow) {
              if (!Boolean(row?._hidden)) {
                displaySeqNumber += 1;
              }
              return { ...row, _displaySequence: displaySeqNumber };
            }

            let isChanged = true;
            let isOldData = "";
            if (
              Boolean(old?.[index]?.["_oldData"]?.[columnID]) &&
              Boolean(value) &&
              old?.[index]?.["_oldData"]?.[columnID] === value
            ) {
              isChanged = false;
            } else {
              isChanged = Boolean(old?.[index]?.["_isTouchedCol"]?.[columnID])
                ? true
                : Boolean(old[index]?.[columnID]) && !Boolean(value)
                ? true
                : Boolean(old[index]?.[columnID]) &&
                  Boolean(value) &&
                  old[index]?.[columnID] != value
                ? true
                : !Boolean(old[index]?.[columnID]) && Boolean(value)
                ? true
                : false;
            }
            if (isChanged) {
              let oldValue = old?.[index]?.["_oldData"]?.[columnID];
              if (typeof oldValue === "undefined" || oldValue === null) {
                isOldData = old?.[index]?.[columnID] ?? "";
              } else {
                isOldData = oldValue;
              }
            } else {
              isOldData = old?.[index]?.["_oldData"]?.[columnID] ?? "";
            }
            let returnData = {
              ...old[index],
              [columnID]: value,
              _touched: {
                ...old?.[index]?.["_touched"],
                [columnID]: touched,
              },
              _error: {
                ...old?.[index]?.["_error"],
                [columnID]: error,
              },
              _isTouchedCol: {
                ...old?.[index]?.["_isTouchedCol"],
                [columnID]: isChanged,
              },
              _oldData: {
                ...old?.[index]?.["_oldData"],
              },
            };
            if (isChanged) {
              returnData = {
                ...returnData,
                _oldData: { ...returnData._oldData, [columnID]: isOldData },
              };
            }
            if (!(columnID === "_hidden")) {
              displaySeqNumber = displaySeqNumber + 1;
            }
            return { ...returnData, _displaySequence: displaySeqNumber };
          })
        );
      },
      [setData]
    );
    const stripValidationFromData = useCallback(() => {
      if (Array.isArray(dataRef.current)) {
        return dataRef.current.map((one) => {
          const { _touched, _error, _rowColor, ...others } = one;
          return others;
        });
      }
      return [];
    }, []);
    const validator = useCallback(async (data, ignoreTouch) => {
      let isError = false;
      let keys = Object.keys(columnsValidator);
      if (!Array.isArray(data)) {
        return { isValid: isError, data: [] };
      }
      let validatedData = data.map(async (one, index) => {
        let hiddenFlag = metaData?.gridConfig?.hiddenFlag;
        if (Boolean(one?.[hiddenFlag])) {
          return one;
        }
        const touched = one["_touched"] ?? {};
        const error = one["_error"] ?? {};
        for (let i = 0; i < keys.length; i++) {
          const columnTouched = touched[keys[i]];
          const columnError = error[keys[i]];
          const columnValue = one[keys[i]];
          const columnValidator = columnsValidator[keys[i]];

          if (Boolean(columnTouched) && ignoreTouch === false) {
            if (Boolean(columnError)) {
              isError = true;
            } else {
              continue;
            }
          } else {
            if (typeof columnValidator === "function") {
              let validationResult = await columnValidator(
                columnValue,
                one,
                data
                  .slice(0, index)
                  .filter((one) => Boolean(one[hiddenFlag]) !== true),
                data
                  .slice(index + 1)
                  .filter((one) => Boolean(one[hiddenFlag]) !== true)
              );
              if (Boolean(validationResult)) {
                isError = true;
              }
              touched[keys[i]] = true;
              error[keys[i]] = validationResult;
              // console.log(
              //   keys[i],
              //   Boolean(columnTouched),
              //   ignoreTouch,
              //   validationResult
              // );
            }
          }
        }
        return { ...one, _touched: touched, _error: error };
      });
      let result = await Promise.all(validatedData);
      return { hasError: isError, data: result };
    }, []);
    const validateData = useCallback(async (ignoreTouch) => {
      return validator(dataRef.current, ignoreTouch);
    }, []);
    const onButtonActionHandel = useCallback(
      (index, id) => {
        onClickActionEvent(index, id, data[index]);
      },
      [data]
    );
    useImperativeHandle(ref, () => ({
      validate: (ignoreTouch = false) => validateData(ignoreTouch),
      validator: () => validator,
      cleanData: () => stripValidationFromData(),
      columns: columnsObj,
      pause: pause,
      resume: resume,
      refetch: refetchData,
      updateGridData: updateGridData,
    }));
    if (!Array.isArray(data)) {
      //console.log(Array.isArray(data), data);
      return <div>Invalid data received</div>;
    }
    return (
      <DataGrid
        // label={t(metaData.gridConfig?.gridLabel ?? "NO_NAME")}
        label={
          metaData.gridConfig?.gridLabel
            ? t(metaData.gridConfig.gridLabel)
            : t(
                utilFunction.getDynamicLabel(
                  currentPath,
                  authController?.authState?.menulistdata,
                  true
                )
              )
        }
        dense={true}
        getRowId={getRowId}
        columns={columns}
        defaultColumn={defaultColumn}
        data={data}
        loading={loading}
        allowColumnReordering={metaData.gridConfig?.allowColumnReordering}
        disableSorting={metaData?.gridConfig?.disableSorting}
        defaultHiddenColumns={metaData.hiddenColumns}
        defaultSortOrder={myDefaultSortOrder}
        defaultGroupBy={myDefaultGroupBy}
        multipleActions={metaData?.multipleActions}
        singleActions={metaData?.singleActions}
        doubleClickAction={metaData?.doubleClickAction}
        alwaysAvailableAction={metaData?.alwaysAvailableAction}
        setGridAction={metaData?.setAction}
        updateGridData={updateGridData}
        hideFooter={metaData?.gridConfig?.hideFooter ?? hideFooter}
        hideHeader={metaData?.gridConfig?.hideHeader ?? hideHeader}
        containerHeight={metaData?.gridConfig?.containerHeight}
        allowRowSelection={metaData?.gridConfig?.allowRowSelection ?? true}
        disableGlobalFilter={metaData?.gridConfig?.disableGlobalFilter}
        disableGroupBy={metaData?.gridConfig?.disableGroupBy}
        disableLoader={metaData?.gridConfig?.disableLoader}
        pageSizes={metaData?.gridConfig?.pageSizes ?? [5, 10]}
        defaultPageSize={metaData?.gridConfig?.defaultPageSize ?? 10}
        enablePagination={metaData?.gridConfig?.enablePagination ?? false}
        hideNoDataFound={metaData?.gridConfig?.hideNoDataFound ?? false}
        hiddenFlag={metaData?.gridConfig?.hiddenFlag}
        gridProps={gridProps}
        refetchData={refetchData}
        autoRefreshInterval={autoRefreshInterval}
        allowFilter={metaData.gridConfig?.allowFilter ?? false}
        filterMeta={filterMeta}
        allowColumnHiding={metaData.gridConfig?.allowColumnHiding ?? false}
        defaultFilter={mydefaultFilter}
        isCusrsorFocused={metaData.gridConfig?.isCusrsorFocused ?? false}
        onButtonActionHandel={onButtonActionHandel}
        controlsAtBottom={controlsAtBottom}
        headerToolbarStyle={headerToolbarStyle}
        onlySingleSelectionAllow={onlySingleSelectionAllow}
        isNewRowStyle={isNewRowStyle}
        defaultSelectedRowId={defaultSelectedRowId}
        searchPlaceholder={metaData.gridConfig?.searchPlaceholder ?? "records"}
        paginationText={metaData.gridConfig?.paginationText ?? "records"}
        ReportExportButton={ReportExportButton}
        footerNote={metaData.gridConfig?.footerNote ?? false}
        finalMetaData={finalMetaData.columns}
        subGridLabel={t(metaData.gridConfig?.subGridLabel ?? "")}
        hideActionBar={hideActionBar}
      />
    );
  }
);

GridWrapper.displayName = "GridWrapper";

const transformMetaData = ({
  metaData: freshMetaData,
  actions,
  setAction,
  authController,
}): GridMetaDataType => {
  let metaData = cloneDeep(freshMetaData) as GridMetaDataType;
  //let metaData = JSON.parse(JSON.stringify(freshMetaData)) as GridMetaDataType;
  let newMetaData = attachMethodsToMetaData(metaData as GridMetaDataType);
  let columns = newMetaData.columns as any;
  const hiddenColumns = extractHiddenColumns(columns);
  //make sure extract functions are called before attach and lastly sort
  columns = attachYupSchemaValidator(columns);
  columns = attachCellComponentsToMetaData(columns);
  columns = attachAlignmentProps(columns);
  // for language transletion code
  // columns = columns.map((item) => {
  //   return { ...item, columnName: lanTranstlet(item.columnName) };
  // });
  //call this function after attaching yup schema and methods to metaData
  columns = attachcombinedValidationFns(columns, authController.authState);
  columns = sortColumnsBySequence(columns);
  let filters = metaData.filters as any;
  //make sure extract functions are called before attach and lastly sort
  try {
    filters = attachFilterComponentToMetaData(filters);
  } catch (e) {
    console.log(e);
  }
  //console.log(filters);
  const splittedActions = SplitActions(actions ?? null);
  return {
    hiddenColumns: hiddenColumns,
    columns: columns,
    gridConfig: metaData.gridConfig,
    setAction: setAction,
    filters: filters,
    ...splittedActions,
  };
};
