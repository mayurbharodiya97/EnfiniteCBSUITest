import { useMemo } from "react";
import { CellWrapper } from "./cellWrapper";
import Button from "@mui/material/Button";

export const ButtonRowCell = (props) => {
  const {
    value: initialValue,
    row: {
      index,
      original: { _isNewRow },
    },
    column: {
      id,
      buttonLabel,
      columnName,
      isVisible,
      isVisibleInNew,
      shouldExclude,
    },
    updateGridData,
    onButtonActionHandel,
  } = props;
  const is_Visible = useMemo(
    () => (Boolean(_isNewRow) ? isVisibleInNew : isVisible),
    [isVisible, _isNewRow]
  );
  const isShouldExclude = useMemo(() => {
    if (typeof shouldExclude === "function") {
      return shouldExclude(initialValue);
    }
    return false;
  }, [initialValue]);
  const handleClick = (e) => {
    //updateGridData(index, id, true, true, "");
    if (typeof onButtonActionHandel === "function") {
      onButtonActionHandel(index, id);
    }
  };
  if (isShouldExclude) {
    return <CellWrapper showBorder {...props}></CellWrapper>;
  }
  return (
    <CellWrapper showBorder {...props}>
      {is_Visible ? (
        <Button
          variant={"contained"}
          color="secondary"
          onClick={handleClick}
          fullWidth
        >
          {Boolean(buttonLabel) ? buttonLabel : columnName}
        </Button>
      ) : null}
    </CellWrapper>
  );
};
