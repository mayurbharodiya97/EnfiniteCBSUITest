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
import Paper from "@mui/material/Paper";
import CancelIcon from "@mui/icons-material/Cancel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import InputBase from "@mui/material/InputBase";
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
import BaseFooter from "./BaseFooter";

const Footer = () => {
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AuthContext);

  let defBranch = {
    label: authState?.user?.branchCode + "-" + authState?.user?.branch,
    value: authState?.user?.branchCode,
    info: { COMP_CD: authState?.companyID },
  };

  let defaulVal = {
    branch: defBranch,
    accType: { label: "", value: "", info: "" },
    accNo: "",
    trx: { label: "", value: "", code: "" },
    scroll: "", //token
    sdc: { label: "", value: "", info: "" },
    remark: "",
    cNo: "0",
    date: new Date().toISOString()?.substring(0, 10),
    debit: "0.00",
    credit: "0.00",
    vNo: "",
    bug: true,
    bugChq: false,
    isCredit: true,
  };

  const [rows, setRows] = useState([defaulVal]);
  const [trxOptions, setTrxOptions] = useState([]);
  const [trxOptions2, setTrxOptions2] = useState([]);
  const [sdcOptions, setSdcOptions] = useState([]);
  const [accTypeOptions, setAccTypeOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [isSave, setIsSave] = useState(false);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [diff, setDiff] = useState(0);
  const [saveDialog, setSaveDialog] = useState(false);
  const [resetDialog, setResetDialog] = useState(false);
  const [isArray, setIsArray] = useState(false);
  const [errMsg, setErrMsg] = useState({ cNo: {}, accNo: {} });
  const [index, setIndex] = useState(0);

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
    if (
      !rows[i].trx?.code ||
      !rows[i].branch ||
      !rows[i].accType ||
      !rows[i].accNo
    ) {
      rows[i].bug = true;
    }

    if (!rows[i].isCredit && (!rows[i].date || !rows[i].cNo)) {
      rows[i].bug = true;
    }

    if (rows[i]?.isCredit && !Number(rows[i]?.credit) > 0) {
      rows[i].bug = true;
    }
    if (!rows[i]?.isCredit && !Number(rows[i]?.debit) > 0) {
      rows[i].bug = true;
    }

    if (rows[i]?.trx?.code == "4" && !rows[i]?.scroll) {
      rows[i].bug = true;
    }
    if (!rows[i]?.isCredit && rows[i]?.bugChq) {
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

  const getBranchOptions = useMutation(API.getBranchList, {
    onSuccess: (data) => {
      setBranchOptions(data);
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
    },
    onError: (error) => {},
  });

  const getAccInfo = useMutation(API.getAccInfo, {
    onSuccess: (data) => {
      console.log(data, "accInfo");
      setTempStore({ ...tempStore, accInfo: data });
    },
    onError: (error) => {},
  });
  const addScroll = useMutation(API.addDailyTrxScroll, {
    onSuccess: (data) => {
      console.log(data, "save scroll api");
    },
    onError: (error) => {},
  });
  const getChqValidation = useMutation(API.getChqValidation, {
    onSuccess: (data) => {
      console.log(data, "getChqValidation api");
      if (data.ERR_CODE == "-1") {
        rows[index].bug = true;
        rows[index].bugChq = true;
      }
      setErrMsg(data);
    },
    onError: (error) => {},
  });
  const getScrollListF2 = useMutation(API.getScrollListF2, {
    onSuccess: (data) => {
      console.log(data, "getScrollListF2 api");
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
    let tr = trxx?.code + "   ";
    let defSdc = sdcOptions.find((a) => a?.value?.includes(tr));

    let defaulVal2 = {
      branch: defBranch,
      accType: { label: "", value: "", info: "" },
      accNo: "",
      trx: trxx,
      scroll: "", //token
      sdc: defSdc,
      remark: defSdc?.label,
      cNo: "0",
      date: new Date().toISOString()?.substring(0, 10),
      debit: deb?.toFixed(2),
      credit: cred?.toFixed(2),
      vNo: "",
      bugChq: false,
      isCredit: isCred,
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

      rows.map((a) => {
        if (!a.bug) {
          setErrMsg({});
        }
      });
      setRows(obj);
    }
  };

  const handleTotal = (obj) => {
    let sumDebit = 0;
    let sumCredit = 0;

    obj?.map((a) => {
      sumDebit += Number(a.debit);
    });

    obj?.map((a) => {
      sumCredit += Number(a.credit);
    });

    setDiff(sumDebit - sumCredit);
    setTotalDebit(Number(sumDebit.toFixed(3)));
    setTotalCredit(Number(sumCredit.toFixed(3)));
  };

  const handleReset = () => {
    setRows([defaulVal]);
    setTotalCredit(0);
    setTotalDebit(0);
    setTrxOptions(trxOptions2);
    setResetDialog(false);
  };

  const handleScrollSave = () => {
    // handleReset();
    addScroll.mutate(rows);
    setSaveDialog(false);
  };

  const handleFilterTrx = () => {
    let result = trxOptions2?.filter((a) => a?.code == "3" || a?.code == "6");
    setTrxOptions(result);
  };

  const handleGetAccInfo = (i) => {
    let data = {
      COMP_CD: rows[i]?.branch?.info?.COMP_CD,
      BRANCH_CD: rows[i]?.branch?.value,
      ACCT_TYPE: rows[i]?.accType?.value,
      ACCT_CD: rows[i]?.accNo,
      authState: authState,
    };

    rows[i]?.accNo &&
      rows[i]?.accType?.value &&
      rows[i]?.branch?.value &&
      getAccInfo.mutate(data);
  };

  //TABLE FNs
  const handleBranch = (e, value, i) => {
    const obj = [...rows];
    obj[i].branch = value;
    setRows(obj);
    handleTotal(obj);
    handleGetAccInfo(i);
    getScrollListF2.mutate(rows[0]);
  };
  const handleAccType = (e, value, i) => {
    const obj = [...rows];
    obj[i].accType = value;
    setRows(obj);
    handleGetAccInfo(i);
  };
  const handleAccNo = (e, i) => {
    const obj = [...rows];
    let txt = e.target.value;

    obj[i].accNo = txt;
    setRows(obj);
  };
  const handleAccNoBlur = (e, i) => {
    const obj = [...rows];
    let abc = obj[i]?.accNo?.padStart(6, "0");
    obj[i].accNo = abc;
    handleGetAccInfo(i);
    setRows(obj);
  };

  const handleTrx = (e, value, i) => {
    const obj = [...rows];

    obj?.length == 1 &&
      (value?.code == "3" || value?.code == "6") &&
      handleFilterTrx();
    obj[i].trx = value;
    obj[i].credit = "0.00";
    obj[i].debit = "0.00";
    obj[i].cNo = "0";
    obj[i].bugChq = false;
    setErrMsg({});

    obj[i].scroll = "";
    let tr = value?.code + "   ";
    let defSdc = sdcOptions.find((a) => a?.value?.includes(tr));

    obj[i].sdc = defSdc;
    obj[i].remark = defSdc?.label;
    if (value?.code == "1" || value?.code == "2" || value?.code == "3") {
      obj[i].isCredit = true;
    } else {
      obj[i].isCredit = false;
    }

    if (value?.code == "3" || value?.code == "6") {
      setIsArray(true);
    }
    setRows(obj);
    handleTotal(obj);
  };
  const handleScroll = (e, i) => {
    const obj = [...rows];
    obj[i].scroll = e.target.value;
    setRows(obj);
  };
  const handleSdc = (e, value, i) => {
    const obj = [...rows];
    obj[i].sdc = value;
    obj[i].remark = value.label;

    setRows(obj);
  };
  const handleRemark = (e, i) => {
    const obj = [...rows];
    obj[i].remark = e.target.value;
    setRows(obj);
  };

  const handleCNo = (e, i) => {
    setErrMsg({ ...errMsg, cNo: {} });
    const obj = [...rows];
    let txt = e.target.value;
    obj[i].cNo = txt;
    if (Number(txt) > 0) {
      obj[i].bugChq = true;
      txt &&
        obj[i].accNo &&
        obj[i].accType.value &&
        obj[i].branch.value &&
        getChqValidation.mutate(obj[i]);
    } else {
      obj[i].bugChq = false;
    }
    setRows(obj);
    setIndex(i);
  };
  const handleCNoBlur = (e, i) => {
    const obj = [...rows];
    // getChqValidation.mutate(obj[i]);
  };

  const handleDate = (e, i) => {
    console.log(e, "date e");
    const obj = [...rows];
    obj[i].date = e.target.value;
    setRows(obj);
  };

  const handleDebit = (e, i) => {
    const obj = [...rows];
    let txt = e.target.value;
    if (txt.includes(".")) {
      let a = txt?.split(".")[0];
      let b = txt?.split(".")[1];
      let c = b?.substring(0, 2);
      obj[i].debit = a + "." + c;
    } else {
      obj[i].debit = txt;
    }
    setRows(obj);
    handleTotal(obj);
  };

  const handleCredit = (e, i) => {
    const obj = [...rows];
    let txt = e.target.value;
    if (txt.includes(".")) {
      let a = txt?.split(".")[0];
      let b = txt?.split(".")[1];
      let c = b?.substring(0, 2);
      obj[i].credit = a + "." + c;
    } else {
      obj[i].credit = txt;
    }

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

  const handleVNo = (e, i) => {
    const obj = [...rows];
    obj[i].vNo = e.target.value;
    setRows(obj);
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
            <caption style={{ fontWeight: "600" }}>
              Total ( Debit:{totalDebit} | Credit:{totalCredit} )
            </caption>
            <caption style={{ fontSize: "15px", color: "#ea3a1b" }}>
              {errMsg && errMsg?.ERR_MSG}
            </caption>
            <TableHead>
              <TableRow>
                <TableCell>Branch</TableCell>
                <TableCell>A/C Type</TableCell>
                <TableCell>A/C No</TableCell>
                <TableCell>TRX</TableCell>
                <TableCell>Token</TableCell>
                <TableCell>SDC</TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell>Chq No</TableCell>
                <TableCell>Chq Date</TableCell>
                <TableCell>Debit</TableCell>
                <TableCell>Credit</TableCell>
                <TableCell>Vno.</TableCell>
                <TableCell style={{ border: "0px" }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length > 0 ? (
                rows?.map((a, i) => {
                  return (
                    <>
                      <TableRow key={i}>
                        <TableCell
                          sx={{ minWidth: 160 }}
                          id={a?.isFav ? "isFav" : ""}
                        >
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
                        <TableCell
                          sx={{ minWidth: 160 }}
                          id={a?.isFav ? "isFav" : ""}
                        >
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
                        <TableCell
                          sx={{ minWidth: 50 }}
                          id={a?.isFav ? "isFav" : ""}
                        >
                          <TextField
                            value={a.accNo}
                            error={a.accNo ? false : true}
                            size="small"
                            type="number"
                            onChange={(e) => handleAccNo(e, i)}
                            onBlur={(e) => handleAccNoBlur(e, i)}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ minWidth: 160 }}
                          id={a?.isFav ? "isFav" : ""}
                        >
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

                        <TableCell
                          sx={{ minWidth: 50 }}
                          id={a?.isFav ? "isFav" : ""}
                        >
                          <TextField
                            value={a.scroll}
                            type="number"
                            error={
                              !a.scroll && a.trx?.code == "4" ? true : false
                            }
                            disabled={a?.trx?.code == "4" ? false : true}
                            size="small"
                            onChange={(e) => handleScroll(e, i)}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ minWidth: 160 }}
                          id={a?.isFav ? "isFav" : ""}
                        >
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
                        <TableCell
                          sx={{ minWidth: 80 }}
                          id={a?.isFav ? "isFav" : ""}
                        >
                          <TextField
                            value={a.remark}
                            size="small"
                            onChange={(e) => handleRemark(e, i)}
                          />
                        </TableCell>

                        <TableCell
                          sx={{ minWidth: 50 }}
                          id={a?.isFav ? "isFav" : ""}
                        >
                          <TextField
                            value={a.cNo}
                            error={!a.cNo || a.bugChq ? true : false}
                            id="txtRight"
                            disabled={!a.isCredit ? false : true}
                            size="small"
                            type="number"
                            onChange={(e) => handleCNo(e, i)}
                            onBlur={(e) => handleCNoBlur(e, i)}
                          />
                        </TableCell>

                        <TableCell id={a?.isFav ? "isFav" : ""}>
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
                        <TableCell
                          sx={{ minWidth: 50 }}
                          id={a?.isFav ? "isFav" : ""}
                        >
                          <TextField
                            value={a.debit}
                            error={Number(a.debit > 0) ? false : true}
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
                        <TableCell
                          sx={{ minWidth: 50 }}
                          id={a?.isFav ? "isFav" : ""}
                        >
                          <TextField
                            value={a.credit}
                            error={Number(a.credit > 0) ? false : true}
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

                        <TableCell
                          sx={{ minWidth: 40 }}
                          id={a?.isFav ? "isFav" : ""}
                        >
                          <TextField
                            value={a.vNo}
                            id="txtRight"
                            disabled={true}
                            size="small"
                            onChange={(e) => handleVNo(e, i)}
                          />
                        </TableCell>
                        <TableCell style={{ border: "0px" }}>
                          {(rows[i].trx?.code == "3" ||
                            rows[i].trx?.code == "6") && (
                            <CancelIcon
                              onClick={(e) => handleClear(e, i)}
                              style={{ cursor: "pointer" }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })
              ) : (
                <></>
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
            sx={{ margin: "8px" }}
            onClick={() => handleAddRow()}
          >
            <AddIcon /> new row
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setResetDialog(true)}
          >
            <RestartAltIcon /> reset
          </Button>
        </>
      )}
      {(isArray && diff == 0 && isSave) || (!isArray && isSave) ? (
        <Button
          variant="contained"
          color="secondary"
          sx={{ margin: "8px" }}
          onClick={() => setSaveDialog(true)}
        >
          save
        </Button>
      ) : (
        <></>
      )}
      <Button
        variant="contained"
        color="secondary"
        sx={{ margin: "8px" }}
        onClick={() => setSaveDialog(true)}
      >
        save
      </Button>
      <br />
      <BaseFooter />
      <br />
      <>
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
            <Button variant="contained" onClick={() => setSaveDialog(false)}>
              Cancel
            </Button>
            <Button
              color="success"
              variant="contained"
              onClick={handleScrollSave}
              autoFocus
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={resetDialog}
          maxWidth={"lg"}
          // onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Do you wish to reset ?
          </DialogTitle>

          <DialogActions>
            <Button onClick={() => setResetDialog(false)} variant="contained">
              No
            </Button>
            <Button
              color="warning"
              variant="contained"
              onClick={handleReset}
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </>
  );
};

export default Footer;
