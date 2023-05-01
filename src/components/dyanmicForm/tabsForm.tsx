import { Suspense, Fragment, useState, useRef, cloneElement } from "react";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { Alert } from "components/common/alert";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import { useRecoilValue } from "recoil";
import {
  formFieldsExcludedAtom,
  formFieldsErrorWatcherAtom,
} from "packages/form";
import Grid from "@material-ui/core/Grid";
import { isGroupExcluded, isGroupHavingError } from "./groupUtils";
import Container from "@material-ui/core/Container";

export const TabsFormWrapper = ({
  fields,
  formRenderConfig,
  formName,
  children,
  formStyle,
  hidden,
  formDisplayLabel,
  displayMode,
  hideDisplayModeInTitle,
  wrapperChild,
  serverSentError,
  serverSentErrorDetail,
  isSubmitting,
  classes,
  handleSubmit,
  defaultActiveStep = 0,
  hideHeader = false,
}) => {
  const [activeStep, setActiveStep] = useState(defaultActiveStep);
  const { current: fieldGroups } = useRef<string[]>(Object.keys(fields).sort());

  return (
    <Container component="main" style={{ display: hidden ? "none" : "block" }}>
      {hideHeader ? null : (
        <TabsFormTitle
          formDisplayLabel={formDisplayLabel}
          displayMode={displayMode}
          hideDisplayModeInTitle={hideDisplayModeInTitle}
          wrapperChild={wrapperChild}
          serverSentError={serverSentError}
          serverSentErrorDetail={serverSentErrorDetail}
          isSubmitting={isSubmitting}
          classes={classes}
          handleSubmit={handleSubmit}
        />
      )}

      <TabsRenderer
        formName={formName}
        fields={fields}
        fieldGroups={fieldGroups}
        formRenderConfig={formRenderConfig}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />
      <div style={{ ...formStyle }}>
        <FieldsToRender
          fields={fields}
          fieldGroups={fieldGroups}
          formRenderConfig={formRenderConfig}
          activeStep={activeStep}
          tabsRenderer={children}
        />
      </div>
    </Container>
  );
};

export const TabsFormTitle = ({
  formDisplayLabel,
  displayMode,
  hideDisplayModeInTitle,
  wrapperChild,
  serverSentError,
  serverSentErrorDetail,
  isSubmitting,
  classes,
  handleSubmit,
}) => (
  <AppBar position="relative" color="secondary">
    <Toolbar variant="dense">
      <Typography component="div" variant="h6">
        {formDisplayLabel}
        {Boolean(displayMode) && !Boolean(hideDisplayModeInTitle) ? (
          <Chip
            style={{ color: "white", marginLeft: "8px" }}
            variant="outlined"
            color="primary"
            size="small"
            label={`${displayMode} mode`}
          />
        ) : (
          ""
        )}
      </Typography>
      <div className={classes.formControlLabelSpacer} />
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
  </AppBar>
);

export const TabsRenderer = ({
  fields,
  formName,
  fieldGroups,
  formRenderConfig,
  activeStep,
  setActiveStep,
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
    <Tabs value={Number(activeStep)} variant="scrollable" scrollButtons="auto">
      {filteredFieldGroups.map((field) => {
        return (
          <Tab
            value={Number(field.index)}
            key={field.name}
            label={field.name}
            onClick={() => setActiveStep(Number(field.index))}
            style={field.hasError ? { color: "red" } : {}}
          />
        );
      })}
    </Tabs>
  );
};

export const FieldsToRender = ({
  fields,
  activeStep,
  fieldGroups,
  formRenderConfig,
  tabsRenderer,
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
  return (
    <Fragment>
      {typeof tabsRenderer === "function" ? (
        tabsRenderer({ steps })
      ) : (
        <Suspense fallback={<div>Loading...</div>}>{steps}</Suspense>
      )}
    </Fragment>
  );
};
