import { SelectForGrid } from "components/common/select/renderForGrid";
import FormHelperText from "@material-ui/core/FormHelperText";
import { useState, useEffect, useMemo } from "react";
import { CellWrapper } from "./cellWrapper";
import { CircularProgressProps } from "@material-ui/core";

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
      defaultOptionLabel,
      requestProps,
      isReadOnly,
      __EDIT__,
      dependentOptionField,
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
    if (isReadOnly) {
      return true;
    }
    if (original?._isNewRow === false && __EDIT__?.isReadOnly === true) {
      return true;
    }
    return false;
  }, [isReadOnly, original?._isNewRow, __EDIT__]);
  let CircularProgressProps = {
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

  // console.log("<<>>optionsParameter", dependentOptionField);
  // console.log("<<>>optionsParameter", original[dependentOptionField]);
  // console.log("<<>>modifiedRequestProps", modifiedRequestProps);
  // console.log(requestProps, typeof requestProps);
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
        disableCaching={disableCachingOptions}
        defaultOptionLabel={defaultOptionLabel}
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
