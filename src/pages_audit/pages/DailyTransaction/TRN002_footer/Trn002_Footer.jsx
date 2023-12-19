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
import * as API2 from "../TRN001_footer/api";
import { AuthContext } from "pages_audit/auth";
import "./Trn002_Footer.css";
import BaseFooter from "../TRN001_footer/BaseFooter";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const Trn002_Footer = () => {
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

  const getAccInfo = useMutation(API2.getAccInfo, {
    onSuccess: (data) => {
      console.log(data, "accInfo");
      setTempStore({ ...tempStore, accInfo: data });
    },
    onError: (error) => {},
  });

  const getScrollListF2 = useMutation(API.getScrollListF2, {
    onSuccess: (data) => {
      console.log(data, "getScrollListF2 api");
      data.map((a) => {
        a.check = false;
      });
      data.sort((a, b) => new Date(a.ENTERED_DATE) - new Date(b.ENTERED_DATE));

      setRows(data);
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
  const handleRowClick = (e, a) => {
    const obj = [...rows];
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
    setRows(data);
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
            <TableBody style={{ overflowY: "scroll", height: "65vh" }}>
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
                      <TableCell id={a?.isFav ? "isFav" : ""}>Vno.</TableCell>
                      <TableCell id={a?.isFav ? "isFav" : ""}>
                        {a.ACCT_CD_NEW}
                      </TableCell>
                      <TableCell
                        id={a?.isFav ? "isFav" : ""}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => handleRowClick(e, a)}
                      >
                        {a.ACCT_NM}
                      </TableCell>
                      <TableCell id={a?.isFav ? "isFav" : ""}>TRX</TableCell>
                      <TableCell id={a?.isFav ? "isFav" : ""}>
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
                      <TableCell id={a?.isFav ? "isFav" : ""}>
                        VerifiedBy
                      </TableCell>
                      <TableCell id={a?.isFav ? "isFav" : ""}>
                        PendingCycle
                      </TableCell>
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
      <Button
        variant="contained"
        color="secondary"
        sx={{ margin: "8px" }}
        // onClick={() => setSaveDialog(true)}
      >
        Confirm
      </Button>
      <BaseFooter handleUpdateRows={handleUpdateRows} rows={rows} />
    </>
  );
};

export default Trn002_Footer;
