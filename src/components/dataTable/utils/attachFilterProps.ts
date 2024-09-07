import { FilterColumnType } from "../types";
import {
  ValueFilter,
  OptionsFilter,
  RangeFilter,
  MultiValueFilter,
} from "../components/filters2";
import { singletonFunctionRegisrationFactory } from "components/utils";

const optionsMethodNotFound = (fieldKey) => () => {
  console.log(`no method found for options at ${fieldKey}`);
  return [{ label: "Oops error occured", value: "" }];
};

export const attachFilterComponentToMetaData = (
  filters: FilterColumnType[]
) => {
  if (Array.isArray(filters)) {
    return filters.map((filter) => {
      const { filterComponentType, filterProps, ...others } = filter;
      switch (filterComponentType) {
        case "valueFilter": {
          return {
            ...others,
            Filter: ValueFilter,
            filterProps,
          };
        }
        case "multiValueFilter": {
          return {
            ...others,
            Filter: MultiValueFilter,
            filterProps,
          };
        }
        case "optionsFilter": {
          //@ts-ignore
          const { options, ...filterOthers } = filterProps;
          if (typeof options === "string") {
            const myOptions = singletonFunctionRegisrationFactory.getFn(
              options ?? "NOT_EXIST_OPTIONS_FN",
              optionsMethodNotFound
            );
            return {
              ...others,
              Filter: OptionsFilter,
              filterProps: {
                options: myOptions,
                _optionsKey: options,
                ...filterOthers,
              },
            };
          } else {
            return {
              ...others,
              Filter: OptionsFilter,
              filterProps,
            };
          }
        }
        case "rangeFilter":
          return {
            ...others,
            Filter: RangeFilter,
            filterProps,
          };
        default:
          return {
            ...others,
          };
      }
    });
  }
  return [];
};
