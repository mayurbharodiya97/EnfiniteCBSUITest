import { CellWrapper } from "./cellWrapper";

export const PercentageDifferenceRowCellRenderer = (props) => {
  const value = props?.cell?.row?.original ?? "";
  let derivedPercentage: any = 0;

  const fromPercentage = Number(value?.fromPercentage);
  const toPercentage = Number(value?.toPercentage);

  if (!isNaN(fromPercentage) && !isNaN(toPercentage)) {
    derivedPercentage = `${toPercentage - fromPercentage}%`;
  }

  return <CellWrapper {...props}>{derivedPercentage}</CellWrapper>;
};
