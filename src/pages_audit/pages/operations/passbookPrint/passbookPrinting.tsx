import {
  AppBar,
  Box,
  CircularProgress,
  Dialog,
  Grid,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import RetrieveIcon from "assets/icons/retrieveIcon";
import { format } from "date-fns";
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
  FormWrapper,
  MetaDataType,
  SubmitFnType,
  InitialValuesType,
  Alert,
} from "@acuteinfo/common-base";
import { PassbookPrintingInq } from "./passbookMetadata";

type PassbookPrintingCustomProps = {
  screenFlag?: any;
  PassbookPrintingData?: any;
  parameterFlagDate?: any;
  acctInqDetail?: any;
  handleClose?: any;
};

export const PassbookPrint: React.FC<PassbookPrintingCustomProps> = ({
  screenFlag,
  PassbookPrintingData,
  parameterFlagDate,
  acctInqDetail,
  handleClose,
}) => {
  const [passbookDetail, setPassbookDetail] = useState<any>([]);
  const parameterRef = useRef<any>(null);
  const accountFromDateRef = useRef<any>();
  const printRef = useRef<any>(null);
  const [findAccount, setFindAccount] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
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

  // Sett screenFlag data
  useEffect(() => {
    if (screenFlag) {
      setPassbookDetail(PassbookPrintingData);
      accountFromDateRef.current = acctInqDetail ?? "";
      parameterRef.current = parameterFlagDate ?? "";
    }
  }, [screenFlag]);
  // Found maximum Page number
  const maxPage = Math.max(
    ...passbookDetail?.map((entry: any) => parseInt(entry?.PAGE_NO))
  );

  // Get passbook details
  const passbookInqData: any = useMutation(
    "getPassbookStatement",
    API.getPassbookStatement,
    {
      onSuccess: async (data) => {
        setPassbookDetail(data);
        setFindAccount(false);
      },
      onError: async (error: any) => {
        CloseMessageBox();
      },
    }
  );

  // Validate passbook account details
  const passbookValidation: any = useMutation(
    "passbookPrintingValidation",
    API.passbookPrintingValidation,
    {
      onSuccess: async (data: any) => {
        if (data?.[0]?.O_STATUS === "999") {
          const btnName = await MessageBox({
            messageTitle: "ValidationFailed",
            message: data?.[0]?.O_MESSAGE,
            buttonNames: ["Ok"],
            icon: "ERROR",
          });
        } else if (data?.[0]?.O_STATUS === "0") {
          passbookInqData?.mutate({
            COMP_CD: authState?.companyID ?? "",
            BRANCH_CD: parameterRef?.current?.BRANCH_CD ?? "",
            ACCT_TYPE: parameterRef?.current?.ACCT_TYPE ?? "",
            ACCT_CD: parameterRef?.current?.ACCT_CD ?? "",
            ENTERED_BRANCH_CD: parameterRef?.current?.BRANCH_CD ?? "",
            FROM_DT: parameterRef?.current?.PASS_BOOK_DT ?? "",
            TO_DT: parameterRef?.current?.PASS_BOOK_TO_DT ?? "",
            PRINT_PAGE: parameterRef?.current?.PID_DESCRIPION ?? "",
            TEMPL_TRAN_CD: parameterRef?.current?.TRAN_CD ?? "",
            LAST_LINE_NO: parameterRef?.current?.PASS_BOOK_LINE ?? "",
            REPRINT: parameterRef?.current?.REPRINT_VALUE ?? "",
          });
        }
      },
      onError: async (error: any) => {
        CloseMessageBox();
      },
    }
  );

  // Change date format
  const parameterDate = {
    PASS_BOOK_DT: parameterRef?.current?.PASS_BOOK_DT
      ? format(new Date(parameterRef?.current?.PASS_BOOK_DT), "dd-MM-yyyy")
      : "",
  };
  const accountDetailsDate = {
    PASS_BOOK_DT: accountFromDateRef?.current?.PASS_BOOK_DT
      ? format(
          new Date(accountFromDateRef?.current?.PASS_BOOK_DT),
          "dd-MM-yyyy"
        )
      : "",
  };

  // Api for passbook printing completed
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

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    endSubmit(true);
    parameterRef.current = data;
    passbookValidation?.mutate({
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: parameterRef?.current?.BRANCH_CD ?? "",
      ACCT_TYPE: parameterRef?.current?.ACCT_TYPE ?? "",
      ACCT_CD: parameterRef?.current?.ACCT_CD ?? "",
      TRAN_CD: parameterRef?.current?.TRAN_CD ?? "",
      FLAG: "",
      LINE_ID: "",
      LINE_PER_PAGE: "",
      FROM_DT: (parameterRef.current["PASS_BOOK_DT"] = format(
        new Date(parameterRef?.current["PASS_BOOK_DT"]),
        "dd/MMM/yyyy"
      )),
      GD_DATE: (parameterRef.current["PASS_BOOK_TO_DT"] = format(
        new Date(parameterRef?.current["PASS_BOOK_TO_DT"]),
        "dd/MMM/yyyy"
      )),
      SCREEN_REF: "RPT/430",
    });
  };

  // Print the passbook details
  const handlePrintPage = useReactToPrint({
    content: () => printRef.current,

    onAfterPrint: async () => {
      setPrintConfirmed(true);
      setIsPrinting(true);
      if (currentPage !== maxPage) {
        const btnName = await MessageBox({
          messageTitle: "Confirmation",
          message: "NextPageAlert",
          buttonNames: ["Yes", "No"],
          icon: "CONFIRM",
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
        if (parameterRef?.current?.PID_DESCRIPION === "D") {
          if (accountDetailsDate?.PASS_BOOK_DT > parameterDate?.PASS_BOOK_DT) {
            const account = `${authState?.companyID?.trim()}-${parameterRef?.current?.BRANCH_CD?.trim()}-${parameterRef?.current?.ACCT_TYPE?.trim()}-${parameterRef?.current?.ACCT_CD?.trim()}`;
            const btnName = await MessageBox({
              messageTitle: "Alert",
              message: `${t(`PassbookUpdateMessage`, {
                account: account,
                date: accountDetailsDate?.PASS_BOOK_DT,
              })}`,
              buttonNames: ["Yes", "No"],
              loadingBtnName: ["Yes", "No"],
              icon: "CONFIRM",
            });

            if (btnName === "Yes") {
              passbookPrintingCompleted?.mutate({
                _isNewRow: true,
                _isDeleteRow: false,
                COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: parameterRef?.current?.BRANCH_CD ?? "",
                ACCT_TYPE: parameterRef?.current?.ACCT_TYPE ?? "",
                ACCT_CD: parameterRef?.current?.ACCT_CD ?? "",
                STATEMENT_FROM_DT: parameterRef?.current?.PASS_BOOK_DT ?? "",
                STATEMENT_TO_DT: parameterRef?.current?.PASS_BOOK_TO_DT ?? "",
                DUP_FLAG: "Y",
                LINE_ID:
                  passbookDetail[passbookDetail?.length - 1]?.LINE_ID ?? "",
              });
            }
            if (btnName === "No") {
              passbookPrintingCompleted?.mutate({
                _isNewRow: true,
                _isDeleteRow: false,
                COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: parameterRef?.current?.BRANCH_CD ?? "",
                ACCT_TYPE: parameterRef?.current?.ACCT_TYPE ?? "",
                ACCT_CD: parameterRef?.current?.ACCT_CD ?? "",
                STATEMENT_FROM_DT: parameterRef?.current?.PASS_BOOK_DT ?? "",
                STATEMENT_TO_DT: parameterRef?.current?.PASS_BOOK_TO_DT ?? "",
                DUP_FLAG: "N",
                LINE_ID:
                  passbookDetail[passbookDetail?.length - 1]?.LINE_ID ?? "",
              });
            }
          } else {
            const btnName = await MessageBox({
              messageTitle: "Confirmation",
              message: "Passbook Print successfully.?",
              buttonNames: ["Yes", "No"],
              icon: "CONFIRM",
            });

            if (btnName === "Yes") {
              passbookPrintingCompleted?.mutate({
                _isNewRow: true,
                _isDeleteRow: false,
                COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: parameterRef?.current?.BRANCH_CD ?? "",
                ACCT_TYPE: parameterRef?.current?.ACCT_TYPE ?? "",
                ACCT_CD: parameterRef?.current?.ACCT_CD ?? "",
                STATEMENT_FROM_DT: parameterRef?.current?.PASS_BOOK_DT ?? "",
                STATEMENT_TO_DT: parameterRef?.current?.PASS_BOOK_TO_DT ?? "",
                DUP_FLAG: "N",
                LINE_ID:
                  passbookDetail[passbookDetail?.length - 1]?.LINE_ID ?? "",
              });
            }
          }
        }
      }
    },
  });

  // Update the printing data page by page
  const updateEntriesToPrint = (page) => {
    const filteredEntries = passbookDetail?.filter(
      (entry: any) => entry?.PAGE_NO === page?.toString()
    );
    setEntriesToPrint(filteredEntries);
  };

  // Upadte passbook priniting page number
  useEffect(() => {
    if (currentPage !== lastPage) {
      updateEntriesToPrint(currentPage);
      setLastPage(currentPage);
    }
  }, [currentPage, passbookDetail, lastPage, MessageBox]);

  // Clear cache
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getPassbookStatement"]);
      queryClient.removeQueries(["passbookPrintingCompleted"]);
      queryClient.removeQueries(["getAcctInqStatement"]);
      queryClient.removeQueries(["passbookPrintingValidation"]);
    };
  }, []);

  // Logic for Front/First page details
  useEffect(() => {
    if (
      (passbookDetail?.[0]?.LINE_ID !== "0" ||
        passbookDetail?.[0]?.PAGE_NO !== "0") &&
      passbookDetail?.length > 0
    ) {
      setIsPrinting(true);
      setCurrentPage(1);
      updateEntriesToPrint(1);
    }
  }, [passbookDetail]);

  const handleRetrieve = () => {
    setFindAccount(true);
    setPassbookDetail([]);
  };
  const handlePrint = () => {
    setIsPrinting(true);
    setCurrentPage(1);
    updateEntriesToPrint(1);
  };
  const handleButonDisable = (disable) => {
    setDisableButton(disable);
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: "var(--theme-color5)",
          margin: "2px",
          width: "auto",
          marginBottom: "10px",
        }}
      >
        <Toolbar
          sx={{
            paddingLeft: "24px",
            paddingRight: "24px",
            minHeight: "48px !important",
          }}
        >
          <Typography
            style={{ flexGrow: 1 }}
            sx={{
              color: "var(--theme-color2)",
              fontSize: "1.25rem",
              fontFamily: "Roboto, Helvetica, Arial, sans-serif",
              fontWeight: 500,
              lineHeight: "1.6px",
              letterSpacing: "0.0075em",
            }}
          >
            {utilFunction.getDynamicLabel(
              currentPath,
              authState?.menulistdata,
              true
            )}
          </Typography>
          {(passbookDetail?.[0]?.LINE_ID !== "0" ||
            passbookDetail?.[0]?.PAGE_NO !== "0") &&
          passbookDetail?.length > 0 ? (
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
          {Boolean(screenFlag) ? (
            <Tooltip title={t("Close")}>
              <GradientButton
                onClick={() => handleClose(false)}
                color={"primary"}
                endicon="CancelOutlined"
                rotateIcon="scale(1.4) rotateY(360deg)"
              >
                {t("Close")}
              </GradientButton>
            </Tooltip>
          ) : null}
          {!Boolean(screenFlag) ? (
            <Tooltip title={t("Retrieve")}>
              <GradientButton onClick={handleRetrieve} color={"primary"}>
                {t("Retrieve")}
                <RetrieveIcon />
              </GradientButton>
            </Tooltip>
          ) : null}
        </Toolbar>
      </AppBar>

      {/* Find passbook details */}
      {findAccount && !Boolean(screenFlag) && (
        <Dialog
          open={findAccount}
          PaperProps={{
            style: {
              width: "100%",
              overflow: "auto",
            },
          }}
          maxWidth="sm"
        >
          {(passbookValidation?.error || passbookInqData?.error) && (
            <Alert
              severity="error"
              errorMsg={
                passbookValidation?.error?.error_msg ||
                passbookInqData?.error?.error_msg ||
                t("Somethingwenttowrong")
              }
              errorDetail={
                passbookValidation?.error?.error_detail ||
                passbookInqData?.error?.error_detail ||
                ""
              }
              color="error"
            />
          )}
          <FormWrapper
            key={`PassbookPrintingInqForm`}
            metaData={PassbookPrintingInq as MetaDataType}
            initialValues={
              {
                BRANCH_CD: authState?.user?.branchCode ?? "",
              } as InitialValuesType
            }
            onSubmitHandler={onSubmitHandler}
            formStyle={{
              background: "white",
            }}
            controlsAtBottom={true}
            formState={{
              handleButonDisable: handleButonDisable,
              MessageBox: MessageBox,
              docCD: "RPT/430",
            }}
            setDataOnFieldChange={(action, payload) => {
              if (action === "accountFromDate") {
                accountFromDateRef.current = payload;
              }
            }}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton
                  style={{ marginRight: "5px" }}
                  onClick={(event) => {
                    handleSubmit(event, "Save");
                  }}
                  color={"primary"}
                  disabled={
                    passbookInqData?.isLoading ||
                    passbookInqData?.isFetching ||
                    passbookValidation?.isLoading ||
                    passbookValidation?.isFetching ||
                    disableButton
                  }
                  endicon={
                    passbookInqData?.isLoading ||
                    passbookInqData?.isFetching ||
                    passbookValidation?.isLoading ||
                    passbookValidation?.isFetching
                      ? undefined
                      : "CheckCircleOutline"
                  }
                  rotateIcon="scale(1.4)"
                >
                  {passbookValidation?.isLoading ||
                  passbookInqData?.isLoading ? (
                    <CircularProgress size={25} thickness={4.6} />
                  ) : (
                    t("Ok")
                  )}
                </GradientButton>
                <GradientButton
                  onClick={() => setFindAccount(false)}
                  color={"primary"}
                  endicon="CancelOutlined"
                  rotateIcon="scale(1.4) rotateY(360deg)"
                >
                  {t("Close")}
                </GradientButton>
              </>
            )}
          </FormWrapper>
        </Dialog>
      )}

      {/* Display/View passbook details */}
      {passbookDetail &&
      Array.isArray(passbookDetail) &&
      passbookDetail?.length > 0 ? (
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
                  {item?.PASSBOOK_TEXT !== "" ? (
                    <pre key={index}>{item?.PASSBOOK_TEXT}</pre>
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

      {/* Print Passbook details */}
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
            {entriesToPrint?.map((entry: any, index) => (
              <div key={index}>
                {entry?.PASSBOOK_TEXT !== "" ? (
                  <pre key={index}>{entry?.PASSBOOK_TEXT}</pre>
                ) : (
                  <br key={index} />
                )}
              </div>
            ))}
          </Box>

          {printConfirmed &&
            currentPage <=
              Math.max(
                ...passbookDetail?.map((entry: any) => parseInt(entry?.PAGE_NO))
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
