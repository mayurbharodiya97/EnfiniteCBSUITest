import { GridColumnType } from "../types";

export const combineAndRunValidation =
  (schemaValidation, validation, authState) =>
  async (value, row, prev, next) => {
    let result;
    if (typeof schemaValidation === "function") {
      result = await schemaValidation(value);
      if (Boolean(result)) {
        return result;
      }
    }
    if (typeof validation === "function") {
      result = await validation(value, row, prev, next, authState);
      if (Boolean(result)) {
        return result;
      }
    }
    return "";
  };

export const attachcombinedValidationFns = (
  columns: GridColumnType[],
  authState
) => {
  if (Array.isArray(columns)) {
    return columns.map((column) => {
      const { schemaValidation, validation, ...others } = column;
      return {
        ...others,
        validation: combineAndRunValidation(
          schemaValidation,
          validation,
          authState
        ),
      };
    });
  }
  return [];
};
