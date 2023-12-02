import React, { useEffect, useRef, useState } from "react";
import FormWrapper from "components/dyanmicForm";
import { footerFormMetaData } from "./metaData";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

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

      <Grid item xl={12} lg={8} xs={12} sm={6} md={4} spacing={5}>
        <Button variant="contained" color="primary">
          View All
        </Button>
        <Button variant="contained" color="primary">
          Search
        </Button>
        <Button variant="contained" color="primary">
          Calculator
        </Button>
        <Button variant="contained" color="primary">
          Query
        </Button>
        <Button variant="contained" color="primary">
          Delete
        </Button>
        <Button variant="contained" color="primary">
          refresh
        </Button>
        <Button variant="contained" color="primary">
          scroll search
        </Button>
        <Button variant="contained" color="primary">
          scroll del
        </Button>
        <Button variant="contained" color="primary">
          other a/c
        </Button>
        <Button variant="contained" color="primary">
          other Tx Detail
        </Button>
      </Grid>
      <br />
      <table>
        <thead>
          {/* <tr>          
            <td>Branch</td>
            <td>AccType</td>
            <td>AccNo</td>  
            <td>TRX</td>   
            <td>Scroll</td>
            <td>SDC</td>  
            <td>Remarks</td>
            <td>ChqNo</td>
            <td>ChqDate</td>
            <td>Debit</td>
            <td>Credit</td>
            <td>Vno.</td>  
            <td></td>      
          </tr> */}
          <tr>
            <td>Account</td>
            <td>TRX</td>
            <td>Debit </td>
            <td>Credit</td>
            <td></td>
          </tr>
        </thead>

        {rows.length > 0 ? (
          rows?.map((a, i) => {
            return (
              <tbody>
                <tr>
                  <td>
                    <Autocomplete
                      ref={inputElement}
                      disablePortal
                      id="combo-box-demo"
                      options={top100Films}
                      sx={{ width: 250 }}
                      value={a.branch}
                      onChange={(e, value) => handleBranch(e, value, i)}
                      renderInput={(params) => (
                        <TextField {...params} label="" />
                      )}
                    />
                  </td>
                  <td>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={trxOptions}
                      sx={{ width: 250 }}
                      value={a.trx}
                      onChange={(e, value) => handleTrx(e, value, i)}
                      renderInput={(params) => (
                        <TextField {...params} label="" />
                      )}
                    />
                  </td>
                  <td>
                    <TextField
                      disabled={
                        a?.isCredit || !a.branch || !a.trx?.label ? true : false
                      }
                      type="number"
                      value={a.debit}
                      onChange={(e) => handleDebit(e, i)}
                      onBlur={(e) => handleDebitBlur(e, i)}
                    />
                  </td>
                  <td>
                    <TextField
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
                  </td>
                  <td>
                    {(rows[i].trx?.label == "3" ||
                      rows[i].trx?.label == "6") && (
                      <Button
                        // disabled={rows.length > 1 ? false : true}
                        variant="outlined"
                        color="secondary"
                        onClick={(e) => handleClear(e, i)}
                      >
                        X
                      </Button>
                    )}
                  </td>
                </tr>
              </tbody>
            );
          })
        ) : (
          <>no records</>
        )}
        <tr>
          <td></td>
          <td>total:</td>
          <td>{totalDebit}</td>
          <td>{totalCredit}</td>
          <td></td>
        </tr>
      </table>

      <br />
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
