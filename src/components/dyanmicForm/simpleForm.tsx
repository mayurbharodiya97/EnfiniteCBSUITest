import { FC, useRef, Suspense } from "react";
import { FormProps } from "./types";
import { Alert } from "components/common/alert";
import {
  AppBar,
  Chip,
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";

export const SimpleForm: FC<FormProps> = ({
  fields,
  formRenderConfig,
  children,
}) => {
  const fieldGroups = useRef<string[]>(Object.keys(fields).sort());
  const formComponentGroupWise = fieldGroups.current.map((one) => {
    const current = fields[one];
    return current.fields;
  });
  const fieldsToRender = formComponentGroupWise.reduce((accum, current) => {
    const newAccum = [...accum, ...current];
    return newAccum;
  }, []);

  return typeof children === "function" ? (
    children({
      fieldsToRender,
      spacing: formRenderConfig?.gridConfig?.container?.spacing ?? 2,
      direction: formRenderConfig?.gridConfig?.container?.direction ?? "row",
    })
  ) : (
    <Grid
      container={true}
      spacing={formRenderConfig?.gridConfig?.container?.spacing ?? 2}
      direction={formRenderConfig?.gridConfig?.container?.direction ?? "row"}
    >
      <Suspense fallback={<div>Loading...</div>}>{fieldsToRender}</Suspense>
    </Grid>
  );
};

export const SimpleFormWrapper = ({
  fields,
  formRenderConfig,
  formName,
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
  controlsAtBottom,
  hideHeader,
  containerstyle = {},
}) => (
  <Container
    component="main"
    style={{ display: hidden ? "none" : "block", ...containerstyle }}
  >
    {hideHeader ? null : (
      <SimpleFormTitle
        formDisplayLabel={formDisplayLabel}
        displayMode={displayMode}
        hideDisplayModeInTitle={hideDisplayModeInTitle}
        wrapperChild={wrapperChild}
        serverSentError={serverSentError}
        serverSentErrorDetail={serverSentErrorDetail}
        isSubmitting={isSubmitting}
        classes={classes}
        handleSubmit={handleSubmit}
        controlsAtBottom={controlsAtBottom}
      />
    )}
    <div style={{ ...formStyle, paddingTop: "10px" }}>
      <SimpleForm
        key={`${formName}-simple`}
        fields={fields}
        formRenderConfig={formRenderConfig}
        formName={formName}
      >
        {({ spacing, direction, fieldsToRender }) => (
          <div>
            <Grid container={true} spacing={spacing} direction={direction}>
              <Suspense fallback={<div>Loading...</div>}>
                {fieldsToRender}
              </Suspense>
            </Grid>
          </div>
        )}
      </SimpleForm>
      {controlsAtBottom && (
        <BottomControl
          wrapperChild={wrapperChild}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
          classes={classes}
        />
      )}
    </div>
  </Container>
);

export const BottomControl = ({
  wrapperChild,
  isSubmitting,
  handleSubmit,
  classes,
}) => (
  <Toolbar variant="dense" disableGutters>
    <div className={classes.formControlLabelSpacer} />
    {typeof wrapperChild === "function"
      ? wrapperChild({ isSubmitting, handleSubmit })
      : wrapperChild}
  </Toolbar>
);

export const SimpleFormTitle = ({
  formDisplayLabel,
  displayMode,
  hideDisplayModeInTitle,
  wrapperChild,
  serverSentError,
  serverSentErrorDetail,
  isSubmitting,
  classes,
  handleSubmit,
  controlsAtBottom,
}) => (
  <AppBar position="relative">
    <Toolbar variant="dense" style={{ background: "var(--theme-color5)" }}>
      <Typography component="div" variant="h6" color="primary">
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
      {!controlsAtBottom
        ? typeof wrapperChild === "function"
          ? wrapperChild({ isSubmitting, handleSubmit })
          : wrapperChild
        : null}
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
