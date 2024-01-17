import { FC, useState, useCallback } from "react";
import {
  TextFieldForSelect,
  TextField3,
  TextField,
} from "components/styledComponent";
import { Checkbox } from "components/styledComponent/checkbox";
import { OptionsProps, Merge, OptionsFn } from "../types";
import { getLabelFromValues, useOptionsFetcherSimple } from "../utils";
import {
  CircularProgress,
  CircularProgressProps,
  InputAdornment,
  MenuItem,
  MenuItemProps,
  SelectProps,
  TextFieldProps,
} from "@mui/material";

interface MySelectExtendedProps {
  MenuItemProps?: MenuItemProps;
  SelectProps?: SelectProps;
  CircularProgressProps?: CircularProgressProps;
  options?: OptionsProps[] | OptionsFn;
  _optionsKey?: string;
  multiple?: boolean;
  showCheckbox?: boolean;
  handleChange?: any;
  handleBlur?: any;
  error?: any;
  touched?: any;
  loading?: boolean;
  readOnly?: boolean;
  value?: any;
  disableCaching?: boolean;
  optionsProps?: any;
  selectVariant?: "default" | "andornment" | "regular";
  skipDefaultOption?: boolean;
  defaultOptionLabel?: string;
  defaultSpaceAdd?: boolean;
  enableDefaultOption?: boolean;
}
type MySelectProps = Merge<TextFieldProps, MySelectExtendedProps>;

export const SelectRenderOnly: FC<MySelectProps> = ({
  options,
  MenuItemProps,
  SelectProps,
  multiple,
  showCheckbox,
  InputProps,
  inputProps,
  CircularProgressProps,
  handleBlur,
  handleChange,
  error,
  touched,
  value,
  loading,
  readOnly,
  _optionsKey,
  disableCaching,
  optionsProps,
  selectVariant = "default",
  skipDefaultOption,
  defaultOptionLabel,
  defaultSpaceAdd = false,
  InputLabelProps = {},
  enableDefaultOption = false,
  ...others
}) => {
  let TextFieldToRender: any;
  if (selectVariant === "andornment") {
    TextFieldToRender = TextField3;
  } else if (selectVariant === "regular") {
    TextFieldToRender = TextField;
  } else {
    TextFieldToRender = TextFieldForSelect;
  }

  const [_options, setOptions] = useState<OptionsProps[]>([]);
  const isTouched = Boolean(touched);
  const isError = isTouched && Boolean(error);
  const { loadingOptions } = useOptionsFetcherSimple(
    options,
    setOptions,
    _optionsKey,
    disableCaching,
    optionsProps,
    skipDefaultOption,
    defaultOptionLabel,
    enableDefaultOption
  );
  const getLabelFromValuesForOptions = useCallback(
    (values) => getLabelFromValues(_options)(values),
    [_options]
  );
  const handleChangeInterceptor = useCallback(
    (e) => {
      const value = typeof e === "object" ? e?.target?.value ?? "" : e;
      let result = getLabelFromValuesForOptions(value);
      result = multiple ? result : result[0];
      handleChange(e, result as any);
    },
    [handleChange, getLabelFromValuesForOptions, multiple]
  );
  const menuItems = _options.map((menuItem, index) => {
    return (
      <MenuItem
        {...MenuItemProps}
        //keep button value to true else keyboard navigation for select will stop working
        // button={true}
        key={menuItem.value ?? index}
        value={menuItem.value}
        disabled={menuItem.disabled}
      >
        {showCheckbox ? (
          <Checkbox
            checked={
              Boolean(multiple)
                ? Array.isArray(value) && value.indexOf(menuItem.value) >= 0
                : value === menuItem.value
            }
          />
        ) : null}
        {menuItem.label}
      </MenuItem>
    );
  });
  return (
    <TextFieldToRender
      {...others}
      select={true}
      value={multiple && !Array.isArray(value) ? [value] : value}
      error={isError}
      helperText={isError ? error : defaultSpaceAdd ? " " : null}
      onChange={handleChangeInterceptor}
      onBlur={handleBlur}
      SelectProps={{
        ...SelectProps,
        native: false,
        multiple: multiple,
        renderValue: multiple ? getLabelFromValues(_options, true) : undefined,
        //@ts-ignore
      }}
      InputLabelProps={{
        shrink: true,
        ...InputLabelProps,
      }}
      InputProps={{
        endAdornment:
          loading || loadingOptions ? (
            <InputAdornment position="end">
              <CircularProgress
                color="secondary"
                size={24}
                variant="indeterminate"
                {...CircularProgressProps}
              />
            </InputAdornment>
          ) : null,
        ...InputProps,
      }}
      inputProps={{
        readOnly: readOnly,
        tabIndex: readOnly ? -1 : undefined,
        ...inputProps,
      }}
    >
      {menuItems}
    </TextFieldToRender>
  );
};
