import { CellWrapper } from "./cellWrapper";
import { useAmountDivider } from "../amountContext";
import { useContext } from "react";
import { CustomPropertiesConfigurationContext } from "components/propertiesconfiguration/customPropertiesConfig";

// let currencyFormatter = new Intl.NumberFormat("en-IN", {
//   minimumFractionDigits: 3,
//   style: "currency",
//   currency: "INR",
//   useGrouping: true,
// });

// export const NumberCell = (props) => {
//   const customParameters = useContext(CustomPropertiesConfigurationContext);

//   console.log(props, "PROPS");
//   const { value } = props;
//   const divider = useAmountDivider();
//   console.log(divider, "PROPS");

//   let result = "-";
//   if (value !== null && value !== "" && !isNaN(Number(value))) {
//     result = `${currencyFormatter.format(value / divider)}`;
//   }

//   return (
//     <CellWrapper
//       {...props}
//     >{`${customParameters?.dynamicAmountSymbol}${result}`}</CellWrapper>
//   );
// };.

export const NumberCell = (props) => {
  const customParameters = useContext(CustomPropertiesConfigurationContext);
  const { value, columns } = props;

  console.log("columns", columns);
  // ... existing code ...

  let result = "-";
  if (value !== null && value !== "" && !isNaN(Number(value))) {
    const currencySymbol = customParameters?.dynamicAmountSymbol || "$";
    let currencyFormat = "en-US";
    let decimalCount = customParameters?.decimalCount || 2; // Default to 2 decimal places

    switch (customParameters?.currencyFormat) {
      case "1":
        currencyFormat = "en-IN";
        break;
      case "2":
        currencyFormat = "en-US";
        break;
      case "3":
        currencyFormat = "bn-BD";
        break;
      case "4":
        currencyFormat = "pt-BR"; // Brazilian Real (BRL)
        break;
      case "5":
        currencyFormat = "ja-JP"; // Japanese Yen (JPY)
        break;
      // Add more cases for other currency formats if needed
      case "6":
        currencyFormat = "en-ZA"; // South African Rand (ZAR)
        break;
      case "7":
        currencyFormat = "en-QA"; // Qatari Riyal (QAR)
        break;
      default:
        currencyFormat = "en-IN";
    }

    const formattedValue = Number(value).toLocaleString(currencyFormat, {
      minimumFractionDigits: decimalCount,
      maximumFractionDigits: decimalCount,
    });

    result = `${currencySymbol}${formattedValue}`;
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
