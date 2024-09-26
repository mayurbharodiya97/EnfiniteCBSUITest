import { CellWrapper } from "./cellWrapper";
import { format as formatter } from "date-fns";
import { CustomPropertiesConfigurationContext } from "components/propertiesconfiguration/customPropertiesConfig";
import { useContext } from "react";
export const DateTimeCell = (props) => {
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
    column: { format = "dd/MM/yyyy HH:mm:ss" },
  } = props;
  let result = "00/00/0000 00:00:00";
  let date = new Date(value);
  //@ts-ignore
  if (!isNaN(date)) {
    result = formatter(
      new Date(value),
      (Boolean(format) ? format : commonDateTimeFormat) || "dd/MM/yyyy HH:mm:ss"
    );
  }

  return <CellWrapper {...props}>{result}</CellWrapper>;
};
