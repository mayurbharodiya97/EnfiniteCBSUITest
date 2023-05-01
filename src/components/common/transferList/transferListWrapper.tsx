import { FC, useState } from "react";
import { useField, UseFieldHookProps } from "packages/form";
import Grid, { GridProps } from "@material-ui/core/Grid";
import { OptionsProps, Merge, dependentOptionsFn } from "../types";
import { useOptionsFetcher } from "../utils";
import { TransferList, TransferListProps } from "./transferList";

interface extendedFieldProps extends UseFieldHookProps {
  leftOptions?: OptionsProps[] | dependentOptionsFn;
  rightOptions?: OptionsProps[] | dependentOptionsFn;
  _leftOptionsKey?: string;
  _rightOptionsKey?: string;
  disableCaching?: boolean;
  GridProps?: GridProps;
  enableGrid: boolean;
}
export type MyAllTransferListProps = Merge<
  TransferListProps,
  extendedFieldProps
>;

export const MyTransferList: FC<MyAllTransferListProps> = ({
  name: fieldName,
  fieldKey: fieldID,
  label,
  validate,
  validationRun,
  shouldExclude,
  isReadOnly,
  postValidationSetCrossFieldValues,
  runPostValidationHookAlways,
  dependentFields,
  leftOptions,
  rightOptions,
  GridProps,
  enableGrid,
  //@ts-ignore
  isFieldFocused,
  runValidationOnDependentFieldsChange,
  _leftOptionsKey,
  _rightOptionsKey,
  disableCaching,
  leftOptionsLabel,
  rightOptionsLabel,
  valueSide,
}) => {
  const {
    error,
    touched,
    handleChange,
    handleBlur,
    runValidation,
    isSubmitting,
    fieldKey,
    name,
    dependentValues,
    excluded,
    incomingMessage,
    whenToRunValidation,
    readOnly,
    formState,
    setIncomingMessage,
  } = useField({
    name: fieldName,
    fieldKey: fieldID,
    dependentFields,
    validate,
    validationRun,
    runPostValidationHookAlways,
    postValidationSetCrossFieldValues,
    isReadOnly,
    shouldExclude,
    runValidationOnDependentFieldsChange,
  });
  const [_optionsLeft, setLeftOptions] = useState<OptionsProps[]>([]);
  const [_optionsRight, setRightOptions] = useState<OptionsProps[]>([]);

  const { loadingOptions: leftLoadingOptions } = useOptionsFetcher(
    formState,
    leftOptions,
    setLeftOptions,
    handleChange,
    dependentValues,
    incomingMessage,
    runValidation,
    whenToRunValidation,
    _leftOptionsKey,
    disableCaching,
    setIncomingMessage,
    true,
    "",
    false
  );
  const { loadingOptions: rightLoadingOptions } = useOptionsFetcher(
    formState,
    rightOptions,
    setRightOptions,
    handleChange,
    dependentValues,
    incomingMessage,
    runValidation,
    whenToRunValidation,
    _rightOptionsKey,
    disableCaching,
    setIncomingMessage,
    true,
    "",
    false
  );

  //dont move it to top it can mess up with hooks calling mechanism, if there is another
  //hook added move this below all hook calls
  if (excluded) {
    return null;
  }
  const isError = touched && (error ?? "") !== "";

  const result =
    leftLoadingOptions || rightLoadingOptions ? (
      <span>loading...</span>
    ) : (
      <TransferList
        key={fieldKey}
        name={name}
        label={label}
        error={!isSubmitting && isError}
        helperText={!isSubmitting && isError ? error : null}
        handleChange={handleChange}
        handleBlur={handleBlur}
        disabled={isSubmitting}
        readOnly={readOnly}
        leftOptions={_optionsLeft}
        rightOptions={_optionsRight}
        leftOptionsLabel={leftOptionsLabel}
        rightOptionsLabel={rightOptionsLabel}
        valueSide={valueSide}
      />
    );
  if (Boolean(enableGrid)) {
    return <Grid {...GridProps}>{result}</Grid>;
  } else {
    return result;
  }
};

export default MyTransferList;
