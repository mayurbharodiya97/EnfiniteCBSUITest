import { FC } from "react";
import { IMaskInput as IMask } from "react-imask";
import { IMaskInputProps } from "./types";
import { TextField, TextFieldProps } from "components/common/textField";
import { Merge } from "components/common/types";

export function InputMaskCustom(props) {
  const { inputRef, onChange, MaskProps, ...other } = props;
  const { formattedValue, ...others } = MaskProps;
  return (
    <IMask
      {...other}
      inputRef={inputRef}
      onAccept={(value, mask) => {
        onChange({
          target: {
            name: props.name,
            //value: formattedValue ? mask._value : mask.unmaskedValue,
            value: formattedValue ? mask.value : mask.unmaskedValue,
          },
        });
      }}
      {...others}
    />
  );
}

interface extendedProps {
  MaskProps: IMaskInputProps;
  formattedValue?: boolean;
}

export type AllInputMaskProps = Merge<TextFieldProps, extendedProps>;

const MyInputMaskCustom: FC<AllInputMaskProps> = ({
  MaskProps,
  formattedValue,
  ...others
}) => {
  return (
    <TextField
      {...others}
      InputProps={{
        inputComponent: InputMaskCustom,
        inputProps: { MaskProps: { ...MaskProps, formattedValue } },
      }}
    />
  );
};

export default MyInputMaskCustom;
