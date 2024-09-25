import {
  Container,
  Typography,
  Box,
  TableBody,
  Table,
  TableCell,
  TableRow,
  Theme,
  TableContainer,
  AppBar,
  Toolbar,
  Dialog,
} from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import PrintIcon from "@mui/icons-material/Print";
import { ClosingAdviceGridMetaData } from "./closingAdviceGridMetaData";
import { AuthContext } from "pages_audit/auth";
import { useContext, useState } from "react";
import { RecurringContext } from "./context/recurringPaymentContext";
import { format, parse } from "date-fns";
import { useMutation } from "react-query";
import * as API from "./api";
import { useTranslation } from "react-i18next";
import {
  LoaderPaperComponent,
  GridWrapper,
  GradientButton,
  PDFViewer,
  utilFunction,
  GridMetaDataType,
} from "@acuteinfo/common-base";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      marginBottom: "5px",
      position: "relative",
    },
    headerRoot: {
      background: "var(--theme-color5)",
    },
    headerTitle: {
      flex: "1 1 100%",
      color: "var(--theme-color2)",
      letterSpacing: "1px",
      fontSize: "1.5rem",
    },
    rowBorder: {
      borderBottom: "1px solid var(--theme-color3)",
    },
    tCellLabel: {
      fontWeight: "500",
      border: "none",
      overflow: "hidden",
      padding: "5px 0px",
      width: "10%",
      fontSize: "0.875rem",
    },

    tCellValue: {
      fontWeight: "500",
      border: "none",
      overflow: "hidden",
      padding: "5px 0px",
      width: "15%",
      fontSize: "0.875rem",
    },
    tableContainer: {
      backgroundColor: "var(--theme-color4)",
      width: "100%",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "5px 30px",
    },
    title: {
      fontSize: "0.875rem",
      fontWeight: "500",
    },
    tCellFt: {
      fontWeight: "500",
      fontSize: "0.875rem",
      border: "none",
      overflow: "hidden",
      textAlign: "right",
      padding: "5px 8px",
    },

    tCellFtTotal: {
      borderTop: "1px solid var(--theme-color3)",
      padding: "8px 8px",
    },
    tableContainerFt: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid var(--theme-color3)",
      borderRadius: "10px",
      padding: "5px 12px",
    },
    contentBox: {
      width: "100%",
      display: "flex",
      borderRadius: "10px",
      padding: "5px 12px",
      marginTop: "5px",
      border: "1px solid var(--theme-color3)",
      boxShadow: "none",
    },
  })
);

