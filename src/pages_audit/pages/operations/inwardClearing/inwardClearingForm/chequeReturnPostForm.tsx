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
import { PositivePayFormWrapper } from "./positvePayForm";
import { CircularProgress } from "@mui/material";
import { utilFunction } from "components/utils";
import { ShareDividendFormWrapper } from "./shareDividendForm";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Alert } from "components/common/alert";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
    const { MessageBox, CloseMessageBox } = usePopupContext();
    const { enqueueSnackbar } = useSnackbar();
    const [acImageData, setAcImageData] = useState<any>(null);
    const [isDividend, setIsDividend] = useState(false);
    const [isPositivePay, setIsPositvePay] = useState(false);
    // const [noFlag, setNoFlag] = useState(false);
    const { authState } = useContext(AuthContext);
    const { t } = useTranslation();

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

    const oldReqData = {
      COMP_CD: inwardGridData?.COMP_CD ?? "",
      BRANCH_CD: inwardGridData?.BRANCH_CD ?? "",
      ACCT_TYPE: inwardGridData?.ACCT_TYPE ?? "",
      ACCT_CD: inwardGridData?.ACCT_CD ?? "",
      CHEQUE_NO: inwardGridData?.CHEQUE_NO ?? "",
      DRAFT_DIV: inwardGridData?.DRAFT_DIV ?? "",
      TRAN_CD: inwardGridData?.TRAN_CD,
      MICR_TRAN_CD: inwardGridData?.MICR_TRAN_CD ?? "",
    };
    const viewDetailValidatePostData: any = useMutation(API.validatePost, {
      onSuccess: async (data, variables) => {
        for (let i = 0; i < data?.length; i++) {
          if (data[i]?.O_STATUS === "0") {
            const buttonName = await MessageBox({
              messageTitle: t("ValidationSuccessful"),
              message: t("AreYouSurePostThisCheque"),
              buttonNames: ["No", "Yes"],
              loadingBtnName: ["Yes"],
            });
            if (buttonName === "Yes") {
              const oldData = {
                ...oldReqData,
                CHEQUE_DT: inwardGridData?.CHEQUE_DT,
              };
              const newData = {
                COMP_CD: inwardGridData?.COMP_CD ?? "",
                BRANCH_CD: variables?.BRANCH_CD ?? "",
                ACCT_TYPE: variables?.ACCT_TYPE ?? "",
                ACCT_CD: variables?.ACCT_CD ?? "",
                CHEQUE_NO: variables?.CHEQUE_NO ?? "",
                TRAN_CD: inwardGridData?.TRAN_CD,
                MICR_TRAN_CD: variables?.MICR_TRAN_CD ?? "",
                CHEQUE_DT: variables?.CHEQUE_DT
                  ? format(new Date(variables["CHEQUE_DT"]), "dd/MMM/yyyy")
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
            }
          } else if (data[i]?.O_STATUS === "9") {
            MessageBox({
              messageTitle: t("Alert"),
              message: data[i]?.O_MESSAGE,
            });
          } else if (data[i]?.O_STATUS === "99") {
            const buttonName = await MessageBox({
              messageTitle: t("Confirmation"),
              message: data[i]?.O_MESSAGE,
              buttonNames: ["No", "Yes"],
              loadingBtnName: ["Yes"],
            });
            if (buttonName === "Yes") {
              const oldData = {
                ...oldReqData,
                CHEQUE_DT: inwardGridData?.CHEQUE_DT,
              };
              const newData = {
                COMP_CD: inwardGridData?.COMP_CD ?? "",
                BRANCH_CD: variables?.BRANCH_CD ?? "",
                ACCT_TYPE: variables?.ACCT_TYPE ?? "",
                ACCT_CD: variables?.ACCT_CD ?? "",
                CHEQUE_NO: variables?.CHEQUE_NO ?? "",
                TRAN_CD: inwardGridData?.TRAN_CD,
                MICR_TRAN_CD: variables?.MICR_TRAN_CD ?? "",
                CHEQUE_DT: variables?.CHEQUE_DT
                  ? format(new Date(variables["CHEQUE_DT"]), "dd/MMM/yyyy")
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
            }
          } else if (data[i]?.O_STATUS === "999") {
            MessageBox({
              messageTitle: t("ValidationFailed"),
              message: data[i]?.O_MESSAGE,
            });
          }
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
        if (data?.[0]?.O_STATUS === "0" && data?.[0]?.O_MESSAGE) {
          const buttonName = await MessageBox({
            messageTitle: t("ValidationSuccessful"),
            message: t("AreYouReturnThisCheque"),
            buttonNames: ["No", "Yes"],
            loadingBtnName: ["Yes"],
          });
          if (buttonName === "Yes") {
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
              BRANCH_CD: variables?.BRANCH_CD,
              RET_BRANCH_CD: variables?.RET_BRANCH_CD,
              RET_ACCT_TYPE: variables?.RET_ACCT_TYPE,
              RET_ACCT_CD: variables?.RET_ACCT_CD,
              RET_COMP_CD: inwardGridData?.RET_COMP_CD,
              ENTERED_BRANCH_CD: inwardGridData?.ENTERED_BRANCH_CD,
              CHEQUE_DT: variables?.CHEQUE_DT
                ? format(new Date(variables["CHEQUE_DT"]), "dd/MMM/yyyy")
                : "",
              CHEQUE_NO: variables?.CHEQUE_NO,
              ZONE_CD: variables?.ZONE_CD,
              REASON: variables?.REASON,
              REASON_CD: variables?.REASON_CD,
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
        } else if (data?.[0]?.O_STATUS === "999" && data?.[0]?.O_MESSAGE) {
          MessageBox({
            messageTitle: t("ValidationFailed"),
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
      onSuccess: async (data, variables) => {
        const apiReq = {
          COMP_CD: inwardGridData?.COMP_CD ?? "",
          BRANCH_CD: variables?.BRANCH_CD ?? "",
          ENTERED_BY: inwardGridData?.ENTERED_BY,
          TRAN_CD: inwardGridData?.TRAN_CD,
          ACCT_TYPE: variables?.ACCT_TYPE ?? "",
          ACCT_CD: variables?.ACCT_CD ?? "",
          CHEQUE_NO: variables?.CHEQUE_NO ?? "",
          AMOUNT: variables?.AMOUNT,
          MICR_TRAN_CD: variables?.MICR_TRAN_CD,
          CHEQUE_DT: variables?.CHEQUE_DT
            ? format(new Date(variables["CHEQUE_DT"]), "dd/MMM/yyyy")
            : "",
          SCREEN_REF: "TRN/650",
        };
        for (let i = 0; i < data?.length; i++) {
          if (data[i]?.O_STATUS === "0") {
            const buttonName = await MessageBox({
              messageTitle: t("ValidationSuccessful"),
              message:
                t("DoYouWantAllowTransactionVoucherNo") +
                variables?.DAILY_TRN_CD +
                "?",
              buttonNames: ["No", "Yes"],
              loadingBtnName: ["Yes"],
            });
            if (buttonName === "Yes") {
              confirmPostedConfigDML.mutate({
                apiReq,
              });
            }
          } else if (data[i]?.O_STATUS === "9") {
            MessageBox({
              messageTitle: t("Alert"),
              message: data[i]?.O_MESSAGE,
            });
          } else if (data[i]?.O_STATUS === "99") {
            const buttonName = await MessageBox({
              messageTitle: t("Confirmation"),
              message: data[i]?.O_MESSAGE,
              buttonNames: ["No", "Yes"],
              loadingBtnName: ["Yes"],
            });
            if (buttonName === "Yes") {
              confirmPostedConfigDML.mutate({
                apiReq,
              });
            }
          } else if (data[i]?.O_STATUS === "999") {
            MessageBox({
              messageTitle: t("ValidationFailed"),
              message: data[i]?.O_MESSAGE,
            });
          }
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
        if (currentIndex && currentIndex !== totalData) handleNext();
        if (typeof onClose === "function") {
          onClose();
        }
        CloseMessageBox();
      },

      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        CloseMessageBox();
      },
    });
    const returnConfigDML: any = useMutation(API.returnConfigDML, {
      onSuccess: (data, variables) => {
        enqueueSnackbar(data, { variant: "success" });
        isDataChangedRef.current = true;
        onClose();
        CloseMessageBox();
      },

      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        CloseMessageBox();
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
        CloseMessageBox();
      },
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        CloseMessageBox();
      },
    });

    const onSubmitHandler: SubmitFnType = async (
      data: any,
      displayData,
      endSubmit,
      setFieldErrors,
      actionFlag
    ) => {
      endSubmit(true);

      if (actionFlag === "Save") {
        const oldData = {
          ...oldReqData,
          CHEQUE_DT: inwardGridData?.CHEQUE_DT,
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
        if (upd?._UPDATEDCOLUMNS?.length > 0 && data?.ACCT_TYPE.trim()?.length > 0 && data?.ACCT_CD.trim()?.length > 0) {
          const updateData = {
            ...newData,
            ...upd,
            _isNewRow: false,
          };
          endSubmit(true);
          postConfigDML.mutate(updateData);
        }
        if (data?.ACCT_TYPE.trim()?.length === 0) {
          setFieldErrors({
            ACCT_TYPE: t("PleaseEnterACType"),
          });
          return;
        } else if (data?.ACCT_CD.trim()?.length === 0) {
          setFieldErrors({
            ACCT_CD: t("PleaseEnterACNumber"),
          });
          return;
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
        if (data?.ACCT_TYPE.trim()?.length === 0) {
          setFieldErrors({});
          return;
        } else if (data?.ACCT_CD.trim()?.length === 0) {
          setFieldErrors({});
          return;
        }
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
            onFormButtonClickHandel={async (id) => {
              let event: any = { preventDefault: () => { } };
              if (id === "POST") {
                // if (!noFlag) {
                if (inwardGridData && inwardGridData?.DRAFT_DIV === "DRAFT") {
                  // setIsDraft(true);

                  const buttonName = await MessageBox({
                    messageTitle: t("Confirmation"),
                    message:
                      authState?.role < "2"
                        ? t("DoYouWantRealizeDraft")
                        : t("DoWantRealizeDraftOrDirectPostInGL"),
                    buttonNames:
                      authState?.role < "2"
                        ? ["Yes", "No"]
                        : ["Yes", "No", "Cancel"],
                    loadingBtnName: ["Yes" || "No"],
                  });
                  const postData = {
                    oldReqData,
                    _UPDATEDCOLUMNS: [],
                    _OLDROWVALUE: {},
                    _isNewRow: false,
                  };
                  if (authState?.role < "2" && buttonName === "Yes") {
                    postConfigDML.mutate(postData);
                  } else if (buttonName === "Yes") {
                    postConfigDML.mutate(postData);
                  } else if (buttonName === "No") {
                    let event: any = { preventDefault: () => { } };
                    formRef?.current?.handleSubmit(event, "NO");
                  }
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
              let event: any = { preventDefault: () => { } };
              // if (action === "ACCT_CD_VALID") {
              setAcImageData(payload?.[0]?.SIGN_IMG);
              // }

              if (action === "ACCT_CD_BLANK") {
                setAcImageData("");
              }
              // else if (formRef?.current?.handleSubmit(event, "RETURN")) {
              //   setAcImageData(payload?.[0]?.SIGN_IMG);
              // }
            }
            }
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton
                  onClick={() => {
                    if (currentIndex && currentIndex !== totalData) handlePrev();
                  }}
                >
                  {t("Previous")}
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
                   { t("SaveClose")}
                  </GradientButton>
                ) : null}

                <GradientButton onClick={onClose}>{t("Close")}</GradientButton>
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
              onClose={() => {
                setIsDividend(false);
              }}
              dividendData={inwardGridData}
            />
          ) : null}
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
