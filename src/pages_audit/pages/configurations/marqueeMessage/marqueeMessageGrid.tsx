import { GridMetaDataType } from "components/dataTable/types";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { Fragment, useCallback, useContext, useEffect, useRef } from "react";
import { ClearCacheContext, queryClient } from "cache";
import * as API from "./api";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ActionTypes } from "components/dataTable";
// import { Alert } from "reactstrap";
import { MarqueMessageGridMetaData } from "./gridMetadata";
import { AuthContext } from "pages_audit/auth";
import { useQuery } from "react-query";
import { MarqueeViewDetails } from "./viewDetails/marqueeViewDetails";
import { Alert } from "components/common/alert";
import { DeleteMarqueeMessageWrapper } from "./viewDetails/deleteMarqueeMessage";

const actions: ActionTypes[] = [
  {
    actionName: "add",
    actionLabel: "Add",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },

  {
    actionName: "view-details",
    actionLabel: "View Details",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "delete",
    actionLabel: "Delete",
    multiple: false,
    rowDoubleClick: false,
  },
];

export const MarqueMessageGrid = () => {
  const { getEntries } = useContext(ClearCacheContext);
  const navigate = useNavigate();

  const { authState } = useContext(AuthContext);
  const isDataChangedRef = useRef(false);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getMarqueeMessagegridData", authState.companyID], () =>
    API.getMarqueeMessagegridData(authState.companyID)
  );

  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      // entries.forEach((one) => {
      //   queryClient.removeQueries();
      // });
      queryClient.removeQueries([
        "getMarqueeMessagegridData",
        authState.companyID,
      ]);
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
        key={`MarqueMessageGrid`}
        finalMetaData={MarqueMessageGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        // ref={myGridRef}
      />
      <Routes>
        <Route
          path="view-details"
          element={
            <MarqueeViewDetails
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              formView={"view"}
            />
          }
        />
        <Route
          path="add"
          element={
            <MarqueeViewDetails
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              formView={"add"}
            />
          }
        />
        <Route
          path="delete"
          element={
            <DeleteMarqueeMessageWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
            />
          }
        />
      </Routes>
    </Fragment>
  );
};
