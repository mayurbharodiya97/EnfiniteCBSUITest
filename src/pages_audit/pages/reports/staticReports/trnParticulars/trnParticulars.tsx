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
// } from "@material-ui/core";
// import CloseIcon from "@material-ui/icons/Close";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery } from "react-query";
import * as API from "../api";
import "./styles.css";
import logo from "assets/images/logo.jpg";
import { ReactInstance, useContext, useRef } from "react";
import { AuthContext } from "pages_audit/auth";
import {
  Tooltip,
  PrintButton,
  Alert,
  LoaderPaperComponent,
  useDialogStyles,
  Transition,
} from "@acuteinfo/common-base";
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
  // makeStyles,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
const useTypeStyles: any = makeStyles((theme) => ({
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
    width: "20%",
    // textAlign: "right",
    fontWeight: "bold",
  },
  cell2: {
    width: "80%",
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

export const TrnParticularsDetailsReports = ({
  onClose,
  rows,
  open = false,
}) => {
  const classes = useDialogStyles();
  const bodyClasses = useTypeStyles();
  const printRef = useRef<HTMLDivElement | null>(null);
  const { authState } = useContext(AuthContext);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getMarqueeMessagegridData", rows], () =>
    API.getTrnParticularsDetail(rows)
  );
  return (
    <>
      <Dialog
        open={open}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "60%",
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
              Transaction Particulars Detail
            </Typography>
            <PrintButton content={() => printRef?.current} />
            {typeof onClose === "function" ? (
              <Tooltip title={"Close"} arrow={true}>
                <IconButton onClick={onClose} size="small">
                  <CloseIcon style={{ color: "var(--white)" }} />
                </IconButton>
              </Tooltip>
            ) : null}
          </Toolbar>
        </Paper>
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
              <span>Transaction Particulars Detail</span>
            </h1>
          </div>

          {isLoading ? (
            <LoaderPaperComponent />
          ) : isError ? (
            <Alert
              severity={error?.severity ?? "error"}
              errorMsg={error?.error_msg ?? "Error"}
              errorDetail={error?.error_detail ?? ""}
            />
          ) : (
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
                      Transaction Ref. Number :
                    </TableCell>
                    <TableCell
                      className={`${bodyClasses.tableCell} ${bodyClasses.cell2}`}
                    >
                      {data?.[0]?.REF_NO}
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
                      Login ID :
                    </TableCell>
                    <TableCell
                      className={`${bodyClasses.tableCell} ${bodyClasses.cell2}`}
                    >
                      {data?.[0]?.USER_NAME}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    component="div"
                    className={`${bodyClasses.tableRow} ${bodyClasses.row1}`}
                  >
                    <TableCell
                      className={`${bodyClasses.tableCell} ${bodyClasses.cell1}`}
                      component="div"
                    >
                      From Source :
                    </TableCell>
                    <TableCell
                      className={`${bodyClasses.tableCell} ${bodyClasses.cell2}`}
                    >
                      {data?.[0]?.FROM_SOURCE}
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
                      From Account Number :
                    </TableCell>
                    <TableCell
                      className={`${bodyClasses.tableCell} ${bodyClasses.cell2}`}
                    >
                      {data?.[0]?.FROM_ACCT}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    component="div"
                    className={`${bodyClasses.tableRow} ${bodyClasses.row1}`}
                  >
                    <TableCell
                      className={`${bodyClasses.tableCell} ${bodyClasses.cell1}`}
                      component="div"
                    >
                      To Account Number :
                    </TableCell>
                    <TableCell
                      className={`${bodyClasses.tableCell} ${bodyClasses.cell2}`}
                    >
                      {data?.[0]?.TO_ACCT}
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
                      Trn. Particulars :
                    </TableCell>
                    <TableCell
                      className={`${bodyClasses.tableCell} ${bodyClasses.cell2}`}
                    >
                      {data?.[0]?.TRN_PERTICULERS}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    component="div"
                    className={`${bodyClasses.tableRow} ${bodyClasses.row1}`}
                  >
                    <TableCell
                      className={`${bodyClasses.tableCell} ${bodyClasses.cell1}`}
                      component="div"
                    >
                      Trn. Particulars2 :
                    </TableCell>
                    <TableCell
                      className={`${bodyClasses.tableCell} ${bodyClasses.cell2}`}
                    >
                      {data?.[0]?.TRN_PERTICULERS2}
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
                      Ababil Trn. Particulars :
                    </TableCell>
                    <TableCell
                      className={`${bodyClasses.tableCell} ${bodyClasses.cell2}`}
                    >
                      {data?.[0]?.ABABIL_TRN_PERTICULERS}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    component="div"
                    className={`${bodyClasses.tableRow} ${bodyClasses.row1}`}
                  >
                    <TableCell
                      className={`${bodyClasses.tableCell} ${bodyClasses.cell1}`}
                      component="div"
                    >
                      Ababil Trn. Particulars2 :
                    </TableCell>
                    <TableCell
                      className={`${bodyClasses.tableCell} ${bodyClasses.cell2}`}
                    >
                      {data?.[0]?.ABABIL_TRN_PERTICULERS2}
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
                      Tranzware Trn. Particulars :
                    </TableCell>
                    <TableCell
                      className={`${bodyClasses.tableCell} ${bodyClasses.cell2}`}
                    >
                      {data?.[0]?.TRANZWARE_TRN_PERTICULERS}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    component="div"
                    className={`${bodyClasses.tableRow} ${bodyClasses.row1}`}
                  >
                    <TableCell
                      className={`${bodyClasses.tableCell} ${bodyClasses.cell1}`}
                      component="div"
                    >
                      Tranzware Trn. Particulars2 :
                    </TableCell>
                    <TableCell
                      className={`${bodyClasses.tableCell} ${bodyClasses.cell2}`}
                    >
                      {data?.[0]?.TRANZWARE_TRN_PERTICULERS2}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </Dialog>
    </>
  );
};
