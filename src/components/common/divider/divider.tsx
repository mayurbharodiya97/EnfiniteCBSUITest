import { FC, useEffect } from "react";
import {
  useField,
  UseFieldHookProps,
  transformDependentFieldsState,
} from "packages/form";
import { Merge } from "../types";
import { Divider, Grid, GridProps, DividerProps } from "@mui/material";
import { useTranslation } from "react-i18next";

interface MyGridExtendedProps {
  GridProps?: GridProps;
  setValueOnDependentFieldsChange?: any;
  label?: string;
  DividerProps?: DividerProps;
  componentType?: string;
}

type MyDividerAllProps = Merge<DividerProps, MyGridExtendedProps>;

export type MyDividerProps = UseFieldHookProps & MyDividerAllProps;

const MyDivider: FC<MyDividerProps> = ({
  name: fieldName,
  label,
  shouldExclude,
  dependentFields,
  fieldKey: fieldID,
  GridProps,
  setValueOnDependentFieldsChange,
  skipValueUpdateFromCrossFieldWhenReadOnly,
  DividerProps,
  componentType,
}) => {
  const { value, handleChange, excluded, incomingMessage, dependentValues } =
    useField({
      name: fieldName,
      fieldKey: fieldID,
      dependentFields,
      shouldExclude,
      skipValueUpdateFromCrossFieldWhenReadOnly,
      componentType,
    });
  const { t } = useTranslation();

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
    <Grid item mt={1} xs={12} {...GridProps}>
      <Divider textAlign="left" {...DividerProps}>
        {value && value.length > 0 ? value : t(label ?? "")}
      </Divider>
    </Grid>
  );
};

export default MyDivider;
