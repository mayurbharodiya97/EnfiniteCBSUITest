import { FC, useMemo, Fragment, useState, useCallback } from "react";
import { HeaderColumnCell } from "./components/headerCell";
import { DefaultCell } from "./components/defaultCell";
import { FooterCell } from "./components/footerCell";
import { DefaultColumnFilter } from "./filter/defaultColumnFilter";
import { GridTable } from "./gridTable";
import {
  fuzzyTextFilterFn,
  customText,
  filterGreaterThan,
  customInclude,
} from "./filters";
import { useQuery } from "react-query";
import { Alert } from "components/common/alert";
import { attachFilterComponentToMetaData, formatFilterBy } from "./utils";
import { AmountProvider } from "./amountContext";

export const ReportGrid: FC<any> = ({
  metaData,
  maxHeight,
  initialState,
  title,
  options,
  hideFooter,
  showSerialNoColumn = false,
  onClose = null,
  reportName,
  dataFetcher = () => {
    return [];
  },
  dataTransformer = (data) => data,
  autoFetch = true,
  hideAmountIn = false,
  reportID,
  retrievalType,
}) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const memoizedColumns = useMemo(() => metaData.columns, []);
  const memoizedFilters = useMemo(
    () => attachFilterComponentToMetaData(metaData.filters),
    []
  );
  const [autoFetcher, setAutoFetcher] = useState(autoFetch);
  const [queryFilters, setQueryFilters] = useState([]);

  const setQueryFilterWrapper = useCallback(
    (args) => {
      console.log(args);
      setQueryFilters(args);
      setAutoFetcher(true);
    },
    [setAutoFetcher, setQueryFilters]
  );

  const defaultColumn = useMemo(
    () => ({
      Header: HeaderColumnCell,
      Cell: DefaultCell,
      Footer: FooterCell,
      Filter: DefaultColumnFilter,
      Aggregated: DefaultCell,
    }),
    []
  );

  const filterTypes = useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      customText: customText,
      filterGreaterThan: filterGreaterThan,
      customInclude: customInclude,
    }),
    []
  );

  const { data, isFetching, isLoading, isError, error } = useQuery<
    any,
    any,
    any
  >(
    [dataFetcher, reportID, queryFilters],
    () => dataFetcher(reportID, queryFilters),
    {
      cacheTime: 0,
      enabled: autoFetcher,
    }
  );

  return (
    <Fragment>
      {isError ? (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Unknown Error occured"}
          errorDetail={error?.error_detail}
        />
      ) : (
        <AmountProvider>
          <GridTable
            columns={memoizedColumns}
            defaultColumn={defaultColumn}
            data={dataTransformer(data) ?? []}
            maxHeight={maxHeight}
            initialState={initialState}
            filterTypes={filterTypes}
            title={title}
            options={options}
            loading={isFetching || isLoading}
            hideFooter={hideFooter}
            showSerialNoColumn={showSerialNoColumn}
            onClose={onClose}
            setQueryFilters={setQueryFilterWrapper}
            filterMeta={metaData.filters}
            queryFilters={queryFilters}
            hideAmountIn={hideAmountIn}
            retrievalType={retrievalType}
          />
        </AmountProvider>
      )}
    </Fragment>
  );
};