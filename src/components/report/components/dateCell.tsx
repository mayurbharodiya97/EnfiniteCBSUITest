import { CellWrapper } from "./cellWrapper";
import { format as formatter } from "date-fns";
import { CustomPropertiesConfigurationContext } from "components/propertiesconfiguration/customPropertiesConfig";
import { useContext } from "react";

export const DateCell = (props) => {
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
    column: { format },
  } = props;
  let result = "-";
  let date = new Date(value);
  //@ts-ignore
  if (!isNaN(date)) {
    result = formatter(
      new Date(value),
      (Boolean(format) ? format : commonDateFormat) || "dd/MM/yyyy"
    );
  }

  return <CellWrapper {...props}>{result}</CellWrapper>;
};
