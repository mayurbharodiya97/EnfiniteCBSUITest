import { forwardRef, useContext, useEffect, useRef, useState } from "react";
import { FixDepositDetailFormMetadata } from "./metaData/fdDetailMetaData";
import { FDContext } from "../context/fdContext";
import { useLocation } from "react-router-dom";
import * as API from "../api";
import {
  extractMetaData,
  usePopupContext,
  GradientButton,
  InitialValuesType,
  utilFunction,
  SubmitFnType,
  MetaDataType,
  FormWrapper,
} from "@acuteinfo/common-base";
import { CircularProgress } from "@mui/material";
import { useMutation } from "react-query";
import { useTranslation } from "react-i18next";
import { enqueueSnackbar } from "notistack";
import { AuthContext } from "pages_audit/auth";
export const FDDetailForm = forwardRef<any, any>(
  (
    {
      defaultView,
      handleDialogClose,
      screenFlag,
      detailsFormSubmitHandler,
      isDataChangedRef,
    },
    ref: any
  ) => {
    const {
      FDState,
      updateFDDetailsFormData,
      setActiveStep,
      updateSourceAcctFormData,
    } = useContext(FDContext);
    const { authState } = useContext(AuthContext);
    let currentPath = useLocation().pathname;
    const { t } = useTranslation();
    const [fdDtlRefresh, setFdDtlRefresh] = useState(0);
    const { MessageBox, CloseMessageBox } = usePopupContext();
    const { state: rows }: any = useLocation();
    const finalSubmitDataRef = useRef<any>(null);

    //Mutation for Validate and Update FD details
    const validAndUpdateFDDtlMutation = useMutation(API.validAndUpdateFDDtl, {
      onError: async (error: any) => {
        let errorMsg = "Unknownerroroccured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        await MessageBox({
          messageTitle: "Error",
          message: errorMsg ?? "",
          icon: "ERROR",
        });
        CloseMessageBox();
      },
      onSuccess: (data) => {
        isDataChangedRef.current = true;
        enqueueSnackbar(t("DataUpdatedSuccessfully"), {
          variant: "success",
        });
        CloseMessageBox();
        handleDialogClose();
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
      let newData = {
        CR_BRANCH_CD: data?.FDDTL?.[0]?.CR_BRANCH_CD ?? "",
        CR_ACCT_TYPE: data?.FDDTL?.[0]?.CR_ACCT_TYPE ?? "",
        CR_ACCT_CD:
          utilFunction.getPadAccountNumber(
            data?.FDDTL?.[0]?.CR_ACCT_CD,
            data?.FDDTL?.[0]?.CR_ACCT_TYPE
          ) ?? "",
        CR_ACCT_NM: data?.FDDTL?.[0]?.CR_ACCT_NM ?? "",
        MATURE_INST: data?.FDDTL?.[0]?.MATURE_INST ?? "",
        FD_NO: data?.FDDTL?.[0]?.FD_NO ?? "",
        BRANCH_CD: data?.FDDTL?.[0]?.BRANCH_CD ?? "",
        ACCT_TYPE: data?.FDDTL?.[0]?.ACCT_TYPE ?? "",
        ACCT_CD:
          utilFunction.getPadAccountNumber(
            data?.FDDTL?.[0]?.ACCT_CD,
            data?.FDDTL?.[0]?.ACCT_TYPE
          ) ?? "",
        NOMINEE_NM: data?.FDDTL?.[0]?.NOMINEE_NM ?? "",
        FD_REMARK: data?.FDDTL?.[0]?.FD_REMARK ?? "",
      };

      let oldData = {
        ...rows?.[0]?.data,
      };
      let upd = utilFunction.transformDetailsData(newData, oldData);
      console.log("upd newData", newData);
      console.log("upd oldData", oldData);
      console.log("upd ", upd);

      if (defaultView === "view" && screenFlag !== "openLienForm") {
        finalSubmitDataRef.current = {
          data: {
            ...newData,
            ...upd,
            IsNewRow: defaultView === "new" ? true : false,
            SCREEN_REF: "RPT/401",
            COMP_CD: authState?.companyID ?? "",
            PAYMENT_TYPE: rows?.[0]?.data?.INT_PAYMENT_MODE ?? "",
            ...(Number(FDState.acctNoData.DEP_FAC) > 0
              ? { UNIT_AMOUNT: rows?.[0]?.data?.UNIT_AMOUNT ?? "" }
              : {}),
          },
        };

        if (finalSubmitDataRef.current?.data?._UPDATEDCOLUMNS.length === 0) {
          return {};
        } else {
          console.log("finalSubmitDataRef", {
            ...finalSubmitDataRef.current?.data,
          });
          const btnName = await MessageBox({
            messageTitle: "Confirmation",
            message: "Proceed?",
            buttonNames: ["Yes", "No"],
            loadingBtnName: ["Yes"],
          });
          if (btnName === "Yes") {
            validAndUpdateFDDtlMutation.mutate({
              ...finalSubmitDataRef.current?.data,
            });
          }
        }
      }
    };

    useEffect(() => {
      let label = utilFunction.getDynamicLabel(
        currentPath,
        authState?.menulistdata,
        true
      );
      const label2 = `${label} of A/c No.: ${
        FDState?.retrieveFormData?.BRANCH_CD?.trim() ?? ""
      }-${FDState?.retrieveFormData?.ACCT_TYPE?.trim() ?? ""}-${
        FDState?.retrieveFormData?.ACCT_CD?.trim() ?? ""
      } ${FDState?.retrieveFormData?.ACCT_NM?.trim() ?? ""}`;
      FixDepositDetailFormMetadata.form.label = label2;
    }, []);

    useEffect(() => {
      if (defaultView === "view") {
        FixDepositDetailFormMetadata.fields[6].isDisplayCount = false;
        FixDepositDetailFormMetadata.fields[6].isRemoveButton = false;
        FixDepositDetailFormMetadata.fields[6].isScreenStyle = false;
      } else {
        FixDepositDetailFormMetadata.fields[6].isDisplayCount = true;
        FixDepositDetailFormMetadata.fields[6].isRemoveButton = true;
        FixDepositDetailFormMetadata.fields[6].isScreenStyle = true;
      }
    }, []);

    return (
      <>
        {defaultView === "view" ? (
          <FormWrapper
            key={"FixDepositDetail" + defaultView}
            metaData={
              extractMetaData(
                FixDepositDetailFormMetadata,
                defaultView
              ) as MetaDataType
            }
            initialValues={
              {
                FDDTL: [{ ...rows?.[0]?.data }],
              } as InitialValuesType
            }
            onSubmitHandler={onSubmitHandler}
            formStyle={{
              background: "white",
              paddingTop: "0px",
              border: "1px solid var(--theme-color4)",
              borderRadius: "10px",
            }}
            ref={ref}
            formState={{
              MessageBox: MessageBox,
              docCD: "RPT/401",
              defaultView: defaultView,
              screenFlag: screenFlag,
              workingDate: authState?.workingDate ?? "",
            }}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton
                  onClick={(event) => {
                    handleSubmit(event, "Save");
                  }}
                  disabled={isSubmitting}
                  endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  color={"primary"}
                >
                  {t("Save")}
                </GradientButton>
                <GradientButton
                  onClick={() => handleDialogClose()}
                  color={"primary"}
                >
                  {t("Close")}
                </GradientButton>
              </>
            )}
          </FormWrapper>
        ) : (
          <FormWrapper
            key={"FixDepositDetail" + defaultView + fdDtlRefresh}
            metaData={
              extractMetaData(
                FixDepositDetailFormMetadata,
                defaultView
              ) as MetaDataType
            }
            initialValues={
              {
                ...FDState?.fdDetailFormData,
                DOUBLE_FAC: FDState?.fdParaDetailData?.DOUBLE_FAC ?? "",
                TRAN_CD: FDState?.fdParaDetailData?.DOUBLE_TRAN ?? "",
              } as InitialValuesType
            }
            onSubmitHandler={detailsFormSubmitHandler}
            hideHeader={true}
            onFormButtonClickHandel={async (id) => {
              if (id === "ADDNEWROW") {
                const data = await ref?.current?.getFieldData();
                // let event: any = { preventDefault: () => {} };
                // ref?.current?.handleSubmit(event);
                const dataArray = Array.isArray(data?.FDDTL) ? data?.FDDTL : [];

                if (dataArray?.length === 0) {
                  updateFDDetailsFormData([
                    {
                      ACCT_NAME: "",
                    },
                  ]);
                  setFdDtlRefresh((prevVal) => prevVal + 1);
                } else if (
                  parseFloat(data?.TOTAL_FD_AMOUNT) > 0 &&
                  dataArray?.length > 0
                ) {
                  for (let i = 0; i < dataArray?.length; i++) {
                    const item = dataArray[0];
                    if (
                      !Boolean(item.BRANCH_CD.trim()) ||
                      !Boolean(item.ACCT_TYPE.trim()) ||
                      !Boolean(item.ACCT_CD.trim()) ||
                      !Boolean(item.TRAN_DT.trim()) ||
                      !Boolean(item.PERIOD_CD.trim()) ||
                      !Boolean(item.PERIOD_NO.trim()) ||
                      !Boolean(item.INT_RATE.trim()) ||
                      !Boolean(item.TERM_CD.trim()) ||
                      !Boolean(item.MATURITY_AMT.trim()) ||
                      parseFloat(data?.TOTAL_FD_AMOUNT) <= 0
                    ) {
                      return await MessageBox({
                        messageTitle: t("ValidationFailed"),
                        message: "Required value missing.",
                        icon: "ERROR",
                      });
                    } else {
                      updateFDDetailsFormData([
                        { ...data?.FDDTL?.[0] },
                        ...data?.FDDTL,
                      ]);
                      setFdDtlRefresh((prevVal) => prevVal + 1);
                    }
                  }
                }
              }
            }}
            formStyle={{
              background: "white",
              paddingTop: "0px",
              border: "1px solid var(--theme-color4)",
              borderRadius: "10px",
            }}
            ref={ref}
            formState={{
              MessageBox: MessageBox,
              docCD: "RPT/401",
              defaultView: defaultView,
              workingDate: authState?.workingDate ?? "",
            }}
          />
        )}
      </>
    );
  }
);
