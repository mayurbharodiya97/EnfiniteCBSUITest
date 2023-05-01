import { CellWrapper } from "./cellWrapper";
import { format as formatter } from "date-fns";

export const DateCell = (props) => {
  const {
    value,
    column: { format = "dd/MM/yyyy" },
  } = props;
  let result = "-";
  let date = new Date(value);
  //@ts-ignore
  if (!isNaN(date)) {
    result = formatter(new Date(value), format);
  }

  return <CellWrapper {...props}>{result}</CellWrapper>;
};
