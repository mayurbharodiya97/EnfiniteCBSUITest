import { Button } from "@mui/material";
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
      <Button
        sx={{
          background: "var(--theme-color3)",
          "&:hover": {
            background: "var(--theme-color3)",
            boxShadow:
              "rgba(45, 35, 66, .4) 0 4px 8px, rgba(45, 35, 66, .3) 0 7px 13px -3px, #3c4fe0 0 -3px 0 inset",
          },
        }}
        onClick={handleClick}
        fullWidth
      >
        Delete
      </Button>
    </CellWrapper>
  );
};
