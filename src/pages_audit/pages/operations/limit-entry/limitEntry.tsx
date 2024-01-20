import {
  AppBar,
  Box,
  Button,
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
import { GridMetaDataType } from "components/dataTableStatic";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import { Alert } from "components/common/alert";
import { limitEntryMetaData } from "./limitEntryMetadata";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import { limitEntryGridMetaData } from "./limtEntryGridMetadata";
import { SubmitFnType } from "packages/form";
import {
  LimitSecurityData,
  getLimitDTL,
  getLimitFDdetail,
  getLimitNSCdetail,
  saveLimitEntryData,
} from "./api";
import { queryClient } from "cache";
import { PopupRequestWrapper } from "components/custom/popupMessage";
import { FD_gridMetaData, NSC_FormMetaData } from "./limit_NSC_FD_Metadata";
import { ActionTypes } from "components/dataTable";
import { enqueueSnackbar } from "notistack";
import { LoaderPaperComponent } from "components/common/loaderPaper";

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

  const [value, setValue] = useState("tab1");
  const myMasterRef = useRef<any>(null);
  const initialValuesRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const [newFormMTdata, setNewFormMTdata] = useState<any>(limitEntryMetaData);
  const [isOpenSave, setIsOpenSave] = useState<any>(false);
  const [nscFDbtn, setNscFDbtn] = useState<any>(false);
  const [detailForm, setDetailForm] = useState<any>();
  const [gridDetailData, setGridDetailData] = useState<any>();
  let [messageArray, setmessageArray] = useState<any>([]);
  let [fdPopupMessage, setFdPopupMessage] = useState<any>(false);

  const securityLimitData: any = useMutation(
    "securityLimitData",
    LimitSecurityData,
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
      onError: (error: any) => {},
    }
  );

  const getLimitDetail: any = useMutation("getLimitDTL", getLimitDTL, {
    onSuccess: (data) => {
      setGridDetailData(data);
    },
    onError: (error: any) => {},
  });

  const nscDetail: any = useMutation("getLimitNSCdetail", getLimitNSCdetail, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });

  const fdDetail: any = useMutation("getLimitFDdetail", getLimitFDdetail, {
    onSuccess: (data) => {
      setGridDetailData(data);
    },
    onError: (error: any) => {
      setDetailForm("");
      setIsOpenSave(false);
      setFdPopupMessage(false);
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, { variant: "error" });
    },
  });

  const saveLimitData: any = useMutation(
    "saveChequebookData",
    saveLimitEntryData,
    {
      onSuccess: (data) => {},
    }
  );
  console.log("<<<saveLimitData", saveLimitData);

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getLimitDTL"]);
      queryClient.removeQueries(["securityLimitData"]);
      queryClient.removeQueries(["getLimitNSCdetail"]);
      queryClient.removeQueries(["getLimitFDdetail"]);
    };
  }, []);

  const onSubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    value
  ) => {
    //@ts-ignore
    endSubmit(true);

    console.log("<<<savehandle", data);
    saveLimitData.mutate(data);
  };

  const setFDAction = useCallback(
    (data) => {
      if (data?.name === "close") {
        setDetailForm("");
      }
    },
    [setDetailForm]
  );

  const popupOnclick = (rows, buttonName) => {
    const handleButtonClick = (flag) => {
      myMasterRef?.current?.getFieldData().then((res) => {
        if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
          const FD_DTLRequestPara = {
            COMP_CD: authState?.companyID,
            ACCT_CD: res?.ACCT_CD?.padStart(6, "0")?.padEnd(20, " "),
            ACCT_TYPE: res?.ACCT_TYPE,
            BRANCH_CD: res?.BRANCH_CD,
            LOGIN_COMP_CD: authState?.companyID,
            FLAG: flag,
          };
          fdDetail.mutate(FD_DTLRequestPara);
        }
      });
      setIsOpenSave(false);
      setmessageArray([]);
      setFdPopupMessage(false);
    };

    if (buttonName === "Ok") {
      setIsOpenSave(false);
      setmessageArray([]);
    } else if (buttonName === "Yes") {
      handleButtonClick("L");
    } else if (buttonName === "No") {
      handleButtonClick("C");
      setDetailForm("fddetail");
    }
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            if (newValue === "tab2") {
              myMasterRef?.current?.getFieldData().then((res) => {
                initialValuesRef.current = res;
                if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
                  limitEntryGridMetaData.gridConfig.gridLabel = `Limit-Entry Detail \u00A0\u00A0\u00A0\u00A0 ${
                    authState?.companyID +
                    res?.BRANCH_CD +
                    res?.ACCT_TYPE +
                    res?.ACCT_CD
                  }    \u00A0\u00A0\u00A0\u00A0  ${res?.ACCT_NM}`;

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

          {nscFDbtn && <Tab value="tab2" label="Limit Detail" />}
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
          {securityLimitData?.isError ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={
                    securityLimitData?.error?.error_msg ?? "Unknow Error"
                  }
                  errorDetail={securityLimitData?.error?.error_detail ?? ""}
                  color="error"
                />
              </AppBar>
            </div>
          ) : null}
          {value === "tab1" ? (
            <>
              {securityLimitData.isLoading || securityLimitData.isFetching ? (
                <LinearProgress color="secondary" />
              ) : (
                <LinearProgressBarSpacer />
              )}

              <FormWrapper
                key={"limitEntryForm" + newFormMTdata + setNewFormMTdata}
                metaData={newFormMTdata}
                initialValues={initialValuesRef.current ?? {}}
                onSubmitHandler={onSubmitHandler}
                loading={securityLimitData.isLoading}
                hideHeader={false}
                ref={myMasterRef}
                setDataOnFieldChange={(action, payload) => {
                  if (action === "SECURITY_CODE") {
                    securityLimitData.mutate({
                      COMP_CD: authState?.companyID,
                      SECURITY_CD: payload,
                      BRANCH_CD: authState?.user?.branchCode,
                    });
                  }

                  if (action === "MESSAGES") {
                    if (payload) {
                      messageArray = payload.split(", ").map((msg, i) => {
                        return <p>{`(${i + 1})  ${msg}`}</p>;
                      });
                    }
                    setmessageArray([messageArray]);
                    setIsOpenSave(() => true);
                  }
                  if (action === "NSC_FD_BTN") {
                    setNscFDbtn(payload?.NSC_FD_BTN);
                  }
                }}
              >
                {({ isSubmitting, handleSubmit }) => {
                  return (
                    <>
                      {nscFDbtn ? (
                        <>
                          <Button
                            color="primary"
                            onClick={() => {
                              setIsOpenSave(true);
                              setFdPopupMessage(true);
                              setmessageArray([
                                <div>
                                  Press 'Yes' then - to view Lien Marked FD(s)
                                  against this A/c.
                                  <br />
                                  Press 'No' then to view all the FD(s) of this
                                  Customer.
                                </div>,
                              ]);
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
                        disabled={isSubmitting}
                        //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
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
              <GridWrapper
                key={`limitEntryGridMetaData` + getLimitDetail.isSuccess}
                finalMetaData={limitEntryGridMetaData as GridMetaDataType}
                data={gridDetailData ?? []}
                setData={() => {}}
              />
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
                finalMetaData={FD_gridMetaData as GridMetaDataType}
                data={gridDetailData ?? []}
                setData={() => {}}
                loading={fdDetail.isLoading}
                actions={fdAction}
                setAction={setFDAction}
                // headerToolbarStyle={{
                //   background: "var(--theme-color2)",
                //   color: "black",
                // }}
                // refetchData={() => {}}
              />
            </Dialog>
          )}
        </>
      ) : detailForm === "nscdetail" ? (
        <Dialog
          open={true}
          PaperProps={{
            style: {
              maxWidth: "950px",
            },
          }}
        >
          <FormWrapper
            key={"nscdetailForm"}
            metaData={NSC_FormMetaData}
            initialValues={[]}
          >
            {({ isSubmitting, handleSubmit }) => {
              console.log("isSubmitting, handleSubmit", isSubmitting);
              return (
                <Button color="primary" onClick={() => setDetailForm("")}>
                  close
                </Button>
              );
            }}
          </FormWrapper>
        </Dialog>
      ) : null}

      {isOpenSave && messageArray?.length > 0 && (
        <div
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              popupOnclick("", "Ok");
            }
          }}
        >
          <PopupRequestWrapper
            MessageTitle={
              fdPopupMessage ? "Confirmation" : "Account Description"
            }
            Message={messageArray ? messageArray : "something is wrong "}
            onClickButton={(rows, buttonName) => {
              popupOnclick(rows, buttonName);
            }}
            buttonNames={fdPopupMessage ? ["Yes", "No"] : ["Ok"]}
            rows={[]}
            open={isOpenSave}
          />
        </div>
      )}
    </>
  );
};
