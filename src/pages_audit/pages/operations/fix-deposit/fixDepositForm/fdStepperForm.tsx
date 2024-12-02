import {
  AppBar,
  Box,
  CircularProgress,
  Dialog,
  Stack,
  Step,
  StepIconProps,
  StepLabel,
  Stepper,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import { useContext, useRef, useState } from "react";
import { useMutation } from "react-query";
import * as API from "../api";
import { useLocation } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { FDContext } from "../context/fdContext";
import { FDDetailForm } from "./fdDetailForm";
import { TransferAcctDetailForm } from "./trnsAcctDtlForm";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@mui/styles";
import {
  ColorlibConnector,
  ColorlibStepIconRoot,
  GradientButton,
  usePopupContext,
  utilFunction,
  SubmitFnType,
} from "@acuteinfo/common-base";
import { format } from "date-fns";
import CommonSvgIcons from "assets/icons/commonSvg/commonSvgIcons";
const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--theme-color2)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  formHeaderTitle: {
    margin: "0",
    fontWeight: "500",
    fontSize: "1.25rem",
    lineHeight: "1.6",
    letterSpacing: "0.0075em",
    color: "var(--theme-color2)",
  },
}));

export const FixDepositForm = ({
  defaultView,
  handleDialogClose,
  isDataChangedRef,
}) => {
  const { t } = useTranslation();
  const {
    FDState,
    setActiveStep,
    updateFDDetailsFormData,
    updateSourceAcctFormData,
    setIsBackButton,
  } = useContext(FDContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  let currentPath = useLocation().pathname;
  const [steps, setSteps] = useState([
    t("FixedDepositDetails"),
    t("SourceACDetails"),
  ]);
  const fdDetailsformRef: any = useRef(null);
  const sourceAcctformRef: any = useRef(null);
  const { authState } = useContext(AuthContext);
  const headerClasses = useTypeStyles();

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;
    // Object mapping step numbers to corresponding icons
    const icons: { [index: string]: React.ReactElement } = {
      1: <CommonSvgIcons iconName={"LIEN"} />,
      2: <CommonSvgIcons iconName={"ACHOW"} />,
    };

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  //Mutation for Save new FD details
  const saveFDDetailsMutation = useMutation(API.saveFDDetails, {
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
    onSuccess: async (data) => {
      for (const response of data ?? []) {
        if (response?.O_STATUS === "999") {
          await MessageBox({
            messageTitle: response?.O_MSG_TITLE?.length
              ? response?.O_MSG_TITLE
              : "ValidationFailed",
            message: response?.O_MESSAGE ?? "",
            icon: "ERROR",
          });
        } else if (response?.O_STATUS === "9") {
          await MessageBox({
            messageTitle: response?.O_MSG_TITLE?.length
              ? response?.O_MSG_TITLE
              : "Alert",
            message: response?.O_MESSAGE ?? "",
            icon: "WARNING",
          });
        } else if (response?.O_STATUS === "99") {
          const buttonName = await MessageBox({
            messageTitle: response?.O_MSG_TITLE?.length
              ? response?.O_MSG_TITLE
              : "Confirmation",
            message: response?.O_MESSAGE ?? "",
            buttonNames: ["Yes", "No"],
            defFocusBtnName: "Yes",
            icon: "CONFIRM",
          });
          if (buttonName === "No") {
            break;
          }
        } else if (response?.O_STATUS === "0") {
          isDataChangedRef.current = true;
          CloseMessageBox();
          handleDialogClose();
        }
      }
    },
  });

  //Mutation for Validate new FD details
  const validateFDDetailsMutation = useMutation(API.validateFDDetails, {
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
    onSuccess: async (data) => {
      for (const response of data ?? []) {
        if (response?.O_STATUS === "999") {
          await MessageBox({
            messageTitle: response?.O_MSG_TITLE?.length
              ? response?.O_MSG_TITLE
              : "ValidationFailed",
            message: response?.O_MESSAGE ?? "",
            icon: "ERROR",
          });
        } else if (response?.O_STATUS === "9") {
          await MessageBox({
            messageTitle: response?.O_MSG_TITLE?.length
              ? response?.O_MSG_TITLE
              : "Alert",
            message: response?.O_MESSAGE ?? "",
            icon: "WARNING",
          });
        } else if (response?.O_STATUS === "99") {
          const buttonName = await MessageBox({
            messageTitle: response?.O_MSG_TITLE?.length
              ? response?.O_MSG_TITLE
              : "Confirmation",
            message: response?.O_MESSAGE ?? "",
            buttonNames: ["Yes", "No"],
            defFocusBtnName: "Yes",
            icon: "CONFIRM",
          });
          if (buttonName === "No") {
            break;
          }
        } else if (response?.O_STATUS === "0") {
          setActiveStep(FDState.activeStep + 1);
        }
      }
    },
  });

  const handleComplete = (e) => {
    if (FDState.activeStep === 0) {
      fdDetailsformRef.current?.handleSubmit(e);
    } else if (FDState.activeStep === 1) {
      sourceAcctformRef.current?.handleSubmit(e);
    }
  };

  // Detail form validate handler
  const detailsFormSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    endSubmit(true);

    const newData = data?.FDDTL?.map((obj) => ({
      ...obj,
      TRAN_DT: obj.TRAN_DT ? format(new Date(obj.TRAN_DT), "dd/MMM/yyyy") : "",
      MATURITY_DT: obj.MATURITY_DT
        ? format(new Date(obj.MATURITY_DT), "dd/MMM/yyyy")
        : "",
    }));

    if (Boolean(data?.FDDTL?.length)) {
      updateFDDetailsFormData([...newData]);
      updateSourceAcctFormData([
        {
          ACCT_NAME: "",
        },
      ]);
      const dataArray = Array.isArray(data?.FDDTL) ? data?.FDDTL : [];
      if (dataArray?.length > 0) {
        if (
          !Boolean(data?.TOTAL_FD_AMOUNT) ||
          parseFloat(data?.TOTAL_FD_AMOUNT ?? 0) <= 0
        ) {
          MessageBox({
            messageTitle: t("ValidationFailed"),
            message: "TotalAmountCantbeZeroNegative",
            icon: "ERROR",
          });
        } else {
          await validateFDDetailsMutation.mutate({
            FD_DETAIL_DATA: [...newData],
            SCREEN_REF: "RPT/401",
          });
        }
      }
    } else {
      MessageBox({
        messageTitle: "ValidationFailed",
        message: "AtLeastOneRowRequired",
        icon: "ERROR",
      });
    }
  };

  const finalOnSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    endSubmit(true);

    const newData = data?.TRNDTLS?.map((obj) => ({
      ...obj,
      CHEQUE_DT: obj.CHEQUE_DATE
        ? format(new Date(obj.CHEQUE_DATE), "dd/MMM/yyyy")
        : "",
    }));

    if (parseFloat(data?.TOTAL_DR_AMOUNT) <= 0) {
      MessageBox({
        messageTitle: "ValidationFailed",
        message: "TotalDebitAmountCantBeZeroNegative",
        icon: "ERROR",
      });
    } else if (
      parseFloat(data?.TOTAL_DR_AMOUNT) !== parseFloat(data?.TOTAL_FD_AMOUNT)
    ) {
      MessageBox({
        messageTitle: "ValidationFailed",
        message: "TotalDebitAmountShouldBeEqualToTotalFDAmount",
        icon: "ERROR",
      });
    } else if (parseFloat(data?.DIFF_AMOUNT) === 0) {
      const buttonName = await MessageBox({
        messageTitle: "Confirmation",
        message: "Proceed?",
        buttonNames: ["Yes", "No"],
        defFocusBtnName: "Yes",
        loadingBtnName: ["Yes"],
        icon: "CONFIRM",
      });

      const fdDetailData = FDState?.fdDetailFormData?.FDDTL || [];
      const reorderedData = [...fdDetailData].sort((a, b) => {
        if (a.cd && !b.cd) return 1;
        if (!a.cd && b.cd) return -1;
        return 0;
      });

      if (buttonName === "Yes") {
        saveFDDetailsMutation.mutate({
          TRANSACTION_DTL: [...newData],
          FD_DETAIL_DATA: reorderedData,
          SCREEN_REF: "RPT/401",
        });
      }
    }
  };
  return (
    <>
      <Dialog
        open={true}
        fullWidth={true}
        PaperProps={{
          style: {
            width: "100%",
            overflow: "auto",
            position: "relative",
            padding: "10px",
          },
        }}
        maxWidth="xl"
      >
        <AppBar position="relative" style={{ marginBottom: "10px" }}>
          <Toolbar variant="dense" className={headerClasses.root}>
            <Typography
              component="span"
              variant="h5"
              className={headerClasses.title}
            >
              {`${utilFunction.getDynamicLabel(
                currentPath,
                authState?.menulistdata,
                true
              )} of A/c No.: ${
                FDState?.retrieveFormData?.BRANCH_CD?.trim() ?? ""
              }-${FDState?.retrieveFormData?.ACCT_TYPE?.trim() ?? ""}-${
                FDState?.retrieveFormData?.ACCT_CD?.trim() ?? ""
              } ${FDState?.retrieveFormData?.ACCT_NM?.trim() ?? ""}`}
            </Typography>
            <GradientButton onClick={handleDialogClose}>
              {t("Close")}
            </GradientButton>
          </Toolbar>
        </AppBar>
        <Stack sx={{ width: "100%", position: "relative" }} spacing={4}>
          <Stepper
            alternativeLabel
            activeStep={FDState.activeStep}
            connector={<ColorlibConnector />}
          >
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel
                  StepIconComponent={ColorlibStepIcon}
                  componentsProps={{
                    label: {
                      style: { marginTop: "2px", color: "var(--theme-color1)" },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          <div style={{ marginTop: "0px" }}>
            {FDState.activeStep === 0 ? (
              <FDDetailForm
                ref={fdDetailsformRef}
                defaultView={defaultView}
                detailsFormSubmitHandler={detailsFormSubmitHandler}
              />
            ) : FDState.activeStep === 1 ? (
              <TransferAcctDetailForm
                onSubmitHandler={finalOnSubmitHandler}
                ref={sourceAcctformRef}
              />
            ) : (
              <></>
            )}
          </div>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              margin: "0px !important",
            }}
          >
            {FDState?.activeStep !== steps.length && (
              <>
                {FDState?.activeStep !== steps.length - 1 ? (
                  <GradientButton
                    onClick={handleComplete}
                    endIcon={
                      validateFDDetailsMutation?.isLoading ? (
                        <CircularProgress size={20} />
                      ) : null
                    }
                    disabled={validateFDDetailsMutation?.isLoading}
                    color={"primary"}
                  >
                    {t("Next")}
                  </GradientButton>
                ) : (
                  <GradientButton onClick={handleComplete}>
                    {t("Finish")}
                  </GradientButton>
                )}
              </>
            )}
            {FDState?.activeStep === 0 ? null : (
              <GradientButton
                onClick={() => {
                  setIsBackButton(true);
                  setActiveStep(FDState?.activeStep - 1);
                }}
              >
                {t("Back")}
              </GradientButton>
            )}
          </Box>
        </Stack>
      </Dialog>
    </>
  );
};