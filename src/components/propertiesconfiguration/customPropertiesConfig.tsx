import { createContext, useContext } from "react";

interface CustomProperties {
  dynamicAccountNumberField?: string;
  dynamicAmountSymbol?: string;
  dynamicAmountGroup?: string;
  // dynamicDecimalScale?: number;
  currencyFormat?: string;
  decimalCount?: number;
}

const customParameters: CustomProperties = {
  dynamicAccountNumberField: "2",
  dynamicAmountSymbol: "₽",
  dynamicAmountGroup: "lakh",
  // dynamicDecimalScale: 4,
  currencyFormat: "7",
  decimalCount: 4,
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
