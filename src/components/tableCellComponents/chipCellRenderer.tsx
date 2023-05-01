import Chip from "@material-ui/core/Chip";
import { CellWrapper } from "./cellWrapper";

export const ChipCellRenderer = (props) => {
  const {
    value,
    column: { transform = (value) => value },
  } = props;
  let newValue = transform(value);
  return (
    <CellWrapper {...props}>
      <Chip label={newValue} variant="outlined" />
    </CellWrapper>
  );
};
