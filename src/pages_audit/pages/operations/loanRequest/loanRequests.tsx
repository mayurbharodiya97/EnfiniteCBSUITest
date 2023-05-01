import { ClearCacheProvider, ClearCacheContext, queryClient } from "cache";
import { useMutation } from "react-query";
import {
  Fragment,
  useEffect,
  useContext,
  useRef,
  useCallback,
  useState,
  StrictMode,
} from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Alert } from "components/common/alert";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import { ActionTypes } from "components/dataTable";
import * as API from "./api";
import { LoanReqGridMetaData } from "./gridMetadata";
import { CibDetailEditViewWrapper } from "./cibDetails";
import { DBRDetailEditViewWrapper } from "./dbrDetails";
import { useSnackbar } from "notistack";
import { AUTHDetailEditViewWrapper } from "./authDetails";
import { DateRetrievalDialog } from "components/custom/dateRetrievalPara";
import { useStyles } from "pages_audit/style";
import { format } from "date-fns";

const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "View Details",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "date-range",
    actionLabel: "Date Range",
    multiple: false,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];
export const LoanRequest = ({ screenFlag }) => {
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const setCurrentAction = useCallback(
    (data) => {
      if (data.name === "date-range") {
        setOpen(true);
      } else {
        if (screenFlag === "CIB" && data.rows[0].data.CONFIRMED !== "P") {
          enqueueSnackbar("You Can't view this Request.", {
            variant: "warning",
          });
        } else if (
          screenFlag === "DBR" &&
          data.rows[0].data.CONFIRMED !== "C"
        ) {
          enqueueSnackbar("You Can't view this Request.", {
            variant: "warning",
          });
        } else if (
          screenFlag === "AUTH" &&
          data.rows[0].data.CONFIRMED !== "D"
        ) {
          enqueueSnackbar("You Can't view this Request.", {
            variant: "warning",
          });
        } else {
          navigate(data?.name, {
            state: data?.rows,
          });
        }
      }
    },
    [navigate]
  );

  const result = useMutation(API.getLoanReqGridData, {
    onSuccess: (response: any) => {},
    onError: (error: any) => {},
  });

  const selectedDates = (fromDate, toDate) => {
    setOpen(false);
    result.mutate({
      fromDate: format(fromDate, "dd/MM/yyyy"),
      toDate: format(toDate, "dd/MM/yyyy"),
    });
  };
  const handleClose = () => {
    setOpen(false);
  };
  // const handleDialogClose = () => {
  //   navigate(".");
  //   if (isDataChangedRef.current === true) {
  //     myGridRef.current?.refetch?.();
  //     isDataChangedRef.current = false;
  //   }
  // };
  useEffect(() => {
    result.mutate({
      fromDate: format(new Date(), "dd/MM/yyyy"),
      toDate: format(new Date(), "dd/MM/yyyy"),
    });
    return () => {
      let entries = getEntries() as any[];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
      queryClient.removeQueries(["getLoanReqGridData"]);
    };
  }, [getEntries]);
  //result.isError = true;
  //result.error.error_msg = "Something went to wrong..";
  const ClosedEventCall = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      myGridRef.current?.refetch?.();
      isDataChangedRef.current = false;
    }
  }, [navigate]);
  if (screenFlag === "CIB") {
    LoanReqGridMetaData.gridConfig.gridLabel = "CIB Loan Request Check";
  }
  if (screenFlag === "DBR") {
    LoanReqGridMetaData.gridConfig.gridLabel = "DBR Loan Request Check";
  }
  if (screenFlag === "AUTH") {
    LoanReqGridMetaData.gridConfig.gridLabel = "Loan Approval Detail";
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
          key={`cibLoanReqGrid-` + screenFlag}
          finalMetaData={LoanReqGridMetaData as GridMetaDataType}
          data={result.data ?? []}
          setData={() => null}
          loading={result.isLoading}
          actions={actions}
          setAction={setCurrentAction}
          refetchData={() =>
            result.mutate({
              fromDate: format(new Date(), "dd/MM/yyyy"),
              toDate: format(new Date(), "dd/MM/yyyy"),
            })
          }
          ref={myGridRef}
        />
        <Routes>
          <Route
            path="view-details/*"
            element={
              screenFlag === "CIB" ? (
                <CibDetailEditViewWrapper
                  handleDialogClose={ClosedEventCall}
                  isDataChangedRef={isDataChangedRef}
                  moduleType={"CIBLoanRequest"}
                />
              ) : screenFlag === "DBR" ? (
                <DBRDetailEditViewWrapper
                  handleDialogClose={ClosedEventCall}
                  isDataChangedRef={isDataChangedRef}
                  moduleType={"DBRLoanRequest"}
                />
              ) : screenFlag === "AUTH" ? (
                <AUTHDetailEditViewWrapper
                  handleDialogClose={ClosedEventCall}
                  isDataChangedRef={isDataChangedRef}
                  moduleType={"AUTHLoanRequest"}
                />
              ) : (
                <></>
              )
            }
          />
        </Routes>
        <DateRetrievalDialog
          classes={classes}
          open={open}
          handleClose={handleClose}
          loginState={ClosedEventCall}
          selectedDates={selectedDates}
        />
      </Fragment>
    </StrictMode>
  );
};

export const LoanRequestsGridWrapper = ({ screenFlag }) => {
  return (
    <ClearCacheProvider>
      <LoanRequest key={screenFlag + "-LoanRequest"} screenFlag={screenFlag} />
    </ClearCacheProvider>
  );
};
