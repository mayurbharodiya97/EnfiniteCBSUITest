import { ActionTypes } from "components/dataTable/types";
import { CellComponentType } from "components/tableCellComponents";

export interface GridColumnType {
  columnName: string;
  accessor: string;
  sequence: number;
  componentType: CellComponentType;
  Cell?: any;
  alignment?: string;
  TableCellProps?: any;
  width?: number;
  maxWidth?: number;
  minWidth?: number;
  sortDescFirst?: boolean;
  dateFormat?: string;
  isVisible?: boolean;
  validation?: any;
  showTooltip?: boolean;
  schemaValidation?: YupSchemaMetaDataType;
  options?: any;
  isPassword?: boolean;
  disableCachingOptions?: boolean;
  actions?: string[] | string;
  color?: any;
  isTableHidden?: boolean;
  _optionsKey?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  FormatProps?: any;
  enableNumWords?: boolean;
  transform?: any;
  isAutoSequence?: boolean;
  defaultOptionLabel?: string;
  requestProps?: string | Object;
  className?: string;
  defaultValue?: any;
  mindate?: any;
  isDisabledOnBlurEvent?: boolean;
  isReadOnly?: boolean;
  __EDIT__?: any;
  buttonLabel?: string;
}

export interface GridConfigType {
  dense?: boolean;
  gridLabel: string;
  rowIdColumn: string;
  defaultColumnConfig: {
    width?: number;
    maxWidth?: number;
    minWidth?: number;
  };
  disableSorting?: boolean;
  allowColumnReordering?: boolean;
  hideHeader?: boolean;
  hideFooter?: boolean;
  containerHeight?: {
    min: string;
    max: string;
  };
  pageSizes?: number[];
  defaultPageSize?: number;
  allowRowSelection?: boolean;
  enablePagination?: boolean;
  disableGlobalFilter?: boolean;
  disableGroupBy?: boolean;
  disableLoader?: boolean;
  allowFilter?: boolean;
  allowColumnHiding?: boolean;
  isCusrsorFocused?: boolean;
  hiddenFlag?: string;
}

export interface GridMetaDataType {
  columns: GridColumnType[];
  filters?: any[];
  hiddenColumns?: string[];
  gridConfig: GridConfigType;
  actions?: ActionTypes[];
  setAction?: any;
}

export interface GridWrapperPropTypes {
  finalMetaData: GridMetaDataType;
  data: any;
  setData: any;
  actions?: ActionTypes[];
  setAction?: any;
  loading?: any;
  gridProps?: any;
  refetchData?: any;
  defaultSortOrder?: any;
  defaultGroupBy?: any;
  defaultFilter?: any;
  hideHeader?: boolean;
  hideFooter?: boolean;
  autoRefreshInterval?: any;
  onClickActionEvent?: any;
  controlsAtBottom?: boolean;
  headerToolbarStyle?: {};
  onlySingleSelectionAllow?: boolean;
  isNewRowStyle?: boolean;
}

export interface YupSchemaMetaDataType {
  type: "string" | "number" | "boolean" | "date";
  rules?: YupRulesType[];
}

interface YupRulesType {
  name: string;
  params: any[];
}
