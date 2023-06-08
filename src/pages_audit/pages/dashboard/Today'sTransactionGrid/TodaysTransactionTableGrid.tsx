import GridWrapper from "components/dataTableStatic";
import { TodaysTransactionTableGridMetaData } from "./gridMetaData";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider, queryClient } from "cache";
import { useMutation, useQuery } from "react-query";
import * as API from "./openScroll/api";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import Scroll from "./openScroll/scroll";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Alert } from "components/common/alert";
import { Dialog, Grid, Typography } from "@mui/material";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { AuthContext } from "pages_audit/auth";
import { format } from "date-fns";

const actions: ActionTypes[] = [
  {
    actionName: "scroll",
    actionLabel: "Scroll",
    multiple: false,
    rowDoubleClick: true,
    actionTextColor: "var(--theme-color3)",
    alwaysAvailable: false,
    actionBackground: "inherit",
  },
];

const TodaysTransactionTableGrid = ({ mutation }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rowsData, setRowsData] = useState({});
  const setCurrentAction = useCallback((data) => {
    setRowsData(data.rows);
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const confirmedCount = mutation?.data?.filter(
    (item) => item.CONFIRM === "Y"
  ).length;
  const pendingCount = mutation?.data?.filter(
    (item) => item.PENDING === "0"
  ).length;
  const rejectedCount = mutation?.data?.filter(
    (item) => item.CONFIRM === "N"
  ).length;

  return (
    <>
      <Typography>{`Confirmed Trasaction: ${confirmedCount}`}</Typography>
      <Typography>{`Rejected Trasaction: ${rejectedCount}`}</Typography>
      <Typography>{`Pending Trasaction :${pendingCount}`}</Typography>
      {mutation.isError ? (
        <Fragment>
          <div style={{ width: "100%", paddingTop: "10px" }}>
            <Alert
              severity={mutation.error?.severity ?? "error"}
              errorMsg={mutation.error?.error_msg ?? "Error"}
              errorDetail={mutation.error?.error_detail ?? ""}
            />
          </div>
        </Fragment>
      ) : null}
      <GridWrapper
        key={`TodaysTransactionTableGrid`}
        finalMetaData={TodaysTransactionTableGridMetaData as GridMetaDataType}
        data={mutation?.data ?? []}
        setData={() => null}
        actions={actions}
        setAction={setCurrentAction}
        headerToolbarStyle={{
          backgroundColor: "var(--theme-color2)",
          color: "black",
        }}
        loading={mutation.isLoading || mutation.isFetching}
      />

      {dialogOpen && (
        <Scroll
          data={rowsData}
          open={dialogOpen}
          handleCloseDialog={handleCloseDialog}
        />
      )}
    </>
  );
};

export const TodaysTransactionTableGridWrapper = ({ mutation }) => {
  return (
    <ClearCacheProvider>
      <TodaysTransactionTableGrid mutation={mutation} />
    </ClearCacheProvider>
  );
};
