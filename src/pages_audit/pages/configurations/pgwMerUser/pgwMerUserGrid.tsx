import {
  useRef,
  useCallback,
  useEffect,
  useContext,
  Fragment,
  useState,
} from "react";
import { PGWGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes } from "components/dataTable";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { ClearCacheContext, queryClient } from "cache";
import { useQuery } from "react-query";
import * as API from "./api";
import { PgwMerUserEntryWrapper } from "./pgwMerUserEntry/pgwMerUser";

const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "add",
    actionLabel: "Add",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];

export const PgwMerUser = () => {
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const [rowData, setRowData] = useState({});
  const navigate = useNavigate();
  const setCurrentAction = useCallback(
    (data) => {
      setRowData(data?.rows);
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getPGWGridData", "ALL"], () => API.getPGWGridData("ALL"));

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getPGWGridData", "ALL"]);
    };
  }, [getEntries]);

  const ClosedEventCall = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current) {
      isDataChangedRef.current = false;
      refetch();
    }
  }, [navigate]);

  // PGWGridMetaData.gridConfig.gridLabel = "PGW Configuration";

  return (
    <Fragment>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Something went to wrong.."}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
      <GridWrapper
        key={`PGWGrid`}
        finalMetaData={PGWGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        ref={myGridRef}
      />

      <Routes>
        <Route
          path="view-detail/*"
          element={
            <PgwMerUserEntryWrapper
              isDataChangedRef={isDataChangedRef}
              defaultmode={"view"}
              handleDialogClose={ClosedEventCall}
            />
          }
        />
        <Route
          path="add/*"
          element={
            <PgwMerUserEntryWrapper
              isDataChangedRef={isDataChangedRef}
              defaultmode={"add"}
              handleDialogClose={ClosedEventCall}
            />
          }
        />
      </Routes>
    </Fragment>
  );
};
