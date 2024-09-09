import { NumericFormat } from "react-number-format";
import { TextField, TextFieldProps } from "components/common/textField";
import { Merge } from "components/common/types";
import { useEffect, useRef } from "react";

export function NumberFormatCustom(props) {
  const { inputRef, onChange, FormatProps, ...other } = props;
  const { formattedValue, ...others } = FormatProps;
  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange(
          {
            target: {
              name: props.name,
              value: Boolean(formattedValue)
                ? values.formattedValue
                : values.value,
              formattedValue: values.formattedValue,
            },
          },
          values.formattedValue
        );
      }}
      /**
       * Altaf Shaikh - 15/Feb/2024
       * added valueIsNumericString prop to avoid issue of zero prefixd and cursor moves to start of field
       * when pressed decimal point
       */
      valueIsNumericString={false}
      {...others}
    />
  );
}

interface extendedProps {
  FormatProps: any;
  formattedValue?: boolean;
  isFieldFocused?: boolean;
  textInputFromRight?: boolean;
}

export type AllNumberFormatProps = Merge<TextFieldProps, extendedProps>;

const MyNumberFormat: React.FC<AllNumberFormatProps> = ({
  FormatProps,
  formattedValue,
  isFieldFocused,
  textInputFromRight = false,
  ...others
}) => {
  const ref = useRef<any>(null);
  useEffect(() => {
    if (isFieldFocused) {
      setTimeout(() => {
        ref?.current?.focus?.();
      }, 1);
    }
  }, [isFieldFocused]);
  return (
    <TextField
      {...others}
      InputProps={{
        inputComponent: NumberFormatCustom,
        inputProps: {
          FormatProps: { ...FormatProps, formattedValue },
          inputRef: ref,
        },
      }}
    />
  );
};

export default MyNumberFormat;
