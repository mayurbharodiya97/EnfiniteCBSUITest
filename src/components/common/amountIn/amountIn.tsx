import { useState, FC } from "react";
import { TextField } from "components/styledComponent";
import { useField, UseFieldHookProps } from "packages/form";
import { OptionsProps, Merge, dependentOptionsFn } from "../types";
import { getLabelFromValues, useOptionsFetcher } from "../utils";
import {
  Grid,
  GridProps,
  MenuItem,
  MenuItemProps,
  SelectProps,
} from "@mui/material";
import { TextFieldProps } from "@mui/material";
interface MyAmountInProps {
  leftName: string;
  rightName: string;
  leftLabel: string;
  rightLabel: string;
  GridProps?: GridProps;
  enableGrid: boolean;
}

interface extendedFieldProps extends UseFieldHookProps {
  options?: OptionsProps[] | dependentOptionsFn;
  _optionsKey?: string;
  MenuItemProps?: MenuItemProps;
  SelectProps?: SelectProps;
  skipDefaultOption?: boolean;
  defaultOptionLabel?: string;
  disableCaching?: boolean;
}
type MySelectProps = Merge<TextFieldProps, extendedFieldProps>;

export type MyAllAmountInProps = Merge<MySelectProps, MyAmountInProps>;

const AmountIn: FC<MyAllAmountInProps> = ({
  name: fieldName,
  fieldKey: fieldID,
  leftName,
  rightName,
  leftLabel,
  rightLabel,
  options,
  GridProps,
  enableGrid,
  InputProps,
  _optionsKey,
  disableCaching,
  defaultOptionLabel,
  skipDefaultOption,
}) => {
  const {
    value,
    setValue,
    handleBlur,
    runValidation,
    fieldKey,
    dependentValues,
    incomingMessage,
    whenToRunValidation,
    formState,
    setIncomingMessage,
  } = useField({
    name: fieldName,
    fieldKey: fieldID,
  });
  const [_options, setOptions] = useState<OptionsProps[]>([]);
  const [selectedAmountIn, setSelectedAmountIn] = useState<any>(
    value[rightName]
  );
  const [amount, setAmount] = useState<any>(value[leftName]);

  const handleChangeOptions = (e) => {
    setSelectedAmountIn(e.target.value);
  };

  const handleChangeAmount = (e) => {
    setAmount(e.target.value);
  };

  const handleBlurAmount = async () => {
    const total = amount * selectedAmountIn;
    setValue(total, true);
  };

  const menuItems = _options.map((menuItem, index) => {
    return (
      <MenuItem
        // button={true}
        key={menuItem.value ?? index}
        value={menuItem.value}
      >
        {menuItem.label}
      </MenuItem>
    );
  });

  const { loadingOptions } = useOptionsFetcher(
    formState,
    options,
    setOptions,
    handleChangeOptions,
    dependentValues,
    incomingMessage,
    runValidation,
    whenToRunValidation,
    _optionsKey,
    disableCaching,
    setIncomingMessage,
    skipDefaultOption,
    defaultOptionLabel,
    false
  );

  const result = (
    <div style={{ display: "flex" }} tabIndex={0} onBlur={handleBlur}>
      <TextField
        key={fieldKey}
        id={fieldKey}
        name={leftName}
        label={leftLabel}
        value={amount}
        onChange={handleChangeAmount}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        key={fieldKey}
        id={fieldKey}
        select={true}
        name={rightName}
        label={rightLabel}
        value={selectedAmountIn}
        onChange={handleChangeOptions}
        onBlur={handleBlurAmount}
        SelectProps={{
          renderValue: getLabelFromValues(_options, true),
        }}
        InputLabelProps={{
          shrink: true,
        }}
        // inputProps={{
        //   endAdornment: loadingOptions,
        //   ...InputProps,
        // }}
      >
        {menuItems}
      </TextField>
    </div>
  );
  if (Boolean(enableGrid)) {
    return <Grid {...GridProps}>{result}</Grid>;
  } else {
    return result;
  }
};

export default AmountIn;
