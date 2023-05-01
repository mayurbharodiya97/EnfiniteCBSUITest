import { ClearCacheProvider, ClearCacheContext, queryClient } from "cache";
import { useMutation } from "react-query";
import {
  Fragment,
  useEffect,
  useContext,
  useRef,
  useCallback,
  useState,
} from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Alert } from "components/common/alert";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import { ActionTypes } from "components/dataTable";
import * as API from "./api";
import { LoanClosureReqGridMetaData } from "./gridMetadata";
import { LoanClsDetailEditViewWrapperTs } from "./loanClosureDetails";
import { format } from "date-fns";
import { DateRetrievalDialog } from "components/custom/dateRetrievalPara";
import { useStyles } from "pages_audit/style";
import { useSnackbar } from "notistack";
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
export const LoanClosureRequest = () => {
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
        let confirmed = data?.rows[0]?.data.CONFIRMED;
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
      }
    },
    [navigate]
  );

  const result = useMutation(API.getLoanClosureReqGridData, {
    onSuccess: (response: any) => {},
    onError: (error: any) => {},
  });
  // const handleDialogClose = () => {
  //   navigate(".");
  //   if (isDataChangedRef.current === true) {
  //     myGridRef.current?.refetch?.();
  //     isDataChangedRef.current = false;
  //   }
  // };
  const selectedDates = (retrievalValues) => {
    setOpen(false);
    result.mutate({
      fromDate:
        retrievalValues?.[0]?.value?.value ?? format(new Date(), "dd/MM/yyyy"),
      toDate:
        retrievalValues?.[1]?.value?.value ?? format(new Date(), "dd/MM/yyyy"),
    });
  };
  const handleClose = () => {
    setOpen(false);
  };
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
      queryClient.removeQueries(["getLoanClosureReqGridData"]);
    };
  }, [getEntries]);
  //result.isError = true;
  //result.error.error_msg = "Something went to wrong..";
  const ClosedEventCall = useCallback(() => {
    navigate(".");
    result.mutate({
      fromDate: format(new Date(), "dd/MM/yyyy"),
      toDate: format(new Date(), "dd/MM/yyyy"),
    });
  }, [navigate]);

  return (
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
        key={`loanClosureGrid`}
        finalMetaData={LoanClosureReqGridMetaData as GridMetaDataType}
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
            <LoanClsDetailEditViewWrapperTs
              handleDialogClose={ClosedEventCall}
              isDataChangedRef={isDataChangedRef}
              moduleType={"LoanClosureRequest"}
            />
          }
        />
      </Routes>
      <DateRetrievalDialog
        classes={classes}
        open={open}
        handleClose={handleClose}
        loginState={ClosedEventCall}
        retrievalParaValues={selectedDates}
      />
    </Fragment>
  );
};

export const LoanClosureGridWrapper = () => {
  return (
    <ClearCacheProvider>
      <LoanClosureRequest />
    </ClearCacheProvider>
  );
};
