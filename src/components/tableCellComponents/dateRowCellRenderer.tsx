import { format } from "date-fns";
import { CellWrapper } from "./cellWrapper";

export const DateRowCellRenderer = (props) => {
  const {
    value,
    column: { dateFormat = "dd/MM/yyyy hh:mm aaa" },
  } = props;

  if (!Boolean(value)) {
    return <CellWrapper {...props} />;
  }
  const date = new Date(value);
  let result;
  try {
    result = format(date, dateFormat);
  } catch (e) {
    result = "-";
  }
  return <CellWrapper {...props}>{result}</CellWrapper>;
};
