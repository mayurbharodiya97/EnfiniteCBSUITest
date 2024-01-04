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
import SearchIcon from "@mui/icons-material/Search";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

//logic
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
} from "react";
import { useMutation, useQuery } from "react-query";
import { GeneralAPI } from "registry/fns/functions";
import { AuthContext } from "pages_audit/auth";
import "./CommonFooter.css";
import { useLocation } from "react-router-dom";
import * as API from "./api";
import { useSnackbar } from "notistack";
import { AccDetailContext } from "pages_audit/auth";

export const CommonFooter = ({
  tableRows,
  handleUpdateRows,
  handleViewAll,
  handleRefresh,
  handleViewQueryData,
}) => {
  let defaulVal = {
    column: { value: "ACCT_CD", label: "A/C No" },
    operator: { value: "Equals", label: "Equals" },
    value: "",
    logic: { value: "OR", label: "OR" },
  };
  const [rows, setRows] = useState<any>([defaulVal]);
  const [queryDialog, setQueryDialog] = useState(false);
  const [scrollDialog, setScrollDialog] = useState(false);
  const [scrollNo, setScrollNo] = useState("");

  const loc = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);

  const columnOptions = [
    { label: "A/C No", value: "ACCT_CD" },
    { label: "Branch", value: "BRANCH_CD" },
    { label: "Voucher", value: "TRAN_CD" },
    { label: "Scroll", value: "SCROLL1" },
    { label: "Remarks", value: "REMARKS" },
    { label: "TRX", value: "TYPE_CD" },
    { label: "SDC", value: "SDC" },
    { label: "A/C Type", value: "ACCT_TYPE" },
  ];
  const operatorOptions = [
    { value: "Equals", label: "Equals" },
    { value: "Less Than", label: "Less Than" },
    { value: "Greater Than", label: "Greater Than" },
    { value: "Doesnot Equal", label: "Doesnot Equal" },
    { value: "Like", label: "Like" },
  ];
  const logicOptions = [
    { value: "AND", label: "AND" },
    { value: "OR", label: "OR" },
  ];

  useEffect(() => {
    console.log(rows, "rows");
  }, [rows]);

  //api define
  const getQueryData = useMutation(API.getQueryData, {
    onSuccess: (data) => {
      setQueryDialog(false);
      setTempStore({ ...tempStore, queryRows: data });
      handleViewQueryData();
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });
  const deleteScroll = useMutation(API.deleteScroll, {
    onSuccess: (data: any) => {
      console.log(data, "ddd");
      setScrollDialog(false);
      setScrollNo("");
      handleRefresh();
      enqueueSnackbar("scroll deleted", {
        variant: "success",
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });

  const handleColumn = (e, value, i) => {
    const obj = [...rows];
    obj[i].column = value;
    setRows(obj);
  };
  const handleOperator = (e, value, i) => {
    const obj = [...rows];
    obj[i].operator = value;
    setRows(obj);
  };
  const handleLogic = (e, value, i) => {
    const obj = [...rows];
    obj[i].logic = value;
    setRows(obj);
  };
  const handleValue = (e, i) => {
    const obj = [...rows];
    let txt = e.target.value;
    if (obj[i].column.value == "ACCT_CD") {
      obj[i].value = txt.padStart(6, "0");
    } else {
      obj[i].value = txt;
    }
    setRows(obj);
  };

  const handleAddRow = () => {
    let obj = [...rows, defaulVal];
    setRows(obj);
  };

  const handleClear = (e, i) => {
    let obj = [...rows];
    if (rows.length > 1) {
      obj.splice(i, 1);
      setRows(obj);
    }
  };

  const handleReset = () => {
    setRows([defaulVal]);
  };

  const handleSaveQuery = () => {
    let arr = rows.map((a) => {
      return {
        [a.column.value]: a.value,
        OPERATOR: a.operator.value,
        LOGICAL_VALUE: a.logic.value,
      };
    });

    let data = { COMP_CD: authState?.companyID, SELECT_COLUMN: arr };
    let err = rows.some((a) => !a.logic.value);
    console.log(err, "err");
    !err && getQueryData.mutate(data);
  };

  const handleClose = () => {
    handleReset();
    setQueryDialog(false);
  };
  const handleDeleteScroll = () => {
    let data = { COMP_CD: authState.companyID, SCROLL_NO: scrollNo };
    scrollNo && deleteScroll.mutate(data);
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        style={{ marginTop: "5px", marginBottom: "15px" }}
      >
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleViewAll()}
          >
            View All
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleRefresh()}
          >
            refresh
          </Button>
        </Grid>
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
            onClick={() => setScrollDialog(true)}
          >
            Scroll Delete
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setQueryDialog(true)}
          >
            Query
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary">
            Other Trx
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary">
            Positive Pay
          </Button>
        </Grid>
      </Grid>
      <br />

      <Dialog
        maxWidth="md"
        open={queryDialog}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Query</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table aria-label="simple table" padding={"none"}>
              <TableHead>
                <TableRow id="topHead">
                  <TableCell id="head">Column</TableCell>
                  <TableCell id="head">Operator</TableCell>
                  <TableCell id="head">Value</TableCell>
                  <TableCell id="head">Logic</TableCell>
                </TableRow>
              </TableHead>

              {rows &&
                rows?.map((a, i) => {
                  return (
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ minWidth: 160 }}>
                          <Autocomplete
                            value={a.column}
                            autoHighlight
                            size="small"
                            options={columnOptions}
                            onChange={(e, value) => handleColumn(e, value, i)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={a.column?.value ? false : true}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 160 }}>
                          <Autocomplete
                            value={a.operator}
                            autoHighlight
                            size="small"
                            options={operatorOptions}
                            onChange={(e, value) => handleOperator(e, value, i)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={a.operator?.value ? false : true}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 50 }}>
                          <TextField
                            value={a.value}
                            error={!a.value ? true : false}
                            size="small"
                            onChange={(e) => handleValue(e, i)}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 160 }}>
                          <Autocomplete
                            value={a.logic}
                            autoHighlight
                            size="small"
                            options={logicOptions}
                            onChange={(e, value) => handleLogic(e, value, i)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={a.logic?.value ? false : true}
                              />
                            )}
                          />
                        </TableCell>

                        <TableCell style={{ border: "0px", width: "10px" }}>
                          <Button
                            color="secondary"
                            onClick={(e) => handleClear(e, i)}
                            size="small"
                          >
                            <CancelIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  );
                })}
            </Table>
          </TableContainer>
        </DialogContent>
        <div className="dialogFooter">
          {" "}
          <div>
            <Button variant="contained" onClick={() => handleAddRow()}>
              <AddIcon /> new row
            </Button>
            <Button
              style={{ marginLeft: "8px" }}
              variant="outlined"
              color="secondary"
              onClick={() => handleReset()}
            >
              <RestartAltIcon /> reset
            </Button>
          </div>
          <div>
            {" "}
            <Button variant="contained" onClick={() => handleClose()}>
              Cancel
            </Button>
            <Button
              style={{ marginLeft: "8px" }}
              color="secondary"
              variant="contained"
              onClick={handleSaveQuery}
              autoFocus
            >
              Save
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        maxWidth="md"
        open={scrollDialog}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Scroll Delete</DialogTitle>
        <DialogContent>
          <TextField
            value={scrollNo}
            placeholder="Enter ScrollNo"
            id="txtRight"
            size="small"
            type="number"
            onChange={(e) => setScrollNo(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setScrollDialog(false)} variant="contained">
            Cancel
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={handleDeleteScroll}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
