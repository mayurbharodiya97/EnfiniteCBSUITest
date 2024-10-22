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
import { Theme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {
  useDialogStyles,
  Alert,
  PrintButton,
  Tooltip,
} from "@acuteinfo/common-base";
import { Transition } from "@acuteinfo/common-base";
import { useQuery } from "react-query";
import * as API from "../api";
import "./styles.css";
import { LoaderPaperComponent } from "@acuteinfo/common-base";
import { ReactInstance, useContext, useRef } from "react";
import { AuthContext } from "pages_audit/auth";
import { useTranslation } from "react-i18next";
const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
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
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
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
  const { t } = useTranslation();
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
              {t("TransactionParticularsDetail")}
            </Typography>
            {isLoading || isError ? (
              <></>
            ) : (
              <PrintButton content={() => printRef?.current} />
            )}
            {typeof onClose === "function" ? (
              <Tooltip title={t("Close")} arrow={true}>
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
                src={`${new URL(window.location.href).origin}/bank-logo.jpg`}
                alt="Logo"
                width="70px"
                height="auto"
                style={{ marginRight: "10px" }}
              />
              <h1>{authState.user.branch}</h1>
            </div>
            <h1>
              <span>{t("TransactionParticularsDetail")}</span>
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
                      {t("TransactionRefNumber")} :
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
                      {t("LoginID")} :
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
                      {t("FromSource")} :
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
                      {t("FromAccountNumber")} :
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
                      {t("ToAccountNumber")} :
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
                      {t("TrnParticulars")} :
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
                      {t("TrnParticulars2")} :
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
                      {t("AbabilTrnParticulars")} :
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
                      {t("AbabilTrnParticulars2")} :
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
                      {t("TranzwareTrnParticulars")} :
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
                      {t("TranzwareTrnParticulars2")} :
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
