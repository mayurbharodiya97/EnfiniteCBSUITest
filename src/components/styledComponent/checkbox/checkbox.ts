import { Checkbox } from "@mui/material";
import { withStyles } from "@mui/styles";

const StyledCheckbox = withStyles({
  root: {
    color: "#0063A3",
    alignSelf: "flex-start",
    padding: "0 9px",
    "&$checked": {
      color: "var(--theme-color1)", // "#26A456",
    },
  },
  checked: {},
})(Checkbox);

export default StyledCheckbox;
