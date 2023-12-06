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

//Logical
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useMutation, useQuery } from "react-query";
import { footerFormMetaData } from "./metaData";
import FormWrapper from "components/dyanmicForm";
import { GeneralAPI } from "registry/fns/functions";
import * as API from "./api";

const Footer = () => {
  let authDetails = JSON.parse(localStorage?.getItem("authDetails"));

  const [trxOptions, setTrxOptions] = useState([]);
  const [trxOptions2, setTrxOptions2] = useState([]);
  const [sdcOptions, setSdcOptions] = useState([]);
  const [accTypeOptions, setAccTypeOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [accInfo, setAccInfo] = useState([]);
  const [defSdc, setDefSdc] = useState({});

  let defaulVal = {
    branch: { label: "", value: "" },
    accType: { label: "", value: "" },
    accNo: "",
    trx: { label: "", value: "", code: "" },
    scroll: "",
    sdc: { label: "", value: "" },
    remark: "",
    cNo: 0,
    date: "",
    debit: 0,
    credit: 0,
    vNo: 0,
    isCredit: true,
  };

  const [rows, setRows] = useState([defaulVal]);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [diff, setDiff] = useState(0);
  const [isSave, setIsSave] = useState(false);

  const handleFilterTrx = () => {
    let result = trxOptions2?.filter((a) => a?.code == "3" || a?.code == "6");
    setTrxOptions(result);
  };

  useEffect(() => {
    console.log(rows, "rows");
    console.log(diff, "diff");
    let branchBug = rows.some((a) => !a.branch);
    setIsSave(!branchBug);
  }, [rows]);

  const getBranchOptions: any = useMutation(API.getBranchList, {
    onSuccess: (data) => {
      setBranchOptions(data);
      console.log(data, "branch");
    },
    onError: (error: any) => {},
  });
  const getAccTypeOptions: any = useMutation(API.getAccTypeList, {
    onSuccess: (data) => {
      setAccTypeOptions(data);
    },
    onError: (error: any) => {},
  });

  const getSdcOptions: any = useMutation(API.getSDCList, {
    onSuccess: (data) => {
      setSdcOptions(data);
      let def = data.filter((a) => a.value == "6   ");
      setDefSdc(def[0]);

      const obj = [...rows];
      obj[0].sdc = def[0];
      obj[0].remark = def[0]?.label;
      setRows(obj);
    },
    onError: (error: any) => {},
  });

  const getTrxOptions: any = useMutation(API.getTRXList, {
    onSuccess: (data) => {
      setTrxOptions2(data);
      setTrxOptions(data);

      console.log(data, "trx");
    },
    onError: (error: any) => {},
  });
  useEffect(() => {
    getBranchOptions.mutate(authDetails);
    getSdcOptions.mutate(authDetails);
    getAccTypeOptions.mutate(authDetails);
    getTrxOptions.mutate(authDetails);
  }, []);

  const getAccInfo: any = useMutation(API.getAccInfo, {
    onSuccess: (data) => {
      console.log(data, "accInfo");
      setAccInfo(data);
    },
    onError: (error: any) => {},
  });
  const handleGetAccInfo = () => {
    let data = {
      COMP_CD: rows[0]?.branch?.info?.COMP_CD,
      BRANCH_CD: rows[0]?.branch?.value,
      ACCT_TYPE: rows[0]?.accType?.value,
      ACCT_CD: rows[0]?.accNo,
    };

    getAccInfo.mutate(data);
  };

  const handleAddRow = () => {
    let branchBug = rows.some((a) => !a.branch);
    console.log(branchBug, "branchBug");

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

    let defaulVal2 = {
      branch: "",
      trx: trxx,
      debit: deb,
      credit: cred,
      isCredit: isCred,
    };

    if (!branchBug && totalDebit != totalCredit) {
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
    obj[i].debit = Number(e.target.value);
    setRows(obj);
    handleTotal(obj);
  };

  const handleCredit = (e, i) => {
    const obj = [...rows];
    obj[i].credit = Number(e.target.value);
    setRows(obj);
    handleTotal(obj);
  };

  const handleDebitBlur = (e, i) => {
    const obj = [...rows];
    totalDebit != totalCredit &&
      (obj[i].trx?.code == "3" || obj[i].trx?.code == "6") &&
      obj[i].credit != obj[i].debit &&
      handleAddRow();
  };
  const handleCreditBlur = (e, i) => {
    const obj = [...rows];
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
  };

  return (
    <>
      {/* <div
        style={{
          boxShadow: "0px 1px 4px -1px #999999",
          borderRadius: "5px",
          margin: "9px",
        }}
      >
        <Grid item xl={12} lg={8} xs={12} sm={6} md={4}>
          <FormWrapper
            metaData={footerFormMetaData}
            hideHeader={true}
            displayMode={"new"}
            formStyle={{
              background: "white",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          ></FormWrapper>{" "}
        </Grid>
      </div> */}
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
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 160 }}>
                        <Autocomplete
                          value={a.accType}
                          size="small"
                          options={accTypeOptions}
                          onChange={(e, value) => handleAccType(e, value, i)}
                          renderInput={(params) => (
                            <TextField {...params} label="" />
                          )}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 50 }}>
                        <TextField
                          value={a.accNo}
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
                            <TextField {...params} label="" />
                          )}
                        />
                      </TableCell>

                      <TableCell sx={{ minWidth: 50 }}>
                        <TextField
                          disabled={a?.trx?.code == "4" ? false : true}
                          id="scroll"
                          size="small"
                          value={a.scroll}
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
      <br />{" "}
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
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => console.log("saved")}
      >
        save
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => handleGetAccInfo()}
      >
        fetch accInfo
      </Button>
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
    </>
  );
};

export default Footer;
