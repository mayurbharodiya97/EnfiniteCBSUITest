import { FC, useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQueries, useQuery } from "react-query";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Dialog from "@mui/material/Dialog";
import { GradientButton } from "components/styledComponent/button";
import * as API from "../api";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { chequeReturnPostFormMetaData } from "./metaData";
import { format } from "date-fns";
import { ChequeSignImage } from "./chequeSignImage";
import { usePopupContext } from "components/custom/popupContext";
import { SubmitFnType } from "packages/form";
import { queryClient } from "cache";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Alert } from "components/common/alert";
import { AuthContext } from "pages_audit/auth";
import { useSnackbar } from "notistack";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { PositivePayFormWrapper } from "./positvePayForm";
import { CircularProgress } from "@mui/material";
import { utilFunction } from "components/utils";
import RecordDialog from "pages_audit/pages/transactionSummeryCard/imagecarousel";

export const ChequeReturnPostForm: FC<{
  onClose?: any;
  inwardData?: any;
  isDataChangedRef?: any;
}> = ({ onClose, inwardData, isDataChangedRef }) => {
  const formRef = useRef<any>(null);
  const { MessageBox } = usePopupContext();
  const { enqueueSnackbar } = useSnackbar();
  const [isOpenSave, setIsOpenSave] = useState(false);
  const [messageData, setMessageData] = useState<any>();
  const [acImageData, setAcImageData] = useState<any>(null);
  const [isPositivePay, setIsPositvePay] = useState(false);

  const result: any = useQueries([
    {
      queryKey: ["getInwardChequeSignFormData"],
      queryFn: () =>
        API.getInwardChequeSignFormData({
          COMP_CD: inwardData.current?.COMP_CD,
          ENTERED_COMP_CD: inwardData.current?.ENTERED_COMP_CD,
          ENTERED_BRANCH_CD: inwardData.current?.ENTERED_BRANCH_CD,
          BRANCH_CD: inwardData.current?.BRANCH_CD,
          ACCT_TYPE: inwardData.current?.ACCT_TYPE,
          ACCT_CD: inwardData.current?.ACCT_CD,
          DAILY_TRN_CD: inwardData.current?.DAILY_TRN_CD,
          TRAN_CD: inwardData.current?.TRAN_CD,
          TRAN_DT: inwardData.current?.TRAN_DT,
          TRAN_FLAG: "E",
          WITH_SIGN: "Y",
          ENTERED_BY: inwardData.current?.ENTERED_BY,
        }),
    },
    // {
    //   queryKey: ["getBussinessDate"],
    //   queryFn: () => API.getBussinessDate(),
    // },
  ]);
  // let errorMsg = `${result[1].error?.error_msg}`;
  // errorMsg = Boolean(errorMsg.trim()) ? errorMsg : "Unknown error occured";
  // //@ts-ignore
  // let error_detail = `${result[1]?.error?.error_detail}`;

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getInwardChequeSignFormData"]);
    };
  }, []);
  const viewDetailValidatePostData: any = useMutation(API.validatePost, {
    onSuccess: (data, variables) => {
      let apiReq = {
        ...variables,
        action: "P",
      };
      if (data?.[0]?.O_STATUS === "0") {
        setMessageData({
          messageTitle: "Validation Successful",
          message: "Are you sure to post this Cheque??",
          apiReq: apiReq,
        });
        setIsOpenSave(true);
      } else if (data?.[0]?.O_STATUS === "9") {
        MessageBox({
          messageTitle: "Validation Alert",
          message: data?.[0]?.O_MESSAGE,
        });
      } else if (data?.[0]?.O_STATUS === "99") {
        setMessageData({
          messageTitle: "Are you sure do you want to continue?",
          message: data?.[0]?.O_MESSAGE,
          apiReq: apiReq,
        });
        setIsOpenSave(true);
      } else if (data?.[0]?.O_STATUS === "999") {
        MessageBox({
          messageTitle: "Validation Failed",
          message: data?.[0]?.O_MESSAGE,
        });
      }
    },
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },
  });
  const viewDetailValidateReturnData: any = useMutation(API.validateReturn, {
    onSuccess: async (data, variables) => {
      let apiReq = {
        ...variables,
        action: "RETURN",
      };

      if (data?.[0]?.O_STATUS === "0" && data?.[0]?.O_MESSAGE) {
        setMessageData({
          messageTitle: "Validation Successful",
          message: "Are you sure to return this Cheque??",
          apiReq: apiReq,
        });
        setIsOpenSave(true);
      } else if (data?.[0]?.O_STATUS === "999" && data?.[0]?.O_MESSAGE) {
        MessageBox({
          messageTitle: "Validation Failed",
          message: data?.[0]?.O_MESSAGE,
        });
      }
    },
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },
  });

  const postConfigDML: any = useMutation(API.postConfigDML, {
    onSuccess: (data, variables) => {
      // enqueueSnackbar(data, { variant: "success" });
      MessageBox({
        messageTitle: "Success",
        message: data,
      });
      isDataChangedRef.current = true;
      onClose();
    },

    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },
  });
  const returnConfigDML: any = useMutation(API.returnConfigDML, {
    onSuccess: (data, variables) => {
      enqueueSnackbar(data, { variant: "success" });
      isDataChangedRef.current = true;
      onClose();
    },

    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },
  });

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    endSubmit(true);
    if (actionFlag === "Save") {
      const oldData = {
        COMP_CD: inwardData.current?.COMP_CD ?? "",
        BRANCH_CD: inwardData.current?.BRANCH_CD ?? "",
        ACCT_TYPE: inwardData.current?.ACCT_TYPE ?? "",
        ACCT_CD: inwardData.current?.ACCT_CD ?? "",
        CHEQUE_NO: inwardData.current?.CHEQUE_NO ?? "",
        TRAN_CD: inwardData.current?.TRAN_CD,
        MICR_TRAN_CD: inwardData.current?.MICR_TRAN_CD ?? "",
        CHEQUE_DT: inwardData.current?.CHEQUE_DT
          ? format(new Date(inwardData.current?.["CHEQUE_DT"]), "dd/MMM/yyyy")
          : "",
      };
      const newData = {
        COMP_CD: inwardData.current?.COMP_CD ?? "",
        BRANCH_CD: data?.BRANCH_CD ?? "",
        ACCT_TYPE: data?.ACCT_TYPE ?? "",
        ACCT_CD: data?.ACCT_CD ?? "",
        CHEQUE_NO: data?.CHEQUE_NO ?? "",
        TRAN_CD: inwardData.current?.TRAN_CD,
        MICR_TRAN_CD: data?.MICR_TRAN_CD ?? "",
        CHEQUE_DT: data?.CHEQUE_DT
          ? format(new Date(data["CHEQUE_DT"]), "dd/MMM/yyyy")
          : "",
      };

      let upd: any = utilFunction.transformDetailsData(newData ?? {}, oldData);
      if (upd?._UPDATEDCOLUMNS?.length > 0) {
        const updateData = {
          ...newData,
          ...upd,
          _isNewRow: false,
        };
        endSubmit(true);
        postConfigDML.mutate(updateData);
      }
    } else if (actionFlag === "POST") {
      endSubmit(true);
      viewDetailValidatePostData.mutate({
        COMP_CD: inwardData.current?.COMP_CD ?? "",
        BRANCH_CD: data?.BRANCH_CD ?? "",
        ACCT_TYPE: data?.ACCT_TYPE ?? "",
        ACCT_CD: data?.ACCT_CD ?? "",
        ERROR_STATUS: inwardData.current?.ERR_STATUS ?? "",
        SCREEN_REF: "TRN/650",
        ENTERED_BY: inwardData.current?.ENTERED_BY ?? "",
        ENTERED_BRANCH_CD: inwardData.current?.ENTERED_BRANCH_CD ?? "",
        REMARKS: data?.REMARKS ?? "",
        CHEQUE_DT: data?.CHEQUE_DT
          ? format(new Date(data["CHEQUE_DT"]), "dd/MMM/yyyy")
          : "", //data?.CHEQUE_DT,
        CHEQUE_NO: data?.CHEQUE_NO ?? "",
        AMOUNT: data?.AMOUNT ?? "",
        TRAN_CD: inwardData.current?.TRAN_CD,
        MICR_TRAN_CD: data?.MICR_TRAN_CD ?? "",
      });
    } else if (actionFlag === "RETURN") {
      viewDetailValidateReturnData.mutate({
        COMP_CD: inwardData.current?.COMP_CD ?? "",
        BRANCH_CD: data?.BRANCH_CD ?? "",
        ACCT_TYPE: data?.ACCT_TYPE ?? "",
        ACCT_CD: data?.ACCT_CD ?? "",
        CHEQUE_NO: data?.CHEQUE_NO ?? "",
        CHEQUE_DT: data?.CHEQUE_DT
          ? format(new Date(data["CHEQUE_DT"]), "dd/MMM/yyyy")
          : "",
        TRAN_CD: inwardData.current?.TRAN_CD,
        RET_COMP_CD: inwardData.current?.RET_COMP_CD,
        ENTERED_BRANCH_CD: inwardData.current?.ENTERED_BRANCH_CD,
        ENTERED_BY: inwardData.current?.ENTERED_BY,
        LAST_MACHINE_NM: inwardData.current?.LAST_MACHINE_NM,
        REASON_CD: data?.REASON_CD ?? "",
        REASON: data?.REASON ?? "",
        ZONE_CD: data?.ZONE_CD ?? "",
        REMARKS: data?.REMARKS ?? "",
        RET_BRANCH_CD: data?.RET_BRANCH_CD ?? "",
        RET_ACCT_TYPE: data?.RET_ACCT_TYPE ?? "",
        RET_ACCT_CD: data?.RET_ACCT_CD ?? "",
      });
    }
  };

  return (
    <>
      {/* {result?.[1]?.isLoading || result?.[1]?.isFetching ? (
        <LoaderPaperComponent />
      ) : result[1].isError ? (
        <Alert
          severity="error"
          errorMsg={errorMsg}
          errorDetail={error_detail ?? ""}
        />
      ) : ( */}
      <>
        <FormWrapper
          key={`chequeReturnPost`}
          metaData={chequeReturnPostFormMetaData as unknown as MetaDataType}
          initialValues={inwardData.current}
          // initialValues={inwardData.current?.data[currentRecordIndex]}
          // initialValues={{
          //   ...inwardData.current,
          //   RANGE_DATE: result?.[1]?.data?.[0]?.RANGE_DATE ?? "",
          //   TRAN_DATE: result?.[1]?.data?.[0]?.TRAN_DATE ?? "",
          // }}
          onSubmitHandler={onSubmitHandler}
          formStyle={{
            background: "white",
          }}
          onFormButtonClickHandel={(id) => {
            if (id === "POST") {
              let event: any = { preventDefault: () => {} };
              formRef?.current?.handleSubmit(event, "POST");
            } else if (id === "RETURN") {
              let event: any = { preventDefault: () => {} };
              formRef?.current?.handleSubmit(event, "RETURN");
            } else if (id === "POSITIVE_PAY") {
              setIsPositvePay(true);
            }
          }}
          formState={{
            MessageBox: MessageBox,
          }}
          ref={formRef}
          setDataOnFieldChange={(action, payload) => {
            if (action === "ACCT_CD_VALID") {
              setAcImageData(payload?.[0]?.SIGN_IMG);
            } else if (action === "ACCT_CD_BLANK") {
              setAcImageData("");
            }
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <GradientButton
                onClick={(event) => {
                  handleSubmit(event, "Save");
                }}
                disabled={isSubmitting}
                endIcon={
                  postConfigDML.isLoading ? (
                    <CircularProgress size={20} />
                  ) : null
                }
                color={"primary"}
              >
                Save & Close
              </GradientButton>
              <GradientButton onClick={onClose}>Close</GradientButton>
              {/* <GradientButton onClick={handleNextClick}>Next</GradientButton> */}
            </>
          )}
        </FormWrapper>

        <>
          <ChequeSignImage
            imgData={result?.[0]?.data}
            loading={result[0].isLoading || result[0].isFetching}
            error={result[0].isError}
            acSignImage={acImageData}
          />
        </>

        <>
          {isOpenSave && (
            <PopupMessageAPIWrapper
              MessageTitle={messageData.messageTitle}
              Message={messageData.message}
              onActionYes={() => {
                if (messageData?.apiReq?.action === "P") {
                  const oldData = {
                    COMP_CD: inwardData.current?.COMP_CD ?? "",
                    BRANCH_CD: inwardData.current?.BRANCH_CD ?? "",
                    ACCT_TYPE: inwardData.current?.ACCT_TYPE ?? "",
                    ACCT_CD: inwardData.current?.ACCT_CD ?? "",
                    CHEQUE_NO: inwardData.current?.CHEQUE_NO ?? "",
                    DRAFT_DIV: inwardData.current?.DRAFT_DIV ?? "",
                    TRAN_CD: inwardData.current?.TRAN_CD,
                    MICR_TRAN_CD: inwardData.current?.MICR_TRAN_CD ?? "",
                    CHEQUE_DT:
                      format(
                        new Date(inwardData.current?.["CHEQUE_DT"]),
                        "dd/MMM/yyyy "
                      ) ?? "",
                  };
                  const newData = {
                    COMP_CD: inwardData.current?.COMP_CD ?? "",
                    BRANCH_CD: messageData?.apiReq?.BRANCH_CD ?? "",
                    ACCT_TYPE: messageData?.apiReq?.ACCT_TYPE ?? "",
                    ACCT_CD: messageData?.apiReq?.ACCT_CD ?? "",
                    CHEQUE_NO: messageData?.apiReq?.CHEQUE_NO ?? "",
                    TRAN_CD: inwardData.current?.TRAN_CD,
                    MICR_TRAN_CD: messageData?.apiReq?.MICR_TRAN_CD ?? "",
                    CHEQUE_DT:
                      format(
                        new Date(messageData?.apiReq["CHEQUE_DT"]),
                        "dd/MMM/yyyy "
                      ) ?? "",
                  };

                  let upd: any = utilFunction.transformDetailsData(
                    newData ?? {},
                    oldData
                  );
                  postConfigDML.mutate({
                    ...newData,
                    ...upd,
                    _isNewRow: true,
                  });
                } else {
                  const oldData = {
                    TRAN_CD: inwardData.current?.TRAN_CD,
                    COMP_CD: inwardData.current?.COMP_CD,
                    BRANCH_CD: inwardData.current?.BRANCH_CD,
                    RET_BRANCH_CD: inwardData.current?.RET_BRANCH_CD,
                    RET_COMP_CD: inwardData.current?.RET_COMP_CD,
                    RET_ACCT_TYPE: inwardData.current?.RET_ACCT_TYPE,
                    RET_ACCT_CD: inwardData.current?.RET_ACCT_CD,
                    ENTERED_BRANCH_CD: inwardData.current?.ENTERED_BRANCH_CD,
                    CHEQUE_DT: inwardData.current?.CHEQUE_DT,
                    CHEQUE_NO: inwardData.current?.CHEQUE_NO,
                    ZONE_CD: inwardData.current?.ZONE_CD,
                    REASON: inwardData.current?.REASON,
                    REASON_CD: inwardData.current?.REASON_CD,
                  };

                  const newData = {
                    TRAN_CD: inwardData.current?.TRAN_CD,
                    COMP_CD: inwardData.current?.COMP_CD,
                    BRANCH_CD: inwardData.current?.BRANCH_CD,
                    RET_BRANCH_CD: messageData?.apiReq?.RET_BRANCH_CD,
                    RET_ACCT_TYPE: messageData?.apiReq?.RET_ACCT_TYPE,
                    RET_ACCT_CD: messageData?.apiReq?.RET_ACCT_CD,
                    RET_COMP_CD: inwardData.current?.RET_COMP_CD,
                    ENTERED_BRANCH_CD: inwardData.current?.ENTERED_BRANCH_CD,
                    CHEQUE_DT: messageData?.apiReq?.CHEQUE_DT,
                    CHEQUE_NO: messageData?.apiReq?.CHEQUE_NO,
                    ZONE_CD: messageData?.apiReq?.ZONE_CD,
                    REASON: messageData?.apiReq?.REASON,
                    REASON_CD: messageData?.apiReq?.REASON_CD,
                  };
                  let upd: any = utilFunction.transformDetailsData(
                    newData ?? {},
                    oldData
                  );
                  returnConfigDML.mutate({
                    ...newData,
                    ...upd,
                  });
                }
              }}
              onActionNo={() => setIsOpenSave(false)}
              rows={[]}
              open={isOpenSave}
              loading={postConfigDML?.isLoading || returnConfigDML?.isLoading}
            />
          )}
        </>
        {isPositivePay ? (
          <PositivePayFormWrapper
            onClose={() => {
              setIsPositvePay(false);
            }}
            positiveData={inwardData.current}
          />
        ) : null}
      </>
      {/* )} */}
    </>
  );
};
export const ChequeReturnPostFormWrapper = ({
  onClose,
  inwardData,
  isDataChangedRef,
}) => {
  return (
    <Dialog
      open={true}
      PaperProps={{
        style: {
          width: "100%",
        },
      }}
      maxWidth="lg"
    >
      <ChequeReturnPostForm
        onClose={onClose}
        inwardData={inwardData}
        isDataChangedRef={isDataChangedRef}
      />
    </Dialog>
  );
};
