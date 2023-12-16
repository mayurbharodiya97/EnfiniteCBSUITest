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
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Checkbox from "@mui/material/Checkbox";

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
import "./F2.css";

const label = { inputProps: { "aria-label": "Checkbox demo" } };
const TableF2 = () => {
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AuthContext);

  const [rows, setRows] = useState([]);

  const [filter, setFilter] = useState({ value: "", label: "" });
  const [search, setSearch] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setTempStore({ ...tempStore, accInfo: {} });
  }, []);

  useEffect(() => {
    console.log(rows, "rows");
  }, [rows]);

  useEffect(() => {
    let data = {
      COMP_CD: authState?.companyID,
      BRANCH_CD: authState?.user?.branchCode,
    };
    getScrollListF2.mutate(data);
  }, []);

  const getScrollListF2 = useMutation(API.getScrollListF2, {
    onSuccess: (data) => {
      console.log(data, "getScrollListF2 api");
      data.map((a) => {
        a.check = false;
      });
      let arr = [
        {
          DUMMY_COL: "Y",
          TRAN_CD: "206844",
          MODIFIED_BY: "",
          ACCT_NM: "JIGAR NAVINBHAI SHAH",
          REMARKS: "BY CASH -",
          ACCT_CD_NEW: "132099001201112 ",
          CONFIRMATION_COLOR: "0",
          CHEQUE_NO: "",
          PENDING_CYCLE: "0",
          ENTERED_BY: "shoeb",
          SDC: "1   ",
          AMOUNT: "10000",
          CONFIRMED: "0",
          TRAN_DT: "2023-12-15 00:00:00.0",
          FD_NO: "",
          VERIFIED_BY: "",
          SHARE_CERTI_NO: "",
          COMP_CD: "132 ",
          SCROLL1: "",
          ACCT_CD: "201112              ",
          L_INST_DT: "2023-12-15 00:00:00.0",
          TRN_FLAG: "",
          REF_TRAN_CD: "",
          ACCT_TYPE: "001 ",
          MACHINE_NM: "DESKTOP-M3K3479",
          VERIFIED_DATE: "",
          TYPE_CD: "1   ",
          COLOR_CD: "65535",
          ENTERED_BRANCH_CD: "099 ",
          BRANCH_CD: "099 ",
          ENTERED_COMP_CD: "132 ",
          ENTERED_DATE: "2023-12-15 11:08:35.0",
          VERIFIED_MACHINE_NM: "",
        },
        {
          DUMMY_COL: "Y",
          TRAN_CD: "206844",
          MODIFIED_BY: "",
          ACCT_NM: "JIGAR NAVINBHAI SHAH",
          REMARKS: "BY CASH -",
          ACCT_CD_NEW: "132099001201112 ",
          CONFIRMATION_COLOR: "0",
          CHEQUE_NO: "",
          PENDING_CYCLE: "0",
          ENTERED_BY: "shoeb",
          SDC: "1   ",
          AMOUNT: "10000",
          CONFIRMED: "0",
          TRAN_DT: "2023-12-15 00:00:00.0",
          FD_NO: "",
          VERIFIED_BY: "",
          SHARE_CERTI_NO: "",
          COMP_CD: "132 ",
          SCROLL1: "",
          ACCT_CD: "201112              ",
          L_INST_DT: "2023-12-15 00:00:00.0",
          TRN_FLAG: "",
          REF_TRAN_CD: "",
          ACCT_TYPE: "001 ",
          MACHINE_NM: "DESKTOP-M3K3479",
          VERIFIED_DATE: "",
          TYPE_CD: "1   ",
          COLOR_CD: "65535",
          ENTERED_BRANCH_CD: "099 ",
          BRANCH_CD: "099 ",
          ENTERED_COMP_CD: "132 ",
          ENTERED_DATE: "2023-12-15 11:08:35.0",
          VERIFIED_MACHINE_NM: "",
        },
        {
          DUMMY_COL: "Y",
          TRAN_CD: "206844",
          MODIFIED_BY: "",
          ACCT_NM: "JIGAR NAVINBHAI SHAH",
          REMARKS: "BY CASH -",
          ACCT_CD_NEW: "132099001201112 ",
          CONFIRMATION_COLOR: "0",
          CHEQUE_NO: "",
          PENDING_CYCLE: "0",
          ENTERED_BY: "shoeb",
          SDC: "1   ",
          AMOUNT: "10000",
          CONFIRMED: "0",
          TRAN_DT: "2023-12-15 00:00:00.0",
          FD_NO: "",
          VERIFIED_BY: "",
          SHARE_CERTI_NO: "",
          COMP_CD: "132 ",
          SCROLL1: "",
          ACCT_CD: "201112              ",
          L_INST_DT: "2023-12-15 00:00:00.0",
          TRN_FLAG: "",
          REF_TRAN_CD: "",
          ACCT_TYPE: "001 ",
          MACHINE_NM: "DESKTOP-M3K3479",
          VERIFIED_DATE: "",
          TYPE_CD: "1   ",
          COLOR_CD: "65535",
          ENTERED_BRANCH_CD: "099 ",
          BRANCH_CD: "099 ",
          ENTERED_COMP_CD: "132 ",
          ENTERED_DATE: "2023-12-15 11:08:35.0",
          VERIFIED_MACHINE_NM: "",
        },
        {
          DUMMY_COL: "Y",
          TRAN_CD: "206844",
          MODIFIED_BY: "",
          ACCT_NM: "pankaj NAVINBHAI SHAH",
          REMARKS: "BY CASH -",
          ACCT_CD_NEW: "132099001201112 ",
          CONFIRMATION_COLOR: "0",
          CHEQUE_NO: "",
          PENDING_CYCLE: "0",
          ENTERED_BY: "shoeb",
          SDC: "1   ",
          AMOUNT: "10000",
          CONFIRMED: "0",
          TRAN_DT: "2023-12-15 00:00:00.0",
          FD_NO: "",
          VERIFIED_BY: "",
          SHARE_CERTI_NO: "",
          COMP_CD: "132 ",
          SCROLL1: "",
          ACCT_CD: "201112              ",
          L_INST_DT: "2023-12-15 00:00:00.0",
          TRN_FLAG: "",
          REF_TRAN_CD: "",
          ACCT_TYPE: "001 ",
          MACHINE_NM: "DESKTOP-M3K3479",
          VERIFIED_DATE: "",
          TYPE_CD: "1   ",
          COLOR_CD: "65535",
          ENTERED_BRANCH_CD: "099 ",
          BRANCH_CD: "099 ",
          ENTERED_COMP_CD: "132 ",
          ENTERED_DATE: "2023-12-15 11:08:35.0",
          VERIFIED_MACHINE_NM: "",
        },
        {
          DUMMY_COL: "Y",
          TRAN_CD: "206844",
          MODIFIED_BY: "",
          ACCT_NM: "mahesh NAVINBHAI SHAH",
          REMARKS: "BY CASH -",
          ACCT_CD_NEW: "132099001201112 ",
          CONFIRMATION_COLOR: "0",
          CHEQUE_NO: "",
          PENDING_CYCLE: "0",
          ENTERED_BY: "shoeb",
          SDC: "1   ",
          AMOUNT: "10000",
          CONFIRMED: "0",
          TRAN_DT: "2023-12-15 00:00:00.0",
          FD_NO: "",
          VERIFIED_BY: "",
          SHARE_CERTI_NO: "",
          COMP_CD: "132 ",
          SCROLL1: "",
          ACCT_CD: "201112              ",
          L_INST_DT: "2023-12-15 00:00:00.0",
          TRN_FLAG: "",
          REF_TRAN_CD: "",
          ACCT_TYPE: "001 ",
          MACHINE_NM: "DESKTOP-M3K3479",
          VERIFIED_DATE: "",
          TYPE_CD: "1   ",
          COLOR_CD: "65535",
          ENTERED_BRANCH_CD: "099 ",
          BRANCH_CD: "099 ",
          ENTERED_COMP_CD: "132 ",
          ENTERED_DATE: "2023-12-15 11:08:35.0",
          VERIFIED_MACHINE_NM: "",
        },
        {
          DUMMY_COL: "Y",
          TRAN_CD: "123321",
          MODIFIED_BY: "",
          ACCT_NM: "rahul NAVINBHAI SHAH",
          REMARKS: "BY CASH -",
          ACCT_CD_NEW: "132099001201112 ",
          CONFIRMATION_COLOR: "0",
          CHEQUE_NO: "",
          PENDING_CYCLE: "0",
          ENTERED_BY: "shoeb",
          SDC: "1   ",
          AMOUNT: "10000",
          CONFIRMED: "0",
          TRAN_DT: "2023-12-15 00:00:00.0",
          FD_NO: "",
          VERIFIED_BY: "",
          SHARE_CERTI_NO: "",
          COMP_CD: "132 ",
          SCROLL1: "",
          ACCT_CD: "201112              ",
          L_INST_DT: "2023-12-15 00:00:00.0",
          TRN_FLAG: "",
          REF_TRAN_CD: "",
          ACCT_TYPE: "001 ",
          MACHINE_NM: "DESKTOP-M3K3479",
          VERIFIED_DATE: "",
          TYPE_CD: "1   ",
          COLOR_CD: "65535",
          ENTERED_BRANCH_CD: "099 ",
          BRANCH_CD: "099 ",
          ENTERED_COMP_CD: "132 ",
          ENTERED_DATE: "2023-12-15 11:08:35.0",
          VERIFIED_MACHINE_NM: "",
        },
      ];
      setRows(arr);
    },
    onError: (error) => {},
  });

  const handleCheck = (e, i) => {
    let obj = [...rows];
    obj[i].check = e.target.checked;
    setRows(obj);
  };
  const handleCheckAll = (e) => {
    console.log(e.target.checked, "all");
    let txt = e.target.checked;
    let obj = [...rows];
    obj.map((a) => {
      if (txt) {
        a.check = true;
      } else {
        a.check = false;
      }
    });
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
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <input
                    id="check"
                    type="checkbox"
                    // checked={a.check}
                    onChange={(e) => handleCheckAll(e)}
                  />
                </TableCell>
                <TableCell>Vno.</TableCell>
                <TableCell>A/C No</TableCell>
                <TableCell>A/C holder name</TableCell>
                <TableCell>TRX</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell>Chq No</TableCell>
                <TableCell>SDC</TableCell>
                <TableCell>Chq Date</TableCell>
                <TableCell>Scroll/Token</TableCell>
                <TableCell>EnteredBy</TableCell>
                <TableCell>VerifiedBy</TableCell>
                <TableCell>PendingCycle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((a, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>
                        {" "}
                        <input
                          id="check"
                          type="checkbox"
                          checked={a.check}
                          onChange={(e) => handleCheck(e, i)}
                        />
                      </TableCell>
                      <TableCell>Vno.</TableCell>
                      <TableCell>{a.ACCT_CD_NEW}</TableCell>
                      <TableCell>{a.ACCT_NM}</TableCell>
                      <TableCell>TRX</TableCell>
                      <TableCell>{a.AMOUNT}</TableCell>
                      <TableCell>{a.REMARKS}</TableCell>
                      <TableCell>{a.CHEQUE_NO}</TableCell>
                      <TableCell>{a.SDC}</TableCell>
                      <TableCell>{a.ENTERED_DATE.substring(0, 10)}</TableCell>
                      <TableCell>{a.SCROLL1}</TableCell>
                      <TableCell>{a.ENTERED_BY}</TableCell>
                      <TableCell>VerifiedBy</TableCell>
                      <TableCell>PendingCycle</TableCell>
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
    </>
  );
};

export default TableF2;
