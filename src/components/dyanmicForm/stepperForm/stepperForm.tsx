import { Suspense, useState, useRef, cloneElement } from "react";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { Alert } from "components/common/alert";
import { useRecoilValue } from "recoil";
import {
  formFieldsExcludedAtom,
  formFieldsErrorWatcherAtom,
} from "packages/form";
import { useStyles } from "../style";
import { isGroupExcluded, isGroupHavingError } from "../groupUtils";
import {
  getPrevActiveStep,
  getNextActiveStep,
  isLastActiveStep,
} from "./utils";

export const StepperWrapper = ({
  fields,
  formRenderConfig,
  formName,
  handleSubmit,
  handleSubmitPartial,
  formDisplayLabel,
  hidden,
  defaultActiveStep = 0,
  wrapperChild,
  classes: parentClasses,
  children = undefined,
  isSubmitting,
  serverSentError,
  serverSentErrorDetail,
}) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(defaultActiveStep);
  const { current: fieldGroups } = useRef<string[]>(Object.keys(fields).sort());
  return (
    <Container
      component="main"
      style={{ display: hidden ? "none" : "block", paddingTop: "16px" }}
    >
      <Toolbar variant="dense">
        <Typography component="h3" className={classes.title}>
          {formDisplayLabel}
        </Typography>
        <div className={parentClasses.formControlLabelSpacer} />
        {typeof wrapperChild === "function"
          ? wrapperChild({ isSubmitting, handleSubmit })
          : wrapperChild}
      </Toolbar>
      {!isSubmitting && Boolean(serverSentError) ? (
        <Alert
          severity="error"
          errorMsg={serverSentError}
          errorDetail={serverSentErrorDetail}
        />
      ) : null}
      <div className={classes.form}>
        <Steps
          activeStep={activeStep}
          formRenderConfig={formRenderConfig}
          classes={classes}
          fieldGroups={fieldGroups}
          formName={formName}
          fields={fields}
        />
        <FieldsRenderer
          stepsRenderer={children}
          fieldGroups={fieldGroups}
          fields={fields}
          formRenderConfig={formRenderConfig}
          activeStep={activeStep}
        />
        <StepsController
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          formRenderConfig={formRenderConfig}
          classes={classes}
          fieldGroups={fieldGroups}
          formName={formName}
          fields={fields}
          handleSubmit={handleSubmit}
          handleSubmitPartial={handleSubmitPartial}
        />
      </div>
    </Container>
  );
};

export const Steps = ({
  activeStep,
  formRenderConfig,
  classes,
  fieldGroups,
  formName,
  fields,
}) => {
  const defaultGroupName = "DefaultGroup";

  const excludedFields = useRecoilValue(formFieldsExcludedAtom(formName));
  const errorWatcherFields = useRecoilValue(
    formFieldsErrorWatcherAtom(formName)
  );
  const fieldGroupsActiveStatus = fieldGroups.map((one) => {
    let groupName = defaultGroupName;
    if (typeof formRenderConfig.groups === "object") {
      groupName = formRenderConfig.groups[one];
    }
    return {
      index: one,
      name: groupName,
      status: isGroupExcluded(formName, fields[one].fieldNames, excludedFields),
      hasError: isGroupHavingError(
        formName,
        fields[one].fieldNames,
        errorWatcherFields
      ),
    };
  });
  const filteredFieldGroups = fieldGroupsActiveStatus.filter(
    (one) => one.status
  );

  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {filteredFieldGroups.map((field) => {
          return (
            <Step key={field.name}>
              <StepLabel error={field.hasError}>{field.name}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div className={classes.stepperLabel}>
        <Typography component="h4" className={classes.subTitle}>
          {typeof formRenderConfig.groups === "object"
            ? formRenderConfig.groups[fieldGroups[activeStep]]
            : defaultGroupName}
        </Typography>
      </div>
    </>
  );
};

export const FieldsRenderer = ({
  activeStep,
  fields,
  fieldGroups,
  formRenderConfig,
  stepsRenderer,
}) => {
  const steps = fieldGroups.map((one, index) => {
    const current = fields[one];
    current.fields[0] = cloneElement(current.fields[0], {
      isFieldFocused: index === activeStep ? true : false,
    });
    const hideMe = index !== Number(activeStep) ? { display: "none" } : {};
    return (
      <Grid
        key={one}
        container={true}
        spacing={formRenderConfig?.gridConfig?.container?.spacing ?? 2}
        direction={formRenderConfig?.gridConfig?.container?.direction ?? "row"}
        style={hideMe}
      >
        {current.fields}
      </Grid>
    );
  });
  return typeof stepsRenderer === "function" ? (
    stepsRenderer({ steps })
  ) : (
    <Suspense fallback={<div>Loading...</div>}>{steps}</Suspense>
  );
};

export const StepsController = ({
  activeStep,
  formName,
  fieldGroups,
  formRenderConfig,
  fields,
  handleSubmitPartial,
  handleSubmit,
  setActiveStep,
  classes,
}) => {
  const defaultGroupName = "DefaultGroup";

  const excludedFields = useRecoilValue(formFieldsExcludedAtom(formName));
  const errorWatcherFields = useRecoilValue(
    formFieldsErrorWatcherAtom(formName)
  );
  const fieldGroupsActiveStatus = fieldGroups.map((one) => {
    let groupName = defaultGroupName;
    if (typeof formRenderConfig.groups === "object") {
      groupName = formRenderConfig.groups[one];
    }
    return {
      index: one,
      name: groupName,
      status: isGroupExcluded(formName, fields[one].fieldNames, excludedFields),
      hasError: isGroupHavingError(
        formName,
        fields[one].fieldNames,
        errorWatcherFields
      ),
    };
  });

  const handleNext = async () => {
    if (!isLastActiveStep(activeStep, fieldGroupsActiveStatus)) {
      const currentStep = fieldGroupsActiveStatus[activeStep];
      const currentFieldsToValidate = fields[currentStep.index].fieldNames;
      let hasError = await handleSubmitPartial(currentFieldsToValidate);
      //In debug mode allow to move to next step without validating
      if (process.env.REACT_APP_DEBUG_MODE === "true") {
        hasError = false;
      }
      if (!hasError) {
        const nextStep = getNextActiveStep(activeStep, fieldGroupsActiveStatus);
        setActiveStep(nextStep);
      }
    }
  };
  const handlePrev = () => {
    if (activeStep > 0) {
      let step = getPrevActiveStep(activeStep, fieldGroupsActiveStatus);
      setActiveStep(step);
    }
  };
  return (
    <div className={classes.stepper}>
      {activeStep === 0 ? null : (
        <Button type="button" onClick={handlePrev} className={classes.submit}>
          {formRenderConfig?.labels?.prev ?? "Back"}
        </Button>
      )}
      {!isLastActiveStep(activeStep, fieldGroupsActiveStatus) ? (
        <Button type="button" className={classes.submit} onClick={handleNext}>
          {formRenderConfig?.labels?.next ?? "Next"}
        </Button>
      ) : (
        <Button type="button" className={classes.submit} onClick={handleSubmit}>
          {formRenderConfig?.labels?.complete ?? "Submit"}
        </Button>
      )}
    </div>
  );
};
