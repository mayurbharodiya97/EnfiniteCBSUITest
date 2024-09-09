import {
  attachActionToMetaData,
  attachCells,
  attachFooter,
  attachOptions,
} from "./methods";

export const modifyMetaData = (columns) => {
  columns = attachOptions(columns);
  columns = attachActionToMetaData(columns);
  columns = attachFooter(columns);
  columns = attachCells(columns);
  return columns;
};
