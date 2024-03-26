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
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { usePopupContext } from "components/custom/popupContext";
import { StopPayEntryMetadata } from "./stopPayEntryMetadata";
import { Route, Routes, useNavigate } from "react-router-dom";
import { RemarksAPIWrapper } from "components/custom/Remarks";
import { GridMetaDataType } from "components/dataTableStatic";
import { StopPayGridMetaData } from "./stopPayGridMetadata";
import { ClearCacheProvider, queryClient } from "cache";
import { ActionTypes } from "components/dataTable";
import { Alert } from "components/common/alert";
import { ReleaseCheque } from "./releaseCheque";
import { AuthContext } from "pages_audit/auth";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import * as API from "./api";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";

const StopPaymentEntryCustom = () => {
  const releaseActions: ActionTypes[] = [
    {
      actionName: "release-Cheque",
      actionLabel: "Release Cheque",
      multiple: false,
      rowDoubleClick: true,
    },
  ];

  const [gridDetailData, setGridDetailData] = useState<any>([]);
  const [deletePopup, setDeletePopup] = useState<any>(false);
  const [isVisible, setIsVisible] = useState<any>(false);
  const [closeAlert, setCloseAlert] = useState<any>(true);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const { authState } = useContext(AuthContext);
  const [value, setValue] = useState("tab1");
  const { MessageBox } = usePopupContext();
  const initialValuesRef = useRef<any>(null);
  const deleteDataRef = useRef<any>(null);
  const insertDataRef = useRef<any>(null);
  const myMasterRef = useRef<any>(null);
  const navigate = useNavigate();

  const getStopPayDetail: any = useMutation(
    "stopPayDetail",
    API.stopPayDetail,
    {
      onSuccess: (data) => {
        setGridDetailData(data);
      },
      onError: (error: any) => {
        setCloseAlert(true);
      },
    }
  );

  const validateInsertData: any = useMutation(
    "validateInsert",
    API.validateInsert,
    {
      onSuccess: (data) => {
        if (data?.O_STATUS !== "0") {
          setIsOpenSave(true);
        } else {
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

  const crudStopPay: any = useMutation("crudStopPayment", API.crudStopPayment, {
    onSuccess: (data, variables) => {
      if (variables?._isDeleteRow) {
        setDeletePopup(false);
        getStopPayDetail.mutate({
          COMP_CD: authState?.companyID,
          ACCT_CD: variables?.ACCT_CD?.padStart(6, "0")?.padEnd(20, " "),
          ACCT_TYPE: variables?.ACCT_TYPE,
          BRANCH_CD: variables?.BRANCH_CD,
          GD_TODAY: authState?.workingDate,
          USER_LEVEL: authState?.role,
        });
        enqueueSnackbar("Data Delete successfully", { variant: "success" });
      } else if (variables?._isNewRow) {
        setIsOpenSave(false);
        setIsVisible(false);
        myMasterRef?.current?.handleFormReset({ preventDefault: () => {} });
        enqueueSnackbar("Data insert successfully", { variant: "success" });
      }
    },
    onError: (error: any) => {
      setDeletePopup(false);
      setIsOpenSave(false);
      setCloseAlert(true);
    },
  });

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.rows?.[0]?.data?.ALLOW_RELEASE === "Y") {
        let res = await MessageBox({
          messageTitle: "Confirmation..",
          message: "Are you sure to Release ?",
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
          sx={{ ml: "15px" }}
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            setGridDetailData([]);
            setCloseAlert(false);
            if (newValue === "tab2") {
              myMasterRef?.current?.getFieldData().then((res) => {
                initialValuesRef.current = res;
                if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
                  StopPayGridMetaData.gridConfig.gridLabel = `Cheque Stop Detail \u00A0\u00A0 ${(
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
          <Tab value="tab1" label="Cheque Stop Entry" />
          {isVisible && <Tab value="tab2" label="Cheque Stop Detail" />}
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
          ) : (crudStopPay?.isError && closeAlert) ||
            (validateInsertData?.isError && closeAlert) ||
            (getStopPayDetail?.isError && closeAlert) ? (
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

          {value === "tab1" ? (
            <FormWrapper
              key={"stopPayEntry"}
              metaData={StopPayEntryMetadata ?? []}
              initialValues={initialValuesRef.current ?? {}}
              onSubmitHandler={(data: any, displayData, endSubmit) => {
                insertDataRef.current = {
                  ...data,
                  TRAN_DT: data?.TRAN_DT || data?.SURR_DT,
                };
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
                  setIsVisible(payload.IS_VISIBLE);
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
                    Save
                  </Button>
                </>
              )}
            </FormWrapper>
          ) : value === "tab2" ? (
            <>
              <GridWrapper
                key={`stopPayGridData` + getStopPayDetail.isLoading}
                finalMetaData={StopPayGridMetaData as GridMetaDataType}
                data={gridDetailData ?? []}
                setData={() => {}}
                loading={getStopPayDetail.isLoading}
                actions={releaseActions}
                setAction={setCurrentAction}
                onClickActionEvent={(index, id, data) => {
                  if (id === "ALLOW_DELETE") {
                    deleteDataRef.current = data;
                    setDeletePopup(true);
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
            </>
          ) : null}
        </Grid>
      </Container>

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
          open={deletePopup}
          rows={deleteDataRef.current}
          defaultValue={"WRONG ENTRY FROM STOP PAYMENT ENTRY (TRN/048)"}
        />
      )}

      {isOpenSave && (
        <PopupMessageAPIWrapper
          MessageTitle={"Confirmation"}
          Message={"Are you sure you want to stop the selected check-number?"}
          onActionYes={() =>
            crudStopPay.mutate({ ...insertDataRef.current, _isNewRow: true })
          }
          onActionNo={() => setIsOpenSave(false)}
          rows={[]}
          open={isOpenSave}
          loading={crudStopPay.isLoading}
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
