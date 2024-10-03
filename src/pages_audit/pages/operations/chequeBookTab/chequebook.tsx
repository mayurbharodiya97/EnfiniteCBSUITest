import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  Grid,
  LinearProgress,
  Tab,
  Tabs,
} from "@mui/material";
import {
  GridWrapper,
  MetaDataType,
  FormWrapper,
  GridMetaDataType,
  Alert,
  SubmitFnType,
  ActionTypes,
  Transition,
} from "@acuteinfo/common-base";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ChequeBookEntryMetaData } from "./chequebookEntryMetadata";
import {
  ChequebookDtlGridMetaData,
  ChequeReturnHistoryGridMetaData,
} from "./chequebookDetailMetadata";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";

import {
  getChequebookDTL,
  getReturnHistory,
  getTodayClearing,
  saveChequebookData,
  validateDeleteData,
  validateInsert,
} from "./api";
import { enqueueSnackbar } from "notistack";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChequeDtlGrid } from "./chequeDetail/chequeDetail";
import { MultipleChequebook } from "./multipleChequebook/multipleChequebook";
import { IssuedChequebook } from "./issuedChequebook/issuedChequebook";
import {
  usePopupContext,
  RemarksAPIWrapper,
  ClearCacheProvider,
  queryClient,
} from "@acuteinfo/common-base";
import { LinearProgressBarSpacer } from "components/common/custom/linerProgressBarSpacer";
import { cloneDeep } from "lodash";
import { format, parse, subYears } from "date-fns";

