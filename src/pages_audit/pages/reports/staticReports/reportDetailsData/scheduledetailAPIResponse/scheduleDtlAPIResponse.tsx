// import {
//   Dialog,
//   IconButton,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableRow,
//   Toolbar,
//   Typography,
//   makeStyles,
// } from "@material-ui";
import CloseIcon from "@mui/icons-material/Close";
import * as API from "../../../api";
import "./styles.css";
import logo from "assets/images/logo.jpg";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "pages_audit/auth";
import {
  Tooltip,
  useDialogStyles,
  PrintButton,
  LoaderPaperComponent,
} from "@acuteinfo/common-base";

import { schedulePaymentDetailMetaData } from "../metadata/scheduledetail";
import { clone, merge } from "lodash";
import {
  Dialog,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ReportGrid } from "@acuteinfo/common-base";
const useTypeStyles = makeStyles((theme) => ({
  root: {
    // paddingLeft: theme.spacing(1.5),
    // paddingRight: theme.spacing(1.5),
    background: "var(--theme-color1)",
    boxShadow:
      "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
    borderRadius: "4px",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  refreshiconhover: {},
  tableRow: {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  row1: {
    backgroundColor: "rgb(223 223 223 / 53%)",
  },
  row2: {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  tableCell: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    padding: "0px 2px 0px 3px",
    lineHeight: "34px",
    borderBottom: "0px",
    fontFamily: "sans-serif",
  },
  cell1: {
    width: "15%",
    // textAlign: "left",
    fontWeight: "bold",
  },
  cell2: {
    width: "30%",
  },

  loginLeft: {
    display: "flex",
    justifyContent: "center",
    padding: "2rem",
    // background: "var(--theme-color2)",
    // [theme.breakpoints.down("sm")]: {
    //   display: "none",
    // },
  },
}));

export const ScheduleDetailReports = ({
  onClose,
  buttonNames,
  screenFlag,
  rows,
  open = false,
}) => {
  const classes = useDialogStyles();
  const bodyClasses = useTypeStyles();
  const printRef = useRef<HTMLDivElement | null>(null);
  const { authState } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);

  let reportID;
  let metaData;
  let otherAPIRequestPara;

  if (screenFlag === "GETSCHDPAYRPT") {
    reportID = "SCHEDULERRESPONSEDTL";
    metaData = schedulePaymentDetailMetaData;
    otherAPIRequestPara = {
      A_TRAN_CD: rows?.A_TRAN_CD ?? "",
      A_SR_CD: rows?.A_SR_CD ?? "",
    };
  }

  return (
    <>
      <Dialog
        open={open}
        //@ts-ignore
        PaperProps={{
          style: {
            width: "70%",
          },
        }}
        maxWidth="md"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <Paper
          style={{
            width: "100%",
            padding: "10px",
            boxShadow: "none",
          }}
        >
          <Toolbar className={bodyClasses.root} variant={"dense"}>
            <Typography
              className={bodyClasses.title}
              color="inherit"
              variant={"h6"}
              component="div"
            >
              Response Detail
            </Typography>
            <PrintButton
              content={() => {
                return printRef.current;
              }}
            />

            {typeof onClose === "function" ? (
              <Tooltip title={"Close"} arrow={true}>
                <IconButton onClick={onClose} size="small">
                  <CloseIcon style={{ color: "var(--white)" }} />
                </IconButton>
              </Tooltip>
            ) : null}
          </Toolbar>
        </Paper>
        <div style={{ margin: 10 }}>
          {isLoading ? (
            <LoaderPaperComponent />
          ) : (
            <>
              <div ref={printRef} style={{ margin: 10 }}>
                <div className="nine">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={logo}
                      alt="Logo"
                      width="70px"
                      height="auto"
                      style={{ marginRight: "10px" }}
                    />
                    <h1>{authState.user.branch}</h1>
                  </div>
                  <h1>
                    <span>Response Detail</span>
                  </h1>
                </div>
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableBody component="div">
                      <TableRow
                        component="div"
                        className={`${bodyClasses.tableRow} ${bodyClasses.row1}`}
                      >
                        <TableCell
                          className={`${bodyClasses.tableCell} ${bodyClasses.cell1}`}
                          component="div"
                        >
                          User Name :
                        </TableCell>
                        <TableCell
                          className={`${bodyClasses.tableCell} ${bodyClasses.cell2}`}
                        >
                          {rows?.CUSTOM_USER_NM}
                        </TableCell>
                        <TableCell
                          className={`${bodyClasses.tableCell} ${bodyClasses.cell1}`}
                          component="div"
                        >
                          Transaction Type :
                        </TableCell>
                        <TableCell
                          className={`${bodyClasses.tableCell} ${bodyClasses.cell2}`}
                        >
                          {rows?.TRN_TYPE}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        component="div"
                        className={`${bodyClasses.tableRow} ${bodyClasses.row2}`}
                      >
                        <TableCell
                          className={`${bodyClasses.tableCell} ${bodyClasses.cell1}`}
                          component="div"
                        >
                          From Account No :
                        </TableCell>
                        <TableCell
                          className={`${bodyClasses.tableCell} ${bodyClasses.cell2}`}
                        >
                          {rows?.FROM_ACCT_NO}
                        </TableCell>
                        <TableCell
                          className={`${bodyClasses.tableCell} ${bodyClasses.cell1}`}
                          component="div"
                        >
                          To Account No:
                        </TableCell>
                        <TableCell
                          className={`${bodyClasses.tableCell} ${bodyClasses.cell2}`}
                        >
                          {rows?.TO_BEN_NO}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <div style={{ padding: "8px 0px 0px 0px" }}>
                  <ReportGrid
                    key={"reportID" + reportID + screenFlag}
                    reportID={"reportServiceAPI/" + reportID}
                    reportName={screenFlag}
                    dataFetcher={API.getReportData}
                    metaData={metaData}
                    maxHeight={240}
                    title={metaData?.title ?? ""}
                    options={{
                      disableGroupBy: metaData?.disableGroupBy ?? "",
                    }}
                    hideFooter={metaData?.hideFooter ?? ""}
                    hideAmountIn={metaData?.hideAmountIn ?? ""}
                    otherAPIRequestPara={otherAPIRequestPara}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </Dialog>
    </>
  );
};
