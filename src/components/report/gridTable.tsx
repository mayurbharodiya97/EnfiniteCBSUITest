import { Fragment, useState, useCallback, FC } from "react";
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useFilters,
  useGroupBy,
  useSortBy,
  useExpanded,
  useGlobalFilter,
} from "react-table";
import GetAppIcon from "@mui/icons-material/GetApp";
import CloseIcon from "@mui/icons-material/Close";
import { FixedSizeList } from "react-window";
import { createNewWorkbook } from "./export";
import { useSequenceColumn } from "./components/useSequence";
import { GlobalFilter } from "./filter/globalFilter";
import { FilterComponent, TableFilterStatusBar } from "./filterComponent";
import { AmountSelect } from "./amountContext";
import {
  Button,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

interface GridTableType {
  columns: any;
  defaultColumn: any;
  data: any;
  maxHeight: number;
  initialState?: any;
  filterTypes?: any;
  title?: any;
  options?: any;
  loading: boolean;
  hideFooter?: boolean;
  showSerialNoColumn?: boolean;
  onClose?: any;
  setQueryFilters?: any;
  filterMeta?: any;
  queryFilters?: any;
  hideAmountIn?: boolean;
  retrievalType?: string;
  isOpenRetrievalDefault?: boolean;
}

const defaultMaxHeight = 300;

const RenderFilters = ({ headerGroup }) => {
  return (
    <TableHead component="div">
      <TableRow {...headerGroup.getHeaderGroupProps()} component="div">
        {headerGroup.headers.map((column) => {
          return (
            <TableCell {...column.getHeaderProps()} component="div">
              {column.canFilter ? column.render("Filter") : ""}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

const RenderFooter = ({ footerGroup }) => {
  return (
    <TableRow {...footerGroup.getFooterGroupProps()} component="div">
      {footerGroup.headers.map((column) => {
        return (
          <TableCell
            {...column.getFooterProps([
              {
                style: {
                  textAlign: column?.alignment ?? "unset",
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  padding: "0px 10px",
                  lineHeight: "34px",
                  //color: myColor,
                },
              },
            ])}
            component="div"
          >
            {column.render("Footer")}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export const GridTable: FC<GridTableType> = ({
  columns,
  defaultColumn,
  data,
  maxHeight = defaultMaxHeight,
  initialState = {},
  filterTypes,
  title,
  options,
  loading = false,
  hideFooter = false,
  showSerialNoColumn = false,
  onClose = null,
  setQueryFilters,
  filterMeta,
  queryFilters,
  hideAmountIn,
  retrievalType,
  isOpenRetrievalDefault,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const handleFilterChange = useCallback(() => {
    setShowFilters((old) => !old);
  }, [setShowFilters]);
  const tableProps = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState,
      ...options,
    },
    useGlobalFilter,
    useFilters,
    useGroupBy,
    useSortBy,
    useExpanded,
    useResizeColumns,
    useBlockLayout,
    useSequenceColumn(showSerialNoColumn)
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
    totalColumnsWidth,
    toggleAllRowsExpanded,
    isAllRowsExpanded,
    setAllFilters,
    setGlobalFilter,
    preGlobalFilteredRows,
    state: { filters, globalFilter },
  } = tableProps;

  const RenderRows = useCallback(
    (props) => {
      let { index, style } = props;
      const row = rows[index];
      prepareRow(row);
      if (row?.isGrouped && row?.isExpanded) {
        style = {
          ...style,
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        };
      }
      return (
        <TableRow {...row.getRowProps({ style })} component="div">
          {row.cells.map((cell, index) => {
            return cell.isAggregated
              ? cell.render("Aggregated")
              : cell.render("Cell", { index: index });
          })}
        </TableRow>
      );
    },
    [prepareRow, rows]
  );

  return (
    <Fragment>
      <Paper
        style={{
          width: "100%",
          overflow: "hidden",
          marginBottom: "8px",
        }}
      >
        <Toolbar
          variant="dense"
          style={{
            background: "var(--theme-color5)",
          }}
        >
          <Typography variant="h5" color="primary">
            {title}
          </Typography>
          <div style={{ flexGrow: 1 }} />
          <FilterComponent
            setQueryFilters={setQueryFilters}
            filterMeta={filterMeta}
            filterData={queryFilters}
            retrievalType={retrievalType}
            isOpenRetrievalDefault={isOpenRetrievalDefault}
          />
          {showFilters && filters.length > 0 && (
            <Button
              onClick={() => setAllFilters([])}
              style={{ marginRight: "8px" }}
            >
              Clear Filter
            </Button>
          )}
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            setGlobalFilter={setGlobalFilter}
            globalFilter={globalFilter}
          />
          {!Boolean(hideAmountIn) ? <AmountSelect /> : null}

          <FormControlLabel
            control={
              <Switch
                checked={showFilters}
                onChange={handleFilterChange}
                name="filters"
                size="small"
                color="primary"
              />
            }
            style={{ color: "var(--theme-color2)" }}
            label="show Filters"
          />
          <FormControlLabel
            control={
              <Switch
                onChange={() => toggleAllRowsExpanded(!isAllRowsExpanded)}
                checked={isAllRowsExpanded}
                name="filters"
                size="small"
              />
            }
            style={{ color: "var(--theme-color2)" }}
            label="Expand Rows"
          />
          <FormControlLabel
            control={
              <Tooltip title="Download">
                <IconButton
                  onClick={() =>
                    createNewWorkbook({
                      data: data,
                      title: title,
                      columns: columns,
                    })
                  }
                  size="small"
                  color="primary"
                >
                  <GetAppIcon />
                </IconButton>
              </Tooltip>
            }
            style={{ color: "var(--theme-color2)" }}
            label=""
          />
          {typeof onClose === "function" ? (
            <Tooltip title="Close">
              <IconButton
                onClick={onClose}
                size="small"
                style={{ color: "var(--theme-color2)" }}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          ) : null}
        </Toolbar>

        <TableFilterStatusBar
          dense={true}
          setAllFilters={setQueryFilters}
          filters={queryFilters}
        />
      </Paper>
      {loading && <LinearProgress color="secondary" />}
      <Paper
        style={{
          width: "100%",
          overflow: "hidden",
        }}
        tabIndex={0}
      >
        <TableContainer>
          <Table {...getTableProps()} size="small" component="div">
            <TableHead component="div">
              {headerGroups.map((headerGroup) => (
                <TableRow
                  {...headerGroup.getHeaderGroupProps()}
                  component="div"
                >
                  {headerGroup.headers.map((column) => {
                    return (
                      <TableCell
                        {...column.getHeaderProps([
                          {
                            style: {
                              display: "flex",
                              padding: "0px 10px",
                            },
                          },
                        ])}
                        component="div"
                        align={column.alignment}
                      >
                        {column.render("Header")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>
            {showFilters ? (
              <RenderFilters
                headerGroup={headerGroups[headerGroups.length - 1]}
              />
            ) : null}
            <TableBody {...getTableBodyProps({})} component="div">
              <FixedSizeList
                height={maxHeight}
                itemCount={rows.length}
                itemSize={35}
                width={totalColumnsWidth + 10}
                overscanCount={10}
              >
                {RenderRows}
              </FixedSizeList>
            </TableBody>
            {hideFooter ? null : (
              <TableHead
                component="div"
                style={{
                  boxShadow:
                    "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
                  // background: "var(--theme-color3)",
                  color: "var(--theme-color2)",
                }}
              >
                <RenderFooter footerGroup={footerGroups[0]} />
              </TableHead>
            )}
          </Table>
        </TableContainer>
      </Paper>
    </Fragment>
  );
};
