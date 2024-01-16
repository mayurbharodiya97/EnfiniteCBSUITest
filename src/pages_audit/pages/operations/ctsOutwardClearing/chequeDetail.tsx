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
  defaultView?: any;
  mutation?: any;
  slipJointDetailRef?: any;
}> = ({
  zoneData,
  formDataRef,
  setCurrentTab,
  myRef,
  defaultView,
  mutation,
  slipJointDetailRef,
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
  console.log("slipJointDetailRef", slipJointDetailRef?.current);
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
      enqueueSnackbar(data, {
        variant: "success",
      });

      setCurrentTab("slipdetail");
      formDataRef.current = {};
      formDataRef.current.ACCT_NAME = [];
      data = {};
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
    console.log(
      "mutation?.data",
      mutation?.data,
      formDataRef.current?.ACCT_NAME
    );
    const shouldResetValues = mutationOutward.isSuccess;

    let init = initValues.chequeDetails;
    init[0] = {
      ECS_SEQ_NO: formDataRef.current?.ACCT_CD ?? "",
    };
    // init[0] = {
    //   ECS_USER_NO:
    //     formDataRef.current?.ACCT_NAME ||
    //     (slipJointDetailRef?.current.length ? slipJointDetailRef.current : ""),
    // };

    if (formDataRef.current) {
      init[0] = {
        ECS_USER_NO: formDataRef.current?.ACCT_NAME ?? "",
      };
    }
    if (slipJointDetailRef?.current.length) {
      init[0] = {
        ECS_USER_NO: slipJointDetailRef?.current,
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
    // slip and cheque total minus
    setTotalAmountSlip(totalAmount - formDataRef.current.AMOUNT);
    if (value === "AMOUNT") {
      // Compare the totals
      let initVal = data.chequeDetails;
      if (
        !formDataRef.current.AMOUNT ||
        formDataRef.current.AMOUNT.length === 0
      ) {
        // Do not add a new row if AMOUNT is not present or has a length of 0
        return;
      }
      if (totalAmount === 0) {
        return;
      }
      if (
        Number(totalAmount) === Number(formDataRef.current.AMOUNT) ||
        Number(totalAmount) > Number(formDataRef.current.AMOUNT)
      ) {
        // Totals don't match, add a new rows
        setIsOpenProcced(true);

        isErrorFuncRef.current = {
          DAILY_CLEARING: {
            ...myRef.current,
          },
          DETAILS_DATA: {
            isNewRow: [
              {
                ...data.chequeDetails,
                PROCESSED: "N",
                REASON: "N",
                COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: authState?.user?.branchCode ?? "",
                _isNewRow: true,
              },
            ],
            isUpdatedRow: [],
            isDeleteRow: [],
          },
          ...formDataRef.current,
          endSubmit,
          setFieldError,
        };

        console.log("isErrorFuncRef.current", isErrorFuncRef.current);
        // return;
      } else {
        initVal.push({
          ECS_SEQ_NO: "",
        });
        setInitValues((old) => ({
          chequeDetails: [...initVal],
        }));
        ChequeDetailFormMetaData.fields[0].isRemoveButton = false;
      }
    }
  };

  return (
    <>
      <div
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (
              ChequeDetailFormMetaData.fields[0]._fields[9].name === "AMOUNT"
            ) {
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
        <FormWrapper
          key={`ChequeDetailFormMetaData11${formDataRef.current}${initValues}${initValues.chequeDetails.length}${setInitValues}`}
          metaData={ChequeDetailFormMetaData as MetaDataType}
          displayMode={defaultView}
          onSubmitHandler={onSubmitHandlerCheuq}
          initialValues={initValues}
          hideHeader={true}
          formStyle={{
            background: "white",
            // height: "65%",
          }}
          ref={myChequeRef}
        />
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
