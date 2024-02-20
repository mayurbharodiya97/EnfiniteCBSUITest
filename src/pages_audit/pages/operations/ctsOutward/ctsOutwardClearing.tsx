import { ClearCacheProvider } from "cache";
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
  ChequeDetailFormMetaData,
  SlipJoinDetailGridMetaData,
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
  const { authState, MessageBox } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [formMode, setFormMode] = useState("new");
  const [isJointDtlExpand, setJointDtlExpand] = useState(false);
  const [isOpenPopupMsg, setOpenPopupMsg] = useState(false);
  const [isOpenAddBankForm, setOpenAddBankForm] = useState(false);
  const [isOpenProceedMsg, setOpenProceedMsg] = useState(false);
  const [isOpenRetrieve, setIsOpenRetrieve] = useState(false);
  const [isDelete, SetDelete] = useState(false);
  const [chequeDtlRefresh, setChequeDtlRefresh] = useState(0);
  const [gridData, setGridData] = useState([]);
  const [chequeDetailData, setChequeDetailData] = useState<any>({
    chequeDetails: [{ ECS_USER_NO: "" }],
    SLIP_AMOUNT: "0",
  });
  const myFormRef: any = useRef(null);
  const myChequeFormRef: any = useRef(null);
  const slipFormDataRef: any = useRef(null);
  const finalReqDataRef: any = useRef(null);
  const trancdForDeleteRef: any = useRef(null);
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

  const { data, isLoading, isError, error } = useQuery<any, any>(
    ["getBussinessDate"],
    () => API.getBussinessDate()
  );

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
      setOpenProceedMsg(false);
    },
    onSuccess: (data) => {
      enqueueSnackbar(data, {
        variant: "success",
      });
      setOpenProceedMsg(false);
      setGridData([]);
      setChequeDetailData({
        chequeDetails: [{ ECS_USER_NO: "" }],
        SLIP_AMOUNT: "0",
      });
      setChequeDtlRefresh(0);
      myFormRef?.current?.handleFormReset({ preventDefault: () => {} });
      myChequeFormRef?.current?.handleFormReset({ preventDefault: () => {} });
    },
  });
  const deleteMutation = useMutation(API.outwardClearingConfigDML, {
    onError: (error: any) => {},
    onSuccess: (data) => {
      // isDataChangedRef.current = true;
      enqueueSnackbar("Records successfully deleted", {
        variant: "success",
      });

      SetDelete(false);
      setFormMode("new");
    },
  });
  const onAcceptDelete = (rows) => {
    deleteMutation.mutate({
      DAILY_CLEARING: {
        TRAN_CD: trancdForDeleteRef.current,
      },
      DETAILS_DATA: {
        isNewRow: [],
        isDeleteRow: [
          {
            TRAN_CD: trancdForDeleteRef.current,
          },
        ],
        isUpdatedRow: [],
      },
      _isDeleteRow: true,
    });
  };
  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    action
  ) => {
    //@ts-ignore
    endSubmit(true);
    console.log(">>data", data);
    if (
      !Boolean(data?.SLIP_AMOUNT) ||
      parseFloat(data?.SLIP_AMOUNT ?? 0) <= 0
    ) {
      MessageBox("Validation Failed", "Please Enter Slip Amount");
    } else if (parseFloat(data?.TOTAL_AMOUNT) === 0) {
      const newData = data.chequeDetails?.map((item) => ({
        ...item,
        _isNewRow: formMode === "new" ? true : false,
        BRANCH_CD: slipFormDataRef?.current?.BRANCH_CD,
        PROCESSED: "N",
        REASON: "N",
      }));

      finalReqDataRef.current = {
        DAILY_CLEARING: {
          ...slipFormDataRef?.current,
          _isNewRow: true,
          REQUEST_CD: "",
          TRAN_TYPE: zoneTranType ?? "",
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

      setOpenProceedMsg(true);
    } else if (
      parseFloat(data?.TOTAL_AMOUNT) > 0 &&
      Array.isArray(chequeDetailData?.chequeDetails) &&
      chequeDetailData?.chequeDetails?.length > 0 &&
      data?.chequeDetails?.length > 0
    ) {
      const lastRow = data?.chequeDetails[data?.chequeDetails?.length - 1];
      setChequeDetailData((old) => ({
        ...old,
        chequeDetails: [
          {
            ...lastRow,
            AMOUNT: "",
            CHEQUE_NO: "",
          },
          ...data.chequeDetails,
        ],
      }));
      setChequeDtlRefresh((old) => old + 1);
    } else if (parseFloat(data?.TOTAL_AMOUNT) > 0) {
      setChequeDetailData((old) => ({
        ...old,
        chequeDetails: [
          {
            CHEQUE_DATE: "",
            ECS_USER_NO: "",
            CHEQUE_NO: "",
          },
          ...data.chequeDetails,
        ],
      }));
      setChequeDtlRefresh((old) => old + 1);
    } else if (parseFloat(data?.TOTAL_AMOUNT) < 0) {
      MessageBox("Validation Failed", "Please Check Amount");
    }
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && (event.key === "R" || event.key === "r")) {
        event.preventDefault();
        setIsOpenRetrieve(true);
      } else if (formMode === "view") {
        if (event.ctrlKey && (event.key === "D" || event.key === "d")) {
          event.preventDefault();
          SetDelete(true);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
  }, [formMode]);

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
            key={"CTSOutwardForm" + formMode + mutationOutward?.isSuccess}
            metaData={
              extractMetaData(
                CTSOutwardClearingFormMetaData,
                formMode
              ) as MetaDataType
            }
            initialValues={
              formMode === "new"
                ? {
                    TRAN_DT: data?.[0]?.TRAN_DATE ?? "",
                    ZONE_TRAN_TYPE: zoneTranType,
                  }
                : ({
                    ...(getOutwardClearingData.data?.[0] || {}),
                  } as InitialValuesType)
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
              if (action === "ACCT_CD_VALID") {
                setJointDtlExpand(true);
                setGridData(payload?.ACCT_JOIN_DETAILS);
                setChequeDetailData((old) => {
                  return {
                    ...old,
                    chequeDetails: [
                      ...old.chequeDetails.map((item) => {
                        return {
                          ...item,
                          ECS_USER_NO: payload?.ACCT_NAME ?? "",
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
            formState={{ ZONE_TRAN_TYPE: zoneTranType, MessageBox: MessageBox }}
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
                      }}
                    >
                      New
                    </GradientButton>

                    <GradientButton
                      onClick={() => {
                        SetDelete(true);
                      }}
                    >
                      Delete
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
                  gridData && gridData?.length > 0
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
                  {gridData && gridData?.length > 0 ? (
                    <GridWrapper
                      key={
                        "JoinDetailGridMetaData" + mutationOutward?.isSuccess
                      }
                      finalMetaData={SlipJoinDetailGridMetaData}
                      data={gridData ?? []}
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
              const charAtIndex = target.name.split("").find((char, index) => {
                return index === 39;
              });
              if (e.key === "Enter" || e.key === "Tab") {
                if (
                  (target?.name ?? "") ===
                  ChequeDetailFormMetaData.form.name +
                    "/" +
                    ChequeDetailFormMetaData.fields[7].name +
                    `[${charAtIndex}]` +
                    ".AMOUNT"
                ) {
                  // setIsAddCheque(true);
                  let event: any = { preventDefault: () => {} };
                  myFormRef?.current?.handleSubmit(event, "CHEQUEDTL");
                }
              }
            }}
          >
            <FormWrapper
              key={`ChequeDetails` + chequeDtlRefresh + formMode}
              metaData={
                extractMetaData(
                  ChequeDetailFormMetaData,
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
              setDataOnFieldChange={(action, paylod) => {
                if (action === "MESSAGE") {
                  if (paylod?.[0]?.ERROR_MSSAGE) {
                    setOpenPopupMsg(true);
                  }
                }
              }}
              onFormButtonClickHandel={() => {
                let event: any = { preventDefault: () => {} };
                myChequeFormRef?.current?.handleSubmit(event);
              }}
              ref={myChequeFormRef}
              formStyle={{
                height: "65%",
              }}
            />
          </div>
          {isOpenPopupMsg ? (
            <PopupMessageAPIWrapper
              MessageTitle="Confirmation"
              Message="Are You sure To Add Bank?"
              onActionYes={() => {
                setOpenPopupMsg(false);
                setOpenAddBankForm(true);
              }}
              onActionNo={() => setOpenPopupMsg(false)}
              rows={{}}
              open={isOpenPopupMsg}
            />
          ) : null}
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
                  trancdForDeleteRef.current =
                    rowsData?.[0]?.data?.TRAN_CD ?? "";
                  getOutwardClearingData.mutate({
                    TRAN_CD: rowsData?.[0]?.data?.TRAN_CD ?? "",
                  });
                  setFormMode("view");
                }
              }}
              tranDate={data?.[0]?.TRAN_DATE ?? ""}
            />
          ) : null}
          {isOpenProceedMsg ? (
            <PopupMessageAPIWrapper
              MessageTitle="Confirmation"
              Message=" Proceed ?"
              onActionYes={(rowsVal) => mutationOutward.mutate(rowsVal)}
              onActionNo={() => setOpenProceedMsg(false)}
              rows={finalReqDataRef.current}
              open={isOpenProceedMsg}
              loading={mutationOutward.isLoading}
            />
          ) : null}
          {isDelete ? (
            <PopupMessageAPIWrapper
              MessageTitle="Confirmation"
              Message="Do You Want to delete this row?"
              onActionYes={(rows) => onAcceptDelete(rows)}
              onActionNo={() => SetDelete(false)}
              rows={{}}
              open={isDelete}
              loading={deleteMutation.isLoading}
            />
          ) : null}
        </>
      )}
    </Fragment>
  );
};

export const CtsOutwardClearingFormWrapper = ({ zoneTranType }) => {
  return (
    <ClearCacheProvider>
      <CtsOutwardClearingForm zoneTranType={zoneTranType} />
    </ClearCacheProvider>
  );
};
