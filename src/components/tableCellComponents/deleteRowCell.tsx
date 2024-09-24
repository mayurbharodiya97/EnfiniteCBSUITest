import { Button } from "@mui/material";
import { CellWrapper } from "./cellWrapper";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

export const DeleteRowButton = (props) => {
  const { t } = useTranslation();
  const {
    value: initialValue,
    rows,
    row: { index, original },
    column: { id, shouldExclude, buttonLabel },
    updateGridData,
    hiddenFlag,
  } = props;

  const prevRows = rows
    .slice(0, index)
    .map((one) => one?.original)
    .filter((one) => Boolean(one[hiddenFlag]) !== true);

  const nextRows = rows
    .slice(index + 1)
    .map((one) => one?.original)
    .filter((one) => Boolean(one[hiddenFlag]) !== true);
  const isShouldExclude = useMemo(() => {
    if (typeof shouldExclude === "function") {
      return shouldExclude(initialValue, original, prevRows, nextRows);
    }
    return false;
  }, [initialValue, prevRows, nextRows, original]);
  const handleClick = (e) => {
    updateGridData(index, id, true, true, "");
  };
  if (isShouldExclude) {
    return null;
  }
  return (
    <CellWrapper showBorder {...props}>
      <Button
        // chnage by parag
        // sx={{
        //   background: "var(--theme-color3)",
        //   "&:hover": {
        //     background: "var(--theme-color3)",
        //     boxShadow:
        //       "rgba(45, 35, 66, .4) 0 4px 8px, rgba(45, 35, 66, .3) 0 7px 13px -3px, #3c4fe0 0 -3px 0 inset",
        //   },
        // }}
        variant={"contained"}
        color="secondary"
        //------end
        onClick={handleClick}
        fullWidth
      >
        {Boolean(buttonLabel) ? t(buttonLabel) : t("Delete")}
      </Button>
    </CellWrapper>
  );
};
