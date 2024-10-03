import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  Grid,
  Tab,
  Tabs,
} from "@mui/material";
import React, { useCallback, useContext, useRef, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import {
  DetailInsuranceGridMetaData,
  insuranceAccountRetrievemetaData,
  InsuranceEntryFormMetaData,
  ViewInsuranceMetaData,
} from "./insuranceEntryMetadata";
import { AuthContext } from "pages_audit/auth";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import * as API from "./api";
import { useTranslation } from "react-i18next";
import { cloneDeep } from "lodash";
import { InsuranceDetailForm } from "./insuranceDetail/insuranceDetailForm";
import { format } from "date-fns";
import { t } from "i18next";
import {
  LoaderPaperComponent,
  Alert,
  FormWrapper,
  MetaDataType,
  usePopupContext,
  ActionTypes,
  GridWrapper,
  GradientButton,
  MasterDetailsForm,
  MasterDetailsMetaData,
  GridMetaDataType,
  ClearCacheProvider,
} from "@acuteinfo/common-base";
import { LinearProgressBarSpacer } from "components/common/custom/linerProgressBarSpacer";

const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: t("ViewDetails"),
    multiple: false,
    rowDoubleClick: true,
  },
];
const InsuranceEntry = () => {
  const { authState } = useContext(AuthContext);
  const [isData, setIsData] = useState({
    isVisible: false,
    value: "tab1",
  });
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();
  const myMasterRef = useRef<any>(null);
  const navigate = useNavigate();
  const [reqData, setReqData] = useState<any>({});
  const [formDataRefresh, setFormDataRefresh] = useState(0);
  const [isRetrieveOpen, setIsRetrieveOpen] = useState(false);
  const [isRetrieveData, setIsRetrieveData] = useState<any>({});
  const isDataChangedRef = useRef(false);

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "view-detail") {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  const getInsuranceViewData: any = useMutation(
    "getInsuranceViewData",
    API.getInsuranceViewData,
    {
      onError: () => {
        setIsData((old) => ({ ...old }));
      },
    }
  );
  const getInsuranceDetailData: any = useMutation(API.getInsuranceDetailData, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },
    onSuccess: (data) => {
      data.forEach((item) => {
        const dueDate = new Date(item?.DUE_DATE); // Parse due date to a Date object
        const workingDate = new Date(authState?.workingDate); // Parse working date to a Date object

        if (item?.CONFIRMED === "Y") {
          if (dueDate > workingDate) {
            item._rowColor = "rgb(255,225,225)"; // Pink color for future due dates
          } else if (dueDate < workingDate) {
            item._rowColor = "rgb(192,192,192)"; // Gray color for past due dates
          }
        }
      });
    },
  });
  const doInsuranceDml: any = useMutation(API.doInsuranceDml, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
    },

    onSuccess: (data) => {
      enqueueSnackbar(t("DataSaveSuccessfully"), {
        variant: "success",
      });
      CloseMessageBox();
      myMasterRef?.current?.handleFormReset({ preventDefault: () => {} });
      setFormDataRefresh((old) => old + 1);
      setIsData((old) => ({ value: "tab1", isVisible: false }));
    },
  });
  const validateInsuranceEntryData: any = useMutation(
    API.validateInsuranceEntryData,
    {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
      },
      onSuccess: async (data, variables) => {},
    }
  );
  const handleDialogClose = () => {
    if (isDataChangedRef.current === true) {
      isDataChangedRef.current = true;
      if (reqData && Object.keys(reqData).length > 0) {
        if (reqData?.ACCT_CD && reqData?.ACCT_TYPE && reqData?.BRANCH_CD) {
          const RequestPara = {
            COMP_CD: authState?.companyID,
            ACCT_CD: reqData?.ACCT_CD,
            ACCT_TYPE: reqData?.ACCT_TYPE,
            BRANCH_CD: reqData?.BRANCH_CD,
            USER_LEVEL: authState?.role,
            A_GD_DATE: authState?.workingDate,
          };
          getInsuranceDetailData.mutate(RequestPara);
        }
      }
      isDataChangedRef.current = false;
    }
    navigate(".");
  };
  const AddNewRow = () => {
    myMasterRef.current?.addNewRow(true);
  };

  const onSubmitHandler = ({
    data,
    resultValueObj,
    resultDisplayValueObj,
    endSubmit,
  }) => {
    let newData = data;
    validateInsuranceEntryData.mutate(
      {
        COMP_CD: authState?.companyID,
        BRANCH_CD: authState?.user?.branchCode,
        ACCT_TYPE: data?.ACCT_TYPE,
        ACCT_CD: data?.ACCT_CD,
        INSURANCE_DATE: data?.INSURANCE_DATE,
        DUE_DATE: data?.DUE_DATE,
        COVER_NOTE: data?.COVER_NOTE,
        INSURANCE_COMP_CD: data?.INSURANCE_COMP_CD,
        POLICY_NO: data?.POLICY_NO,
        INSURANCE_AMOUNT: data?.INSURANCE_AMOUNT,
        NET_PREMIUM_AMT: data?.NET_PREMIUM_AMOUNT,
        SERVICE_CHARGE: data?.SERVICE_CHARGE,
        DTL_DATA: data?.DETAILS_DATA?.isNewRow,
        SCREEN_REF: "RPT/70",
      },
      {
        onSuccess: async (data, variables) => {
          let reqData = {
            ...newData,
            INSURANCE_DATE: format(
              new Date(newData?.INSURANCE_DATE),
              "dd/MMM/yyyy"
            ),
            DUE_DATE: format(new Date(newData?.DUE_DATE), "dd/MMM/yyyy"),
            TRAN_DT: format(new Date(newData?.TRAN_DT), "dd/MMM/yyyy"),
            COVER_NOTE: newData?.COVER_NOTE,
            INACTIVE_DATE: "",
            COMM_TYPE_CD: "",
            CONFIRMED: "N",
            OLD_STATUS: "",
            PREMIUM_AMOUNT: newData?.TOTAL_PRE,
            RENEWED_FLAG: "0",
            ENTERED_BRANCH_CD: authState?.user?.branchCode,
            ENTERED_COMP_CD: authState?.companyID,
            _UPDATEDCOLUMNS: [],
            _OLDROWVALUE: {},
            _isNewRow: true,
            _isDeleteRow: false,
            _isAllowRenewRow: false,
          };
          for (let i = 0; i < data?.length; i++) {
            if (data[i]?.O_STATUS === "0") {
              const buttonName = await MessageBox({
                messageTitle: t("Confirmation"),
                message: t("ProceedGen"),
                buttonNames: ["No", "Yes"],
                loadingBtnName: ["Yes"],
              });
              if (buttonName === "Yes") {
                doInsuranceDml.mutate(reqData);
              }
            } else if (data[i]?.O_STATUS === "9") {
              MessageBox({
                messageTitle: t("Alert"),
                message: data[i]?.O_MESSAGE,
              });
            } else if (data[i]?.O_STATUS === "99") {
              const buttonName = await MessageBox({
                messageTitle: t("Confirmation"),
                message: data[i]?.O_MESSAGE,
                buttonNames: ["No", "Yes"],
                loadingBtnName: ["Yes"],
              });
              if (buttonName === "Yes") {
                doInsuranceDml.mutate(reqData);
              }
            } else if (data[i]?.O_STATUS === "999") {
              MessageBox({
                messageTitle: t("ValidationFailed"),
                message: data[i]?.O_MESSAGE,
              });
            }
          }
        },
      }
    );
    endSubmit(true);
  };

  let metadata: MasterDetailsMetaData = {} as MasterDetailsMetaData;
  metadata = cloneDeep(InsuranceEntryFormMetaData) as MasterDetailsMetaData;
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={isData.value}
          sx={{ ml: "25px" }}
          onChange={(event, newValue) => {
            setIsData((old) => ({
              ...old,
              value: newValue,
            }));
            getInsuranceViewData.data = [];
            if (newValue === "tab2") {
              //API calling for Grid-Details on tab-change, and account number and name set to inside the header of Grid-details
              if (reqData && Object.keys(reqData).length > 0) {
                if (
                  reqData?.ACCT_CD &&
                  reqData?.ACCT_TYPE &&
                  reqData?.BRANCH_CD
                ) {
                  const RequestPara = {
                    COMP_CD: authState?.companyID,
                    ACCT_CD: reqData?.ACCT_CD,
                    ACCT_TYPE: reqData?.ACCT_TYPE,
                    BRANCH_CD: reqData?.BRANCH_CD,
                  };
                  getInsuranceViewData.mutate(RequestPara);
                }
              }
            } else if (newValue === "tab3") {
              if (reqData && Object.keys(reqData).length > 0) {
                if (
                  reqData?.ACCT_CD &&
                  reqData?.ACCT_TYPE &&
                  reqData?.BRANCH_CD
                ) {
                  const RequestPara = {
                    COMP_CD: authState?.companyID,
                    ACCT_CD: reqData?.ACCT_CD,
                    ACCT_TYPE: reqData?.ACCT_TYPE,
                    BRANCH_CD: reqData?.BRANCH_CD,
                    USER_LEVEL: authState?.role,
                    A_GD_DATE: authState?.workingDate,
                  };
                  getInsuranceDetailData.mutate(RequestPara);
                }
              }
            }
          }}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="tab1" label={t("InsuranceEntry")} />
          {isData.isVisible && <Tab value="tab2" label={t("InsuranceView")} />}
          {isData.isVisible && (
            <Tab value="tab3" label={t("InsuranceDetail")} />
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
          <>
            {doInsuranceDml?.isError || validateInsuranceEntryData?.isError ? (
              <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
                <AppBar position="relative" color="primary">
                  <Alert
                    severity="error"
                    errorMsg={
                      doInsuranceDml?.error?.error_msg ??
                      validateInsuranceEntryData?.error?.error_msg ??
                      "Unknow Error"
                    }
                    errorDetail={
                      doInsuranceDml?.error?.error_detail ??
                      validateInsuranceEntryData?.error?.error_detail ??
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
              <MasterDetailsForm
                key={
                  "InsuranceEntryForm" + formDataRefresh + isRetrieveData.length
                }
                metaData={metadata}
                // displayMode={"new"}
                initialData={{
                  ...isRetrieveData,
                  TRAN_DT: authState.workingDate,
                  INSURANCE_DATE: authState.workingDate,
                  DETAILS_DATA: [
                    {
                      _isNewRow: true,
                    },
                  ],
                }}
                onSubmitData={onSubmitHandler}
                // isLoading={validateInsuranceEntryData?.isLoading}
                // isNewRow={true}
                formState={{ MessageBox: MessageBox }}
                setDataOnFieldChange={(action, payload) => {
                  if (action === "IS_VISIBLE") {
                    setIsData((old) => ({
                      ...old,
                      isVisible: payload?.IS_VISIBLE,
                      // value: "tab2",
                    }));
                  } else if (action === "TAB_REQUEST") {
                    setReqData(payload);
                  }
                }}
                ref={myMasterRef}
                formStyle={{
                  background: "white",
                  height: "43vh",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                {({ isSubmitting, handleSubmit }) => {
                  return (
                    <>
                      <Button
                        onClick={() => {
                          setIsRetrieveOpen(true);
                        }}
                        color={"primary"}
                        disabled={isSubmitting}
                      >
                        {t("Retrieve")}
                      </Button>
                      <Button onClick={AddNewRow} color={"primary"}>
                        {t("AddRow")}
                      </Button>

                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        endIcon={
                          validateInsuranceEntryData?.isLoading ? (
                            <CircularProgress size={20} />
                          ) : null
                        }
                        color={"primary"}
                      >
                        {t("Save")}
                      </Button>
                    </>
                  );
                }}
              </MasterDetailsForm>
            </div>
            {/* )} */}
          </>
          {getInsuranceViewData.isLoading ? (
            <LoaderPaperComponent />
          ) : getInsuranceViewData?.isError ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={
                    getInsuranceViewData?.error?.error_msg ?? "Unknow Error"
                  }
                  errorDetail={getInsuranceViewData?.error?.error_detail ?? ""}
                  color="error"
                />
              </AppBar>
            </div>
          ) : (
            <LinearProgressBarSpacer />
          )}
          <div
            style={{ display: isData.value === "tab2" ? "inherit" : "none" }}
          >
            <FormWrapper
              key={"Insurance-View" + getInsuranceViewData?.isSuccess}
              metaData={(ViewInsuranceMetaData as MetaDataType) ?? {}}
              initialValues={getInsuranceViewData?.data?.[0] ?? {}}
              onSubmitHandler={() => {}}
              displayMode={"view"}
            ></FormWrapper>
          </div>
          <div
            style={{ display: isData.value === "tab3" ? "inherit" : "none" }}
          >
            {getInsuranceDetailData.isError && (
              <Alert
                severity="error"
                errorMsg={
                  getInsuranceDetailData.error?.error_msg ??
                  "Something went to wrong.."
                }
                errorDetail={getInsuranceDetailData.error?.error_detail}
                color="error"
              />
            )}
            <>
              <GridWrapper
                key={`Insurance-Detail`}
                finalMetaData={DetailInsuranceGridMetaData as GridMetaDataType}
                data={getInsuranceDetailData?.data ?? []}
                setData={() => {}}
                loading={getInsuranceDetailData.isLoading}
                actions={actions}
                setAction={setCurrentAction}
              />
            </>
          </div>
          <>
            {isRetrieveOpen ? (
              <>
                <Dialog
                  open={isRetrieveOpen}
                  PaperProps={{
                    style: {
                      width: "100%",
                    },
                  }}
                  maxWidth="sm"
                >
                  <FormWrapper
                    key={"accountFindmetaData"}
                    metaData={insuranceAccountRetrievemetaData as MetaDataType}
                    formStyle={{
                      background: "white",
                    }}
                    controlsAtBottom={true}
                    onSubmitHandler={async (
                      data: any,
                      displayData,
                      endSubmit,
                      setFieldError,
                      action
                    ) => {
                      //@ts-ignore
                      endSubmit(true);
                      setIsRetrieveData(data);
                      setIsRetrieveOpen(false);
                      setFormDataRefresh((old) => old + 1);
                    }}
                    formState={{
                      MessageBox: MessageBox,
                    }}
                    setDataOnFieldChange={(action, payload) => {
                      if (action === "IS_VISIBLE") {
                        setIsData((old) => ({
                          ...old,
                          isVisible: payload?.IS_VISIBLE,
                        }));
                      } else if (action === "TAB_REQUEST") {
                        setReqData(payload);
                      }
                    }}
                  >
                    {({ isSubmitting, handleSubmit }) => (
                      <>
                        <GradientButton
                          onClick={(event) => {
                            handleSubmit(event, "Save");
                          }}
                          color={"primary"}
                        >
                          Ok
                        </GradientButton>

                        <GradientButton
                          onClick={() => {
                            setIsRetrieveOpen(false);
                            setFormDataRefresh((old) => old + 1);
                            setIsRetrieveData({});
                          }}
                          color={"primary"}
                          // disabled={
                          //   isSubmitting || getAccountDetails.isLoading || disableButton
                          // }
                        >
                          Cancel
                        </GradientButton>
                      </>
                    )}
                  </FormWrapper>
                </Dialog>
              </>
            ) : null}
          </>
        </Grid>

        <>
          <Routes>
            <Route
              path="view-detail/*"
              element={
                <InsuranceDetailForm
                  handleDialogClose={handleDialogClose}
                  isDataChangedRef={isDataChangedRef}
                  defaultView={"view"}
                />
              }
            />
          </Routes>
        </>
      </Container>
    </>
  );
};

export const InsuranceEntryForm = () => {
  return (
    <ClearCacheProvider>
      <InsuranceEntry />
    </ClearCacheProvider>
  );
};
