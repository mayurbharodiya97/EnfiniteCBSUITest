import { CircularProgress, Dialog } from "@mui/material";
import { useContext, useRef, useState } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { SubmitFnType } from "packages/form";
import { useLocation } from "react-router-dom";
import { utilFunction } from "components/utils";
import { AuthContext } from "pages_audit/auth";
import { useMutation } from "react-query";
import { enqueueSnackbar } from "notistack";
import { usePopupContext } from "components/custom/popupContext";
import { useTranslation } from "react-i18next";
import { PositivePayEntryFormMetadata } from "./metadata";
import { ImageViewer } from "components/fileUpload/preView";
import UploadImageDialogue from "./uploadImage";
import * as API from "../api";
import { format } from "date-fns";
import { RemarksAPIWrapper } from "components/custom/Remarks";
import { isValidDate } from "components/utils/utilFunctions/function";

interface PositivePayEntryFormWrapperProps {
  isDataChangedRef: any;
  closeDialog: () => void;
  defaultView: string;
  screenFlag?: string;
}

export const PositivePayEntry = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
  screenFlag,
}) => {
  const isErrorFuncRef = useRef<any>(null);
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const { t } = useTranslation();
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const uploadImageDataRef = useRef<any>(null);
  const [formMode, setFormMode] = useState(defaultView);
  const [openImage, setOpenImage] = useState(false);
  const [imageBlobData, setImageBlobData] = useState<any>(null);
  const [uploadImage, setUploadImage] = useState(false);
  const [loadingAction, setLoadingAction] = useState<any>(null);
  const [isReject, setReject] = useState(false);

  const formData =
    rows?.retrieveData && Object.keys(rows?.retrieveData).length > 0
      ? rows?.retrieveData
      : rows?.[0]?.data || {};

  const validatePositivePayDtlMutation: any = useMutation(
    API.validatePositivePayEntryDetail,
    {
      onError: (error: any) => {
        let errorMsg = t("Unknownerroroccured");
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
      },
      onSuccess: (data, variables) => {},
    }
  );

  const mutation = useMutation(API.positivePayEntryDML, {
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
    onSuccess: (data, variables) => {
      if (variables._isDeleteRow === true) {
        enqueueSnackbar(t("deleteSuccessfully"), {
          variant: "success",
        });
      } else {
        enqueueSnackbar(data, {
          variant: "success",
        });
      }
      isDataChangedRef.current = true;
      CloseMessageBox();
      closeDialog();
    },
  });

  const confirmRejectMutation = useMutation(API.positivePayConfirmation, {
    onError: (error: any) => {
      let errorMsg = t("Unknownerroroccured");
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
      setReject(false);
      closeDialog();
    },
    onSuccess: (data, variables) => {
      if (variables?._isDeleteRow === false) {
        enqueueSnackbar(data, {
          variant: "success",
        });
        isDataChangedRef.current = true;
        CloseMessageBox();
        closeDialog();
      } else if (variables?._isDeleteRow === true) {
        setReject(false);
        enqueueSnackbar(t("RecordsDeletedMsg"), {
          variant: "success",
        });
        isDataChangedRef.current = true;
        CloseMessageBox();
        closeDialog();
      }
    },
  });

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    //@ts-ignore
    setLoadingAction(actionFlag);
    if (Boolean(data["CHEQUE_DT"])) {
      data["CHEQUE_DT"] = format(new Date(data["CHEQUE_DT"]), "dd/MMM/yyyy");
    }
    if (Boolean(data["TRAN_DT"])) {
      data["TRAN_DT"] = format(new Date(data["TRAN_DT"]), "dd/MMM/yyyy");
    }
    if (Boolean(data["CHEQUE_AMT"])) {
      data["CHEQUE_AMT"] = data["CHEQUE_AMT"].endsWith(".00")
        ? parseInt(data["CHEQUE_AMT"]).toString()
        : data["CHEQUE_AMT"].toString();
    }
    let newData = {
      ...data,
      CHEQUE_IMG: uploadImageDataRef?.current || data?.CHEQUE_IMG,
    };
    let oldData = {
      ...formData,
    };
    let upd = utilFunction.transformDetailsData(newData, oldData);

    if (upd._UPDATEDCOLUMNS.length > 0) {
      upd._UPDATEDCOLUMNS = upd._UPDATEDCOLUMNS.filter(
        (field) =>
          field !== "TYPE_CD" && field !== "VIEW" && field !== "UPLOAD_IMG"
      );
    }

    if (newData?.TYPE_CD || newData?.VIEW || newData?.UPLOAD_IMG) {
      delete newData["TYPE_CD"];
      delete newData["VIEW"];
      delete newData["UPLOAD_IMG"];
    }

    isErrorFuncRef.current = {
      data: {
        ...newData,
        ...upd,
        ENTERED_COMP_CD: authState?.companyID ?? "",
        ENTERED_BRANCH_CD: authState?.user?.branchCode ?? "",
        COMP_CD: authState?.companyID ?? "",
        TRAN_CD: newData?.TRAN_CD ?? "",
        INS_UPD:
          formMode === "new"
            ? "I"
            : formMode === "edit" && actionFlag === "Save"
            ? "U"
            : actionFlag === "Remove"
            ? "D"
            : "",
        GI_BRANCH: authState?.user?.branchCode ?? "",
        CHEQUE_IMG: (uploadImageDataRef.current || data?.CHEQUE_IMG) ?? "",
        TRAN_DT:
          formMode === "new"
            ? authState?.workingDate ?? ""
            : newData?.TRAN_DT ?? "",
        UPLOAD: formMode === "new" ? "N" : data.UPLOAD ?? "",
        CONFIRMED: formMode === "new" ? "N" : data.CONFIRMED ?? "",
        REQ_CHANNEL: formMode === "new" ? "B" : data.REQ_CHANNEL ?? "",
      },
      displayData,
      endSubmit,
      setFieldError,
    };

    if (
      actionFlag === "Save" &&
      isErrorFuncRef.current?.data?._UPDATEDCOLUMNS.length === 0
    ) {
      setFormMode("view");
    } else {
      validatePositivePayDtlMutation.mutate(
        {
          ...newData,
          ENT_COMP_CD: authState?.companyID ?? "",
          ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
          TRAN_CD: newData?.TRAN_CD ?? "",
          INS_UPD:
            formMode === "new"
              ? "I"
              : formMode === "edit" && actionFlag === "Save"
              ? "U"
              : actionFlag === "Remove"
              ? "D"
              : "",
          GI_BRANCH: authState?.user?.branchCode ?? "",
          SCREEN_REF: "MST/968",
          CHEQUE_IMG: (uploadImageDataRef.current || data?.CHEQUE_IMG) ?? "",
          UPLOAD: formMode === "new" ? "N" : data.UPLOAD ?? "",
          REQ_CHANNEL: formMode === "new" ? "B" : data.REQ_CHANNEL ?? "",
        },
        {
          onSuccess: async (data, variables) => {
            for (let i = 0; i < data?.length; i++) {
              if (data[i]?.O_STATUS === "999") {
                const btnName = await MessageBox({
                  messageTitle: "ValidationFailed",
                  message: data[i]?.O_MESSAGE,
                  buttonNames: ["Ok"],
                });
                if (btnName === "Ok" && formMode !== "view") {
                  endSubmit(true);
                }
              } else if (data[i]?.O_STATUS === "9") {
                const btnName = await MessageBox({
                  messageTitle: "Alert",
                  message: data?.[0]?.O_MESSAGE,
                });
              } else if (data[i]?.O_STATUS === "99") {
                const btnName = await MessageBox({
                  messageTitle: "Confirmation",
                  message: data?.[0]?.O_MESSAGE,
                  buttonNames: ["Yes", "No"],
                });
                if (btnName === "No" && formMode !== "view") {
                  endSubmit(true);
                  break;
                }
              } else if (data[i]?.O_STATUS === "0") {
                if (actionFlag === "Save") {
                  const btnName = await MessageBox({
                    message: "SaveData",
                    messageTitle: "Confirmation",
                    buttonNames: ["Yes", "No"],
                    loadingBtnName: ["Yes"],
                  });
                  if (btnName === "Yes") {
                    mutation.mutate({
                      ...isErrorFuncRef.current?.data,
                      _isNewRow: formMode === "new" ? true : false,
                    });
                  } else if (btnName === "No") {
                    endSubmit(true);
                  }
                } else if (actionFlag === "Remove") {
                  const btnName = await MessageBox({
                    message: "DeleteData",
                    messageTitle: "Confirmation",
                    buttonNames: ["Yes", "No"],
                    loadingBtnName: ["Yes"],
                  });
                  if (btnName === "Yes") {
                    mutation.mutate({
                      ...isErrorFuncRef.current?.data,
                      _isDeleteRow: true,
                    });
                  } else if (btnName === "No" && formMode === "edit") {
                    endSubmit(true);
                  }
                }
              }
            }
          },
        }
      );
    }
  };

  const setChequeImage = async () => {
    if (!Boolean(formData?.CHEQUE_IMG)) {
      MessageBox({
        messageTitle: "ChequeImage",
        message: "ChequeImageIsNotUploaded",
        buttonNames: ["Ok"],
      });
    } else if (Boolean(formData?.CHEQUE_IMG)) {
      setOpenImage(true);
      let blob = utilFunction.base64toBlob(formData?.CHEQUE_IMG, "image/png");
      setImageBlobData(blob);
    } else {
      return "";
    }
  };

  return (
    <>
      <FormWrapper
        key={"positivePayEntryForm" + formMode}
        metaData={PositivePayEntryFormMetadata as MetaDataType}
        displayMode={formMode}
        onSubmitHandler={onSubmitHandler}
        initialValues={{
          ...formData,
          CHEQUE_DT:
            formMode === "new" ? authState?.workingDate : formData?.CHEQUE_DT,
        }}
        formStyle={{
          background: "white",
        }}
        formState={{ formMode: formMode, MessageBox: MessageBox }}
        onFormButtonClickHandel={async (id) => {
          if (id === "VIEW") {
            setChequeImage();
          } else if (id === "UPLOAD_IMG") {
            setUploadImage(true);
          }
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            {formMode === "edit" ? (
              <>
                <GradientButton
                  color={"primary"}
                  onClick={(event) => {
                    handleSubmit(event, "Remove");
                  }}
                  disabled={validatePositivePayDtlMutation?.isLoading}
                  endIcon={
                    loadingAction === "Remove" &&
                    validatePositivePayDtlMutation?.isLoading ? (
                      <CircularProgress size={20} />
                    ) : null
                  }
                >
                  {t("Delete")}
                </GradientButton>
                <GradientButton
                  onClick={(event) => {
                    handleSubmit(event, "Save");
                  }}
                  color={"primary"}
                  disabled={validatePositivePayDtlMutation?.isLoading}
                  endIcon={
                    loadingAction === "Save" &&
                    validatePositivePayDtlMutation?.isLoading ? (
                      <CircularProgress size={20} />
                    ) : null
                  }
                >
                  {t("Save")}
                </GradientButton>
                <GradientButton
                  onClick={() => {
                    setFormMode("view");
                  }}
                  disabled={validatePositivePayDtlMutation?.isLoading}
                  color={"primary"}
                >
                  {t("Cancel")}
                </GradientButton>
              </>
            ) : formMode === "new" ? (
              <>
                <GradientButton
                  onClick={(event) => {
                    handleSubmit(event, "Save");
                  }}
                  disabled={validatePositivePayDtlMutation?.isLoading}
                  endIcon={
                    loadingAction === "Save" &&
                    validatePositivePayDtlMutation?.isLoading ? (
                      <CircularProgress size={20} />
                    ) : null
                  }
                  color={"primary"}
                >
                  {t("Save")}
                </GradientButton>

                <GradientButton
                  onClick={closeDialog}
                  disabled={validatePositivePayDtlMutation?.isLoading}
                  color={"primary"}
                >
                  {t("Close")}
                </GradientButton>
              </>
            ) : screenFlag === "C" && formMode === "view" ? (
              <>
                <GradientButton
                  color={"primary"}
                  onClick={async (event) => {
                    if (formData?.LAST_ENTERED_BY === authState?.user?.id) {
                      await MessageBox({
                        messageTitle: "InvalidConfirmation",
                        message: "ConfirmRestrictionMessage",
                        buttonNames: ["Ok"],
                      });
                    } else {
                      const confirmation = await MessageBox({
                        message: "ConfirmFormData",
                        messageTitle: "Confirmation",
                        buttonNames: ["Yes", "No"],
                        loadingBtnName: ["Yes"],
                      });
                      if (confirmation === "Yes") {
                        const confirmData = {
                          ...rows?.[0]?.data,
                          ENTERED_DATE: isValidDate(
                            rows?.[0]?.data?.ENTERED_DATE
                          )
                            ? format(
                                new Date(rows?.[0]?.data?.ENTERED_DATE),
                                "dd/MMM/yyyy"
                              ) ?? ""
                            : "",
                          TRAN_DT: isValidDate(rows?.[0]?.data?.TRAN_DT)
                            ? format(
                                new Date(rows?.[0]?.data?.TRAN_DT),
                                "dd/MMM/yyyy"
                              ) ?? ""
                            : "",
                          CHEQUE_DT: isValidDate(rows?.[0]?.data?.CHEQUE_DT)
                            ? format(
                                new Date(rows?.[0]?.data?.CHEQUE_DT),
                                "dd/MMM/yyyy"
                              ) ?? ""
                            : "",
                          ACTIVITY_DATE: isValidDate(authState?.workingDate)
                            ? format(
                                new Date(authState?.workingDate),
                                "dd/MMM/yyyy"
                              ) ?? ""
                            : "",
                          LAST_MODIFIED_DATE: isValidDate(
                            rows?.[0]?.data?.LAST_MODIFIED_DATE
                          )
                            ? format(
                                new Date(rows?.[0]?.data?.LAST_MODIFIED_DATE),
                                "dd/MMM/yyyy"
                              ) ?? ""
                            : "",
                          TRAN_AMOUNT: rows?.[0]?.data?.CHEQUE_AMT ?? "",
                          ACTIVITY_DONE_BY: rows?.[0]?.data?.ENTERED_BY ?? "",
                          ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
                          ENT_COMP_CD: authState?.companyID ?? "",
                          ENT_DATE: rows?.[0]?.data?.ENTERED_DATE ?? "",
                          ACTIVITY_TYPE: "",
                          TRAN_TYPE: "",
                          USER_REMARKS: "",
                          _isDeleteRow: false,
                        };
                        confirmRejectMutation.mutate(confirmData);
                      }
                    }
                  }}
                >
                  {t("Confirm")}
                </GradientButton>
                <GradientButton
                  color={"primary"}
                  onClick={async (event) => {
                    const confirmation = await MessageBox({
                      message: "deleteTitle",
                      messageTitle: "DeleteWarning",
                      buttonNames: ["Yes", "No"],
                    });
                    if (confirmation === "Yes") {
                      setReject(true);
                    }
                  }}
                >
                  {t("Reject")}
                </GradientButton>
                <GradientButton onClick={closeDialog} color={"primary"}>
                  {t("Close")}
                </GradientButton>
              </>
            ) : (
              <>
                <GradientButton
                  color={"primary"}
                  onClick={(event) => {
                    handleSubmit(event, "Remove");
                  }}
                  disabled={validatePositivePayDtlMutation?.isLoading}
                  endIcon={
                    loadingAction === "Remove" &&
                    validatePositivePayDtlMutation?.isLoading ? (
                      <CircularProgress size={20} />
                    ) : null
                  }
                >
                  {t("Delete")}
                </GradientButton>
                <GradientButton
                  onClick={() => {
                    setFormMode("edit");
                  }}
                  color={"primary"}
                  disabled={validatePositivePayDtlMutation?.isLoading}
                >
                  {t("Edit")}
                </GradientButton>
                <GradientButton
                  onClick={closeDialog}
                  disabled={validatePositivePayDtlMutation?.isLoading}
                  color={"primary"}
                >
                  {t("Close")}
                </GradientButton>
              </>
            )}
          </>
        )}
      </FormWrapper>

      {Boolean(imageBlobData && imageBlobData?.type?.includes("png")) &&
        Boolean(openImage) && (
          <Dialog
            open={true}
            PaperProps={{
              style: {
                height: "60%",
                width: "60%",
                overflow: "auto",
              },
            }}
            maxWidth="lg"
          >
            <ImageViewer
              blob={imageBlobData}
              fileName={t("PositivePayEntry")}
              onClose={() => {
                setOpenImage(false);
              }}
            />
          </Dialog>
        )}

      {uploadImage && (
        <UploadImageDialogue
          onClose={() => {
            setUploadImage(false);
          }}
          onUpload={(data) => {
            if (Boolean(data)) {
              uploadImageDataRef.current = data?.[0]?.blob;
            }
            setUploadImage(false);
          }}
        />
      )}

      {isReject && (
        <RemarksAPIWrapper
          TitleText={"RemovalRemarksPositivePay"}
          label={"RemovalRemarks"}
          onActionNo={() => setReject(false)}
          onActionYes={(val, rows) => {
            const rejectData = {
              ...rows,
              INS_UPD: "D",
              ENTERED_DATE: isValidDate(rows?.ENTERED_DATE)
                ? format(new Date(rows?.ENTERED_DATE), "dd/MMM/yyyy") ?? ""
                : "",
              TRAN_DT: isValidDate(rows?.TRAN_DT)
                ? format(new Date(rows?.TRAN_DT), "dd/MMM/yyyy") ?? ""
                : "",
              CHEQUE_DT: isValidDate(rows?.CHEQUE_DT)
                ? format(new Date(rows?.CHEQUE_DT), "dd/MMM/yyyy") ?? ""
                : "",
              ACTIVITY_DATE: isValidDate(authState?.workingDate)
                ? format(new Date(authState?.workingDate), "dd/MMM/yyyy") ?? ""
                : "",
              LAST_MODIFIED_DATE: isValidDate(rows?.LAST_MODIFIED_DATE)
                ? format(new Date(rows?.LAST_MODIFIED_DATE), "dd/MMM/yyyy") ??
                  ""
                : "",
              GI_BRANCH: authState?.user?.branchCode ?? "",
              ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
              ENT_COMP_CD: authState?.companyID ?? "",
              COMP_CD: authState?.companyID ?? "",
              TRAN_AMOUNT: rows?.CHEQUE_AMT ?? "",
              ACTIVITY_DONE_BY: rows?.ENTERED_BY ?? "",
              SCREEN_REF: "MST/968",
              TRAN_TYPE: "DELETE",
              ACTIVITY_TYPE: "POSITIVE PAY CONFIRMATION",
              USER_REMARKS: val
                ? val
                : "WRONG ENTRY FROM POSITIVE PAY CONFIRMATION (MST/992)",
              _isDeleteRow: true,
            };
            confirmRejectMutation.mutate(rejectData);
          }}
          isLoading={confirmRejectMutation?.isLoading}
          isEntertoSubmit={true}
          AcceptbuttonLabelText="Ok"
          CanceltbuttonLabelText="Cancel"
          open={isReject}
          rows={rows?.[0]?.data}
          defaultValue={"WRONG ENTRY FROM POSITIVE PAY CONFIRMATION (MST/992)"}
        />
      )}
    </>
  );
};

export const PositivePayEntryFormWrapper: React.FC<
  PositivePayEntryFormWrapperProps
> = ({ isDataChangedRef, closeDialog, defaultView, screenFlag }) => {
  return (
    <Dialog
      open={true}
      PaperProps={{
        style: {
          width: "auto",
          overflow: "auto",
        },
      }}
      maxWidth="md"
    >
      <PositivePayEntry
        isDataChangedRef={isDataChangedRef}
        closeDialog={closeDialog}
        defaultView={defaultView}
        screenFlag={screenFlag}
      />
    </Dialog>
  );
};
