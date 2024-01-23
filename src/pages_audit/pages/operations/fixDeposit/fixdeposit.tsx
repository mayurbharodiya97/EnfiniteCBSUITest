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
import { Fragment, useRef, useState } from "react";
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
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{
    [k: number]: boolean;
  }>({});
  const [steps, setSteps] = useState(["FD Parameters"]);
  const fdParameterRef: any = useRef(null);

  function RenderStepForm(step) {
    switch (step) {
      case 0:
        return (
          <DetailForm
            onSubmitHandler={paraOnSubmitHandler}
            ref={fdParameterRef}
          />
        );
      case 1:
        return <FixDepositDetailForm />;
      case 2:
        return <TransferAcctDetailForm />;
      default:
        return <div>Not Found</div>;
    }
  }

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

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const paraOnSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    // @ts-ignore
    endSubmit(true);
    console.log(">>data", data);
    if (data?.FD_TYPE === "E") {
      setSteps((old) => [...old, "Fixed Deposit Detail(s)"]);
    }

    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };
  const handleComplete = (e) => {
    console.log(">>activeStep", activeStep);
    console.log(">>fdParameterRef", fdParameterRef);
    if (activeStep === 0) {
      fdParameterRef.current?.handleSubmit(e);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <Fragment>
      {/* <Typography
        sx={{
          color: (theme) => theme.palette.grey[700],
          mb: (theme) => theme.spacing(0.5),
        }}
        variant="h6"
      >
        {"Fix Deposit Entry (EMST/401)"}
      </Typography> */}
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
          activeStep={activeStep}
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
        <div style={{ marginTop: "0px" }}>{RenderStepForm(activeStep)}</div>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Box sx={{ flex: "1 1 auto" }} />
          {activeStep === 0 ? null : (
            <GradientButton onClick={handleBack}>Back</GradientButton>
          )}
          {
            activeStep !== steps.length && (
              // (completed[activeStep] ? (
              //   <Typography variant="caption" sx={{ display: "inline-block" }}>
              //     Step {activeStep + 1} already completed
              //   </Typography>
              // ) : (
              <>
                {activeStep === 0 || activeStep === 1 ? (
                  <GradientButton onClick={handleComplete}>Next</GradientButton>
                ) : (
                  <GradientButton onClick={handleComplete}>
                    Finish
                  </GradientButton>
                )}
              </>
            )
            // ))
          }
        </Box>
      </Stack>
    </Fragment>
  );
};
