import { FC, useCallback } from "react";
import { SelectProps } from "@material-ui/core/Select";
import { TextFieldProps } from "@material-ui/core/TextField";
import {
  TextFieldForSelect,
  TextField3,
  TextField,
} from "components/styledComponent";
import MenuItem, { MenuItemProps } from "@material-ui/core/MenuItem";
import CircularProgress, {
  CircularProgressProps,
} from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Checkbox } from "components/styledComponent/checkbox";
import { OptionsProps, Merge } from "../types";
import { getLabelFromValues } from "../utils";

interface MySelectExtendedProps {
  MenuItemProps?: MenuItemProps;
  SelectProps?: SelectProps;
  CircularProgressProps?: CircularProgressProps;
  options: OptionsProps[];
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
  loadingOptions: boolean;
}
type MySelectProps = Merge<TextFieldProps, MySelectExtendedProps>;

export const SelectWithoutOptions: FC<MySelectProps> = ({
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
  optionsProps,
  selectVariant = "default",
  loadingOptions,
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

  const isTouched = Boolean(touched);
  const isError = isTouched && Boolean(error);

  const getLabelFromValuesForOptions = useCallback(
    (values) => getLabelFromValues(options)(values),
    [options]
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
  const menuItems = options.map((menuItem, index) => {
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
    <TextFieldToRender
      {...others}
      select={true}
      value={multiple && !Array.isArray(value) ? [value] : value}
      error={isError}
      helperText={isError ? error : null}
      onChange={handleChangeInterceptor}
      onBlur={handleBlur}
      SelectProps={{
        ...SelectProps,
        native: false,
        multiple: multiple,
        renderValue: multiple ? getLabelFromValues(options, true) : undefined,
        //@ts-ignore
      }}
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{
        endAdornment:
          loading || loadingOptions ? (
            <InputAdornment position="end">
              <CircularProgress
                color="primary"
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
