import { SelectForGrid } from "components/common/select/renderForGrid";
import { useState, useEffect } from "react";
import { CellWrapper } from "./cellWrapper";
import { CircularProgressProps } from "@material-ui/core";
import { FormHelperText } from "@mui/material";

export const DisableSelect = (props) => {
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
  //console.log(requestProps, typeof requestProps);
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
        disabled={true}
        _optionsKey={_optionsKey}
        optionsProps={requestProps}
        disableCaching={disableCachingOptions}
        defaultOptionLabel={defaultOptionLabel}
        CircularProgressProps={CircularProgressProps}
        readOnly={true}
      />
      {Boolean(externalTouched) && Boolean(externalError) ? (
        <FormHelperText style={{ whiteSpace: "break-spaces" }} error={true}>
          {externalError}
        </FormHelperText>
      ) : null}
    </CellWrapper>
  );
};
