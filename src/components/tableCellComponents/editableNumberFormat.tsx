import { useEffect, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
import { CellWrapper } from "./cellWrapper";
import { numWords } from "components/common/utils";
import { FormHelperText, Input } from "@mui/material";

function NumberFormatCustom(props) {
  const { inputRef, onChange, FormatProps, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange(
          {
            target: {
              name: props.name,
              value: values.value,
              formattedValue: values.formattedValue,
            },
          },
          values.formattedValue
        );
      }}
      {...FormatProps}
    />
  );
}

export const EditableNumberFormat = (props) => {
  const {
    value: initialValue,
    rows,
    row: { index, original },
    column: {
      id,
      validation,
      FormatProps,
      placeholder = "",
      enableNumWords,
      className,
      isDisabledOnBlurEvent,
    },
    updateGridData,
    hiddenFlag,
    loading,
  } = props;
  //console.log(props);
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
  const [loadingcoll, setLoading] = useState(false);
  const [value, setValue] = useState(initialValue);
  const onFocus = (e) => {
    e.target.select();
  };

  const onChange = (e) => {
    setValue(e.target.value);
  };

  let numWordsVar: any = null;
  try {
    if (enableNumWords && Boolean(value)) {
      let amountArray = String(value).split(".");
      let amountPart = Number(amountArray[0]);
      if (amountPart < 0) {
        amountPart = Math.abs(Number(amountPart));
        numWordsVar = `Negative ${numWords(amountPart)} Rupees`;
      } else {
        numWordsVar = `${numWords(amountPart)} Rupees`;
      }
      if (amountArray.length === 2 && Boolean(amountArray[1])) {
        numWordsVar = `${numWordsVar} and ${numWords(amountArray[1])} paise`;
      }
    }
  } catch (e) {}

  const onBlur = () => {
    if (!Boolean(isDisabledOnBlurEvent)) {
      onBlurEvent();
    }
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
  return (
    <CellWrapper showBorder {...props}>
      <Input
        name={id}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        fullWidth
        margin="none"
        disableUnderline
        error={Boolean(externalTouched) && Boolean(externalError)}
        inputComponent={NumberFormatCustom}
        inputProps={{
          FormatProps: FormatProps,
        }}
        disabled={loadingcoll}
        className={className}
        readOnly={loading}
      />
      {Boolean(externalTouched) && Boolean(externalError) ? (
        <FormHelperText style={{ whiteSpace: "break-spaces" }} error={true}>
          {externalError}
        </FormHelperText>
      ) : Boolean(enableNumWords) ? (
        <FormHelperText style={{ whiteSpace: "break-spaces" }}>
          {numWordsVar}
        </FormHelperText>
      ) : null}
    </CellWrapper>
  );
};

export const EditableNumberFormatLessValidation = (props) => {
  const {
    value: initialValue,
    rows,
    row: { index, original },
    column: {
      id,
      validation,
      FormatProps,
      placeholder = "",
      enableNumWords,
      className,
      isDisabledOnBlurEvent,
    },
    updateGridData,
    hiddenFlag,
    loading,
  } = props;
  //console.log(props);
  const prevRows = [];
  const nextRows = [];

  const externalTouched = Boolean(original?._touched?.[id]);
  const externalError = original?._error?.[id] ?? "";
  const isFirstTimeRef = useRef(true);
  const [loadingcoll, setLoading] = useState(false);
  const [value, setValue] = useState(initialValue);
  const onFocus = (e) => {
    e.target.select();
  };

  const onChange = (e) => {
    setValue(e.target.value);
  };

  let numWordsVar: any = null;
  // try {
  //   if (enableNumWords && Boolean(value)) {
  //     let amountArray = String(value).split(".");
  //     let amountPart = Number(amountArray[0]);
  //     if (amountPart < 0) {
  //       amountPart = Math.abs(Number(amountPart));
  //       numWordsVar = `Negative ${numWords(amountPart)} Rupees`;
  //     } else {
  //       numWordsVar = `${numWords(amountPart)} Rupees`;
  //     }
  //     if (amountArray.length === 2 && Boolean(amountArray[1])) {
  //       numWordsVar = `${numWordsVar} and ${numWords(amountArray[1])} paise`;
  //     }
  //   }
  // } catch (e) {}

  const onBlur = () => {
    if (!Boolean(isDisabledOnBlurEvent)) {
      onBlurEvent();
    }
  };
  const onBlurEvent = () => {
    console.log("onBlurEvent", value);
    setLoading(true);
    validation(value, original, prevRows, nextRows).then((result) => {
      setLoading(false);
      updateGridData(index, id, value, true, result);
    });
  };
  useEffect(() => {
    if (Boolean(isDisabledOnBlurEvent) && !isFirstTimeRef.current) {
      onBlurEvent();
    }
    isFirstTimeRef.current = false;
  }, [value]);
  return (
    <CellWrapper showBorder {...props}>
      <Input
        name={id}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        fullWidth
        margin="none"
        disableUnderline
        error={Boolean(externalTouched) && Boolean(externalError)}
        inputComponent={NumberFormatCustom}
        inputProps={{
          FormatProps: FormatProps,
        }}
        disabled={loadingcoll}
        className={className}
        readOnly={loading}
      />
      {Boolean(externalTouched) && Boolean(externalError) ? (
        <FormHelperText style={{ whiteSpace: "break-spaces" }} error={true}>
          {externalError}
        </FormHelperText>
      ) : Boolean(enableNumWords) ? (
        <FormHelperText style={{ whiteSpace: "break-spaces" }}>
          {numWordsVar}
        </FormHelperText>
      ) : null}
    </CellWrapper>
  );
};
