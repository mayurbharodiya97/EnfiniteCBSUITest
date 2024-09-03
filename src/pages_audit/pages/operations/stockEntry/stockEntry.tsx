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
import { usePopupContext } from "components/custom/popupContext";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTableStatic";
import { StockEditViewWrapper } from "./documents/documentViewUpload";
import { RemarksAPIWrapper } from "components/custom/Remarks";
import { StockEntryMetaData } from "./stockEntryMetadata";
import { StockGridMetaData } from "./stockGridMetadata";
import { ActionTypes } from "components/dataTable";
import { ForceExpireStock } from "./forceExpire/forceExpire";
import { Alert } from "components/common/alert";
import { AuthContext } from "pages_audit/auth";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import { ClearCacheProvider, queryClient } from "cache";
import {
  crudStockData,
  insertValidate,
  securityFieldDTL,
  stockGridData,
} from "./api";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

const StockEntryCustom = () => {
  const [isData, setIsData] = useState({
    isDelete: false,
    isVisible: false,
    value: "tab1",
    closeAlert: true,
    newFormMTdata: StockEntryMetaData,
  });
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const myMasterRef = useRef<any>(null);
  const reqDataRef = useRef<any>({});
  const { deleteReq } = reqDataRef.current;

  const detailActions: ActionTypes[] = [
    {
      actionName: "force-view-details",
      actionLabel: "ForceExpViewDetail",
      multiple: false,
      rowDoubleClick: true,
    },
    {
      actionName: "view-upload",
      actionLabel: "ViewUploadDocument",
      multiple: false,
      rowDoubleClick: false,
    },
  ];

  const securityStoclDTL: any = useMutation(
    "securityFieldDTL",
    securityFieldDTL,
    {
      onSuccess: (data) => {
        let newData;
        if (data.length > 0) {
          let newMetadata: any = [...StockEntryMetaData.fields, ...data];
          newData = { ...isData.newFormMTdata, fields: newMetadata };
        } else {
          newData = { ...StockEntryMetaData };
        }
        setIsData((old) => ({ ...old, newFormMTdata: newData }));
      },
      onError: () => {
        setIsData((old) => ({ ...old, closeAlert: true }));
      },
    }
  );

  const stockEntryGridData: any = useMutation("stockGridData", stockGridData, {
    onError: () => {
      setIsData((old) => ({ ...old, closeAlert: true }));
    },
  });

  const insertValidateData: any = useMutation(
    "insertValidate",
    insertValidate,
    {
      onSuccess: (data) => {
        async function insertData() {
          if (data?.[0]?.O_STATUS === "0") {
            let res = await MessageBox({
              messageTitle: t("confirmation"),
              message: t("insertMessage"),
              buttonNames: ["No", "Yes"],
              defFocusBtnName: "Yes",
              loadingBtnName: ["Yes"],
            });

            if (res === "Yes") {
              stockDataCRUD.mutate({
                ...reqDataRef.current?.insertReq,
              });
            }
          } else if (data?.[0]?.O_STATUS === "999" && data?.[0]?.O_MESSAGE) {
            MessageBox({
              messageTitle: t("validationAlert"),
              message: data?.[0]?.O_MESSAGE,
            });
          }
        }
        insertData();
      },
      onError: () => {
        setIsData((old) => ({ ...old, closeAlert: true }));
      },
    }
  );

  const stockDataCRUD: any = useMutation("crudStockData", crudStockData, {
    onSuccess: (data, variables) => {
      if (variables?._isDeleteRow) {
        if (data?.[0]?.STATUS === "9") {
          MessageBox({
            messageTitle: "Alert",
            message: data?.[0]?.MESSAGE,
          });
        }
        setIsData((old) => ({ ...old, isDelete: false }));
        stockEntryGridData.mutate({
          COMP_CD: authState?.companyID,
          ACCT_CD: variables?.ACCT_CD,
          ACCT_TYPE: variables?.ACCT_TYPE,
          BRANCH_CD: variables?.BRANCH_CD,
          A_USER_LEVEL: authState?.role,
          A_GD_DATE: authState?.workingDate,
        });
        enqueueSnackbar(t("deleteSuccessfully"), { variant: "success" });
      } else if (variables?._isNewRow) {
        myMasterRef?.current?.handleFormReset({ preventDefault: () => {} });
        enqueueSnackbar(t("insertSuccessfully"), { variant: "success" });
        CloseMessageBox();
        setIsData((old) => ({
          ...old,
          newFormMTdata: StockEntryMetaData,
          isVisible: false,
        }));
      }
    },
    onError: () => {
      setIsData((old) => ({ ...old, closeAlert: true, isDelete: false }));
      CloseMessageBox();
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["securityFieldDTL"]);
      queryClient.removeQueries(["insertValidate"]);
      queryClient.removeQueries(["stockGridData"]);
      queryClient.removeQueries(["crudStockData"]);
    };
  }, []);

  const setCurrentAction = useCallback(
    async (data) => {
      if (data.name === "view-upload") {
        navigate(data?.name, {
          state: data?.rows,
        });
      } else if (data.name === "force-view-details") {
        let rowData = data?.rows?.[0]?.data;
        if (rowData?.ALLOW_FORCE_EXPIRE_FLAG === "Y") {
          let res = await MessageBox({
            messageTitle:
              rowData?.PARENT_TYPE.trim() === "SOD"
                ? t("Alert")
                : t("confirmation"),
            message:
              rowData?.PARENT_TYPE.trim() === "SOD"
                ? t("AreYouSureToWithdrawShare")
                : t("forceExpDrawingPowerMSG"),
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

            stockEntryGridData.data = [];
            if (newValue === "tab2") {
              //API calling for Grid-Details on tab-change, and account number and name set to inside the header of Grid-details
              myMasterRef?.current?.getFieldData().then((res) => {
                if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
                  StockGridMetaData.gridConfig.subGridLabel = `\u00A0\u00A0 ${(
                    authState?.companyID +
                    res?.BRANCH_CD +
                    res?.ACCT_TYPE +
                    res?.ACCT_CD
                  ).replace(/\s/g, "")} -  ${res?.ACCT_NM}`;
                  const RequestPara = {
                    COMP_CD: authState?.companyID,
                    ACCT_CD: res?.ACCT_CD,
                    ACCT_TYPE: res?.ACCT_TYPE,
                    BRANCH_CD: res?.BRANCH_CD,
                    A_USER_LEVEL: authState?.role,
                    A_GD_DATE: authState?.workingDate,
                  };
                  stockEntryGridData.mutate(RequestPara);
                }
              });
            }
          }}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="tab1" label={t("stockEntry")} />
          {isData.isVisible && <Tab value="tab2" label={t("stockDetail")} />}
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
          {securityStoclDTL.isLoading || insertValidateData.isLoading ? (
            <LinearProgress color="secondary" />
          ) : (securityStoclDTL?.isError && isData.closeAlert) ||
            (stockEntryGridData?.isError && isData.closeAlert) ||
            (insertValidateData?.isError && isData.closeAlert) ||
            (stockDataCRUD?.isError && isData.closeAlert) ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={
                    securityStoclDTL?.error?.error_msg ??
                    stockEntryGridData?.error?.error_msg ??
                    insertValidateData?.error?.error_msg ??
                    stockDataCRUD?.error?.error_msg ??
                    "Unknow Error"
                  }
                  errorDetail={
                    securityStoclDTL?.error?.error_detail ??
                    stockEntryGridData?.error?.error_detail ??
                    insertValidateData?.error?.error_detail ??
                    stockDataCRUD?.error?.error_detail ??
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
              key={"stockEntry"}
              metaData={(isData.newFormMTdata as MetaDataType) ?? {}}
              initialValues={{}}
              onSubmitHandler={(data: any, displayData, endSubmit) => {
                let apiReq = {
                  BRANCH_CD: data?.BRANCH_CD,
                  STOCK_VALUE: data?.STOCK_VALUE,
                  MARGIN: data?.MARGIN,
                  CREDITOR: data?.CREDITOR ? data?.CREDITOR : "",
                  SECURITY_CD: data?.SECURITY_CD,
                  STOCK_MONTH: data?.STOCK_MONTH,
                  TRAN_DT: format(new Date(data?.TRAN_DT), "dd-MMM-yyyy"),
                  ASON_DT: format(new Date(data?.ASON_DT), "dd-MMM-yyyy"),
                  RECEIVED_DT: format(
                    new Date(data?.RECEIVED_DT),
                    "dd-MMM-yyyy"
                  ),
                };
                reqDataRef.current.insertReq = {
                  ...data,
                  ...apiReq,
                  _isNewRow: true,
                };
                insertValidateData.mutate(apiReq);
                //@ts-ignore
                endSubmit(true);
              }}
              ref={myMasterRef}
              formState={{ MessageBox: MessageBox }}
              setDataOnFieldChange={(action, payload) => {
                if (action === "IS_VISIBLE") {
                  setIsData((old) => ({
                    ...old,
                    isVisible: payload.IS_VISIBLE,
                    newFormMTdata: StockEntryMetaData,
                  }));
                }
                if (action === "SECURITY_CD") {
                  securityStoclDTL.mutate(payload);
                }
              }}
            >
              {({ isSubmitting, handleSubmit }) => (
                <>
                  <Button
                    onClick={(event) => {
                      handleSubmit(event, "Save");
                    }}
                    // disabled={isSubmitting}
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
              key={`stockGridData` + stockEntryGridData.isSuccess}
              finalMetaData={StockGridMetaData as GridMetaDataType}
              data={stockEntryGridData?.data ?? []}
              setData={() => {}}
              loading={stockEntryGridData.isLoading}
              actions={detailActions}
              setAction={setCurrentAction}
              onClickActionEvent={(index, id, data) => {
                if (id === "DOC_FLAG") {
                  setCurrentAction({ rows: [{ data }], name: "view-upload" });
                }
                if (id === "ALLOW_DELETE_FLAG") {
                  reqDataRef.current.deleteReq = data;
                  setIsData((old) => ({ ...old, isDelete: true }));
                }
              }}
            />

            <Routes>
              <Route
                path="view-upload/*"
                element={
                  <StockEditViewWrapper
                    navigate={navigate}
                    stockEntryGridData={stockEntryGridData}
                  />
                }
              />
              <Route
                path="force-view-details/*"
                element={
                  <ForceExpireStock
                    stockEntryGridData={stockEntryGridData}
                    navigate={navigate}
                  />
                }
              />
            </Routes>
          </div>
        </Grid>
      </Container>

      {isData.isDelete && (
        <RemarksAPIWrapper
          TitleText={"StockDeleteTitle"}
          onActionNo={() => setIsData((old) => ({ ...old, isDelete: false }))}
          onActionYes={(val, rows) => {
            let deleteReqPara = {
              _isNewRow: false,
              _isDeleteRow: true,
              BRANCH_CD: rows.BRANCH_CD,
              TRAN_CD: rows.TRAN_CD,
              ACCT_TYPE: rows.ACCT_TYPE,
              ACCT_CD: rows.ACCT_CD,
              TRAN_DT: rows.TRAN_DT,
              CONFIRMED: rows.CONFIRMED,
              USER_DEF_REMARKS: val
                ? val
                : "WRONG ENTRY FROM STOCK ENTRY (TRN/047)",

              ACTIVITY_TYPE: "STOCK ENTRY SCREEN",
              ENTERED_BY: rows.ENTERED_BY,
              STOCK_VALUE: rows?.STOCK_VALUE,
              ASON_DT: rows.ASON_DT,
            };
            stockDataCRUD.mutate(deleteReqPara);
          }}
          isLoading={stockDataCRUD?.isLoading}
          isEntertoSubmit={true}
          AcceptbuttonLabelText={t("Ok")}
          CanceltbuttonLabelText={t("Cancel")}
          open={isData.isDelete}
          rows={deleteReq}
          defaultValue={"WRONG ENTRY FROM STOCK ENTRY (TRN/047)"}
        />
      )}
    </>
  );
};

export const StockEntry = () => {
  return (
    <ClearCacheProvider>
      <StockEntryCustom />
    </ClearCacheProvider>
  );
};