const ClosingAdvice = ({ handleCloseAdviceDetails }) => {
  const { authState } = useContext(AuthContext);
  const { rpState } = useContext(RecurringContext);
  const classes = useStyles();
  const [fileBlob, setFileBlob] = useState<any>(null);
  const [openPrint, setOpenPrint] = useState(false);
  const { t } = useTranslation();

  const adviceDetailsJasperMutation = useMutation(
    API.getRucurPmtAdviceDtlJasper,
    {
      onError: (error: any) => {
        let errorMsg = "Unknownerroroccured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
      },
      onSuccess: async (data) => {
        let blobData = utilFunction.blobToFile(data, "");
        if (blobData) {
          setFileBlob(blobData);
          setOpenPrint(true);
        }
      },
    }
  );

  const handlePrint: any = () => {
    adviceDetailsJasperMutation.mutate({
      COMP_CD: authState?.companyID,
      BRANCH_CD: rpState?.dataForJasperParam?.BRANCH_CD ?? "",
      ACCT_TYPE: rpState?.dataForJasperParam?.ACCT_TYPE ?? "",
      ACCT_CD: rpState?.dataForJasperParam?.ACCT_CD ?? "",
      INT_RATE: rpState?.dataForJasperParam?.INT_RATE ?? "",
      INT_AMOUNT: rpState?.dataForJasperParam?.INT_AMOUNT ?? "",
      REC_PENALTY_AMT: rpState?.dataForJasperParam?.REC_PENALTY_AMT ?? "",
      PENAL_RATE: rpState?.dataForJasperParam?.PENAL_RATE ?? "",
      PAYMENT_TYPE: rpState?.dataForJasperParam?.PAYMENT_TYPE ?? "",
      TRAN_CD: rpState?.dataForJasperParam?.TRAN_CD ?? "",
    });
  };

  const totalIntAmt =
    rpState?.closingAdviceData?.reduce((acc, value) => {
      return acc + Number(value.INT_AMT);
    }, 0) ?? 0;
  const totalPenaltyAmt =
    rpState?.closingAdviceData?.reduce((acc, value) => {
      return acc + Number(value.PENALTY);
    }, 0) ?? 0;
  let recoverInt =
    Number(rpState?.closingAdviceData?.[0]?.INT_AMT ?? 0) + totalPenaltyAmt;
  recoverInt = Math.abs(recoverInt);
  const intAmount = Number(rpState?.closingAdviceData?.[0]?.INT_AMT ?? 0);
  const actualDeposit = Number(
    rpState?.closingAdviceData?.[0]?.ACTUAL_DEPOSIT ?? 0
  );
  const recPenaltyAmt = Number(rpState?.getAcctData?.REC_PENALTY_AMT ?? 0);
  const amountPayableToParty =
    actualDeposit +
    totalIntAmt +
    intAmount +
    totalPenaltyAmt -
    (totalPenaltyAmt + Number(rpState?.closingAdviceData?.[0]?.TDS_AMT ?? 0));

  const workingDate = authState?.workingDate
    ? format((authState?.workingDate, "dd-MMM-yyyy", new Date()), "dd-MM-yyyy")
    : "";

  return (
    <>
      <Container>
        <AppBar className={classes.appBar}>
          <Toolbar variant="dense" className={classes.headerRoot}>
            <Typography
              component="span"
              variant="h5"
              className={classes.headerTitle}
            >
              {`${t("RecurringDepositAccountClosingAdviceAsOn", {
                workingDate: workingDate,
              })}`}
            </Typography>
            <GradientButton startIcon={<PrintIcon />} onClick={handlePrint}>
              {t("Print")}
            </GradientButton>
            <GradientButton onClick={handleCloseAdviceDetails}>
              {t("Close")}
            </GradientButton>
          </Toolbar>
        </AppBar>

        <TableContainer className={classes.tableContainer}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className={classes.tCellLabel}>
                  {t("AcctNo")} :
                </TableCell>
                <TableCell className={classes.tCellValue} colSpan={3}>{`${
                  rpState?.closingAdviceData?.[0]?.COMP_CD ?? ""
                }\u00A0\u00A0${
                  rpState?.closingAdviceData?.[0]?.BRANCH_CD ?? ""
                }\u00A0\u00A0${
                  rpState?.closingAdviceData?.[0]?.ACCT_TYPE ?? ""
                }\u00A0\u00A0${
                  rpState?.closingAdviceData?.[0]?.ACCT_CD ?? ""
                }`}</TableCell>

                <TableCell className={classes.tCellLabel}>
                  {t("AcctName")} :
                </TableCell>
                <TableCell className={classes.tCellValue} colSpan={3}>
                  {rpState?.closingAdviceData?.[0]?.ACCT_NM ?? ""}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className={classes.tCellLabel}>J1 :</TableCell>
                <TableCell className={classes.tCellValue}>
                  {" "}
                  {rpState?.closingAdviceData?.[0]?.J1 ?? ""}
                </TableCell>
                <TableCell className={classes.tCellLabel}>J2 :</TableCell>
                <TableCell className={classes.tCellValue}>
                  {rpState?.closingAdviceData?.[0]?.J2 ?? ""}
                </TableCell>
                <TableCell className={classes.tCellLabel}>N1 :</TableCell>
                <TableCell className={classes.tCellValue}>
                  {rpState?.closingAdviceData?.[0]?.N1 ?? ""}
                </TableCell>
              </TableRow>

              <TableRow className={` ${classes.rowBorder}`}>
                <TableCell className={classes.tCellLabel}>
                  {t("Instruction")} :
                </TableCell>
                <TableCell className={classes.tCellValue} colSpan={3}>
                  {rpState?.closingAdviceData?.[0]?.MODE_NM ?? ""}
                </TableCell>

                <TableCell className={classes.tCellLabel}>
                  {t("Remarks")} :
                </TableCell>
                <TableCell className={classes.tCellValue} colSpan={3}>
                  {rpState?.closingAdviceData?.[0]?.REMARKS ?? ""}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className={classes.tCellLabel}>
                  {t("InsStartDate")} :
                </TableCell>
                <TableCell className={classes.tCellValue}>
                  {rpState?.closingAdviceData?.[0]?.INS_START_DT
                    ? format(
                        new Date(rpState?.closingAdviceData?.[0]?.INS_START_DT),
                        "dd/MM/yyyy"
                      )
                    : ""}
                </TableCell>

                <TableCell className={classes.tCellLabel}>
                  {t("DueDate")} :
                </TableCell>
                <TableCell className={classes.tCellValue}>
                  {rpState?.closingAdviceData?.[0]?.INST_DUE_DT
                    ? format(
                        new Date(rpState?.closingAdviceData?.[0]?.INST_DUE_DT),
                        "dd/MM/yyyy"
                      )
                    : ""}
                </TableCell>

                <TableCell className={classes.tCellLabel}>
                  {t("IntRate")} :
                </TableCell>
                <TableCell className={classes.tCellValue}>
                  {Number(rpState?.getAcctData?.INT_RATE ?? 0).toFixed(2)}
                </TableCell>

                <TableCell className={classes.tCellLabel}>
                  {t("LastCrDate")} :
                </TableCell>
                <TableCell className={classes.tCellValue}>
                  {rpState?.closingAdviceData?.[0]?.LAST_CR_DT
                    ? format(
                        new Date(rpState?.closingAdviceData?.[0]?.LAST_CR_DT),
                        "dd/MM/yyyy"
                      )
                    : ""}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className={classes.tCellLabel}>
                  {t("NoOfInst")} :
                </TableCell>
                <TableCell className={classes.tCellValue}>
                  {rpState?.closingAdviceData?.[0]?.INST_NO ?? ""}
                </TableCell>
                <TableCell className={classes.tCellLabel}>
                  {t("InstAmt")} :
                </TableCell>
                <TableCell className={classes.tCellValue}>
                  {Number(
                    rpState?.closingAdviceData?.[0]?.INST_RS ?? 0
                  ).toFixed(2)}
                </TableCell>
                <TableCell className={classes.tCellLabel}>
                  {t("PenalRate")} :
                </TableCell>
                <TableCell className={classes.tCellValue}>
                  {Number(
                    rpState?.closingAdviceData?.[0]?.PENAL_RATE ?? 0
                  ).toFixed(2)}
                </TableCell>
                <TableCell className={classes.tCellLabel}>
                  {t("PrematurePayment")} :
                </TableCell>
                <TableCell className={classes.tCellValue}>
                  {rpState?.getAcctData?.PREMATURE?.trim() === "N"
                    ? t("NO")
                    : rpState?.getAcctData?.PREMATURE?.trim() === "Y"
                    ? t("Yes")
                    : ""}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            width: "100%",
            position: "relative",
            margin: "0",
            padding: "0",
          }}
        >
          <GridWrapper
            key={"closingAdvice"}
            finalMetaData={ClosingAdviceGridMetaData as GridMetaDataType}
            data={rpState?.closingAdviceData ?? []}
            setData={() => null}
          />
        </Box>

        <TableContainer className={classes.tableContainerFt}>
          <Table sx={{ width: "auto" }}>
            <TableBody>
              <TableRow>
                <TableCell className={classes.tCellFt}>
                  {`${t("TotalDepositAsOn", {
                    workingDate: workingDate,
                  })}`}{" "}
                  :
                </TableCell>
                <TableCell className={classes.tCellFt}>
                  {Number(
                    rpState?.closingAdviceData?.[0]?.ACTUAL_DEPOSIT ?? 0
                  ).toFixed(2)}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className={classes.tCellFt}>
                  {t("TotalInterestPaidOrProvision")} :
                </TableCell>
                <TableCell className={classes.tCellFt}>
                  {Number(totalIntAmt).toFixed(2)}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className={classes.tCellFt}>
                  {intAmount + recPenaltyAmt < 0
                    ? `${t("RecoverInterest")} :`
                    : `${t("RemainingIntToPaid")} :`}
                </TableCell>
                <TableCell className={classes.tCellFt}>
                  {Number(recoverInt).toFixed(2)}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className={classes.tCellFt}>
                  {`${t("LessPenalty")} [${Number(
                    rpState?.closingAdviceData?.[0]?.PENALTY ?? 0
                  ).toFixed(2)}] :`}
                </TableCell>
                <TableCell className={classes.tCellFt}>
                  {Number(totalPenaltyAmt).toFixed(2)}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className={classes.tCellFt}>
                  {`${t("LessTDS")} [@${Number(
                    rpState?.closingAdviceData?.[0]?.TDS_RATE ?? 0
                  ).toFixed(2)} ${t("Limit")}: ${Math.round(
                    rpState?.closingAdviceData?.[0]?.TDS_LIMIT ?? 0
                  )}] :`}
                </TableCell>
                <TableCell className={classes.tCellFt}>
                  {Number(
                    rpState?.closingAdviceData?.[0]?.TDS_AMT ?? 0
                  ).toFixed(2) ?? 0}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  className={`${classes.tCellFtTotal} ${classes.tCellFt}`}
                >
                  {t("AmountPayableToParty")} :
                </TableCell>
                <TableCell
                  className={`${classes.tCellFtTotal} ${classes.tCellFt}`}
                >
                  {Number(String(amountPayableToParty)).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box className={classes.contentBox}>
          <Typography color="inherit" variant={"h6"} className={classes.title}>
            {`${t("VouchersDetail")}\u00A0:\u00A0`}
          </Typography>
          <pre>{`${rpState?.closingAdviceData?.[0]?.VOUCHER_SET ?? ""}`}</pre>
        </Box>

        <Box className={classes.contentBox}>
          <Typography color="inherit" variant={"h6"} className={classes.title}>
            {t("UserName")} :
          </Typography>
          <Typography color="inherit" variant={"h6"} className={classes.title}>
            {`\u00A0\u00A0${authState?.user?.name ?? ""}`}
          </Typography>
        </Box>
      </Container>

      {adviceDetailsJasperMutation?.isLoading ? (
        <Dialog
          open={true}
          PaperProps={{
            style: {
              overflow: "auto",
              padding: "10px",
              width: "600px",
              height: "100px",
            },
          }}
          maxWidth="md"
        >
          <LoaderPaperComponent />
        </Dialog>
      ) : (
        Boolean(fileBlob && fileBlob?.type?.includes("pdf")) &&
        Boolean(openPrint) && (
          <Dialog
            open={true}
            PaperProps={{
              style: {
                width: "100%",
                overflow: "auto",
                padding: "10px",
                height: "100%",
              },
            }}
            maxWidth="xl"
          >
            <PDFViewer
              blob={fileBlob}
              fileName={`${t("RecurringClosingAdvice")} ${
                rpState?.closingAdviceData?.[0]?.COMP_CD ?? ""
              }${rpState?.closingAdviceData?.[0]?.BRANCH_CD ?? ""}${
                rpState?.closingAdviceData?.[0]?.ACCT_TYPE ?? ""
              }${rpState?.closingAdviceData?.[0]?.ACCT_CD ?? ""}`}
              onClose={() => setOpenPrint(false)}
            />
          </Dialog>
        )
      )}
    </>
  );
};

export default ClosingAdvice;
