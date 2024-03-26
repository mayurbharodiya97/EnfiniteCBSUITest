import { useMemo } from "react";
import { CellWrapper } from "./cellWrapper";
import Button from "@mui/material/Button";

export const ButtonRowCell = (props) => {
  const {
    value: initialValue,
    row: {
      index,
      // change by parag
      original,
      // original: { _isNewRow },
    },
    column: {
      id,
      buttonLabel,
      columnName,
      isVisible,
      isVisibleInNew,
      shouldExclude,
      isColumnName,
    },
    updateGridData,
    onButtonActionHandel,
    data,
  } = props;
  const is_Visible = useMemo(
    () => (Boolean(original?._isNewRow) ? isVisibleInNew : isVisible),
    [isVisible, original?._isNewRow]
  );
  const isShouldExclude = useMemo(() => {
    if (typeof shouldExclude === "function") {
      return shouldExclude(initialValue, original);
    }
    return false;
  }, [initialValue, original]);
  const handleClick = (e) => {
    //updateGridData(index, id, true, true, "");
    if (typeof onButtonActionHandel === "function") {
      onButtonActionHandel(index, id);
    }
  };
  const isShouldChangeColumnName = useMemo(() => {
    if (typeof isColumnName === "function") {
      return isColumnName(initialValue);
    }
    return null;
  }, [initialValue]);

  const newColumnName = Boolean(isShouldChangeColumnName)
    ? isShouldChangeColumnName
    : columnName;

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
          {Boolean(buttonLabel) ? buttonLabel : newColumnName}
        </Button>
      ) : null}
    </CellWrapper>
  );
};
