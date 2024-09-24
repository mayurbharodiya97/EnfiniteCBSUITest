import { singletonFunctionRegisrationFactoryForTableCells } from "components/utils";
import { CurrencyRowCellRenderer } from "./currencyRowCellRenderer";
import { DateRowCellRenderer } from "./dateRowCellRenderer";
import { DefaultRowCellRenderer } from "./defaultRowCellRenderer";
import { EditableAutocomplete } from "./editableAutocomplete";
import { EditableSelect } from "./editableSelect";
import { EditableTextField } from "./editableTextField";
import { EditableMaskInputField } from "./editableMaskInputField";
import {
  EditableNumberFormat,
  EditableNumberFormatLessValidation,
} from "./editableNumberFormat";
import { ActionCellRenderer } from "./actionCellRenderer";
import { DateDifferenceCalculatorRenderer } from "./dateDifferenceRowCellRender";
import { ChipCellRenderer } from "./chipCellRenderer";
import { MultipleValuesCellRenderer } from "./multipleValuesCellRenderer";
import { DeleteRowButton } from "./deleteRowCell";
import { PercentageDifferenceRowCellRenderer } from "./percentageDifferenceCellRenderer";
import { EditableCheckbox } from "./editableCheckbox";
import { EditableDatetimePicker } from "./editableDatetimePicker";
import { EditableDatePicker } from "./editableDatePicker";
import { IconRowCellRenderer } from "./iconRowCellRenderer";
import { ButtonRowCell } from "./ButtonRowCell";
import { DisableSelect } from "./disableSelect";
import { DateTimeRowCellRenderer } from "./dateTimeRowCellRenderer";
export type CellComponentType =
  | "currency"
  | "date"
  | "dateTime"
  | "default"
  | "icondefault"
  | "action"
  | "editableAutocomplete"
  | "editableSelect"
  | "editableTextField"
  | "editableMaskInputField"
  | "editableNumberFormat"
  | "dateDiffere"
  | "deleteRowCell"
  | "buttonRowCell"
  | "percentageDiff"
  | "editableCheckbox"
  | "editableDatetimePicker"
  | "editableDatePicker"
  | "editableNumberFormatLessValidation"
  | "disableSelect"
  | "chip"
  | "multipleValuesCellRenderer";

singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "currency",
  CurrencyRowCellRenderer
);
singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "date",
  DateRowCellRenderer
);
singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "dateTime",
  DateTimeRowCellRenderer
);
singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "default",
  DefaultRowCellRenderer
);
singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "icondefault",
  IconRowCellRenderer
);
singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "editableAutocomplete",
  EditableAutocomplete
);
singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "editableSelect",
  EditableSelect
);
singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "editableTextField",
  EditableTextField
);
singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "editableMaskInputField",
  EditableMaskInputField
);
singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "editableNumberFormat",
  EditableNumberFormat
);
singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "editableNumberFormatLessValidation",
  EditableNumberFormatLessValidation
);
singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "action",
  ActionCellRenderer
);
singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "dateDiffere",
  DateDifferenceCalculatorRenderer
);
singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "chip",
  ChipCellRenderer
);
singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "multipleValuesCellRenderer",
  MultipleValuesCellRenderer
);

singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "deleteRowCell",
  DeleteRowButton
);
singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "buttonRowCell",
  ButtonRowCell
);
singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "percentageDiff",
  PercentageDifferenceRowCellRenderer
);
singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "editableCheckbox",
  EditableCheckbox
);
singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "editableDatetimePicker",
  EditableDatetimePicker
);
singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "editableDatePicker",
  EditableDatePicker
);
singletonFunctionRegisrationFactoryForTableCells.registerFn(
  "disableSelect",
  DisableSelect
);
