import { FC, useCallback, useState } from "react";
import Select, { SelectProps } from "@material-ui/core/Select";
import Input, { InputProps } from "@material-ui/core/Input";
import MenuItem, { MenuItemProps } from "@material-ui/core/MenuItem";
import CircularProgress, {
  CircularProgressProps,
} from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Checkbox } from "components/styledComponent/checkbox";
import { OptionsProps, Merge, OptionsFn } from "../types";
import { getLabelFromValues, useOptionsFetcherSimple } from "../utils";

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
    skipDefaultOption,
    defaultOptionLabel
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
      handleChange(e, result as any);
    },
    [handleChange, getLabelFromValuesForOptions, multiple]
  );
  const menuItems = _options.map((menuItem, index) => {
    return (
      <MenuItem
        {...MenuItemProps}
        //keep button value to true else keyboard navigation for select will stop working
        button={true}
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
