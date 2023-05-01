import { isEqual, isBefore, isAfter } from "date-fns";

export const greaterThanString = (factValue, jsonValue) => {
  return Number.parseFloat(factValue) > Number.parseFloat(jsonValue);
};

export const greaterThanInclusiveString = (factValue, jsonValue) => {
  return Number.parseFloat(factValue) >= Number.parseFloat(jsonValue);
};

export const lessThanString = (factValue, jsonValue) => {
  return Number.parseFloat(factValue) < Number.parseFloat(jsonValue);
};

export const lessThanInclusiveString = (factValue, jsonValue) => {
  return Number.parseFloat(factValue) <= Number.parseFloat(jsonValue);
};

export const geaterThanDate = (factValue, jsonValue) => {
  return isAfter(factValue, jsonValue);
};
export const greaterThanInclusiveDate = (factValue, jsonValue) => {
  return isEqual(factValue, jsonValue) ? true : isAfter(factValue, jsonValue);
};
export const lessThanDate = (factValue, jsonValue) => {
  return isBefore(factValue, jsonValue);
};
export const lessThanInclusiveDate = (factValue, jsonValue) => {
  return isEqual(factValue, jsonValue) ? true : isBefore(factValue, jsonValue);
};
