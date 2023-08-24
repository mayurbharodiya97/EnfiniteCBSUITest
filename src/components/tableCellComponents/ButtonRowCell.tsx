import { useMemo } from "react";
import { CellWrapper } from "./cellWrapper";
import Button from "@mui/material/Button";

export const ButtonRowCell = (props) => {
  const {
    row: {
      index,
      original: { _isNewRow },
    },
    column: { id, buttonLabel, columnName, isVisible },
    updateGridData,
    onButtonActionHandel,
  } = props;
  const is_Visible = useMemo(
    () => (Boolean(_isNewRow) ? false : isVisible),
    [isVisible, _isNewRow]
  );
  const handleClick = (e) => {
    //updateGridData(index, id, true, true, "");
    if (typeof onButtonActionHandel === "function") {
      onButtonActionHandel(index, id);
    }
  };
  return (
    <CellWrapper showBorder {...props}>
      {is_Visible ? (
        <Button variant={"contained"} color="secondary" onClick={handleClick} fullWidth>
          {Boolean(buttonLabel) ? buttonLabel : columnName}
        </Button>
      ) : null}
    </CellWrapper>
  );
};
