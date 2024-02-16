//UI
import { Button, Tooltip, CircularProgress } from "@mui/material";
import { Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

//logic
import "./CommonFooter.css";
import React, { useEffect, useState, useContext, memo } from "react";
import { useMutation } from "react-query";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { AuthContext, AccDetailContext } from "pages_audit/auth";
import * as API from "./api";
import OtherTrxTabs from "../TRNOtherTrx";
import Paper, { PaperProps } from "@mui/material/Paper";
import Draggable from "react-draggable";
import LienDetail from "../TRNOtherTrx/Lien_Detail";
import SIDetail from "../TRNOtherTrx/SI_Detail";

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
const CommonFooter = ({
  viewOnly,
  handleViewAll,
  handleRefresh,
  handleFilterByScroll,
  filteredRows,
}) => {
  if (!filteredRows) {
    filteredRows = [];
  }

  const [scrollDeleteDialog, setScrollDeleteDialog] = useState(false);
  const [otherTrxDialog, setOtherTrxDialog] = useState(false);

  const [scrollNo, setScrollNo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTrn1, setIsTrn1] = useState(true);
  const [isConfirmedRec, setIsConfirmedRec] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const location = useLocation();

  useEffect(() => {
    let abc = filteredRows && filteredRows?.some((a) => a?.CONFIRMED === "Y");
    setIsConfirmedRec(abc);
  }, [filteredRows]);

  useEffect(() => {
    handleSetRemarks();
  }, [location]);

  useEffect(() => {
    console.log(tempStore, "tempStoreCommon");
  }, [tempStore]);

  //api define

  const deleteByScrollNo = useMutation(API.deleteScrollByScrollNo, {
    onSuccess: (data: any) => {
      setLoading(false);
      setScrollDeleteDialog(false);
      setScrollNo("");
      handleSetRemarks();
      if (data?.messageDetails) {
        enqueueSnackbar(data?.messageDetails, {
          variant: "success",
        });
      }

      if (isTrn1) {
        viewOnly && setTempStore({ ...tempStore, refresh: Math.random() });
      } else {
        handleRefresh();
      }
    },
    onError: (error: any) => {
      setLoading(false);
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });

  //fns define
  const handleSetRemarks = () => {
    let msg = "WRONG ENTRY FROM DAILY TRAN";
    if (location.pathname.includes("/cnf_daily_tran_F2")) {
      setRemarks(msg + " CONFIRMATION (F2) (TRN/002)");
      setIsTrn1(false);
    } else {
      setRemarks(msg + " MAKER (TRN/001)");

      setIsTrn1(true);
    }
  };
  const handleDeleteScroll = () => {
    console.log(filteredRows, "filteredRows");
    let data = {
      COMP_CD: authState.companyID,
      BRANCH_CD: authState?.user?.branchCode,

      SCROLL_NO: scrollNo,
      USER_DEF_REMARKS: remarks,

      ACCT_TYPE: filteredRows[0]?.ACCT_TYPE,
      ACCT_CD: filteredRows[0]?.ACCT_CD,
      TRAN_AMOUNT: filteredRows[0]?.AMOUNT,
      ENTERED_COMP_CD: filteredRows[0]?.COMP_CD,
      ENTERED_BRANCH_CD: filteredRows[0]?.BRANCH_CD,
      ACTIVITY_TYPE: "DAILY TRANSACTION",
      TRAN_DT: filteredRows[0]?.TRAN_DT,
      CONFIRM_FLAG: filteredRows[0]?.CONFIRMED,
    };
    if (!scrollNo) {
      return enqueueSnackbar("Kindly enter Scroll No", {
        variant: "error",
      });
    }

    if (remarks?.length < 5) {
      return enqueueSnackbar("Kindly enter Remarks of atleast 5 Characters", {
        variant: "error",
      });
    }
    if (!data?.ACCT_CD) {
      return enqueueSnackbar("No records found", {
        variant: "error",
      });
    }

    if (data?.ACCT_CD && scrollNo && remarks?.length > 4) {
      setLoading(true);
      deleteByScrollNo.mutate(data);
    }
  };

  const handleScroll = (txt) => {
    txt.toString();
    console.log("txt", txt);
    if (!txt) {
      txt = "";
    }
    setScrollNo(txt);
    handleFilterByScroll(txt);
  };

  const handleCancelDeleteScroll = () => {
    setScrollDeleteDialog(false);
    setScrollNo("");
    handleScroll("");
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        style={{ marginTop: "5px", marginBottom: "15px" }}
      >
        {" "}
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.open("Calculator:///")}
          >
            Calculator
          </Button>
        </Grid>{" "}
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              viewOnly && isTrn1 ? handleRefresh() : handleViewAll();
            }}
          >
            {viewOnly && isTrn1 ? "Go Back" : "View All"}
          </Button>
        </Grid>
        {viewOnly && (
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setScrollDeleteDialog(true)}
            >
              Scroll Delete
            </Button>
          </Grid>
        )}
        {viewOnly && (
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                tempStore?.accInfo?.ACCT_CD
                  ? setOtherTrxDialog(true)
                  : console.log("");
              }}
            >
              Other Trn./Lien/SI Detail
            </Button>
          </Grid>
        )}
      </Grid>
      <br />
      <>
        <Dialog
          maxWidth="lg"
          open={scrollDeleteDialog}
          aria-describedby="alert-dialog-description"
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle
            className="dialogTitle"
            style={{
              cursor: "move",
            }}
            id="draggable-dialog-title"
          >
            Scroll Delete
          </DialogTitle>
          <DialogContent>
            <br />
            <TextField
              style={{ minWidth: "300px" }}
              fullWidth={true}
              value={scrollNo}
              placeholder="Enter ScrollNo"
              type="number"
              onChange={(e) => handleScroll(e.target.value)}
              onBlur={(e) => handleScroll(e.target.value)}
              label="Scroll No."
              variant="outlined"
              color="secondary"
              helperText={
                isConfirmedRec && (
                  <h3>
                    Scroll No. {scrollNo} is confirmed. Are you sure you wish to
                    Delete it ?
                  </h3>
                )
              }
            />
            <br />
            <br />
            <TextField
              style={{ minWidth: "400px" }}
              fullWidth={true}
              value={remarks}
              placeholder="Enter Remarks"
              onChange={(e) => setRemarks(e.target.value)}
              label="Remarks"
              variant="outlined"
              color="secondary"
            />
          </DialogContent>

          <DialogActions className="dialogFooter">
            <Button
              className="dialogBtn"
              color="secondary"
              variant="contained"
              onClick={handleDeleteScroll}
              autoFocus
            >
              Ok
              {!loading ? (
                ""
              ) : (
                <CircularProgress size={20} sx={{ marginLeft: "10px" }} />
              )}
            </Button>
            <Button
              className="dialogBtn"
              onClick={() => handleCancelDeleteScroll()}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          maxWidth="xl"
          open={otherTrxDialog}
          // onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" className="dialogTitle">
            Other Transaction Details for A/C No. {tempStore?.accInfo?.ACCT_CD}{" "}
          </DialogTitle>
          <DialogContent style={{ padding: "0px" }}>
            <OtherTrxTabs />
            <LienDetail />
            <SIDetail />
          </DialogContent>

          <DialogActions>
            <Button
              className="dialogBtn"
              onClick={() => setOtherTrxDialog(false)}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </>
  );
};
export default memo(CommonFooter);
