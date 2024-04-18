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
import { AuthContext } from "pages_audit/auth";
import { useSnackbar } from "notistack";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { PositivePayFormWrapper } from "./positvePayForm";
import { CircularProgress } from "@mui/material";
import { utilFunction } from "components/utils";
import { ShareDividendFormWrapper } from "./shareDividendForm";
import { PopupRequestWrapper } from "components/custom/popupMessage";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Alert } from "components/common/alert";
import { useLocation } from "react-router-dom";
export const ChequeReturnPostForm: FC<{
  onClose?: any;
  inwardGridData?: any;
  isDataChangedRef?: any;
  handlePrev?: any;
  handleNext?: any;
  currentIndex?: number;
  totalData?: number;
}> = ({
  onClose,
  inwardGridData,
  isDataChangedRef,
  handlePrev,
  handleNext,
  currentIndex,
  totalData,
}) => {
  const formRef = useRef<any>(null);
  const { MessageBox } = usePopupContext();
  const { enqueueSnackbar } = useSnackbar();
  const [isOpenSave, setIsOpenSave] = useState(false);
  const [messageData, setMessageData] = useState<any>();
  const [acImageData, setAcImageData] = useState<any>(null);
  const [isDraft, setIsDraft] = useState(false);
  const [isDividend, setIsDividend] = useState(false);
  const [isPositivePay, setIsPositvePay] = useState(false);
  // const [noFlag, setNoFlag] = useState(false);
  const { authState } = useContext(AuthContext);

  const result: any = useQueries([
    {
      queryKey: ["getInwardChequeSignFormData"],
      queryFn: () =>
        API.getInwardChequeSignFormData({
          COMP_CD: inwardGridData?.COMP_CD,
          ENTERED_COMP_CD: inwardGridData?.ENTERED_COMP_CD,
          ENTERED_BRANCH_CD: inwardGridData?.ENTERED_BRANCH_CD,
          BRANCH_CD: inwardGridData?.BRANCH_CD,
          ACCT_TYPE: inwardGridData?.ACCT_TYPE,
          ACCT_CD: inwardGridData?.ACCT_CD,
          DAILY_TRN_CD: inwardGridData?.DAILY_TRN_CD,
          TRAN_CD: inwardGridData?.TRAN_CD,
          TRAN_DT: inwardGridData?.TRAN_DT,
          TRAN_FLAG: "E",
          WITH_SIGN: "Y",
          ENTERED_BY: inwardGridData?.ENTERED_BY,
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
  let errorMsg = `${result[0].error?.error_msg}`;
  errorMsg = Boolean(errorMsg.trim()) ? errorMsg : "Unknown error occured";
  //@ts-ignore
  let error_detail = `${result[0]?.error?.error_detail}`;

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getInwardChequeSignFormData"]);
    };
  }, []);
  const viewDetailValidatePostData: any = useMutation(API.validatePost, {
    onSuccess: (data, variables) => {
      let apiReq = {
        ...variables,
        action: "POST",
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
  const validateConfirmData: any = useMutation(API.validateConfirm, {
    onSuccess: (data, variables) => {
      let apiReq = {
        ...variables,
        action: "CONFIRM",
      };
      if (data?.[0]?.O_STATUS === "0") {
        setMessageData({
          messageTitle: "Validation Successful",
          message:
            "Do you want to allow this transaction - Voucher No." +
            variables?.DAILY_TRN_CD +
            "?",
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
  const postConfigDML: any = useMutation(API.postConfigDML, {
    onSuccess: (data, variables) => {
      // enqueueSnackbar(data, { variant: "success" });
      MessageBox({
        messageTitle: "Success",
        message: data,
      });
      // onClose();
      isDataChangedRef.current = true;
      if (currentIndex && currentIndex !== totalData) handleNext();
      if (typeof onClose === "function") {
        onClose();
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
  const confirmPostedConfigDML: any = useMutation(API.confirmPostedConfigDML, {
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
        COMP_CD: inwardGridData?.COMP_CD ?? "",
        BRANCH_CD: inwardGridData?.BRANCH_CD ?? "",
        ACCT_TYPE: inwardGridData?.ACCT_TYPE ?? "",
        ACCT_CD: inwardGridData?.ACCT_CD ?? "",
        CHEQUE_NO: inwardGridData?.CHEQUE_NO ?? "",
        TRAN_CD: inwardGridData?.TRAN_CD,
        MICR_TRAN_CD: inwardGridData?.MICR_TRAN_CD ?? "",
        CHEQUE_DT: inwardGridData?.CHEQUE_DT
          ? format(new Date(inwardGridData?.["CHEQUE_DT"]), "dd/MMM/yyyy")
          : "",
        DRAFT_DIV: inwardGridData?.DRAFT_DIV,
      };
      const newData = {
        COMP_CD: inwardGridData?.COMP_CD ?? "",
        BRANCH_CD: data?.BRANCH_CD ?? "",
        ACCT_TYPE: data?.ACCT_TYPE ?? "",
        ACCT_CD: data?.ACCT_CD ?? "",
        CHEQUE_NO: data?.CHEQUE_NO ?? "",
        TRAN_CD: inwardGridData?.TRAN_CD,
        MICR_TRAN_CD: data?.MICR_TRAN_CD ?? "",
        CHEQUE_DT: data?.CHEQUE_DT
          ? format(new Date(data["CHEQUE_DT"]), "dd/MMM/yyyy")
          : "",
        DRAFT_DIV: inwardGridData?.DRAFT_DIV,
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
    } else if (actionFlag === "POST" || actionFlag === "NO") {
      endSubmit(true);
      viewDetailValidatePostData.mutate({
        COMP_CD: inwardGridData?.COMP_CD ?? "",
        BRANCH_CD: data?.BRANCH_CD ?? "",
        ACCT_TYPE: data?.ACCT_TYPE ?? "",
        ACCT_CD: data?.ACCT_CD ?? "",
        ERROR_STATUS: inwardGridData?.ERR_STATUS ?? "",
        SCREEN_REF: "TRN/650",
        ENTERED_BY: inwardGridData?.ENTERED_BY ?? "",
        ENTERED_BRANCH_CD: inwardGridData?.ENTERED_BRANCH_CD ?? "",
        REMARKS: data?.REMARKS ?? "",
        CHEQUE_DT: data?.CHEQUE_DT,
        CHEQUE_NO: data?.CHEQUE_NO ?? "",
        AMOUNT: data?.AMOUNT ?? "",
        TRAN_CD: inwardGridData?.TRAN_CD,
        MICR_TRAN_CD: data?.MICR_TRAN_CD ?? "",
      });
    } else if (actionFlag === "RETURN") {
      viewDetailValidateReturnData.mutate({
        COMP_CD: inwardGridData?.COMP_CD ?? "",
        BRANCH_CD: data?.BRANCH_CD ?? "",
        ACCT_TYPE: data?.ACCT_TYPE ?? "",
        ACCT_CD: data?.ACCT_CD ?? "",
        CHEQUE_NO: data?.CHEQUE_NO ?? "",
        CHEQUE_DT: data?.CHEQUE_DT,
        // ? format(new Date(data["CHEQUE_DT"]), "dd/MMM/yyyy")
        // : "",
        TRAN_CD: inwardGridData?.TRAN_CD,
        RET_COMP_CD: inwardGridData?.RET_COMP_CD,
        ENTERED_BRANCH_CD: inwardGridData?.ENTERED_BRANCH_CD,
        ENTERED_BY: inwardGridData?.ENTERED_BY,
        LAST_MACHINE_NM: inwardGridData?.LAST_MACHINE_NM,
        REASON_CD: data?.REASON_CD ?? "",
        REASON: data?.REASON ?? "",
        ZONE_CD: data?.ZONE_CD ?? "",
        REMARKS: data?.REMARKS ?? "",
        RET_BRANCH_CD: data?.RET_BRANCH_CD ?? "",
        RET_ACCT_TYPE: data?.RET_ACCT_TYPE ?? "",
        RET_ACCT_CD: data?.RET_ACCT_CD ?? "",
      });
    } else if (actionFlag === "CONFIRM") {
      validateConfirmData.mutate({
        COMP_CD: inwardGridData?.COMP_CD ?? "",
        BRANCH_CD: data?.BRANCH_CD ?? "",
        ACCT_TYPE: data?.ACCT_TYPE ?? "",
        ACCT_CD: data?.ACCT_CD ?? "",
        DAILY_TRN_CD: inwardGridData?.DAILY_TRN_CD ?? "",
        ZONE_CD: data?.ZONE_CD ?? "",
        ENTERED_COMP_CD: inwardGridData?.ENTERED_COMP_CD ?? "",
        ENTERED_BY: inwardGridData?.ENTERED_BY ?? "",
        LAST_ENTERED_BY: inwardGridData?.LAST_ENTERED_BY ?? "",
        LAST_MACHINE_NM: inwardGridData?.LAST_MACHINE_NM ?? "",
        REMARKS: data?.REMARKS ?? "",
        CHEQUE_DT: data?.CHEQUE_DT ?? "",
        CHEQUE_NO: data?.CHEQUE_NO ?? "",
        AMOUNT: data?.AMOUNT ?? "",
        TRAN_CD: inwardGridData?.TRAN_CD,
        MICR_TRAN_CD: data?.MICR_TRAN_CD ?? "",
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
          initialValues={inwardGridData}
          // initialValues={{
          //   ...inwardGridData,
          //   RANGE_DATE: result?.[1]?.data?.[0]?.RANGE_DATE ?? "",
          //   TRAN_DATE: result?.[1]?.data?.[0]?.TRAN_DATE ?? "",
          // }}
          onSubmitHandler={onSubmitHandler}
          formStyle={{
            background: "white",
          }}
          onFormButtonClickHandel={(id) => {
            let event: any = { preventDefault: () => {} };
            if (id === "POST") {
              // if (!noFlag) {
              if (inwardGridData && inwardGridData?.DRAFT_DIV === "DRAFT") {
                setIsDraft(true);
              } else if (
                inwardGridData &&
                inwardGridData?.DRAFT_DIV === "DIVIDEND"
              ) {
                setIsDividend(true);
              }
              // }
              else {
                formRef?.current?.handleSubmit(event, "POST");
              }
            } else if (id === "RETURN") {
              formRef?.current?.handleSubmit(event, "RETURN");
            } else if (id === "POSITIVE_PAY") {
              setIsPositvePay(true);
            } else if (id === "CONFIRM") {
              formRef?.current?.handleSubmit(event, "CONFIRM");
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
                onClick={() => {
                  if (currentIndex && currentIndex !== totalData) handlePrev();
                }}
              >
                Previous
              </GradientButton>
              {inwardGridData?.DRAFT_DIV.length === 0 ||
              inwardGridData?.DRAFT_DIV === "DRAFT" ? (
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
              ) : null}

              <GradientButton onClick={onClose}>Close</GradientButton>
            </>
          )}
        </FormWrapper>
        {result?.[0]?.isLoading || result?.[0]?.isFetching ? (
          <LoaderPaperComponent />
        ) : result[0].isError ? (
          <Alert
            severity="error"
            errorMsg={errorMsg}
            errorDetail={error_detail ?? ""}
          />
        ) : (
          <>
            <ChequeSignImage
              imgData={result?.[0]?.data}
              acSignImage={acImageData}
            />
          </>
        )}

        <>
          {isOpenSave && (
            <PopupMessageAPIWrapper
              MessageTitle={messageData.messageTitle}
              Message={messageData.message}
              onActionYes={() => {
                if (messageData?.apiReq?.action === "POST") {
                  const oldData = {
                    COMP_CD: inwardGridData?.COMP_CD ?? "",
                    BRANCH_CD: inwardGridData?.BRANCH_CD ?? "",
                    ACCT_TYPE: inwardGridData?.ACCT_TYPE ?? "",
                    ACCT_CD: inwardGridData?.ACCT_CD ?? "",
                    CHEQUE_NO: inwardGridData?.CHEQUE_NO ?? "",
                    DRAFT_DIV: inwardGridData?.DRAFT_DIV ?? "",
                    TRAN_CD: inwardGridData?.TRAN_CD,
                    MICR_TRAN_CD: inwardGridData?.MICR_TRAN_CD ?? "",
                    CHEQUE_DT: inwardGridData?.CHEQUE_DT,
                  };
                  const newData = {
                    COMP_CD: inwardGridData?.COMP_CD ?? "",
                    BRANCH_CD: messageData?.apiReq?.BRANCH_CD ?? "",
                    ACCT_TYPE: messageData?.apiReq?.ACCT_TYPE ?? "",
                    ACCT_CD: messageData?.apiReq?.ACCT_CD ?? "",
                    CHEQUE_NO: messageData?.apiReq?.CHEQUE_NO ?? "",
                    TRAN_CD: inwardGridData?.TRAN_CD,
                    MICR_TRAN_CD: messageData?.apiReq?.MICR_TRAN_CD ?? "",
                    CHEQUE_DT: messageData?.apiReq?.CHEQUE_DT
                      ? format(
                          new Date(messageData?.apiReq["CHEQUE_DT"]),
                          "dd/MMM/yyyy"
                        )
                      : "",
                    DRAFT_DIV: inwardGridData?.DRAFT_DIV,
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
                } else if (messageData?.apiReq?.action === "CONFIRM") {
                  confirmPostedConfigDML.mutate({
                    COMP_CD: inwardGridData?.COMP_CD ?? "",
                    BRANCH_CD: messageData?.apiReq?.BRANCH_CD ?? "",
                    ENTERED_BY: inwardGridData?.ENTERED_BY,
                    TRAN_CD: inwardGridData?.TRAN_CD,
                    ACCT_TYPE: messageData?.apiReq?.ACCT_TYPE ?? "",
                    ACCT_CD: messageData?.apiReq?.ACCT_CD ?? "",
                    CHEQUE_NO: messageData?.apiReq?.CHEQUE_NO ?? "",
                    AMOUNT: messageData?.apiReq?.AMOUNT,
                    MICR_TRAN_CD: messageData?.apiReq?.MICR_TRAN_CD,
                    CHEQUE_DT: messageData?.apiReq?.CHEQUE_DT
                      ? format(
                          new Date(messageData?.apiReq["CHEQUE_DT"]),
                          "dd/MMM/yyyy"
                        )
                      : "",
                    SCREEN_REF: "TRN/650",
                  });
                } else {
                  const oldData = {
                    TRAN_CD: inwardGridData?.TRAN_CD,
                    COMP_CD: inwardGridData?.COMP_CD,
                    BRANCH_CD: inwardGridData?.BRANCH_CD,
                    RET_BRANCH_CD: inwardGridData?.RET_BRANCH_CD,
                    RET_COMP_CD: inwardGridData?.RET_COMP_CD,
                    RET_ACCT_TYPE: inwardGridData?.RET_ACCT_TYPE,
                    RET_ACCT_CD: inwardGridData?.RET_ACCT_CD,
                    ENTERED_BRANCH_CD: inwardGridData?.ENTERED_BRANCH_CD,
                    CHEQUE_DT: inwardGridData?.CHEQUE_DT,
                    CHEQUE_NO: inwardGridData?.CHEQUE_NO,
                    ZONE_CD: inwardGridData?.ZONE_CD,
                    REASON: inwardGridData?.REASON,
                    REASON_CD: inwardGridData?.REASON_CD,
                    DRAFT_DIV: inwardGridData?.DRAFT_DIV,
                  };

                  const newData = {
                    TRAN_CD: inwardGridData?.TRAN_CD,
                    COMP_CD: inwardGridData?.COMP_CD,
                    BRANCH_CD: messageData?.apiReq?.BRANCH_CD,
                    RET_BRANCH_CD: messageData?.apiReq?.RET_BRANCH_CD,
                    RET_ACCT_TYPE: messageData?.apiReq?.RET_ACCT_TYPE,
                    RET_ACCT_CD: messageData?.apiReq?.RET_ACCT_CD,
                    RET_COMP_CD: inwardGridData?.RET_COMP_CD,
                    ENTERED_BRANCH_CD: inwardGridData?.ENTERED_BRANCH_CD,
                    CHEQUE_DT: messageData?.apiReq?.CHEQUE_DT
                      ? format(
                          new Date(messageData?.apiReq["CHEQUE_DT"]),
                          "dd/MMM/yyyy"
                        )
                      : "",
                    CHEQUE_NO: messageData?.apiReq?.CHEQUE_NO,
                    ZONE_CD: messageData?.apiReq?.ZONE_CD,
                    REASON: messageData?.apiReq?.REASON,
                    REASON_CD: messageData?.apiReq?.REASON_CD,
                    DRAFT_DIV: inwardGridData?.DRAFT_DIV,
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
            positiveData={inwardGridData}
          />
        ) : null}

        {isDividend ? (
          <ShareDividendFormWrapper
            onClose={onClose()}
            dividendData={inwardGridData}
          />
        ) : null}
        <>
          {isDraft ? (
            <PopupRequestWrapper
              MessageTitle={"Confirmation"}
              Message={
                authState?.role < "2"
                  ? "Do you want to realize Draft?"
                  : "Do you want to realize Draft?" +
                    "Or Want to direct post in GL? " +
                    "Press Yes to Realize Draft " +
                    "Press No to Direct Post in GL"
              }
              onClickButton={(rows, buttonNames) => {
                const postData = {
                  COMP_CD: inwardGridData?.COMP_CD,
                  BRANCH_CD: inwardGridData?.BRANCH_CD,
                  ACCT_TYPE: inwardGridData?.ACCT_TYPE,
                  ACCT_CD: inwardGridData?.ACCT_CD,
                  TRAN_CD: inwardGridData?.TRAN_CD,
                  CHEQUE_NO: inwardGridData?.CHEQUE_NO,
                  DRAFT_DIV: inwardGridData?.DRAFT_DIV,
                  _UPDATEDCOLUMNS: [],
                  _OLDROWVALUE: {},
                  _isNewRow: false,
                };
                if (authState?.role < "2") {
                  if (Boolean(buttonNames === "Yes")) {
                    postConfigDML.mutate(postData);
                  } else {
                    setIsDraft(false);
                  }
                } else {
                  if (Boolean(buttonNames === "Yes")) {
                    postConfigDML.mutate(postData);
                  } else if (Boolean(buttonNames === "No")) {
                    setIsDraft(false);
                    // setNoFlag(true);
                    let event: any = { preventDefault: () => {} };
                    formRef?.current?.handleSubmit(event, "NO");
                  } else {
                    setIsDraft(false);
                  }
                }
              }}
              buttonNames={
                authState?.role < "2" ? ["Yes", "No"] : ["Yes", "No", "Cancel"]
              }
              rows={[]}
              loading={{
                Yes: postConfigDML?.isLoading,
                No: false,
                Cancel: false,
              }}
              open={isDraft}
            />
          ) : null}
        </>
      </>
      {/* )} */}
    </>
  );
};
export const ChequeReturnPostFormWrapper = ({
  onClose,
  isDataChangedRef,
  handlePrev,
  handleNext,
  currentIndexRef,
  totalData,
}) => {
  const { state: rows } = useLocation();
  currentIndexRef.current = rows.index;
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
        inwardGridData={rows?.gridData}
        handlePrev={handlePrev}
        handleNext={handleNext}
        currentIndex={rows.index}
        isDataChangedRef={isDataChangedRef}
        totalData={totalData}
      />
    </Dialog>
  );
};
