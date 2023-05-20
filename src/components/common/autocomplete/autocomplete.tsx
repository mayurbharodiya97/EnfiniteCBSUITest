import {
  FC,
  useEffect,
  useRef,
  useState,
  Fragment,
  ComponentType,
  HTMLAttributes,
  lazy,
  Suspense,
  useCallback,
} from "react";
import { Chip, TextFieldProps, ChipProps } from "@material-ui/core";
import { Checkbox } from "components/styledComponent/checkbox";
import { TextField } from "components/styledComponent/textfield";
import { useField, UseFieldHookProps } from "packages/form";
import { Merge, OptionsProps, dependentOptionsFn } from "../types";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useOptionsFetcher } from "../utils";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import {
  CircularProgress,
  CircularProgressProps,
  createFilterOptions,
  CreateFilterOptionsConfig,
  Grid,
  GridProps,
} from "@mui/material";

const ListBoxComponentVirtualized = lazy(() =>
  import("./virtualized").then((module) => ({
    default: module.ListBoxComponent,
  }))
);
//will use it if there is a neeed for advance sorter
//import matchSorter from "match-sorter";

interface AutoCompleteExtendedProps {
  enableGrid: boolean;
  showCheckbox: boolean;
  GridProps?: GridProps;
  CircularProgressProps?: CircularProgressProps;
  TextFieldProps?: TextFieldProps;
  ChipProps?: ChipProps;
  CreateFilterOptionsConfig?: CreateFilterOptionsConfig<OptionsProps>;
  options?: OptionsProps[] | dependentOptionsFn;
  label?: string;
  placeholder?: string;
  required?: boolean;
  enableVirtualized?: boolean;
  _optionsKey?: string;
  disableCaching?: boolean;
}

type MyAutocompleteProps = Merge<
  AutocompleteProps<OptionsProps, true, true, true>,
  AutoCompleteExtendedProps
>;

export type MyAllAutocompleteProps = Merge<
  MyAutocompleteProps,
  UseFieldHookProps
>;

const getOptionLabel = (freeSolo: any) => (option: OptionsProps) =>
  Boolean(freeSolo) ? option : option?.label ?? "";
const getOptionValue = (freeSolo: any) => (option: OptionsProps) =>
  Boolean(freeSolo) ? option : option?.value ?? "";

