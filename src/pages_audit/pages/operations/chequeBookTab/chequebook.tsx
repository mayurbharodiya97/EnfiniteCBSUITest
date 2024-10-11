import {
  AppBar,
  Box,
  Container,
  Dialog,
  Grid,
  LinearProgress,
  Tab,
  Tabs,
} from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { ChequebookDtlGridMetaData } from "./chequebookDetailMetadata";

import {
  ActionTypes,
  Alert,
  ClearCacheProvider,
  GridMetaDataType,
  GridWrapper,
  queryClient,
  RemarksAPIWrapper,
  usePopupContext,
} from "@acuteinfo/common-base";
import { LinearProgressBarSpacer } from "components/common/custom/linerProgressBarSpacer";
import { cloneDeep } from "lodash";
import { enqueueSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { Route, Routes, useNavigate } from "react-router-dom";
import TodaysClearingGrid from "./Today'sClearing/todaysClearingGrid";
import {
  getChequebookDTL,
  saveChequebookData,
  validateDeleteData,
} from "./api";
import { ChequeDtlGrid } from "./chequeDetail/chequeDetail";
import ChequeReturnHistoryGrid from "./chequeReturnHistory/chequeReturnHistory";
import { EntryForm } from "./entryForm/entryForm";

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
  const [todayClearingOpen, setTodayClearingOpen] = useState(false);
  const chequeBookDTLRequestParaRef = useRef<any>();

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

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(
    ["getChequebookEntryList", { reqData }],
    () =>
      getChequebookDTL({
        COMP_CD: authState?.companyID ?? "",
        ACCT_CD: reqData?.ACCT_CD ?? "",
        ACCT_TYPE: reqData?.ACCT_TYPE ?? "",
        BRANCH_CD: reqData?.BRANCH_CD ?? "",
      }),
    {
      enabled: Boolean(screenFlag === "chequesDtlForTrn"),
    }
  );

  // useEffect(() => {
  if (screenFlag === "chequesDtlForTrn") {
    chequesEntryDtlForTrnmetaData.current = cloneDeep(
      ChequebookDtlGridMetaData
    );

    if (chequesEntryDtlForTrnmetaData?.current?.gridConfig) {
      chequesEntryDtlForTrnmetaData.current.gridConfig.containerHeight = {
        min: "36vh",
        max: "30vh",
      };
      chequesEntryDtlForTrnmetaData.current.gridConfig.subGridLabel = "";
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
  // }, [screenFlag]);

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
    };
  }, []);

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
        setTodayClearingOpen(true);
      } else if (data?.name === "cheque-return-history") {
        setChequebookReturnHistoryOpen(true);
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
            key={
              `chequebookIssuedDetailForTrn` +
              screenFlag +
              chequesEntryDtlForTrnmetaData?.current?.gridConfig?.gridLabel
            }
            finalMetaData={
              chequesEntryDtlForTrnmetaData?.current as GridMetaDataType
            }
            data={data ?? []}
            loading={isLoading || isFetching}
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
                      chequeBookDTLRequestParaRef.current = {
                        ...chequeDTLRequestPara,
                        ACCT_NM: res?.ACCT_NM,
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
              {validateDelete?.isLoading ? (
                <LinearProgress color="inherit" />
              ) : (crudChequeData?.isError && isData.closeAlert) ||
                (validateDelete?.isError && isData.closeAlert) ||
                (getChequeDetail?.isError && isData.closeAlert) ? (
                <AppBar position="relative" color="primary">
                  <Alert
                    severity="error"
                    errorMsg={
                      crudChequeData?.error?.error_msg ??
                      validateDelete?.error?.error_msg ??
                      getChequeDetail?.error?.error_msg ??
                      "Unknow Error"
                    }
                    errorDetail={
                      crudChequeData?.error?.error_detail ??
                      validateDelete?.error?.error_detail ??
                      getChequeDetail?.error?.error_detail ??
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
                <EntryForm
                  reqDataRef={reqDataRef}
                  myMasterRef={myMasterRef}
                  setIsData={setIsData}
                  crudChequeData={crudChequeData}
                  navigate={navigate}
                />
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
          PaperProps={{
            style: {
              width: "100%",
              overflow: "auto",
            },
          }}
          maxWidth="lg"
        >
          <ChequeReturnHistoryGrid
            setChequebookReturnHistoryOpen={setChequebookReturnHistoryOpen}
            reqData={
              screenFlag === "chequesDtlForTrn"
                ? reqData
                : chequeBookDTLRequestParaRef?.current
            }
          />
        </Dialog>
      ) : null}
      {todayClearingOpen ? (
        <Dialog
          open={todayClearingOpen}
          PaperProps={{
            style: {
              width: "100%",
              overflow: "auto",
            },
          }}
          maxWidth="lg"
        >
          <TodaysClearingGrid
            setTodayClearingOpen={setTodayClearingOpen}
            reqData={
              screenFlag === "chequesDtlForTrn"
                ? reqData
                : chequeBookDTLRequestParaRef?.current
            }
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
