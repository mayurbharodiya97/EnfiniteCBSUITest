import { forwardRef, useState } from "react";
import { PayslipAndDDFormMetaData } from "./metaData/payslipAndDDMetaData";
import {
  InitialValuesType,
  extractMetaData,
  FormWrapper,
  MetaDataType,
  usePopupContext,
  GradientButton,
} from "@acuteinfo/common-base";
import { CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";

export const PayslipAndDDForm = forwardRef<any, any>(
  (
    {
      defaultView,
      accountDetailsForPayslip,
      onSubmitHandler,
      handleDialogClose,
      hideHeader,
    },
    ref: any
  ) => {
    const { MessageBox } = usePopupContext();
    const [formMode, setFormMode] = useState(defaultView);
    const { t } = useTranslation();

    return (
      <>
        <FormWrapper
          key={"payslipAndDDForm" + accountDetailsForPayslip}
          metaData={
            extractMetaData(
              PayslipAndDDFormMetaData,
              defaultView
            ) as MetaDataType
          }
          hideHeader={hideHeader ?? true}
          initialValues={{ ...accountDetailsForPayslip } as InitialValuesType}
          onSubmitHandler={onSubmitHandler}
          ref={ref}
          formState={{
            MessageBox: MessageBox,
            accountDetailsForPayslip: accountDetailsForPayslip,
          }}
          formStyle={{
            background: "white",
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              {formMode === "edit" ? (
                <>
                  <GradientButton
                    onClick={(event) => {
                      handleSubmit(event, "Save");
                    }}
                    disabled={isSubmitting}
                    endIcon={
                      isSubmitting ? <CircularProgress size={20} /> : null
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
              ) : formMode === "new" ? (
                <>
                  <GradientButton
                    onClick={(event) => {
                      handleSubmit(event, "Save");
                    }}
                    disabled={isSubmitting}
                    endIcon={
                      isSubmitting ? <CircularProgress size={20} /> : null
                    }
                    color={"primary"}
                  >
                    {t("Save")}
                  </GradientButton>

                  <GradientButton onClick={handleDialogClose} color={"primary"}>
                    {t("Close")}
                  </GradientButton>
                </>
              ) : (
                <>
                  <GradientButton
                    onClick={() => {
                      setFormMode("edit");
                    }}
                    color={"primary"}
                  >
                    {t("Edit")}
                  </GradientButton>
                  <GradientButton onClick={handleDialogClose} color={"primary"}>
                    {t("Close")}
                  </GradientButton>
                </>
              )}
            </>
          )}
        </FormWrapper>
      </>
    );
  }
);
