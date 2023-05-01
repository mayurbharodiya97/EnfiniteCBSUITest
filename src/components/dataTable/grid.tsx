import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useContext,
} from "react";
import {
  useTable,
  usePagination,
  useSortBy,
  useResizeColumns,
  useBlockLayout,
  useRowSelect,
  useFilters,
  useColumnOrder,
  useAsyncDebounce,
} from "react-table";
import { TableHeaderToolbar } from "./tableHeaderToolbar";
import { StickyTableHead } from "./stickyTableHead";
import { MyTableRow } from "./focusableTableRow";
import { TablePaginationActions } from "./tablePaginationToolbar";
import { TableActionToolbar, ActionContextMenu } from "./tableActionToolbar";
import { LinearProgressBarSpacer } from "./linerProgressBarSpacer";
import { CustomBackdrop } from "./backdrop";
import { useCheckboxColumn } from "./components";
import { HeaderCellWrapper } from "./headerCellWrapper";
import { filterAction } from "./utils";
import { TableFilterStatusBar } from "./tableFilterStatusBar";
import { AuthContext } from "pages_audit/auth";
import { useAutoRefreshControls } from "components/utils/autoRefresh";
import {
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  TableRow,
} from "@mui/material";

export const DataGrid = forwardRef<any, any>(
  (
    {
      label,
      dense,
      columns,
      defaultColumn,
      setData,
      data,
      onFetchData,
      loading,
      getRowId,
      totalRecords: controlledTotalRecords,
      pageCount: controlledPageCount,
      pageSizes,
      defaultPageSize,
      defaultSortOrder,
      defaultFilter,
      defaultHiddenColumns,
      allowColumnReordering,
      allowColumnHiding,
      allowKeyboardNavigation,
      setGridAction,
      multipleActions,
      singleActions,
      doubleClickAction,
      alwaysAvailableAction,
      allowFilter,
      allowRowSelection,
      filterMeta,
      autoRefreshInterval,
    },
    ref
  ) => {
    //@ts-ignore
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page,
      selectedFlatRows,
      gotoPage,
      setPageSize,
      state: tableState,
      //setAllFilters,
      setSortBy,
      columns: availableColumns,
    } = useTable(
      {
        columns,
        defaultColumn,
        data,
        getRowId,
        initialState: {
          pageIndex: 0,
          pageSize: defaultPageSize,
          hiddenColumns: defaultHiddenColumns,
          sortBy: defaultSortOrder,
          //filters: defaultFilter,
        },
        manualPagination: true,
        pageCount: controlledPageCount,
        autoResetPage: false,
        manualSortBy: true,
        autoResetSortBy: false,
        manualFilters: true,
        autoResetFilters: false,
        allowColumnReordering: allowColumnReordering,
        singleActions,
        setGridAction,
      },
      useColumnOrder,
      useFilters,
      useSortBy,
      usePagination,
      useRowSelect,
      useResizeColumns,
      useBlockLayout,
      useCheckboxColumn(allowRowSelection)
    );
    const [filters, setAllFilters] = useState(defaultFilter);
    const { authState } = useContext(AuthContext);

    singleActions = filterAction(singleActions, selectedFlatRows, authState);
    multipleActions = filterAction(
      multipleActions,
      selectedFlatRows,
      authState
    );

    const { pageIndex, pageSize, sortBy /*,filters*/ } = tableState;
    const onFetchDataDebounced = useAsyncDebounce(onFetchData, 500);
    //loading = true;
    const tbodyRef = useRef(null);
    const [contextMenuPosition, setContextMenuPosition] = useState<{
      mouseX: number;
      mouseY: number;
    } | null>(null);
    const [contextMenuRow, setContextMenuRow] = useState<null | any>(null);
    const [contextMenuSelectedRowId, setContextMenuSelectedRowId] = useState<
      string | null
    >(null);
    const handleContextMenuClose = () => {
      setContextMenuRow(null);
      setContextMenuPosition(null);
      setContextMenuSelectedRowId(null);
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

    const handleKeyDown = (event, row) => {
      event.stopPropagation();
      //@ts-ignore
      const currentRow = tbodyRef.current?.children.namedItem(row.id);
      //@ts-ignore
      let rowToFocus;
      switch (event.keyCode) {
        case 38:
          rowToFocus = currentRow?.previousElementSibling;
          if (rowToFocus !== null) {
            rowToFocus?.focus();
            event.preventDefault();
            //@ts-ignore
            if (rowToFocus.offsetTop > tbodyRef.current?.offsetHeight) {
              console.log("need to scroll here");
            }
          }
          break;
        case 40:
          rowToFocus = currentRow?.nextElementSibling;
          if (rowToFocus !== null) {
            rowToFocus?.focus();
            event.preventDefault();
          }
          break;
        case 32:
          row.toggleRowSelected();
          event.preventDefault();
          break;
        default:
          break;
      }
    };

    const { resume, pause } = useAutoRefreshControls();

    useEffect(() => {
      onFetchDataDebounced({ pageIndex, pageSize, sortBy, filters });
    }, [onFetchDataDebounced, pageIndex, pageSize, sortBy, filters]);

    //To allow outer component to refresh grid
    useImperativeHandle(ref, () => ({
      fetchData: () =>
        onFetchDataDebounced({ pageIndex, pageSize, sortBy, filters }),
      setData: setData,
      resume: resume,
      pause: pause,
    }));

    const handleChangePage = (_, newPage) => {
      gotoPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
      setPageSize(Number(event.target.value));
    };
    //console.log("TableHeaderToolbar=>", filterMeta);
    return (
      <Paper
        style={{
          width: "100%",
          background: "var(--white)",
        }}
      >
        <TableHeaderToolbar
          ref={ref}
          label={label}
          dense={dense}
          visibleColumns={availableColumns}
          defaultHiddenColumns={defaultHiddenColumns}
          allowColumnHiding={allowColumnHiding}
          alwaysAvailableAction={alwaysAvailableAction}
          setGridAction={setGridAction}
          selectedFlatRows={selectedFlatRows}
          allowFilter={allowFilter}
          setAllFilters={setAllFilters}
          gotoPage={gotoPage}
          setSortBy={setSortBy}
          filters={filters}
          filterMeta={filterMeta}
          autoRefreshInterval={autoRefreshInterval}
        />
        <TableActionToolbar
          dense={dense}
          selectedFlatRows={selectedFlatRows}
          multipleActions={multipleActions}
          singleActions={singleActions}
          setGridAction={setGridAction}
        />
        <ActionContextMenu
          selectedFlatRows={selectedFlatRows}
          contextMenuRow={contextMenuRow}
          multipleActions={multipleActions}
          singleActions={singleActions}
          setGridAction={setGridAction}
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
        {loading ? (
          <LinearProgress color="secondary" style={{ marginTop: "1px" }} />
        ) : (
          <LinearProgressBarSpacer />
        )}
        <TableContainer
          style={{
            position: "relative",
            display: "inline-block",
            overflow: "auto",
            maxHeight: "calc(100vh - 33*8px)",
            minHeight: "calc(100vh - 33*8px)",
            borderBottom: "1px solid rgba(133, 130, 130, 0.8)",
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
            >
              {page.length <= 0 && loading === false ? (
                <div
                  style={{
                    height: "calc(100vh - 36*10px)",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "450px",
                    fontStyle: "italic",
                    color: "rgba(133, 130, 130, 0.8)",
                  }}
                >
                  No data found..!
                </div>
              ) : null}
              {page.map((row, index) => {
                prepareRow(row);
                const rightClickHandler = handleContextMenuOpen(row);
                const thisRowDblClickHandler = handleRowDoubleClickAction(row);
                return (
                  <MyTableRow
                    {...row.getRowProps()}
                    id={row.id}
                    tabIndex={0}
                    component="div"
                    selected={
                      row.isSelected || contextMenuSelectedRowId === row.id
                    }
                    onKeyDown={
                      allowKeyboardNavigation
                        ? (e) => handleKeyDown(e, row)
                        : undefined
                    }
                    onContextMenu={rightClickHandler}
                    onDoubleClick={
                      Boolean(doubleClickAction)
                        ? thisRowDblClickHandler
                        : undefined
                    }
                  >
                    {row.cells.map((cell) => {
                      const { key } = cell.getCellProps();
                      return cell.render("Cell", { key });
                    })}
                  </MyTableRow>
                );
              })}
            </TableBody>
          </Table>
          <CustomBackdrop open={loading} />
        </TableContainer>
        <TablePagination
          style={{ display: "flex" }}
          variant="body"
          component="div"
          rowsPerPageOptions={pageSizes}
          colSpan={3}
          count={controlledTotalRecords}
          rowsPerPage={Number(pageSize)}
          page={Number(pageIndex)}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </Paper>
    );
  }
);
