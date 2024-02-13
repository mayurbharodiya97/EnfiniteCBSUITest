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
import * as API from "./api";
import { useSnackbar } from "notistack";
import { extractMetaData } from "components/utils";
import {
  ChequeDetailFormMetaData,
  ViewChequeDetailFormMetaData,
} from "./metaData";
import {
  PopupMessageAPIWrapper,
  PopupRequestWrapper,
} from "components/custom/popupMessage";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { ClearingBankMaster } from "./clearingBankMaster";
import { GradientButton } from "components/styledComponent/button";
import { IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
export const ChequeDetailForm: FC<{
  isOpenProcced?: any;
  setIsOpenProcced?: any;
  myRef?: any;
  formMode?: any;
  retrievData?: any;
  loading?: Boolean;
  error?: any;
  zoneTranType?: any;
  mutationOutward?: any;
  initValues?: any;
  setInitValues?: any;
  isSlipJointDetail?: any;
  gridData?: any;
  setBankData?: any;
  bankData?: any;
  isSlipTotal?: any;
  formData?: any;
}> = ({
  setIsOpenProcced,
  isOpenProcced,
  myRef,
  formMode,
  retrievData,
  loading,
  error,
  initValues,
  zoneTranType,
  mutationOutward,
  setInitValues,
  gridData,
  isSlipJointDetail,
  isSlipTotal,
  formData,
}) => {
  const { authState } = useContext(AuthContext);
  const myChequeRef = useRef<any>(null);
  const [isBankAdding, setisBankAdding] = useState<any>(false);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const [isAmountMessage, setIsAmountMessage] = useState(false);
  const [isAddCheque, setIsAddCheque] = useState(false);
  const isErrorFuncRef = useRef<any>(null);

  const onPopupYes = (rows) => {
    mutationOutward.mutate(rows);
  };
  console.log("isSlipTotal", isSlipTotal);
  useEffect(() => {
    if (Boolean(gridData?.ACCT_NAME)) {
      setInitValues((old) => ({
        chequeDetails: [
          ...initValues.chequeDetails.map((item) => {
            return {
              ...item,
              ECS_USER_NO: gridData?.ACCT_NAME ?? "",
            };
          }),
        ],
      }));
    }
    if (Boolean(isSlipJointDetail.length)) {
      setInitValues((old) => ({
        chequeDetails: [
          ...initValues.chequeDetails.map((item) => {
            return {
              ...item,
              ECS_USER_NO: isSlipJointDetail ?? "",
            };
          }),
        ],
      }));
    }
  }, [gridData, gridData?.ACCT_NAME, isSlipJointDetail]);

  const onSubmitHandler: SubmitFnType = async (
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

    // if (value === "AMOUNT") {
    let totalAmount = 0;
    data.chequeDetails?.forEach((element) => {
      if (
        element.AMOUNT !== undefined &&
        element.AMOUNT !== "" &&
        element.AMOUNT
      ) {
        totalAmount += Number(element?.AMOUNT);
      }
    });

    let initVal = data.chequeDetails;
    if (!isSlipTotal || isSlipTotal?.length === 0) {
      // Do not add a new row if AMOUNT is not present or has a length of 0
      return;
    }
    if (Number(totalAmount) > Number(isSlipTotal)) {
      setIsAmountMessage(true);

      return;
    }

    if (Number(totalAmount) === Number(isSlipTotal)) {
      // Totals don't match, add a new rows
      setIsAddCheque(false);
      setIsOpenProcced(true);
      console.log(">>formData", formData);
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
      };

      console.log("isErrorFuncRef.current", isErrorFuncRef.current);
      // return;
      //
    } else if (initVal && initVal.length > 0) {
      setIsAddCheque(false);
      console.log("<<if initVal", initVal);
      const lastRow = initVal[initVal.length - 1];
      const newRow = {
        ...lastRow,
        CHEQUE_NO: "",
        AMOUNT: "",
      };

      initVal.unshift(newRow);

      setInitValues((old) => ({
        chequeDetails: [...initVal],
      }));
      ChequeDetailFormMetaData.fields[5].isRemoveButton = false;
    } else {
      console.log("<< else initVal", initVal);
      setInitValues(() => ({
        chequeDetails: [
          {
            CHEQUE_DATE: new Date(),
            ECS_USER_NO: gridData?.ACCT_NAME ?? "",
            CHEQUE_NO: "",
            // other properties of the new row
          },
        ],
      }));
    }
  };
  console.log("isSlipTotal", isSlipTotal);
  return (
    <>
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
              myChequeRef?.current?.handleSubmit(event, "AMOUN");
            }
          }
        }}
      >
        {formMode === "new" ? (
          <FormWrapper
            key={
              `ChequeDetailNew` +
              formMode +
              isSlipTotal +
              JSON.stringify(initValues.chequeDetails)
            }
            metaData={
              extractMetaData(
                ChequeDetailFormMetaData,
                formMode
              ) as MetaDataType
            }
            displayMode={formMode}
            onSubmitHandler={onSubmitHandler}
            initialValues={
              mutationOutward.isSuccess
                ? { chequeDetails: [initValues] }
                : { ...initValues, SLIP_AMOUNT: isSlipTotal }
            }
            // initialValues={initValues}
            hideHeader={true}
            formStyle={
              {
                // background: "white",
                // height: "65%",
              }
            }
            containerstyle={{ padding: "0px !important" }}
            setDataOnFieldChange={(action, paylod) => {
              if (action === "MESSAGE") {
                if (paylod?.[0]?.ERROR_MSSAGE) {
                  setIsOpenSave(true);
                }
              }
            }}
            onFormButtonClickHandel={() => {
              let event: any = { preventDefault: () => {} };
              console.log("<<initValues", initValues);

              myChequeRef?.current?.handleSubmit(event);
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
                key={`ChequeDetailFormMetaData11${formMode}`}
                metaData={
                  extractMetaData(
                    ViewChequeDetailFormMetaData,
                    formMode
                  ) as MetaDataType
                }
                displayMode={formMode}
                onSubmitHandler={onSubmitHandler}
                initialValues={{
                  chequeDetails: retrievData?.CHEQUE_DETAIL ?? "",
                }}
                hideHeader={true}
                formStyle={
                  {
                    // background: "white",
                    // height: "65%",
                  }
                }
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
          // setBankDetail={setBankDetail}
        />
      ) : null}
      {isOpenProcced ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message=" Procced ?"
          onActionYes={(rowVal) => onPopupYes(rowVal)}
          onActionNo={() => setIsOpenProcced(false)}
          rows={isErrorFuncRef.current}
          open={isOpenProcced}
          loading={mutationOutward.isLoading}
        />
      ) : null}
      {isAddCheque ? (
        <PopupMessageAPIWrapper
          MessageTitle="Add Another Cheque "
          Message="Are You Sure to Add Another Cheque ?"
          onActionYes={(rowVal) => rowVal}
          onActionNo={() => setIsAddCheque(false)}
          rows={[]}
          open={isAddCheque}
          // loading={mutationOutward.isLoading}
        />
      ) : null}
      {isAmountMessage ? (
        <PopupRequestWrapper
          MessageTitle="Amount Description"
          Message={"Please Check Amount"}
          onClickButton={(rows, buttonName) => setIsAmountMessage(false)}
          buttonNames={["Ok"]}
          rows={[]}
          open={isAmountMessage}
        />
      ) : null}
    </>
  );
};
