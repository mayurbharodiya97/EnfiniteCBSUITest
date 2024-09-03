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
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { limitEntryGridMetaData } from "./limtEntryGridMetadata";
import { usePopupContext } from "components/custom/popupContext";
import { RemarksAPIWrapper } from "components/custom/Remarks";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTableStatic";
import { limitEntryMetaData } from "./limitEntryMetadata";
import { ActionTypes } from "components/dataTable";
import { AuthContext } from "pages_audit/auth";
import { Alert } from "components/common/alert";
import { enqueueSnackbar } from "notistack";
import { ForceExpire } from "./forceExpire/forceExpire";
import { useMutation } from "react-query";
import { ClearCacheProvider, queryClient } from "cache";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import * as API from "./api";
import { FdDetails } from "./fdDetail/fdDetails";
import { NscDetails } from "./nscDetail/nscDetails";
import { useTranslation } from "react-i18next";
import { SecurityDetailForm } from "./securityDetail/securityDetail";

const LimitEntryCustom = () => {
  const actions: ActionTypes[] = [
    {
      actionName: "forceExpire",
      actionLabel: "ForceExpire",
      multiple: false,
      rowDoubleClick: true,
    },
  ];

  const [isData, setIsData] = useState<any>({
    isDelete: false,
    isVisible: false,
    value: "tab1",
    newFormMTdata: limitEntryMetaData,
    closeAlert: true,
    formRefresh: 0,
    gridRefresh: 0,
  });
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const myMasterRef = useRef<any>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const reqDataRef = useRef<any>({});

  const securityLimitData: any = useMutation(
    "securityLimitData",
    API.LimitSecurityData,
    {
      onSuccess: (data) => {
        let newData;
        if (data.length > 0) {
          let newMetadata: any = [...limitEntryMetaData.fields, ...data];
          newData = { ...isData.newFormMTdata, fields: newMetadata };
        }
        setIsData((old) => ({ ...old, newFormMTdata: newData }));
      },
      onError() {
        setIsData((old) => ({ ...old, closeAlert: true }));
      },
    }
  );

  const getLimitDetail: any = useMutation(
    "getLimitDnewFormMTdataTL",
    API.getLimitDTL,
    {
      onError() {
        setIsData((old) => ({ ...old, closeAlert: true }));
      },
    }
  );

  const validateInsertData: any = useMutation(
    "validateInsert",
    API.validateInsert,
    {
      onSuccess: (data, variables) => {
        async function validData() {
          let apiReq = {
            ...variables,
            _isNewRow: true,
          };
          if (Array.isArray(data) && data?.length > 0) {
            const btnName = async (buttonNames, msg, msgTitle) => {
              return await MessageBox({
                messageTitle: msgTitle,
                message: msg,
                buttonNames: buttonNames,
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
              btnName(["Ok"], concatenatedMessages["999"], "ValidationFailed");
            } else if (status["99"]) {
              let buttonName = await btnName(
                ["Yes", "No"],
                concatenatedMessages["99"],
                "DoYouContinueWithRecord"
              );
              if (buttonName === "Yes" && status["9"]) {
                btnName(["Ok"], concatenatedMessages["9"], "ValidationAlert");
              } else if (buttonName === "Yes") {
                crudLimitData.mutate(apiReq);
              }
            } else if (status["9"]) {
              btnName(["Ok"], concatenatedMessages["9"], "ValidationAlert");
            } else if (status["0"]) {
              let buttonName = await btnName(
                ["Yes", "No"],
                "AreYouSureToProceed",
                "ValidationSuccessfull"
              );
              if (buttonName === "Yes") {
                crudLimitData.mutate(apiReq);
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

  const validateDeleteData: any = useMutation(
    "validateDelete",
    API.validateDelete,
    {
      onSuccess: async (data, variables) => {
        if (data?.[0]?.O_STATUS === "999" && data?.[0]?.O_RESTRICT) {
          MessageBox({
            messageTitle: "InvalidDeleteOperation",
            message: data?.[0]?.O_RESTRICT,
          });
        } else if (data?.[0]?.O_STATUS === "0") {
          reqDataRef.current.deleteReq = variables;
          setIsData((old) => {
            return { ...old, isDelete: true };
          });
        }
      },
      onError() {
        setIsData((old) => ({ ...old, closeAlert: true }));
      },
    }
  );

  const crudLimitData: any = useMutation(
    "crudLimitEntryData",
    API.crudLimitEntryData,
    {
      onSuccess: (data, variables) => {
        if (variables?._isDeleteRow) {
          setIsData((old) => ({ ...old, isDelete: false }));
          getLimitDetail.mutate({
            COMP_CD: authState?.companyID,
            ACCT_CD: variables?.ACCT_CD,
            ACCT_TYPE: variables?.ACCT_TYPE,
            BRANCH_CD: variables?.BRANCH_CD,
            GD_TODAY_DT: authState?.workingDate,
            USER_LEVEL: authState?.role,
          });
          enqueueSnackbar(t("deleteSuccessfully"), { variant: "success" });
        } else if (variables?._isNewRow) {
          setIsData((old) => ({
            ...old,
            isVisible: false,
            newFormMTdata: limitEntryMetaData,
            formRefresh: old.formRefresh + 1,
          }));
          myMasterRef?.current?.handleFormReset({ preventDefault: () => {} });
          CloseMessageBox();
          enqueueSnackbar(t("insertSuccessfully"), { variant: "success" });
        }
      },
      onError() {
        setIsData((old) => ({ ...old, isDelete: false, closeAlert: true }));
      },
    }
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getLimitDTL"]);
      queryClient.removeQueries(["securityLimitData"]);
      queryClient.removeQueries(["crudLimitEntryData"]);
      queryClient.removeQueries(["validateInsert"]);
      queryClient.removeQueries(["validateDelete"]);
    };
  }, []);

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "view-detail") {
        navigate(data?.name, {
          state: data?.rows,
        });
      } else if (data?.name === "close") {
        getLimitDetail.data = [];
      } else if (data?.name === "forceExpire") {
        if (data?.rows?.[0]?.data?.ALLOW_FORCE_EXP === "Y") {
          let res = await MessageBox({
            messageTitle: "confirmation",
            message: "AreYouSureForceExpLimit",
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
      <Box sx={{ width: "100%" }}>
        <Tabs
          sx={{ ml: "15px" }}
          value={isData.value}
          onChange={(event, newValue) => {
            setIsData((old) => ({
              ...old,
              value: newValue,
              closeAlert: false,
            }));
            getLimitDetail.data = [];
            if (newValue === "tab2") {
              myMasterRef?.current?.getFieldData().then((res) => {
                if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
                  limitEntryGridMetaData.gridConfig.subGridLabel = `\u00A0 ${(
                    authState?.companyID +
                    res?.BRANCH_CD +
                    res?.ACCT_TYPE +
                    res?.ACCT_CD
                  ).replace(/\s/g, "")} -  ${res?.ACCT_NM}`;

                  const limitDTLRequestPara = {
                    COMP_CD: authState?.companyID,
                    ACCT_CD: res?.ACCT_CD,
                    ACCT_TYPE: res?.ACCT_TYPE,
                    BRANCH_CD: res?.BRANCH_CD,
                    GD_TODAY_DT: authState?.workingDate,
                    USER_LEVEL: authState?.role,
                  };

                  getLimitDetail.mutate(limitDTLRequestPara);
                }
              });
            }
          }}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="tab1" label={t("LimitEntry")} />
          {isData.isVisible && <Tab value="tab2" label={t("LimitDetail")} />}
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
          {securityLimitData.isLoading ||
          validateInsertData?.isLoading ||
          crudLimitData?.isLoading ||
          validateDeleteData.isLoading ? (
            <LinearProgress color="secondary" />
          ) : (securityLimitData?.isError && isData.closeAlert) ||
            (validateInsertData?.isError && isData.closeAlert) ||
            (crudLimitData?.isError && isData.closeAlert) ||
            (getLimitDetail?.isError && isData.closeAlert) ||
            (validateDeleteData?.isError && isData.closeAlert) ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={
                    securityLimitData?.error?.error_msg ??
                    validateInsertData?.error?.error_msg ??
                    crudLimitData?.error?.error_msg ??
                    getLimitDetail?.error?.error_msg ??
                    validateDeleteData?.error?.error_msg ??
                    "Unknow Error"
                  }
                  errorDetail={
                    securityLimitData?.error?.error_detail ??
                    validateInsertData?.error?.error_detail ??
                    crudLimitData?.error?.error_detail ??
                    getLimitDetail?.error?.error_detail ??
                    validateDeleteData?.error?.error_detail ??
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
              key={"limitEntryForm" + isData.formRefresh}
              metaData={isData.newFormMTdata as MetaDataType}
              initialValues={{}}
              onSubmitHandler={(data: any, displayData, endSubmit) => {
                //@ts-ignore
                endSubmit(true);
                let apiReq = {
                  ...data,
                  ...reqDataRef.current.securityDetails,
                };
                validateInsertData.mutate(apiReq);
              }}
              hideHeader={false}
              ref={myMasterRef}
              formState={{ MessageBox: MessageBox }}
              onFormButtonClickHandel={() => {
                navigate("security-detail/");
              }}
              setDataOnFieldChange={(action, payload) => {
                if (action === "SECURITY_CODE") {
                  setIsData((old) => ({
                    ...old,
                    closeAlert: false,
                    newFormMTdata: limitEntryMetaData,
                  }));
                  securityLimitData.mutate({
                    ...payload,
                    ...reqDataRef.current.acctValidData,
                    COMP_CD: authState?.companyID,
                    BRANCH_CD: authState?.user?.branchCode,
                    WORKING_DATE: authState?.workingDate,
                  });
                }
                if (action === "NSC_FD_BTN") {
                  setIsData((old) => ({
                    ...old,
                    isVisible: payload?.NSC_FD_BTN,
                    newFormMTdata: limitEntryMetaData,
                  }));
                  reqDataRef.current.acctValidData = payload;
                }
              }}
            >
              {({ isSubmitting, handleSubmit }) => {
                return (
                  <>
                    {isData.isVisible ? (
                      <>
                        <Button
                          color="primary"
                          onClick={() => navigate("fd-detail/")}
                        >
                          {t("FDDetail")}
                        </Button>
                        <Button
                          color="primary"
                          onClick={() => navigate("nsc-detail")}
                        >
                          {t("NSCDetail")}
                        </Button>
                      </>
                    ) : null}

                    <Button
                      onClick={(event) => {
                        handleSubmit(event, "Save");
                      }}
                      // disabled={isSubmitting}
                      // endIcon={
                      //   isSubmitting ? <CircularProgress size={20} /> : null
                      // }
                      color={"primary"}
                    >
                      {t("Save")}
                    </Button>
                  </>
                );
              }}
            </FormWrapper>
            <Routes>
              <Route
                path="fd-detail/"
                element={
                  <FdDetails navigate={navigate} myMasterRef={myMasterRef} />
                }
              />
              <Route
                path="nsc-detail/*"
                element={
                  <NscDetails navigate={navigate} myMasterRef={myMasterRef} />
                }
              />
              <Route
                path="security-detail/*"
                element={
                  <SecurityDetailForm
                    navigate={navigate}
                    myMasterRef={myMasterRef}
                    reqDataRef={reqDataRef}
                  />
                }
              />
            </Routes>
          </div>

          <div
            style={{ display: isData.value === "tab2" ? "inherit" : "none" }}
          >
            <GridWrapper
              key={
                `limitentrygridMetaData` +
                getLimitDetail.isSuccess +
                isData.gridRefresh
              }
              finalMetaData={limitEntryGridMetaData as GridMetaDataType}
              data={getLimitDetail.data ?? []}
              loading={
                getLimitDetail?.isLoading ?? validateDeleteData?.isLoading
              }
              setData={() => {}}
              actions={actions}
              setAction={setCurrentAction}
              onClickActionEvent={(index, id, data) => {
                validateDeleteData.mutate(data);
              }}
            />
            <Routes>
              <Route
                path="forceExpire/*"
                element={
                  <ForceExpire
                    navigate={navigate}
                    getLimitDetail={getLimitDetail}
                  />
                }
              />
            </Routes>
          </div>
        </Grid>
      </Container>

      {isData.isDelete && (
        <RemarksAPIWrapper
          TitleText={"LimitDeleteTitle"}
          onActionNo={() =>
            setIsData((old) => ({
              ...old,
              isDelete: false,
            }))
          }
          onActionYes={(val, rows) => {
            console.log("<<<delde", val, rows);
            let deleteReqPara = {
              _isNewRow: false,
              _isDeleteRow: true,
              BRANCH_CD: rows.BRANCH_CD,
              TRAN_CD: rows.TRAN_CD,
              ACCT_TYPE: rows.ACCT_TYPE,
              ACCT_CD: rows.ACCT_CD,
              LIMIT_AMOUNT: rows.LIMIT_AMOUNT,
              ACTIVITY_TYPE: "LIMIT ENTRY SCREEN",
              TRAN_DT: rows.TRAN_DT,
              CONFIRMED: rows.CONFIRMED,
              ENTERED_BY: rows.ENTERED_BY,
              USER_DEF_REMARKS: val
                ? val
                : "WRONG ENTRY FROM LIMIT ENTRY SCREEN (TRN/046)",
            };
            crudLimitData.mutate(deleteReqPara);
          }}
          isLoading={crudLimitData?.isLoading}
          isEntertoSubmit={true}
          AcceptbuttonLabelText="Ok"
          CanceltbuttonLabelText="Cancel"
          open={isData?.isDelete}
          rows={reqDataRef.current.deleteReq}
          defaultValue={"WRONG ENTRY FROM LIMIT ENTRY SCREEN (TRN/046)"}
        />
      )}
    </>
  );
};

export const LimitEntry = () => {
  return (
    <ClearCacheProvider>
      <LimitEntryCustom />
    </ClearCacheProvider>
  );
};
