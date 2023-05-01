import { ActionCell } from "../components/actionCell";
import { DefaultFooterCell } from "../components/footerCell";
import { DefaultCell } from "../components/defaultCell";
import { TextFieldCell } from "../components/textFieldCell";
import { NumberCell } from "../components/NumberCell";
import { SelectFieldCell } from "../components/selectFieldCell";
import { VisaversaCell } from "../components/visaversa";
import { DateCell } from "../components/dateCell";
import { singletonFunctionRegisrationFactory } from "components/utils";

const ActionControl = {
  accessor: "action",
  alignment: "left",
  width: 150,
  Cell: ActionCell,
  columnName: "Action",
};

export const attachActionToMetaData = (myColumns) => {
  if (Array.isArray(myColumns)) {
    const columns = myColumns;
    return [...columns, ActionControl];
  }
  return myColumns;
};

export const attachFooter = (myColumns) => {
  if (Array.isArray(myColumns)) {
    let columns = myColumns;
    columns = columns.map((one) => {
      if (Boolean(one.footer)) {
        const { footer, ...others } = one;
        return { ...others, Footer: DefaultFooterCell };
      } else {
        return one;
      }
    });
    return columns;
  }
  return myColumns;
};

export const attachCells = (myColumns) => {
  if (Array.isArray(myColumns)) {
    let columns = myColumns;
    columns = columns.map((one) => {
      if (typeof one.Cell === "string") {
        switch (one.Cell) {
          case "textField": {
            return { ...one, Cell: TextFieldCell };
          }
          case "numberField": {
            return { ...one, Cell: NumberCell };
          }
          case "selectField": {
            return { ...one, Cell: SelectFieldCell };
          }
          case "visaversa": {
            return { ...one, Cell: VisaversaCell };
          }
          case "monthYear": {
            return { ...one, Cell: DateCell };
          }
          default: {
            return { ...one, Cell: DefaultCell };
          }
        }
      } else {
        return one;
      }
    });
    return columns;
  }
  return myColumns;
};

export const attachOptions = (myColumns) => {
  if (Array.isArray(myColumns)) {
    let columns = myColumns;
    columns = columns.map((one) => {
      if (typeof one.options === "string") {
        let _optionsKey = one.options;
        let options = singletonFunctionRegisrationFactory.getFn(
          _optionsKey,
          async () => [{ label: "Cannot fetch options", value: "" }]
        );
        return { ...one, _optionsKey, options };
      } else {
        return one;
      }
    });
    return columns;
  }
  return myColumns;
};

export const constructNewRowObj = (myColumns) => {
  if (Array.isArray(myColumns)) {
    let columns = myColumns;
    let newRowObj = columns.reduce((accum, current) => {
      accum[current.accessor] = current?.defaultValue ?? "";
      return accum;
    }, {});
    return newRowObj;
  }
  return {};
};
