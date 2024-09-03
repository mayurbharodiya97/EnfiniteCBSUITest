import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { Fragment, forwardRef, useContext, useEffect } from "react";
import { FixDepositDetailFormMetadata } from "./metaData/fdDetailMetaData";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { usePopupContext } from "components/custom/popupContext";
import { FDContext } from "../context/fdContext";
import { useLocation } from "react-router-dom";
import { GradientButton } from "components/styledComponent/button";
import { extractMetaData, utilFunction } from "components/utils";
import { AuthContext } from "pages_audit/auth";

export const FDDetailForm = forwardRef<any, any>(
  ({ doFixDepositMutation, defaultView, closeDialog, screenFlag }, ref) => {
    const { FDState, updateFDDetailsFormData, setActiveStep } =
      useContext(FDContext);
    const { MessageBox } = usePopupContext();
    const { state: rows }: any = useLocation();
    const { authState } = useContext(AuthContext);
    let currentPath = useLocation().pathname;

    const onSubmitHandler: SubmitFnType = async (
      data: any,
      displayData,
      endSubmit,
      setFieldError,
      actionFlag
    ) => {
      endSubmit(true);
      setActiveStep(FDState.activeStep + 1);
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
      if (defaultView === "view" || screenFlag === "openLienForm") {
        FixDepositDetailFormMetadata.fields[4].fixedRows = true;
        FixDepositDetailFormMetadata.fields[4].isDisplayCount = false;
      } else {
        FixDepositDetailFormMetadata.fields[4].fixedRows = false;
        FixDepositDetailFormMetadata.fields[4].isDisplayCount = true;
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
                ...FDState?.fdDetailFormData,
                DOUBLE_FAC: FDState?.fdParaDetailData?.DOUBLE_FAC,
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
            }}
          >
            <GradientButton>Save</GradientButton>
            <GradientButton onClick={() => closeDialog()}>Close</GradientButton>
          </FormWrapper>
        ) : (
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
                ...FDState?.fdDetailFormData,
                DOUBLE_FAC: FDState?.fdParaDetailData?.DOUBLE_FAC,
              } as InitialValuesType
            }
            onSubmitHandler={onSubmitHandler}
            hideHeader={true}
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
            }}
          />
        )}
      </>
    );
  }
);
