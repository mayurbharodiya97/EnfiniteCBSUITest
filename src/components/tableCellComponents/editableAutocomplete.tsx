import { AutoCompleteGrid } from "components/common/autocomplete/autocompleteGrid";
import { useState, useEffect } from "react";
import { CellWrapper } from "./cellWrapper";

export const EditableAutocomplete = (props) => {
  const {
    value: initialValue,
    rows,
    row: { index, original },
    column: { id, options, validation, _optionsKey, disableCachingOptions },
    updateGridData,
    gridProps,
    hiddenFlag,
  } = props;
  const prevRows = rows
    .slice(0, index)
    .map((one) => one?.original)
    .filter((one) => Boolean(one[hiddenFlag]) !== true);
  const nextRows = rows
    .slice(index + 1)
    .map((one) => one?.original)
    .filter((one) => Boolean(one[hiddenFlag]) !== true);
  const externalTouched = Boolean(original?._touched?.[id]);
  const externalError = original?._error?.[id] ?? "";
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(initialValue);

  const onChange = (value) => {
    setValue(value);
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
  }, [initialValue]);

  return (
    <CellWrapper showBorder {...props}>
      <AutoCompleteGrid
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        fullWidth
        error={externalError}
        touched={externalTouched}
        handleChange={onChange}
        handleBlur={onBlur}
        options={options}
        loading={loading}
        disabled={loading}
        _optionsKey={_optionsKey}
        optionsProps={gridProps}
        disableCaching={disableCachingOptions}
        showCheckbox={false}
        renderInput={() => null}
      />
    </CellWrapper>
  );
};
