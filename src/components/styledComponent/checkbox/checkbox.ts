import { Checkbox } from "@mui/material";
import { withStyles } from "@mui/styles";

const StyledCheckbox = withStyles({
  root: {
    color: "var(--theme-color1)",
    alignSelf: "center",
    padding: "0 9px",
    "&$checked": {
      color: "var(--theme-color1)", // "#26A456",
    },
  },
  checked: {},
})(Checkbox);

export default StyledCheckbox;
