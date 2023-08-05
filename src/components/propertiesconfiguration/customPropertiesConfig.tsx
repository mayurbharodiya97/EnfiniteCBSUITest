import { createContext, useContext } from "react";

interface CustomProperties {
  dynamicAccountNumberField: string;
}

const customParameters: CustomProperties = {
  dynamicAccountNumberField: "2",
};

export const CustomPropertiesConfigurationContext =
  createContext(customParameters);
//
export const CustomPropertiesConfigurationProvider = ({ children }) => {
  return (
    <CustomPropertiesConfigurationContext.Provider value={customParameters}>
      {children}
    </CustomPropertiesConfigurationContext.Provider>
  );
};
//
