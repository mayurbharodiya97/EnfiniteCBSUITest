import { ClearCacheProvider, ClearCacheContext, queryClient } from "cache";
import { useQuery } from "react-query";
import { Fragment, useEffect, useContext, useRef, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Alert } from "components/common/alert";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import { ActionTypes } from "components/dataTable";
import * as API from "./api";
import { ReleaseCardUserGridMetaData } from "./gridMetadata";
import { ReleaseUsersAPIWrapper } from "../releaseUsers";
const actions: ActionTypes[] = [
  {
    actionName: "releaseUsers",
    actionLabel: "Release",
    multiple: true,
    rowDoubleClick: false,
  },
  {
    actionName: "releaseUsersDetails",
    actionLabel: "Details",
    multiple: false,
    rowDoubleClick: false,
    shouldExclude: (data) => {
      return true;
    },
  },
];
export const ReleaseCardUsers = () => {
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const navigate = useNavigate();
  const setCurrentAction = useCallback(
    (data) => {
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
  );
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getReleaseUsersGridData"], () =>
    API.getReleaseUsersGridData({ block_type: "AFTER", type: "AUTH" })
  );
  const handleDialogClose = () => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      //myGridRef.current?.refetch?.();
      refetch();
      isDataChangedRef.current = false;
    }
  };
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
      queryClient.removeQueries(["getReleaseUsersGridData"]);
    };
  }, [getEntries]);
  //result.isError = true;
  //result.error.error_msg = "Something went to wrong..";
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
        key={`releaseUsersGrid`}
        finalMetaData={ReleaseCardUserGridMetaData as GridMetaDataType}
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
          path="releaseUsers"
          element={
            <ReleaseUsersAPIWrapper
              handleDialogClose={handleDialogClose}
              isDataChangedRef={isDataChangedRef}
            />
          }
        />
      </Routes>
    </Fragment>
  );
};

export const ReleaseCardUsersGridWrapper = () => {
  return (
    <ClearCacheProvider>
      <ReleaseCardUsers />
    </ClearCacheProvider>
  );
};
