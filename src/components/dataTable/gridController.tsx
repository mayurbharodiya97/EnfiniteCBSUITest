import {
  useState,
  useMemo,
  useCallback,
  useRef,
  useContext,
  forwardRef,
} from "react";
import { useSnackbar } from "notistack";
import { GridMetaDataType } from "./types";
import { formatSortBy, formatFilterBy } from "./utils";
import { GridContext } from "./context";
import { DefaultHeaderColumnRenderer } from "./components";
import { DataGrid } from "./grid";

interface GridControllerType {
  metaData: GridMetaDataType;
}

export const GirdController = forwardRef<GridControllerType, any>(
  (
    {
      metaData,
      defaultFilter,
      defaultSortOrder,
      dataTransformer,
      autoRefreshInterval,
    },
    ref
  ) => {
    const context = useContext(GridContext);
    const { enqueueSnackbar } = useSnackbar();
    /* eslint-disable react-hooks/exhaustive-deps */
    //console.log(metaData);
    const columns = useMemo(() => metaData.columns, []);
    const filterMeta = useMemo(() => metaData.filters, []);
    const defaultColumn = useMemo(
      () => ({
        width: 150,
        maxWidth: 400,
        minWidth: 50,
        Header: DefaultHeaderColumnRenderer,
      }),
      []
    );
    const myDefaultFilter = useMemo(() => defaultFilter, []);
    const myDefaultSortOrder = useMemo(() => defaultSortOrder, []);
    const getRowId = useCallback(
      (row) => row[metaData?.gridConfig?.rowIdColumn],
      [metaData?.gridConfig?.rowIdColumn]
    );

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const fetchIdCounterRef = useRef(0);

    const fetchData = useCallback(
      ({ pageSize, pageIndex, sortBy, filters }) => {
        setLoading(true);
        const currentFetchId = ++fetchIdCounterRef.current;
        const startRow = Number(pageSize) * Number(pageIndex) + 1;
        const endRow = Number(startRow) + Number(pageSize) - 1;
        let childFilter = formatFilterBy(filters);
        context
          ?.getGridData(startRow, endRow, formatSortBy(sortBy), childFilter)
          .then((result) => {
            if (currentFetchId === fetchIdCounterRef.current) {
              //console.log("getGridData=>", result);
              if (result.status === "success") {
                setData(dataTransformer(result?.data?.rows ?? []));
                setPageCount(
                  Math.ceil(
                    Number(result?.data?.total_count ?? 1) / Number(pageSize)
                  )
                );
                setTotalRecords(Number(result?.data?.total_count ?? 1));
                setLoading(false);
              } else {
                enqueueSnackbar(
                  result?.data?.error_msg ??
                    "Unknown error occured while fetching data",
                  {
                    variant: "error",
                  }
                );
                setLoading(false);
              }
            }
          })
          .catch((e) => {
            setLoading(false);
          });
      },
      [setTotalRecords, setLoading, setData, context]
    );

    return (
      <DataGrid
        //@ts-ignore
        ref={ref}
        label={metaData.gridConfig?.gridLabel ?? "NO_NAME"}
        dense={true}
        multipleActions={metaData?.multipleActions}
        singleActions={metaData?.singleActions}
        doubleClickAction={metaData?.doubleClickAction}
        alwaysAvailableAction={metaData?.alwaysAvailableAction}
        setGridAction={metaData?.setAction}
        filterMeta={filterMeta}
        getRowId={getRowId}
        columns={columns}
        defaultColumn={defaultColumn}
        defaultHiddenColumns={metaData.hiddenColumns}
        defaultFilter={myDefaultFilter}
        defaultSortOrder={myDefaultSortOrder}
        loading={loading}
        data={data}
        setData={setData}
        onFetchData={fetchData}
        pageCount={pageCount}
        totalRecords={totalRecords}
        pageSizes={metaData.gridConfig?.pageSize ?? 10}
        defaultPageSize={metaData.gridConfig?.defaultPageSize ?? [5, 10]}
        allowColumnReordering={
          metaData.gridConfig?.allowColumnReordering ?? false
        }
        allowColumnHiding={metaData.gridConfig?.allowColumnHiding ?? false}
        allowKeyboardNavigation={
          metaData.gridConfig?.allowKeyboardNavigation ?? false
        }
        allowFilter={metaData.gridConfig?.allowFilter ?? true}
        filterAlwaysVisible={metaData.gridConfig?.filterAlwaysVisible ?? false}
        allowRowSelection={metaData?.gridConfig?.allowRowSelection ?? true}
        autoRefreshInterval={autoRefreshInterval}
      />
    );
  }
);
