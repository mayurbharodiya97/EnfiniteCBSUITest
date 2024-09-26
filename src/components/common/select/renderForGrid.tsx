import { FC, useCallback, useState } from "react";
import { Checkbox } from "components/styledComponent/checkbox";
import { OptionsProps, Merge, OptionsFn } from "../types";
import { getLabelFromValues, useOptionsFetcherSimple } from "../utils";
import {
  CircularProgress,
  CircularProgressProps,
  Input,
  InputAdornment,
  InputProps,
  MenuItem,
  MenuItemProps,
  Select,
  SelectProps,
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
  skipDefaultOption?: boolean;
  defaultOptionLabel?: string;
  enableDefaultOption?: boolean;
}
type MySelectProps = Merge<InputProps, MySelectExtendedProps>;

export const SelectForGrid: FC<MySelectProps> = ({
  options,
  MenuItemProps,
  SelectProps,
  multiple,
  showCheckbox,
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
  skipDefaultOption,
  defaultOptionLabel,
  enableDefaultOption = false,
  ...others
}) => {
  const [_options, setOptions] = useState<OptionsProps[]>([]);
  const isTouched = Boolean(touched);
  const isError = isTouched && Boolean(error);
  const { loadingOptions } = useOptionsFetcherSimple(
    options,
    setOptions,
    _optionsKey,
    disableCaching,
    optionsProps,
    (skipDefaultOption = false),
    defaultOptionLabel,
    enableDefaultOption
  );
  const getLabelFromValuesForOptions = useCallback(
    (values) => getLabelFromValues(_options)(values),
    [_options]
  );
  // console.log(defaultOptionLabel, skipDefaultOption, optionsProps);
  const handleChangeInterceptor = useCallback(
    (e) => {
      const value = typeof e === "object" ? e?.target?.value ?? "" : e;
      let result = getLabelFromValuesForOptions(value);
      result = multiple ? result : result[0];
      if (value === "00") {
        e.target["value"] = "";
      }
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
    <Select
      {...others}
      value={multiple && !Array.isArray(value) ? [value] : value}
      // value={
      //   multiple && !Array.isArray(value)
      //     ? [value]
      //     : Boolean(value)
      //     ? value
      //     : typeof value === "string"
      //     ? "00"
      //     : value
      // }
      error={isError}
      onChange={handleChangeInterceptor}
      onBlur={handleBlur}
      native={false}
      multiple={multiple}
      renderValue={multiple ? getLabelFromValues(_options, true) : undefined}
      input={
        <Input
          endAdornment={
            loading || loadingOptions ? (
              <InputAdornment position="end">
                <CircularProgress
                  color="primary"
                  variant="indeterminate"
                  {...CircularProgressProps}
                />
              </InputAdornment>
            ) : null
          }
          disableUnderline
        />
      }
      readOnly={readOnly}
    >
      {menuItems}
    </Select>
  );
};
