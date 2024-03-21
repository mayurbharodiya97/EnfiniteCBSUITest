import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Mutation, useMutation, useQuery } from "react-query";
import { snapShotGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { useSnackbar } from "notistack";
import { Button, Grid, Typography } from "@mui/material";
//date
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { format } from "date-fns";
const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: "Back Date",
    multiple: false,
    // rowDoubleClick: true,
    alwaysAvailable: true,
  },
];
export const SnapShot = ({ reqData }) => {
  const { enqueueSnackbar } = useSnackbar();
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);
  const [dateDialog, setDateDialog] = useState(false);
  const [prevDate, setPrevDate] = useState(new Date());
  const [nextDate, setNextDate] = useState(new Date());
  const [dataRow, setDataRow] = useState<any>({});
  const [credit, setCredit] = useState<any>(0);
  const [debit, setDebit] = useState<any>(0);

  // api define
  const getSnapShotList = useMutation(API.getSnapShotList, {
    onSuccess: (data) => {
      console.log(data, " getSnapShotList detailssss");
      setRows(data);
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });

  const handleGetSnapshot = () => {
    let obj = reqData;
    obj.FROM_DATE = format(prevDate, "dd-MMM-yyyy");
    obj.TO_DATE = format(nextDate, "dd-MMM-yyyy");
    getSnapShotList.mutate(obj);
  };

  useEffect(() => {
    reqData?.ACCT_CD && handleGetSnapshot();
  }, [reqData]);

  // const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
  //   any,
  //   any
  // >(["getSnapShotList"], () => API.getSnapShotList(reqData));

  const handleDate = (e, key) => {
    console.log(e, key, "e date");
    if (key == "prev") {
      setPrevDate(e);
    } else {
      setNextDate(e);
    }
  };

  const handleDateErr = (e, key) => {
    console.log(e, key, "err");
  };

  const handleRetrieve = () => {
    handleGetSnapshot();
    setDateDialog(false);
  };

  const setCurrentAction = useCallback((data) => {
    let row = data.rows[0]?.data;
    console.log(row, "rowwww");
    setDataRow(row);

    if (data.name === "view-detail") {
      console.log("heloooo");
      setDateDialog(true);
    }
  }, []);
  return (
    <>
      {getSnapShotList.isError ? (
        <Alert
          severity="error"
          errorMsg={getSnapShotList.error?.error_msg ?? "Unknown error occured"}
          errorDetail={getSnapShotList.error?.error_detail ?? ""}
        />
      ) : null}

      <GridWrapper
        key={`snapShotGridMetaData`}
        finalMetaData={snapShotGridMetaData as GridMetaDataType}
        data={rows ?? []}
        setData={() => null}
        loading={getSnapShotList?.isLoading}
        refetchData={() => {}}
        ref={myGridRef}
        actions={actions}
        setAction={setCurrentAction}
        onlySingleSelectionAllow={true}
        isNewRowStyle={true}
      />
      <Grid
        item
        xs={12}
        sm={12}
        sx={{
          position: "relative",
          top: "-3rem",
          display: "flex",
          justifyContent: "space-between",
          gap: "3rem",
          alignItems: "center",
        }}
      >
        <div></div>
        <div></div>

        <Grid item sx={{ display: "flex", gap: "5rem" }}>
          <div> Credit : ₹ </div>
          <div>Debit : ₹</div>
        </Grid>
      </Grid>

      <Dialog
        maxWidth="sm"
        open={dateDialog}
        onClose={() => setDateDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div style={{ display: "flex", alignItems: "center" }}>
            From:{" "}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                format="dd/MM/yyyy"
                value={prevDate}
                onChange={(e) => handleDate(e, "prev")}
                onError={(e) => handleDateErr(e, "prev")}
              />
            </LocalizationProvider>
            &nbsp;To:{" "}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                format="dd/MM/yyyy"
                value={nextDate}
                onChange={(e) => handleDate(e, "next")}
                onError={(e) => handleDateErr(e, "next")}
              />
            </LocalizationProvider>
          </div>
        </DialogContent>
        <DialogActions className="dialogFooter">
          <Button
            autoFocus
            className="dialogBtn"
            color="secondary"
            variant="contained"
            onClick={() => handleRetrieve()}
          >
            Retrieve
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
