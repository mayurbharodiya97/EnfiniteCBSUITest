import {
  ClearCacheProvider,
  GradientButton,
  usePopupContext,
  utilFunction,
} from "@acuteinfo/common-base";
import {
  Dialog,
  DialogActions,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Typography,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import { Fragment } from "react/jsx-runtime";
import * as API from "./api";
import { useContext, useRef } from "react";
import { AuthContext } from "pages_audit/auth";
import { useReactToPrint } from "react-to-print";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    typoStyle: {
      fontWeight: "bold",
      fontSize: "14px",
    },
    headerRoot: {
      background: "var(--theme-color5)",
    },
  })
);

const SingleAccountInterestCustom = ({
  closeDialog,
  open,
  reqData,
  date,
  reportHeading,
  reportDetail,
  acctInfo,
}) => {
  const classes = useStyles();
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const printRef = useRef<any>(null);
  const applyAccountInt = useMutation(API.applyAccountInt, {
    onSuccess: async (data: any, variables: any) => {
      for (let i = 0; i < data?.length; i++) {
        if (data?.[i]?.O_STATUS === "999") {
          const btnName = await MessageBox({
            messageTitle: data?.[i]?.O_MSG_TITLE ?? "ValidationFailed",
            message: data?.[i]?.O_MESSAGE,
            icon: "ERROR",
          });
        } else if (data?.[i]?.O_STATUS === "99") {
          const btnName = await MessageBox({
            messageTitle: data?.[i]?.O_MSG_TITLE ?? "Confirmation",
            message: data?.[i]?.O_MESSAGE,
            buttonNames: ["Yes", "No"],
            loadingBtnName: ["Yes"],
            icon: "CONFIRM",
          });
          if (btnName === "No") {
            const btnName = await MessageBox({
              messageTitle: "Failed",
              message: "Interest Applied/Revert Back Failed.",
              buttonNames: ["Ok"],
            });
            if (btnName === "Ok") {
              break;
            }
          }
          if (btnName === "Yes") {
            // if (reportDetail?.REVERT_BUTTON === "Y") {
            revertAccountInt.mutate({
              COMP_CD: authState?.companyID ?? "",
              BRANCH_CD: acctInfo?.branch?.value ?? "",
              SCROLL_NO: data?.[i]?.SCROLL_NO ?? "",
              PAID: data?.[i]?.PAID ?? "",
            });
            // }
          }
        } else if (data?.[i]?.O_STATUS === "9") {
          const btnName = await MessageBox({
            messageTitle: data?.[i]?.O_MSG_TITLE ?? "Alert",
            message: data?.[i]?.O_MESSAGE,
            icon: "WARNING",
          });
        } else if (data?.[i]?.O_STATUS === "0") {
          // if (reportDetail?.REVERT_BUTTON === "Y") {
          // revertAccountInt.mutate({
          //   COMP_CD: authState?.companyID ?? "",
          //   BRANCH_CD: acctInfo?.branch?.value ?? "",
          //   SCROLL_NO: data?.[i]?.SCROLL_NO ?? "",
          //   PAID: data?.[i]?.PAID ?? "",
          // });
          // }
          if (reportDetail?.REVERT_BUTTON !== "Y") {
            CloseMessageBox();
            closeDialog();
          }
        }
      }
    },
    onError: (error: any, variables: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
      CloseMessageBox();
    },
  });
  const revertAccountInt = useMutation(API.revertAccountInt, {
    onSuccess: async (data: any, variables: any) => {
      for (let i = 0; i < data?.length; i++) {
        if (data?.[i]?.O_STATUS === "999") {
          const btnName = await MessageBox({
            messageTitle: data?.[i]?.O_MSG_TITLE ?? "ValidationFailed",
            message: data?.[i]?.O_MESSAGE,
            icon: "ERROR",
          });
        } else if (data?.[i]?.O_STATUS === "99") {
          const btnName = await MessageBox({
            messageTitle: data?.[i]?.O_MSG_TITLE ?? "Confirmation",
            message: data?.[i]?.O_MESSAGE,
            buttonNames: ["Yes", "No"],
            icon: "CONFIRM",
          });
        } else if (data?.[i]?.O_STATUS === "9") {
          const btnName = await MessageBox({
            messageTitle: data?.[i]?.O_MSG_TITLE ?? "Alert",
            message: data?.[i]?.O_MESSAGE,
            icon: "WARNING",
          });
        } else if (data?.[i]?.O_STATUS === "0") {
        }
      }
      CloseMessageBox();
      closeDialog();
    },
    onError: (error: any, variables: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
      CloseMessageBox();
    },
  });
  const handleApplyInt = async () => {
    const btnName = await MessageBox({
      message: "Are you sure to Apply Interest ?",
      messageTitle: "Confirmation",
      buttonNames: ["Yes", "No"],
      loadingBtnName: ["Yes"],
    });
    if (btnName === "Yes") {
      applyAccountInt.mutate({
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: acctInfo?.branch?.value ?? "",
        ACCT_TYPE: acctInfo?.accType?.value ?? "",
        ACCT_CD: acctInfo?.accNo ?? "",
        FROM_DT: date?.FROM_DT ?? "",
        TO_DT: date?.TO_DT ?? "",
        NPA_CD: reportDetail?.NPA_CD_PARENT ?? "",
        // NPA_CD: acctInfo?.NPA_CD ?? "",
        SCREEN_REF: "TRN/001",
      });
    }
  };
  const handleRevertInt = async () => {
    const btnName = await MessageBox({
      message: "Are you sure to Apply Interest ?",
      messageTitle: "Confirmation",
      buttonNames: ["Yes", "No"],
      loadingBtnName: ["Yes"],
    });
    if (btnName === "Yes") {
      applyAccountInt.mutate({
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: acctInfo?.branch?.value ?? "",
        ACCT_TYPE: acctInfo?.accType?.value ?? "",
        ACCT_CD: acctInfo?.accNo ?? "",
        FROM_DT: date?.FROM_DT ?? "",
        TO_DT: date?.TO_DT ?? "",
        NPA_CD: reportDetail?.NPA_CD_PARENT ?? "",
        // NPA_CD: acctInfo?.NPA_CD ?? "",
        SCREEN_REF: "TRN/001",
      });
    }
  };
  const handlePrintPage = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <Fragment>
      <Dialog
        open={open}
        fullWidth
        PaperProps={{
          style: {
            width: "100%",
          },
        }}
        maxWidth="md"
      >
        <Box
          ref={printRef}
          sx={{
            margin: "20px",
            overflow: "auto",

            "@media print": {
              width: "200mm", // A4 width
              // height: "290mm", // A4 height
              margin: "5px auto", // Center content
              pageBreakBefore: "always", // Ensure the content starts from a new page
              overflow: "hidden",
              pageBreakInside: "auto",
            },
          }}
        >
          {/* Display header */}
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              verticalAlign: "middle",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                // height: "60%", // Use full height of the parent Box
                width: "10%", // Define the width for the image container
                display: "flex",
                alignItems: "center",
                justifyContent: "left",
              }}
            >
              <img
                src={URL.createObjectURL(
                  utilFunction.base64toBlob(reportHeading?.RPT_IMG)
                )}
                alt="Report Image"
                style={{
                  objectFit: "contain",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              />
            </Box>
            <Box
              sx={{
                // height: "90%",
                width: "90%",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                paddingLeft: "5px",
              }}
            >
              <Typography className={classes.typoStyle}>
                {reportHeading?.LINE1}
              </Typography>
              <Typography className={classes.typoStyle}>
                {" "}
                {reportHeading?.LINE2}
              </Typography>
              <Divider sx={{ border: "1px dashed black" }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <pre className={classes.typoStyle}>
                  {reportHeading?.LINE3_P1}
                </pre>
                <pre className={classes.typoStyle}>
                  {reportHeading?.LINE3_P2}
                </pre>
              </Box>
            </Box>
          </Box>
          <pre className={classes.typoStyle}>{reportDetail?.RPT_HEADING}</pre>

          {/* Display middle section */}
          <Box>
            <TableContainer>
              <Table
                sx={{ minWidth: 300, width: 650 }}
                aria-label="simple table"
              >
                <TableBody>
                  <TableRow sx={{ padding: "0 !important" }}>
                    <TableCell
                      align="right"
                      sx={{
                        width: "25%",
                        padding: "0 !important",
                        borderBottom: "none !important",
                      }}
                    >
                      <pre>Account No.:</pre>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        width: "75%",
                        padding: "0 !important",
                        borderBottom: "none !important",
                      }}
                      colSpan={5}
                    >
                      <pre>
                        {reportDetail?.ACCT_CD ? reportDetail?.ACCT_CD : ""}
                      </pre>
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ padding: "0 !important" }}>
                    <TableCell
                      align="right"
                      sx={{
                        width: "16.74%",
                        padding: "0 !important",
                        borderBottom: "none !important",
                      }}
                    >
                      <pre>
                        {acctInfo?.PARENT_TYPE?.trim() === "SB"
                          ? "Balance:"
                          : "OutStanding:"}
                      </pre>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        width: "16.60%",
                        padding: "0 !important",
                        borderBottom: "none !important",
                      }}
                    >
                      <pre>
                        {reportDetail?.TRAN_BAL
                          ? parseFloat(reportDetail?.TRAN_BAL).toFixed(2)
                          : ""}
                      </pre>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        width: "16.74%",
                        padding: "0 !important",
                        borderBottom: "none !important",
                      }}
                    >
                      <pre>
                        {reportDetail?.LIMIT_AMT_VISIBLE === "Y"
                          ? "Limit Amount:"
                          : ""}
                      </pre>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        width: "16.60%",
                        padding: "0 !important",
                        borderBottom: "none !important",
                      }}
                    >
                      <pre>
                        {reportDetail?.LIMIT_AMT_VISIBLE === "Y" &&
                        reportDetail?.LIMIT_AMOUNT
                          ? parseFloat(reportDetail?.LIMIT_AMOUNT).toFixed(2)
                          : ""}
                      </pre>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        width: "16.66%",
                        padding: "0 !important",
                        borderBottom: "none !important",
                      }}
                    ></TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        width: "16.66%",
                        padding: "0 !important",
                        borderBottom: "none !important",
                      }}
                    ></TableCell>
                  </TableRow>
                  <TableRow sx={{ padding: "0 !important" }}>
                    <TableCell
                      align="right"
                      sx={{
                        width: "16.74%",
                        padding: "0 !important",
                        borderBottom: "none !important",
                      }}
                    >
                      <pre>Provision Balance:</pre>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        width: "16.60%",
                        padding: "0 !important",
                        borderBottom: "none !important",
                      }}
                    >
                      <pre>
                        {reportDetail?.PROVISIONAL_BAL
                          ? parseFloat(reportDetail?.PROVISIONAL_BAL).toFixed(2)
                          : ""}
                      </pre>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        width: "16.74%",
                        padding: "0 !important",
                        borderBottom: "none !important",
                      }}
                    >
                      <pre>
                        {reportDetail?.DP_VISIBLE === "Y"
                          ? "Drawing Power:"
                          : ""}
                      </pre>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        width: "16.60%",
                        padding: "0 !important",
                        borderBottom: "none !important",
                      }}
                    >
                      <pre>
                        {reportDetail?.DP_VISIBLE === "Y" &&
                        reportDetail?.DRAWING_POWER
                          ? parseFloat(reportDetail?.DRAWING_POWER).toFixed(2)
                          : ""}
                      </pre>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        width: "16.66%",
                        padding: "0 !important",
                        borderBottom: "none !important",
                      }}
                    ></TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        width: "16.66%",
                        padding: "0 !important",
                        borderBottom: "none !important",
                      }}
                    ></TableCell>
                  </TableRow>
                  <TableRow sx={{ padding: "0 !important" }}>
                    <TableCell
                      align="right"
                      sx={{
                        width: "16.74%",
                        padding: "0 !important",
                        borderBottom: "none !important",
                      }}
                    >
                      <pre>Charge Balance:</pre>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        width: "16.60%",
                        padding: "0 !important",
                        borderBottom: "none !important",
                      }}
                    >
                      <pre>
                        {reportDetail?.CHARGE_BAL
                          ? parseFloat(reportDetail?.CHARGE_BAL).toFixed(2)
                          : ""}
                      </pre>
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        width: "16.74%",
                        padding: "0 !important",
                        borderBottom: "none !important",
                      }}
                    >
                      <pre>
                        {reportDetail?.NPA_CD_VISIBLE === "Y"
                          ? "NPA Code:"
                          : ""}
                      </pre>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        width: "16.60%",
                        padding: "0 !important",
                        borderBottom: "none !important",
                      }}
                    >
                      <pre>
                        {reportDetail?.NPA_CD_VISIBLE === "Y" &&
                        reportDetail?.NPA_CD
                          ? reportDetail?.NPA_CD
                          : ""}
                      </pre>
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        width: "16.66%",
                        padding: "0 !important",
                        borderBottom: "none !important",
                      }}
                    >
                      <pre>
                        {reportDetail?.HOLD_AMT_VISIBLE === "Y"
                          ? "Hold Amount:"
                          : ""}
                      </pre>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        width: "16.66%",
                        padding: "0 !important",
                        borderBottom: "none !important",
                      }}
                    >
                      <pre>
                        {reportDetail?.HOLD_AMT_VISIBLE === "Y" &&
                        reportDetail?.HOLD_AMT
                          ? parseFloat(reportDetail?.HOLD_AMT).toFixed(2)
                          : ""}
                      </pre>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Display Interest details in table */}
          <Box>
            <TableContainer>
              <Table
                // sx={{ minWidth: 650 }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow sx={{ padding: "0 !important" }}>
                    <TableCell
                      align="right"
                      sx={{
                        width: "5%",
                        padding: "0 !important",
                        borderBottom: "1px dashed black",
                      }}
                    ></TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        width: "17%",
                        padding: "0 !important",
                        borderBottom: "1px dashed black",
                      }}
                    >
                      <pre className={classes.typoStyle}>
                        {reportDetail?.CR_INT_LABEL
                          ? reportDetail?.CR_INT_LABEL
                          : ""}
                      </pre>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        width: "17%",
                        padding: "0 !important",
                        borderBottom: "1px dashed black",
                      }}
                    >
                      <pre className={classes.typoStyle}>
                        {acctInfo?.PARENT_TYPE?.trim() !== "SB"
                          ? "Ag Clg Int Amt"
                          : ""}
                      </pre>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        width: "17%",
                        padding: "0 !important",
                        borderBottom: "1px dashed black",
                      }}
                    >
                      <pre className={classes.typoStyle}>
                        {acctInfo?.PARENT_TYPE?.trim() !== "SB"
                          ? "Penal Int Amt"
                          : ""}
                      </pre>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        width: "15%",
                        padding: "0 !important",
                        borderBottom: "1px dashed black",
                      }}
                    >
                      <pre className={classes.typoStyle}>Interest Amt</pre>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        width: "10%",
                        padding: "0 !important",
                        borderBottom: "1px dashed black",
                      }}
                    >
                      <pre className={classes.typoStyle}>Int Rate</pre>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        width: "19%",
                        padding: "0 !important",
                        borderBottom: "1px dashed black",
                      }}
                    >
                      <pre className={classes.typoStyle}>Total Int Amt</pre>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    // Array.from({ length: 20 }).flatMap(() =>
                    reportDetail?.INT_ROWS?.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                            padding: "0 !important",
                          },
                        }}
                      >
                        <TableCell
                          align="right"
                          sx={{
                            borderBottom: "none !important",
                            padding: "0 !important",
                          }}
                        ></TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            borderBottom: "none !important",
                            padding: "0 !important",
                          }}
                        >
                          <pre>
                            {reportDetail?.CR_INT_LABEL
                              ? parseFloat(row.CT_INT).toFixed(2)
                              : ""}
                          </pre>
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            borderBottom: "none !important",
                            padding: "0 !important",
                          }}
                        >
                          <pre>
                            {acctInfo?.PARENT_TYPE?.trim() !== "SB"
                              ? parseFloat(row.A_INT).toFixed(2)
                              : ""}
                          </pre>
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            borderBottom: "none !important",
                            padding: "0 !important",
                          }}
                        >
                          <pre>
                            {acctInfo?.PARENT_TYPE?.trim() !== "SB"
                              ? parseFloat(row.P_INT).toFixed(2)
                              : ""}
                          </pre>
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            borderBottom: "none !important",
                            padding: "0 !important",
                          }}
                        >
                          <pre>{parseFloat(row.N_INT).toFixed(2)}</pre>
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            borderBottom: "none !important",
                            padding: "0 !important",
                          }}
                        >
                          <pre>{parseFloat(row.INT_RATE).toFixed(2)}</pre>
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            borderBottom: "none !important",
                            padding: "0 !important",
                            fontWeight: "bold",
                          }}
                        >
                          <pre>{parseFloat(row.TOT_INT).toFixed(2)}</pre>
                        </TableCell>
                      </TableRow>
                    ))
                    // )
                  }

                  {/* Display Total in row */}
                  <TableRow
                    sx={{
                      borderTop: "1px dashed black !important",
                      borderBottom: "1px dashed black !important",
                    }}
                  >
                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: "none !important",
                        fontWeight: "bold",
                        padding: "0 !important",
                      }}
                    >
                      <pre>Total:</pre>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: "none !important",
                        fontWeight: "bold",
                        padding: "0 !important",
                      }}
                    >
                      <pre>
                        {reportDetail?.CR_INT_LABEL
                          ? parseFloat(
                              reportDetail?.INT_ROWS?.reduce(
                                (sum, row) => sum + (Number(row.CT_INT) || 0),
                                0
                              ) || 0
                            ).toFixed(2)
                          : ""}
                      </pre>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: "none !important",
                        fontWeight: "bold",
                        padding: "0 !important",
                      }}
                    >
                      <pre>
                        {" "}
                        {acctInfo?.PARENT_TYPE?.trim() !== "SB"
                          ? parseFloat(
                              reportDetail?.INT_ROWS?.reduce(
                                (sum, row) => sum + (Number(row.A_INT) || 0),
                                0
                              ) || 0
                            ).toFixed(2)
                          : ""}
                      </pre>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: "none !important",
                        fontWeight: "bold",
                        padding: "0 !important",
                      }}
                    >
                      <pre>
                        {acctInfo?.PARENT_TYPE?.trim() !== "SB"
                          ? parseFloat(
                              reportDetail?.INT_ROWS?.reduce(
                                (sum, row) => sum + (Number(row.P_INT) || 0),
                                0
                              ) || 0
                            ).toFixed(2)
                          : ""}
                      </pre>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: "none !important",
                        fontWeight: "bold",
                        padding: "0 !important",
                      }}
                    >
                      <pre>
                        {parseFloat(
                          reportDetail?.INT_ROWS?.reduce(
                            (sum, row) => sum + (Number(row.N_INT) || 0),
                            0
                          ) || 0
                        ).toFixed(2)}
                      </pre>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: "none !important",
                        padding: "0 !important",
                      }}
                    ></TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: "none !important",
                        fontWeight: "bold",
                        padding: "0 !important",
                      }}
                    >
                      <pre>
                        {parseFloat(
                          reportDetail?.INT_ROWS?.reduce(
                            (sum, row) => sum + (Number(row.TOT_INT) || 0),
                            0
                          ) || 0
                        ).toFixed(2)}
                      </pre>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <pre>{reportDetail?.INT_REMARKS}</pre>
            <Box>
              <pre style={{ textAlign: "right" }}>
                Total with Interest:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {parseFloat(
                    Number(reportDetail?.TRAN_BAL || 0) +
                      Number(reportDetail?.PROVISIONAL_BAL || 0) +
                      Number(reportDetail?.CHARGE_BAL || 0) +
                      (acctInfo?.PARENT_TYPE?.trim() === "SB"
                        ? reportDetail?.INT_ROWS?.reduce(
                            (sum, row) => sum + (Number(row.TOT_INT) || 0),
                            0
                          ) || 0
                        : -1 *
                            reportDetail?.INT_ROWS?.reduce(
                              (sum, row) => sum + (Number(row.TOT_INT) || 0),
                              0
                            ) || 0)
                  ).toFixed(2)}
                </span>
              </pre>
              {reportDetail?.HOLD_AMT_VISIBLE === "Y" && (
                <pre style={{ textAlign: "right" }}>
                  Total with interest and Hold amount:
                  <span style={{ fontWeight: "bold" }}>
                    {parseFloat(
                      (reportDetail?.INT_ROWS?.reduce(
                        (sum, row) => sum + (Number(row.TOT_INT) || 0),
                        0
                      ) ||
                        0 - reportDetail?.HOLD_AMT) ??
                        0
                    ).toFixed(2)}
                  </span>
                </pre>
              )}
            </Box>
          </Box>
        </Box>
        <DialogActions>
          <GradientButton
            onClick={() => {
              if (reportDetail?.REVERT_BUTTON !== "Y") {
                handlePrintPage();
              }
            }}
          >
            {"Print"}
          </GradientButton>
          {reportDetail?.REVERT_BUTTON !== "Y" && (
            <GradientButton onClick={handleApplyInt} color={"primary"}>
              {"Apply"}
            </GradientButton>
          )}
          {reportDetail?.REVERT_BUTTON === "Y" && (
            <GradientButton onClick={handleRevertInt} color={"primary"}>
              {"Revert"}
            </GradientButton>
          )}
          <GradientButton onClick={() => closeDialog()}>Close</GradientButton>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

type SingleAccountInterestCustomProps = {
  closeDialog?: any;
  open?: any;
  reqData?: any;
  date?: any;
  reportHeading?: any;
  reportDetail?: any;
  acctInfo?: any;
};
export const SingleAccountInterestReport: React.FC<
  SingleAccountInterestCustomProps
> = ({
  closeDialog,
  open,
  reqData,
  date,
  reportHeading,
  reportDetail,
  acctInfo,
}) => {
  return (
    <ClearCacheProvider>
      <SingleAccountInterestCustom
        closeDialog={closeDialog}
        open={open}
        reqData={reqData}
        date={date}
        reportHeading={reportHeading}
        reportDetail={reportDetail}
        acctInfo={acctInfo}
      />
    </ClearCacheProvider>
  );
};
