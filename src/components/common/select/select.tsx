import { FC, useEffect, useState, useRef, useCallback } from "react";
import {
  useField,
  UseFieldHookProps,
  transformDependentFieldsState,
} from "packages/form";
import { Checkbox } from "components/styledComponent/checkbox";
import { OptionsProps, Merge, dependentOptionsFn } from "../types";
import {
  getLabelFromValues,
  getSelectedOptionData,
  useOptionsFetcher,
} from "../utils";
import {
  CircularProgress,
  CircularProgressProps,
  Grid,
  GridProps,
  InputAdornment,
  MenuItem,
  MenuItemProps,
  SelectProps,
  TextFieldProps,
} from "@mui/material";
import { TextField } from "components/styledComponent";

interface extendedFieldProps extends UseFieldHookProps {
  options?: OptionsProps[] | dependentOptionsFn;
  _optionsKey?: string;
  disableCaching?: boolean;
  multiple?: boolean;
  showCheckbox?: boolean;
  skipDefaultOption?: boolean;
  defaultOptionLabel?: string;
  enableDefaultOption?: boolean;
  setValueOnDependentFieldsChange?: any;
  requestProps?: any;
}
type MySelectProps = Merge<TextFieldProps, extendedFieldProps>;

interface MySelectExtendedProps {
  MenuItemProps?: MenuItemProps;
  SelectProps?: SelectProps;
  CircularProgressProps?: CircularProgressProps;
  GridProps?: GridProps;
  enableGrid: boolean;
}

export type MySelectAllProps = Merge<MySelectProps, MySelectExtendedProps>;

