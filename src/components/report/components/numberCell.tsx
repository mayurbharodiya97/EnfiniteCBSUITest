import { CellWrapper } from "./cellWrapper";
import { useAmountDivider } from "../amountContext";
import { useContext } from "react";
import { CustomPropertiesConfigurationContext } from "components/propertiesconfiguration/customPropertiesConfig";
import getCurrencySymbol from "components/custom/getCurrencySymbol";

function formatCurrency(amount, symbol, currencyFormat, decimalCount) {
  const formattedAmount = new Intl.NumberFormat(currencyFormat, {
    minimumFractionDigits: decimalCount,
    // currency: "ZAR",
  }).format(amount);

  return `${symbol} ${formattedAmount}`;
}

export const NumberCell = (props) => {
  const customParameter = useContext(CustomPropertiesConfigurationContext);

  const { dynamicAmountSymbol, currencyFormat, decimalCount } = customParameter;

  const { value, row } = props;

  let finaleSymbol;

  finaleSymbol = getCurrencySymbol(dynamicAmountSymbol);
  if (Boolean(props?.column?.currencyRefColumn)) {
    const currencyCode =
      props?.row?.original?.[props?.column?.currencyRefColumn];

    if (Boolean(currencyCode)) {
      finaleSymbol = getCurrencySymbol(currencyCode);
    }
  }

  const divider = useAmountDivider();
  let result = "-";
  if (value !== null && value !== "" && !isNaN(Number(value))) {
    result = `${formatCurrency(
      value / divider,
      finaleSymbol,
      currencyFormat,
      decimalCount
    )}`;
  }

  return <CellWrapper {...props}>{result}</CellWrapper>;
};

// export const NumberCell = (props) => {
//   const customParameters = useContext(CustomPropertiesConfigurationContext);
//   const { value, columns } = props;

//   console.log("columns", columns);
//   // ... existing code ...

//   let result = "-";
//   if (value !== null && value !== "" && !isNaN(Number(value))) {
//     const currencySymbol = customParameters?.dynamicAmountSymbol || "$";
//     let currencyFormat = "en-US";
//     let decimalCount = customParameters?.decimalCount || 2; // Default to 2 decimal places

//     switch (customParameters?.currencyFormat) {
//       case "1":
//         currencyFormat = "en-IN";
//         break;
//       case "2":
//         currencyFormat = "en-US";
//         break;
//       case "3":
//         currencyFormat = "bn-BD";
//         break;
//       case "4":
//         currencyFormat = "pt-BR"; // Brazilian Real (BRL)
//         break;
//       case "5":
//         currencyFormat = "ja-JP"; // Japanese Yen (JPY)
//         break;
//       // Add more cases for other currency formats if needed
//       case "6":
//         currencyFormat = "en-ZA"; // South African Rand (ZAR)
//         break;
//       case "7":
//         currencyFormat = "en-QA"; // Qatari Riyal (QAR)
//         break;
//       default:
//         currencyFormat = "en-IN";
//     }

//     const formattedValue = Number(value).toLocaleString(currencyFormat, {
//       minimumFractionDigits: decimalCount,
//       maximumFractionDigits: decimalCount,
//     });

//     result = `${currencySymbol}${formattedValue}`;
//   }

//   return <CellWrapper {...props}>{result}</CellWrapper>;
// };

export const NumberCell2 = (props) => {
  const { value } = props;
  let result = "-";
  if (value !== null && value !== "" && !isNaN(Number(value))) {
    result = `${value}`;
  }
  return <CellWrapper {...props}>{result}</CellWrapper>;
};
