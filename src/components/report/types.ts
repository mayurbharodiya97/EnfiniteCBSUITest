export interface FilterColumnType {
  Filter?: any;
  filterComponentType?:
    | "valueFilter"
    | "valueDateFilter"
    | "rangeFilter"
    | "optionsFilter"
    | "multiValueFilter";
  filterProps?: {
    type: string;
  };
}
