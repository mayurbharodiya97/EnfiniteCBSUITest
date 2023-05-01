import { CellWrapper } from "./cellWrapper";

export const DefaultCell = (props) => {
  const { value } = props;

  return <CellWrapper {...props}>{value}</CellWrapper>;
};

export const DefaultCellWithDefaultValue = (value: string) => (props) => {
  return <CellWrapper {...props}>{value}</CellWrapper>;
};
