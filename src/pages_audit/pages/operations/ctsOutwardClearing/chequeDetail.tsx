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
import { ChequeDetailFormMetaData } from "./metaData";
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
  formData?: any;
  isOpenProcced?: any;
  setIsOpenProcced?: any;
  myRef?: any;
  formMode?: any;
  totalAmountSlip?: any;
  retrievData?: any;
  loading?: Boolean;
  setFormData?: any;
  error?: any;
  setTotalAmountCheque?: any;
  zoneTranType?: any;
  mutationOutward?: any;
  initValues?: any;
  setInitValues?: any;
  isSlipJointDetail?: any;
  gridData?: any;
  setBankData?: any;
  bankData?: any;
}> = ({
  formData,
  setIsOpenProcced,
  isOpenProcced,
  myRef,
  formMode,
  totalAmountSlip,
  retrievData,
  loading,
  error,
  setFormData,
  initValues,
  zoneTranType,
  mutationOutward,
  setInitValues,
  gridData,
  isSlipJointDetail,
  setBankData,
  bankData,
}) => {
  const { authState } = useContext(AuthContext);
  const myChequeRef = useRef<any>(null);
  const [isBankAdding, setisBankAdding] = useState<any>(false);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const [isAmountMessage, setIsAmountMessage] = useState(false);
  const [isAddCheque, setIsAddCheque] = useState(false);
  const isErrorFuncRef = useRef<any>(null);
  const [totalAmountCheque, setTotalAmountCheque] = useState<any>("0");

  console.log("totalAmountSlip", totalAmountSlip);
  // const [bankDetail, setBankDetail] = useState({});
  let cheueTotalAmount = 0;
  retrievData?.CHEQUE_DETAIL?.forEach((element) => {
    if (
      element.AMOUNT !== undefined &&
      element.AMOUNT !== "" &&
      element.AMOUNT
    ) {
      cheueTotalAmount += Number(element.AMOUNT);
    }
  });
  // console.log("bankDetail", bankDetail);
  const onPopupYes = (rows) => {
    mutationOutward.mutate(rows);

    // setFormMode("new");
  };

  const ClickEventManage = () => {
    let event: any = { preventDefault: () => {} };
    myChequeRef?.current?.handleSubmit(event, "AMOUN");
    myRef?.current?.handleSubmit(event, "AMOUNT");
  };
  // useEffect(() => {
  //   setTotalAmountSlip(formData?.AMOUNT ?? "0.00");
  // }, [formData?.AMOUNT]);
  useEffect(() => {
    let init = initValues.chequeDetails;
    if (gridData) {
      init = init.map((item, index) => ({
        ...item,
        ECS_USER_NO: gridData?.ACCT_NAME ?? item.ECS_USER_NO,
        // ECS_SEQ_NO: gridData?.ACCT_NUMBER ?? item.ECS_SEQ_NO,
      }));
    }

    if (isSlipJointDetail?.length) {
      init.map((item, index) => {
        return (item.ECS_USER_NO = isSlipJointDetail ?? "");
      });
    }
    setInitValues((old) => ({
      ...old,
      chequeDetails: [...init],
    }));
  }, [gridData, setInitValues, isSlipJointDetail]);

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
    // console.log("totalAmount", totalAmount, formData?.AMOUNT);
    // setTotalAmountCheque(Number(totalAmount));
    // // // slip and cheque total minus
    // setTotalAmountSlip(totalAmount - formData?.AMOUNT);
    // // Compare the totals
    let initVal = data.chequeDetails;
    if (!totalAmountSlip || totalAmountSlip?.length === 0) {
      // Do not add a new row if AMOUNT is not present or has a length of 0
      return;
    }
    if (Number(totalAmount) > Number(totalAmountSlip)) {
      setIsAmountMessage(true);

      return;
    }
    console.log("final", Number(totalAmount) === Number(totalAmountSlip));
    if (Number(totalAmount) === Number(totalAmountSlip)) {
      // Totals don't match, add a new rows
      setIsAddCheque(false);
      setIsOpenProcced(true);
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
      // const handleYesAction = (rowVal) => {
      setIsAddCheque(false);
      console.log("initVal if", initVal);
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
      // };
      ChequeDetailFormMetaData.fields[5].isRemoveButton = false;
      // ChequeDetailFormMetaData.fields[2]._fields[0].isFieldFocused = true;
    } else {
      console.log("initVal else", initVal);
      setInitValues(() => ({
        chequeDetails: [
          {
            CHEQUE_DATE: new Date(),
            ECS_USER_NO: gridData?.ACCT_NAME ?? "",
            // other properties of the new row
          },
        ],
      }));
      // ChequeDetailFormMetaData.fields[2]._fields[0].isFieldFocused = true;
    }
  };
  console.log(
    "ChequeDetailFormMetaData.fields[0]",
    ChequeDetailFormMetaData.fields[3]
  );

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
              // ChequeDetailFormMetaData.fields[0]._fields[0].isFieldFocused =
              //   true;
              // setIsAddCheque(true);
              ClickEventManage();
            }
          }
        }}
      >
        {" "}
        {/* <GradientButton onClick={() => {}}>Add New Row</GradientButton> */}
        {/* <GradientButton
          tabIndex={-1}
          onClick={(event) => {
            myChequeRef?.current?.handleSubmit(event);
          }}
          style={{
            marginLeft: "auto",
            display: "flex",
            minWidth: "50px",
            marginTop: "10px ",
            marginRight: "12px",
          }}
        >
          Add New Row
          <AddCircleOutlineIcon style={{ fontSize: "25px" }} />
        </GradientButton> */}
        {formMode === "new" ? (
          <FormWrapper
            key={`ChequeDetailFormMetaData${formMode}${JSON.stringify(
              gridData
            )}${isSlipJointDetail}${totalAmountSlip} ${JSON.stringify(
              initValues.chequeDetails
            )}`}
            // metaData={ChequeDetailFormMetaData as MetaDataType}
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
                : { ...initValues, SLIP_AMOUNT: totalAmountSlip }
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
                // if (paylod?.[0]) {
                //   setBankData(paylod?.[0]);
                // }
              }
              if (action === "TOTAL") {
                console.log("payload", paylod);
              }
              if (action === "FINALAMOUNT") {
                // Assuming payload is an array of numbers
                // const totalSum = paylod.reduce(
                //   (accumulator, currentValue) => accumulator + currentValue,
                //   0
                // );

                setTotalAmountCheque(paylod);
                console.log("<<payload:", paylod);
              }
            }}
            onFormButtonClickHandel={() => {
              let event: any = { preventDefault: () => {} };
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
                key={`ChequeDetailFormMetaData11${formMode}${formData}${initValues}${initValues.chequeDetails.length}${setInitValues}`}
                // metaData={ChequeDetailFormMetaData as MetaDataType}
                metaData={
                  extractMetaData(
                    ChequeDetailFormMetaData,
                    formMode
                  ) as MetaDataType
                }
                displayMode={formMode}
                onSubmitHandler={onSubmitHandler}
                initialValues={{
                  SLIP_AMT: "20000.00",
                  chequeDetails: retrievData?.CHEQUE_DETAIL ?? "",
                }}
                // hideHeader={true}
                formStyle={
                  {
                    // background: "white",
                    // height: "65%",
                  }
                }
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
          onActionYes={(rowVal) => ClickEventManage()}
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
