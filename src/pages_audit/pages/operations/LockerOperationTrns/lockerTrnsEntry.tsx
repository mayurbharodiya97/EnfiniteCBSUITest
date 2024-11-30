import {
  ClearCacheProvider,
  extractMetaData,
  FormWrapper,
  MetaDataType,
  SubmitFnType,
  usePopupContext,
} from "@acuteinfo/common-base";
import { Fragment } from "react/jsx-runtime";
import { lockerTrnsEntryFormMetadata } from "./formMetaData";
import { useContext, useRef, useState } from "react";
import { dataContext } from "./lockerOperationTrns";
import PhotoSignWithHistory from "components/common/custom/photoSignWithHistory/photoSignWithHistory";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import * as API from "./api";
import { t } from "i18next";
import { AuthContext } from "pages_audit/auth";
import { RecieptPrint } from "./recieptPrint";
const LockerTrnsEntryForm = () => {
  const [formMode, setFormMode] = useState("add");
  const { authState } = useContext(AuthContext);
  const { saveData, payload } = useContext(dataContext);
  const formRef = useRef<any>(null);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [isPhotoSign, setIsPhotoSign] = useState(false);
  const [receiptPrint, setReceiptPrint] = useState(false);
  const formData = useRef<any>(payload);

  const saveOperationMutation = useMutation(
    API.getLockerOperationDDWdata,

    {
      onError: (error: any) => {
        let errorMsg = t("Unknownerroroccured");
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        CloseMessageBox();
      },
      onSuccess: async (data) => {
        let buttonName = await MessageBox({
          messageTitle: "Print",
          message: t("receiptPrintCnfmMsg"),
          buttonNames: ["Yes", "No"],
          icon: "CONFIRM",
        });
        if (buttonName === "Yes") {
          setReceiptPrint(true);
        }
        enqueueSnackbar(t("RecordInsertedMsg"), {
          variant: "success",
        });
        CloseMessageBox();
      },
    }
  );

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    endSubmit(true);

    const reqData = {
      ACCT_CD: data?.MAIN_ACCT_CD ?? "",
      ACCT_TYPE: data?.MAIN_ACCT_TYPE ?? "",
      ACCT_NM: data.ACCT_NM ?? "",
      BRANCH_CD: authState?.user?.branchCode,
      COMP_CD: authState?.companyID,
      CHEQUE_NO: data?.CHEQUE_NO ? data?.CHEQUE_NO : "",
      CHRG_AMT: data?.CHRG_AMT ? data?.CHRG_AMT : "",
      CL_TIME: data?.CL_TIME,
      ST_TIME: data?.ST_TIME,
      CUST_SIGNATURE: "",
      EMP_ID: data?.EMP_ID,
      LOCKER_NO: data?.LOCKER_NO_,
      LOC_SIZE_CD: data?.LOC_SIZE_CD,
      OPER_STATUS: data?.OPER_STATUS,
      REMARKS: data?.REMARKS,
      SERVICE_TAX: data?.SERVICE_CHRGE_AUTO,
      TRN_ACCT_CD: data?.TRF_ACCT_CD ? data?.TRF_ACCT_CD : "",
      TRN_ACCT_TYPE: data?.TRF_ACCT_TYPE ? data?.TRF_ACCT_TYPE : "",
      TRN_BRANCH_CD: data?.TRF_BRANCH_CD ? data?.TRF_BRANCH_CD : "",
      TRN_COMP_CD: authState?.companyID,
      TYPE_CD: data?.TRX_CD ? data?.TRX_CD : "",
    };
    console.log(reqData);
    saveOperationMutation.mutate({ ...data });
  };
  return (
    <Fragment>
      <FormWrapper
        key={"bankifsccodeMasterForm"}
        metaData={
          extractMetaData(lockerTrnsEntryFormMetadata, formMode) as MetaDataType
        }
        initialValues={{}}
        hideHeader={true}
        displayMode={formMode}
        setDataOnFieldChange={(action, payload) => {
          if (action === "VIEWMST_PAYLOAD") {
            saveData(payload);
          }
        }}
        formState={{
          MessageBox: MessageBox,
          Mode: formMode,
          refId: formRef,
        }}
        onFormButtonClickHandel={(id) => {
          if (id === "SIGN") {
            setIsPhotoSign(true);
          }
        }}
        onSubmitHandler={onSubmitHandler}
        formStyle={{
          background: "white",
          height: "auto",
        }}
        ref={formRef}
      ></FormWrapper>
      {receiptPrint ? (
        <>
          <RecieptPrint
            cardData={{}}
            close={() => {
              setReceiptPrint(false);
            }}
          />
        </>
      ) : null}
      {isPhotoSign ? (
        <>
          <div style={{ paddingTop: 10 }}>
            <PhotoSignWithHistory
              data={[
                {
                  ACCT_CD: payload?.ACCT_CD,
                  ACCT_TYPE: payload?.ACCT_TYPE,
                },
              ]}
              onClose={() => {
                setIsPhotoSign(false);
              }}
              screenRef={"RPT/049"}
            />
          </div>
        </>
      ) : null}
    </Fragment>
  );
};
export const LockerTrnsEntry = () => {
  return (
    <Fragment>
      <ClearCacheProvider>
        <LockerTrnsEntryForm />
      </ClearCacheProvider>
    </Fragment>
  );
};
