import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  LinearProgress,
  Tab,
  Tabs,
} from "@mui/material";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { StopPayEntryMetadata } from "./stopPayEntryMetadata";
import { Route, Routes, useNavigate } from "react-router-dom";
import { StopPayGridMetaData } from "./stopPayGridMetadata";
import { ReleaseCheque } from "./releaseCheque/releaseCheque";
import { AuthContext } from "pages_audit/auth";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import * as API from "./api";
import { LinearProgressBarSpacer } from "components/common/custom/linerProgressBarSpacer";
import { useTranslation } from "react-i18next";

import {
  usePopupContext,
  Alert,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
  queryClient,
  ClearCacheProvider,
  RemarksAPIWrapper,
  FormWrapper,
  MetaDataType,
} from "@acuteinfo/common-base";

const StopPaymentEntryCustom = () => {
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
  const { insertReq, deleteReq } = reqDataRef.current;

  const releaseActions: ActionTypes[] = [
    {
      actionName: "release-Cheque",
      actionLabel: `${t("ViewDetail")} / ${t("ReleaseCheque")}`,
      multiple: false,
      rowDoubleClick: true,
    },
  ];

  const getStopPayDetail: any = useMutation(
    "stopPayDetail",
    API.stopPayDetail,
    {
      onError: () => {
        setIsData((old) => ({ ...old, closeAlert: true }));
      },
    }
  );

  const validateInsertData: any = useMutation(
    "validateInsert",
    API.validateInsert,
    {
      onSuccess: (data) => {
        validateInsertData.isLoading = false;
        async function insertData() {
          if (data?.O_STATUS !== "0") {
            let res = await MessageBox({
              messageTitle: "confirmation",
              message: "InsertStopPaymentMsg",
              buttonNames: ["No", "Yes"],
              defFocusBtnName: "Yes",
              loadingBtnName: ["Yes"],
            });
            if (res === "Yes") {
              console.log("<<<insertReq", insertReq, reqDataRef);
              crudStopPay.mutate({ ...reqDataRef?.current?.insertReq });
            }
          } else {
            MessageBox({
              messageTitle: "ValidationAlert",
              message: data?.[0]?.O_MESSAGE,
            });
          }
        }
        insertData();
      },
      onError: (error: any) => {
        setIsData((old) => ({ ...old, closeAlert: true }));
      },
    }
  );

  const crudStopPay: any = useMutation("crudStopPayment", API.crudStopPayment, {
    onSuccess: (data, variables) => {
      if (variables?._isDeleteRow) {
        setIsData((old) => ({ ...old, isDelete: false }));
        getStopPayDetail.mutate({
          COMP_CD: authState?.companyID,
          ACCT_CD: variables?.ACCT_CD,
          ACCT_TYPE: variables?.ACCT_TYPE,
          BRANCH_CD: variables?.BRANCH_CD,
          GD_TODAY: authState?.workingDate,
          USER_LEVEL: authState?.role,
        });
        enqueueSnackbar(t("deleteSuccessfully"), { variant: "success" });
      } else if (variables?._isNewRow) {
        CloseMessageBox();
        myMasterRef?.current?.handleFormReset({ preventDefault: () => {} });
        enqueueSnackbar(t("insertSuccessfully"), { variant: "success" });
        setIsData((old) => ({ ...old, isVisible: false }));
      }
    },
    onError: () => {
      setIsData((old) => ({ ...old, isDelete: false, closeAlert: true }));
      CloseMessageBox();
    },
  });

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.rows?.[0]?.data?.ALLOW_RELEASE === "Y") {
        let res = await MessageBox({
          messageTitle: "confirmation",
          message: "AreYouSureToRelease",
          buttonNames: ["Yes", "No"],
        });
        if (res === "Yes") {
          navigate(data?.name, {
            state: data?.rows,
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
    return () => {
      queryClient.removeQueries(["stopPayDetail"]);
      queryClient.removeQueries(["validateInsert"]);
      queryClient.removeQueries(["crudStopPayment"]);
    };
  }, []);

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
            getStopPayDetail.data = [];
            if (newValue === "tab2") {
              myMasterRef?.current?.getFieldData().then((res) => {
                if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
                  // StopPayGridMetaData.gridConfig.subGridLabel = `\u00A0\u00A0 ${(
                  //   authState?.companyID +
                  //   res?.BRANCH_CD +
                  //   res?.ACCT_TYPE +
                  //   res?.ACCT_CD
                  // ).replace(/\s/g, "")} -  ${res?.ACCT_NM}`;

                  const RequestPara = {
                    COMP_CD: authState?.companyID,
                    ACCT_CD: res?.ACCT_CD,
                    ACCT_TYPE: res?.ACCT_TYPE,
                    BRANCH_CD: res?.BRANCH_CD,
                    ENTERED_DATE: authState?.workingDate,
                    GD_TODAY: authState?.workingDate,
                    USER_LEVEL: authState?.role,
                  };
                  getStopPayDetail.mutate(RequestPara);
                }
              });
            }
          }}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="tab1" label={t("ChequeStopEntry")} />
          {isData.isVisible && (
            <Tab value="tab2" label={t("ChequeStopDetail")} />
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
          {validateInsertData.isLoading ? (
            <LinearProgress color="secondary" />
          ) : (crudStopPay?.isError && isData.closeAlert) ||
            (validateInsertData?.isError && isData.closeAlert) ||
            (getStopPayDetail?.isError && isData.closeAlert) ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={
                    crudStopPay?.error?.error_msg ??
                    validateInsertData?.error?.error_msg ??
                    getStopPayDetail?.error?.error_msg ??
                    "Unknow Error"
                  }
                  errorDetail={
                    crudStopPay?.error?.error_detail ??
                    validateInsertData?.error?.error_detail ??
                    getStopPayDetail?.error?.error_detail ??
                    ""
                  }
                  color="error"
                />
              </AppBar>
            </div>
          ) : (
            <LinearProgressBarSpacer />
          )}
          <div
            style={{ display: isData.value === "tab1" ? "inherit" : "none" }}
          >
            <FormWrapper
              key={"stopPayEntry"}
              metaData={StopPayEntryMetadata as MetaDataType}
              onSubmitHandler={(data: any, displayData, endSubmit) => {
                reqDataRef.current.insertReq = {
                  ...data,
                  TRAN_DT: data?.TRAN_DT || data?.SURR_DT,
                  _isNewRow: true,
                };
                console.log("<<<onsub", data, reqDataRef);

                validateInsertData.mutate({
                  BRANCH_CD: data?.BRANCH_CD,
                  ACCT_TYPE: data?.ACCT_TYPE,
                  ACCT_CD: data?.ACCT_CD,
                  CHEQUE_FROM: data?.CHEQUE_FROM,
                  CHEQUE_TO: data?.CHEQUE_TO,
                  RELEASE_DATE: "",
                  SCREEN_REF: "ETRN/048",
                });

                //@ts-ignore
                endSubmit(true);
              }}
              formState={{ MessageBox: MessageBox }}
              setDataOnFieldChange={(action, payload) => {
                if (action === "IS_VISIBLE") {
                  setIsData((old) => ({
                    ...old,
                    isVisible: payload.IS_VISIBLE,
                  }));
                }
              }}
              ref={myMasterRef}
            >
              {({ isSubmitting, handleSubmit }) => (
                <>
                  <Button
                    onClick={(event) => {
                      handleSubmit(event, "Save");
                    }}
                    // disabled={isSubmitting}
                    //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    color={"primary"}
                  >
                    {t("Save")}
                  </Button>
                </>
              )}
            </FormWrapper>
          </div>
          <div
            style={{ display: isData.value === "tab2" ? "inherit" : "none" }}
          >
            <GridWrapper
              key={`stopPayGridData` + getStopPayDetail.isLoading}
              finalMetaData={StopPayGridMetaData as GridMetaDataType}
              data={getStopPayDetail.data ?? []}
              setData={() => {}}
              loading={getStopPayDetail.isLoading}
              actions={releaseActions}
              setAction={setCurrentAction}
              onClickActionEvent={(index, id, data) => {
                if (id === "ALLOW_DELETE") {
                  reqDataRef.current.deleteReq = data;
                  setIsData((old) => ({ ...old, isDelete: true }));
                }
              }}
            />
            <Routes>
              <Route
                path="release-Cheque/*"
                element={
                  <ReleaseCheque
                    navigate={navigate}
                    getStopPayDetail={getStopPayDetail}
                  />
                }
              />
            </Routes>
          </div>
        </Grid>
      </Container>

      {isData.isDelete && (
        <RemarksAPIWrapper
          TitleText={"StopDeleteTitle"}
          onActionNo={() => setIsData((old) => ({ ...old, isDelete: false }))}
          onActionYes={(val, rows) => {
            let deleteReqPara = {
              _isNewRow: false,
              _isDeleteRow: true,
              BRANCH_CD: rows.BRANCH_CD,
              TRAN_CD: rows.TRAN_CD,
              ACCT_TYPE: rows.ACCT_TYPE,
              ACCT_CD: rows.ACCT_CD,
              TRAN_AMOUNT: rows.CHEQUE_AMOUNT,
              TRAN_DT: rows.TRAN_DT,
              CONFIRMED: rows.CONFIRMED,
              USER_DEF_REMARKS: val
                ? val
                : "WRONG ENTRY FROM STOP PAYMENT ENTRY (TRN/048)",

              ACTIVITY_TYPE: "STOP PAYMENT ENTRY SCREEN",
              ENTERED_BY: rows.ENTERED_BY,
            };
            crudStopPay.mutate(deleteReqPara);
          }}
          isLoading={crudStopPay?.isLoading}
          isEntertoSubmit={true}
          AcceptbuttonLabelText="Ok"
          CanceltbuttonLabelText="Cancel"
          open={isData.isDelete}
          rows={deleteReq}
          defaultValue={"WRONG ENTRY FROM STOP PAYMENT ENTRY (TRN/048)"}
        />
      )}
    </>
  );
};

export const StopPaymentEntry = () => {
  return (
    <ClearCacheProvider>
      <StopPaymentEntryCustom />
    </ClearCacheProvider>
  );
};
