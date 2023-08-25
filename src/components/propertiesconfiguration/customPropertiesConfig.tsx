import { createContext, useContext } from "react";

interface CustomProperties {
  dynamicAccountNumberField?: string;
  dynamicAmountSymbol?: string;
  dynamicAmountGroupStyle?: string;
  currencyFormat?: string; //for report set currency format
  decimalCount?: number; //for report set decimal count
  commonDateFormat?: string;
  commonDateTimeFormat?: string;
}

const customParameters: CustomProperties = {
  dynamicAccountNumberField: "2",
  dynamicAmountSymbol: "INR",
  dynamicAmountGroupStyle: "wan",
  currencyFormat: "en-IN",
  decimalCount: 2,
  commonDateFormat: "dd/MM/yyyy",
  commonDateTimeFormat: "dd/MM/yyyy hh:mm:ss aa",
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
