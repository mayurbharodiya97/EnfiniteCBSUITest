import { GridColumnType } from "../types";

export const attachAlignmentProps = (columns: GridColumnType[]) => {
  if (Array.isArray(columns)) {
    return columns.map((column) => {
      const { alignment, ...others } = column;
      switch (alignment) {
        case "right":
          return {
            ...others,
            TableCellProps: { align: "right", sx: { paddingRight: "0px" } },
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
            TableCellProps: { align: "left", sx: { paddingLeft: "0px" } },
          };
        default:
          return others;
      }
    });
  }
  return [];
};
