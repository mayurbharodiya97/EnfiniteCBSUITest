import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  Grid,
  LinearProgress,
  Tab,
  Tabs,
  Typography,
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
import { ChequeBKPopUpGridData } from "./chequeBKPopUpMetadat";
import { ActionTypes } from "components/dataTable";
import { enqueueSnackbar } from "notistack";
import { queryClient } from "cache";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ChequeDtlGrid } from "./chequeDetail";
import { RemarksAPIWrapper } from "components/custom/Remarks";
import { usePopupContext } from "components/custom/popupContext";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import { MessageBoxWrapper } from "components/custom/messageBox";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";

export const ChequebookTab = () => {
  const ChequeBKPopUpAction: ActionTypes[] = [
    {
      actionName: "save",
      actionLabel: "Save",
      multiple: false,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
    {
      actionName: "close",
      actionLabel: "cancel",
      multiple: false,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
  ];

  const chequeActions: ActionTypes[] = [
    {
      actionName: "view-details",
      actionLabel: "View Detail",
      multiple: false,
      rowDoubleClick: true,
    },
  ];

  const [value, setValue] = useState<any>("chequebookEntry");
  const [isTabVisible, setIsTabVisible] = useState<any>(false);
  const [deletePopup, setDeletePopup] = useState<any>(false);
  const [closeAlert, setCloseAlert] = useState<any>(true);
  const [chequeBookData, setChequeBookData] = useState<any>([]);
  const [gridDetailData, setGridDetailData] = useState<any>();
  const [chequeDtlRefresh, setChequeDtlRefresh] = useState(0);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const [initData, setInitData] = useState<any>({});
  const { authState } = useContext(AuthContext);
  const { MessageBox } = usePopupContext();
  const myMasterRef = useRef<any>(null);
  const deleteDataRef = useRef<any>(null);
  const insertDataRef = useRef<any>(null);
  const navigate = useNavigate();

  const getChequeDetail: any = useMutation(
    "getChequebookDTL",
    getChequebookDTL,
    {
      onSuccess: (data) => {
        setGridDetailData(data);
      },
      onError: (error: any) => {},
    }
  );

  const crudChequeData: any = useMutation(
    "saveChequebookData",
    saveChequebookData,
    {
      onSuccess: (data, variables) => {
        if (variables?.DETAILS_DATA?.isDeleteRow.length) {
          setDeletePopup(false);
          getChequeDetail.mutate({
            ...deleteDataRef.current,
          });
          enqueueSnackbar("Record Delete successfully", { variant: "success" });
        } else if (variables?.DETAILS_DATA?.isNewRow.length) {
          setIsOpenSave(false);
          setChequeBookData([]);
          setInitData({});
          setChequeDtlRefresh((old) => old + 1);
          myMasterRef?.current?.handleFormReset({ preventDefault: () => {} });
          setIsTabVisible(false);
          enqueueSnackbar("Data insert successfully", { variant: "success" });
        }
      },
      onError: (error: any) => {
        setIsOpenSave(false);
        setChequeBookData([]);
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
            messageTitle: "Invalid Delete Operation",
            message: data?.[0]?.MESSAGE,
          });
        } else if (
          data?.[0]?.STATUS === "0" &&
          data?.[0]?.MESSAGE === "SUCCESS"
        ) {
          setDeletePopup(true);
        }
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

  const onSubmitHandler: SubmitFnType = (data: any, displayData, endSubmit) => {
    // @ts-ignore
    endSubmit(true);

    let reqPara = {
      ...data,
      _isNewRow: true,
      COMP_CD: authState?.companyID,
      CHEQUE_FROM: Number(data?.CHEQUE_FROM),
      CHEQUE_TO: Number(data?.CHEQUE_TO),
      CHEQUE_TOTAL: Number(data?.CHEQUE_TOTAL),
      LEAF_ARR: Number(data?.LEAF_ARR),
    };
    let newArray: any = [];

    if (reqPara.CHEQUE_TOTAL > 1 && reqPara?.CHEQUE_TO) {
      for (
        let i = reqPara.CHEQUE_FROM;
        i <=
        reqPara.CHEQUE_FROM + (reqPara.CHEQUE_TOTAL - 1) * reqPara?.LEAF_ARR;
        i += reqPara?.LEAF_ARR
      ) {
        newArray.push({
          ...reqPara,
          CHEQUE_FROM: i,
          CHEQUE_TO: i + reqPara?.LEAF_ARR - 1,
        });
      }
      setChequeBookData(newArray.length > 1 && newArray);
    } else {
      reqPara = {
        isNewRow: true,
        BRANCH_CD: authState.user.branchCode,
        COMP_CD: authState.companyID,
        DETAILS_DATA: {
          isNewRow: [reqPara],
          isDeleteRow: [],
          isUpdatedRow: [],
        },
      };
      setIsOpenSave(true);
      insertDataRef.current = reqPara;
    }
  };

  const setChequeBKPopUpActiont = useCallback(
    (data) => {
      if (data?.name === "save") {
        let multiSaveApiReq = {
          isNewRow: true,
          BRANCH_CD: authState.user.branchCode,
          COMP_CD: authState.companyID,
          DETAILS_DATA: {
            isNewRow: chequeBookData,
            isDeleteRow: [],
            isUpdatedRow: [],
          },
        };
        setIsOpenSave(true);
        insertDataRef.current = multiSaveApiReq;
      } else {
        setChequeBookData([]);
      }

      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [chequeBookData, navigate]
  );

  useEffect(() => {
    ChequeBKPopUpGridData.gridConfig.footerNote = `Total Cheque : ${
      chequeBookData?.[0]?.CHEQUE_TOTAL * chequeBookData?.[0]?.LEAF_ARR
    }  \u00A0\u00A0  Total Charge : 
    ${
      chequeBookData?.[0]?.CHEQUE_TOTAL * chequeBookData?.[0]?.SERVICE_TAX
    }     `;
  }, [chequeBookData]);

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Tabs
          sx={{ ml: "25px" }}
          value={value}
          onChange={(event, newValue) => {
            setCloseAlert(false);
            setGridDetailData([]);
            setValue(newValue);

            if (newValue === "chequebookDetail") {
              myMasterRef?.current?.getFieldData().then((res) => {
                setInitData(res);

                if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
                  ChequebookDtlGridMetaData.gridConfig.gridLabel = `Cheque Book Issued\u00A0\u00A0 ${(
                    authState?.companyID +
                    res?.BRANCH_CD +
                    res?.ACCT_TYPE +
                    res?.ACCT_CD?.padStart(6, "0")?.padEnd(20, " ")
                  ).replace(/\s/g, "")} -  ${res?.ACCT_NM}`;

                  const chequeDTLRequestPara = {
                    COMP_CD: authState?.companyID,
                    ACCT_CD: res?.ACCT_CD?.padStart(6, "0")?.padEnd(20, " "),
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
          <Tab value="chequebookEntry" label="Chequebook Entry" />
          {isTabVisible && (
            <Tab value="chequebookDetail" label="Chequebook Detail" />
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
          ) : (crudChequeData?.isError && closeAlert) ||
            (validateDelete?.isError && closeAlert) ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={
                    crudChequeData?.error?.error_msg ??
                    validateDelete?.error?.error_msg ??
                    "Unknow Error"
                  }
                  errorDetail={
                    crudChequeData?.error?.error_detail ??
                    validateDelete?.error?.error_detail ??
                    ""
                  }
                  color="error"
                />
              </AppBar>
            </div>
          ) : (
            <LinearProgressBarSpacer />
          )}
          {value === "chequebookEntry" ? (
            <>
              <FormWrapper
                key={"chequebooksEntry" + chequeDtlRefresh}
                metaData={ChequeBookEntryMetaData as MetaDataType}
                initialValues={initData ?? {}}
                onSubmitHandler={onSubmitHandler}
                ref={myMasterRef}
                formState={{ MessageBox: MessageBox }}
                setDataOnFieldChange={(action, payload) => {
                  if (action === "DTL_TAB") {
                    setIsTabVisible(payload.DTL_TAB);
                  }
                  if (action === "CHEQUE_TOTAL") {
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
                      Save
                    </Button>
                  </>
                )}
              </FormWrapper>
            </>
          ) : value === "chequebookDetail" ? (
            <>
              {getChequeDetail?.isError && (
                <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
                  <AppBar position="relative" color="primary">
                    <Alert
                      severity="error"
                      errorMsg={
                        getChequeDetail?.error?.error_msg ?? "Unknow Error"
                      }
                      errorDetail={getChequeDetail?.error?.error_detail ?? ""}
                      color="error"
                    />
                  </AppBar>
                </div>
              )}
              <GridWrapper
                key={`chequebookDetail` + getChequeDetail.isSuccess}
                finalMetaData={ChequebookDtlGridMetaData as GridMetaDataType}
                data={gridDetailData ?? []}
                setData={setGridDetailData}
                loading={getChequeDetail.isLoading}
                actions={chequeActions}
                setAction={setChequeBKPopUpActiont}
                onClickActionEvent={(index, id, data) => {
                  let apireq = {
                    ...data,
                    CONFIRMED: data.CONFIRMED === "Pending" ? "N" : "Y",
                    AUTO_CHQBK_FLAG: data.AUTO_CHQBK_FLAG === "No" ? "N" : "Y",
                  };
                  deleteDataRef.current = apireq;
                  validateDelete.mutate(apireq);
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
            </>
          ) : null}
        </Grid>
      </Container>

      {chequeBookData.length > 1 && (
        <>
          <Dialog
            open={true}
            fullWidth={true}
            PaperProps={{
              style: {
                maxWidth: "567px",
                padding: "5px",
              },
            }}
          >
            <GridWrapper
              key={`ChequeBKPopUpGridDatas`}
              finalMetaData={ChequeBKPopUpGridData as GridMetaDataType}
              data={chequeBookData ?? []}
              setData={() => {}}
              actions={ChequeBKPopUpAction}
              setAction={setChequeBKPopUpActiont}
            />
          </Dialog>
        </>
      )}

      {deletePopup && (
        <RemarksAPIWrapper
          TitleText={"Are you sure want to delete this record ..?"}
          onActionNo={() => setDeletePopup(false)}
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
          open={deletePopup}
          rows={deleteDataRef.current}
          defaultValue={"WRONG ENTRY FROM CHEQUE BOOK ISSUE ENTRY (TRN/045)"}
        />
      )}

      {/* {isOpenSave && (
        <MessageBoxWrapper
          MessageTitle={"Confirmation"}
          Message={"Are you sure to insert data"}
          onClickButton={(rows, buttonName) => {
            if (buttonName === "Yes") {
              crudChequeData.mutate(rows);
            } else {
              setIsOpenSave(false);
            }
          }}
          rows={insertDataRef.current}
          open={isOpenSave}
          loading={crudChequeData.isLoading}
        />
      )} */}

      {isOpenSave && (
        <PopupMessageAPIWrapper
          MessageTitle={"Confirmation"}
          Message={"Are you sure to insert data"}
          onActionYes={(rows, buttonName) => crudChequeData.mutate(rows)}
          onActionNo={() => setIsOpenSave(false)}
          rows={insertDataRef.current}
          open={isOpenSave}
          loading={crudChequeData.isLoading}
        />
      )}
    </>
  );
};