const MyAutocomplete: FC<MyAllAutocompleteProps> = ({
  name: fieldName,
  validate,
  validationRun,
  shouldExclude,
  isReadOnly,
  postValidationSetCrossFieldValues,
  skipValueUpdateFromCrossFieldWhenReadOnly,
  runPostValidationHookAlways,
  dependentFields,
  fieldKey: fieldID,
  options,
  GridProps,
  enableGrid,
  multiple,
  disableClearable,
  freeSolo,
  TextFieldProps,
  CircularProgressProps,
  ChipProps,
  showCheckbox,
  CreateFilterOptionsConfig,
  runValidationOnDependentFieldsChange,
  label,
  placeholder,
  limitTags,
  required,
  enableVirtualized,
  //@ts-ignore
  isFieldFocused,
  _optionsKey,
  disableCaching,
  ...others
}) => {
  const {
    formState,
    error,
    touched,
    handleChange,
    handleBlur,
    runValidation,
    isSubmitting,
    validationRunning,
    fieldKey,
    name,
    dependentValues,
    excluded,
    incomingMessage,
    whenToRunValidation,
    value,
    setIncomingMessage,
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
  const optionsMapperRef = useRef(new Map());
  /* eslint-disable  react-hooks/exhaustive-deps */
  const myGetOptionLabel = useCallback(getOptionLabel(freeSolo), []);
  const myGetOptionValue = useCallback(getOptionValue(freeSolo), []);

  const transformValues = useCallback((values, freeSolo) => {
    if (!Array.isArray(values)) {
      values = [values];
    }
    if (freeSolo) {
      return values;
    }
    let newValues = values.map((one) => {
      return optionsMapperRef.current.has(`${one}`)
        ? optionsMapperRef.current.get(`${one}`)
        : { label: "", value: one };
    });
    return newValues;
  }, []);

  useEffect(() => {
    if (isFieldFocused) {
      setTimeout(() => {
        //@ts-ignore
        focusRef?.current?.focus?.();
      }, 1);
    }
  }, [isFieldFocused]);

  const [_options, setOptions] = useState<OptionsProps[]>([]);
  /* eslint-disable array-callback-return */
  const setOptionsWrapper = useCallback(
    (value) => {
      optionsMapperRef.current.clear();
      if (typeof value === "function") {
        setOptions((old) => {
          let result = value(old);
          if (freeSolo && Array.isArray(result)) {
            return result.map((one) => getOptionLabel(false)(one));
          } else if (Array.isArray(result)) {
            result.map((one) => {
              optionsMapperRef.current.set(`${myGetOptionValue(one)}`, one);
            });
          }
          return result;
        });
      } else {
        if (freeSolo && Array.isArray(value)) {
          let newValue = value.map((one) => getOptionLabel(false)(one));
          setOptions(newValue as any);
          return;
        } else if (Array.isArray(value)) {
          value.map((one) => {
            optionsMapperRef.current.set(`${myGetOptionValue(one)}`, one);
          });
        }
        setOptions(value);
      }
    },
    [setOptions, myGetOptionLabel, myGetOptionValue]
  );

  // const [lastUpdatedTime, setLastUpdatedTime] = useState(new Date().getTime());
  // const initDoneRef = useRef(false);
  //const defaultValueRef = useRef<any>(null);
  const { loadingOptions } = useOptionsFetcher(
    formState,
    options,
    setOptionsWrapper,
    handleChange,
    dependentValues,
    incomingMessage,
    runValidation,
    whenToRunValidation,
    _optionsKey,
    disableCaching,
    setIncomingMessage,
    true,
    "",
    false
  );

  //dont move it to top it can mess up with hooks calling mechanism, if there is another
  //hook added move this below all hook calls
  if (excluded) {
    return null;
  }
  const isError = touched && (error ?? "") !== "";
  const result = (
    <Suspense fallback={"loading..."}>
      <Autocomplete
        {...others}
        key={fieldKey}
        //@ts-ignore
        defaultValue={[]}
        limitTags={limitTags ?? 2}
        multiple={multiple}
        disableClearable={disableClearable}
        options={_options}
        freeSolo={freeSolo}
        //@ts-ignore
        getOptionLabel={myGetOptionLabel}
        value={
          loadingOptions
            ? []
            : multiple
            ? transformValues(value, freeSolo)
            : transformValues(value, freeSolo)[0]
        }
        getOptionSelected={(option, value) => {
          if (freeSolo) {
            if (option === value) {
              return true;
            }
            return false;
          } else {
            if (option.value === value.value) {
              return true;
            }
            return false;
          }
        }}
        ListboxComponent={
          Boolean(enableVirtualized)
            ? (ListBoxComponentVirtualized as ComponentType<
                HTMLAttributes<HTMLElement>
              >)
            : undefined
        }
        onChange={(_, value) => {
          //condition for freeSolo functionality with multiple values
          if (!Array.isArray(value)) {
            value = [value];
          }
          if (freeSolo) {
            //@ts-ignore
            value = value.map((one) => myGetOptionLabel(one) ?? "");
          } else {
            //@ts-ignore
            value = value.map((one) => myGetOptionValue(one) ?? "");
          }
          if (!Boolean(multiple) && Array.isArray(value)) {
            //@ts-ignore
            handleChange(value[0]);
          } else {
            handleChange(value);
          }
        }}
        onBlur={handleBlur}
        disabled={isSubmitting}
        filterOptions={
          Boolean(CreateFilterOptionsConfig) &&
          typeof CreateFilterOptionsConfig === "object"
            ? createFilterOptions(CreateFilterOptionsConfig)
            : undefined
        }
        renderTags={(value, getTagProps) => {
          return value.map((option, index) => {
            if (typeof option === "string") {
              return (
                <Chip
                  // key={option}
                  variant="outlined"
                  {...ChipProps}
                  label={option}
                  {...getTagProps({ index })}
                />
              );
            }
            return (
              <Chip
                // key={`${option.label}-${index}`}
                variant="outlined"
                {...ChipProps}
                label={option.label}
                {...getTagProps({ index })}
              />
            );
          });
        }}
        renderInput={(params) => {
          return (
            <TextField
              {...TextFieldProps}
              {...params}
              name={name}
              label={label}
              placeholder={placeholder}
              autoComplete="disabled"
              type="text"
              error={!isSubmitting && isError}
              required={required}
              helperText={!isSubmitting && isError ? error : null}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <Fragment>
                    {validationRunning || loadingOptions ? (
                      <CircularProgress
                        color="primary"
                        variant="indeterminate"
                        {...CircularProgressProps}
                      />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </Fragment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-user-street-address",
              }}
            />
          );
        }}
        renderOption={(props, option, { selected, inputValue }) => {
          let label = myGetOptionLabel(option);
          const matches = match(label, inputValue);
          const parts = parse(label, matches);
          const labelJSX = parts.map((part, index) => (
            <span
              key={index}
              style={{ fontWeight: part.highlight ? 700 : 400 }}
            >
              {part.text}
            </span>
          ));
          return (
            <div style={{ whiteSpace: "pre" }}>
              {showCheckbox ? <Checkbox checked={selected} /> : null}
              {labelJSX}
            </div>
          );
        }}
      />
    </Suspense>
  );
  if (Boolean(enableGrid)) {
    return <Grid {...GridProps}>{result}</Grid>;
  } else {
    return result;
  }
};

export default MyAutocomplete;
