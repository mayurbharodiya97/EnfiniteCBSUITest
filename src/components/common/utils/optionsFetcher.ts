import { useEffect, useContext } from "react";
import { useQuery } from "react-query";
import { cacheWrapperKeyGen, ClearCacheContext } from "cache";
import { transformDependentFieldsState } from "packages/form";
import { AuthContext } from "pages_audit/auth";
const computeDependentKey = (dependentValues = {}) => {
  let keys = Object.keys(dependentValues).sort();
  return keys.reduce((accum, one) => {
    accum[one] = dependentValues[one].value;
    return accum;
  }, {});
};

export const useOptionsFetcher = (
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
  enableDefaultOption
): { loadingOptions: boolean } => {
  let loadingOptions = false;
  let queryKey: any[] = [];
  const { authState } = useContext(AuthContext);
  const { addEntry } = useContext(ClearCacheContext);
  const formStateKeys = cacheWrapperKeyGen(
    Object.values(
      typeof formState === "object" && formState !== null
        ? formState
        : { none: true }
    )
  );
  if (Boolean(disableCaching)) {
    const dependentKeys = computeDependentKey(dependentValues);
    queryKey = [_optionsKey, formStateKeys, dependentKeys];
  } else {
    queryKey = [_optionsKey, formStateKeys];
  }
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!disableCaching) {
      addEntry([_optionsKey, formStateKeys]);
    }
  }, [addEntry, _optionsKey, formStateKeys]);

  const queryOptions = useQuery(
    queryKey,
    () =>
      options(
        dependentValues,
        formState,
        transformDependentFieldsState(dependentValues),
        authState
      ),
    {
      retry: false,
      enabled: typeof options === "function",
      cacheTime: disableCaching ? 0 : 100000000,
    }
  );
  loadingOptions = queryOptions.isLoading;
  /*eslint-disable */
  useEffect(() => {
    if (options === undefined) {
      setOptions([
        {
          label: "No Data",
          value: null,
          disabled: true,
          isDefaultOption: true,
        },
      ]);
      loadingOptions = false;
    } else if (Array.isArray(options)) {
      if (!Boolean(skipDefaultOption)) {
        options = [
          {
            label: Boolean(defaultOptionLabel)
              ? defaultOptionLabel
              : "Select Option",
            value: " ",
            disabled: Boolean(enableDefaultOption) ? false : true,
          },
          ...options,
        ];
        // const uniqueOptions = options.filter(
        //   (option, index, self) =>
        //     index ===
        //     self.findIndex(
        //       (obj) =>
        //         obj.label === option.label &&
        //         obj.value === option.value &&
        //         obj.disabled === option.disabled
        //     )
        // );
        // options = uniqueOptions;
      }
      setOptions(options);
      loadingOptions = false;
    } else if (typeof options === "object") {
      const { options: _options, ...others } = options;
      if (Array.isArray(_options)) {
        setOptions(options);
        if (Object.keys(others).length > 0) {
          setIncomingMessage(others);
        }
      } else {
        setOptions([
          {
            label: "Invalid Data",
            value: null,
            disabled: true,
            isDefaultOption: true,
          },
        ]);
      }
      loadingOptions = false;
    } else if (queryOptions.isLoading) {
      setOptions([
        {
          label: "loading...",
          value: null,
          disabled: true,
          isDefaultOption: true,
        },
      ]);
      loadingOptions = true;
    } else if (queryOptions.isError) {
      setOptions([
        {
          label: "Couldn't fetch",
          value: null,
          disabled: true,
          isDefaultOption: true,
        },
      ]);
      console.log(
        `error occured while fetching data for ${_optionsKey}`,
        queryOptions.error
      );
      loadingOptions = false;
    } else if (Array.isArray(queryOptions.data)) {
      let newOptions = queryOptions.data;
      if (!Boolean(skipDefaultOption)) {
        newOptions = [
          {
            label: Boolean(defaultOptionLabel)
              ? defaultOptionLabel
              : "Select Option",
            value: " ",
            disabled: Boolean(enableDefaultOption) ? false : true,
            isDefaultOption: true,
          },
          ...newOptions,
        ];
      }
      setOptions(newOptions);
      loadingOptions = false;
    } else if (typeof queryOptions.data === "object") {
      const { options: _options, ...others } = queryOptions.data;
      if (Array.isArray(_options)) {
        setOptions(_options);
        if (Object.keys(others).length > 0) {
          setIncomingMessage(others);
        }
      } else {
        setOptions([{ label: "Invalid Data", value: null, disabled: true }]);
      }
      loadingOptions = false;
    } else {
      setOptions([
        {
          label: "Couldn't fetch",
          value: null,
          disabled: true,
          isDefaultOption: true,
        },
      ]);
      console.log(
        `expected optionsFunction:${_optionsKey} in select component to return array of OptionsType but got: ${queryOptions.data}`
      );
      loadingOptions = false;
    }
  }, [loadingOptions, queryOptions.dataUpdatedAt]);

  useEffect(() => {
    if (incomingMessage !== null && typeof incomingMessage === "object") {
      const { value } = incomingMessage;
      if (Boolean(value) || value === "") {
        handleChangeInterceptor(value);
        if (whenToRunValidation === "onBlur") {
          runValidation({ value: value }, true);
        }
      }
    }
  }, [
    incomingMessage,
    setOptions,
    handleChangeInterceptor,
    runValidation,
    whenToRunValidation,
  ]);

  return { loadingOptions };
};

