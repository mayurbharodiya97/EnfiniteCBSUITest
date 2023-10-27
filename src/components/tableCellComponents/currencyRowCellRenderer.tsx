import { CellWrapper } from "./cellWrapper";
import { useAmountDivider } from "components/report/amountContext";
import { useContext } from "react";
import { CustomPropertiesConfigurationContext } from "components/propertiesconfiguration/customPropertiesConfig";
import getCurrencySymbol from "components/custom/getCurrencySymbol";

// const renderStyle = new Intl.NumberFormat("ar-AE", {
//   style: "currency",
//   currency: "AED",
// });

// export const CurrencyRowCellRenderer = (props) => {
//   const { value } = props;
//   // let result = renderStyle.format(value);
//   let result = "-";
//   if (value !== null && value !== "" && !isNaN(Number(value))) {
//     result = `${renderStyle.format(value)}`;
//   }
//   return <CellWrapper {...props}>{result}</CellWrapper>;
// };

export function formatCurrency(
  amount,
  symbol,
  currencyFormat = "en-IN",
  decimalCount = 0,
  symbolPosi = "start",
  textString = " "
) {
  const formattedAmount = new Intl.NumberFormat(currencyFormat, {
    minimumFractionDigits: decimalCount,
  }).format(amount);

  if (symbolPosi === "start") {
    return `${symbol} ${formattedAmount} ${textString} `;
  } else if (symbolPosi === "end") {
    return `${formattedAmount}  ${symbol} ${textString}`;
  } else {
    return `${symbol} ${formattedAmount} ${textString}`;
  }
}

export const CurrencyRowCellRenderer = (props) => {
  const customParameter = useContext(CustomPropertiesConfigurationContext);

  const { dynamicAmountSymbol, currencyFormat, decimalCount } = customParameter;

  const { value, row } = props;

  let finaleSymbol;

  let symbolPosi;

  if (Boolean(props?.column?.symbolPosi)) {
    symbolPosi = props?.column?.symbolPosi;
  }

  if (Boolean(props?.column?.isCurrencyCode)) {
    finaleSymbol = dynamicAmountSymbol ?? "INR";
  } else {
    finaleSymbol = getCurrencySymbol(dynamicAmountSymbol);
  }

  if (Boolean(props?.column?.currencyRefColumn)) {
    const currencyCode =
      props?.row?.original?.[props?.column?.currencyRefColumn];
    if (Boolean(props?.column?.isCurrencyCode)) {
      if (Boolean(currencyCode)) {
        finaleSymbol = currencyCode;
      }
    } else {
      if (Boolean(currencyCode)) {
        finaleSymbol = getCurrencySymbol(currencyCode);
      }
    }
  }

  // const divider = useAmountDivider();
  let result = "-";
  if (
    value !== null &&
    value !== "" &&
    value !== "0" &&
    !isNaN(Number(value))
  ) {
    result = `${formatCurrency(
      value,
      finaleSymbol,
      currencyFormat,
      decimalCount,
      symbolPosi
    )}`;
  }

  return <CellWrapper {...props}>{result}</CellWrapper>;
};
