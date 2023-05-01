import { CellWrapper } from "./cellWrapper";
import { useAmountDivider } from "../amountContext";

let currencyFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  style: "currency",
  currency: "INR",
});

export const NumberCell = (props) => {
  const { value } = props;
  const divider = useAmountDivider();
  let result = "-";
  if (value !== null && value !== "" && !isNaN(Number(value))) {
    result = `${currencyFormatter.format(value / divider)}`;
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
