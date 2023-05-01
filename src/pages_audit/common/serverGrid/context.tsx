import { createContext, FC } from "react";
import * as API from "./api";

interface CRUDFNType {
  fn: any;
  args: any;
}

interface ServerGridProviderType {
  getGridMetaData: CRUDFNType;
  getGridData: CRUDFNType;
  children?: any;
}

export const ServerGridContext = createContext<ServerGridProviderType>(
  {} as ServerGridProviderType
);

export const ServerGridContextProvider: FC<ServerGridProviderType> = ({
  children,
  getGridMetaData,
  getGridData,
}) => {
  return (
    <ServerGridContext.Provider value={{ getGridMetaData, getGridData }}>
      {children}
    </ServerGridContext.Provider>
  );
};

export const serverGridContextGenerator = (gridCode) => ({
  getGridData: { fn: API.getGridData, args: { gridCode } },
  getGridMetaData: { fn: API.getGridMetaData, args: { gridCode } },
});
