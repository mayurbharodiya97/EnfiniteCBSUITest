import { ClearCacheProvider, queryClient } from "cache";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { extractMetaData } from "components/utils";
import {
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CTSOutwardClearingFormMetaData,
  ctsOutwardChequeDetailFormMetaData,
  SlipJoinDetailGridMetaData,
  inwardReturnChequeDetailFormMetaData,
} from "./metaData";
import * as API from "./api";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Alert } from "components/common/alert";
import { AppBar, Collapse, Grid, IconButton, Typography } from "@mui/material";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { ActionTypes } from "components/dataTable";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { AddNewBankMasterForm } from "./addNewBank";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { useSnackbar } from "notistack";
import { RetrieveClearingForm } from "./retrieveClearing";
import { usePopupContext } from "components/custom/popupContext";
import { format } from "date-fns";
import { RemarksAPIWrapper } from "components/custom/Remarks";

const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "Edit Detail",
    multiple: undefined,
    rowDoubleClick: true,
  },
  {
    actionName: "close",
    actionLabel: "cancel",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];

const CtsOutwardClearingForm: FC<{
  zoneTranType: any;
}> = ({ zoneTranType }) => {
  const { authState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [formMode, setFormMode] = useState("new");
  const [isJointDtlExpand, setJointDtlExpand] = useState(false);
  const [isOpenAddBankForm, setOpenAddBankForm] = useState(false);
  const [isOpenRetrieve, setIsOpenRetrieve] = useState(false);
  const [chequeDtlRefresh, setChequeDtlRefresh] = useState(0);
  const [gridData, setGridData] = useState<any>([]);
  const [chequeReqData, setChequeReqData] = useState<any>({});
  const [isDeleteRemark, SetDeleteRemark] = useState(false);
  const [chequeDetailData, setChequeDetailData] = useState<any>({
    chequeDetails: [
      { ECS_USER_NO: "", CHEQUE_DATE: authState?.workingDate ?? "" },
    ],
    SLIP_AMOUNT: "0",
  });
  const myFormRef: any = useRef(null);
  const myChequeFormRef: any = useRef(null);
  const slipFormDataRef: any = useRef(null);
  const finalReqDataRef: any = useRef(null);
  const retrieveDataRef: any = useRef(null);
  const setCurrentAction = useCallback((data) => {
    if (data.name === "view-details") {
      setChequeDetailData((old) => {
        return {
          ...old,
          chequeDetails: [
            ...old.chequeDetails.map((item) => {
              return {
                ...item,
                ECS_USER_NO: data?.rows?.[0]?.data?.REF_PERSON_NAME ?? "",
              };
            }),
          ],
        };
      });
      setChequeDtlRefresh((old) => old + 1);
      // setIsSlipJointDetail(data?.rows?.[0]?.data?.REF_PERSON_NAME ?? "");
    }
  }, []);
  const { data, isLoading, isError, error, refetch } = useQuery<any, any>(
    ["getBussinessDate", formMode, zoneTranType],
    () => API.getBussinessDate()
  );
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getBussinessDate", formMode]);
    };
  }, []);
  const getOutwardClearingData: any = useMutation(
    API.getOutwardClearingConfigData,
    {
      onSuccess: (data) => {
        // isDataChangedRef.current = true;
      },
      onError: (error: any) => {},
    }
  );

  const mutationOutward = useMutation(API.outwardClearingConfigDML, {
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
      enqueueSnackbar(data, {
        variant: "success",
      });
      setGridData([]);
      setChequeDetailData({
        chequeDetails: [{ ECS_USER_NO: "" }],
        SLIP_AMOUNT: "0",
      });
      setChequeDtlRefresh(0);
      myFormRef?.current?.handleFormReset({ preventDefault: () => {} });
      myChequeFormRef?.current?.handleFormReset({ preventDefault: () => {} });
      CloseMessageBox();
    },
  });
  const deleteMutation = useMutation(API.outwardClearingConfigDML, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
      SetDeleteRemark(false);
    },
    onSuccess: (data) => {
      // isDataChangedRef.current = true;
      enqueueSnackbar("Records successfully deleted", {
        variant: "success",
      });
      setFormMode("new");
      CloseMessageBox();
      SetDeleteRemark(false);
    },
  });

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    action
  ) => {
    //@ts-ignore
    endSubmit(true);
    let newData = [];
    if (Boolean(data?.chequeDetails) && Array.isArray(data?.chequeDetails)) {
      newData = data?.chequeDetails?.map((item) => ({
        ...item,
        _isNewRow: formMode === "new" ? true : false,
        BRANCH_CD: slipFormDataRef?.current?.BRANCH_CD,
        PROCESSED: "N",
        REASON: zoneTranType === "S" ? "N" : item?.REASON,
        CLEARING_STATUS: "C",
      }));
    }

    if (
      !Boolean(data?.SLIP_AMOUNT) ||
      parseFloat(data?.SLIP_AMOUNT ?? 0) <= 0
    ) {
      MessageBox({
        message: "Please Enter Slip Amount",
        messageTitle: "Validation Failed",
      });
    } else if (
      parseFloat(data?.TOTAL_AMOUNT) === 0 &&
      newData &&
      newData.length > 0
    ) {
      finalReqDataRef.current = {
        DAILY_CLEARING: {
          ...slipFormDataRef?.current,
          _isNewRow: true,
          REQUEST_CD: "",
          TRAN_TYPE: zoneTranType,
        },
        DETAILS_DATA: {
          isNewRow: [...newData],
          isUpdatedRow: [],
          isDeleteRow: [],
        },
        ...slipFormDataRef?.current,
        PROCESSED: "N",
        SKIP_ENTRY: "N",
        _isNewRow: true,
        endSubmit,
      };
      const buttonName = await MessageBox({
        messageTitle: "Confirmation",
        message: " Proceed ?",
        buttonNames: ["No", "Yes"],
        loadingBtnName: "Yes",
      });
      if (buttonName === "Yes") {
        mutationOutward.mutate(finalReqDataRef.current);
      }
    } else if (
      parseFloat(data?.TOTAL_AMOUNT) > 0 &&
      Array.isArray(chequeDetailData?.chequeDetails) &&
      chequeDetailData?.chequeDetails?.length > 0 &&
      data?.chequeDetails?.length > 0
    ) {
      setChequeDetailData((old) => ({
        ...old,
        chequeDetails: [
          {
            ...data?.chequeDetails[0],
            AMOUNT: "",
            CHEQUE_NO: "",
          },

          ...data.chequeDetails,
        ],
      }));
      setChequeDtlRefresh((old) => old + 1);
    } else if (
      (parseFloat(data?.TOTAL_AMOUNT) > 0 || newData?.length,
      newData.length === 0)
    ) {
      setChequeDetailData((old) => ({
        chequeDetails: [
          {
            ECS_USER_NO: gridData?.ACCT_NAME ?? "",
            CHEQUE_DATE: authState?.workingDate ?? "",
          },
        ],
        // chequeDetails: [
        //   ...old.chequeDetails.map((item) => {
        //     console.log("old", old);
        //     return {
        //       ...item,
        //     };
        //   }),
        // ],
      }));
      setChequeDtlRefresh((old) => old + 1);
    } else if (parseFloat(data?.TOTAL_AMOUNT) < 0) {
      MessageBox({
        message: "Validation Failed",
        messageTitle: "Please Check Amount",
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (event.ctrlKey && (event?.key === "R" || event?.key === "r")) {
        event.preventDefault();
        setIsOpenRetrieve(true);
      } else if (formMode === "view") {
        if (event.ctrlKey && (event?.key === "D" || event?.key === "d")) {
          event.preventDefault();
          if (
            retrieveDataRef.current?.CONFIRMED === "Y" &&
            authState?.role < "2"
          ) {
            await MessageBox({
              messageTitle: "Validation Failed..",
              message: "Cannot Delete Confirmed Transaction",
              buttonNames: ["Ok"],
            });
          } else if (
            !(
              format(
                new Date(retrieveDataRef.current?.TRAN_DT),
                "dd/MMM/yyyy"
              ) >= format(new Date(authState?.workingDate), "dd/MMM/yyyy")
            )
          ) {
            await MessageBox({
              messageTitle: "Validation Failed..",
              message: "Cannot Delete Back Dated Entry",
              buttonNames: ["Ok"],
            });
          } else {
            SetDeleteRemark(true);
          }
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
  }, [formMode]);

  if (zoneTranType === "S") {
    CTSOutwardClearingFormMetaData.form.label = "CTS O/W Clearing";
    CTSOutwardClearingFormMetaData.fields[1].defaultValue = "0   ";
  } else if (zoneTranType === "R") {
    CTSOutwardClearingFormMetaData.form.label = "Inward Return Entry";
    CTSOutwardClearingFormMetaData.fields[1].defaultValue = "10  ";
  }

  return (
    <Fragment>
      {isLoading || getOutwardClearingData.isLoading ? (
        <div style={{ height: 100, paddingTop: 10 }}>
          <div style={{ padding: 10 }}>
            <LoaderPaperComponent />
          </div>
        </div>
      ) : isError ? (
        <>
          <div
            style={{
              paddingRight: "10px",
              paddingLeft: "10px",
              height: 100,
              paddingTop: 10,
            }}
          >
            <AppBar position="relative" color="primary">
              <Alert
                severity="error"
                errorMsg={error?.error_msg ?? "Unknow Error"}
                errorDetail={error?.error_detail ?? ""}
                color="error"
              />
            </AppBar>
          </div>
        </>
      ) : (
        <>
          <FormWrapper
            key={
              "CTSOutwardForm" +
              formMode +
              mutationOutward?.isSuccess +
              zoneTranType
            }
            metaData={
              extractMetaData(
                zoneTranType === "S"
                  ? CTSOutwardClearingFormMetaData
                  : CTSOutwardClearingFormMetaData,
                formMode
              ) as MetaDataType
            }
            initialValues={
              formMode === "new"
                ? {
                    TRAN_DT:
                      zoneTranType === "S"
                        ? data?.[0]?.TRAN_DATE
                        : authState?.workingDate ?? "",
                    ZONE_TRAN_TYPE: zoneTranType,
                  }
                : {
                    ...getOutwardClearingData.data?.[0],
                  }
            }
            onSubmitHandler={async (
              data: any,
              displayData,
              endSubmit,
              setFieldError,
              action
            ) => {
              //@ts-ignore
              endSubmit(true);
              slipFormDataRef.current = data;
              if (action === "CHEQUEDTL") {
                let event: any = { preventDefault: () => {} };
                myChequeFormRef?.current?.handleSubmit(event, "FINAL");
              }
            }}
            setDataOnFieldChange={(action, payload) => {
              if (action === "API_REQ") {
                setChequeReqData(payload);
              } else if (action === "ACCT_CD_VALID") {
                setJointDtlExpand(true);
                setGridData(payload);
                setChequeDetailData((old) => {
                  return {
                    ...old,
                    chequeDetails: [
                      ...old.chequeDetails.map((item) => {
                        return {
                          ...item,
                          ECS_USER_NO: payload?.ACCT_NAME ?? "",
                          CHEQUE_DATE: authState?.workingDate ?? "",
                        };
                      }),
                    ],
                  };
                });
                setChequeDtlRefresh((old) => old + 1);
              } else if (action === "ACCT_CD_BLANK") {
                setGridData([]);
                setChequeDetailData(() => ({
                  chequeDetails: [
                    {
                      ECS_USER_NO: "",
                      CHEQUE_DATE: authState?.workingDate ?? "",
                    },
                  ],
                  SLIP_AMOUNT: "0",
                }));
                setChequeDtlRefresh((old) => old + 1);
                // setIsSlipJointDetail("");
              } else if (action === "AMOUNT") {
                setChequeDetailData((old) => ({
                  ...old,
                  SLIP_AMOUNT: payload,
                }));
                setChequeDtlRefresh((old) => old + 1);
                let event: any = { preventDefault: () => {} };
                myFormRef?.current?.handleSubmit(event);
              }
            }}
            //@ts-ignore
            displayMode={formMode}
            formStyle={{
              background: "white",
              width: "100%",
              padding: "05px",
            }}
            formState={{
              ZONE_TRAN_TYPE: zoneTranType,
              MessageBox: MessageBox,
            }}
            ref={myFormRef}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                {formMode === "new" ? (
                  <>
                    <GradientButton
                      onClick={() => {
                        setIsOpenRetrieve(true);
                      }}
                    >
                      Retrieve
                    </GradientButton>
                  </>
                ) : formMode === "view" ? (
                  <>
                    <GradientButton
                      onClick={() => {
                        setIsOpenRetrieve(true);
                      }}
                    >
                      Retrieve
                    </GradientButton>

                    <GradientButton
                      onClick={() => {
                        setFormMode("new");
                        refetch();
                      }}
                    >
                      New
                    </GradientButton>

                    <GradientButton
                      onClick={async () => {
                        if (
                          retrieveDataRef.current?.CONFIRMED === "Y" &&
                          authState?.role < "2"
                        ) {
                          await MessageBox({
                            messageTitle: "Validation Failed..",
                            message: "Cannot Delete Confirmed Transaction",
                            buttonNames: ["Ok"],
                          });
                        } else if (
                          !(
                            format(
                              new Date(retrieveDataRef.current?.TRAN_DT),
                              "dd/MMM/yyyy"
                            ) >=
                            format(
                              new Date(authState?.workingDate),
                              "dd/MMM/yyyy"
                            )
                          )
                        ) {
                          await MessageBox({
                            messageTitle: "Validation Failed..",
                            message: "Cannot Delete Back Dated Entry",
                            buttonNames: ["Ok"],
                          });
                        } else {
                          SetDeleteRemark(true);
                        }
                      }}
                    >
                      Remove
                    </GradientButton>
                  </>
                ) : null}
              </>
            )}
          </FormWrapper>

          {formMode === "new" ? (
            <Grid
              sx={{
                backgroundColor: "var(--theme-color2)",
                margin: "0px 0px 0px 10px",
                padding:
                  gridData?.ACCT_JOIN_DETAILS &&
                  gridData?.ACCT_JOIN_DETAILS?.length > 0
                    ? isJointDtlExpand
                      ? "10px"
                      : "0px"
                    : "0px",
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: "20px",
              }}
              container
              item
              xs={11.8}
              direction={"column"}
            >
              <Grid
                container
                item
                sx={{ alignItems: "center", justifyContent: "space-between" }}
              >
                <Typography
                  sx={{
                    color: "var(--theme-color3)",
                    marginLeft: "15px",
                    marginTop: "6px",
                  }}
                  gutterBottom={true}
                  variant={"h6"}
                >
                  Joint - Details
                </Typography>
                <IconButton
                  onClick={() => setJointDtlExpand(!isJointDtlExpand)}
                >
                  {!isJointDtlExpand ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                </IconButton>
              </Grid>
              <Collapse in={isJointDtlExpand}>
                <Grid item>
                  {gridData?.ACCT_JOIN_DETAILS &&
                  gridData?.ACCT_JOIN_DETAILS?.length > 0 ? (
                    <GridWrapper
                      key={
                        "JoinDetailGridMetaData" + mutationOutward?.isSuccess
                      }
                      finalMetaData={SlipJoinDetailGridMetaData}
                      data={gridData?.ACCT_JOIN_DETAILS ?? []}
                      setData={() => null}
                      actions={actions}
                      setAction={setCurrentAction}
                    />
                  ) : null}
                </Grid>
              </Collapse>
            </Grid>
          ) : null}
          <div
            onKeyDown={(e) => {
              let target: any = e?.target;
              const charAtIndex = target.name?.split("").find((char, index) => {
                return index === 39;
              });
              if (e?.key === "Enter" || e?.key === "Tab") {
                let metaData;
                if (zoneTranType === "S") {
                  metaData = ctsOutwardChequeDetailFormMetaData;
                } else if (zoneTranType === "R") {
                  metaData = inwardReturnChequeDetailFormMetaData;
                }
                if (
                  (target?.name ?? "") ===
                  metaData.form.name +
                    "/" +
                    metaData.fields[7].name +
                    `[${charAtIndex}]` +
                    ".AMOUNT"
                ) {
                  let event: any = { preventDefault: () => {} };
                  myFormRef?.current?.handleSubmit(event, "CHEQUEDTL");
                }
              }
            }}
          >
            <FormWrapper
              key={`ChequeDetails` + chequeDtlRefresh + formMode + zoneTranType}
              metaData={
                extractMetaData(
                  zoneTranType === "S"
                    ? ctsOutwardChequeDetailFormMetaData
                    : zoneTranType === "R"
                    ? inwardReturnChequeDetailFormMetaData
                    : inwardReturnChequeDetailFormMetaData,
                  formMode
                ) as MetaDataType
              }
              displayMode={formMode}
              onSubmitHandler={onSubmitHandler}
              initialValues={
                formMode === "new"
                  ? {
                      ...chequeDetailData,
                      TRAN_DT: data?.[0]?.TRAN_DATE ?? "",
                      RANGE_DT: data?.[0]?.RANGE_DATE ?? "",
                    }
                  : {
                      chequeDetails:
                        getOutwardClearingData.data?.[0]?.CHEQUE_DETAIL ?? "",
                    }
              }
              hideHeader={true}
              containerstyle={{ padding: "0px !important" }}
              setDataOnFieldChange={async (action, paylod) => {
                if (action === "MESSAGE") {
                  if (paylod?.[0]?.ERROR_MSSAGE) {
                    let res = await MessageBox({
                      messageTitle: "Confirmation..",
                      message: "Are You sure To Add Bank?",
                      buttonNames: ["Yes", "No"],
                    });
                    if (res === "Yes") {
                      setOpenAddBankForm(true);
                    }
                  }
                }
              }}
              onFormButtonClickHandel={() => {
                let event: any = { preventDefault: () => {} };
                myFormRef?.current?.handleSubmit(event, "CHEQUEDTL");
              }}
              ref={myChequeFormRef}
              formStyle={{
                height: "65%",
              }}
              formState={{
                REQ_DATA: chequeReqData,
                ZONE_TRAN_TYPE: zoneTranType,
                MessageBox: MessageBox,
              }}
            />
          </div>
          {isOpenAddBankForm ? (
            <AddNewBankMasterForm
              isOpen={isOpenAddBankForm}
              onClose={() => {
                setOpenAddBankForm(false);
              }}
            />
          ) : null}
          {isOpenRetrieve ? (
            <RetrieveClearingForm
              zoneTranType={zoneTranType}
              onClose={(flag, rowsData) => {
                setIsOpenRetrieve(false);
                if (flag === "action") {
                  retrieveDataRef.current = rowsData?.[0]?.data ?? "";
                  getOutwardClearingData.mutate({
                    TRAN_CD: rowsData?.[0]?.data?.TRAN_CD ?? "",
                    ENTERED_COMP_CD: rowsData?.[0]?.data?.ENTERED_COMP_CD ?? "",
                    ENTERED_BRANCH_CD:
                      rowsData?.[0]?.data?.ENTERED_BRANCH_CD ?? "",
                    TRAN_TYPE: zoneTranType,
                  });
                  setFormMode("view");
                }
              }}
              tranDate={data?.[0]?.TRAN_DATE ?? ""}
            />
          ) : null}
          {isDeleteRemark && (
            <RemarksAPIWrapper
              TitleText={
                zoneTranType === "S"
                  ? "Enter Removal Remarks For CTS O/W CLEARING (TRN/559)"
                  : "Enter Removal Remarks For INWARD RETURN ENTRY (TRN/028)"
              }
              onActionNo={() => SetDeleteRemark(false)}
              onActionYes={async (val, rows) => {
                const buttonName = await MessageBox({
                  messageTitle: "Confirmation",
                  message: "Do You Want to delete this row?",
                  buttonNames: ["No", "Yes"],
                  defFocusBtnName: "Yes",
                  loadingBtnName: "Yes",
                });
                if (buttonName === "Yes") {
                  deleteMutation.mutate({
                    DAILY_CLEARING: {
                      _isNewRow: false,
                      _isDeleteRow: true,
                      _isUpdateRow: false,
                      ENTERED_COMP_CD: retrieveDataRef.current?.ENTERED_COMP_CD,
                      ENTERED_BRANCH_CD:
                        retrieveDataRef.current?.ENTERED_BRANCH_CD,
                      TRAN_CD: retrieveDataRef.current?.TRAN_CD,
                      CONFIRMED: retrieveDataRef.current?.CONFIRMED,
                      ENTERED_BY: retrieveDataRef.current?.ENTERED_BY,
                    },
                    BRANCH_CD:
                      getOutwardClearingData.data?.[0]?.CHEQUE_DETAIL?.[0]
                        ?.BRANCH_CD,
                    SR_CD: retrieveDataRef.current?.SR_NO,
                    ACCT_TYPE: getOutwardClearingData.data?.[0]?.ACCT_TYPE,
                    ACCT_CD: getOutwardClearingData.data?.[0]?.ACCT_CD,
                    AMOUNT: getOutwardClearingData.data?.[0]?.AMOUNT,
                    TRAN_DT: getOutwardClearingData.data?.[0]?.TRAN_DT,
                    TRAN_CD: retrieveDataRef.current?.TRAN_CD,
                    USER_DEF_REMARKS: val
                      ? val
                      : zoneTranType === "S"
                      ? "WRONG ENTRY FROM CTS O/W CLEARING (TRN/559)"
                      : "WRONG ENTRY FROM INWARD RETURN ENTRY (TRN/028)",

                    ACTIVITY_TYPE:
                      zoneTranType === "S"
                        ? "CTS OW CLEARING ENTRY SCREEN"
                        : "INWARD RETURN ENTRY SCREEN",
                    DETAILS_DATA: {
                      isNewRow: [],
                      isDeleteRow: [
                        {
                          TRAN_CD: retrieveDataRef.current?.TRAN_CD,
                        },
                      ],
                      isUpdatedRow: [],
                    },
                    _isDeleteRow: true,
                  });
                }
              }}
              // isLoading={crudLimitData?.isLoading}
              isEntertoSubmit={true}
              AcceptbuttonLabelText="Ok"
              CanceltbuttonLabelText="Cancel"
              open={isDeleteRemark}
              // rows={deleteDataRef.current}
              defaultValue={
                zoneTranType === "S"
                  ? "WRONG ENTRY FROM CTS O/W CLEARING (TRN/559)"
                  : "WRONG ENTRY FROM INWARD RETURN ENTRY (TRN/028)"
              }
              rows={undefined}
            />
          )}
        </>
      )}
    </Fragment>
  );
};

export const CtsOutwardClearingFormWrapper = ({ zoneTranType }) => {
  return (
    <ClearCacheProvider>
      <CtsOutwardClearingForm
        key={zoneTranType + "-CtsOutwardClearingForm"}
        zoneTranType={zoneTranType}
      />
    </ClearCacheProvider>
  );
};
