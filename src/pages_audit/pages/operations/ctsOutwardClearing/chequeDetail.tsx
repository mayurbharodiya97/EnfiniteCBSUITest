import { Transition } from "pages_audit/common";
import { Alert } from "components/common/alert";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import {
  FC,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from "react";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { queryClient, ClearCacheContext } from "cache";
import { useSnackbar } from "notistack";
import {
  CreateDetailsRequestData,
  ProcessDetailsData,
  extractMetaData,
  utilFunction,
} from "components/utils";
import {
  ChequeDetailFormMetaData,
  CtsOutwardClearingMetadata,
  SlipJoinDetailGridMetaData,
} from "./metaData";
import { makeStyles } from "@mui/styles";
import {
  AppBar,
  Grid,
  Toolbar,
  Typography,
  Theme,
  Dialog,
  Button,
  CircularProgress,
} from "@mui/material";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { ClearingBankMaster } from "./clearingBankMaster";
import { Box } from "@mui/system";
import { GradientButton } from "components/styledComponent/button";
import { ActionTypes } from "components/dataTable";
import { useNavigate } from "react-router-dom";

export const useDialogStyles = makeStyles((theme: Theme) => ({
  topScrollPaper: {
    alignItems: "center",
  },
  topPaperScrollBody: {
    verticalAlign: "top",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
}));
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
export const ChequeDetailForm: FC<{
  formData?: any;
  isOpenProcced?: any;
  setIsOpenProcced?: any;
  myRef?: any;
  formMode?: any;
  gridData?: any;
  retrievData?: any;
  loading?: Boolean;
  setFormData?: any;
  error?: any;
  setFormMode?: any;
  zoneTranType?: any;
  mutationOutward?: any;
  initValues?: any;
  setInitValues?: any;
}> = ({
  formData,
  setIsOpenProcced,
  isOpenProcced,
  myRef,
  formMode,
  gridData,
  retrievData,
  loading,
  error,
  initValues,
  zoneTranType,
  mutationOutward,
  setInitValues,
}) => {
  const { authState } = useContext(AuthContext);
  const myChequeRef = useRef<any>(null);
  const isDataChangedRef = useRef(false);
  const [isBankAdding, setisBankAdding] = useState<any>(false);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const [isOpenJointDetail, setIsOpenJointDetail] = useState(false);
  const [isSlipJointDetail, setIsSlipJointDetail] = useState("");
  const isErrorFuncRef = useRef<any>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [totalAmountCheque, setTotalAmountCheque] = useState<any>();
  const navigate = useNavigate();

  const setCurrentAction = useCallback(
    (data) => {
      if (data.name === "view-details") {
        setIsSlipJointDetail(data?.rows?.[0]?.data?.REF_PERSON_NAME);
        setIsOpenJointDetail(false);
      } else {
        setIsOpenJointDetail(false);
      }
    },
    [navigate]
  );
  const [totalAmountSlip, setTotalAmountSlip] = useState(
    Number(formData?.AMOUNT)
  );
  let cheueTotalAmount = 0;
  retrievData?.CHEQUE_DETAIL.forEach((element) => {
    if (
      element.AMOUNT !== undefined &&
      element.AMOUNT !== "" &&
      element.AMOUNT
    ) {
      cheueTotalAmount += Number(element.AMOUNT);
    }
  });

  const onPopupYes = (rows) => {
    mutationOutward.mutate(rows);
  };
  const onActionCancel = () => {
    setIsOpenProcced(false);
  };
  const ClickEventManage = () => {
    let event: any = { preventDefault: () => {} };
    myChequeRef?.current?.handleSubmit(event, "AMOUNT");
    myRef?.current?.handleSubmit(event, "AMOUNT");
  };
  // useEffect(() => {
  //   setTotalAmountSlip(formDataRef.current.AMOUNT ?? "0.00");
  //   myRef.current = zoneData;
  // }, [formDataRef.current.AMOUNT, zoneData]);

  useEffect(() => {
    let init = initValues.chequeDetails;
    if (formData) {
      init[0] = {
        ECS_USER_NO: formData?.ACCT_NAME ?? "",
        ECS_SEQ_NO: formData?.ACCT_CD ?? "",
        isRemoveButton: true,
      };
      // if (ChequeDetailFormMetaData.fields[0]) {
      //   ChequeDetailFormMetaData.fields[0].isRemoveButton = true;
      // }
    }
    if (isSlipJointDetail?.length) {
      init[0] = {
        ECS_USER_NO: isSlipJointDetail ?? "",
        ECS_SEQ_NO: formData?.ACCT_CD ?? "",
      };
    }
    // Update the form data with the new values
    setInitValues((old) => ({
      ...old,
      chequeDetails: [...init],
    }));
    // }
  }, [isSlipJointDetail, formData, mutationOutward.isSuccess]);

  const onSubmitHandlerCheuq: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    value
  ) => {
    //@ts-ignore
    endSubmit(true);
    const newData = data.chequeDetails?.map((item) => ({
      ...item,
      _isNewRow: formMode === "new" ? true : false,
      PROCESSED: "N",
      REASON: "N",
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
    }));

    if (value === "AMOUNT") {
      let totalAmount = 0;
      data.chequeDetails.forEach((element) => {
        if (
          element.AMOUNT !== undefined &&
          element.AMOUNT !== "" &&
          element.AMOUNT
        ) {
          totalAmount += Number(element.AMOUNT);
        }
      });

      setTotalAmountCheque(Number(totalAmount));
      // // slip and cheque total minus
      setTotalAmountSlip(totalAmount - formData.AMOUNT);
      // Compare the totals
      let initVal = data.chequeDetails;
      if (!formData.AMOUNT || formData.AMOUNT.length === 0) {
        // Do not add a new row if AMOUNT is not present or has a length of 0
        return;
      }
      if (totalAmount === 0 || Number(totalAmount) > Number(formData.AMOUNT)) {
        return;
      }
      if (Number(totalAmount) === Number(formData.AMOUNT)) {
        // Totals don't match, add a new rows

        isErrorFuncRef.current = {
          DAILY_CLEARING: {
            ...formData,
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
          ...formData,
          PROCESSED: "N",
          SKIP_ENTRY: "N",
          COMP_CD: authState?.companyID ?? "",
          _isNewRow: true,
          endSubmit,
          setFieldError,
        };

        setIsOpenProcced(true);
        console.log("isErrorFuncRef.current", isErrorFuncRef.current);
        // return;
        // ChequeDetailFormMetaData.fields[0]._fields[0].isFieldFocused = true;
      } else {
        ChequeDetailFormMetaData.fields[0]._fields[0].isFieldFocused = true;
        initVal.push({
          ECS_SEQ_NO: "",
        });

        ChequeDetailFormMetaData.fields[0].isRemoveButton = false;
        setInitValues((old) => ({
          chequeDetails: [...initVal],
        }));
      }
    }
  };
  // if (ChequeDetailFormMetaData.form.label) {
  //   ChequeDetailFormMetaData.form.label = `Cheque Detail ${
  //     formMode === "new"
  //       ? `Slip Amount: ${totalAmountSlip ?? ""} Cheque Amount: ${
  //           totalAmountCheque ?? "0.00"
  //         }`
  //       : `Slip Amount: ${
  //           retrievData?.SLIP_DETAIL?.AMOUNT ?? ""
  //         } Cheque Amount: ${cheueTotalAmount ?? "0.00"}`
  //   }`;
  // }

  return (
    <>
      <div
        onKeyDown={(e) => {
          let target: any = e?.target;
          if (e.key === "Enter") {
            const charAtIndex = target.name.split("").find((char, index) => {
              return index === 39;
            });
            if (
              (target?.name ?? "") ===
              ChequeDetailFormMetaData.form.name +
                "/" +
                ChequeDetailFormMetaData.fields[0].name +
                `[${charAtIndex}]` +
                ".AMOUNT"
            ) {
              // ChequeDetailFormMetaData.fields[0]._fields[0].isFieldFocused =
              //   true;
              ClickEventManage();
            }
          }

          // else if (e.key === "F11") {
          //   e.preventDefault();
          //   handleKeyPress();
          // }
        }}
      >
        {formMode === "new" ? (
          <FormWrapper
            key={`ChequeDetailFormMetaData11${formMode}${formData}${isSlipJointDetail}${initValues}${initValues.chequeDetails.length}${setInitValues}`}
            // metaData={ChequeDetailFormMetaData as MetaDataType}
            metaData={
              extractMetaData(
                ChequeDetailFormMetaData,
                formMode
              ) as MetaDataType
            }
            displayMode={formMode}
            onSubmitHandler={onSubmitHandlerCheuq}
            initialValues={initValues}
            // hideHeader={true}
            formStyle={{
              background: "white",
              height: "65%",
            }}
            setDataOnFieldChange={(action, paylod) => {
              if (action === "MESSAGE") {
                if (paylod) {
                  setIsOpenSave(true);
                }
              }
            }}
            onFormButtonClickHandel={() => {
              setIsOpenSave(true);
            }}
            ref={myChequeRef}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                {gridData?.ACCT_JOIN_DETAILS &&
                gridData?.ACCT_JOIN_DETAILS.length ? (
                  <GradientButton
                    onClick={() => {
                      setIsOpenJointDetail(true);
                    }}
                  >
                    Joint Detail
                  </GradientButton>
                ) : null}
              </>
            )}
          </FormWrapper>
        ) : formMode === "view" ? (
          <>
            {loading ? (
              <LoaderPaperComponent />
            ) : error ? (
              <Alert
                severity="error"
                errorMsg={error?.error_msg ?? "Error"}
                errorDetail={error?.error_detail ?? ""}
                color="error"
              />
            ) : (
              <FormWrapper
                key={`ChequeDetailFormMetaData11${formMode}${formData}${initValues}${initValues.chequeDetails.length}${setInitValues}`}
                // metaData={ChequeDetailFormMetaData as MetaDataType}
                metaData={
                  extractMetaData(
                    ChequeDetailFormMetaData,
                    formMode
                  ) as MetaDataType
                }
                displayMode={formMode}
                onSubmitHandler={onSubmitHandlerCheuq}
                initialValues={{
                  chequeDetails: retrievData?.CHEQUE_DETAIL ?? "",
                }}
                // hideHeader={true}
                formStyle={{
                  background: "white",
                  // height: "65%",
                }}
                onFormButtonClickHandel={() => {
                  setIsOpenSave(true);
                }}
                ref={myChequeRef}
              >
                {({ isSubmitting, handleSubmit }) => (
                  <>
                    {gridData?.ACCT_JOIN_DETAILS &&
                    gridData?.ACCT_JOIN_DETAILS.length ? (
                      <GradientButton
                        onClick={() => {
                          setIsOpenJointDetail(true);
                        }}
                      >
                        Joint Detail
                      </GradientButton>
                    ) : null}
                  </>
                )}
              </FormWrapper>
            )}
          </>
        ) : null}
      </div>
      {isOpenJointDetail ? (
        <Dialog
          open={true}
          //@ts-ignore
          TransitionComponent={Transition}
          PaperProps={{
            style: {
              width: "60%",
            },
          }}
          maxWidth="lg"
          // classes={{
          //   scrollPaper: classes.topScrollPaper,
          //   paperScrollBody: classes.topPaperScrollBody,
          // }}
        >
          <GridWrapper
            key={"SlipJoinDetailGridMetaData" + gridData}
            finalMetaData={SlipJoinDetailGridMetaData}
            data={gridData?.ACCT_JOIN_DETAILS ?? []}
            setData={() => null}
            // loading={isLoading || isFetching}
            actions={actions}
            setAction={setCurrentAction}
            // refetchData={() => refetch()}
            // ref={myGridRef}
            // defaultSortOrder={[{ id: "TRAN_CD", desc: false }]}
          />
        </Dialog>
      ) : null}

      {isOpenSave ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Are You sure To Add Bank?"
          onActionYes={() => setisBankAdding(true)}
          onActionNo={() => setIsOpenSave(false)}
          rows={{}}
          open={isOpenSave}
          // loading={mutation.isLoading}
        />
      ) : null}
      {isBankAdding ? (
        <ClearingBankMaster
          isOpen={isBankAdding}
          onClose={() => {
            setisBankAdding(false);
            setIsOpenSave(false);
          }}
        />
      ) : null}
      {isOpenProcced ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message=" Procced ?"
          onActionYes={(rowVal) => onPopupYes(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={isErrorFuncRef.current}
          open={isOpenProcced}
          loading={mutationOutward.isLoading}
        />
      ) : null}
    </>
  );
};
