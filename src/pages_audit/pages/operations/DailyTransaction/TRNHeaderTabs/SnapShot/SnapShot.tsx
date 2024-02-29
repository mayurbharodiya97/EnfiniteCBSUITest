import { Fragment, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { snapShotGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { GridMetaDataType } from "components/dataTable/types";
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

export const SnapShot = () => {
  const { enqueueSnackbar } = useSnackbar();
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);
  const [dateDialog, setDateDialog] = useState(false);
  const [prevDate, setPrevDate] = useState(new Date());
  const [nextDate, setNextDate] = useState(new Date());

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
    let obj = tempStore?.accInfo;
    obj.FROM_DATE = format(prevDate, "dd-MMM-yyyy");
    obj.TO_DATE = format(nextDate, "dd-MMM-yyyy");
    getSnapShotList.mutate(tempStore.accInfo);
  };

  useEffect(() => {
    tempStore?.accInfo?.ACCT_CD && handleGetSnapshot();
  }, [tempStore]);

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
  return (
    <>
      <div></div>
      <GridWrapper
        key={`snapShotGridMetaData`}
        finalMetaData={snapShotGridMetaData as GridMetaDataType}
        data={rows}
        setData={() => null}
        loading={getSnapShotList.isLoading}
        refetchData={() => {}}
        ref={myGridRef}
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
        {" "}
        <div></div>
        <Grid item sx={{ display: "flex", gap: "1rem" }}>
          <Button
            className="dialogBtn"
            variant="contained"
            color="secondary"
            sx={{ margin: "8px" }}
            onClick={() => setDateDialog(true)}
          >
            Back Date
          </Button>
        </Grid>
        <div></div>
      </Grid>

      <Dialog
        maxWidth="sm"
        open={dateDialog}
        onClose={() => setDateDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle className="dialogTitle">A/C Info</DialogTitle> */}
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
