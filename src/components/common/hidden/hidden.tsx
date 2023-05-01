import { FC, useEffect } from "react";
import {
  useField,
  UseFieldHookProps,
  transformDependentFieldsState,
} from "packages/form";
import { GridProps } from "@material-ui/core/Grid";

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
}) => {
  const { handleBlur, handleChange, dependentValues, incomingMessage } =
    useField({
      name: fieldName,
      fieldKey: fieldID,
      dependentFields,
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
      }
    }
  }, [incomingMessage, handleChange]);

  return null;
};

export default MyHiddenField;
