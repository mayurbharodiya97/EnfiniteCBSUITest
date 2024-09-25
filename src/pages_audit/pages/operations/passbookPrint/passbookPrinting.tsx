import {
  Box,
  Dialog,
  Grid,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import RetrieveIcon from "assets/icons/retrieveIcon";
import { format } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { ViewStatement } from "pages_audit/acct_Inquiry/viewStatement";
import { AuthContext } from "pages_audit/auth";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { useLocation } from "react-router-dom";
import * as API from "./api";
import {
  Transition,
  usePopupContext,
  GradientButton,
  queryClient,
  utilFunction,
  GridMetaDataType,
} from "@acuteinfo/common-base";

export const PassbookPrint = () => {
  const location = useLocation();
  const { passbookDetail } = location.state || { passbookDetail: [] };
  const { parameterRef } = location.state || { parameterRef: [] };
  const { accountDetailsRef } = location.state || { accountDetailsRef: [] };
  const { acctInqDataRef } = location.state || { acctInqDataRef: [] };
  const printRef = useRef<any>(null);
  const [findAccount, setFindAccount] = useState(
    !passbookDetail || passbookDetail.length === 0
  );

  const [isPrinting, setIsPrinting] = useState(false);
  const themes = useTheme();
  const fullScreen = useMediaQuery(themes.breakpoints.down("xs"));
  const [entriesToPrint, setEntriesToPrint] = useState([]);
  const [printConfirmed, setPrintConfirmed] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState<any>();
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  const { t } = useTranslation();
  let currentPath = useLocation().pathname;

  const maxPage = Math.max(
    ...passbookDetail.map((entry: any) => parseInt(entry.PAGE_NO))
  );

  // Change date format
  const acctInqDate = {
    PASS_BOOK_DT:
      acctInqDataRef?.PASS_BOOK_DT &&
      acctInqDataRef?.PASS_BOOK_DT.endsWith(".0")
        ? format(
            new Date(acctInqDataRef?.PASS_BOOK_DT.slice(0, -2)),
            "dd-MM-yyyy"
          )
        : "",
  };
  const parameterDate = {
    PASS_BOOK_DT: parameterRef?.PASS_BOOK_DT
      ? format(new Date(parameterRef?.PASS_BOOK_DT), "dd-MM-yyyy")
      : "",
  };
  const accountDetailsDate = {
    PASS_BOOK_DT: accountDetailsRef?.PASS_BOOK_DT
      ? format(new Date(accountDetailsRef?.PASS_BOOK_DT), "dd-MM-yyyy")
      : "",
  };

  const passbookPrintingCompleted: any = useMutation(
    "passbookPrintingCompleted",
    API.passbookPrintingCompleted,
    {
      onSuccess: (data) => {},
      onError: async (error: any) => {
        const btnName = await MessageBox({
          messageTitle: "ValidationFailed",
          message: error?.error_msg ?? "",
          icon: "ERROR",
        });
        CloseMessageBox();
      },
    }
  );

  const handlePrintPage = useReactToPrint({
    content: () => printRef.current,

    onAfterPrint: async () => {
      setPrintConfirmed(true);
      setIsPrinting(true);
      if (currentPage !== maxPage) {
        const btnName = await MessageBox({
          messageTitle: "Alert",
          message: "NextPageAlert",
          buttonNames: ["Yes", "No"],
        });
        if (btnName === "Yes") {
          setCurrentPage(currentPage + 1);
        }
        if (btnName === "No") {
          setCurrentPage(currentPage);
        }
      }

      if (currentPage === maxPage) {
        setEntriesToPrint([]);
        setIsPrinting(false);
        setCurrentPage(1);
        if (parameterRef?.PID_DESCRIPION === "D") {
          if (
            (accountDetailsDate?.PASS_BOOK_DT || acctInqDate?.PASS_BOOK_DT) >
            parameterDate?.PASS_BOOK_DT
          ) {
            const account = `${authState.companyID.trim()}-${parameterRef?.BRANCH_CD.trim()}-${parameterRef?.ACCT_TYPE.trim()}-${parameterRef?.ACCT_CD.trim()}`;
            const btnName = await MessageBox({
              messageTitle: "Alert",
              message: `${t(`PassbookUpdateMessage`, {
                account: account,
                date:
                  accountDetailsDate?.PASS_BOOK_DT || acctInqDate?.PASS_BOOK_DT,
              })}`,
              buttonNames: ["Yes", "No"],
            });

            if (btnName === "Yes") {
              passbookPrintingCompleted.mutate({
                _isNewRow: true,
                _isDeleteRow: false,
                COMP_CD: authState.companyID,
                BRANCH_CD: parameterRef?.BRANCH_CD,
                ACCT_TYPE: parameterRef?.ACCT_TYPE,
                ACCT_CD: parameterRef?.ACCT_CD,
                STATEMENT_FROM_DT: parameterRef?.PASS_BOOK_DT,
                STATEMENT_TO_DT: parameterRef?.PASS_BOOK_TO_DT,
                DUP_FLAG: "Y",
                LINE_ID: passbookDetail[passbookDetail.length - 1]?.LINE_ID,
              });
            }
            if (btnName === "No") {
              passbookPrintingCompleted.mutate({
                _isNewRow: true,
                _isDeleteRow: false,
                COMP_CD: authState.companyID,
                BRANCH_CD: parameterRef?.BRANCH_CD,
                ACCT_TYPE: parameterRef?.ACCT_TYPE,
                ACCT_CD: parameterRef?.ACCT_CD,
                STATEMENT_FROM_DT: parameterRef?.PASS_BOOK_DT,
                STATEMENT_TO_DT: parameterRef?.PASS_BOOK_TO_DT,
                DUP_FLAG: "N",
                LINE_ID: passbookDetail[passbookDetail.length - 1]?.LINE_ID,
              });
            }
          } else {
            const btnName = await MessageBox({
              messageTitle: "Confirmation",
              message: "Passbook Print successfully.?",
              buttonNames: ["Yes", "No"],
            });

            if (btnName === "Yes") {
              passbookPrintingCompleted.mutate({
                _isNewRow: true,
                _isDeleteRow: false,
                COMP_CD: authState.companyID,
                BRANCH_CD: parameterRef?.BRANCH_CD,
                ACCT_TYPE: parameterRef?.ACCT_TYPE,
                ACCT_CD: parameterRef?.ACCT_CD,
                STATEMENT_FROM_DT: parameterRef?.PASS_BOOK_DT,
                STATEMENT_TO_DT: parameterRef?.PASS_BOOK_TO_DT,
                DUP_FLAG: "N",
                LINE_ID: passbookDetail[passbookDetail.length - 1]?.LINE_ID,
              });
            }
          }
        }
      }
    },
  });

  const updateEntriesToPrint = (page) => {
    const filteredEntries = passbookDetail.filter(
      (entry: any) => entry.PAGE_NO === page.toString()
    );
    setEntriesToPrint(filteredEntries);
  };

  useEffect(() => {
    if (currentPage !== lastPage) {
      updateEntriesToPrint(currentPage);
      setLastPage(currentPage);
    }
  }, [currentPage, passbookDetail, lastPage, MessageBox]);

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getPassbookStatement"]);
      queryClient.removeQueries(["passbookPrintingCompleted"]);
      queryClient.removeQueries(["getAcctInqStatement"]);
      queryClient.removeQueries(["passbookPrintingValidation"]);
    };
  }, []);
  useEffect(() => {
    if (
      (passbookDetail?.[0]?.LINE_ID !== "0" ||
        passbookDetail?.[0]?.PAGE_NO !== "0") &&
      passbookDetail.length > 0
    ) {
      setIsPrinting(true);
      setCurrentPage(1);
      updateEntriesToPrint(1);
    }
  }, [passbookDetail]);

  const handleRetrieve = () => {
    setFindAccount(true);
  };
  const handlePrint = () => {
    setIsPrinting(true);
    setCurrentPage(1);
    updateEntriesToPrint(1);
  };

  return (
    <>
      <Box>
        <Grid
          container
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          sx={{
            fontWeight: "bold",
            fontFamily: "Roboto, sans-serif",
            backgroundColor: "var(--theme-color3)",
            padding: "10px",
            textAlign: "center",
            marginBottom: "20px",
            color: "var(--theme-color2)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Grid>
            <Typography variant="h6">
              {utilFunction.getDynamicLabel(
                currentPath,
                authState?.menulistdata,
                true
              )}
            </Typography>
          </Grid>
          <Grid
            sx={{
              position: "absolute",
              zIndex: "1",
              right: "0px",
              paddingRight: "10px",
            }}
            xs={12}
          >
            {" "}
            {(passbookDetail?.[0]?.LINE_ID !== "0" ||
              passbookDetail?.[0]?.PAGE_NO !== "0") &&
            passbookDetail.length > 0 ? (
              <Tooltip title={t("Print")}>
                <GradientButton
                  onClick={handlePrint}
                  color={"primary"}
                  endicon="Print"
                  rotateIcon="scale(1.4) rotateY(360deg)"
                >
                  {t("Print")}
                </GradientButton>
              </Tooltip>
            ) : null}
            <Tooltip title={t("Retrieve")}>
              <GradientButton onClick={handleRetrieve} color={"primary"}>
                {t("Retrieve")}
                <RetrieveIcon />
              </GradientButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
      {findAccount && (
        <ViewStatement
          open={findAccount}
          onClose={() => setFindAccount(false)}
          rowsData={null}
          screenFlag={"ACCT_PASSBOOK"}
          close={() => {}}
        />
      )}

      {passbookDetail &&
      Array.isArray(passbookDetail) &&
      passbookDetail.length > 0 ? (
        <>
          <div
            style={{
              display: "flex",
            }}
          >
            <Box
              sx={{
                padding: "10px",
                border: "2px solid var(--theme-color3)",
                borderRadius: "8px",
                margin: "0px auto",
                overflowX: "auto",
              }}
            >
              {passbookDetail.map((item, index) => (
                <Grid item>
                  {item.PASSBOOK_TEXT !== "" ? (
                    <pre key={index}>{item.PASSBOOK_TEXT}</pre>
                  ) : (
                    <br key={index} />
                  )}
                </Grid>
              ))}
            </Box>
          </div>
        </>
      ) : (
        <div
          style={{
            textAlign: "center",
            fontStyle: "italic",
            fontWeight: "bold",
            color: "rgba(133, 130, 130, 0.8)",
          }}
        >
          {t("NoDataFound")}
        </div>
      )}
      {/* Printing statement */}

      {isPrinting ? (
        <Dialog
          open={isPrinting}
          // @ts-ignore
          TransitionComponent={Transition}
          fullScreen={fullScreen}
          PaperProps={{
            style: {
              width: fullScreen ? "100%" : "70%",
              minWidth: fullScreen ? "100%" : "50%",
              borderRadius: "8px",
              padding: "16px",
            },
          }}
        >
          <Box
            ref={printRef}
            sx={{
              paddingLeft: "10px",
              width: "100%",
            }}
          >
            {entriesToPrint.map((entry: any, index) => (
              <div key={index}>
                {entry.PASSBOOK_TEXT !== "" ? (
                  <pre key={index}>{entry.PASSBOOK_TEXT}</pre>
                ) : (
                  <br key={index} />
                )}
              </div>
            ))}
          </Box>

          {printConfirmed &&
            currentPage <=
              Math.max(
                ...passbookDetail.map((entry: any) => parseInt(entry.PAGE_NO))
              ) && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "16px",
                }}
              >
                <GradientButton
                  onClick={handlePrintPage}
                  color={"primary"}
                  endicon="Print"
                  rotateIcon="scale(1.4) rotateY(360deg)"
                  style={{ alignSelf: "center" }}
                >
                  {t("Print")}
                </GradientButton>
                <GradientButton
                  onClick={() => setIsPrinting(false)}
                  color={"primary"}
                  style={{ alignSelf: "center" }}
                >
                  {t("Cancel")}
                </GradientButton>
              </Box>
            )}
        </Dialog>
      ) : null}
    </>
  );
};
