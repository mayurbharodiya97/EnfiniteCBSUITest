import {
  FC,
  useRef,
  useState,
  Fragment,
  ComponentType,
  HTMLAttributes,
  lazy,
  Suspense,
  useCallback,
} from "react";
import {
  Chip,
  ChipProps,
  CircularProgress,
  CircularProgressProps,
  CreateFilterOptionsConfig,
  Input,
  createFilterOptions,
} from "@mui/material";
import Autocomplete, {
  AutocompleteProps,
  // createFilterOptions,
} from "@mui/material/Autocomplete";
import { Checkbox } from "components/styledComponent/checkbox";
import { Merge, OptionsProps, dependentOptionsFn } from "../types";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useOptionsFetcherSimple } from "../utils";

const ListBoxComponentVirtualized = lazy(() =>
  import("./virtualized").then((module) => ({
    default: module.ListBoxComponent,
  }))
);

interface AutoCompleteExtendedProps {
  showCheckbox: boolean;
  CircularProgressProps?: CircularProgressProps;
  ChipProps?: ChipProps;
  CreateFilterOptionsConfig?: CreateFilterOptionsConfig<OptionsProps>;
  options?: OptionsProps[] | dependentOptionsFn;
  optionsProps?: any;
  placeholder?: string;
  required?: boolean;
  enableVirtualized?: boolean;
  _optionsKey?: string;
  disableCaching?: boolean;
  error: string;
  touched: boolean;
  handleBlur?: any;
  handleChange?: any;
  value: any;
}

type MyAutocompleteProps = Merge<
  AutocompleteProps<OptionsProps, true, true, true>,
  AutoCompleteExtendedProps
>;

const getOptionLabel = (freeSolo: any) => (option: OptionsProps) =>
  Boolean(freeSolo) ? option : option?.label ?? "";
const getOptionValue = (freeSolo: any) => (option: OptionsProps) =>
  Boolean(freeSolo) ? option : option?.value ?? "";

export const AutoCompleteGrid: FC<MyAutocompleteProps> = ({
  options,
  optionsProps,
  multiple,
  disableClearable,
  freeSolo,
  CircularProgressProps,
  ChipProps,
  showCheckbox,
  CreateFilterOptionsConfig,
  placeholder,
  limitTags,
  required,
  enableVirtualized,
  //@ts-ignore
  _optionsKey,
  disableCaching,
  error,
  handleChange,
  handleBlur,
  touched,
  value,
  fullWidth,
  ...others
}) => {
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

  const { loadingOptions } = useOptionsFetcherSimple(
    options,
    setOptionsWrapper,
    _optionsKey,
    disableCaching,
    optionsProps,
    true,
    "",
    false
  );

  // const isError = touched && (error ?? "") !== "";
  const isError = touched && Boolean(error);

  console.log(">>isError", isError);
  console.log(">>error", error);
  return (
    <Suspense fallback={"loading..."}>
      <Autocomplete
        {...others}
        //@ts-ignore
        defaultValue={[]}
        limitTags={limitTags ?? 2}
        multiple={multiple}
        disableClearable={disableClearable}
        error={isError}
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
        // getOptionSelected={(option, value) => {
        //   if (freeSolo) {
        //     if (option === value) {
        //       return true;
        //     }
        //     return false;
        //   } else {
        //     if (option.value === value.value) {
        //       return true;
        //     }
        //     return false;
        //   }
        // }}
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
            <Input
              {...params}
              {...params.InputProps}
              placeholder={placeholder}
              autoComplete="disabled"
              type="text"
              error={isError}
              required={required}
              fullWidth={fullWidth}
              disableUnderline
              endAdornment={
                <Fragment>
                  {loadingOptions ? (
                    <CircularProgress
                      color="primary"
                      variant="indeterminate"
                      {...CircularProgressProps}
                    />
                  ) : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              }
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
            // <div style={{ whiteSpace: "pre" }}>

            <li style={{ whiteSpace: "pre" }} {...props}>
              {showCheckbox ? <Checkbox checked={selected} /> : null}
              {labelJSX}
            </li>
            // </div>
          );
        }}
      />
    </Suspense>
  );
};
