import { createContext, FC } from "react";
import { GridContextType } from "./types";

export const GridContext = createContext<GridContextType | null>(null);

export const GridProvider: FC<GridContextType> = ({
  gridCode,
  getGridData,

  children,
}) => {
  if (typeof getGridData !== "function") {
    return <div>Invalid Grid FNS passed</div>;
  }
  return (
    <GridContext.Provider value={{ getGridData, gridCode }}>
      {children}
    </GridContext.Provider>
  );
};
