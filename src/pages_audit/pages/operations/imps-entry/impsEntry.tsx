import {
  AppBar,
  Button,
  Container,
  Dialog,
  Grid,
  LinearProgress,
} from "@mui/material";
import { t } from "i18next";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "pages_audit/auth";
import { impsEntryMetadata, impsRegDetails } from "./impsEntryMetadata";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import i18n from "components/multiLanguage/languagesConfiguration";
import { RetrieveData } from "./retrieveData/retrieveData";
import { DayLimit } from "./dayLimit/dayLimit";
import {
  extractMetaData,
  Alert,
  ClearCacheProvider,
  usePopupContext,
  FormWrapper,
  MetaDataType,
  utilFunction,
} from "@acuteinfo/common-base";
import { LinearProgressBarSpacer } from "components/common/custom/linerProgressBarSpacer";
import { format } from "date-fns";
import { enqueueSnackbar } from "notistack";

export const ImpsEntryCustom = () => {
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [isData, setIsData] = useState<any>({
    closeAlert: true,
    uniqueNo: 0,
  });
  const [formMode, setFormMode] = useState<any>("add");
  const [retrieveData, setRetrieveData] = useState<any>();
  const [rowData, setRowData] = useState<any>();
  const [currentIndex, setCurrentIndex] = useState<any>(0);
  const formRef = useRef<any>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const impsDetails: any = useMutation(
    ["getImpsDetails"],
    () =>
      API.getImpsDetails({
        ENT_COMP_CD: retrieveData?.[0]?.ENTERED_COMP_CD,
        ENT_BRANCH_CD: retrieveData?.[0]?.ENTERED_BRANCH_CD,
        TRAN_CD: retrieveData?.[0]?.TRAN_CD,
      }),
    {
      onSuccess(data) {
        if (Array.isArray(data) && data?.length > 0) {
          setRowData(data);
        } else {
          setRowData([]);
        }
        setIsData((old) => ({ ...old, uniqueNo: Date.now() }));
      },
      onError(err) {
        setIsData((old) => ({
          ...old,
          closeAlert: true,
        }));
      },
    }
  );
  useEffect(() => {
    setIsData((old) => ({ ...old, uniqueNo: Date.now() }));
    if (retrieveData?.[0]?.TRAN_CD) {
      impsDetails.mutate();
    }
  }, [retrieveData?.[0]?.TRAN_CD]);

  const accountList: any = useMutation("getRtgsRetrieveData", API.getAcctList, {
    onSuccess: (data) => {
      if (rowData?.length > 0) {
        function isMatch(item1, item2) {
          return (
            item1.COMP_CD.trim() === item2.COMP_CD.trim() &&
            item1.BRANCH_CD.trim() === item2.BRANCH_CD.trim() &&
            item1.ACCT_TYPE.trim() === item2.ACCT_TYPE.trim() &&
            item1.ACCT_CD.trim() === item2.ACCT_CD.trim()
          );
        }
        let filteredData = data.filter((d2Item) => {
          return !rowData.some((d1Item) => isMatch(d1Item, d2Item));
        });

        if (filteredData?.length > 0) {
          messagebox(filteredData);
        }
      } else {
        setRowData(data);
        setIsData((old) => ({ ...old, uniqueNo: Date.now() }));
      }
    },
    onError(err) {
      setIsData((old) => ({
        ...old,
        closeAlert: true,
      }));
    },
  });

  const crudIMPS: any = useMutation("crudDataIMPS", API.crudDataIMPS, {
    onSuccess: (data, variables) => {
      console.log("<<<imps", data, variables);
      if (variables?._isNewRow) {
        formRef?.current?.handleFormReset({ preventDefault: () => {} });
        enqueueSnackbar(t("RecordInsertedMsg"), { variant: "success" });
      } else if (variables?._isDeleteRow) {
        enqueueSnackbar(t("RecordRemovedMsg"), { variant: "success" });
      } else if (variables?._isUpdateRow) {
        enqueueSnackbar(t("RecordUpdatedMsg"), { variant: "success" });
      }
      CloseMessageBox();
    },
    onError() {
      CloseMessageBox();
      setIsData((old) => ({
        ...old,
        closeAlert: true,
      }));
    },
  });

  const validateDelete: any = useMutation(
    "getRtgsRetrieveData",
    API.validateDeleteData,
    {
      onSuccess: (data, variables) => {
        if (data?.[0]?.O_STATUS !== "0") {
          MessageBox({
            messageTitle: "ValidationAlert",
            message: data?.[0]?.O_MESSAGE,
          });
        } else {
          if (rowData?.length !== currentIndex) {
            if (variables?.FLAG === "S") {
            } else {
              setCurrentIndex((old) => old + 1);
              setTimeout(() => {
                deleteData({ flag: "A" });
              }, 1000);
            }
          } else {
            console.log(
              "<<<valodate del",
              rowData?.length,
              rowData,
              currentIndex
            );
          }
        }
      },
      onError(err) {
        setIsData((old) => ({
          ...old,
          closeAlert: true,
        }));
      },
    }
  );

  const deleteData: any = ({ flag, reqData }) => {
    let apiReq = {
      A_ENTERED_BY: retrieveData?.[0]?.ENTERED_BY ?? "",
      A_CONFIRMED: retrieveData?.[0]?.CONFIRMED ?? "",
      A_LOGIN_COMP: authState?.companyID,
      A_LOGIN_BRANCH: authState?.user?.branchCode,
      WORKING_DATE: authState?.workingDate,
      USERNAME: authState?.user?.id,
      USERROLE: authState?.role,
      A_BRANCH_CD:
        flag === "S"
          ? reqData?.BRANCH_CD
          : flag === "A"
          ? rowData[currentIndex]?.BRANCH_CD
          : "",
      A_ACCT_TYPE:
        flag === "S"
          ? reqData?.ACCT_TYPE
          : flag === "A"
          ? rowData[currentIndex]?.ACCT_TYPE
          : "",
      A_ACCT_CD:
        flag === "S"
          ? reqData?.ACCT_CD
          : flag === "A"
          ? rowData[currentIndex]?.ACCT_CD
          : "",
      A_REG_DT:
        flag === "S"
          ? reqData?.REG_DATE
          : flag === "A"
          ? rowData[currentIndex]?.REG_DT
            ? format(new Date(rowData[currentIndex]?.REG_DT), "dd/MMM/yyyy")
            : ""
          : "",
      FLAG: flag,
    };
    validateDelete.mutate(apiReq);
  };

  const messagebox = async (filterData) => {
    let insertData: any = [];
    if (filterData?.length) {
      for (let i = 0; i < filterData?.length; i++) {
        if (filterData[i]?.STATUS !== "0") {
          await MessageBox({
            messageTitle: "Alert Message",
            message: filterData[i]?.MESSAGE,
            defFocusBtnName: "Ok",
          });
        } else {
          insertData.push(filterData[i]);
        }
      }
      setRowData((old) => {
        return [...old, ...insertData];
      });
      setIsData((old) => ({ ...old, uniqueNo: Date.now() }));
    }
  };

  const onSubmitHandler = async (data: any, displayData, endSubmit) => {
    // @ts-ignore
    endSubmit(true);

    // console.log("<<<onsub", data, retrieveData, rowData, populate);

    let messagebox = async (apiReq) => {
      let buttonName = await MessageBox({
        messageTitle: rowData?.length ? "confirmation" : "Alert",
        message: rowData?.length
          ? "Are you sure to procced"
          : "Atleast one row must be in Detail",
        defFocusBtnName: rowData?.length ? "Yes" : "Ok",
        buttonNames: rowData?.length ? ["Yes", "No"] : ["Ok"],
        loadingBtnName: ["Yes"],
        icon: "INFO",
      });
      if (buttonName === "Yes") {
        crudIMPS.mutate(apiReq);
      }
    };

    if (rowData?.length) {
      let newData = data?.accMapping;
      let oldData = rowData;

      let formdata = { ...data };
      delete formdata?.accMapping;
      delete formdata?.POPULATE;
      delete formdata?.ROWDATA_LENGTH;
      delete formdata?.RETRIEVE_DATA;

      let upd = utilFunction.transformDetailsData(
        formdata ?? {},
        retrieveData?.[0] ?? {}
      );

      let updPara = utilFunction.transformDetailDataForDML(
        formMode === "add" ? [] : oldData,
        newData ?? [],
        ["SR_CD", "ACCT_TYPE", "BRANCH_CD"]
      );
      let apiReq = {
        _isNewRow: formMode === "add" ? true : false,
        _isDeleteRow: false,
        _isUpdateRow: formMode !== "add" ? true : false,
        ...formdata,
        DEACTIVE_DT: formdata?.DEACTIVE_DT
          ? format(new Date(formdata?.DEACTIVE_DT), "dd/MMM/yyyy")
          : "",
        ACTIVE:
          formdata?.ACTIVE === "Y" || Boolean(formdata?.ACTIVE) ? "Y" : "N",
        ...(formMode !== "add" ? upd : {}),
        DETAILS_DATA: {
          ...updPara,
        },
      };
      messagebox(apiReq);
    } else {
      messagebox(null);
    }

    // console.log("<<<upd", upd, updPara, apiReq);
  };
  // const deleteData: any = async ({ FLAG, DATA }) => {
  //   const formdata = await formRef?.current?.getFieldData();

  //   let buttonName = await MessageBox({
  //     messageTitle: "Confirmation",
  //     message: "Are you sure to proceed",
  //     buttonNames: ["Yes", "No"],
  //     loadingBtnName: ["Yes"],
  //   });

  //   if (buttonName === "Yes") {
  //     let apiReq = {
  //       _isNewRow: false,
  //       _isDeleteRow: true,
  //       _isUpdateRow: false,
  //       ENTERED_BRANCH_CD: formdata?.ENTERED_BRANCH_CD,
  //       ENTERED_COMP_CD: formdata?.ENTERED_COMP_CD,
  //       TRAN_CD: formdata?.TRAN_CD,
  //       CONFIRMED: formdata?.CONFIRMED,
  //       DETAILS_DATA: {
  //         isNewRow: [],
  //         isDeleteRow: rowData,
  //         isUpdatedRow: [],
  //       },
  //     };
  //     crudIMPS.mutate(apiReq);
  //   }
  // };

  const RowData = (rowData) => {
    if (formMode === "edit") {
      navigate("daylimit-form", { state: rowData });
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "s" && event.ctrlKey) {
        event.preventDefault();
        formRef?.current?.handleSubmit({ preventDefault: () => {} }, "Save");
      } else if (event.key === "r" && event.ctrlKey) {
        event.preventDefault();
        navigate("retrieve-form");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
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
          {accountList?.isLoading ||
          validateDelete?.isLoading ||
          impsDetails?.isLoading ? (
            <LinearProgress color="inherit" />
          ) : (accountList?.isError && isData.closeAlert) ||
            (validateDelete?.isError && isData.closeAlert) ||
            (crudIMPS?.isError && isData.closeAlert) ||
            (impsDetails?.isError && isData.closeAlert) ? (
            <AppBar position="relative" color="primary">
              <Alert
                severity="error"
                errorMsg={
                  accountList?.error?.error_msg ??
                  validateDelete?.error?.error_msg ??
                  crudIMPS?.error?.error_msg ??
                  impsDetails?.error?.error_msg ??
                  "Unknow Error"
                }
                errorDetail={
                  accountList?.error?.error_detail ??
                  validateDelete?.error?.error_detail ??
                  crudIMPS?.error?.error_detail ??
                  impsDetails?.error?.error_detail ??
                  ""
                }
                color="error"
              />
            </AppBar>
          ) : (
            <LinearProgressBarSpacer />
          )}
          <FormWrapper
            key={
              "imps-entry" +
              formMode +
              // retrieveData?. +
              isData?.uniqueNo
            }
            metaData={
              extractMetaData(impsEntryMetadata, formMode) as MetaDataType
            }
            initialValues={{
              ...retrieveData?.[0],
              accMapping: rowData,
              ROWDATA_LENGTH: rowData?.length ?? {},
            }}
            formState={{
              MessageBox: MessageBox,
              onArrayFieldRowDoubleClickHandle: RowData,
              FORM_MODE: formMode,
              setRowData: setRowData,
              setIsData: setIsData,
            }}
            onSubmitHandler={onSubmitHandler}
            formStyle={{
              height: "166px",
              // height: "calc(100vh - 576px)",
            }}
            displayMode={formMode}
            ref={formRef}
            onFormButtonClickHandel={(id, dependent) => {
              if (
                dependent?.CUSTOMER_ID &&
                dependent?.CUSTOMER_ID?.value !== ""
              ) {
                accountList.mutate({
                  COMP_CD: authState?.companyID,
                  CUSTOMER_ID: dependent?.CUSTOMER_ID?.value,
                  A_LANG: i18n.resolvedLanguage,
                });
              }
              if (id === "accMapping[0].ALLLOW_DELETE") {
                deleteData({
                  flag: "S",
                  reqData: {
                    REG_DATE: dependent?.["accMapping.REG_DATE"]?.value
                      ? format(
                          new Date(dependent?.["accMapping.REG_DATE"]?.value),
                          "dd/MMM/yyyy"
                        )
                      : "",
                    BRANCH_CD: dependent?.["accMapping.BRANCH_CD"]?.value,
                    ACCT_TYPE: dependent?.["accMapping.ACCT_TYPE"]?.value,
                    ACCT_CD: dependent?.["accMapping.ACCT_CD"]?.value,
                  },
                });
              }
            }}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                {retrieveData?.length > 0 && (
                  <>
                    <Button
                      onClick={() =>
                        setFormMode(formMode === "edit" ? "view" : "edit")
                      }
                      color={"primary"}
                      disabled={
                        accountList?.isLoading || validateDelete?.isLoading
                      }
                    >
                      {formMode === "edit" ? t("View") : t("Edit")}
                    </Button>
                    <Button
                      onClick={() => {
                        setFormMode("add");
                        setRetrieveData(null);
                        setRowData(null);
                      }}
                      disabled={
                        accountList?.isLoading || validateDelete?.isLoading
                      }
                      color={"primary"}
                    >
                      {t("New")}
                    </Button>
                    <Button
                      onClick={() => deleteData({ flag: "M" })}
                      disabled={
                        accountList?.isLoading || validateDelete?.isLoading
                      }
                      color={"primary"}
                    >
                      {t("Delete")}
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => navigate("retrieve-form")}
                  color={"primary"}
                  disabled={accountList?.isLoading || validateDelete?.isLoading}
                >
                  {t("Retrieve")}
                </Button>
                <Button
                  color={"primary"}
                  disabled={accountList?.isLoading || validateDelete?.isLoading}
                  onClick={(event) => handleSubmit(event, "BUTTON_CLICK")}
                >
                  {t("Save")}
                </Button>
              </>
            )}
          </FormWrapper>
          <Routes>
            <Route
              path="retrieve-form/*"
              element={
                <RetrieveData
                  navigate={navigate}
                  setFormMode={setFormMode}
                  setRetrieveData={setRetrieveData}
                />
              }
            />
            <Route
              path="daylimit-form/*"
              element={<DayLimit navigate={navigate} />}
            />
          </Routes>
        </Grid>
      </Container>
    </>
  );
};

export const ImpsEntry = () => {
  return (
    <ClearCacheProvider>
      <ImpsEntryCustom />
    </ClearCacheProvider>
  );
};
