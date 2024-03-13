import { CellWrapper } from "./cellWrapper";
import { useAmountDivider } from "../amountContext";
import { useContext } from "react";
import { CustomPropertiesConfigurationContext } from "components/propertiesconfiguration/customPropertiesConfig";
import getCurrencySymbol from "components/custom/getCurrencySymbol";

function formatCurrency(
  amount,
  symbol,
  currencyFormat = "en-IN",
  decimalCount = 0,
  symbolPosi = "start"
) {
  const formattedAmount = new Intl.NumberFormat(currencyFormat, {
    minimumFractionDigits: decimalCount,
    // currency: "ZAR",
  }).format(amount);
  if (symbolPosi === "start") {
    return `${symbol} ${formattedAmount}`;
  } else if (symbolPosi === "end") {
    return `${formattedAmount} ${symbol}`;
  } else {
    return `${symbol} ${formattedAmount}`;
  }
}

export const NumberCell = (props) => {
  const customParameter = useContext(CustomPropertiesConfigurationContext);

  const { dynamicAmountSymbol, currencyFormat, decimalCount } = customParameter;

  const { value, row } = props;

  let finaleSymbol;

  let symbolPosi = "start";

  if (Boolean(props?.column?.symbolPosi)) {
    symbolPosi = props?.column?.symbolPosi;
  }

  if (props?.column?.isCurrencyCode) {
    finaleSymbol = dynamicAmountSymbol ?? "INR";
  } else {
    finaleSymbol = getCurrencySymbol(dynamicAmountSymbol);
  }

  if (Boolean(props?.column?.currencyRefColumn)) {
    const currencyCode =
      props?.row?.original?.[props?.column?.currencyRefColumn];
    if (props?.column?.isCurrencyCode) {
      if (Boolean(currencyCode)) {
        finaleSymbol = currencyCode;
      }
    } else {
      if (Boolean(currencyCode)) {
        finaleSymbol = getCurrencySymbol(currencyCode);
      }
    }
  }

  const divider = useAmountDivider();
  let result = "-";
  if (value !== null && value !== "" && !isNaN(Number(value))) {
    result = `${formatCurrency(
      value / divider,
      finaleSymbol,
      currencyFormat,
      decimalCount,
      symbolPosi
    )}`;
  }

  return <CellWrapper {...props}>{result}</CellWrapper>;
};

export const NumberCell2 = (props) => {
  const { value } = props;
  let result = "-";
  if (value !== null && value !== "" && !isNaN(Number(value))) {
    result = `${value}`;
  }
  return <CellWrapper {...props}>{result}</CellWrapper>;
};
