//UI
import { Button, Toolbar, AppBar, Card } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
//Logical
import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import * as API2 from "../TRN001_footer/api";
import { AuthContext } from "pages_audit/auth";
import "./Trn002_Footer.css";
import BaseFooter from "../TRN001_footer/BaseFooter";

const Trn002_Footer = () => {
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AuthContext);

  const [pendingRows, setPendingRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [snack, setSnack] = useState({});
  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  useEffect(() => {
    setTempStore({ ...tempStore, accInfo: {} });
  }, []);

  useEffect(() => {
    console.log(pendingRows, "pendingRows");
  }, [pendingRows]);

  useEffect(() => {
    handleGetTRN002List();
  }, []);

  const handleGetTRN002List = () => {
    let data = {
      COMP_CD: authState?.companyID,
      BRANCH_CD: authState?.user?.branchCode,
    };
    getTRN002List.mutate(data);
  };

  //api define ===============================================================
  const getAccInfo = useMutation(API2.getAccInfo, {
    onSuccess: (data) => {
      console.log(data, "accInfo");
      setTempStore({ ...tempStore, accInfo: data });
    },
    onError: (error) => {},
  });

  const confirmScroll = useMutation(API.confirmScroll, {
    onSuccess: (data) => {
      console.log(data, "confirmScroll");
      setOpen(true);
      setSnack({ code: true, msg: "Record Confirm" });
      handleGetTRN002List();
    },
    onError: (error) => {
      console.log(error, "error");
      setOpen(true);
      setSnack({ code: false, msg: error?.error_msg });
    },
  });
  const getTRN002List = useMutation(API.getTRN002List, {
    onSuccess: (data) => {
      data.map((a) => {
        a.check = false;
      });
      data.sort((a, b) => new Date(a.ENTERED_DATE) - new Date(b.ENTERED_DATE));
      let arr = data.filter((a) => a.CONFIRMED == "0");
      setPendingRows(arr);
      setRows(data);
    },
    onError: (error) => {},
  });

  // functions ===============================================================

  const handleCheck = (e, i) => {
    let obj = [...pendingRows];
    obj[i].check = e.target.checked;
    setTimeout(() => {
      obj[i].check = false;
    }, 500);
    confirmScroll.mutate(obj[i]);
    setPendingRows(obj);
  };

  const handleRowClick = (e, a) => {
    console.log(a, "aaaaaa");
    let data = {
      COMP_CD: a?.COMP_CD,
      BRANCH_CD: a?.BRANCH_CD,
      ACCT_TYPE: a?.ACCT_TYPE,
      ACCT_CD: a?.ACCT_CD,
      authState: authState,
    };
    getAccInfo.mutate(data);
  };

  const handleUpdateRows = (data) => {
    console.log(data, "dataaaa");
    setPendingRows(data);
  };

  const handleViewAll = () => {
    let arr = [...rows];
    setPendingRows(arr);
  };
  const handleRefresh = () => {
    handleGetTRN002List();
  };

  return (
    <>
      <Card
        sx={{
          boxShadow: "0px 1px 4px -1px #999999",
          borderRadius: "5px",
          padding: "8px",
          margin: "4px",
        }}
      >
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Vno.</TableCell>
                <TableCell className="txtRight">A/C No</TableCell>
                <TableCell>A/C holder name</TableCell>
                <TableCell>TRX</TableCell>
                <TableCell className="txtRight">Amount</TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell>Chq No</TableCell>
                <TableCell>SDC</TableCell>
                <TableCell>Chq Date</TableCell>
                <TableCell>Scroll/Token</TableCell>
                <TableCell>EnteredBy</TableCell>
                {/* <TableCell>VerifiedBy</TableCell>
                <TableCell>PendingCycle</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingRows.length > 0 ? (
                pendingRows.map((a, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>
                        <Tooltip title="Confirm Record">
                          <IconButton>
                            <input
                              disabled={a.CONFIRMED == "Y" ? true : false}
                              id="check"
                              type="checkbox"
                              checked={a.check}
                              onChange={(e) => handleCheck(e, i)}
                            />
                          </IconButton>
                        </Tooltip>{" "}
                      </TableCell>
                      <TableCell id={a?.isFav ? "isFav" : ""}>
                        {a.TRAN_CD}
                      </TableCell>
                      <TableCell
                        id={a?.isFav ? "isFav" : ""}
                        className="txtRight"
                      >
                        {a.ACCT_CD_NEW}
                      </TableCell>
                      <TableCell
                        id={a?.isFav ? "isFav" : ""}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => handleRowClick(e, a)}
                      >
                        {a.ACCT_NM}
                      </TableCell>
                      <TableCell id={a?.isFav ? "isFav" : ""}>
                        {a.TYPE_CD}
                      </TableCell>
                      <TableCell
                        id={a?.isFav ? "isFav" : ""}
                        className="txtRight"
                      >
                        {a.AMOUNT}
                      </TableCell>
                      <TableCell id={a?.isFav ? "isFav" : ""}>
                        {a.REMARKS}
                      </TableCell>
                      <TableCell id={a?.isFav ? "isFav" : ""}>
                        {a.CHEQUE_NO}
                      </TableCell>
                      <TableCell id={a?.isFav ? "isFav" : ""}>
                        {a.SDC}
                      </TableCell>
                      <TableCell id={a?.isFav ? "isFav" : ""}>
                        {a.ENTERED_DATE.substring(0, 10)}
                      </TableCell>
                      <TableCell id={a?.isFav ? "isFav" : ""}>
                        {a.SCROLL1}
                      </TableCell>
                      <TableCell id={a?.isFav ? "isFav" : ""}>
                        {a.ENTERED_BY}
                      </TableCell>
                      {/* <TableCell id={a?.isFav ? "isFav" : ""}>
                        VerifiedBy
                      </TableCell>
                      <TableCell id={a?.isFav ? "isFav" : ""}>
                        PendingCycle
                      </TableCell> */}
                    </TableRow>
                  );
                })
              ) : (
                <></>
              )}{" "}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <br />

      <BaseFooter
        handleUpdateRows={handleUpdateRows}
        rows={pendingRows}
        handleViewAll={handleViewAll}
        handleRefresh={handleRefresh}
      />
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={snack.code ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {snack?.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Trn002_Footer;
