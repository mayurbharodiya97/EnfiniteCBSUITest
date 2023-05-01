import { useEffect, FC, Fragment, useMemo, useCallback } from "react";
import { useLocation, Routes, Route, useNavigate } from "react-router-dom";
import { useQueries } from "react-query";
import { queryClient } from "cache";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { Transition } from "pages_audit/common";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes } from "components/dataTable";
import {
  AddChargeTempDetailsWrapper,
  DeleteChargeTempDetailsWrapper,
} from "./crud";
import * as API from "./api";
import { checklistDetailsGridMetaData } from "./metadata/grid";
import { ViewEditChargeTempMasterWrapper } from "../crud";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Button, Dialog, Toolbar, Typography } from "@mui/material";

const actions: ActionTypes[] = [
  {
    actionName: "edit",
    actionLabel: "Edit",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "add",
    actionLabel: "Add",
    multiple: undefined,
    alwaysAvailable: true,
  },
  {
    actionName: "delete",
    actionLabel: "Delete",
    multiple: false,
    rowDoubleClick: false,
  },
];

const ChargeTempDetails: FC<any> = ({
  transactionID,
  isDataChangedRef,
  closeDialog,
  serialNo,
}) => {
  const navigate = useNavigate();
  const setCurrentAction = useCallback(
    (data) => {
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
  );

  const result = useQueries([
    {
      queryKey: ["getGridData", transactionID],
      queryFn: () => API.getGridData(transactionID),
    },
  ]);

  const handleDialogClose = () => {
    if (isDataChangedRef.current === true) {
      isDataChangedRef.current = true;
      result[0]?.refetch();
      isDataChangedRef.current = false;
    }
    navigate(".");
  };

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getGridData", transactionID]);
    };
  }, [transactionID]);

  const loading = result[0].isLoading || result[0].isFetching;
  let isError = result[0].isError;
  //@ts-ignore
  let errorMsg = `${result[0].error?.error_msg}`;
  errorMsg = Boolean(errorMsg.trim()) ? errorMsg : "Unknown error occured";
  //console.log("result=>", result);
  const renderResult = loading ? (
    <div
      style={{
        margin: "2rem",
        display: "grid",
        placeItems: "center",
        width: "400px",
        height: "100px",
      }}
    >
      {/* <img src={loaderGif} alt="loader" width="50px" height="50px" /> */}
      <LoaderPaperComponent />
    </div>
  ) : isError ? (
    <span
      style={{
        margin: "2rem",
        display: "grid",
        placeItems: "center",
        color: "red",
      }}
    >
      {errorMsg}
    </span>
  ) : (
    <Fragment>
      <GridWrapper
        key="checklistDetails"
        finalMetaData={checklistDetailsGridMetaData as any}
        data={result[0].data ?? []}
        setData={() => null}
        actions={actions}
        setAction={setCurrentAction}
        loading={loading}
        refetchData={() => result[0].refetch()}
      />
      <Routes>
        <Route
          path="add"
          element={
            <AddChargeTempDetailsWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              transactionID={transactionID}
            />
          }
        />
        <Route
          path="edit"
          element={
            <ViewEditChargeTempMasterWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              defaultView={"view"}
            />
          }
        />
        <Route
          path="delete"
          element={
            <DeleteChargeTempDetailsWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
            />
          }
        />
      </Routes>
    </Fragment>
  );
  return renderResult;
};

export const ChargeTempDetailsWrapper = ({
  closeDialog,
  isDataChangedRef,
  heading,
}) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const { state: myData }: any = useLocation();
  const data = useMemo(() => myData, []);
  const classes = useDialogStyles();
  const transactionID = data?.[0]?.data?.transactionID;
  const serialNo = ""; //data?.[0]?.serialNo;
  const name = ""; //data?.[0]?.data;
  return (
    <Dialog
      //fullWidth
      open={true}
      maxWidth="xl"
      //fullScreen
      //@ts-ignore
      TransitionComponent={Transition}
      classes={{
        scrollPaper: classes.topScrollPaper,
        paperScrollBody: classes.topPaperScrollBody,
      }}
    >
      <div style={{ padding: "10px" }}>
        <Toolbar variant="dense">
          <Typography component="h3" variant="h4" color="primary">
            {/* {heading} {name?.checklistName ?? "-"} */}
          </Typography>
          <div style={{ flexGrow: 1 }} />
          <Button onClick={closeDialog}>Close</Button>
        </Toolbar>

        <ChargeTempDetails
          transactionID={transactionID}
          isDataChangedRef={isDataChangedRef}
          closeDialog={closeDialog}
          serialNo={serialNo}
        />
      </div>
    </Dialog>
  );
};
