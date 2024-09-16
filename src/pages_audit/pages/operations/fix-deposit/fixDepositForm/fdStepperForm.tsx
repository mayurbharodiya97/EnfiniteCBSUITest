import {
  AppBar,
  Box,
  Button,
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
  styled,
} from "@mui/material";
import { useContext, useRef, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { GradientButton } from "components/styledComponent/button";
import { SubmitFnType } from "packages/form";
import { useSnackbar } from "notistack";
import { useMutation } from "react-query";
import * as API from "../api";
import { cloneDeep } from "lodash";
import { usePopupContext } from "components/custom/popupContext";
import {
  ColorlibConnector,
  ColorlibStepIconRoot,
} from "components/dyanmicForm/stepperForm/style";
import { utilFunction } from "components/utils";
import { useLocation } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { FDContext } from "../context/fdContext";
import { FDDetailForm } from "./fdDetailForm";
import { TransferAcctDetailForm } from "./trnsAcctDtlForm";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@mui/styles";
import { isValidDate } from "components/utils/utilFunctions/function";
import { format } from "date-fns";

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

export const FixDepositForm = ({ defaultView, closeDialog }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const {
    FDState,
    setActiveStep,
    updateFDParaDataOnChange,
    updateFDDetailsFormData,
    updateSourceAcctFormData,
    resetAllData,
    setIsBackButton,
  } = useContext(FDContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  let currentPath = useLocation().pathname;
  const [steps, setSteps] = useState([
    "Fixed Deposit Detail(s)",
    "Source A/C Detail(s)",
  ]);
  const fdDetailsformRef: any = useRef(null);
  const sourceAcctformRef: any = useRef(null);
  const { authState } = useContext(AuthContext);
  const headerClasses = useTypeStyles();
  const { state: rows }: any = useLocation();

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;
    // Object mapping step numbers to corresponding icons
    const icons: { [index: string]: React.ReactElement } = {
      1: <SettingsIcon />,
      2: <PersonAddIcon />,
      3: <VideoLabelIcon />,
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
    onSuccess: (data) => {
      enqueueSnackbar(data, {
        variant: "success",
      });
      // isDataChangedRef.current = true;
      CloseMessageBox();
      // closeDialog();
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
            messageTitle: "ValidationFailed",
            message: response?.O_MESSAGE ?? "",
            icon: "ERROR",
          });
        } else if (response?.O_STATUS === "9") {
          await MessageBox({
            messageTitle: "Alert",
            message: response?.O_MESSAGE ?? "",
            icon: "WARNING",
          });
        } else if (response?.O_STATUS === "99") {
          const buttonName = await MessageBox({
            messageTitle: "Confirmation",
            message: response?.O_MESSAGE ?? "",
            buttonNames: ["Yes", "No"],
            defFocusBtnName: "Yes",
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
      TRAN_DT: isValidDate(obj.TRAN_DT)
        ? format(new Date(obj.TRAN_DT), "dd/MMM/yyyy")
        : "",
      MATURITY_DT: isValidDate(obj.MATURITY_DT)
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
            message: "Total amount can't be Zero/Negative.",
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
        messageTitle: t("ValidationFailed"),
        message: "At least one row is required.",
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

    console.log("data", data);

    const newData = data?.TRNDTLS?.map((obj) => ({
      ...obj,
      CHEQUE_DT: isValidDate(obj.CHEQUE_DATE)
        ? format(new Date(obj.CHEQUE_DATE), "dd/MMM/yyyy")
        : "",
    }));

    if (parseFloat(data?.TOTAL_DR_AMOUNT) <= 0) {
      MessageBox({
        messageTitle: t("ValidationFailed"),
        message: "Total debit amount can't be Zero/Negative.",
        icon: "ERROR",
      });
    } else if (
      parseFloat(data?.TOTAL_DR_AMOUNT) !== parseFloat(data?.TOTAL_FD_AMOUNT)
    ) {
      MessageBox({
        messageTitle: t("ValidationFailed"),
        message: "Total debit amount should be equal to total FD amount.",
        icon: "ERROR",
      });
    } else if (parseFloat(data?.DIFF_AMOUNT) === 0) {
      const buttonName = await MessageBox({
        messageTitle: "Confirmation",
        message: "Are you sure create FD?",
        buttonNames: ["Yes", "No"],
        defFocusBtnName: "Yes",
        loadingBtnName: ["Yes"],
      });
      if (buttonName === "Yes") {
        saveFDDetailsMutation.mutate({
          TRANSACTION_DTL: [...newData],
          FD_DETAIL_DATA: [...FDState?.fdDetailFormData?.FDDTL],
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
            <GradientButton onClick={closeDialog}>{t("Close")}</GradientButton>
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
