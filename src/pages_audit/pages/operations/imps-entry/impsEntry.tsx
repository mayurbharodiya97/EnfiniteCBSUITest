import {
  AppBar,
  Button,
  Container,
  Dialog,
  Grid,
  LinearProgress,
} from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { t } from "i18next";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { usePopupContext } from "components/custom/popupContext";
import { useTranslation } from "react-i18next";
import { AuthContext } from "pages_audit/auth";
import { impsEntryMetadata, impsRegDetails } from "./impsEntryMetadata";
import { ClearCacheProvider } from "cache";
import { useMutation, useQuery } from "react-query";

import * as API from "./api";
import { Alert } from "components/common/alert";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import i18n from "components/multiLanguage/languagesConfiguration";
import { RetrieveData } from "./retrieveData/retrieveData";
import { DayLimit } from "./dayLimit/dayLimit";
import { extractMetaData } from "components/utils";

export const ImpsEntryCustom = () => {
  const [isData, setIsData] = useState({
    isVisible: false,
    closeAlert: true,
  });
  const { authState } = useContext(AuthContext);
  const { MessageBox } = usePopupContext();
  const [formMode, setFormMode] = useState<any>("add");
  const [retrieveData, setRetrieveData] = useState<any>();
  const [rowData, setRowData] = useState<any>();
  const formRef = useRef<any>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const accountList: any = useMutation("getRtgsRetrieveData", API.getAcctList, {
    onSuccess: (data) => {
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
    },
  });

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
    }
  };

  const { isError, error, isLoading } = useQuery<any, any>(
    ["getImpsDetails"],
    () =>
      API.getImpsDetails({
        ENT_COMP_CD: retrieveData?.[0]?.ENTERED_COMP_CD,
        ENT_BRANCH_CD: retrieveData?.[0]?.ENTERED_BRANCH_CD,
        TRAN_CD: retrieveData?.[0]?.TRAN_CD,
      }),
    {
      enabled: !!retrieveData?.[0]?.TRAN_CD,
      onSuccess(data) {
        if (Array.isArray(data) && data?.length > 0) {
          setRowData(data);
        }
      },
    }
  );

  // const onSubmitHandler = ({ data, displayData, endSubmit }) => {
  //   //@ts-ignore
  //   endSubmit(true);
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
          {accountList?.isLoading || isLoading ? (
            <LinearProgress color="inherit" />
          ) : accountList?.isError || isError ? (
            <AppBar position="relative" color="primary">
              <Alert
                severity="error"
                errorMsg={
                  accountList?.error?.error_msg ??
                  error?.error_msg ??
                  "Unknow Error"
                }
                errorDetail={
                  accountList?.error?.error_detail ?? error?.error_detail ?? ""
                }
                color="error"
              />
            </AppBar>
          ) : (
            <LinearProgressBarSpacer />
          )}
          <FormWrapper
            key={"imps-entry" + formMode}
            metaData={
              extractMetaData(impsEntryMetadata, formMode) as MetaDataType
            }
            initialValues={
              formMode === "view" || formMode === "edit"
                ? retrieveData?.[0]
                : {}
            }
            formState={{ MessageBox: MessageBox }}
            onSubmitHandler={(data: any, displayData, endSubmit) => {
              // @ts-ignore
              endSubmit(true);
            }}
            formStyle={{
              height: "calc(100vh - 562px)",
            }}
            displayMode={formMode}
            ref={formRef}
            onFormButtonClickHandel={(id, dependentFields) => {
              if (
                dependentFields?.CUSTOMER_ID &&
                dependentFields?.CUSTOMER_ID?.value !== ""
              ) {
                accountList.mutate({
                  COMP_CD: authState?.companyID,
                  CUSTOMER_ID: dependentFields?.CUSTOMER_ID?.value,
                  A_LANG: i18n.resolvedLanguage,
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
                    >
                      {formMode === "edit" ? t("View") : t("Edit")}
                    </Button>
                    <Button
                      onClick={() => {
                        setFormMode("add");
                        setRetrieveData(null);
                        setRowData(null);
                      }}
                      color={"primary"}
                    >
                      {t("New")}
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => navigate("retrieve-form")}
                  color={"primary"}
                >
                  {t("Retrieve")}
                </Button>
                <Button
                  color={"primary"}
                  // onClick={(event) =>
                  //   formRef?.current?.handleSubmit(event, "BUTTON_CLICK")
                  // }
                  // endIcon={
                  //   mutation?.isLoading ? <CircularProgress size={20} /> : null
                  // }
                >
                  {t("Save")}
                </Button>
              </>
            )}
          </FormWrapper>

          <FormWrapper
            key={
              "impsReg-details" +
              // accountList?.isSuccess +
              // isSuccess +
              formMode +
              rowData
            }
            metaData={extractMetaData(impsRegDetails, formMode) as MetaDataType}
            initialValues={
              { accMapping: rowData ?? {} }
              // { accMapping: accountList?.data }
            }
            hideHeader={true}
            displayMode={formMode}
            formState={{
              MessageBox: MessageBox,
              onArrayFieldRowDoubleClickHandle: RowData,
            }}
            onSubmitHandler={(data: any, displayData, endSubmit) => {
              // @ts-ignore
              endSubmit(true);
            }}
            formStyle={{
              height: "calc(100vh - 368px)",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {({ isSubmitting, handleSubmit }) => <></>}
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
