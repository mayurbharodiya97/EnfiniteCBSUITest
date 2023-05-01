import Button from "@material-ui/core/Button";
import { CellWrapper } from "./cellWrapper";

export const DeleteRowButton = (props) => {
  const {
    row: { index },
    column: { id },
    updateGridData,
  } = props;

  const handleClick = (e) => {
    updateGridData(index, id, true, true, "");
  };
  return (
    <CellWrapper showBorder {...props}>
      <Button onClick={handleClick} fullWidth>
        Delete
      </Button>
    </CellWrapper>
  );
};
