import { SelectForGrid } from "components/common/select/renderForGrid";
import { useState, useEffect, useMemo } from "react";
import { CellWrapper } from "./cellWrapper";
import { CircularProgressProps } from "@mui/material";
import { FormHelperText } from "@mui/material";

export const EditableSelect = (props) => {
  const {
    value: initialValue,
    rows,
    row: { index, original },
    column: {
      id,
      options,
      validation,
      _optionsKey,
      disableCachingOptions,
      skipDefaultOption,
      defaultOptionLabel,
      requestProps,
      isReadOnly,
      __EDIT__,
      dependentOptionField,
      enableDefaultOption,
    },
    updateGridData,
    gridProps,
    hiddenFlag,
    loading,
  } = props;
  const externalTouched = Boolean(original?._touched?.[id]);
  const externalError = original?._error?.[id] ?? "";
  const [loadingcall, setLoading] = useState(false);
  const [value, setValue] = useState(initialValue);
  const isReadOnlyLocal = useMemo(() => {
    if (original?._isNewRow === true) {
      return false;
    }
    if (isReadOnly) {
      return true;
    }
    if (original?._isNewRow === false && __EDIT__?.isReadOnly === true) {
      return true;
    }
    return false;
  }, [isReadOnly, original?._isNewRow, __EDIT__]);
  let CircularProgressProps: any = {
    color: "secondary",
    size: 20,
  } as CircularProgressProps;
  const reqGridProps =
    typeof options === "string" &&
    options === "GetMiscValue" &&
    typeof requestProps !== "undefined"
      ? requestProps
      : gridProps;

  let modifiedRequestProps = Boolean(dependentOptionField)
    ? original[dependentOptionField]
    : requestProps;

  const prevRows = rows
    .slice(0, index)
    .map((one) => one?.original)
    .filter((one) => Boolean(one[hiddenFlag]) !== true);

  const nextRows = rows
    .slice(index + 1)
    .map((one) => one?.original)
    .filter((one) => Boolean(one[hiddenFlag]) !== true);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    setLoading(true);
    validation(value, original, prevRows, nextRows).then((result) => {
      setLoading(false);
      updateGridData(index, id, value, true, result);
    });
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue, externalError]);

  return (
    <CellWrapper showBorder {...props}>
      <SelectForGrid
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        fullWidth
        touched={externalTouched}
        error={externalError}
        handleChange={onChange}
        handleBlur={onBlur}
        options={options}
        loading={loadingcall}
        disabled={loadingcall || loading || isReadOnlyLocal}
        _optionsKey={_optionsKey}
        optionsProps={modifiedRequestProps}
        // optionsProps={requestProps}
        disableCaching={disableCachingOptions}
        skipDefaultOption={skipDefaultOption}
        defaultOptionLabel={defaultOptionLabel}
        enableDefaultOption={enableDefaultOption}
        CircularProgressProps={CircularProgressProps}
      />
      {Boolean(externalTouched) && Boolean(externalError) ? (
        <FormHelperText style={{ whiteSpace: "break-spaces" }} error={true}>
          {externalError}
        </FormHelperText>
      ) : null}
    </CellWrapper>
  );
};
