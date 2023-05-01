import { GridMetaDataType } from "components/dataTable/types";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { Fragment, useContext, useCallback, useRef, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { MerchantOnboardingGridMetadata } from "./gridmetadata";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { useQuery } from "react-query";
import { ClearCacheContext, queryClient } from "cache";
import { ActionTypes } from "components/dataTable";
import { MerchantViewDetails } from "./viewdetails/merchantDetails";
import { Transition } from "pages_audit/common";
import { Alert } from "components/common/alert";
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
    multiple: true,
    rowDoubleClick: true,
  },
];
export const MerchantOnboardingGrid = () => {
  const { getEntries } = useContext(ClearCacheContext);
  const navigate = useNavigate();
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const isDataChangedRef = useRef(false);
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getMerchantOnboardinggridData", authState.companyID], () =>
    API.getMerchantOnboardinggridData(authState.companyID)
  );
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      // entries.forEach((one) => {
      //   queryClient.removeQueries();
      // });
      queryClient.removeQueries([
        "getMerchantOnboardinggridData",
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
    navigate(".");
    if (isDataChangedRef.current === true) {
      myGridRef.current?.refetch?.();
      isDataChangedRef.current = false;
    }
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
        key={`merchantOnboardingGrid`}
        finalMetaData={MerchantOnboardingGridMetadata as GridMetaDataType}
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
          path="view-details"
          element={
            <MerchantViewDetails
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              formView={"view"}
              moduleType={undefined}
            />
          }
        />
      </Routes>
    </Fragment>
  );
};
