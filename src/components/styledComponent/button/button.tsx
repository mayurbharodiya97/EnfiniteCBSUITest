import Button from "@material-ui/core/Button";

import { withStyles } from "@material-ui/core/styles";

const GradientButton = withStyles({
  root: {
    background: "var(--theme-color1)",
    border: 0,
    color: "#fff !important",
    fontWeight: 700,
    minWidth: "80px",
    letterSpacing: "0.02857em",
    boxShadow: "none",
    textTransform: "capitalize",
    "&:hover": {
      background: "rgb(200,0,0)",
      boxShadow: "none",
    },
    "&:active": {
      background: "rgb(200,0,0)",
      boxShadow: "none",
    },
    "&:focus": {
      background: "rgb(200,0,0)",
      boxShadow: "none",
    },
  },
})(Button);

export default GradientButton;
