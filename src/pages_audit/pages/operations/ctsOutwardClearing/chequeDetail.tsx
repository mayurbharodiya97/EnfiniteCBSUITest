import { Transition } from "pages_audit/common";
import { Alert } from "components/common/alert";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { FC, useEffect, useRef, useState, useContext } from "react";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { queryClient, ClearCacheContext } from "cache";
import { useSnackbar } from "notistack";
import {
  CreateDetailsRequestData,
  ProcessDetailsData,
  utilFunction,
} from "components/utils";
import {
  ChequeDetailFormMetaData,
  CtsOutwardClearingMetadata,
  SlipDetailFormMetaData,
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

export const ChequeDetailForm: FC<{
  zoneData?: any;
  formDataRef?: any;
  myRef?: any;
  setCurrentTab?: any;
  formMode?: any;
  gridData?: any;
  slipJointDetailRef?: any;
  retrievData?: any;
  loading?: Boolean;
  error?: any;
}> = ({
  zoneData,
  formDataRef,
  setCurrentTab,
  myRef,
  formMode,
  gridData,
  slipJointDetailRef,
  retrievData,
  loading,
  error,
}) => {
  const { authState } = useContext(AuthContext);
  const myChequeRef = useRef<any>(null);
  const [isBankAdding, setisBankAdding] = useState<any>(false);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const [isOpenProcced, setIsOpenProcced] = useState(false);
  const isErrorFuncRef = useRef<any>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [totalAmountCheque, setTotalAmountCheque] = useState<any>();
  const [initValues, setInitValues] = useState<any>({
    chequeDetails: [
      {
        ECS_SEQ_NO: "",
      },
    ],
  });

  const [totalAmountSlip, setTotalAmountSlip] = useState(
    Number(formDataRef.current.AMOUNT)
  );

  const mutationOutward = useMutation(API.outwardClearingConfigDML, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      if (isErrorFuncRef.current == null) {
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
      } else {
        isErrorFuncRef.current?.endSubmit(
          false,
          errorMsg,
          error?.error_detail ?? ""
        );
      }
      onActionCancel();
    },
    onSuccess: (data) => {
      console.log("data", data);
      enqueueSnackbar(data, {
        variant: "success",
      });

      setCurrentTab("slipdetail");
      formDataRef.current = {};
      formDataRef.current.ACCT_NAME = "";
      formDataRef.current.TRAN_BAL = "";
      gridData.ACCT_JOIN_DETAILS = [];
      onActionCancel();
    },
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
  };
  useEffect(() => {
    setTotalAmountSlip(formDataRef.current.AMOUNT ?? "0.00");
    myRef.current = zoneData;
  }, [formDataRef.current.AMOUNT, zoneData]);

  useEffect(() => {
    // if (formDataRef.current && formDataRef.current.length) {
    // Check if mutationOutward is successful
    const shouldResetValues = mutationOutward.isSuccess;

    let init = initValues.chequeDetails;
    // init[0] = {
    //   ECS_SEQ_NO: formDataRef.current?.ACCT_CD ?? "",
    // };
    // init[0] = {
    //   ECS_USER_NO:
    //     formDataRef.current?.ACCT_NAME ||
    //     (slipJointDetailRef?.current.length ? slipJointDetailRef.current : ""),
    // };

    if (formDataRef.current) {
      init[0] = {
        ECS_USER_NO: formDataRef.current?.ACCT_NAME ?? "",
        ECS_SEQ_NO: formDataRef.current?.ACCT_CD ?? "",
      };
    }
    if (slipJointDetailRef?.current.length) {
      init[0] = {
        ECS_USER_NO: slipJointDetailRef?.current,
        ECS_SEQ_NO: formDataRef.current?.ACCT_CD ?? "",
      };
    }
    // Update the form data with the new values
    setInitValues((old) => ({
      ...old,
      chequeDetails: [...init],
    }));
    // }
  }, [
    formDataRef.current,
    mutationOutward.isSuccess,
    slipJointDetailRef?.current,
  ]);

  const onSubmitHandlerCheuq: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    value
  ) => {
    //@ts-ignore
    endSubmit(true, "Please enter any value");
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
      setTotalAmountSlip(totalAmount - formDataRef.current.AMOUNT);
      // Compare the totals
      let initVal = data.chequeDetails;
      if (
        !formDataRef.current.AMOUNT ||
        formDataRef.current.AMOUNT.length === 0
      ) {
        // Do not add a new row if AMOUNT is not present or has a length of 0
        return;
      }
      if (
        totalAmount === 0 ||
        Number(totalAmount) > Number(formDataRef.current.AMOUNT)
      ) {
        return;
      }
      if (Number(totalAmount) === Number(formDataRef.current.AMOUNT)) {
        // Totals don't match, add a new rows

        isErrorFuncRef.current = {
          DAILY_CLEARING: {
            ...myRef.current,
          },
          DETAILS_DATA: {
            isNewRow: [...newData],
            isUpdatedRow: [],
            isDeleteRow: [],
          },
          ...formDataRef.current,
          endSubmit,
          setFieldError,
        };
        setIsOpenProcced(true);
        console.log("isErrorFuncRef.current", isErrorFuncRef.current);
        // return;
        ChequeDetailFormMetaData.fields[0]._fields[0].isFieldFocused = true;
      } else {
        ChequeDetailFormMetaData.fields[0]._fields[0].isFieldFocused = true;
        initVal.push({
          ECS_SEQ_NO: "",
        });

        setInitValues(
          (old) => (
            console.log("old", old, initVal),
            {
              chequeDetails: [...initVal],
            }
          )
        );

        ChequeDetailFormMetaData.fields[0].isRemoveButton = false;
      }
    }
  };
  console.log(
    ":",
    (ChequeDetailFormMetaData.fields[0]._fields[0].isFieldFocused = true)
  );
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
              ChequeDetailFormMetaData.fields[0]._fields[0].isFieldFocused =
                true;
              ClickEventManage();
            }
          }

          // else if (e.key === "F11") {
          //   e.preventDefault();
          //   handleKeyPress();
          // }
        }}
      >
        <>
          {mutationOutward?.isError || mutationOutward?.isError ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={
                    mutationOutward?.error?.error_msg ??
                    mutationOutward?.error?.error_msg ??
                    "Unknow Error"
                  }
                  errorDetail={
                    mutationOutward?.error?.error_detail ??
                    mutationOutward?.error?.error_detail ??
                    ""
                  }
                  color="error"
                />
              </AppBar>
            </div>
          ) : mutationOutward?.data?.length < 1 &&
            Boolean(mutationOutward?.isSuccess) ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  errorMsg="No data found"
                  errorDetail="No any data found"
                  severity="error"
                />
              </AppBar>
            </div>
          ) : null}
        </>{" "}
        <div
          style={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          <Toolbar
            sx={{
              background: "var(--theme-color5)",
              fontSize: "16px",
              color: "white",
              border: "1px solid #BABABA",
              borderRadius: "5px",
              width: "25%",
              minHeight: "30px !important ",
            }}
          >
            {`Slip Amount: ${totalAmountSlip ?? ""} `}
          </Toolbar>
          <Toolbar
            sx={{
              background: "var(--theme-color5)",
              fontSize: "16px",
              color: "white",
              border: "1px solid #BABABA",
              borderRadius: "5px",
              width: "25%",
              minHeight: "30px !important ",
            }}
          >
            {`Cheque Amount: ${totalAmountCheque ?? ""} `}
          </Toolbar>
        </div>
        {formMode === "new" ? (
          <FormWrapper
            key={`ChequeDetailFormMetaData11${formDataRef.current}${initValues}${initValues.chequeDetails.length}${setInitValues}`}
            metaData={ChequeDetailFormMetaData as MetaDataType}
            displayMode={formMode}
            onSubmitHandler={onSubmitHandlerCheuq}
            initialValues={initValues}
            hideHeader={true}
            formStyle={{
              background: "white",
              // height: "65%",
            }}
            onFormButtonClickHandel={() => {
              setIsOpenSave(true);
            }}
            ref={myChequeRef}
          />
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
                key={`ChequeDetailFormMetaData11${formDataRef.current}${initValues}${initValues.chequeDetails.length}${setInitValues}`}
                metaData={ChequeDetailFormMetaData as MetaDataType}
                displayMode={formMode}
                onSubmitHandler={onSubmitHandlerCheuq}
                initialValues={{
                  chequeDetails: retrievData?.CHEQUE_DETAIL ?? "",
                }}
                hideHeader={true}
                formStyle={{
                  background: "white",
                  // height: "65%",
                }}
                onFormButtonClickHandel={() => {
                  setIsOpenSave(true);
                }}
                ref={myChequeRef}
              />
            )}
          </>
        ) : null}
      </div>
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
