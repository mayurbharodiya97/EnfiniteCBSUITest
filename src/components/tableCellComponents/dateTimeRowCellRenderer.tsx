import { format } from "date-fns";
import { CellWrapper } from "./cellWrapper";
import { CustomPropertiesConfigurationContext } from "components/propertiesconfiguration/customPropertiesConfig";
import { useContext } from "react";
export const DateTimeRowCellRenderer = (props) => {
  const customParameter = useContext(CustomPropertiesConfigurationContext);

  const {
    dynamicAccountNumberField,
    dynamicAmountSymbol,
    dynamicAmountGroupStyle,
    decimalCount,
    commonDateFormat,
    commonDateTimeFormat,
  } = customParameter;
  const {
    value,
    column: { dateFormat },
  } = props;

  if (!Boolean(value)) {
    return <CellWrapper {...props} />;
  }
  const date = new Date(value);
  let result;
  try {
    result = format(
      date,
      (Boolean(dateFormat) ? dateFormat : commonDateTimeFormat) ||
        "dd/MM/yyyy hh:mm aaa"
    );
  } catch (e) {
    result = "-";
  }
  return <CellWrapper {...props}>{result}</CellWrapper>;
};
