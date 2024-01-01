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
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
//date
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
//Logic
import { useSnackbar } from "notistack";
import { format } from "date-fns";

import React, { useEffect, useState, useCallback, useContext } from "react";
import { useMutation, useQuery } from "react-query";
import { GeneralAPI } from "registry/fns/functions";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import "./Trn001_Footer.css";
import BaseFooter from "./BaseFooter";
import TRN001_Table from "./Table";

const Trn001_footer = () => {
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AuthContext);
  var defBranch = {
    label: authState?.user?.branchCode + "-" + authState?.user?.branch,
    value: authState?.user?.branchCode,
    info: { COMP_CD: authState?.companyID },
  };
  var defaulVal = {
    branch: defBranch,
    accType: { label: "", value: "", info: "" },
    accNo: "",
    trx: { label: "", value: "", code: "" }, //TYPE_CD
    scroll: "0", //token
    sdc: { label: "", value: "", info: "" },
    remark: "",
    cNo: "0",
    date: new Date().toISOString()?.substring(0, 10),
    debit: "0.00",
    credit: "0.00",
    vNo: "", //TRAN_CD
    bug: true,
    bugChq: false,
    isCredit: true,
    viewOnly: false,
  };

  //states define
  const [rows, setRows] = useState<any>([defaulVal]);
  const [rows2, setRows2] = useState([]);
  const [trxOptions, setTrxOptions] = useState([]);
  const [trxOptions2, setTrxOptions2] = useState<any>([]);
  const [sdcOptions, setSdcOptions] = useState<any>([]);
  const [accTypeOptions, setAccTypeOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [isSave, setIsSave] = useState(false);
  const [diff, setDiff] = useState(0);
  const [isArray, setIsArray] = useState(false);
  const [errMsg, setErrMsg] = useState({ cNo: "", accNo: "" });
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resetDialog, setResetDialog] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [saveDialog, setSaveDialog] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  format(new Date(), "dd/MMM/yyyy");

  useEffect(() => {
    setTempStore({ ...tempStore, accInfo: {} });
  }, []);

  useEffect(() => {
    console.log(loading, "loading trn001");
  }, [loading]);

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

    if (rows[i]?.isCredit && !(Number(rows[i]?.credit) > 0)) {
      rows[i].bug = true;
    }
    if (!rows[i]?.isCredit && !(Number(rows[i]?.debit) > 0)) {
      rows[i].bug = true;
    }

    if (rows[i]?.trx?.code == "4" && !rows[i]?.scroll) {
      rows[i].bug = true;
    }
    if (!rows[i]?.isCredit && rows[i].bugChq) {
      rows[i].bug = true;
    }

    let result = rows && rows.some((a) => a?.bug);
    setIsSave(!result);
  }, [rows]);

  useEffect(() => {
    getBranchOptions.mutate(authState);
    getSdcOptions.mutate(authState);
    getAccTypeOptions.mutate(authState);
    getTrxOptions.mutate(authState);
  }, []);

  //api define ============================================================
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
      setLoading(false);
      setTempStore({ ...tempStore, accInfo: data });
      if (data.STATUS == "C") {
        console.log("c1");
        setErrMsg({
          ...errMsg,
          accNo: data.ACCT_CD_NEW + " Account Closed!",
        });
        rows[index].bug = true;
      } else if (data.STATUS == "U") {
        console.log("c2");
        setErrMsg({
          ...errMsg,
          accNo: data.ACCT_CD_NEW + " Account Unclaimed!",
        });
        rows[index].bug = true;
      } else if (!data || data?.length == 0) {
        console.log("c3");
        setErrMsg({
          ...errMsg,
          accNo: "No record found for given A/C type & A/C No",
        });
        rows[index].bug = true;
      } else {
        setErrMsg({ ...errMsg, accNo: "" });
      }
    },
    onError: (error) => {
      setLoading(false);

      enqueueSnackbar("Error Fetching Account Info", {
        variant: "error",
      });
    },
  });

  const saveScroll = useMutation(API.addDailyTrxScroll, {
    onSuccess: (data) => {
      setLoading(false);
      console.log(data, "data");
      if (data[0]?.TRAN_CD) {
        let msg = "VoucherNo: " + data[0]?.TRAN_CD;
        enqueueSnackbar(msg, {
          variant: "success",
        });
        handleReset();
      }
    },
    onError: (error: any) => {
      console.log(error, "error");
      setLoading(false);
      enqueueSnackbar(error?.error_msg, {
        // enqueueSnackbar("scroll saving error", {
        variant: "error",
      });
    },
  });
  const getChqValidation = useMutation(API.getChqValidation, {
    onSuccess: (data) => {
      if (data.ERR_CODE == "-1") {
        rows[index].bug = true;
        rows[index].bugChq = true;
        setErrMsg({ ...errMsg, cNo: data?.ERR_MSG });
      }
    },
    onError: (error) => {},
  });

  const getTRN001List = useMutation(API.getTRN001List, {
    onSuccess: (data) => {
      setRows2(data);
    },
    onError: (error) => {},
  });

  //TABLE FNs ===============================================================
  const handleBranch = (e, value, i) => {
    const obj = [...rows];
    obj[i].branch = value;
    setRows(obj);
    handleTotal(obj);
    handleGetAccInfo(i);
  };

  const handleAccType = (e, value, i) => {
    const obj = [...rows];
    obj[i].accType = value;
    setRows(obj);
    handleGetAccInfo(i);
  };

  const handleAccNo = (e, i) => {
    setIndex(i);
    const obj = [...rows];
    let txt = e.target.value;
    obj[i].accNo = txt;
    setRows(obj);
    setErrMsg({ ...errMsg, accNo: "" });
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
    let tr = value?.code + "   ";
    let defSdc = sdcOptions.find((a) => a?.value?.includes(tr));

    obj?.length == 1 &&
      (value?.code == "3" || value?.code == "6") &&
      handleFilterTrx();

    obj[i].trx = value;
    obj[i].credit = "0.00";
    obj[i].debit = "0.00";
    obj[i].cNo = "0";
    obj[i].bugChq = false;
    obj[i].scroll = "0";
    obj[i].sdc = defSdc;
    obj[i].remark = defSdc?.label;

    if (value?.code == "1" || value?.code == "2" || value?.code == "3") {
      obj[i].isCredit = true;
    } else {
      obj[i].isCredit = false;
    }

    if (value?.code == "3" || value?.code == "6") {
      setIsArray(true);
    } else {
      setIsArray(false);
    }
    setErrMsg({ ...errMsg, cNo: "" });
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
    setErrMsg({ ...errMsg, cNo: "" });
    const obj = [...rows];
    let txt = e.target.value;
    obj[i].cNo = txt;
    if (Number(txt) > 0) {
      obj[i].bugChq = true;
      txt &&
        obj[i].accNo &&
        obj[i].accType?.value &&
        obj[i].branch?.value &&
        getChqValidation.mutate(obj[i]);
    } else {
      obj[i].bugChq = false;
    }
    setRows(obj);
    setIndex(i);
  };

  const handleDate = (e, i) => {
    console.log(e, "date e");
    const obj = [...rows];
    obj[i].date = e.target?.value;
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
  //=====================================================================
  const handleAddRow = () => {
    let cred = 0;
    let deb = 0;
    let trxx = { label: "1", code: "" };
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
      scroll: "0", //token
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
    if (
      isSave &&
      totalDebit != totalCredit &&
      errMsg?.accNo == "" &&
      errMsg?.cNo == ""
    ) {
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
    setViewOnly(false);
    setTempStore({ ...tempStore, accInfo: {} });
  };

  const handleFilterTrx = () => {
    //to limit the trxOptions on 3,6
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
    if (rows[i]?.accNo && rows[i]?.accType?.value && rows[i]?.branch?.value) {
      setLoading(true);
      getAccInfo.mutate(data);
    }
  };

  const handleSaveDialog = () => {
    if (
      errMsg.accNo ||
      errMsg.cNo ||
      !isSave ||
      (!isArray && diff == 0) ||
      (isArray && diff != 0)
    ) {
    } else {
      setSaveDialog(true);
    }
  };

  const handleScrollSave = () => {
    setLoading(true);

    let arr = rows.map((a) => {
      return {
        BRANCH_CD: authState?.user?.branchCode,
        COMP_CD: authState?.companyID,
        ACCT_TYPE: a.accType?.value,
        ACCT_CD: a.accNo.padStart(6, "0").padEnd(20, " "),
        REMARKS: a.remark,
        CHEQUE_NO: a.cNo ? a.cNo : "0",
        TYPE_CD: a.trx.code + "   ",
        TRAN_DT: Date(),
        VALUE_DT: Date(),
        ENTERED_BRANCH_CD: a.branch?.value,
        ENTERED_COMP_CD: a.branch?.info.COMP_CD,
        SDC: a.sdc.value,
        AMOUNT: a.isCredit ? a.credit : a.debit,
        SCROLL1: a.scroll ? a.scroll : "0",
        CURRENCY_CD: "00  ",
        CONFIRMED: "0",
      };
    });
    saveScroll.mutate(arr);
    setSaveDialog(false);
  };
  const handleUpdateRows = (data) => {
    //to apply filter from baseFooter
    console.log(data, "databaseFooter");
    setRows2(data);
  };

  const handleGetTRN001List = () => {
    let data = {
      COMP_CD: authState?.companyID,
      BRANCH_CD: authState?.user?.branchCode,
    };
    getTRN001List.mutate(data);
    setViewOnly(true);
  };

  return (
    <>
      <Card
        sx={{
          boxShadow: "0px 1px 4px -1px #999999",
          borderRadius: "5px",
          padding: "8px",
          margin: "4px",
          marginBottom: "10px",
        }}
      >
        {loading && <LinearProgress color="secondary" />}
        {viewOnly && <TRN001_Table />}

        {!viewOnly && (
          <TableContainer>
            <Table aria-label="simple table" padding={"none"}>
              <>
                <caption>
                  <h3>
                    Total ( Debit:{totalDebit} | Credit:{totalCredit} )
                  </h3>
                </caption>
                {errMsg?.cNo ? (
                  <caption style={{ fontSize: "15px", color: "#ea3a1b" }}>
                    {errMsg?.cNo}
                  </caption>
                ) : (
                  <></>
                )}
                {errMsg?.accNo ? (
                  <caption style={{ fontSize: "15px", color: "#ea3a1b" }}>
                    {errMsg?.accNo}
                  </caption>
                ) : (
                  <></>
                )}
              </>

              <TableHead>
                <TableRow id="topHead">
                  <TableCell id="head">Branch</TableCell>
                  <TableCell id="head">A/C Type</TableCell>
                  <TableCell id="head">A/C No</TableCell>
                  <TableCell id="head">TRX</TableCell>
                  <TableCell id="head">
                    {rows[0]?.trx?.code == "4" ? "Token" : "Scroll"}
                  </TableCell>
                  <TableCell id="head">SDC</TableCell>
                  <TableCell id="head">Remarks</TableCell>
                  <TableCell id="head">Chq No</TableCell>
                  {/* <TableCell id="head">Chq Date</TableCell> */}
                  <TableCell id="head">Debit</TableCell>
                  <TableCell id="head">Credit</TableCell>
                  <TableCell id="head">Vno.</TableCell>
                </TableRow>
              </TableHead>

              {rows &&
                rows?.map((a, i) => {
                  return (
                    <TableBody>
                      <TableRow key={i}>
                        <TableCell sx={{ minWidth: 160 }}>
                          <Autocomplete
                            value={a.branch}
                            autoHighlight
                            size="small"
                            disabled={viewOnly ? true : false}
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
                            autoHighlight
                            size="small"
                            disabled={viewOnly ? true : false}
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
                            disabled={viewOnly ? true : false}
                            error={!a.accNo ? true : false}
                            size="small"
                            type="number"
                            onChange={(e) => handleAccNo(e, i)}
                            onBlur={(e) => handleAccNoBlur(e, i)}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 160 }}>
                          <Autocomplete
                            value={a.trx}
                            autoHighlight
                            size="small"
                            disabled={viewOnly ? true : false}
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
                            type="number"
                            disabled={viewOnly ? true : false}
                            size="small"
                            onChange={(e) => handleScroll(e, i)}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 160 }}>
                          <Autocomplete
                            value={a.sdc}
                            autoHighlight
                            disabled={viewOnly ? true : false}
                            size="small"
                            options={sdcOptions}
                            onChange={(e, value) => handleSdc(e, value, i)}
                            renderInput={(params) => (
                              <TextField {...params} label="" />
                            )}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 80 }}>
                          <TextField
                            value={a.remark}
                            disabled={viewOnly ? true : false}
                            size="small"
                            onChange={(e) => handleRemark(e, i)}
                          />
                        </TableCell>

                        <TableCell sx={{ minWidth: 50 }}>
                          <TextField
                            value={a.cNo}
                            error={!a.cNo || a?.bugChq ? true : false}
                            id="txtRight"
                            disabled={
                              a.isCredit ||
                              !a.accNo ||
                              !a.accType?.value ||
                              viewOnly
                                ? true
                                : false
                            }
                            size="small"
                            type="number"
                            onChange={(e) => handleCNo(e, i)}
                          />
                        </TableCell>

                        {/* <TableCell>
                          <TextField
                            value={a.date}
                            error={a.isCredit && !a.date ? true : false}
                            type="date"
                            // disabled={a.isCredit || viewOnly ? true : false}
                            disabled={true}
                            size="small"
                            onChange={(e) => handleDate(e, i)}
                          />{" "}
                        </TableCell> */}
                        <TableCell sx={{ minWidth: 50 }}>
                          <TextField
                            value={a.debit}
                            error={Number(a.debit) > 0 ? false : true}
                            id="txtRight"
                            size="small"
                            disabled={
                              a?.isCredit ||
                              !a.branch ||
                              !a.trx?.code ||
                              viewOnly
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
                            error={Number(a.credit) > 0 ? false : true}
                            id="txtRight"
                            size="small"
                            disabled={
                              !a?.isCredit ||
                              !a.branch ||
                              !a.trx?.code ||
                              viewOnly
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
                            onChange={(e) => handleVNo(e, i)}
                          />
                        </TableCell>
                        <TableCell style={{ border: "0px", width: "10px" }}>
                          {(rows[i].trx?.code == "3" ||
                            rows[i].trx?.code == "6") && (
                            <Button
                              color="secondary"
                              disabled={viewOnly ? true : false}
                              onClick={(e) => handleClear(e, i)}
                              size="small"
                            >
                              <CancelIcon />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  );
                })}
            </Table>
          </TableContainer>
        )}

        {/* {viewOnly && !rows2.length > 0 && (
          <div id="noRecord">No Record Found</div>
        )} */}
      </Card>
      {!viewOnly && (
        <div>
          {(rows[0]?.trx?.code == "3" || rows[0]?.trx?.code == "6") && (
            <Button
              variant="outlined"
              color="secondary"
              sx={{ margin: "8px" }}
              onClick={() => handleAddRow()}
            >
              <AddIcon /> new row
            </Button>
          )}

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setResetDialog(true)}
          >
            <RestartAltIcon /> reset
          </Button>

          {!loading && (
            <Button
              variant="contained"
              color="secondary"
              sx={{ margin: "8px" }}
              onClick={() => handleSaveDialog()}
            >
              Save
            </Button>
          )}
        </div>
      )}

      <br />
      <BaseFooter
        handleUpdateRows={handleUpdateRows}
        rows={rows2}
        handleViewAll={handleGetTRN001List}
        handleRefresh={handleReset}
      />
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

export default Trn001_footer;