/****** ---- */

export const useOptionsFetcherSimple = (
  options,
  setOptions,
  _optionsKey,
  disableCaching,
  optionsProps,
  skipDefaultOption,
  defaultOptionLabel,
  enableDefaultOption
) => {
  let loadingOptions = false;
  const { authState } = useContext(AuthContext);

  let queryKey: any[] = [];
  if (Boolean(disableCaching)) {
    queryKey = [_optionsKey, optionsProps];
  } else {
    queryKey = [_optionsKey];
  }
  const queryOptions = useQuery(
    queryKey,
    () => options(optionsProps, authState),
    {
      retry: false,
      enabled: typeof options === "function",
      cacheTime: disableCaching ? 0 : 100000000,
    }
  );
  loadingOptions = queryOptions.isLoading;
  useEffect(() => {
    if (options === undefined) {
      setOptions([{ label: "No Data", value: null, disabled: true }]);
      loadingOptions = false;
    } else if (Array.isArray(options)) {
      if (!Boolean(skipDefaultOption)) {
        options = [
          {
            label: Boolean(defaultOptionLabel)
              ? defaultOptionLabel
              : "Select Option",
            value: "00",
            disabled: Boolean(enableDefaultOption) ? false : true,
            isDefaultOption: true,
          },
          ...options,
        ];
      }
      setOptions(options);
      loadingOptions = false;
    } else if (queryOptions.isLoading) {
      setOptions([{ label: "loading...", value: null, disabled: true }]);
      loadingOptions = true;
    } else if (queryOptions.isError) {
      setOptions([{ label: "Couldn't fetch", value: null, disabled: true }]);
      console.log(
        `error occured while fetching data for ${_optionsKey}`,
        queryOptions.error
      );
      loadingOptions = false;
    } else {
      if (Array.isArray(queryOptions.data)) {
        let newOptions = queryOptions.data;
        if (!Boolean(skipDefaultOption)) {
          newOptions = [
            {
              label: Boolean(defaultOptionLabel)
                ? defaultOptionLabel
                : "Select Option",
              value: "00",
              disabled: Boolean(enableDefaultOption) ? false : true,
              isDefaultOption: true,
            },
            ...newOptions,
          ];
        }
        setOptions(newOptions);
      } else {
        setOptions([{ label: "Couldn't fetch", value: null, disabled: true }]);
        console.log(
          `expected optionsFunction:${_optionsKey} in select component to return array of OptionsType but got: ${queryOptions.data}`
        );
      }
      loadingOptions = false;
    }
  }, [loadingOptions]);

  return { loadingOptions };
};

/**** */

export const useOptionsFetcherSimpleWithRemoveCache = (
  options,
  setOptions,
  _optionsKey,
  disableCaching,
  optionsProps,
  skipDefaultOption,
  defaultOptionLabel
) => {
  let loadingOptions = false;
  const { addEntry } = useContext(ClearCacheContext);
  let queryKey: any[] = [];
  if (Boolean(disableCaching)) {
    queryKey = [_optionsKey, optionsProps];
  } else {
    queryKey = [_optionsKey];
  }

  useEffect(() => {
    if (!disableCaching) {
      addEntry(_optionsKey);
    }
  }, [addEntry]);

  const queryOptions = useQuery(queryKey, () => options(optionsProps), {
    retry: false,
    enabled: typeof options === "function",
    cacheTime: disableCaching ? 0 : 100000000,
  });
  loadingOptions = queryOptions.isLoading;
  useEffect(() => {
    if (options === undefined) {
      setOptions([{ label: "No Data", value: null, disabled: true }]);
      loadingOptions = false;
    } else if (Array.isArray(options)) {
      if (!Boolean(skipDefaultOption)) {
        options = [
          {
            label: Boolean(defaultOptionLabel)
              ? defaultOptionLabel
              : "Select Option",
            value: "00",
            disabled: true,
          },
          ...options,
        ];
      }
      setOptions(options);
      loadingOptions = false;
    } else if (queryOptions.isLoading) {
      setOptions([{ label: "loading...", value: null, disabled: true }]);
      loadingOptions = true;
    } else if (queryOptions.isError) {
      setOptions([{ label: "Couldn't fetch", value: null, disabled: true }]);
      console.log(
        `error occured while fetching data for ${_optionsKey}`,
        queryOptions.error
      );
      loadingOptions = false;
    } else {
      if (Array.isArray(queryOptions.data)) {
        let newOptions = queryOptions.data;
        if (!Boolean(skipDefaultOption)) {
          newOptions = [
            {
              label: Boolean(defaultOptionLabel)
                ? defaultOptionLabel
                : "Select Option",
              value: "00",
              disabled: true,
            },
            ...newOptions,
          ];
        }
        setOptions(newOptions);
      } else {
        setOptions([{ label: "Couldn't fetch", value: null, disabled: true }]);
        console.log(
          `expected optionsFunction:${_optionsKey} in select component to return array of OptionsType but got: ${queryOptions.data}`
        );
      }
      loadingOptions = false;
    }
  }, [loadingOptions]);

  return { loadingOptions };
};
