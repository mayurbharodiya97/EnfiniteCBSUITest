import { useState, useEffect, useRef } from "react";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import FormHelperText from "@material-ui/core/FormHelperText";
import { CellWrapper } from "./cellWrapper";

export const EditableTextField = (props) => {
  const {
    value: initialValue,
    rows,
    row: { index, original },
    column: {
      id,
      validation,
      isPassword,
      TableCellProps,
      isDisabledOnBlurEvent,
    },
    updateGridData,
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
  const isPasswordFieldRef = useRef(Boolean(isPassword));
  const [inputType, setInputType] = useState(
    Boolean(isPassword) ? "password" : "text"
  );
  const toggleInputType = () =>
    setInputType((old) => (old === "password" ? "text" : "password"));
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  //console.log(id, isDisabledOnBlurEvent);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(initialValue);
  const onChange = (e) => {
    setValue(e.target.value);
  };
  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    if (!Boolean(isDisabledOnBlurEvent)) {
      onBlurEvent();
    }
  };
  const onFocus = (e) => {
    e.target.select();
  };

  const onBlurEvent = () => {
    setLoading(true);
    validation(value, original, prevRows, nextRows).then((result) => {
      setLoading(false);
      updateGridData(index, id, value, true, result);
    });
  };
  useEffect(() => {
    if (Boolean(isDisabledOnBlurEvent)) {
      onBlurEvent();
    }
  }, [value]);
  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <CellWrapper showBorder {...props}>
      <Input
        name={id}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        type={inputType}
        onBlur={onBlur}
        margin="none"
        fullWidth
        error={Boolean(externalTouched) && Boolean(externalError)}
        endAdornment={
          isPasswordFieldRef.current ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={toggleInputType}
                onMouseDown={handleMouseDownPassword}
              >
                {inputType === "password" ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ) : null
        }
        style={{
          marginTop: "0px",
          direction: TableCellProps?.align === "right" ? "rtl" : "ltr",
        }}
        disableUnderline
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
