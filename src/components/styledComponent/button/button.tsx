import { Button } from "@mui/material";
import { withStyles } from "@mui/styles";

const GradientButton = withStyles({
  root: {
    background: "var(--theme-color3)",
    border: 0,
    //Comment By Bhavyata to Change color on OTP verify screen.
    // color: "#fff !important",
    color: "#fff",
    fontWeight: 700,
    minWidth: "80px",
    letterSpacing: "0.02857em",
    boxShadow: "none",
    textTransform: "capitalize",
    "&:hover": {
      background: "#4462bbbd",
      boxShadow: "none",
    },
    "&:active": {
      background: "#4462bbbd",
      boxShadow: "none",
    },
    "&:focus": {
      background: "#4462bbbd",
      boxShadow: "none",
    },
  },
})(Button);

export default GradientButton;
