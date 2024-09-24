import { Backdrop } from "@mui/material";
import { withStyles } from "@mui/styles";

export const CustomBackdrop = withStyles(() => ({
  root: {
    position: "absolute",
    zIndex: 9,
    backgroundColor: "rgb(0 0 0 / 0%)",
  },
}))(Backdrop);
