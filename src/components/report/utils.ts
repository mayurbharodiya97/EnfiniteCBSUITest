import { FilterColumnType } from "./types";
import {
  ValueFilter,
  ValueDateFilter,
  OptionsFilter,
  RangeFilter,
  MultiValueFilter,
} from "./filters2";
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
        case "valueDateFilter": {
          return {
            ...others,
            Filter: ValueDateFilter,
            filterProps,
          };
        }
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

export const formatFilterBy = (filterBy = []) => {
  if (!Array.isArray(filterBy)) {
    filterBy = [filterBy];
  }
  console.log(filterBy);
  const formatted = filterBy.map((one: any, index) => ({
    accessor: one.id,
    ...one.value,
  }));
  console.log(formatted);
  return formatted;
};
