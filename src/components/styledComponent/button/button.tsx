import { Box, Button, CircularProgress, IconButton } from "@mui/material";
import { withStyles } from "@mui/styles";
import * as Icons from "@mui/icons-material";
import { FormContext } from "packages/form";
import { forwardRef, useContext } from "react";

const GradientButtonCustom = withStyles({
  root: {
    background: "var(--theme-color3)",
    border: 0,
    //Comment By Bhavyata to Change color on OTP verify screen.
    // color: "#fff",
    fontWeight: 700,
    minWidth: "90px",
    width: "fit-content",
    letterSpacing: "0.02857em",
    textTransform: "capitalize",
    margin: "3px",
    // marginLeft: "7px",
    // boxShadow:
    //   "rgba(45, 35, 66, .4) 0 2px 4px, rgba(45, 35, 66, .3) 0 7px 13px -3px, rgba(58, 65, 111, .5) 0 -3px 0 inset",
    "&:focus": {
      backgroundColor: "var(--theme-color3) !important",
      boxShadow:
        "var(--theme-color3) 0 0 0 1.5px inset, rgba(45, 35, 66, .4) 0 2px 4px, rgba(45, 35, 66, .3) 0 7px 13px -3px, var(--theme-color3) 0 -3px 0 inset",
    },
    "&:hover": {
      backgroundColor: "var(--theme-color3) ",
      boxShadow:
        "rgba(45, 35, 66, .4) 0 4px 8px, rgba(45, 35, 66, .3) 0 7px 13px -3px, var(--theme-color3) 0 -3px 0 inset",
    },
    "&:active": {
      backgroundColor: "var(--theme-color3) !important",
      boxShadow: "var(--theme-color3) 0 3px 7px inset",
      transform: "translateY(2px)",
    },
  },
})(Button);

const GradientButton = forwardRef<any, any>(({ ...props }, ref) => {
  const { starticon, endicon, rotateIcon, tabIndex, color, ...other } = props;
  const FormContextData = useContext(FormContext);
  let FormButtonCicular =
    FormContextData?.onFormButtonCicular?.onFormButtonCicular;

  let StartIcon = Icons[starticon] || null;
  let EndIcon = Icons[endicon] || null;

  return (
    <GradientButtonCustom
      sx={{
        color: color ? color : "#fff !important",
        "&:hover": {
          // background: "#4462bbbd",
          backgroundColor: "var(--theme-color3) ",
          boxShadow: "none",
          "& .MuiSvgIcon-root": {
            transform: rotateIcon,
            transition: "transform 2s ease-in-out",
          },
        },
      }}
      tabindex={tabIndex}
      startIcon={StartIcon ? <StartIcon /> : null}
      endIcon={
        FormButtonCicular ? (
          <CircularProgress size={20} />
        ) : EndIcon ? (
          <EndIcon />
        ) : null
      }
      ref={ref}
      {...other}
    />
  );
});
export default GradientButton;
