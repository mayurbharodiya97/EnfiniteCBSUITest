import React, { useEffect, useRef, useState } from "react";
import FormWrapper from "components/dyanmicForm";
import { footerFormMetaData } from "./metaData";
import { Button, Toolbar, AppBar, Card } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
//table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
//table

const Footer = () => {
  const inputElement = useRef();
  const top100Films = [
    { label: "acc1", year: 1994 },
    { label: "acc2", year: 1972 },
    { label: "acc3", year: 1974 },
  ];

  let arr = [
    { label: "1", year: 1994 },
    { label: "2", year: 1972 },
    { label: "3", year: 1974 },
    { label: "4", year: 1974 },
    { label: "5", year: 1974 },
    { label: "6", year: 1974 },
  ];
  const [trxOptions, setTrxOptions] = useState(arr);
  const [trxOptions2, setTrxOptions2] = useState(arr);

  const handleFilterTrx = () => {
    let result = trxOptions2.filter((a) => a.label == "3" || a.label == "6");
    setTrxOptions(result);
  };

  // let defaulVal = {
  //   branch: "",
  //   accType: "",
  //   accNo: "",
  //   trx: "",
  //   scroll: "",
  //   sdc: "",
  //   remark: "",
  //   cNo: "",
  //   cDate: "",
  //   debit: 0,
  //   credit: 0,
  //   vNo: "",
  // };

  let defaulVal = {
    branch: "",
    trx: { label: "" },
    debit: 0,
    credit: 0,
    isCredit: true,
  };

  const [rows, setRows] = useState([defaulVal]);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [diff, setDiff] = useState(0);
  const [isSave, setIsSave] = useState(false);
  const [style, setStyle] = useState("transfer");

  useEffect(() => {
    console.log(rows, "rows");
    console.log(diff, "diff");
    let branchBug = rows.some((a) => !a.branch);
    setIsSave(!branchBug);
  }, [rows]);

  const handleAddRow = (e, i) => {
    let branchBug = rows.some((a) => !a.branch);
    console.log(branchBug);

    let cred = 0;
    let deb = 0;
    let trxx = "1";
    let isCred = true;
    if (totalDebit > totalCredit) {
      cred = totalDebit - totalCredit;
      trxx = { label: "3" };
      isCred = true;
    } else if (totalDebit < totalCredit) {
      deb = totalCredit - totalDebit;
      trxx = { label: "6" };
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
      (value?.label == "3" || value?.label == "6") &&
      handleFilterTrx();
    obj[i].trx = value;
    obj[i].credit = 0;
    obj[i].debit = 0;

    if (value?.label == "1" || value?.label == "2" || value?.label == "3") {
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
      (obj[i].trx.label == "3" || obj[i].trx.label == "6") &&
      obj[i].credit != obj[i].debit &&
      handleAddRow();
  };
  const handleCreditBlur = (e, i) => {
    const obj = [...rows];
    totalDebit != totalCredit &&
      (obj[i].trx.label == "3" || obj[i].trx.label == "6") &&
      obj[i].credit != obj[i].debit &&
      handleAddRow();
  };

  const handleReset = () => {
    setRows([defaulVal]);
    setTotalCredit(0);
    setTotalDebit(0);
    setTrxOptions(arr);
  };
  return (
    <>
      <div
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
      </div>
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
      <Card
        sx={{
          boxShadow: "0px 1px 4px -1px #999999",
          borderRadius: "5px",
          padding: "8px",
          margin: "4px",
        }}
      >
        <TableContainer>
          <Table aria-label="simple table" padding="none">
            <TableHead>
              <TableRow>
                <TableCell>Branch</TableCell>
                <TableCell>AccType</TableCell>
                <TableCell>AccNo</TableCell>
                <TableCell>TRX</TableCell>
                <TableCell>Scroll</TableCell>
                <TableCell>SDC</TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell>ChqNo</TableCell>
                <TableCell>ChqDate</TableCell>
                <TableCell>Debit</TableCell>
                <TableCell>Credit</TableCell>
                <TableCell>Vno.</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx>
              {rows.length > 0 ? (
                rows?.map((a, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell sx={{ minWidth: 120 }}>
                        <Autocomplete
                          size="small"
                          ref={inputElement}
                          disablePortal
                          options={top100Films}
                          value={a.branch}
                          onChange={(e, value) => handleBranch(e, value, i)}
                          renderInput={(params) => (
                            <TextField {...params} label="" />
                          )}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 120 }}>
                        <Autocomplete
                          size="small"
                          ref={inputElement}
                          disablePortal
                          options={top100Films}
                          value={a.branch}
                          onChange={(e, value) => handleBranch(e, value, i)}
                          renderInput={(params) => (
                            <TextField {...params} label="" />
                          )}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 60 }}>
                        <TextField
                          id="acNo"
                          size="small"
                          type="number"
                          value={a.credit}
                          // onChange={(e) => handleCredit(e, i)}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 120 }}>
                        <Autocomplete
                          size="small"
                          disablePortal
                          id="combo-box-demo"
                          options={trxOptions}
                          value={a.trx}
                          onChange={(e, value) => handleTrx(e, value, i)}
                          renderInput={(params) => (
                            <TextField {...params} label="" />
                          )}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 60 }}>
                        <TextField
                          id="scroll"
                          size="small"
                          type="number"
                          value={a.credit}
                          // onChange={(e) => handleCredit(e, i)}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 160 }}>
                        <Autocomplete
                          id="sdc"
                          size="small"
                          disablePortal
                          options={trxOptions}
                          value={a.trx}
                          onChange={(e, value) => handleTrx(e, value, i)}
                          renderInput={(params) => (
                            <TextField {...params} label="" />
                          )}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 80 }}>
                        <TextField
                          id="remarks"
                          size="small"
                          type="number"
                          value={a.credit}
                          // onChange={(e) => handleCredit(e, i)}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 60 }}>
                        <TextField
                          id="cNo"
                          size="small"
                          type="number"
                          value={a.credit}
                          // onChange={(e) => handleCredit(e, i)}
                        />
                      </TableCell>{" "}
                      <TableCell sx={{ width: 60 }}>
                        <TextField
                          type="date"
                          size="small"
                          // value={a.credit}
                          // onChange={(e) => handleCredit(e, i)}
                        />{" "}
                      </TableCell>
                      <TableCell sx={{ minWidth: 60 }}>
                        <TextField
                          size="small"
                          disabled={
                            a?.isCredit || !a.branch || !a.trx?.label
                              ? true
                              : false
                          }
                          type="number"
                          value={a.debit}
                          onChange={(e) => handleDebit(e, i)}
                          onBlur={(e) => handleDebitBlur(e, i)}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 60 }}>
                        <TextField
                          size="small"
                          disabled={
                            !a?.isCredit || !a.branch || !a.trx?.label
                              ? true
                              : false
                          }
                          type="number"
                          value={a.credit}
                          onChange={(e) => handleCredit(e, i)}
                          onBlur={(e) => handleCreditBlur(e, i)}
                        />
                      </TableCell>{" "}
                      <TableCell sx={{ minWidth: 60 }}>
                        <TextField
                          id="vNo"
                          size="small"
                          type="number"
                          value={a.credit}
                          // onChange={(e) => handleCredit(e, i)}
                        />
                      </TableCell>
                      <TableCell>
                        {(rows[i].trx?.label == "3" ||
                          rows[i].trx?.label == "6") && (
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={(e) => handleClear(e, i)}
                          >
                            X
                          </Button>
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
      {(rows[0]?.trx?.label == "3" || rows[0]?.trx?.label == "6") && (
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
    </>
  );
};

export default Footer;
