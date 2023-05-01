import { Tooltip } from "@mui/material";
import { CellWrapper } from "./cellWrapper";

export const DefaultRowCellRenderer = (props) => {
  const {
    value,
    column: {
      showTooltip = false,
      transform = (value) => value,
      isAutoSequence = false,
    },
    row,
    data,
  } = props;
  //console.log(props);
  let newValue;
  let {
    original: { _isNewRow },
  } = row;
  if (isAutoSequence) {
    if (Boolean(row?.original?._displaySequence)) {
      newValue = row?.original?._displaySequence;
    } else if (Boolean(_isNewRow)) {
      newValue = data.reduce((acuu, { _hidden }) => {
        if (!Boolean(_hidden)) {
          return acuu + 1;
        }
        return acuu;
      }, 0);
    } else {
      newValue = Number(row?.index ?? 0) + 1;
    }
  } else {
    newValue = transform(value);
  }

  let result = showTooltip ? (
    <Tooltip title={newValue}>
      <span>{newValue}</span>
    </Tooltip>
  ) : (
    newValue
  );
  return <CellWrapper {...props}>{result}</CellWrapper>;
};
