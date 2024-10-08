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
import { ChequebookDtlGridMetaData } from "./chequebookDetailMetadata";
import { AuthContext } from "pages_audit/auth";
import { useMutation } from "react-query";
import {
  getChequebookDTL,
  saveChequebookData,
  validateDeleteData,
  validateInsert,
} from "./api";
import { enqueueSnackbar } from "notistack";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChequeDtlGrid } from "./chequeDetail/chequeDetail";
import { EntryForm } from "./entryForm/entryForm";
import {
  ActionTypes,
  Alert,
  ClearCacheProvider,
  GridMetaDataType,
  GridWrapper,
  queryClient,
  RemarksAPIWrapper,
  usePopupContext,
} from "@acuteinfo/common-base";
import { LinearProgressBarSpacer } from "components/common/custom/linerProgressBarSpacer";

const ChequebookTabCustom = () => {
  const chequeActions: ActionTypes[] = [
    {
      actionName: "view-details",
      actionLabel: "ViewDetail",
      multiple: false,
      rowDoubleClick: true,
    },
  ];

  const [isData, setIsData] = useState({
    isDelete: false,
    isVisible: false,
    value: "tab1",
    closeAlert: true,
  });
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const myMasterRef = useRef<any>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const reqDataRef = useRef<any>({});

  // API calling function for issued chequebook grid-details
  const getChequeDetail: any = useMutation(
    "getChequebookDTL",
    getChequebookDTL,
    {
      onError: () => {
        setIsData((old) => ({ ...old, closeAlert: true }));
      },
    }
  );

  // API calling function for Insert , Delete
  const crudChequeData: any = useMutation(
    "saveChequebookData",
    saveChequebookData,
    {
      onSuccess: (data, variables) => {
        if (variables?._isDeleteRow) {
          setIsData((old) => ({ ...old, isDelete: false }));
          getChequeDetail.mutate({
            COMP_CD: authState?.companyID,
            ACCT_CD: variables?.ACCT_CD,
            ACCT_TYPE: variables?.ACCT_TYPE,
            BRANCH_CD: variables?.BRANCH_CD,
          });
          enqueueSnackbar(t("deleteSuccessfully"), { variant: "success" });
        } else if (variables?._isNewRow) {
          myMasterRef?.current?.handleFormReset({ preventDefault: () => {} });
          setIsData((old) => ({ ...old, isVisible: false }));
          CloseMessageBox();
          enqueueSnackbar(t("insertSuccessfully"), { variant: "success" });
        }
      },
      onError: () => {
        CloseMessageBox();
        setIsData((old) => ({ ...old, closeAlert: true, isDelete: false }));
      },
    }
  );

  // API calling function for Validate data before Delete
  const validateDelete: any = useMutation(
    "validateDeleteData",
    validateDeleteData,
    {
      onSuccess: (data) => {
        if (data?.[0]?.STATUS === "999" && data?.[0]?.MESSAGE) {
          MessageBox({
            messageTitle: "InvalidDeleteOperation",
            message: data?.[0]?.MESSAGE,
          });
        } else if (data?.[0]?.STATUS === "0") {
          setIsData((old) => ({ ...old, isDelete: true }));
        }
      },
      onError: () => {
        setIsData((old) => ({ ...old, closeAlert: true }));
      },
    }
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getChequebookDTL"]);
      queryClient.removeQueries(["saveChequebookData"]);
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
          sx={{ ml: "25px" }}
          value={isData.value}
          onChange={(event, newValue) => {
            setIsData((old) => ({
              ...old,
              value: newValue,
              closeAlert: false,
            }));
            getChequeDetail.data = [];
            if (newValue === "tab2") {
              // API calling for issued chequebook Grid-details and set account-number and name inside the header
              myMasterRef?.current?.getFieldData().then((res) => {
                if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
                  ChequebookDtlGridMetaData.gridConfig.subGridLabel = ` \u00A0\u00A0 ${(
                    authState?.companyID +
                    res?.BRANCH_CD +
                    res?.ACCT_TYPE +
                    res?.ACCT_CD
                  ).replace(/\s/g, "")} -  ${res?.ACCT_NM}`;

                  const chequeDTLRequestPara = {
                    COMP_CD: authState?.companyID,
                    ACCT_CD: res?.ACCT_CD,
                    ACCT_TYPE: res?.ACCT_TYPE,
                    BRANCH_CD: res?.BRANCH_CD,
                  };
                  getChequeDetail.mutate(chequeDTLRequestPara);
                }
              });
            }
          }}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="tab1" label={t("ChequebookEntry")} />
          {isData.isVisible && (
            <Tab value="tab2" label={t("ChequebookDetail")} />
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
          {/* All API calls handle error */}
          {validateDelete?.isLoading ? (
            <LinearProgress color="inherit" />
          ) : (crudChequeData?.isError && isData.closeAlert) ||
            (validateDelete?.isError && isData.closeAlert) ||
            (getChequeDetail?.isError && isData.closeAlert) ? (
            <AppBar position="relative" color="primary">
              <Alert
                severity="error"
                errorMsg={
                  crudChequeData?.error?.error_msg ??
                  validateDelete?.error?.error_msg ??
                  getChequeDetail?.error?.error_msg ??
                  "Unknow Error"
                }
                errorDetail={
                  crudChequeData?.error?.error_detail ??
                  validateDelete?.error?.error_detail ??
                  getChequeDetail?.error?.error_detail ??
                  ""
                }
                color="error"
              />
            </AppBar>
          ) : (
            <LinearProgressBarSpacer />
          )}
          <div
            style={{
              display: isData.value === "tab1" ? "inherit" : "none",
            }}
          >
            <EntryForm
              reqDataRef={reqDataRef}
              myMasterRef={myMasterRef}
              setIsData={setIsData}
              crudChequeData={crudChequeData}
              navigate={navigate}
            />
          </div>
          <div
            style={{
              display: isData.value === "tab2" ? "inherit" : "none",
            }}
          >
            <GridWrapper
              key={`chequebookDetail` + getChequeDetail.isSuccess}
              finalMetaData={ChequebookDtlGridMetaData as GridMetaDataType}
              data={getChequeDetail.data ?? []}
              setData={() => null}
              loading={getChequeDetail.isLoading}
              actions={chequeActions}
              setAction={(data) => {
                if (data?.name === "view-details") {
                  navigate(data?.name, {
                    state: data?.rows,
                  });
                }
              }}
              onClickActionEvent={(index, id, data) => {
                reqDataRef.current.deleteReq = data;
                validateDelete.mutate(data);
              }}
            />
            <Routes>
              <Route
                path="view-details/*"
                element={<ChequeDtlGrid navigate={navigate} />}
              />
            </Routes>
          </div>
        </Grid>
      </Container>

      {isData.isDelete && (
        // API calling for Delete issued chequebook with Remarks
        <RemarksAPIWrapper
          TitleText={"RemovalRemarksChequebook"}
          label={"RemovalRemarks"}
          onActionNo={() => setIsData((old) => ({ ...old, isDelete: false }))}
          onActionYes={(val, rows) => {
            let deleteReqPara = {
              _isNewRow: false,
              _isDeleteRow: true,
              BRANCH_CD: rows.BRANCH_CD,
              COMP_CD: rows.COMP_CD,
              TRAN_CD: rows.TRAN_CD,
              ENTERED_COMP_CD: rows.ENTERED_COMP_CD,
              ENTERED_BRANCH_CD: rows.ENTERED_BRANCH_CD,
              ACCT_TYPE: rows.ACCT_TYPE,
              ACCT_CD: rows.ACCT_CD,
              LIMIT_AMOUNT: rows.LIMIT_AMOUNT,
              ACTIVITY_TYPE: "CHEQUE BOOK ISSUE ",
              TRAN_DT: rows.TRAN_DT,
              CONFIRMED: rows.CONFIRMED,
              USER_DEF_REMARKS: val
                ? val
                : "WRONG ENTRY FROM CHEQUE BOOK ISSUE ENTRY (TRN/045)",
              ENTERED_BY: rows.ENTERED_BY,
              AMOUNT: rows.AMOUNT,
            };
            crudChequeData.mutate(deleteReqPara);
          }}
          isLoading={crudChequeData?.isLoading}
          isEntertoSubmit={true}
          AcceptbuttonLabelText="Ok"
          CanceltbuttonLabelText="Cancel"
          open={isData?.isDelete}
          rows={reqDataRef.current.deleteReq}
          defaultValue={"WRONG ENTRY FROM CHEQUE BOOK ISSUE ENTRY (TRN/045)"}
        />
      )}
    </>
  );
};

export const ChequebookTab = () => {
  return (
    <ClearCacheProvider>
      <ChequebookTabCustom />
    </ClearCacheProvider>
  );
};
