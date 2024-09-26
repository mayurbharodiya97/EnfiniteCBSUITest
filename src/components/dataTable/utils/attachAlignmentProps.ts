import { GridColumnType } from "../types";

export const attachAlignmentProps = (columns: GridColumnType[]) => {
  if (Array.isArray(columns)) {
    return columns.map((column) => {
      const { alignment, ...others } = column;
      switch (alignment) {
        case "right":
          return {
            ...others,

            cellHeaderAlinment: "0px !important",
            TableCellProps: { align: "right" },
          };
        case "center":
          return {
            ...others,
            TableCellProps: {
              align: "center",
              sx: { justifyContent: "center" },
            },
          };
        case "left":
          return {
            ...others,
            cellHeaderAlinment: "0px !important",
            TableCellProps: {
              align: "left",
            },
          };
        default:
          return others;
      }
    });
  }
  return [];
};