const MySelect: FC<MySelectAllProps> = ({
  name: fieldName,
  validate,
  validationRun,
  shouldExclude,
  isReadOnly,
  postValidationSetCrossFieldValues,
  runPostValidationHookAlways,
  dependentFields,
  fieldKey: fieldID,
  options,
  MenuItemProps,
  SelectProps,
  GridProps,
  enableGrid,
  multiple,
  showCheckbox,
  //@ts-ignore
  isFieldFocused,
  InputProps,
  inputProps,
  CircularProgressProps,
  runValidationOnDependentFieldsChange,
  setValueOnDependentFieldsChange,
  skipValueUpdateFromCrossFieldWhenReadOnly,
  _optionsKey,
  disableCaching,
  skipDefaultOption,
  defaultOptionLabel,
  enableDefaultOption,
  requestProps,
  ...others
}) => {
  const {
    value,
    error,
    touched,
    handleChange,
    handleBlur,
    runValidation,
    validationRunning,
    isSubmitting,
    fieldKey,
    name,
    dependentValues,
    excluded,
    incomingMessage,
    whenToRunValidation,
    readOnly,
    formState,
    setIncomingMessage,
    handleOptionValueExtraData,

    ...otherAllData
  } = useField({
    name: fieldName,
    fieldKey: fieldID,
    dependentFields,
    validate,
    validationRun,
    runPostValidationHookAlways,
    postValidationSetCrossFieldValues,
    isReadOnly,
    shouldExclude,
    runValidationOnDependentFieldsChange,
    skipValueUpdateFromCrossFieldWhenReadOnly,
  });

  const focusRef = useRef();
  const [_options, setOptions] = useState<OptionsProps[]>([]);
  useEffect(() => {
    if (isFieldFocused) {
      setTimeout(() => {
        //@ts-ignore
        focusRef?.current?.focus?.();
      }, 1);
    }
  }, [isFieldFocused]);
  const getLabelFromValuesForOptions = useCallback(
    (values) => getLabelFromValues(_options)(values),
    [_options]
  );
  const getExtraOptionData = useCallback(
    (values) => getSelectedOptionData(_options)(values),
    [_options]
  );
  /* eslint-disable react-hooks/exhaustive-deps */
  const handleChangeInterceptor = useCallback(
    (e) => {
      let value = typeof e === "object" ? e?.target?.value ?? "" : e;
      // here we are ensuring when select has multiple options enabled we remove empty space we are getting in select
      if (Array.isArray(value)) {
        value = value.filter((one) => one !== "");
      }
      if (Array.isArray(value) && multiple) {
        let defaultValueIndex = value.indexOf("00");
        if (defaultValueIndex >= 0) {
          value.splice(defaultValueIndex, 1);
        } else if (value.length === 0 && !skipDefaultOption) {
          value = ["00"];
        }
        //Remove this code to disable select All
        if (value[value.length - 1] === "all") {
          let values: any = [],
            labels: any = [];
          if (
            _options.filter((one) => one.value !== "00").length ===
            value.filter((one) => one !== "all").length
          ) {
            handleChange(
              ["00"],
              [
                Boolean(defaultOptionLabel)
                  ? defaultOptionLabel
                  : "Select Option",
              ]
            );
            // console.log("defaultOptionLabel", defaultOptionLabel);
          } else {
            for (let i = 0; i < _options.length; i++) {
              if (_options[i].value === "00") {
                continue;
              }
              values.push(_options[i].value);
              labels.push(_options[i].label);
            }
            handleChange(values, labels);
          }
          return;
        }
        //End of select All Code
      }
      let result = getLabelFromValuesForOptions(value);
      let extraOptionData = getExtraOptionData(value);
      const isDefaultOption = Boolean(extraOptionData?.[0]?.isDefaultOption);
      //console.log(result, value);
      result = multiple ? result : result[0];
      handleOptionValueExtraData(extraOptionData);
      if (isDefaultOption) {
        e.target["value"] = e.target?.value?.trim?.();
      }
      handleChange(multiple ? value : e, result as any);
    },
    [handleChange, getLabelFromValuesForOptions, multiple, skipDefaultOption]
  );

  useEffect(() => {
    if (typeof setValueOnDependentFieldsChange === "function") {
      let result = setValueOnDependentFieldsChange(
        transformDependentFieldsState(dependentValues)
      );
      if (result !== undefined || result !== null) {
        handleChangeInterceptor(result);
      }
    }
  }, [
    dependentValues,
    handleChangeInterceptor,
    setValueOnDependentFieldsChange,
  ]);

  //Remove This to disable selectAll
  const filteredOptions = _options.filter((one) => one.value !== "00");
  const filtervalue = Array.isArray(value)
    ? value.filter((one) => one !== "00")
    : [];
  const isAllSelected = multiple
    ? filteredOptions.length === (value?.length ?? -Infinity)
    : false;

  const isIndeterminate =
    multiple &&
    filtervalue.length > 0 &&
    filtervalue.length < filteredOptions.length;
  //end of select All
  const { loadingOptions } = useOptionsFetcher(
    formState,
    options,
    setOptions,
    handleChangeInterceptor,
    dependentValues,
    incomingMessage,
    runValidation,
    whenToRunValidation,
    _optionsKey,
    disableCaching,
    setIncomingMessage,
    skipDefaultOption,
    defaultOptionLabel,
    enableDefaultOption,
    requestProps
  );
  //console.log(_options);
  //dont move it to top it can mess up with hooks calling mechanism, if there is another
  //hook added move this below all hook calls
  if (excluded) {
    return null;
  }
  const isError = touched && (error ?? "") !== "";
  const isDefaultOption = Boolean(
    otherAllData?.optionData?.[0]?.isDefaultOption
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
        {showCheckbox && !menuItem.disabled ? (
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
  //Remove this to disable select all
  const selectAllMenu = (
    <MenuItem
      // button={true}
      key="selectAll"
      value="all"
    >
      <Checkbox checked={isAllSelected} indeterminate={isIndeterminate} />
      Select All
    </MenuItem>
  );
  //end of select all

  const result = (
    <TextField
      {...others}
      select={true}
      key={fieldKey}
      id={fieldKey}
      name={name}
      value={multiple && !Array.isArray(value) ? [value] : value}
      // value={
      //   multiple && !Array.isArray(value)
      //     ? [value]
      //     : Boolean(value)
      //     ? value
      //     : typeof value === "string"
      //     ? " "
      //     : value
      // }
      error={!isSubmitting && isError}
      helperText={!isSubmitting && isError ? error : null}
      onChange={handleChangeInterceptor}
      onBlur={handleBlur}
      disabled={isSubmitting}
      SelectProps={{
        ...SelectProps,
        native: false,
        multiple: multiple,
        renderValue: multiple ? getLabelFromValues(_options, true) : undefined,
        //@ts-ignore
      }}
      InputLabelProps={{
        shrink: true,
      }}
      inputRef={focusRef}
      InputProps={{
        style: {
          background: Boolean(readOnly) ? "#e7e5e563" : "",
        },
        endAdornment:
          validationRunning || loadingOptions ? (
            <InputAdornment position="end">
              <CircularProgress
                color="secondary"
                variant="indeterminate"
                size={24}
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
      {/*Uncomment first and comment/remove second line to remove select all}
      {/*menuItems*/}
      {multiple && showCheckbox ? [selectAllMenu, ...menuItems] : menuItems}
      {/*end of selectAll*/}
    </TextField>
  );
  if (Boolean(enableGrid)) {
    return <Grid {...GridProps}>{result}</Grid>;
  } else {
    return result;
  }
};

export default MySelect;
