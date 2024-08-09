import { FC, useEffect } from "react";
import {
  useField,
  UseFieldHookProps,
  transformDependentFieldsState,
} from "packages/form";
import { GridProps } from "@mui/material";

interface MyGridExtendedProps {
  GridProps?: GridProps;
  enableGrid: boolean;
  setValueOnDependentFieldsChange?: any;
}

export type MyHiddenFieldProps = UseFieldHookProps & MyGridExtendedProps;

const MyHiddenField: FC<MyHiddenFieldProps> = ({
  name: fieldName,
  fieldKey: fieldID,
  setValueOnDependentFieldsChange,
  dependentFields,
  postValidationSetCrossFieldValues,
}) => {
  const {
    handleBlur,
    handleChange,
    dependentValues,
    incomingMessage,
    runValidation,
    whenToRunValidation,
  } = useField({
    name: fieldName,
    fieldKey: fieldID,
    dependentFields,
    postValidationSetCrossFieldValues,
  });
  //set touch property to true of the field
  useEffect(() => {
    handleBlur();
  }, [handleBlur]);

  useEffect(() => {
    if (typeof setValueOnDependentFieldsChange === "function") {
      let result = setValueOnDependentFieldsChange(
        transformDependentFieldsState(dependentValues)
      );
      if (result !== undefined || result !== null) {
        handleChange(result);
      }
    }
  }, [dependentValues, handleChange, setValueOnDependentFieldsChange]);

  useEffect(() => {
    if (incomingMessage !== null && typeof incomingMessage === "object") {
      const { value } = incomingMessage;
      if (Boolean(value) || value === "") {
        handleChange(value);
        if (whenToRunValidation === "onBlur") {
          runValidation({ value: value }, true);
        }
      }
    }
  }, [incomingMessage, handleChange, runValidation, whenToRunValidation]);

  return null;
};

export default MyHiddenField;
