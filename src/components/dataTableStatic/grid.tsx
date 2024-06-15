import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  useTable,
  useSortBy,
  useResizeColumns,
  useBlockLayout,
  useRowSelect,
  useColumnOrder,
  useGlobalFilter,
  useGroupBy,
  useExpanded,
  usePagination,
} from "react-table";
import { TableHeaderToolbar } from "./tableHeaderToolbar";
import { StickyTableHead } from "components/dataTable/stickyTableHead";
import { MyTableRow } from "components/dataTable/focusableTableRow";
import { HeaderCellWrapper } from "components/dataTable/headerCellWrapper";
import {
  TableActionToolbar,
  ActionContextMenu,
  RenderActions,
} from "components/dataTable/tableActionToolbar";
import { TablePaginationActions } from "components/dataTable/tablePaginationToolbar";
import { useCheckboxColumn } from "./components/useCheckbox";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import { CustomBackdrop } from "components/dataTable/backdrop";
import {
  filterAction,
  DataFilterComponents,
  filterActionWhenNoDataFound,
} from "components/dataTable/utils";
import { TableFilterStatusBar } from "components/dataTable/tableFilterStatusBar";
import { AuthContext } from "pages_audit/auth";
import { useStyles } from "./style";
import {
  Dialog,
  Grid,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import ReportExportScreen from "pages_audit/pages/reports/ReportExportScreen";
let data2: any[] = [];

export const DataGrid = ({
  label,
  dense,
  columns,
  data,
  loading,
  getRowId,
  defaultColumn,
  allowColumnReordering,
  disableSorting,
  defaultHiddenColumns,
  defaultSortOrder,
  defaultGroupBy,
  multipleActions,
  singleActions,
  doubleClickAction,
  alwaysAvailableAction,
  setGridAction,
  updateGridData,
  hideFooter,
  hideHeader,
  disableGlobalFilter,
  disableGroupBy,
  disableLoader,
  containerHeight,
  gridProps,
  pageSizes,
  defaultPageSize,
  enablePagination,
  allowRowSelection,
  hideNoDataFound,
  refetchData,
  hiddenFlag,
  autoRefreshInterval,
  allowFilter,
  filterMeta,
  allowColumnHiding,
  defaultFilter,
  isCusrsorFocused,
  onButtonActionHandel,
  controlsAtBottom,
  headerToolbarStyle,
  onlySingleSelectionAllow,
  isNewRowStyle,
  defaultSelectedRowId,
  searchPlaceholder,
  paginationText,
  ReportExportButton,
  footerNote,
  finalMetaData,
}) => {
  //@ts-ignore
  const [filters, setAllFilters] = useState(defaultFilter);

  data2 = useMemo(() => DataFilterComponents(filters, data), [filters, data]);
  const classes = useStyles();
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    selectedFlatRows,
    rows,
    page,
    gotoPage,
    setPageSize,
    state,
    setGlobalFilter,
    preGlobalFilteredRows,
    state: { pageIndex, pageSize },
    setSortBy,
    columns: availableColumns,
    toggleAllRowsSelected,
  } = useTable(
    {
      initialState: {
        pageIndex: 0,
        pageSize: defaultPageSize,
        hiddenColumns: defaultHiddenColumns,
        sortBy: defaultSortOrder,
        groupBy: defaultGroupBy,
      },
      columns,
      defaultColumn,
      data: data2,
      getRowId,
      allowColumnReordering: allowColumnReordering,
      autoResetSortBy: false,
      autoResetGlobalFilter: false,
      disableSortBy: Boolean(disableSorting),
      disableGlobalFilter: Boolean(disableGlobalFilter),
      disableGroupBy: Boolean(disableGroupBy),
      updateGridData,
      gridProps,
      singleActions,
      setGridAction,
      hiddenFlag,
      loading,
      onButtonActionHandel,
    },
    useGlobalFilter,
    useColumnOrder,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    useResizeColumns,
    useBlockLayout,

    useCheckboxColumn(allowRowSelection)
  );

  const { authState } = useContext(AuthContext);

  const tbodyRef = useRef(null);
  const preDataRef = useRef(null);
  const submitButtonRef = useRef<any>(null);
  const [isOpenExport, setOpenExport] = useState(false);
  const tableRowRef = useRef<any>(null);
  const rowsToDisplay = enablePagination ? page : rows;

  const rowCount = useMemo(() => {
    return rows.reduce((cnt, item) => {
      if (!(item?.original?._hidden ?? false)) {
        ++cnt;
      }
      return cnt;
    }, 0);
  }, [rows]);

  //alert(selectedFlatRows.length);
  singleActions = filterActionWhenNoDataFound(singleActions, rowCount);
  multipleActions = filterActionWhenNoDataFound(multipleActions, rowCount);

  singleActions = filterAction(singleActions, selectedFlatRows, authState);
  multipleActions = filterAction(multipleActions, selectedFlatRows, authState);

  const [contextMenuPosition, setContextMenuPosition] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [contextMenuRow, setContextMenuRow] = useState<null | any>(null);
  const [contextMenuSelectedRowId, setContextMenuSelectedRowId] = useState<
    string | null
  >(defaultSelectedRowId);
  const handleContextMenuClose = () => {
    setContextMenuRow(null);
    setContextMenuPosition(null);
    setContextMenuSelectedRowId(null);
  };
  const handleContextMenuOpenforAdd = (event) => {
    if (
      rowCount <= 0 &&
      (singleActions.length > 0 || multipleActions.length > 0)
    ) {
      event.preventDefault();
      setContextMenuRow({});
      setContextMenuSelectedRowId("");
      setContextMenuPosition(
        contextMenuPosition === null
          ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
          : null
      );
    }

    //alert("Test handleContextMenuOpenforAdd");
  };
  const handleContextMenuOpen = (row) => (e) => {
    e.preventDefault();
    setContextMenuRow(row);
    setContextMenuSelectedRowId(row?.id);
    setContextMenuPosition(
      contextMenuPosition === null
        ? { mouseX: e.clientX - 2, mouseY: e.clientY - 4 }
        : null
    );
  };
  const handleContextUpDownKey = (rowsToDisplay, _rowindex) => (e) => {
    if (e?.target?.tagName === "INPUT") {
      return;
    }
    if (e.key !== "Enter" && e.key !== "Tab") {
      e.preventDefault();
    }

    if (e.key === "ArrowUp" && _rowindex > 0) {
      if (rowsToDisplay[_rowindex - 1]?.id) {
        toggleAllRowsSelected(false);
        rowsToDisplay[_rowindex - 1].toggleRowSelected(true);
        setContextMenuSelectedRowId(rowsToDisplay[_rowindex - 1]?.id);
        e?.target?.previousElementSibling?.focus?.();
      }
    } else if (e.key === "ArrowDown" && _rowindex < rowsToDisplay.length - 1) {
      if (rowsToDisplay[_rowindex + 1]?.id) {
        toggleAllRowsSelected(false);
        rowsToDisplay[_rowindex + 1].toggleRowSelected(true);
        setContextMenuSelectedRowId(rowsToDisplay[_rowindex + 1].id);
        e?.target?.nextElementSibling?.focus?.();
      }
    }
  };
  const handleRowDoubleClickAction = (row) => (e) => {
    e.preventDefault();
    let result = filterAction(doubleClickAction, [row], authState, true);
    if (result === undefined) {
      return;
    }
    setGridAction({
      name: doubleClickAction.actionName,
      rows: [
        {
          data: row?.original,
          id: row?.id,
        },
      ],
    });
  };
  const handleChangePage = (_, newPage) => {
    gotoPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value));
  };
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        if (submitButtonRef.current) {
          submitButtonRef?.current?.click?.();
        }
      }
    };
    window.document.addEventListener("keypress", handleKeyPress);
    return () => {
      window.document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      tableRowRef.current?.focus?.();
    }, 200);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [loading]);

  useEffect(() => {
    if (
      selectedFlatRows.length > 0 &&
      onlySingleSelectionAllow &&
      JSON.stringify(selectedFlatRows[0]?.original) !==
        JSON.stringify(preDataRef.current)
    ) {
      preDataRef.current = selectedFlatRows[0]?.original;
      setGridAction({
        name: "_rowChanged",
        rows: [{ data: selectedFlatRows[0]?.original }],
      });
    }
  }, [selectedFlatRows[0]?.original]);

  return (
    <>
      <Paper
        style={{
          width: "100%",
          boxShadow: "none",
        }}
      >
        {Boolean(hideHeader) ? null : (
          <TableHeaderToolbar
            label={label}
            dense={dense}
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
            alwaysAvailableAction={alwaysAvailableAction}
            setGridAction={setGridAction} //for always Actions
            selectedFlatRows={selectedFlatRows}
            disableGlobalFilter={Boolean(disableGlobalFilter)}
            refetchData={refetchData}
            autoRefreshInterval={autoRefreshInterval}
            gotoPage={gotoPage}
            setSortBy={setSortBy}
            allowFilter={allowFilter}
            filters={filters}
            setAllFilters={setAllFilters}
            filterMeta={filterMeta}
            visibleColumns={availableColumns}
            defaultHiddenColumns={defaultHiddenColumns}
            allowColumnHiding={allowColumnHiding}
            headerToolbarStyle={headerToolbarStyle}
            searchPlaceholder={searchPlaceholder}
            ReportExportButton={ReportExportButton}
            setOpenExport={setOpenExport}
          />
        )}
        {Boolean(controlsAtBottom) ? null : (
          <TableActionToolbar
            dense={dense}
            selectedFlatRows={selectedFlatRows}
            multipleActions={multipleActions}
            singleActions={singleActions}
            setGridAction={setGridAction} //for single/multiple actions
            submitButtonRef={submitButtonRef}
          />
        )}
        <ActionContextMenu
          contextMenuRow={contextMenuRow}
          selectedFlatRows={selectedFlatRows}
          singleActions={singleActions}
          multipleActions={multipleActions}
          setGridAction={setGridAction} //for right click actions
          mouseX={contextMenuPosition?.mouseX ?? null}
          mouseY={contextMenuPosition?.mouseY ?? null}
          handleClose={handleContextMenuClose}
          authState={authState}
        />
        <TableFilterStatusBar
          dense={dense}
          setAllFilters={setAllFilters}
          filters={filters}
          gotoPage={gotoPage}
          setSortBy={setSortBy}
        />
        {!disableLoader ? (
          loading ? (
            <LinearProgress
              sx={{
                background: "var(--theme-color6)",
                "& .MuiLinearProgress-bar": {
                  background: "var(--theme-color1) !important",
                },
              }}
            />
          ) : (
            <LinearProgressBarSpacer />
          )
        ) : null}
        <TableContainer
          style={{
            position: "relative",
            display: "inline-block",
            overflow: "auto",
            maxHeight: containerHeight?.max ?? "calc(100vh - 33*8px)",
            minHeight: containerHeight?.min ?? "calc(100vh - 33*8px)",
            borderBottom: hideFooter
              ? ""
              : "1px solid rgba(133, 130, 130, 0.8)",
          }}
        >
          <Table
            component="div"
            {...getTableProps()}
            size={dense ? "small" : "medium"}
          >
            {/*@ts-ignore*/}
            <StickyTableHead component="div">
              {headerGroups.map((headerGroup) => {
                return (
                  <TableRow
                    component="div"
                    {...headerGroup.getHeaderGroupProps()}
                  >
                    {headerGroup.headers.map((column) => {
                      return (
                        <HeaderCellWrapper
                          column={column}
                          key={column.getHeaderProps().key}
                          SelectAllColumn={column.SelectAllColumn}
                          rows={rowsToDisplay}
                          updateGridData = {updateGridData}
                        >
                          {column.render("Header")}
                        </HeaderCellWrapper>
                      );
                    })}
                  </TableRow>
                );
              })}
            </StickyTableHead>
            <TableBody
              component="div"
              ref={tbodyRef}
              {...getTableBodyProps([
                {
                  style: {
                    display: "block",
                  },
                },
              ])}
              onContextMenu={handleContextMenuOpenforAdd}
            >
              {rowsToDisplay.length <= 0 &&
              //loading === false &&
              hideNoDataFound === false ? (
                <Grid container justifyContent="center">
                  <div
                    style={{
                      height: Boolean(containerHeight?.min)
                        ? "calc(" + containerHeight?.min + " - 50px)"
                        : "calc(100vh - 33*8px)", //"calc(100vh - 36*10px)",
                      display: "flex",
                      alignItems: "center",
                      // marginLeft: "450px",
                      fontStyle: "italic",
                      color: "rgba(133, 130, 130, 0.8)",
                    }}
                  >
                    No data found..!
                  </div>
                </Grid>
              ) : null}
              {rowsToDisplay.map((row, _rowindex) => {
                if (Boolean(row?.original?.[hiddenFlag])) {
                  return null;
                }
                prepareRow(row);
                const rightClickHandler = handleContextMenuOpen(row);
                const thisRowDblClickHandler = handleRowDoubleClickAction(row);
                const thisRowUpDownHandler = handleContextUpDownKey(
                  rowsToDisplay,
                  _rowindex
                );
                let rowColorStyle: any[] = [];
                if (Boolean(row?.original?._rowColor)) {
                  rowColorStyle = [
                    {
                      style: {
                        background: row?.original?._rowColor,
                        width: "100%",
                      },
                    },
                  ];
                }
                if (isCusrsorFocused) {
                  if (rowColorStyle.length > 0) {
                    rowColorStyle[0].style["cursor"] = "pointer";
                  } else {
                    rowColorStyle = [{ style: { cursor: "pointer" } }];
                  }
                }
                return (
                  <MyTableRow
                    {...row.getRowProps(rowColorStyle)}
                    id={row.id}
                    tabIndex={_rowindex}
                    component="div"
                    selected={
                      // row.isSelected || contextMenuSelectedRowId === row.id
                      row.isSelected
                        ? true
                        : contextMenuSelectedRowId === row.id
                        ? row.toggleRowSelected(true)
                        : false
                    }
                    onClick={() => {
                      if (Boolean(onlySingleSelectionAllow)) {
                        toggleAllRowsSelected(false);
                        row.toggleRowSelected(true);
                        setContextMenuSelectedRowId(row.id);
                      }
                    }}
                    onKeyDown={thisRowUpDownHandler}
                    onContextMenu={rightClickHandler}
                    onDoubleClick={
                      Boolean(doubleClickAction)
                        ? thisRowDblClickHandler
                        : undefined
                    }
                    className={isNewRowStyle ? classes.customClass : null}
                    ref={
                      row.isSelected || contextMenuSelectedRowId === row.id
                        ? tableRowRef
                        : null
                    }
                  >
                    {row.cells.map((cell) => {
                      const { key } = cell.getCellProps();
                      return cell.isAggregated
                        ? cell.render("Aggregated", { key })
                        : cell.render("Cell", { key });
                    })}
                  </MyTableRow>
                );
              })}
            </TableBody>
          </Table>
          <CustomBackdrop open={Boolean(loading)} />
        </TableContainer>

        {footerNote && (
          <Typography component="div" fontWeight={500} pl={"24px"}>
            {footerNote}
          </Typography>
        )}
        {hideFooter ? null : enablePagination ? (
          <TablePagination
            style={{ display: "flex" }}
            variant="body"
            component="div"
            rowsPerPageOptions={pageSizes}
            colSpan={3}
            count={rows.length}
            rowsPerPage={Number(pageSize)}
            page={Number(pageIndex)}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        ) : (
          <TableCell style={{ display: "flex" }}>
            Total No. of {paginationText}: {rowCount}
          </TableCell>
        )}

        {Boolean(controlsAtBottom) ? (
          <div
            className="test"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <RenderActions
              key="singleFilters"
              actions={singleActions}
              setAction={setGridAction}
              selectedRows={selectedFlatRows.map((one) => {
                return {
                  data: one.original,
                  id: one.id,
                };
              })}
              buttonTextColor={"var(--theme-color2)"}
              buttonBackground={"var(--theme-color3)"}
              style={{
                border: "1px solid var(--theme-color3)",
                width: "8rem",
                margin: "5px",
              }}
              submitButtonRef={submitButtonRef}
            />
          </div>
        ) : null}
      </Paper>
      {isOpenExport && (
        <Dialog open={isOpenExport}>
          <ReportExportScreen
            // globalFilter={""}
            filters={filters}
            // queryFilters={queryFilters}
            title={label}
            rows={rows}
            columns={finalMetaData}
            onClose={() => {
              setOpenExport(false);
            }}
          />
        </Dialog>
      )}
    </>
  );
};
