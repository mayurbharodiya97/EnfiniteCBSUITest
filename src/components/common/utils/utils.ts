//import { AnyKindOfDictionary } from "lodash";
import { OptionsProps } from "../types";

export const getLabelFromValues =
  (options: OptionsProps[], getString: boolean = false) =>
  (values: any[] | any) => {
    let result: any[] = [];
    if (!Array.isArray(values)) {
      values = [values];
    }
    if (Array.isArray(options)) {
      result = options.reduce<string[]>((acc, current) => {
        if (values.indexOf(current.value) >= 0) {
          acc.push(current.label);
        }
        return acc;
      }, []);
    }
    if (getString) {
      return result.join(",");
    }
    return result;
  };
export const getSelectedOptionData =
  (options: any[]) => (values: any[] | any) => {
    let result: any[] = [];
    if (!Array.isArray(values)) {
      values = [values];
    }
    if (Array.isArray(options)) {
      result = options.reduce<OptionsProps[]>((acc, current) => {
        if (values.indexOf(current.value) >= 0) {
          acc.push(current);
        }
        return acc;
      }, []);
    }

    return result;
  };
