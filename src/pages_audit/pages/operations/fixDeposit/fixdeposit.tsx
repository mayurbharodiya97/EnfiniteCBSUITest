import {
  AppBar,
  Box,
  Button,
  Stack,
  Step,
  StepIconProps,
  StepLabel,
  Stepper,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import { Fragment, useContext, useRef, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { GradientButton } from "components/styledComponent/button";
import { DetailForm } from "./fdParameters";
import { FixDepositDetailForm } from "./fixDepositDetail";
import { TransferAcctDetailForm } from "./trnAccountDetail";
import { SubmitFnType } from "packages/form";
import { FixDepositContext } from "./fixDepositContext";

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 30,
  height: 30,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage: "var(--theme-color5)",
    // "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage: "var(--theme-color5)",
    // "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  }),
}));

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 15,
    left: "calc(-50% + 10px)",
    // right: "calc(-50% + 10px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "var(--theme-color5)",
      // "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "var(--theme-color5)",
      // "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

export const FixDepositForm = () => {
  // const [stepData, setStepData] = useState({ step: 0, fdType: "E" });
  // const [activeStep, setActiveStep] = useState(0);
  const {
    fdState,
    setActiveStep,
    updateFDAccountsFormData,
    updateFDParaDataOnChange,
  } = useContext(FixDepositContext);
  const submitEventRef = useRef(null);

  const [steps, setSteps] = useState([
    "FD Parameters",
    "Fixed Deposit Detail(s)",
    "Transfer A/C Detail(s)",
  ]);
  const fdParameterformRef: any = useRef(null);
  const fdDetailsformRef: any = useRef(null);

  const setDataOnFieldChange = (action, payload) => {
    updateFDParaDataOnChange({ [action]: payload });
    if (action === "FD_TYPE") {
      if (payload === "F") {
        setSteps([
          "FD Parameters",
          "Account Opening",
          "Fixed Deposit Detail(s)",
          "Transfer A/C Detail(s)",
        ]);
      } else {
        setSteps([
          "FD Parameters",
          "Fixed Deposit Detail(s)",
          "Transfer A/C Detail(s)",
        ]);
      }
    }
  };

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    const icons: { [index: string]: React.ReactElement } = {
      1: <SettingsIcon />,
      2: <GroupAddIcon />,
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

  const paraOnSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    updateFDAccountsFormData(data);
    console.log(">>submit2");
    setActiveStep(fdState.activeStep + 1);
  };

  const handleComplete = (e) => {
    submitEventRef.current = e;
    if (fdState.activeStep === 0) {
      fdParameterformRef.current?.handleSubmit(e);
    } else if (
      fdState.activeStep === 1 &&
      fdState?.fdParaFormData?.FD_TYPE === "E"
    ) {
      fdDetailsformRef.current?.handleSubmit(e);
    }
  };

  return (
    <Fragment>
      <AppBar position="relative" style={{ marginBottom: "10px" }}>
        <Toolbar
          variant="dense"
          style={{ background: "var(--theme-color5)", padding: "0px" }}
        >
          <Typography component="span" variant="h5" color="primary" px={2}>
            {"Fix Deposit Entry (EMST/401)"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Stack sx={{ width: "100%" }} spacing={4}>
        <Stepper
          alternativeLabel
          activeStep={fdState.activeStep}
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
          {/* {RenderStepForm(fdState.activeStep)} */}
          {fdState.activeStep === 0 ? (
            <DetailForm
              onSubmitHandler={paraOnSubmitHandler}
              setDataOnFieldChange={(action, payload) =>
                setDataOnFieldChange(action, payload)
              }
              submitEventRef={submitEventRef}
              ref={fdParameterformRef}
            />
          ) : fdState.activeStep === 1 ? (
            <FixDepositDetailForm ref={fdDetailsformRef} />
          ) : fdState.activeStep === 2 ? (
            <TransferAcctDetailForm />
          ) : (
            <></>
          )}
        </div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            pt: 2,
            marginTop: "0px !important",
            position: "relative",
          }}
        >
          <Box sx={{ flex: "1 1 auto" }} />
          <div style={{ position: "fixed", bottom: 0, right: 0 }}>
            {fdState.activeStep === 0 ? null : (
              <GradientButton
                onClick={() => setActiveStep(fdState.activeStep - 1)}
              >
                Back
              </GradientButton>
            )}
            {
              fdState.activeStep !== steps.length && (
                // (completed[activeStep] ? (
                //   <Typography variant="caption" sx={{ display: "inline-block" }}>
                //     Step {activeStep + 1} already completed
                //   </Typography>
                // ) : (
                <>
                  {fdState.activeStep !== steps.length - 1 ? (
                    <GradientButton onClick={handleComplete}>
                      Next
                    </GradientButton>
                  ) : (
                    <GradientButton onClick={handleComplete}>
                      Finish
                    </GradientButton>
                  )}
                </>
              )
              // ))
            }
          </div>
        </Box>
      </Stack>
    </Fragment>
  );
};
