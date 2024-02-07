//UI
import {
  Button,
  Toolbar,
  Card,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

//logic
import React, { useEffect, useState, useContext, memo } from "react";
import { useMutation } from "react-query";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import "./CommonFooter.css";
import * as API from "./api";
import OtherTrxTabs from "../TRNOtherTrx";
import Paper, { PaperProps } from "@mui/material/Paper";
import Draggable from "react-draggable";

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
  handleUpdateRows,
  handleFilterByScroll,
  filteredRows,
}) => {
  let defaulVal = {
    column: { value: "ACCT_CD", label: "A/C No" },
    operator: { value: "Equals", label: "Equals" },
    value: "",
    logic: { value: "OR", label: "OR" },
  };
  if (!filteredRows) {
    filteredRows = [];
  }
  const [rows, setRows] = useState<any>([defaulVal]);
  const [queryDialog, setQueryDialog] = useState(false);
  const [scrollDeleteDialog, setScrollDeleteDialog] = useState(false);
  const [scrollDeleteDialog2, setScrollDeleteDialog2] = useState(false);
  const [otherTrxDialog, setOtherTrxDialog] = useState(false);

  const [scrollNo, setScrollNo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTrn1, setIsTrn1] = useState(true);

  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const location = useLocation();

  console.log(filteredRows, "filteredRows");

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
  useEffect(() => {
    handleSetRemarks();
  }, [location]);

  useEffect(() => {
    console.log(tempStore, "tempStore1");
  }, [tempStore]);

  useEffect(() => {
    console.log(rows, "rows common footer");
  }, [rows]);

  //api define

  const deleteByScrollNo = useMutation(API.deleteScrollByScrollNo, {
    onSuccess: (data: any) => {
      setLoading(false);
      setScrollDeleteDialog(false);
      setScrollDeleteDialog2(false);
      setScrollNo("");
      handleSetRemarks();
      if (data?.message) {
        enqueueSnackbar(data?.message, {
          variant: "error",
        });
      }
      // enqueueSnackbar("scroll deleted", {
      //   variant: "success",
      // });

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

  const handleDeleteScroll1 = () => {
    if (filteredRows?.length > 0) {
      setScrollDeleteDialog(false);
      setScrollDeleteDialog2(true);
    }
  };

  const handleDeleteScroll2 = () => {
    setLoading(true);

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
      return enqueueSnackbar("Kindly enter Remarks of atleast 5 ", {
        variant: "error",
      });
    }

    console.log(data, "reqdata");
    scrollNo && remarks?.length > 4 && deleteByScrollNo.mutate(data);
  };

  const handleScroll = (txt) => {
    txt.toString();
    setScrollNo(txt);
    handleFilterByScroll(txt);
  };

  const handleCancelDeleteScroll1 = () => {
    setScrollDeleteDialog(false);
    setScrollNo("");
    handleScroll("");
  };
  const handleCancelDeleteScroll2 = () => {
    setScrollDeleteDialog2(false);
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
        <Grid item>
          <Tooltip
            disableInteractive={true}
            title={
              tempStore?.accInfo?.ACCT_CD ? (
                ""
              ) : (
                <h3>"Please fill A/C details"</h3>
              )
            }
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                tempStore?.accInfo?.ACCT_CD
                  ? setOtherTrxDialog(true)
                  : console.log("");
              }}
            >
              Other Trx
            </Button>
          </Tooltip>
        </Grid>{" "}
      </Grid>
      <br />
      <>
        <Dialog
          maxWidth="lg"
          open={scrollDeleteDialog}
          // onClose={handleClose}
          // aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle
            className="title"
            style={{ cursor: "move" }}
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
            />
            <br />
          </DialogContent>

          <DialogActions className="dialogFooter">
            <Button
              color="secondary"
              variant="contained"
              onClick={handleDeleteScroll1}
              autoFocus
            >
              {!loading ? "Delete" : <CircularProgress size={20} />}
            </Button>{" "}
            <Button
              onClick={() => handleCancelDeleteScroll1()}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          maxWidth="sm"
          open={scrollDeleteDialog2}
          // onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle className="title">
            {"Do you want to Delete the Scroll : " + scrollNo + "?"}
          </DialogTitle>
          <DialogContent>
            <br />
            {filteredRows &&
              filteredRows?.map((a) => {
                if (a?.CONFIRMED === "Y") {
                  return (
                    <>
                      <Typography variant="h6">
                        Scroll No.{a?.SCROLL1} is confirmed. Are you sure you
                        wish to Delete it ?
                      </Typography>{" "}
                      <br /> <br />
                    </>
                  );
                }
              })}

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
            <br />
          </DialogContent>

          <DialogActions className="dialogFooter">
            <Button
              color="secondary"
              variant="contained"
              onClick={handleDeleteScroll2}
              autoFocus
            >
              Yes {!loading ? "" : <CircularProgress size={20} />}
            </Button>{" "}
            <Button
              onClick={() => handleCancelDeleteScroll2()}
              variant="contained"
              color="secondary"
            >
              No
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
          {/* <DialogTitle id="alert-dialog-title">Scroll Delete</DialogTitle> */}
          <DialogContent>
            <OtherTrxTabs />
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => setOtherTrxDialog(false)}
              variant="contained"
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
