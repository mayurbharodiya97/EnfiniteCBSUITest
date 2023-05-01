import { ClearCacheProvider, ClearCacheContext, queryClient } from "cache";
import { useMutation } from "react-query";
import {
  Fragment,
  useEffect,
  useContext,
  useRef,
  useCallback,
  StrictMode,
} from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Alert } from "components/common/alert";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import { ActionTypes } from "components/dataTable";
import * as API from "./api";
import { UserLimitConfirmGridMetaData } from "./metaData/userLimitMetaData";
import { useSnackbar } from "notistack";
import { CustomerLimitConfirmation } from "pages_audit/pages/operations/customerSearching/customerLimitUpdate/customerLimitConfirm";
import { PasswordResetConfirm } from "./passwordReset/passwordResetConfirm";
import { PasswordResetConfirmGridMetaData } from "./metaData/passwordResetMetaData";
import { CustomerActivationConfirm } from "./customerActivation/customerActivationConfirm";
import { CustomerActivationConfirmGridMetaData } from "./metaData/customerActivationMetaData";
import { ServiceConfigConfirmGridMetaData } from "./metaData/serviceConfigMetaData";
import { ServiceConfigEditViewWrapper } from "../configurations/serviceWiseConfig/viewEditDetail";
import { OperatorMasterGridMetaData } from "./metaData/operatorMasterMetaData";
import { AuthContext } from "pages_audit/auth";
import { OperatorMstConfirmDetails } from "./operatorMaster/operatorViewDetail";

const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "View Details",
    multiple: false,
    rowDoubleClick: true,
  },
];
export const Confirmations = ({ screenFlag }) => {
  const myGridRef = useRef<any>(null);
  const isRefreshRef = useRef<any>(false);
  const { getEntries } = useContext(ClearCacheContext);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const setCurrentAction = useCallback(
    (data) => {
      let confirmed = data?.rows[0]?.data?.CONFIRMED;
      if (confirmed === "Y") {
        enqueueSnackbar("Request has been already accepted.", {
          variant: "warning",
        });
      } else if (confirmed === "R") {
        enqueueSnackbar("Request has been already rejected.", {
          variant: "warning",
        });
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  const result = useMutation(API.getConfirmationGridData, {
    onSuccess: (response: any) => {},
    onError: (error: any) => {},
  });

  useEffect(() => {
    result.mutate({ screenFlag: screenFlag, compCode: authState.companyID });
    return () => {
      let entries = getEntries() as any[];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
      queryClient.removeQueries(["getConfirmationGridData"]);
    };
  }, [getEntries]);
  const ClosedEventCall = useCallback(() => {
    navigate(".");
    if (isRefreshRef.current) {
      result.mutate({ screenFlag: screenFlag, compCode: authState.companyID });
      isRefreshRef.current = false;
    }
  }, [navigate]);

  let gridMetaData = UserLimitConfirmGridMetaData;
  if (screenFlag === "userLimit") {
    gridMetaData = UserLimitConfirmGridMetaData;
  } else if (screenFlag === "passReset") {
    gridMetaData = PasswordResetConfirmGridMetaData;
  } else if (screenFlag === "custActivation") {
    gridMetaData = CustomerActivationConfirmGridMetaData;
  } else if (screenFlag === "serviceConfig") {
    gridMetaData = ServiceConfigConfirmGridMetaData;
  } else if (screenFlag === "operatorMaster") {
    gridMetaData = OperatorMasterGridMetaData;
  }

  return (
    <StrictMode>
      <Fragment>
        {result.isError && (
          <Alert
            severity="error"
            errorMsg={result.error?.error_msg ?? "Something went to wrong.."}
            errorDetail={result.error?.error_detail}
            color="error"
          />
        )}
        <GridWrapper
          key={`ConfirmationReqGrid-` + screenFlag}
          finalMetaData={gridMetaData as GridMetaDataType}
          data={result.data ?? []}
          setData={() => null}
          loading={result.isLoading}
          actions={actions}
          setAction={setCurrentAction}
          refetchData={() =>
            result.mutate({
              screenFlag: screenFlag,
              compCode: authState.companyID,
            })
          }
          ref={myGridRef}
          // defaultFilter={[
          //   {
          //     id: "CONFIRM_STATUS",
          //     value: {
          //       columnName: "Status",
          //       condition: "equal",
          //       value: "Confirmation Pending",
          //     },
          //   },
          // ]}
        />
        <Routes>
          <Route
            path="view-details/*"
            element={
              screenFlag === "userLimit" ? (
                <CustomerLimitConfirmation
                  key={"Loading-CustomerLimitDetailsUpdate"}
                  ClosedEventCall={ClosedEventCall}
                  isRefreshRef={isRefreshRef}
                />
              ) : screenFlag === "passReset" ? (
                <PasswordResetConfirm
                  ClosedEventCall={ClosedEventCall}
                  isRefreshRef={isRefreshRef}
                />
              ) : screenFlag === "custActivation" ? (
                <CustomerActivationConfirm
                  ClosedEventCall={ClosedEventCall}
                  isRefreshRef={isRefreshRef}
                />
              ) : screenFlag === "serviceConfig" ? (
                <ServiceConfigEditViewWrapper
                  handleDialogClose={ClosedEventCall}
                  isDataChangedRef={isRefreshRef}
                  moduleType={"serviceConfigConfirm"}
                  defaultView={"confirm"}
                />
              ) : screenFlag === "operatorMaster" ? (
                <OperatorMstConfirmDetails
                  isRefreshRef={isRefreshRef}
                  ClosedEventCall={ClosedEventCall}
                  defaultmode={"view"}
                />
              ) : (
                <></>
              )
            }
          />
        </Routes>
      </Fragment>
    </StrictMode>
  );
};

export const ConfirmationGridWrapper = ({ screenFlag }) => {
  return (
    <ClearCacheProvider>
      <Confirmations
        key={screenFlag + "-Confirmation"}
        screenFlag={screenFlag}
      />
    </ClearCacheProvider>
  );
};
