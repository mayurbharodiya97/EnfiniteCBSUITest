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
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { FD_gridData, NSC_gridData } from "./limit_NSC_FD_Metadata";
import { limitEntryGridMetaData } from "./limtEntryGridMetadata";
import { usePopupContext } from "components/custom/popupContext";
import { RemarksAPIWrapper } from "components/custom/Remarks";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTableStatic";
import { limitEntryMetaData } from "./limitEntryMetadata";
import { ActionTypes } from "components/dataTable";
import { AuthContext } from "pages_audit/auth";
import { Alert } from "components/common/alert";
import { SubmitFnType } from "packages/form";
import { enqueueSnackbar } from "notistack";
import { NSCFormDetail } from "./nscDetail";
import { ForceExpire } from "./forceExpire";
import { useMutation } from "react-query";
import { queryClient } from "cache";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import * as API from "./api";

export const LimitEntry = () => {
  const fdAction: ActionTypes[] = [
    {
      actionName: "close",
      actionLabel: "close",
      multiple: false,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
  ];
  const nscAction: ActionTypes[] = [
    {
      actionName: "view-detail",
      actionLabel: "View Detail",
      multiple: false,
      rowDoubleClick: true,
    },
    {
      actionName: "close",
      actionLabel: "Close",
      multiple: undefined,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
  ];
  const forceExpireActions: ActionTypes[] = [
    {
      actionName: "forceExpire",
      actionLabel: "Force Expire",
      multiple: false,
      rowDoubleClick: true,
    },
  ];
  const [newFormMTdata, setNewFormMTdata] = useState<any>(limitEntryMetaData);
  const [closeAlert, setCloseAlert] = useState<any>(true);
  const [isVisible, setIsVisible] = useState<any>(false);
  const [deletePopup, setDeletePopup] = useState<any>(false);
  const [gridDetailData, setGridDetailData] = useState<any>();
  const [detailForm, setDetailForm] = useState<any>();
  const [formRefresh, setFormRefresh] = useState(0);
  const [initData, setInitData] = useState<any>({});
  const [value, setValue] = useState("tab1");
  const { authState } = useContext(AuthContext);
  const { MessageBox } = usePopupContext();
  const deleteDataRef = useRef<any>(null);
  const myMasterRef = useRef<any>(null);
  const navigate = useNavigate();

  const securityLimitData: any = useMutation(
    "securityLimitData",
    API.LimitSecurityData,
    {
      onSuccess: (data) => {
        let newData;
        if (data.length > 0) {
          let newMetadata: any = [...limitEntryMetaData.fields, ...data];
          newData = { ...newFormMTdata, fields: newMetadata };
        } else {
          newData = { ...limitEntryMetaData };
        }
        setNewFormMTdata(newData);
      },
    }
  );

  const getLimitDetail: any = useMutation("getLimitDTL", API.getLimitDTL, {
    onSuccess: (data) => {
      setGridDetailData(data);
    },
    onError: (error: any) => {},
  });

  const nscDetail: any = useMutation(
    "getLimitNSCdetail",
    API.getLimitNSCdetail,
    {
      onSuccess: (data) => {
        setGridDetailData(data);
      },
    }
  );

  const fdDetail: any = useMutation("getLimitFDdetail", API.getLimitFDdetail, {
    onSuccess: (data) => {
      if (data?.[0]?.MESSAGE) {
        MessageBox({
          messageTitle: "Account Description",
          message: data?.[0]?.MESSAGE,
        });
      } else {
        setDetailForm("fddetail");
        setGridDetailData(data);
      }
    },
  });

  const validateInsertData: any = useMutation(
    "validateInsert",
    API.validateInsert,
    {
      onSuccess: async (data, variables) => {
        let apiReq = {
          ...variables,
          _isNewRow: true,
          COMP_CD: authState?.companyID,
          ENTERED_COMP_CD: authState?.companyID,
          FD_COMP_CD: authState?.companyID,
          ENTERED_BRANCH_CD: authState?.user?.branchCode,
        };
        if (data?.[0]?.O_STATUS === "0") {
          // validateInsertData.isLoading = false;
          const buttonName = await MessageBox({
            messageTitle: "Validation Successfull..",
            message: "Do you Want to save this data",
            buttonNames: ["Yes", "No"],
          });
          if (buttonName === "Yes") {
            crudLimitData.mutate(apiReq);
          }
        } else if (data?.[0]?.O_STATUS === "9") {
          MessageBox({
            messageTitle: "Validation Alert..",
            message: data?.[0]?.O_MESSAGE,
          });
        } else if (data?.[0]?.O_STATUS === "99") {
          // validateInsertData.isLoading = false;
          let buttonName = await MessageBox({
            messageTitle: "Do you Want to Continue with this Record",
            message: data?.[0]?.O_MESSAGE,
            buttonNames: ["Yes", "No"],
          });
          if (buttonName === "Yes") {
            crudLimitData.mutate(apiReq);
          }
        } else if (data?.[0]?.O_STATUS === "999") {
          MessageBox({
            messageTitle: "Validation Failed...!",
            message: data?.[0]?.O_MESSAGE,
          });
        }
      },
    }
  );

  const validateDeleteData: any = useMutation(
    "validateDelete",
    API.validateDelete,
    {
      onSuccess: async (data) => {
        if (data?.[0]?.O_STATUS === "999" && data?.[0]?.O_RESTRICT) {
          MessageBox({
            messageTitle: "Invalid Delete Operation",
            message: data?.[0]?.O_RESTRICT,
          });
        } else if (
          data?.[0]?.O_STATUS === "0" &&
          data?.[0]?.O_RESTRICT === "SUCCESS"
        ) {
          setDeletePopup(true);
        }
      },
    }
  );

  const crudLimitData: any = useMutation(
    "crudLimitEntryData",
    API.crudLimitEntryData,
    {
      onSuccess: (data, variables) => {
        if (variables?._isDeleteRow) {
          setDeletePopup(false);
          getLimitDetail.mutate({ ...deleteDataRef.current });
          enqueueSnackbar("Data Delete successfully", { variant: "success" });
        } else if (variables?._isNewRow) {
          myMasterRef?.current?.handleFormReset({ preventDefault: () => {} });
          setFormRefresh((old) => old + 1);
          setIsVisible(false);
          setNewFormMTdata({ ...limitEntryMetaData });
          enqueueSnackbar("Data insert successfully", { variant: "success" });
        }
      },
    }
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getLimitDTL"]);
      queryClient.removeQueries(["securityLimitData"]);
      queryClient.removeQueries(["getLimitNSCdetail"]);
      queryClient.removeQueries(["getLimitFDdetail"]);
      queryClient.removeQueries(["crudLimitEntryData"]);
    };
  }, []);

  const onSubmitHandler: SubmitFnType = (data: any, displayData, endSubmit) => {
    setCloseAlert(true);
    let apiReq = {
      ...data,
      ACCT_CD: data?.ACCT_CD?.padStart(6, "0")?.padEnd(20, " "),
    };
    validateInsertData.mutate(apiReq);
    //@ts-ignore
    endSubmit(true);
  };

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "view-detail") {
        navigate(data?.name, {
          state: data?.rows,
        });
      } else if (data?.name === "close") {
        setDetailForm("");
      } else if (data?.name === "forceExpire") {
        if (data?.rows?.[0]?.data?.EXPIRED_FLAG === "A") {
          let res = await MessageBox({
            messageTitle: "Confirmation..",
            message: "Are you sure to force expire limit ?",
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
    [setDetailForm, navigate]
  );
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            setCloseAlert(false);
            if (newValue === "tab2") {
              myMasterRef?.current?.getFieldData().then((res) => {
                setInitData(res);
                if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
                  limitEntryGridMetaData.gridConfig.gridLabel = `Limit-Entry Detail \u00A0\u00A0 ${(
                    authState?.companyID +
                    res?.BRANCH_CD +
                    res?.ACCT_TYPE +
                    res?.ACCT_CD?.padStart(6, "0")?.padEnd(20, " ")
                  ).replace(/\s/g, "")} -  ${res?.ACCT_NM}`;

                  const limitDTLRequestPara = {
                    COMP_CD: authState?.companyID,
                    ACCT_CD: res?.ACCT_CD?.padStart(6, "0")?.padEnd(20, " "),
                    ACCT_TYPE: res?.ACCT_TYPE,
                    BRANCH_CD: res?.BRANCH_CD,
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
          <Tab value="tab1" label="Limit Entry" />

          {isVisible && <Tab value="tab2" label="Limit Detail" />}
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
          crudLimitData.isLoading ||
          fdDetail.isLoading ||
          validateDeleteData.isLoading ? (
            <LinearProgress color="secondary" />
          ) : (securityLimitData?.isError && closeAlert) ||
            (validateInsertData?.isError && closeAlert) ||
            (fdDetail?.isError && closeAlert) ||
            (crudLimitData?.isError && closeAlert) ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={
                    securityLimitData?.error?.error_msg ??
                    validateInsertData?.error?.error_msg ??
                    crudLimitData?.error?.error_msg ??
                    fdDetail?.error?.error_msg ??
                    "Unknow Error"
                  }
                  errorDetail={
                    securityLimitData?.error?.error_detail ??
                    validateInsertData?.error?.error_detail ??
                    crudLimitData?.error?.error_detail ??
                    fdDetail?.error?.error_detail ??
                    ""
                  }
                  color="error"
                />
              </AppBar>
            </div>
          ) : (
            <LinearProgressBarSpacer />
          )}

          {value === "tab1" ? (
            <>
              <FormWrapper
                key={"limitEntryForm" + formRefresh}
                metaData={newFormMTdata as MetaDataType}
                initialValues={initData ?? {}}
                onSubmitHandler={onSubmitHandler}
                hideHeader={false}
                ref={myMasterRef}
                formState={{ MessageBox: MessageBox }}
                setDataOnFieldChange={(action, payload) => {
                  if (action === "SECURITY_CODE") {
                    securityLimitData.mutate({
                      ...payload,
                      COMP_CD: authState?.companyID,
                      BRANCH_CD: authState?.user?.branchCode,
                      WORKING_DATE: authState?.workingDate,
                    });
                  }

                  if (action === "NSC_FD_BTN") {
                    setIsVisible(payload?.NSC_FD_BTN);
                  }
                }}
              >
                {({ isSubmitting, handleSubmit }) => {
                  return (
                    <>
                      {isVisible ? (
                        <>
                          <Button
                            color="primary"
                            // disabled={isSubmitting}
                            onClick={async () => {
                              const buttonName = await MessageBox({
                                messageTitle: "Confirmation...",
                                message: `
                                    Press 'Yes' then - to view Lien FD(s) against this A/c.                               ,
                                    Press 'No' then to view all the FD(s) of
                                    this Customer.
                                `,
                                buttonNames: ["Yes", "No"],
                              });

                              myMasterRef?.current
                                ?.getFieldData()
                                .then((res) => {
                                  if (
                                    res?.ACCT_CD &&
                                    res?.ACCT_TYPE &&
                                    res?.BRANCH_CD
                                  ) {
                                    const FD_DTLRequestPara = {
                                      COMP_CD: authState?.companyID,
                                      ACCT_CD: res?.ACCT_CD?.padStart(
                                        6,
                                        "0"
                                      )?.padEnd(20, " "),
                                      ACCT_TYPE: res?.ACCT_TYPE,
                                      BRANCH_CD: res?.BRANCH_CD,
                                      LOGIN_COMP_CD: authState?.companyID,
                                      FLAG:
                                        buttonName === "Yes"
                                          ? "L"
                                          : buttonName === "No"
                                          ? "C"
                                          : null,
                                    };

                                    fdDetail.mutate(FD_DTLRequestPara);
                                  }
                                });
                            }}
                          >
                            FD Detail
                          </Button>
                          <Button
                            color="primary"
                            onClick={() => {
                              setDetailForm("nscdetail");
                              myMasterRef?.current
                                ?.getFieldData()
                                .then((res) => {
                                  if (
                                    res?.ACCT_CD &&
                                    res?.ACCT_TYPE &&
                                    res?.BRANCH_CD
                                  ) {
                                    const NSC_DTLRequestPara = {
                                      COMP_CD: authState?.companyID,
                                      ACCT_CD: res?.ACCT_CD?.padStart(
                                        6,
                                        "0"
                                      )?.padEnd(20, " "),
                                      ACCT_TYPE: res?.ACCT_TYPE,
                                      BRANCH_CD: res?.BRANCH_CD,
                                    };
                                    nscDetail.mutate(NSC_DTLRequestPara);
                                  }
                                });
                            }}
                          >
                            NSC Detail
                          </Button>
                        </>
                      ) : null}

                      <Button
                        onClick={(event) => {
                          handleSubmit(event, "Save");
                        }}
                        // disabled={isSubmitting}
                        endIcon={
                          isSubmitting ? <CircularProgress size={20} /> : null
                        }
                        color={"primary"}
                      >
                        Save
                      </Button>
                    </>
                  );
                }}
              </FormWrapper>
            </>
          ) : value === "tab2" ? (
            <>
              {getLimitDetail?.isError ||
                (validateDeleteData?.isError && (
                  <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
                    <AppBar position="relative" color="primary">
                      <Alert
                        severity="error"
                        errorMsg={
                          getLimitDetail?.error?.error_msg ??
                          validateDeleteData?.error?.error_msg ??
                          "Unknow Error"
                        }
                        errorDetail={
                          getLimitDetail?.error?.error_detail ??
                          validateDeleteData?.error?.error_detail ??
                          ""
                        }
                        color="error"
                      />
                    </AppBar>
                  </div>
                ))}
              <GridWrapper
                key={`limitentrygridMetaData`}
                finalMetaData={limitEntryGridMetaData as GridMetaDataType}
                data={gridDetailData ?? []}
                loading={
                  getLimitDetail?.isLoading ?? validateDeleteData?.isLoading
                }
                setData={() => {}}
                actions={forceExpireActions}
                setAction={setCurrentAction}
                onClickActionEvent={(index, id, data) => {
                  deleteDataRef.current = data;
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
            </>
          ) : null}
        </Grid>
      </Container>

      {detailForm === "fddetail" ? (
        <>
          {fdDetail.isLoading ? (
            <LoaderPaperComponent />
          ) : (
            <Dialog
              open={true}
              PaperProps={{
                style: {
                  maxWidth: "950px",
                },
              }}
            >
              <GridWrapper
                key={`personalizew`}
                finalMetaData={FD_gridData as GridMetaDataType}
                data={gridDetailData ?? []}
                setData={() => {}}
                loading={fdDetail.isLoading}
                actions={fdAction}
                setAction={setCurrentAction}
              />
            </Dialog>
          )}
        </>
      ) : detailForm === "nscdetail" ? (
        <Dialog
          open={true}
          fullWidth={true}
          PaperProps={{
            style: {
              maxWidth: "1150px",
            },
          }}
        >
          {nscDetail?.isError && (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={nscDetail?.error?.error_msg ?? "Unknow Error"}
                  errorDetail={nscDetail?.error?.error_detail ?? ""}
                  color="error"
                />
              </AppBar>
            </div>
          )}
          <GridWrapper
            key={`nscGridData`}
            finalMetaData={NSC_gridData as GridMetaDataType}
            data={gridDetailData ?? []}
            setData={() => {}}
            loading={nscDetail.isLoading}
            actions={nscAction}
            setAction={setCurrentAction}
          />

          <Routes>
            <Route
              path="view-detail/*"
              element={<NSCFormDetail navigate={navigate} />}
            />
          </Routes>
        </Dialog>
      ) : null}

      {deletePopup && (
        <RemarksAPIWrapper
          TitleText={"Are you sure want to delete this record ..?"}
          onActionNo={() => setDeletePopup(false)}
          onActionYes={(val, rows) => {
            let deleteReqPara = {
              ...rows,
              _isNewRow: false,
              _isDeleteRow: true,
              ACTIVITY_TYPE: "LIMIT ENTRY SCREEN",
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
          open={deletePopup}
          rows={deleteDataRef.current}
          defaultValue={"WRONG ENTRY FROM LIMIT ENTRY SCREEN (TRN/046)"}
        />
      )}
    </>
  );
};
