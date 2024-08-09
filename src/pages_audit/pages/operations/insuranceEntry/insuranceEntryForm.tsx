import {
  AppBar,
  Box,
  Button,
  CircularProgress,
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
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { usePopupContext } from "components/custom/popupContext";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTableStatic";
import { DetailInsuranceGridMetaData, InsuranceEntryFormMetaData, ViewInsuranceMetaData } from "./insuranceEntryMetadata";
import { ActionTypes } from "components/dataTable";
import { Alert } from "components/common/alert";
import { AuthContext } from "pages_audit/auth";
import { SubmitFnType } from "packages/form";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import { useTranslation } from "react-i18next";
import { MasterDetailsForm } from "components/formcomponent";
import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { cloneDeep } from "lodash";
import { utilFunction } from "components/utils";
import { LoaderPaperComponent } from "components/common/loaderPaper";

const InsuranceEntry = () => {
  const actions: ActionTypes[] = [
    {
      actionName: "expire-lien",
      actionLabel: "Expire Lien",
      multiple: false,
      rowDoubleClick: true,
    },
  ];

  const { authState } = useContext(AuthContext);
  const [isData, setIsData] = useState({
    isVisible: false,
    value: "tab1",
    closeAlert: true,
  });
  const [currentTab, setCurrentTab] = useState("tab0");
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();
  const myMasterRef = useRef<any>(null);
  const navigate = useNavigate();
  const [reqData, setReqData] = useState<any>({});

  const getInsuranceViewData: any = useMutation(
    "getInsuranceViewData",
    API.getInsuranceViewData,
    {
      onError: () => {
        setIsData((old) => ({ ...old, closeAlert: true }));
      },
    }
  );
  const getInsuranceDetailData: any = useMutation(
    API.getInsuranceDetailData,
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

      onSuccess: (data) => { },
    }
  );
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

      onSuccess: async (data) => {
        for (let i = 0; i < data?.length; i++) {
          if (data[i]?.O_STATUS === "0") {
            // const buttonName = await MessageBox({
            //   messageTitle: t("ValidationSuccessful"),
            //   message: t("AreYouSurePostThisCheque"),
            //   buttonNames: ["No", "Yes"],
            //   loadingBtnName: ["Yes"],
            // });
            // if (buttonName === "Yes") {
            //   postConfigDML.mutate({
            //     ...commonReqData,
            //     CHEQUE_DT: mysubdtlRef.current?.CHEQUE_DT
            //       ? format(
            //         new Date(mysubdtlRef.current["CHEQUE_DT"]),
            //         "dd/MMM/yyyy"
            //       )
            //       : "",
            //     DRAFT_DIV: mysubdtlRef.current?.DRAFT_DIV,
            //     _UPDATEDCOLUMNS: [],
            //     _OLDROWVALUE: {},
            //     _isNewRow: true,
            //   });
            // }
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
            // if (buttonName === "Yes") {
            //   postConfigDML.mutate({
            //     ...commonReqData,
            //     CHEQUE_DT: mysubdtlRef.current?.CHEQUE_DT
            //       ? format(
            //         new Date(mysubdtlRef.current["CHEQUE_DT"]),
            //         "dd/MMM/yyyy"
            //       )
            //       : "",
            //     DRAFT_DIV: mysubdtlRef.current?.DRAFT_DIV,
            //     _UPDATEDCOLUMNS: [],
            //     _OLDROWVALUE: {},
            //     _isNewRow: true,
            //   });
            // }
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

  const AddNewRow = () => {
    myMasterRef.current?.addNewRow(true);
  };

  const onSubmitHandler = ({
    data,
    resultValueObj,
    resultDisplayValueObj,
    endSubmit,
  }) => {
    console.log("data", data)

    validateInsuranceEntryData.mutate({
      COMP_CD: authState?.companyID,
      BRANCH_CD: authState?.user?.branchCode,
      ACCT_TYPE: data?.ACCT_TYPE,
      ACCT_CD: data?.ACCT_CD,
      INSURANCE_DATE: data?.INSURANCE_DATE,
      DUE_DATE: data?.DUE_DATE,
      COVER_NOTE: data?.INSURANCE_MST_COVER_NOTE,
      INSURANCE_COMP_CD: data?.INSURANCE_COMP_CD,
      POLICY_NO: data?.POLICY_NO,
      INSURANCE_AMOUNT: data?.INSURANCE_AMOUNT,
      NET_PREMIUM_AMT: data?.NET_PREMIUM_AMOUNT,
      SERVICE_CHARGE: data?.SERVICE_CHARGE,
      DTL_DATA: data?.DETAILS_DATA?.isNewRow,
      SCREEN_REF: "RPT/70"
    })
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
              closeAlert: false,
            }));
            getInsuranceViewData.data = [];
            if (newValue === "tab2") {
              //API calling for Grid-Details on tab-change, and account number and name set to inside the header of Grid-details
              if (reqData && Object.keys(reqData).length > 0) {
                if (reqData?.ACCT_CD && reqData?.ACCT_TYPE && reqData?.BRANCH_CD) {
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
                if (reqData?.ACCT_CD && reqData?.ACCT_TYPE && reqData?.BRANCH_CD) {
                  const RequestPara = {
                    COMP_CD: authState?.companyID,
                    ACCT_CD: reqData?.ACCT_CD,
                    ACCT_TYPE: reqData?.ACCT_TYPE,
                    BRANCH_CD: reqData?.BRANCH_CD,
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
          <Tab value="tab1" label={t("Insurance Entry")} />
          {isData.isVisible && <Tab value="tab2" label={t("Insurance View")} />}
          {isData.isVisible && <Tab value="tab3" label={t("Insurance Detail")} />}
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

            <div
              style={{ display: isData.value === "tab1" ? "inherit" : "none" }}
            >
              <MasterDetailsForm
                key={"InsuranceEntryForm"}
                metaData={metadata}
                // displayMode={"new"}
                initialData={{
                  TRAN_DT: authState.workingDate,
                  INSURANCE_DATE: authState.workingDate,
                  DETAILS_DATA: [{
                    _isNewRow: true
                  }],
                }}
                onSubmitData={onSubmitHandler}
                // isLoading={uploadDocuments?.isLoading}
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
                      <Button onClick={AddNewRow} color={"primary"} >
                        {t("AddRow")}
                      </Button>

                      <Button
                        onClick={handleSubmit}
                        // disabled={isSubmitting}
                        endIcon={
                          isSubmitting ? <CircularProgress size={20} /> : null
                        }
                        color={"primary"}
                      >
                        {t("Save")}
                      </Button>
                      {/* <Button
                      onClick={() => navigate(".")}
                      // disabled={isSubmitting}
                      color={"primary"}
                    >
                      {t("Close")}
                    </Button> */}
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
                    getInsuranceViewData?.error?.error_msg ??
                    "Unknow Error"
                  }
                  errorDetail={
                    getInsuranceViewData?.error?.error_detail ??
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
            style={{ display: isData.value === "tab2" ? "inherit" : "none" }}
          >
            <FormWrapper
              key={"Insurance-View" + getInsuranceViewData?.isSuccess}
              metaData={(ViewInsuranceMetaData as MetaDataType) ?? {}}
              initialValues={getInsuranceViewData?.data?.[0] ?? {}}
              onSubmitHandler={{}}
              // ref={ }
              displayMode={"view"}
              // hideHeader={true}
              formState={{ MessageBox: MessageBox }}
              setDataOnFieldChange={(action, payload) => {
                if (action === "IS_VISIBLE") {
                  setIsData((old) => ({
                    ...old,
                    isVisible: payload?.IS_VISIBLE,
                  }));
                }
              }}
            >
            </FormWrapper>
          </div>
          <div
            style={{ display: isData.value === "tab3" ? "inherit" : "none" }}
          >
            <>
              <GridWrapper
                key={`Insurance-Detail`}
                finalMetaData={DetailInsuranceGridMetaData as GridMetaDataType}
                data={getInsuranceDetailData?.data ?? []}
                setData={() => { }}
                loading={getInsuranceDetailData.isLoading}
              // onClickActionEvent={async (index, id, data) => {
              //   let res = await MessageBox({
              //     messageTitle: "confirmation",
              //     message: "AreYouSureToForceExp",
              //     buttonNames: ["Yes", "No"],
              //   });
              //   if (res === "Yes") {
              //     let Apireq = {
              //       isNewRow: false,
              //       COMP_CD: data?.COMP_CD,
              //       BRANCH_CD: data?.BRANCH_CD,
              //       ACCT_TYPE: data?.ACCT_TYPE,
              //       ACCT_CD: data?.ACCT_CD,
              //       SR_CD: data?.SR_CD,
              //     };
              //     crudTempOD.mutate(Apireq);
              //   }
              // }}
              />
            </>
          </div>
        </Grid>
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
