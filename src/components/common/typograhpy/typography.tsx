import { Grid, GridProps, Typography, TypographyProps } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { InputLabel } from "components/styledComponent/inputLabel";
import {
  UseFieldHookProps,
  useField,
  transformDependentFieldsState,
} from "packages/form";
import { FC, Fragment, useEffect } from "react";

const useStyles: any = makeStyles({
  root: {
    "& .MuiInputBase-root.MuiOutlinedInput-root input": {
      padding: "8px 7px",
    },
    "& .css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
      borderColor: "1px solid #BABABA",
    },
  },

  labelStyle: {
    color: "rgba(0, 0, 0, 0.6)",
    fontSize: "0.875rem",
    lineHeight: "1.4375em",
    fontWeight: "600",
    transform: "translate(0, 1.5px) scale(1)",
    marginBottom: "8px",
    maxWidth: "calc(133% - 32px)",
  },
});
export interface AllTypographyProps {
  TypographyProps?: TypographyProps;
  GridProps?: GridProps;
  name: string;
  label: string;
  fieldKey: string;
  setValueOnDependentFieldsChange?: Function;
}

export type MyTypographyAllProps = UseFieldHookProps & AllTypographyProps;

const MyTypography: FC<MyTypographyAllProps> = ({
  name: fieldName,
  fieldKey: fieldID,
  TypographyProps,
  GridProps,
  label,
  dependentFields,
  shouldExclude,
  setValueOnDependentFieldsChange,
}) => {
  const classes = useStyles();

  const {
    value,
    handleChange,
    name,
    excluded,
    dependentValues,
    incomingMessage,
  } = useField({
    name: fieldName,
    fieldKey: fieldID,
    dependentFields,
    shouldExclude,
  });

  useEffect(() => {
    if (typeof setValueOnDependentFieldsChange === "function") {
      let result = setValueOnDependentFieldsChange(
        transformDependentFieldsState(dependentValues)
      );
      if (result !== undefined && result !== null) {
        handleChange(result);
      }
    }
  }, [dependentValues, handleChange, setValueOnDependentFieldsChange]);

  // update by altaf
  useEffect(() => {
    if (incomingMessage !== null && typeof incomingMessage === "object") {
      const { value } = incomingMessage;

      if (Boolean(value) || value === "") {
        handleChange(value);
      }
    }
  }, [incomingMessage, handleChange]);

  if (excluded) {
    return null;
  }
  return (
    <Fragment key={name}>
      <Grid {...GridProps}>
        {/* <InputLabel className={classes.labelStyle}>{label}</InputLabel> */}
        {/* <Typography {...TypographyProps}>{label}</Typography> */}
        <Typography variant="h6" style={undefined} {...TypographyProps}>
          {value || label}
        </Typography>
      </Grid>
    </Fragment>
  );
};

export default MyTypography;
