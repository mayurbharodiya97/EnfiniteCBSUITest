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
  const { MessageBox } = usePopupContext();
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

  const doFixDepositMutation = useMutation(API.doFixDepositCreation, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      MessageBox({ messageTitle: "Error", message: errorMsg, icon: "ERROR" });
    },
    onSuccess: (data) => {
      //   MessageBox({ messageTitle: "Success", message: data, icon: "SUCCESS" });
      resetAllData();
    },
  });

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

  const handleComplete = (e) => {
    if (FDState.activeStep === 0) {
      fdDetailsformRef.current?.handleSubmit(e);
    } else if (FDState.activeStep === 1) {
      sourceAcctformRef.current?.handleSubmit(e);
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
    if (parseFloat(data?.DIFF_AMOUNT) < 0) {
      MessageBox({
        messageTitle: "Validation Failed",
        message: "Total Debit amount can not be greater than Total FD Amount.",
        icon: "ERROR",
      });
    } else if (parseFloat(data?.DIFF_AMOUNT) > 0) {
      const buttonName = await MessageBox({
        messageTitle: "Confirmation",
        message:
          "Debit Amount less than Total FD Amount.\nAre you sure to add new row?",
        buttonNames: ["No", "Yes"],
        defFocusBtnName: "Yes",
      });
      if (buttonName === "Yes") {
        // const lastRow = data?.TRNDTLS[data?.TRNDTLS?.length - 1];
        updateSourceAcctFormData([...data?.TRNDTLS, { ACCT_NAME: "" }]);
      }
    } else if (parseFloat(data?.DIFF_AMOUNT) === 0) {
      const buttonName = await MessageBox({
        messageTitle: "Confirmation",
        message: "Are you sure create FD?",
        buttonNames: ["No", "Yes"],
        defFocusBtnName: "Yes",
      });
      if (buttonName === "Yes") {
        // doFixDepositMutation.mutate({
        //   ...FDState?.fdParaFormData,
        //   FD_ACCOUNTS: FDState?.fdDetailFormData?.FDDTL ?? [],
        //   DR_ACCOUNTS: data?.TRNDTLS ?? [],
        // });
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
                doFixDepositMutation={doFixDepositMutation}
                ref={fdDetailsformRef}
                defaultView={defaultView}
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
                    // endIcon={
                    //   onSaveValidationMutation?.isLoading ? (
                    //     <CircularProgress size={20} />
                    //   ) : null
                    // }
                    // disabled={
                    //   onSaveValidationMutation?.isLoading ||
                    //   FDState?.disableButton
                    // }
                  >
                    {t("Next")}
                  </GradientButton>
                ) : (
                  <GradientButton
                    disabled={FDState?.disableButton}
                    onClick={handleComplete}
                  >
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
