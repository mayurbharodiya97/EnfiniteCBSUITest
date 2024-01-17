import React from "react";

//UI
import { Button, Toolbar, AppBar, Card } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
const ScrollTable = ({
  errMsg,
  totalDebit,
  totalCredit,
  rows,
  viewOnly,
  branchOptions,
  handleBranch,
  accTypeOptions,
  handleAccType,
  handleAccNo,
  handleAccNoBlur,
  trxOptions,
  handleTrx,
  handleScroll,
  sdcOptions,
  handleSdc,
  handleRemark,
  handleCNo,
  handleDebit,
  handleDebitBlur,
  handleCredit,
  handleCreditBlur,
  handleVNo,
  handleClear,
}) => {
  return (
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
                        a.isCredit || !a.accNo || !a.accType?.value || viewOnly
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
                        a?.isCredit || !a.branch || !a.trx?.code || viewOnly
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
                        !a?.isCredit || !a.branch || !a.trx?.code || viewOnly
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
                    {(rows[i].trx?.code == "3" || rows[i].trx?.code == "6") && (
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
  );
};

export default ScrollTable;
