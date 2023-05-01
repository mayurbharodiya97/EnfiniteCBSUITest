import { NumericFormat } from "react-number-format";
import { TextField, TextFieldProps } from "components/common/textField";
import { Merge } from "components/common/types";

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
      {...others}
    />
  );
}

interface extendedProps {
  FormatProps: any;
  formattedValue?: boolean;
}

export type AllNumberFormatProps = Merge<TextFieldProps, extendedProps>;

const MyNumberFormat: React.FC<AllNumberFormatProps> = ({
  FormatProps,
  formattedValue,
  ...others
}) => {
  return (
    <TextField
      {...others}
      InputProps={{
        inputComponent: NumberFormatCustom,
        inputProps: { FormatProps: { ...FormatProps, formattedValue } },
      }}
    />
  );
};

export default MyNumberFormat;
