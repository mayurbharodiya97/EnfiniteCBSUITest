import { CellWrapper } from "./cellWrapper";
import { useAmountDivider } from "components/report/amountContext";
import { useContext } from "react";
import { CustomPropertiesConfigurationContext } from "components/propertiesconfiguration/customPropertiesConfig";
import getCurrencySymbol from "components/custom/getCurrencySymbol";

// const renderStyle = new Intl.NumberFormat("en-IN", {
//   style: "currency",
//   currency: "INR",
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

function formatCurrency(amount, symbol, currencyFormat, decimalCount) {
  const formattedAmount = new Intl.NumberFormat(currencyFormat, {
    minimumFractionDigits: decimalCount,
    // currency: "ZAR",
  }).format(amount);

  return `${symbol} ${formattedAmount}`;
}

export const CurrencyRowCellRenderer = (props) => {
  const customParameter = useContext(CustomPropertiesConfigurationContext);

  const { dynamicAmountSymbol, currencyFormat, decimalCount } = customParameter;

  const { value, row } = props;

  // console.log(props, "<<props");

  let finaleSymbol;

  finaleSymbol = getCurrencySymbol(dynamicAmountSymbol);
  if (Boolean(props?.column?.currencyRefColumn)) {
    const currencyCode =
      props?.row?.original?.[props?.column?.currencyRefColumn];

    if (Boolean(currencyCode)) {
      finaleSymbol = getCurrencySymbol(currencyCode);
    }
  }

  // const divider = useAmountDivider();
  let result = "-";
  if (value !== null && value !== "" && !isNaN(Number(value))) {
    result = `${formatCurrency(
      value,
      finaleSymbol,
      currencyFormat,
      decimalCount
    )}`;
  }

  return <CellWrapper {...props}>{result}</CellWrapper>;
};
