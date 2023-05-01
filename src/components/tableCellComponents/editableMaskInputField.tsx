import { FormHelperText, Input } from "@mui/material";
import { useState } from "react";
import { IMaskInput as IMask } from "react-imask";
import { CellWrapper } from "./cellWrapper";

function InputMaskCustom(props) {
  const { inputRef, onChange, MaskProps, ...other } = props;
  return (
    <IMask
      {...other}
      inputRef={inputRef}
      onAccept={(value, mask) => {
        onChange({
          target: {
            value: mask.unmaskedValue,
          },
        });
      }}
      {...MaskProps}
    />
  );
}

export const EditableMaskInputField = (props) => {
  const {
    value: initialValue,
    rows,
    row: { index, original },
    column: { id, validation, MaskProps },
    updateGridData,
    hiddenFlag,
  } = props;
  const externalTouched = Boolean(original?._touched?.[id]);
  const externalError = original?._error?.[id] ?? "";
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(initialValue);
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
  const onFocus = (e) => {
    e.target.select();
  };

  const onBlur = () => {
    setLoading(true);
    validation(value, original, prevRows, nextRows).then((result) => {
      setLoading(false);
      updateGridData(index, id, value, true, result);
    });
  };
  return (
    <CellWrapper showBorder {...props}>
      <Input
        name={id}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        fullWidth
        margin="none"
        disableUnderline
        error={Boolean(externalTouched) && Boolean(externalError)}
        //@ts-ignore
        inputComponent={InputMaskCustom}
        inputProps={{
          MaskProps: MaskProps,
        }}
        disabled={loading}
      />
      {Boolean(externalTouched) && Boolean(externalError) ? (
        <FormHelperText style={{ whiteSpace: "break-spaces" }} error={true}>
          {externalError}
        </FormHelperText>
      ) : null}
    </CellWrapper>
  );
};
