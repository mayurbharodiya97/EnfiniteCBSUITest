import { Box, Button, CircularProgress, IconButton } from "@mui/material";
import { withStyles } from "@mui/styles";
import * as Icons from "@mui/icons-material";
import { FormContext } from "packages/form";
import { useContext } from "react";

const GradientButtonCustom = withStyles({
  root: {
    background: "var(--theme-color3)",
    border: 0,
    //Comment By Bhavyata to Change color on OTP verify screen.
    // color: "#fff !important",
    color: "#fff",
    fontWeight: 700,
    minWidth: "90px",
    letterSpacing: "0.02857em",
    boxShadow: "none",
    textTransform: "capitalize",

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

function GradientButton(props) {
  const { starticon, endicon, rotateIcon, ...other } = props;
  const FormContextData = useContext(FormContext);
  let FormButtonCicular =
    FormContextData?.onFormButtonCicular?.onFormButtonCicular;

  let StartIcon = Icons[starticon] || null;
  let EndIcon = Icons[endicon] || null;

  const Rotate =
    rotateIcon === "rotateR"
      ? "scale(1.4) rotate(360deg)"
      : rotateIcon === "rotateL"
      ? "scale(1.4) rotate(-360deg)"
      : rotateIcon === "rotateX"
      ? "scale(1.4) rotateX(-360deg)"
      : rotateIcon === "rotateY"
      ? "scale(1.4) rotateY(360deg)"
      : rotateIcon === "zoom"
      ? "scale(1.5)"
      : null;

  // console.log("<<<w", trans, rotate, other);
  return (
    <GradientButtonCustom
      sx={{
        "&:hover": {
          background: "#4462bbbd",
          boxShadow: "none",
          "& .MuiSvgIcon-root": {
            transform: Rotate,
            transition: "transform 2s ease-in-out",
          },
        },
      }}
      startIcon={StartIcon ? <StartIcon /> : null}
      endIcon={
        FormButtonCicular ? (
          <CircularProgress size={20} />
        ) : EndIcon ? (
          <EndIcon />
        ) : null
      }
      {...other}
    />
  );
}
export default GradientButton;

export function CustomIconButton(props) {
  const { renderIcon, rotateIcon, imageSrc, ...other } = props;
  let RenderIcon = Icons[renderIcon] || null;

  return (
    <IconButton {...other}>
      {RenderIcon ? (
        <RenderIcon />
      ) : imageSrc ? (
        <img src={imageSrc} alt="no image found" />
      ) : null}
    </IconButton>
  );
}
