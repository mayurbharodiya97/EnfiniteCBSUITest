import { CellComponentType } from "components/tableCellComponents";

export interface GridColumnType {
  columnName: string;
  accessor: string;
  sequence: number;
  componentType: CellComponentType;
  Cell?: any;
  alignment?: string;
  TableCellProps?: any;
  disableSortBy?: boolean;
  width?: number;
  maxWidth?: number;
  minWidth?: number;
  isVisible?: boolean;
  sortDescFirst?: boolean;
  dateFormat?: string;
  actions?: string[] | string;
}

export interface FilterColumnType {
  Filter?: any;
  filterComponentType?:
    | "valueFilter"
    | "rangeFilter"
    | "optionsFilter"
    | "multiValueFilter";
  filterProps?: {
    type: string;
  };
}

export interface GridConfigType {
  dense?: boolean;
  pageSize?: number[];
  defaultPageSize?: number;
  gridLabel: string;
  rowIdColumn: string;
  allowColumnReordering?: boolean;
  allowColumnHiding?: boolean;
  allowKeyboardNavigation?: boolean;
  allowGlobalFilter?: boolean;
  allowFilter?: boolean;
  allowRowSelection?: boolean;
  filterAlwaysVisible?: boolean;
  defaultColumnConfig: {
    width?: number;
    maxWidth?: number;
    minWidth?: number;
  };
  style: {
    backgroundColor: string;
  };
}

export interface HeaderFilterType {
  accessor: string;
  columnName: string;
  level: number;
  filterComponentProps: any;
  filterComponentType: string;
}

export interface GridMetaDataType {
  columns: GridColumnType[];
  filters: FilterColumnType[];
  gridConfig: GridConfigType;
  hiddenColumns?: string[];
  headerFilters?: HeaderFilterType[];
  actions?: ActionTypes[];
  setAction?: any;
  multipleActions: ActionTypes[];
  singleActions: ActionTypes[];
  doubleClickAction: ActionTypes | boolean;
  alwaysAvailableAction: ActionTypes[];
}

export interface ActionTypes {
  actionName: string;
  actionLabel: string;
  multiple: boolean | undefined;
  actionIcon?: any;
  tooltip?: string;
  rowDoubleClick?: boolean;
  alwaysAvailable?: boolean;
  shouldExclude?: any;
  isNodataThenShow?: boolean;
  actionTextColor?: string;
  actionBackground?: string;
  onEnterSubmit?: boolean;
}

export interface RenderActionType {
  actions: ActionTypes[];
  setAction: any;
  selectedRows: any;
  buttonTextColor?: string;
  buttonBackground?: string;
  style?: {};
  submitButtonRef?: any;
}

export interface TableActionType {
  selectedFlatRows: any;
  contextMenuRow?: any;
  singleActions: ActionTypes[];
  multipleActions?: ActionTypes[];
  alwaysAvailableAction?: ActionTypes[];
  setGridAction: any;
  mouseX?: any;
  mouseY?: any;
  dense?: boolean;
  handleClose?: any;
  authState?: any;
  submitButtonRef?: any;
}

export interface GridContextType {
  gridCode: any;
  getGridData: any;
}
