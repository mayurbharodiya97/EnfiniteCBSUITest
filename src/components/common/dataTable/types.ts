export type CellComponentType =
  | "textField"
  | "currency"
  | "rateOfInt"
  | "default";

export interface GridColumnType {
  accessor: string;
  columnName: string;
  alignment?: string;
  width?: number;
  maxWidth?: number;
  minWidth?: number;
  Cell?: any;
  footer?: boolean;
  defaultValue?: string | number;
  options?: any;
  multiple?: boolean;
  showCheckbox?: boolean;
  displayStyle?: string;
  FormatProps?: any;
  ViceVersaProps?: any;
  type?: any;
  clearFields?: any;
  enableNumWords?: boolean;
  maxLength?: any;
  MaskProps?: any;
  footerRenderStyle?: "currency";
}
