import { CellWrapper } from "./cellWrapper";

const SequenceCellRenderer = (props) => {
  const { row } = props;
  let rowNum = `${Number(row.index) + 1}`;
  return <CellWrapper {...props}>{rowNum}</CellWrapper>;
};

const SequenceHeaderRenderer = (props) => {
  return <div>#</div>;
};

export const useSequenceColumn = (showSerialNoColumn) => (hooks) => {
  if (showSerialNoColumn) {
    hooks.visibleColumns.push((columns) => [
      {
        id: "sequence",
        Header: SequenceHeaderRenderer,
        Cell: SequenceCellRenderer,
        width: 5,
        maxWidth: 5,
        minWidth: 5,
      },
      ...columns,
    ]);
  }
};
