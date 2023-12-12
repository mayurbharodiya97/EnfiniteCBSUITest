//UI
import { Button, Toolbar, AppBar, Card } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CancelIcon from "@mui/icons-material/Cancel";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";

//Logical
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
} from "react";
import { useMutation, useQuery } from "react-query";
import { GeneralAPI } from "registry/fns/functions";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import "./footer.css";

const Footer = () => {
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AuthContext);
  const [trxOptions, setTrxOptions] = useState([]);
  const [trxOptions2, setTrxOptions2] = useState([]);
  const [sdcOptions, setSdcOptions] = useState([]);
  const [accTypeOptions, setAccTypeOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);

  const [isSave, setIsSave] = useState(false);

  let defaulVal = {
    branch: { label: "", value: "", info: "" },
    accType: { label: "", value: "", info: "" },
    accNo: "",
    trx: { label: "", value: "", code: "" },
    scroll: "",
    sdc: { label: "", value: "", info: "" },
    remark: "",
    cNo: 0,
    date: new Date().toISOString()?.substring(0, 10),
    debit: "0.00",
    credit: "0.00",
    vNo: 0,
    bug: true,
    isCredit: true,
  };

  const [rows, setRows] = useState([defaulVal]);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [diff, setDiff] = useState(0);

  const handleFilterTrx = () => {
    let result = trxOptions2?.filter((a) => a?.code == "3" || a?.code == "6");
    setTrxOptions(result);
  };

  useEffect(() => {
    setTempStore({ ...tempStore, accInfo: {} });
  }, []);

  useEffect(() => {
    console.log(rows, "rows");
    let i = 0;
    if (rows.length > 0) {
      i = rows.length - 1;
    }
    rows[i].bug = false;
    if (!rows[i].branch || !rows[i].accType || !rows[i].accNo) {
      rows[i].bug = true;
    }

    if (!rows[i].isCredit && (!rows[i].date || !rows[i].cNo)) {
      rows[i].bug = true;
    }

    let result = rows.some((a) => a.bug);
    setIsSave(!result);
    console.log("isSave", !result);
  }, [rows]);

  useEffect(() => {
    getBranchOptions.mutate(authState);
    getSdcOptions.mutate(authState);
    getAccTypeOptions.mutate(authState);
    getTrxOptions.mutate(authState);
  }, []);

  useEffect(() => {
    //accInfo api call onChange
    console.log("sssss");
    let data = {
      COMP_CD: rows[0]?.branch?.info?.COMP_CD,
      BRANCH_CD: rows[0]?.branch?.value,
      ACCT_TYPE: rows[0]?.accType?.value,
      ACCT_CD: rows[0]?.accNo,
      authState: authState,
    };

    if (rows[0]?.accNo && rows[0]?.accType?.value && rows[0]?.branch?.value) {
      console.log(rows[0]?.accNo, "rows[0]?.accNo");
    }
    rows[0]?.accNo &&
      rows[0]?.accType?.value &&
      rows[0]?.branch?.value &&
      getAccInfo.mutate(data);
  }, [rows[0]?.accNo, rows[0]?.accType?.value, rows[0]?.branch?.value]);

  const getBranchOptions = useMutation(API.getBranchList, {
    onSuccess: (data) => {
      setBranchOptions(data);
      console.log(data, "branch");
    },
    onError: (error) => {},
  });
  const getAccTypeOptions = useMutation(API.getAccTypeList, {
    onSuccess: (data) => {
      setAccTypeOptions(data);
    },
    onError: (error) => {},
  });

  const getSdcOptions = useMutation(API.getSDCList, {
    onSuccess: (data) => {
      setSdcOptions(data);
      const obj = [...rows];
      setRows(obj);
    },
    onError: (error) => {},
  });

  const getTrxOptions = useMutation(API.getTRXList, {
    onSuccess: (data) => {
      setTrxOptions2(data);
      setTrxOptions(data);

      console.log(data, "trx");
    },
    onError: (error) => {},
  });
  const getAccInfo = useMutation(API.getAccInfo, {
    onSuccess: (data) => {
      console.log(data[0], "accInfo");
      setTempStore({ ...tempStore, accInfo: data[0] });
    },
    onError: (error) => {},
  });
  const getAccInquiry = useMutation(API.getAccInquiry, {
    onSuccess: (data) => {
      console.log(data, "getAccInquiry");
    },
    onError: (error) => {},
  });

  const handleAddRow = () => {
    let cred = 0;
    let deb = 0;
    let trxx = { label: "1" };
    let isCred = true;
    if (totalDebit > totalCredit) {
      cred = totalDebit - totalCredit;
      trxx = trxOptions2[2];
      isCred = true;
    } else if (totalDebit < totalCredit) {
      deb = totalCredit - totalDebit;
      trxx = trxOptions2[5];
      isCred = false;
    }
    let tr = trxx.code + "   ";
    let defSdc = sdcOptions.find((a) => a?.value?.includes(tr));
    let defaulVal2 = {
      branch: "",
      trx: trxx,
      debit: deb?.toFixed(2),
      credit: cred?.toFixed(2),
      isCredit: isCred,
      date: new Date().toISOString()?.substring(0, 10),
      sdc: defSdc,
      remark: defSdc?.label,
    };

    if (isSave && totalDebit != totalCredit) {
      let obj = [...rows, defaulVal2];

      setRows(obj);
      handleTotal(obj);
    }
  };

  const handleClear = (e, i) => {
    let obj = [...rows];
    if (rows.length > 1) {
      obj.splice(i, 1);
      handleTotal(obj);
      setRows(obj);
    }
  };

  const handleTotal = (obj) => {
    let sumDebit = 0;
    let sumCredit = 0;

    obj?.map((data) => {
      sumDebit += Number(data.debit);
    });

    obj?.map((data) => {
      sumCredit += Number(data.credit);
    });

    setDiff(sumDebit - sumCredit);
    setTotalDebit(Number(sumDebit.toFixed(3)));
    setTotalCredit(Number(sumCredit.toFixed(3)));
  };

  const handleBranch = (e, value, i) => {
    console.log(value, "e branch");
    const obj = [...rows];
    obj[i].branch = value;
    setRows(obj);
    handleTotal(obj);
  };

  const handleTrx = (e, value, i) => {
    console.log(value, "e trx");
    const obj = [...rows];

    obj?.length == 1 &&
      (value?.code == "3" || value?.code == "6") &&
      handleFilterTrx();
    obj[i].trx = value;
    obj[i].credit = 0;
    obj[i].debit = 0;
    let tr = value.code + "   ";
    let defSdc = sdcOptions.find((a) => a?.value?.includes(tr));

    obj[i].sdc = defSdc;
    obj[i].remark = defSdc?.label;
    if (value?.code == "1" || value?.code == "2" || value?.code == "3") {
      obj[i].isCredit = true;
    } else {
      obj[i].isCredit = false;
    }

    setRows(obj);
    handleTotal(obj);
  };

  const handleDebit = (e, i) => {
    const obj = [...rows];
    obj[i].debit = e.target.value;
    setRows(obj);
    handleTotal(obj);
  };

  const handleCredit = (e, i) => {
    const obj = [...rows];
    obj[i].credit = e.target.value;
    setRows(obj);
    handleTotal(obj);
  };

  const handleDebitBlur = (e, i) => {
    const obj = [...rows];
    obj[i].debit = Number(e.target.value)?.toFixed(2);
    setRows(obj);
    totalDebit != totalCredit &&
      (obj[i].trx?.code == "3" || obj[i].trx?.code == "6") &&
      obj[i].credit != obj[i].debit &&
      handleAddRow();
  };
  const handleCreditBlur = (e, i) => {
    const obj = [...rows];
    obj[i].credit = Number(e.target.value)?.toFixed(2);
    setRows(obj);
    totalDebit != totalCredit &&
      (obj[i].trx?.code == "3" || obj[i].trx?.code == "6") &&
      obj[i].credit != obj[i].debit &&
      handleAddRow();
  };

  const handleReset = () => {
    setRows([defaulVal]);
    setTotalCredit(0);
    setTotalDebit(0);
    setTrxOptions(trxOptions2);
  };

  //simple fns
  const handleRemark = (e, i) => {
    console.log(e, "remark e");
    const obj = [...rows];
    obj[i].remark = e.target.value;
    setRows(obj);
  };
  const handleSdc = (e, value, i) => {
    console.log(e, "sdc e");
    const obj = [...rows];
    obj[i].sdc = value;
    console.log(value, "value");
    obj[i].remark = value.label;

    setRows(obj);
  };
  const handleVNo = (e, i) => {
    const obj = [...rows];
    obj[i].vNo = Number(e.target.value);
    setRows(obj);
  };
  const handleDate = (e, i) => {
    console.log(e, "date e");
    const obj = [...rows];
    obj[i].date = e.target.value;
    setRows(obj);
  };
  const handleCNo = (e, i) => {
    const obj = [...rows];
    obj[i].cNo = Number(e.target.value);
    setRows(obj);
  };

  const handleScroll = (e, i) => {
    const obj = [...rows];
    obj[i].scroll = e.target.value;
    setRows(obj);
  };

  const handleAccType = (e, value, i) => {
    const obj = [...rows];
    obj[i].accType = value;
    setRows(obj);
  };
  const handleAccNo = (e, i) => {
    const obj = [...rows];
    obj[i].accNo = e.target.value;
    setRows(obj);
    console.log(i, "i");
    // if (i == 0) {
    //   getAccInquiry.mutate(e.target.value);
    //   console.log("1111");
    // }
  };

  const [saveDialog, setSaveDialog] = useState(false);
  const closeSaveDialog = () => {
    setSaveDialog(false);
  };

  const handleSave = () => {
    console.log("saved");
    handleReset();
    setSaveDialog(false);
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
          <Table aria-label="caption table" padding="none">
            <caption>
              Total ( Debit:{totalDebit} | Credit:{totalCredit} )
            </caption>
            <TableHead>
              <TableRow>
                <TableCell>Branch</TableCell>
                <TableCell>A/C Type</TableCell>
                <TableCell>A/C No</TableCell>
                <TableCell>TRX</TableCell>
                <TableCell>Scroll</TableCell>
                <TableCell>SDC</TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell>Chq No</TableCell>
                <TableCell>Chq Date</TableCell>
                <TableCell>Debit</TableCell>
                <TableCell>Credit</TableCell>
                <TableCell>Vno.</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length > 0 ? (
                rows?.map((a, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell sx={{ minWidth: 160 }}>
                        <Autocomplete
                          value={a.branch}
                          size="small"
                          options={branchOptions}
                          onChange={(e, value) => handleBranch(e, value, i)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={a.branch?.value ? false : true}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 160 }}>
                        <Autocomplete
                          value={a.accType}
                          size="small"
                          options={accTypeOptions}
                          onChange={(e, value) => handleAccType(e, value, i)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={a.accType?.value ? false : true}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 50 }}>
                        <TextField
                          value={a.accNo}
                          error={a.accNo ? false : true}
                          id="txtRight"
                          size="small"
                          type="number"
                          onChange={(e) => handleAccNo(e, i)}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 160 }}>
                        <Autocomplete
                          value={a.trx}
                          size="small"
                          id="combo-box-demo"
                          options={trxOptions}
                          onChange={(e, value) => handleTrx(e, value, i)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={a.trx?.value ? false : true}
                            />
                          )}
                        />
                      </TableCell>

                      <TableCell sx={{ minWidth: 50 }}>
                        <TextField
                          value={a.scroll}
                          disabled={a?.trx?.code == "4" ? false : true}
                          size="small"
                          onChange={(e) => handleScroll(e, i)}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 160 }}>
                        <Autocomplete
                          id="sdc"
                          size="small"
                          options={sdcOptions}
                          value={a.sdc}
                          onChange={(e, value) => handleSdc(e, value, i)}
                          renderInput={(params) => (
                            <TextField {...params} label="" />
                          )}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 80 }}>
                        <TextField
                          value={a.remark}
                          size="small"
                          onChange={(e) => handleRemark(e, i)}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 50 }}>
                        <TextField
                          value={a.cNo}
                          error={
                            !a.isCredit && (a.cNo == 0 || !a.cNo) ? true : false
                          }
                          id="txtRight"
                          disabled={
                            a?.trx?.code == "4" ||
                            a?.trx?.code == "5" ||
                            a?.trx?.code == "6"
                              ? false
                              : true
                          }
                          size="small"
                          type="number"
                          onChange={(e) => handleCNo(e, i)}
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          value={a.date}
                          error={a.isCredit && !a.date ? true : false}
                          type="date"
                          disabled={
                            a?.trx?.code == "4" ||
                            a?.trx?.code == "5" ||
                            a?.trx?.code == "6"
                              ? false
                              : true
                          }
                          size="small"
                          onChange={(e) => handleDate(e, i)}
                        />{" "}
                      </TableCell>
                      <TableCell sx={{ minWidth: 50 }}>
                        <TextField
                          value={a.debit}
                          id="txtRight"
                          size="small"
                          disabled={
                            a?.isCredit || !a.branch || !a.trx?.code
                              ? true
                              : false
                          }
                          type="number"
                          onChange={(e) => handleDebit(e, i)}
                          onBlur={(e) => handleDebitBlur(e, i)}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 50 }}>
                        <TextField
                          value={a.credit}
                          id="txtRight"
                          size="small"
                          disabled={
                            !a?.isCredit || !a.branch || !a.trx?.code
                              ? true
                              : false
                          }
                          type="number"
                          onChange={(e) => handleCredit(e, i)}
                          onBlur={(e) => handleCreditBlur(e, i)}
                        />
                      </TableCell>

                      <TableCell sx={{ minWidth: 40 }}>
                        <TextField
                          value={a.vNo}
                          id="txtRight"
                          disabled={true}
                          size="small"
                          type="number"
                          onChange={(e) => handleVNo(e, i)}
                        />
                      </TableCell>
                      <TableCell>
                        {(rows[i].trx?.code == "3" ||
                          rows[i].trx?.code == "6") && (
                          <CancelIcon
                            onClick={(e) => handleClear(e, i)}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <>no records</>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <br /> <br />
      {(rows[0]?.trx?.code == "3" || rows[0]?.trx?.code == "6") && (
        <>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleAddRow()}
          >
            add new
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleReset()}
          >
            reset
          </Button>
        </>
      )}
      {isSave && (
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setSaveDialog(true)}
        >
          save
        </Button>
      )}
      {/* <Button
        variant="outlined"
        color="secondary"
        onClick={() => handleGetAccInfo()}
      >
        fetch accInfo
      </Button> */}
      <br /> <br />
      <Grid container spacing={2}>
        <Grid item>
          <Button variant="contained" color="primary">
            View All
          </Button>
        </Grid>{" "}
        <Grid item>
          <Button variant="contained" color="primary">
            Search
          </Button>
        </Grid>{" "}
        <Grid item>
          <Button variant="contained" color="primary">
            Calculator
          </Button>
        </Grid>{" "}
        <Grid item>
          <Button variant="contained" color="primary">
            Query
          </Button>
        </Grid>{" "}
        <Grid item>
          <Button variant="contained" color="primary">
            Delete
          </Button>
        </Grid>{" "}
        <Grid item>
          <Button variant="contained" color="primary">
            refresh
          </Button>{" "}
        </Grid>{" "}
        <Grid item>
          <Button variant="contained" color="primary">
            scroll search
          </Button>{" "}
        </Grid>{" "}
        <Grid item>
          <Button variant="contained" color="primary">
            scroll del
          </Button>{" "}
        </Grid>{" "}
        <Grid item>
          <Button variant="contained" color="primary">
            other a/c
          </Button>
        </Grid>{" "}
        <Grid item>
          <Button variant="contained" color="primary">
            other Tx Detail
          </Button>
        </Grid>{" "}
      </Grid>{" "}
      <br />
      <Dialog
        open={saveDialog}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Do you wish to save this scroll?
        </DialogTitle>

        <DialogActions>
          <Button color="secondary" onClick={closeSaveDialog}>
            Cancel
          </Button>
          <Button color="success" onClick={handleSave} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Footer;
