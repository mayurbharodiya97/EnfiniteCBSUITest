import { ClearCacheContext, queryClient } from "cache";
import { Alert } from "components/common/alert";
import { ActionTypes } from "components/dataTable";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { Fragment, useCallback, useContext, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import * as API from "./api";
import { FromSourceConfigGridMetaData } from "./gridMetadata";
import { useNavigate, Routes, Route } from "react-router-dom";
import { FromSourceConfigDetails } from "./crud";

const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "Edit Detail",
    multiple: false,
    rowDoubleClick: true,
  },
  // {
  //   actionName: "delete",
  //   actionLabel: "Delete",
  //   multiple: false,
  //   rowDoubleClick: false,
  // },
  // {
  //   actionName: "add",
  //   actionLabel: "Add",
  //   multiple: undefined,
  //   rowDoubleClick: true,
  //   alwaysAvailable: true,
  // },
];

export const FromSourceConfigGridWrapper = () => {
  const navigate = useNavigate();
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const isDataChangedRef = useRef(false);
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getFromSourceConfigGridData"], () => API.getFromSourceConfigGridData());
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      queryClient.removeQueries(["getFromSourceConfigGridData"]);
    };
  }, [getEntries]);
  const setCurrentAction = useCallback(
    (data) => {
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
  );
  const handleDialogClose = () => {
    if (isDataChangedRef.current === true) {
      isDataChangedRef.current = true;
      refetch();
      isDataChangedRef.current = false;
    }
    navigate(".");
  };
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
        key={`fromSourceConfigGrid`}
        finalMetaData={FromSourceConfigGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        ref={myGridRef}
      />
      <Routes>
        {/* <Route
          path="add"
          element={
            <OperatorMasterDetails
              isDataChangedRef={isDataChangedRef}
              ClosedEventCall={handleDialogClose}
              defaultmode={"new"}
            />
          }
        /> */}
        <Route
          path="view-details"
          element={
            <FromSourceConfigDetails
              isDataChangedRef={isDataChangedRef}
              ClosedEventCall={handleDialogClose}
              defaultmode={"view"}
            />
          }
        />
        {/* <Route
          path="delete"
          element={
            <DeleteOperatorMaster
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              isOpen={true}
            />
          }
        /> */}
      </Routes>
    </Fragment>
  );
};
