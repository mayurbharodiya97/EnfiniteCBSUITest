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
import { StockEditViewWrapper } from "./stockEditViewWrapper";
import { RemarksAPIWrapper } from "components/custom/Remarks";
import { StockEntryMetaData } from "./stockEntryMetadata";
import { StockGridMetaData } from "./stockGridMetadata";
import { ActionTypes } from "components/dataTable";
import { ForceExpireStock } from "./forceExpire";
import { Alert } from "components/common/alert";
import { AuthContext } from "pages_audit/auth";
import { enqueueSnackbar } from "notistack";
import { SubmitFnType } from "packages/form";
import { useMutation } from "react-query";
import { ClearCacheProvider, queryClient } from "cache";
import {
  crudStockData,
  insertValidate,
  securityFieldDTL,
  stockGridData,
} from "./api";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import { format } from "date-fns";

const StockEntryCustom = () => {
  const [newFormMTdata, setNewFormMTdata] = useState<any>(StockEntryMetaData);
  const [gridDetailData, setGridDetailData] = useState<any>();
  const [isVisible, setIsVisible] = useState<any>(false);
  const [isOpenSave, setIsOpenSave] = useState<any>(false);
  const [deletePopup, setDeletePopup] = useState<any>(false);
  const [closeAlert, setCloseAlert] = useState<any>(true);
  const [refreshForm, setRefreshForm] = useState<any>(0);
  const { authState } = useContext(AuthContext);
  const deleteDataRef = useRef<any>(null);
  const [value, setValue] = useState("tab1");
  const { MessageBox } = usePopupContext();
  const initialValuesRef = useRef<any>(null);
  const insertDataRef = useRef<any>(null);
  const myMasterRef = useRef<any>(null);
  const navigate = useNavigate();

  const detailActions: ActionTypes[] = [
    {
      actionName: "force-view-details",
      actionLabel: "Force-Exp/View-Detail",
      multiple: false,
      rowDoubleClick: true,
    },
    // {
    //   actionName: "force-view-details",
    //   actionLabel: "Force-Expire",
    //   multiple: false,
    //   rowDoubleClick: true,
    //   shouldExclude(rowData, authState) {
    //     console.log("<<<force", rowData);
    //     if (rowData?.[0]?.data?.ALLOW_FORCE_EXPIRE_FLAG !== "Y") {
    //       return true;
    //     }
    //     return false;
    //   },
    // },
    // {
    //   actionName: "force-view-details",
    //   actionLabel: "View-Detail",
    //   multiple: false,
    //   rowDoubleClick: true,
    //   shouldExclude(rowData, authState) {
    //     console.log("<<<viewd", rowData);
    //     if (rowData?.[0]?.data?.ALLOW_FORCE_EXPIRE_FLAG !== "Y") {
    //       return false;
    //     }
    //     return true;
    //   },
    // },

    {
      actionName: "view-upload",
      actionLabel: "View-Upload Document",
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
          newData = { ...newFormMTdata, fields: newMetadata };
        } else {
          newData = { ...StockEntryMetaData };
        }

        setNewFormMTdata(newData);
      },
      onError: (error: any) => {
        setCloseAlert(true);
      },
    }
  );

  const stockEntryGridData: any = useMutation("stockGridData", stockGridData, {
    onSuccess: (data) => {
      setGridDetailData(data);
    },
    onError: (error: any) => {
      setCloseAlert(true);
    },
  });

  const insertValidateData: any = useMutation(
    "uploadDocument",
    insertValidate,
    {
      onSuccess: (data) => {
        if (data?.[0]?.O_STATUS === "0") {
          setIsOpenSave(true);
        } else if (data?.[0]?.O_STATUS === "999" && data?.[0]?.O_MESSAGE) {
          MessageBox({
            messageTitle: "Validation Alert..",
            message: data?.[0]?.O_MESSAGE,
          });
        }
      },
      onError: (error: any) => {
        setCloseAlert(true);
      },
    }
  );

  const crudStockDatas: any = useMutation("crudStockData", crudStockData, {
    onSuccess: (data, variables) => {
      if (variables?._isDeleteRow) {
        setDeletePopup(false);
        stockEntryGridData.mutate({
          COMP_CD: authState?.companyID,
          ACCT_CD: variables?.ACCT_CD?.padStart(6, "0")?.padEnd(20, " "),
          ACCT_TYPE: variables?.ACCT_TYPE,
          BRANCH_CD: variables?.BRANCH_CD,
          // ENTERED_DATE: authState?.workingDate,
          // GD_TODAY: authState?.workingDate,
          A_USER_LEVEL: authState?.role,
        });
        enqueueSnackbar("Data Delete successfully", { variant: "success" });
      } else if (variables?._isNewRow) {
        setNewFormMTdata(StockEntryMetaData);
        myMasterRef?.current?.handleFormReset({ preventDefault: () => {} });
        setIsOpenSave(false);
        setIsVisible(false);
        setRefreshForm((old) => old + 1);
        enqueueSnackbar("Data insert successfully", { variant: "success" });
      }
    },
    onError: (error: any) => {
      setCloseAlert(true);
      setIsOpenSave(false);
      setDeletePopup(false);
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
        if (data?.rows?.[0]?.data?.ALLOW_FORCE_EXPIRE_FLAG === "Y") {
          let res = await MessageBox({
            messageTitle: "Confirmation..",
            message: "Are you sure to Force-Expire Drawing Power ?",
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
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            setCloseAlert(false);
            setGridDetailData([]);
            if (newValue === "tab2") {
              myMasterRef?.current?.getFieldData().then((res) => {
                initialValuesRef.current = res;
                if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
                  StockGridMetaData.gridConfig.gridLabel = `Stock Detail \u00A0\u00A0 ${(
                    authState?.companyID +
                    res?.BRANCH_CD +
                    res?.ACCT_TYPE +
                    res?.ACCT_CD?.padStart(6, "0")?.padEnd(20, " ")
                  ).replace(/\s/g, "")} -  ${res?.ACCT_NM}`;
                  const RequestPara = {
                    COMP_CD: authState?.companyID,
                    ACCT_CD: res?.ACCT_CD?.padStart(6, "0")?.padEnd(20, " "),
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
          <Tab value="tab1" label="Stock Entry" />
          {isVisible && <Tab value="tab2" label="Stock Detail" />}
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
          ) : (securityStoclDTL?.isError && closeAlert) ||
            (stockEntryGridData?.isError && closeAlert) ||
            (insertValidateData?.isError && closeAlert) ||
            (crudStockDatas?.isError && closeAlert) ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={
                    securityStoclDTL?.error?.error_msg ??
                    stockEntryGridData?.error?.error_msg ??
                    insertValidateData?.error?.error_msg ??
                    crudStockDatas?.error?.error_msg ??
                    "Unknow Error"
                  }
                  errorDetail={
                    securityStoclDTL?.error?.error_detail ??
                    stockEntryGridData?.error?.error_detail ??
                    insertValidateData?.error?.error_detail ??
                    crudStockDatas?.error?.error_detail ??
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
                key={"stockEntry" + refreshForm + setNewFormMTdata}
                metaData={newFormMTdata ?? []}
                initialValues={initialValuesRef.current ?? []}
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
                  insertDataRef.current = { ...data, ...apiReq };
                  insertValidateData.mutate(apiReq);
                  //@ts-ignore
                  endSubmit(true);
                }}
                ref={myMasterRef}
                formState={{ MessageBox: MessageBox }}
                setDataOnFieldChange={(action, payload) => {
                  if (action === "IS_VISIBLE") {
                    setIsVisible(payload.IS_VISIBLE);
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
                      disabled={isSubmitting}
                      //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                      color={"primary"}
                    >
                      Save
                    </Button>
                  </>
                )}
              </FormWrapper>
            </>
          ) : value === "tab2" ? (
            <>
              <GridWrapper
                key={`stockGridData` + stockEntryGridData.isSuccess}
                finalMetaData={StockGridMetaData as GridMetaDataType}
                data={gridDetailData ?? []}
                setData={() => {}}
                loading={stockEntryGridData.isLoading}
                actions={detailActions}
                setAction={setCurrentAction}
                onClickActionEvent={(index, id, data) => {
                  if (id === "DOC_FLAG") {
                    setCurrentAction({ rows: [{ data }], name: "view-upload" });
                  }
                  if (id === "ALLOW_DELETE_FLAG") {
                    deleteDataRef.current = data;
                    setDeletePopup(true);
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
            </>
          ) : null}
        </Grid>
      </Container>

      {isOpenSave && (
        <PopupMessageAPIWrapper
          MessageTitle={"Confirmation"}
          Message={"Are you sure to insert data"}
          onActionYes={() =>
            crudStockDatas.mutate({ ...insertDataRef.current, _isNewRow: true })
          }
          onActionNo={() => setIsOpenSave(false)}
          rows={[]}
          open={isOpenSave}
          loading={crudStockDatas.isLoading}
        />
      )}

      {deletePopup && (
        <RemarksAPIWrapper
          TitleText={"Are you sure want to delete this record ..?"}
          onActionNo={() => setDeletePopup(false)}
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
              CONFIRMED: rows.CONFIRMED === "Confirm" ? "Y" : "0",
              USER_DEF_REMARKS: val
                ? val
                : "WRONG ENTRY FROM STOCK ENTRY (TRN/047)",

              ACTIVITY_TYPE: "STOCK ENTRY SCREEN",
              ENTERED_BY: rows.ENTERED_BY,
              ACCT_MST_LIMIT: rows?.ACCT_MST_LIMIT,
            };
            crudStockDatas.mutate(deleteReqPara);
          }}
          isLoading={crudStockDatas?.isLoading}
          isEntertoSubmit={true}
          AcceptbuttonLabelText="Ok"
          CanceltbuttonLabelText="Cancel"
          open={deletePopup}
          rows={deleteDataRef.current}
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
