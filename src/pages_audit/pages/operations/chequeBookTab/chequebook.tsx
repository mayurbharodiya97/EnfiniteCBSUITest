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
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { GridMetaDataType } from "components/dataTableStatic";
import { ChequeBookEntryMetaData } from "./chequebookEntryMetadata";
import { ChequebookDtlGridMetaData } from "./chequebookDetailMetadata";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { useMutation } from "react-query";
import { Alert } from "components/common/alert";
import {
  getChequebookDTL,
  saveChequebookData,
  validateDeleteData,
} from "./api";
import { ActionTypes } from "components/dataTable";
import { enqueueSnackbar } from "notistack";
import { ClearCacheProvider, queryClient } from "cache";
import { Route, Routes, useNavigate } from "react-router-dom";
import { RemarksAPIWrapper } from "components/custom/Remarks";
import { usePopupContext } from "components/custom/popupContext";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import { useTranslation } from "react-i18next";
import { ChequeDtlGrid } from "./chequeDetail/chequeDetail";
import { MultipleChequebook } from "./multipleChequebook/multipleChequebook";

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
  const reqDataRef = useRef<any>();

  const getChequeDetail: any = useMutation(
    "getChequebookDTL",
    getChequebookDTL,
    {
      onError: () => {
        setIsData((old) => ({ ...old, closeAlert: true }));
      },
    }
  );

  const crudChequeData: any = useMutation(
    "saveChequebookData",
    saveChequebookData,
    {
      onSuccess: (data, variables) => {
        if (variables?.DETAILS_DATA?.isDeleteRow.length) {
          setIsData((old) => ({ ...old, isDelete: false }));
          let deleteReq = variables?.DETAILS_DATA?.isDeleteRow?.[0];
          getChequeDetail.mutate({
            COMP_CD: authState?.companyID,
            ACCT_CD: deleteReq?.ACCT_CD,
            ACCT_TYPE: deleteReq?.ACCT_TYPE,
            BRANCH_CD: deleteReq?.BRANCH_CD,
          });
          enqueueSnackbar(t("deleteSuccessfully"), { variant: "success" });
        } else if (variables?.DETAILS_DATA?.isNewRow.length) {
          if (variables?.DETAILS_DATA?.isNewRow.length > 1) {
            navigate(".");
          }
          myMasterRef?.current?.handleFormReset({ preventDefault: () => {} });
          setIsData((old) => ({ ...old, isVisible: false }));
          CloseMessageBox();
          enqueueSnackbar(t("insertSuccessfully"), { variant: "success" });
        }
      },

      onError: (error, variables) => {
        if (variables?.DETAILS_DATA?.isNewRow.length > 1) {
          navigate(".");
          CloseMessageBox();
        }
        setIsData((old) => ({ ...old, closeAlert: true, isDelete: false }));
      },
    }
  );

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
        } else if (
          data?.[0]?.STATUS === "0" &&
          data?.[0]?.MESSAGE === "SUCCESS"
        ) {
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
      queryClient.removeQueries(["validateDeleteData"]);
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

  const insertData = async (insertdata) => {
    let apiReq = {
      isNewRow: true,
      BRANCH_CD: authState.user.branchCode,
      COMP_CD: authState.companyID,
      DETAILS_DATA: {
        isNewRow: insertdata,
        isDeleteRow: [],
        isUpdatedRow: [],
      },
    };
    let res = await MessageBox({
      messageTitle: t("confirmation"),
      message: t("AreYouSureToProceed"),
      buttonNames: ["No", "Yes"],
      defFocusBtnName: "Yes",
      loadingBtnName: ["Yes"],
    });
    if (res === "Yes") {
      crudChequeData.mutate(apiReq);
    }
  };

  const onSubmitHandler: SubmitFnType = (data: any, displayData, endSubmit) => {
    // @ts-ignore
    endSubmit(true);

    let reqPara = {
      ...data,
      COMP_CD: authState?.companyID,
      CHEQUE_FROM: Number(data?.CHEQUE_FROM),
      CHEQUE_TO: Number(data?.CHEQUE_TO),
      CHEQUE_BK_TOTAL: Number(data?.CHEQUE_BK_TOTAL),
      CHEQUE_TOTAL: Number(data?.CHEQUE_TOTAL),
    };

    let newArray: any = [];

    if (reqPara.CHEQUE_BK_TOTAL > 1 && reqPara?.CHEQUE_TO) {
      for (
        let i = reqPara.CHEQUE_FROM;
        i <=
        reqPara.CHEQUE_FROM +
          (reqPara.CHEQUE_BK_TOTAL - 1) * reqPara?.CHEQUE_TOTAL;
        i += reqPara?.CHEQUE_TOTAL
      ) {
        newArray.push({
          ...reqPara,
          CHEQUE_FROM: i,
          CHEQUE_TO: i + reqPara?.CHEQUE_TOTAL - 1,
        });
      }
      navigate("multiChequebook/", {
        state: newArray.length > 1 && newArray,
      });
    } else {
      insertData([reqPara]);
    }
  };

  const setCurrentAction = useCallback(
    (data) => {
      if (data?.name === "view-details") {
        navigate(data?.name, {
          state: data?.rows,
        });
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
            getChequeDetail.data = [];
            if (newValue === "tab2") {
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
          {validateDelete?.isLoading ? (
            <LinearProgress color="secondary" />
          ) : (crudChequeData?.isError && isData.closeAlert) ||
            (validateDelete?.isError && isData.closeAlert) ||
            (getChequeDetail?.isError && isData.closeAlert) ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
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
            </div>
          ) : (
            <LinearProgressBarSpacer />
          )}
          <div
            style={{
              display: isData.value === "tab1" ? "inherit" : "none",
            }}
          >
            <FormWrapper
              key={"chequebooksEntry"}
              metaData={ChequeBookEntryMetaData as MetaDataType}
              initialValues={{}}
              onSubmitHandler={onSubmitHandler}
              ref={myMasterRef}
              formState={{ MessageBox: MessageBox }}
              setDataOnFieldChange={(action, payload) => {
                if (action === "DTL_TAB") {
                  setIsData((old) => ({ ...old, isVisible: payload.DTL_TAB }));
                }
                if (action === "CHEQUE_BK_TOTAL") {
                  myMasterRef?.current?.handleSubmit(
                    { preventDefault: () => {} },
                    "Save"
                  );
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
                    endIcon={
                      isSubmitting ? <CircularProgress size={20} /> : null
                    }
                    color={"primary"}
                  >
                    {t("Save")}
                  </Button>
                </>
              )}
            </FormWrapper>
            <Routes>
              <Route
                path="multiChequebook/*"
                element={
                  <MultipleChequebook
                    navigate={navigate}
                    insertData={insertData}
                  />
                }
              />
            </Routes>
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
              setAction={setCurrentAction}
              onClickActionEvent={(index, id, data) => {
                reqDataRef.current = data;
                validateDelete.mutate(data);
              }}
            />
            <Routes>
              <Route
                path="view-details/*"
                element={
                  <ChequeDtlGrid
                    ClosedEventCall={() => {
                      navigate(".");
                    }}
                  />
                }
              />
            </Routes>
          </div>
        </Grid>
      </Container>

      {isData.isDelete && (
        <RemarksAPIWrapper
          TitleText={"RemovalRemarksChequebook"}
          label={"RemovalRemarks"}
          onActionNo={() => setIsData((old) => ({ ...old, isDelete: false }))}
          onActionYes={(val, rows) => {
            let deleteReqPara = {
              BRANCH_CD: rows.BRANCH_CD,
              COMP_CD: rows.COMP_CD,
              DETAILS_DATA: {
                isNewRow: [],
                isDeleteRow: [
                  {
                    ...rows,
                    ACTIVITY_TYPE: "CHEQUE BOOK ISSUE ",
                    USER_DEF_REMARKS: val
                      ? val
                      : "WRONG ENTRY FROM CHEQUE BOOK ISSUE ENTRY (TRN/045) ",
                  },
                ],
                isUpdatedRow: [],
              },
            };
            crudChequeData.mutate(deleteReqPara);
          }}
          isLoading={crudChequeData?.isLoading}
          isEntertoSubmit={true}
          AcceptbuttonLabelText="Ok"
          CanceltbuttonLabelText="Cancel"
          open={isData?.isDelete}
          rows={reqDataRef.current}
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