const ChequebookTabCustom = ({ screenFlag, reqData }) => {
  const chequeActions: ActionTypes[] = [
    {
      actionName: "view-details",
      actionLabel: "ViewDetail",
      multiple: false,
      rowDoubleClick: true,
    },
    {
      actionName: "today's-Clearing",
      actionLabel: "Today's-Clearing",
      multiple: undefined,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
    {
      actionName: "cheque-return-history",
      actionLabel: "Cheque Return History",
      multiple: undefined,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
  ];
  const chequeReturnHistoryActions: ActionTypes[] = [
    {
      actionName: "Close",
      actionLabel: "Close",
      multiple: undefined,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
  ];

  const [isData, setIsData] = useState({
    isDelete: false,
    isVisible: false,
    value: "tab1",
    closeAlert: true,
  });
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const myMasterRef = useRef<any>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const reqDataRef = useRef<any>({});
  const chequesEntryDtlForTrnmetaData = useRef<any>(null);
  const [chequebookIssueDtlOpen, setChequebookIssueDtlOpen] = useState(false);
  const [chequeReturnHistoryOpen, setChequebookReturnHistoryOpen] =
    useState(false);
  const [chequeReturnHistoryDtl, setChequebookReturnHistoryDtl] = useState([
    false,
  ]);

  // API calling function for issued chequebook grid-details
  const getChequeDetail: any = useMutation(
    "getChequebookDTL",
    getChequebookDTL,
    {
      onError: () => {
        setIsData((old) => ({ ...old, closeAlert: true }));
      },
    }
  );
  const todaysCleringDtl: any = useMutation(
    "getTodayClearing",
    getTodayClearing,
    {
      onSuccess: async (data) => {},
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
  const chequeReturnHistory: any = useMutation(
    "getReturnHistory",
    getReturnHistory,
    {
      onSuccess: async (data) => {
        setChequebookReturnHistoryDtl(data);
      },
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

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getChequebookEntryList", { reqData }], () => getChequebookDTL(reqData), {
    enabled: Boolean(screenFlag === "chequesDtlForTrn"),
  });

  if (screenFlag === "chequesDtlForTrn") {
    chequesEntryDtlForTrnmetaData.current = cloneDeep(
      ChequebookDtlGridMetaData
    );
    if (chequesEntryDtlForTrnmetaData?.current?.gridConfig) {
      chequesEntryDtlForTrnmetaData.current.gridConfig.containerHeight = {
        min: "36vh",
        max: "30vh",
      };
      chequesEntryDtlForTrnmetaData.current.gridConfig.gridLabel =
        "ChequeBookIssued";
    }
    if (chequesEntryDtlForTrnmetaData?.current?.columns) {
      chequesEntryDtlForTrnmetaData.current.columns =
        chequesEntryDtlForTrnmetaData?.current?.columns?.map((column) => {
          if (column?.componentType === "buttonRowCell") {
            return {
              ...column,
              isVisible: false,
            };
          }
          return column;
        });
    }
  }

  // API calling function for validate data before Insert
  const validateInsertData: any = useMutation(
    "validateInsert",
    validateInsert,
    {
      onSuccess: (data) => {
        async function validData() {
          let insertReq = reqDataRef.current?.insertReq;
          let apiReq = {
            _isNewRow: true,
            _isDeleteRow: false,
            COMP_CD: authState?.companyID,
            BRANCH_CD: insertReq?.BRANCH_CD,
            ACCT_TYPE: insertReq?.ACCT_TYPE,
            ACCT_CD: insertReq?.ACCT_CD,
            CHEQUE_FROM: insertReq?.CHEQUE_FROM,
            CHEQUE_TOTAL: insertReq?.CHEQUE_TOTAL,
            CHARACTERISTICS: insertReq?.CHARACTERISTICS,
            PAYABLE_AT_PAR: insertReq?.PAYABLE_AT_PAR,
            REQUISITION_DT: insertReq?.REQUISITION_DT,
            REMARKS: insertReq?.REMARKS,
            SR_CD: insertReq?.SR_CD,
            NO_OF_CHQBK: insertReq?.NO_OF_CHQBK,
            AUTO_CHQBK_FLAG: insertReq?.AUTO_CHQBK_FLAG,
            SERVICE_TAX: insertReq?.SERVICE_TAX,
            AMOUNT: insertReq?.AMOUNT,
            ENTERED_BRANCH_CD: insertReq?.ENTERED_BRANCH_CD,
            REQUEST_CD: "",
          };
          // After validating data then inside the response multiple message with multiple statuses, so merge all the same status messages and conditionally display status-wise.
          if (Array.isArray(data) && data?.length > 0) {
            const btnName = async (buttonNames, msg, msgTitle, icon) => {
              return await MessageBox({
                messageTitle: msgTitle,
                message: msg,
                buttonNames: buttonNames,
                loadingBtnName: ["Yes"],
                icon: icon,
              });
            };
            let messages = { "999": [], "99": [], "9": [], "0": [] };
            let status = { "999": false, "99": false, "9": false, "0": false };

            data.forEach((item) => {
              if (messages[item.O_STATUS] !== undefined) {
                messages[item.O_STATUS].push(`⁕ ${item?.O_MESSAGE}`);
                status[item.O_STATUS] = true;
              }
            });
            let concatenatedMessages = {};
            for (let key in messages) {
              concatenatedMessages[key] = messages[key].join("\n");
            }
            if (status["999"]) {
              btnName(
                ["Ok"],
                concatenatedMessages["999"],
                "ValidationFailed",
                "ERROR"
              );
            } else if (status["99"]) {
              let buttonName = await btnName(
                ["Yes", "No"],
                concatenatedMessages["99"],
                "DoYouContinueWithRecord",
                "INFO"
              );

              if (buttonName === "Yes" && status["9"]) {
                btnName(
                  ["Ok"],
                  concatenatedMessages["9"],
                  "ValidationAlert",
                  "INFO"
                );
              } else if (
                buttonName === "Yes" &&
                data?.[0]?.RESTRICT_WINDOW === "N"
              ) {
                crudChequeData.mutate(apiReq);
              } else if (
                buttonName === "Yes" &&
                data?.[0]?.RESTRICT_WINDOW === "Y"
              ) {
                navigate("issuedChequebook/", {
                  state: {
                    ...apiReq,
                    CHEQUE_TO: insertReq?.CHEQUE_TO,
                    COMP_CD: authState?.companyID,
                  },
                });
                CloseMessageBox();
              } else if (buttonName === "Yes") {
                crudChequeData.mutate(apiReq);
              }
            } else if (status["9"]) {
              btnName(
                ["Ok"],
                concatenatedMessages["9"],
                "ValidationAlert",
                "INFO"
              );
            } else if (status["0"]) {
              let buttonName = await btnName(
                ["Yes", "No"],
                "AreYouSureToProceed",
                "ValidationSuccessfull",
                "INFO"
              );
              if (buttonName === "Yes") {
                crudChequeData.mutate(apiReq);
              }
            }
          }
        }
        validData();
      },
      onError() {
        setIsData((old) => ({ ...old, closeAlert: true }));
      },
    }
  );

  // API calling function for Insert , Delete
  const crudChequeData: any = useMutation(
    "saveChequebookData",
    saveChequebookData,
    {
      onSuccess: (data, variables) => {
        if (variables?._isDeleteRow) {
          setIsData((old) => ({ ...old, isDelete: false }));
          getChequeDetail.mutate({
            COMP_CD: authState?.companyID,
            ACCT_CD: variables?.ACCT_CD,
            ACCT_TYPE: variables?.ACCT_TYPE,
            BRANCH_CD: variables?.BRANCH_CD,
          });
          enqueueSnackbar(t("deleteSuccessfully"), { variant: "success" });
        } else if (variables?._isNewRow) {
          myMasterRef?.current?.handleFormReset({ preventDefault: () => {} });
          setIsData((old) => ({ ...old, isVisible: false }));
          CloseMessageBox();
          enqueueSnackbar(t("insertSuccessfully"), { variant: "success" });
        }
      },
      onError: () => {
        CloseMessageBox();
        setIsData((old) => ({ ...old, closeAlert: true, isDelete: false }));
      },
    }
  );

  // API calling function for Validate data before Delete
  const validateDelete: any = useMutation(
    "validateDeleteData",
    validateDeleteData,
    {
      onSuccess: (data) => {
        if (data?.[0]?.STATUS === "999" && data?.[0]?.MESSAGE) {
          MessageBox({
            messageTitle: "InvalidDeleteOperation",
            message: data?.[0]?.MESSAGE,
          });
        } else if (data?.[0]?.STATUS === "0") {
          setIsData((old) => ({ ...old, isDelete: true }));
        }
      },
      onError: () => {
        setIsData((old) => ({ ...old, closeAlert: true }));
      },
    }
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getChequebookEntryList"]);
      queryClient.removeQueries(["getReturnHistory"]);
      queryClient.removeQueries(["getTodayClearing"]);
      queryClient.removeQueries(["getChequebookDTL"]);
      queryClient.removeQueries(["saveChequebookData"]);
      queryClient.removeQueries(["validateDeleteData"]);
    };
  }, []);

  const formatWorkingDate = authState?.workingDate
    ? parse(authState?.workingDate, "dd/MMM/yyyy", new Date())
    : null;

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "view-details") {
        if (screenFlag === "chequesDtlForTrn") {
          setChequebookIssueDtlOpen(true);
          navigate("", {
            state: data?.rows,
          });
        } else {
          navigate(data?.name, {
            state: data?.rows,
          });
        }
      } else if (data?.name === "today's-Clearing") {
        todaysCleringDtl.mutate(reqData);
        navigate("", {
          state: data?.rows,
        });
      } else if (data?.name === "cheque-return-history") {
        if (screenFlag === "chequesDtlForTrn") {
          setChequebookReturnHistoryOpen(true);
          chequeReturnHistory.mutate({
            COMP_CD: reqData?.COMP_CD,
            BRANCH_CD: reqData?.BRANCH_CD,
            ACCT_TYPE: reqData?.ACCT_TYPE,
            FROM_ACCT_CD: reqData?.ACCT_CD,
            TO_ACCT_CD: reqData?.ACCT_CD,
            FROM_DATE: formatWorkingDate
              ? format(subYears(formatWorkingDate, 1), "dd/MMM/yyyy")
              : "",
            TO_DATE: authState?.workingDate,
          });
          navigate("", {
            state: data?.rows,
          });
        } else {
          setChequebookReturnHistoryOpen(true);
          myMasterRef?.current?.getFieldData().then((res) => {
            if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
              const chequeDTLRequestPara = {
                COMP_CD: authState?.companyID,
                BRANCH_CD: res?.BRANCH_CD,
                ACCT_TYPE: res?.ACCT_TYPE,
                FROM_ACCT_CD: res?.ACCT_CD,
                TO_ACCT_CD: res?.ACCT_CD,
                FROM_DATE: formatWorkingDate
                  ? format(subYears(formatWorkingDate, 1), "dd/MMM/yyyy")
                  : "",
                TO_DATE: authState?.workingDate,
              };
              chequeReturnHistory.mutate(chequeDTLRequestPara);
            }
          });
        }
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "s" && event.ctrlKey) {
        event.preventDefault();
        myMasterRef?.current?.handleSubmit(
          { preventDefault: () => {} },
          "Save"
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const onSubmitHandler: SubmitFnType = (data: any, displayData, endSubmit) => {
    // @ts-ignore
    endSubmit(true);
    let reqPara = {
      ...data,
      COMP_CD: authState?.companyID,
      AUTO_CHQBK_FLAG: data?.PER_CHQ_ALLOW,
      NO_OF_CHQBK: data?.NO_OF_CHQBK ?? "1",
      CHEQUE_TOTAL: data?.CHEQUE_TOTAL ?? data?.CHEQUE_TOTALS,
      CHARACTERISTICS: data?.CHARACTERISTICS ?? "B",
      PAYABLE_AT_PAR: data?.PAYABLE_AT_PAR ?? "Y",
      SR_CD: data?.AUTO_CHQBK_FLAG === "N" ? "0" : data?.SR_CD,
    };
    reqDataRef.current.insertReq = reqPara;

    if (Number(reqPara.NO_OF_CHQBK) > 1 && reqPara?.CHEQUE_TO) {
      navigate("multiChequebook/", {
        state: reqPara,
      });
    } else {
      validateInsertData.mutate({
        COMP_CD: authState?.companyID,
        BRANCH_CD: reqPara?.BRANCH_CD,
        ACCT_TYPE: reqPara?.ACCT_TYPE,
        ACCT_CD: reqPara?.ACCT_CD,
        AMOUNT: reqPara?.AMOUNT,
        SERVICE_TAX: reqPara?.SERVICE_TAX,
        CHEQUE_FROM: reqPara?.CHEQUE_FROM,
        CHEQUE_TO: reqPara?.CHEQUE_TO,
        AUTO_CHQBK_FLAG: reqPara?.AUTO_CHQBK_FLAG,
        SR_CD: reqPara?.SR_CD,
        STATUS: reqPara?.STATUS,
        SCREEN_REF: "TRN/045",
      });
    }
  };

  return (
    <>
      {screenFlag === "chequesDtlForTrn" ? (
        <>
          {isError ? (
            <Alert
              severity={error?.severity ?? "error"}
              errorMsg={error?.error_msg ?? "Error"}
              errorDetail={error?.error_detail ?? ""}
            />
          ) : null}
          <GridWrapper
            key={`chequebookDetail` + screenFlag}
            finalMetaData={
              chequesEntryDtlForTrnmetaData?.current as GridMetaDataType
            }
            data={data ?? []}
            loading={isLoading}
            setData={() => {}}
            actions={chequeActions}
            setAction={setCurrentAction}
            refetchData={() => refetch()}
          />
        </>
      ) : (
        <>
          <Box sx={{ width: "100%" }}>
            <Tabs
              sx={{ ml: "25px" }}
              value={isData.value}
              onChange={(event, newValue) => {
                setIsData((old) => ({
                  ...old,
                  value: newValue,
                  closeAlert: false,
                }));
                getChequeDetail.data = [];
                if (newValue === "tab2") {
                  //API calling for issued chequebook Grid-details and set account-number and name inside the header
                  myMasterRef?.current?.getFieldData().then((res) => {
                    if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
                      ChequebookDtlGridMetaData.gridConfig.subGridLabel = ` \u00A0\u00A0 ${(
                        authState?.companyID +
                        res?.BRANCH_CD +
                        res?.ACCT_TYPE +
                        res?.ACCT_CD
                      ).replace(/\s/g, "")} -  ${res?.ACCT_NM}`;
                      const chequeDTLRequestPara = {
                        COMP_CD: authState?.companyID,
                        ACCT_CD: res?.ACCT_CD,
                        ACCT_TYPE: res?.ACCT_TYPE,
                        BRANCH_CD: res?.BRANCH_CD,
                      };
                      getChequeDetail.mutate(chequeDTLRequestPara);
                    }
                  });
                }
              }}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
            >
              <Tab value="tab1" label={t("ChequebookEntry")} />
              {isData.isVisible && (
                <Tab value="tab2" label={t("ChequebookDetail")} />
              )}
            </Tabs>
          </Box>

          <Container>
            <Grid
              sx={{
                backgroundColor: "var(--theme-color2)",
                padding: "0px",
                borderRadius: "10px",
                boxShadow:
                  "rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px;",
              }}
            >
              {/* All API calls handle error */}
              {validateDelete?.isLoading || validateInsertData?.isLoading ? (
                <LinearProgress color="inherit" />
              ) : (crudChequeData?.isError && isData.closeAlert) ||
                (validateDelete?.isError && isData.closeAlert) ||
                (validateInsertData?.isError && isData.closeAlert) ||
                (getChequeDetail?.isError && isData.closeAlert) ? (
                <AppBar position="relative" color="primary">
                  <Alert
                    severity="error"
                    errorMsg={
                      crudChequeData?.error?.error_msg ??
                      validateDelete?.error?.error_msg ??
                      getChequeDetail?.error?.error_msg ??
                      validateInsertData?.error?.error_msg ??
                      "Unknow Error"
                    }
                    errorDetail={
                      crudChequeData?.error?.error_detail ??
                      validateDelete?.error?.error_detail ??
                      getChequeDetail?.error?.error_detail ??
                      validateInsertData?.error?.error_detail ??
                      ""
                    }
                    color="error"
                  />
                </AppBar>
              ) : (
                <LinearProgressBarSpacer />
              )}
              <div
                style={{
                  display: isData.value === "tab1" ? "inherit" : "none",
                }}
              >
                <FormWrapper
                  key={"chequebooksEntry"}
                  metaData={ChequeBookEntryMetaData as MetaDataType}
                  initialValues={{}}
                  onSubmitHandler={onSubmitHandler}
                  ref={myMasterRef}
                  formState={{ MessageBox: MessageBox }}
                  setDataOnFieldChange={(action, payload) => {
                    if (action === "DTL_TAB") {
                      setIsData((old) => ({
                        ...old,
                        isVisible: payload.DTL_TAB,
                      }));
                    }
                    if (action === "NO_OF_CHQBK") {
                      myMasterRef?.current?.handleSubmit(
                        { preventDefault: () => {} },
                        "Save"
                      );
                    }
                  }}
                >
                  {({ isSubmitting, handleSubmit }) => (
                    <>
                      <Button
                        onClick={(event) => {
                          handleSubmit(event, "Save");
                        }}
                        disabled={isSubmitting}
                        endIcon={
                          isSubmitting ? <CircularProgress size={20} /> : null
                        }
                        color={"primary"}
                      >
                        {t("Save")}
                      </Button>
                    </>
                  )}
                </FormWrapper>
                <Routes>
                  <Route
                    path="multiChequebook/*"
                    element={
                      <MultipleChequebook
                        navigate={navigate}
                        validateInsertData={validateInsertData}
                      />
                    }
                  />
                  <Route
                    path="issuedChequebook/*"
                    element={<IssuedChequebook navigate={navigate} />}
                  />
                </Routes>
              </div>
              <div
                style={{
                  display: isData.value === "tab2" ? "inherit" : "none",
                }}
              >
                <GridWrapper
                  key={`chequebookDetail` + getChequeDetail.isSuccess}
                  finalMetaData={ChequebookDtlGridMetaData as GridMetaDataType}
                  data={getChequeDetail.data ?? []}
                  setData={() => null}
                  loading={getChequeDetail.isLoading}
                  actions={chequeActions}
                  setAction={setCurrentAction}
                  onClickActionEvent={(index, id, data) => {
                    reqDataRef.current.deleteReq = data;
                    validateDelete.mutate(data);
                  }}
                />
                <Routes>
                  <Route
                    path="view-details/*"
                    element={<ChequeDtlGrid navigate={navigate} />}
                  />
                </Routes>
              </div>
            </Grid>
          </Container>

          {isData.isDelete && (
            // API calling for Delete issued chequebook with Remarks
            <RemarksAPIWrapper
              TitleText={"RemovalRemarksChequebook"}
              label={"RemovalRemarks"}
              onActionNo={() =>
                setIsData((old) => ({ ...old, isDelete: false }))
              }
              onActionYes={(val, rows) => {
                let deleteReqPara = {
                  _isNewRow: false,
                  _isDeleteRow: true,
                  BRANCH_CD: rows.BRANCH_CD,
                  COMP_CD: rows.COMP_CD,
                  TRAN_CD: rows.TRAN_CD,
                  ENTERED_COMP_CD: rows.ENTERED_COMP_CD,
                  ENTERED_BRANCH_CD: rows.ENTERED_BRANCH_CD,
                  ACCT_TYPE: rows.ACCT_TYPE,
                  ACCT_CD: rows.ACCT_CD,
                  LIMIT_AMOUNT: rows.LIMIT_AMOUNT,
                  ACTIVITY_TYPE: "CHEQUE BOOK ISSUE ",
                  TRAN_DT: rows.TRAN_DT,
                  CONFIRMED: rows.CONFIRMED,
                  USER_DEF_REMARKS: val
                    ? val
                    : "WRONG ENTRY FROM CHEQUE BOOK ISSUE ENTRY (TRN/045)",
                  ENTERED_BY: rows.ENTERED_BY,
                  AMOUNT: rows.AMOUNT,
                };
                crudChequeData.mutate(deleteReqPara);
              }}
              isLoading={crudChequeData?.isLoading}
              isEntertoSubmit={true}
              AcceptbuttonLabelText="Ok"
              CanceltbuttonLabelText="Cancel"
              open={isData?.isDelete}
              rows={reqDataRef.current.deleteReq}
              defaultValue={
                "WRONG ENTRY FROM CHEQUE BOOK ISSUE ENTRY (TRN/045)"
              }
            />
          )}
        </>
      )}
      {chequebookIssueDtlOpen ? (
        <ChequeDtlGrid
          navigate={navigate}
          setChequebookIssueDtlOpen={setChequebookIssueDtlOpen}
          screenFlag={screenFlag}
        />
      ) : null}
      {chequeReturnHistoryOpen ? (
        <Dialog
          open={chequeReturnHistoryOpen}
          // @ts-ignore
          TransitionComponent={Transition}
          PaperProps={{
            style: {
              width: "100%",
              overflow: "auto",
            },
          }}
          maxWidth="lg"
        >
          <GridWrapper
            key={`ChequeReturnHistory`}
            finalMetaData={ChequeReturnHistoryGridMetaData as GridMetaDataType}
            data={chequeReturnHistoryDtl ?? []}
            loading={chequeReturnHistory?.isLoading}
            setData={() => {}}
            actions={chequeReturnHistoryActions}
            setAction={(data) => {
              if (data?.name === "Close") {
                setChequebookReturnHistoryOpen(false);
                setChequebookReturnHistoryDtl([]);
              }
            }}
            refetchData={() => refetch()}
          />
        </Dialog>
      ) : null}
    </>
  );
};

type ChequesEntryCustomProps = {
  screenFlag?: any;
  reqData?: any;
};
export const ChequebookTab: React.FC<ChequesEntryCustomProps> = ({
  screenFlag,
  reqData,
}) => {
  return (
    <ClearCacheProvider>
      <ChequebookTabCustom screenFlag={screenFlag} reqData={reqData} />
    </ClearCacheProvider>
  );
};
