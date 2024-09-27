import { CircularProgress, Dialog } from "@mui/material";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQuery } from "react-query";
import * as API from "../api";
import { useTranslation } from "react-i18next";
import { cloneDeep } from "lodash";
import { InsuranceDetailFormMetaData } from "./insuranceDetailMetadata";
import { format } from "date-fns";
import {
  LoaderPaperComponent,
  RemarksAPIWrapper,
  GradientButton,
  MasterDetailsMetaData,
  MasterDetailsForm,
  Alert,
  queryClient,
  usePopupContext,
} from "@acuteinfo/common-base";
export const InsuranceDetailForm = ({
  handleDialogClose,
  defaultView,
  isDataChangedRef,
}) => {
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();
  const myMasterRef = useRef<any>(null);
  const { state: rows }: any = useLocation();
  const [formMode, setFormMode] = useState(defaultView);
  const [isDeleteRemark, SetDeleteRemark] = useState(false);

  const {
    data: mainData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<any, any>(
    ["getInsuranceEntryDetail", rows?.[0]?.data?.TRAN_CD],
    () =>
      API.getInsuranceEntryDetail({
        COMP_CD: rows?.[0]?.data?.COMP_CD,
        BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
        ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE,
        ACCT_CD: rows?.[0]?.data?.ACCT_CD,
        TRAN_CD: rows?.[0]?.data?.TRAN_CD,
      })
  );
  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getInsuranceEntryDetail",
        rows?.[0]?.data?.TRAN_CD,
      ]);
    };
  }, []);

  const deleteInsuranceMutation = useMutation(
    "deleteInsuranceMutation",
    API.doInsuranceDml,
    {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        CloseMessageBox();
        SetDeleteRemark(false);
      },
      onSuccess: (data) => {
        enqueueSnackbar(t("RecordSuccessfullyDeleted"), {
          variant: "success",
        });
        isDataChangedRef.current = true;
        handleDialogClose();
        CloseMessageBox();
        SetDeleteRemark(false);
      },
    }
  );
  const doInsuranceDml: any = useMutation(API.doInsuranceDml, {
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

    onSuccess: (data) => {
      enqueueSnackbar(t("DataUpdatedSuccessfully"), {
        variant: "success",
      });
      isDataChangedRef.current = true;
      CloseMessageBox();
      handleDialogClose();
      CloseMessageBox();
    },
  });
  const validateInsuranceEntryData: any = useMutation(
    API.validateInsuranceEntryData,
    {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
      },
      onSuccess: async (data, variables) => {},
    }
  );

  const AddNewRow = () => {
    myMasterRef.current?.addNewRow(true);
  };

  const onSubmitHandler = useCallback(
    ({
      data,
      resultValueObj,
      resultDisplayValueObj,
      endSubmit,
      setFieldErrors,
      actionFlag,
    }) => {
      let newData = data;
      // if (updPara.isNewRow) {
      //   updPara.isNewRow.forEach((item) => {
      //     delete item.SR_CD;
      //     delete item.TRAN_CD;
      //   });
      // }
      console.log("newData", newData);
      validateInsuranceEntryData.mutate(
        {
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          ACCT_TYPE: data?.ACCT_TYPE,
          ACCT_CD: data?.ACCT_CD,
          INSURANCE_DATE: data?.INSURANCE_DATE,
          DUE_DATE: data?.DUE_DATE,
          COVER_NOTE: data?.COVER_NOTE,
          INSURANCE_COMP_CD: data?.INSURANCE_COMP_CD,
          POLICY_NO: data?.POLICY_NO,
          INSURANCE_AMOUNT: data?.INSURANCE_AMOUNT,
          NET_PREMIUM_AMT: data?.NET_PREMIUM_AMOUNT,
          SERVICE_CHARGE: data?.SERVICE_CHARGE,
          DTL_DATA:
            data?.DETAILS_DATA?.isUpdatedRow?.length > 0
              ? data?.DETAILS_DATA?.isUpdatedRow
              : data?.DETAILS_DATA?.isNewRow?.length > 0
              ? data?.DETAILS_DATA?.isNewRow
              : mainData?.detailData,
          SCREEN_REF: "RPT/70",
        },
        {
          onSuccess: async (data, variables) => {
            for (let i = 0; i < data?.length; i++) {
              if (data[i]?.O_STATUS === "0") {
                const buttonName = await MessageBox({
                  messageTitle: t("Confirmation"),
                  message: t("ProceedGen"),
                  buttonNames: ["No", "Yes"],
                  loadingBtnName: ["Yes"],
                });
                if (buttonName === "Yes") {
                  doInsuranceDml.mutate({
                    ...newData,
                    INSURANCE_DATE: format(
                      new Date(newData?.INSURANCE_DATE),
                      "dd/MMM/yyyy"
                    ),
                    DUE_DATE: format(
                      new Date(newData?.DUE_DATE),
                      "dd/MMM/yyyy"
                    ),
                    TRAN_DT: format(new Date(newData?.TRAN_DT), "dd/MMM/yyyy"),
                    COMP_CD: authState?.companyID,
                    _isNewRow: formMode === "new" ? true : false,
                    _isDeleteRow: false,
                    _isUpdateRow: formMode === "edit" ? true : false,
                    TRAN_CD: formMode === "edit" ? mainData?.[0]?.TRAN_CD : "",
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
                  doInsuranceDml.mutate({
                    ...newData,
                    INSURANCE_DATE: format(
                      new Date(newData?.INSURANCE_DATE),
                      "dd/MMM/yyyy"
                    ),
                    DUE_DATE: format(
                      new Date(newData?.DUE_DATE),
                      "dd/MMM/yyyy"
                    ),
                    TRAN_DT: format(new Date(newData?.TRAN_DT), "dd/MMM/yyyy"),
                    COMP_CD: authState?.companyID,
                    _isNewRow: formMode === "new" ? true : false,
                    _isDeleteRow: false,
                    _isUpdateRow: formMode === "edit" ? true : false,
                    TRAN_CD: formMode === "edit" ? mainData?.[0]?.TRAN_CD : "",
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
        }
      );
      endSubmit(true);
    },
    [formMode]
  );
  let metadata: MasterDetailsMetaData = {} as MasterDetailsMetaData;
  metadata = cloneDeep(InsuranceDetailFormMetaData) as MasterDetailsMetaData;

  const detailsData = mainData?.detailData.map((item) => {
    return {
      ...item,
      _isNewRow: formMode === "new" ? true : false,
    };
  });
  console.log("detailsData", detailsData);
  return (
    <>
      <Dialog
        open={true}
        fullWidth={true}
        PaperProps={{
          style: {
            width: "100%",
          },
        }}
        maxWidth="lg"
      >
        {isLoading || isFetching ? (
          <LoaderPaperComponent />
        ) : isError ? (
          <Alert
            severity="error"
            errorMsg={error?.error_msg}
            errorDetail={error?.error_detail ?? ""}
          />
        ) : (
          <MasterDetailsForm
            key={"InsuranceEntryForm" + formMode}
            metaData={metadata}
            displayMode={formMode}
            initialData={{
              _isNewRow: formMode === "new" ? true : false,
              ...mainData?.[0],
              ALLOW_EDIT: mainData?.[0]?.ALLOW_EDIT,
              ALLOW_RENEW: rows?.[0]?.data?.ALLOW_RENEW,
              INACTIVE_DATE: authState?.workingDate,
              COVER_NOTE: mainData?.[0]?.COVER_NOTE,
              // DETAILS_DATA: mainData?.detailData,
              DETAILS_DATA: detailsData,
            }}
            onSubmitData={onSubmitHandler}
            isNewRow={formMode === "new" ? true : false}
            isLoading={isLoading}
            formState={{ MessageBox: MessageBox }}
            ref={myMasterRef}
            formStyle={{
              background: "white",
              height: "43vh",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {({ isSubmitting, handleSubmit }) => {
              return (
                <>
                  {formMode === "edit" || formMode === "new" ? (
                    <>
                      <GradientButton
                        onClick={AddNewRow}
                        disabled={isSubmitting}
                        color={"primary"}
                      >
                        {t("AddRow")}
                      </GradientButton>
                      <GradientButton
                        onClick={(event) => {
                          handleSubmit(event, "Save");
                        }}
                        disabled={isSubmitting}
                        endIcon={
                          validateInsuranceEntryData?.isLoading ? (
                            <CircularProgress size={20} />
                          ) : null
                        }
                        color={"primary"}
                      >
                        {t("Save")}
                      </GradientButton>
                      <GradientButton
                        onClick={() => {
                          setFormMode("view");
                        }}
                        color={"primary"}
                      >
                        {t("Cancel")}
                      </GradientButton>
                    </>
                  ) : (
                    <>
                      <GradientButton
                        onClick={async () => {
                          if (rows?.[0]?.data?.ALLOW_DELETE === "N") {
                            await MessageBox({
                              messageTitle: t("ValidationFailed"),
                              message: t("CannotDeleteBackDatedEntry"),
                              buttonNames: ["Ok"],
                            });
                          } else {
                            SetDeleteRemark(true);
                          }
                        }}
                        color={"primary"}
                      >
                        {t("Remove")}
                      </GradientButton>
                      {mainData?.[0]?.ALLOW_EDIT === "Y" ? (
                        <GradientButton
                          onClick={() => {
                            setFormMode("edit");
                          }}
                          color={"primary"}
                        >
                          {t("Edit")}
                        </GradientButton>
                      ) : null}
                      {rows?.[0]?.data?.ALLOW_RENEW === "Y" ? (
                        <GradientButton
                          onClick={() => {
                            setFormMode("new");
                          }}
                          color={"primary"}
                        >
                          {t("Renew")}
                        </GradientButton>
                      ) : null}
                      <GradientButton
                        onClick={() => handleDialogClose()}
                        color={"primary"}
                      >
                        {t("Close")}
                      </GradientButton>
                    </>
                  )}
                </>
              );
            }}
          </MasterDetailsForm>
        )}
        {isDeleteRemark && (
          <RemarksAPIWrapper
            TitleText={t("EnterRemovalRemarksForInsuranceMaster")}
            onActionNo={() => SetDeleteRemark(false)}
            onActionYes={async (val, rows) => {
              const buttonName = await MessageBox({
                messageTitle: t("Confirmation"),
                message: t("DoYouWantDeleteRow"),
                buttonNames: ["No", "Yes"],
                defFocusBtnName: "Yes",
                loadingBtnName: ["Yes"],
              });
              if (buttonName === "Yes") {
                deleteInsuranceMutation.mutate({
                  _isNewRow: false,
                  _isDeleteRow: true,
                  COMP_CD: mainData?.[0]?.COMP_CD,
                  ENTERED_COMP_CD: mainData?.[0]?.ENTERED_COMP_CD,
                  ENTERED_BRANCH_CD: mainData?.[0]?.ENTERED_BRANCH_CD,
                  TRAN_CD: mainData?.[0]?.TRAN_CD,
                  ENTERED_BY: mainData?.[0]?.ENTERED_BY,
                  BRANCH_CD: mainData?.[0]?.BRANCH_CD,
                  ACCT_TYPE: mainData?.[0]?.ACCT_TYPE,
                  ACCT_CD: mainData?.[0]?.ACCT_CD,
                  INSURANCE_AMOUNT: mainData?.[0]?.INSURANCE_AMOUNT,
                  TRAN_DT: mainData?.[0]?.TRAN_DT,
                  CONFIRMED: mainData?.[0]?.CONFIRMED,
                  USER_DEF_REMARKS: val
                    ? val
                    : "WRONG ENTRY FROM INSURANCE ENTRY (RPT/70)",

                  ACTIVITY_TYPE: "INSURANCE ENTRY SCREEN",
                  DETAILS_DATA: {
                    isNewRow: [],
                    isDeleteRow: [...mainData?.detailData],
                    isUpdatedRow: [],
                  },
                });
              }
            }}
            isEntertoSubmit={true}
            AcceptbuttonLabelText="Ok"
            CanceltbuttonLabelText="Cancel"
            open={isDeleteRemark}
            defaultValue={"WRONG ENTRY FROM INSURANCE MASTER"}
            rows={undefined}
          />
        )}
      </Dialog>
    </>
  );
};
