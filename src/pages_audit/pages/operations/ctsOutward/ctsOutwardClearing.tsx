import { ClearCacheProvider } from "cache";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { extractMetaData } from "components/utils";
import { FC, Fragment, useCallback, useContext, useRef, useState } from "react";
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
  const [gridData, setGridData] = useState([]);
  const [chequeDetailData, setChequeDetailData] = useState<any>({
    chequeDetails: [{ ECS_USER_NO: "" }],
    SLIP_AMOUNT: "",
  });
  const myFormRef: any = useRef(null);
  const myChequeFormRef: any = useRef(null);
  const slipFormDataRef: any = useRef(null);
  const finalReqDataRef: any = useRef(null);

  const setCurrentAction = useCallback((data) => {
    if (data.name === "view-details") {
      setChequeDetailData((old) => ({
        ...old,
        chequeDetails: [
          ...old.chequeDetails.map((item) => {
            return {
              ...item,
              ECS_USER_NO: data?.rows?.[0]?.data?.REF_PERSON_NAME ?? "",
            };
          }),
        ],
      }));
      // setIsSlipJointDetail(data?.rows?.[0]?.data?.REF_PERSON_NAME ?? "");
    }
  }, []);

  const { data, isLoading, isError, error } = useQuery<any, any>(
    ["getBussinessDate"],
    () =>
      API.getBussinessDate({
        companyID: authState?.companyID ?? "",
        branchID: authState?.user?.branchCode ?? "",
      })
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
        SLIP_AMOUNT: "",
      });
      slipFormDataRef?.current?.removeFormInstance();
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
    if (parseFloat(data?.TOTAL_AMOUNT) === 0) {
      const newData = data.chequeDetails?.map((item) => ({
        ...item,
        _isNewRow: formMode === "new" ? true : false,
        PROCESSED: "N",
        REASON: "N",
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
      }));
      finalReqDataRef.current = {
        DAILY_CLEARING: {
          ...slipFormDataRef?.current,
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: authState?.user?.branchCode ?? "",
          ENTERED_COMP_CD: authState?.companyID ?? "",
          ENTERED_BRANCH_CD: authState?.user?.branchCode ?? "",
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
        COMP_CD: authState?.companyID ?? "",
        _isNewRow: true,
        endSubmit,
      };
      setOpenProceedMsg(true);
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
    } else if (parseFloat(data?.TOTAL_AMOUNT) < 0) {
      MessageBox("Validation Failed", "Please Check Amount");
    }
  };

  return (
    <Fragment>
      {isLoading ? (
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
              { TRAN_DT: data?.[0]?.DATE ?? "" } as InitialValuesType
            }
            onSubmitHandler={async (data: any, displayData, endSubmit) => {
              //@ts-ignore
              endSubmit(true);
              slipFormDataRef.current = data;
              setChequeDetailData((old) => {
                return { ...old, SLIP_AMOUNT: data?.AMOUNT };
              });
            }}
            setDataOnFieldChange={(action, payload) => {
              if (action === "ACCT_CD_VALID") {
                setJointDtlExpand(true);
                setGridData(payload);
              } else if (action === "ACCT_CD_BLANK") {
                setGridData([]);
                setChequeDetailData(() => ({
                  chequeDetails: [
                    {
                      ECS_USER_NO: "",
                    },
                  ],
                  SLIP_AMOUNT: "",
                }));
                // setIsSlipJointDetail("");
              } else if (action === "AMOUNT") {
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
                <GradientButton
                  onClick={() => {
                    // setIsOpenRetrieve(true);
                  }}
                >
                  Retrieve
                </GradientButton>
              </>
            )}
          </FormWrapper>

          {formMode === "new" ? (
            <Grid
              sx={{
                backgroundColor: "var(--theme-color2)",
                // padding: (theme) => theme.spacing(1),
                margin: "0px 0px 0px 10px",
                padding: gridData ? (isJointDtlExpand ? "10px" : "0px") : "0px",
                // padding: !isPDExpanded ? "6px" : "2px",
                // padding: "10px",
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
                  {gridData && gridData.length ? (
                    <GridWrapper
                      key={
                        "JoinDetailGridMetaData" + mutationOutward?.isSuccess
                      }
                      finalMetaData={SlipJoinDetailGridMetaData}
                      data={gridData ?? []}
                      setData={() => null}
                      // loading={isLoading || isFetching}
                      actions={actions}
                      setAction={setCurrentAction}
                      // refetchData={() => refetch()}
                      // ref={myGridRef}
                      // defaultSortOrder={[{ id: "TRAN_CD", desc: false }]}
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
                    ChequeDetailFormMetaData.fields[5].name +
                    `[${charAtIndex}]` +
                    ".AMOUNT"
                ) {
                  // setIsAddCheque(true);
                  let event: any = { preventDefault: () => {} };
                  myChequeFormRef?.current?.handleSubmit(event, "AMOUNT");
                }
              }
            }}
          >
            <FormWrapper
              key={
                `ChequeDetails` +
                (chequeDetailData?.SLIP_AMOUNT ?? "") +
                (chequeDetailData?.ECS_USER_NO ?? "") +
                chequeDetailData?.chequeDetails?.length +
                mutationOutward?.isSuccess
              }
              metaData={
                extractMetaData(
                  ChequeDetailFormMetaData,
                  formMode
                ) as MetaDataType
              }
              displayMode={formMode}
              onSubmitHandler={onSubmitHandler}
              initialValues={chequeDetailData}
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
              // setBankDetail={setBankDetail}
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
