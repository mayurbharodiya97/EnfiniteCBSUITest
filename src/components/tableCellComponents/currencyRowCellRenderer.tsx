import { CellWrapper } from "./cellWrapper";

const renderStyle = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export const CurrencyRowCellRenderer = (props) => {
  const { value } = props;
  let result = renderStyle.format(value);
  return <CellWrapper {...props}>{result}</CellWrapper>;
};
