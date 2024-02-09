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
  dynamicAccountNumberField: "2", //for set account number field set
  dynamicAmountSymbol: "INR", //this prop for gridWrapper ,report and formWrapper
  dynamicAmountGroupStyle: "lakh", //this prop for formWrapper
  currencyFormat: "en-IN", //this prop for gridWrapper only
  decimalCount: 2, //this prop for gridWrapper ,report and formWrapper
  commonDateFormat: "dd/MM/yyyy", //this prop for gridWrapper ,report and formWrapper
  commonDateTimeFormat: "dd/MM/yyyy hh:mm:ss aa", //this prop for gridWrapper ,report and formWrapper
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
