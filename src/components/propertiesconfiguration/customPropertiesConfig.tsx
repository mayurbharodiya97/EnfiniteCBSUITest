import { createContext, useContext } from "react";

interface CustomProperties {
  dynamicAccountNumberField?: string;
  dynamicAmountSymbol?: string;
  // dynamicReportAmountSymbol?: string;
  dynamicAmountGroup?: string;
  // dynamicDecimalScale?: number;
  currencyFormat?: string; //for report set currency format
  decimalCount?: number; //for report set decimal count
  dynamicSymbolPosition?: string;
}

const customParameters: CustomProperties = {
  dynamicAccountNumberField: "2",
  dynamicAmountSymbol: "INR",
  // currencyShortName:""
  // dynamicReportAmountSymbol: "฿",
  // dynamicAmountGroup: "lakh",
  // dynamicDecimalScale: 4,
  currencyFormat: "en-IN",
  decimalCount: 3,
  dynamicSymbolPosition: "end",
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
