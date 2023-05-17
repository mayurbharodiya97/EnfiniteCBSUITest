import { TableRow } from "@mui/material";
import { withStyles } from "@mui/styles";

export const MyTableRow = withStyles((theme) => {
  return {
    root: {
      margin: "10px 0px",
      borderRadius: "10px",
      border: "1px solid var(--theme-color4)",
      "&:focus": {
        outline: "none !important",
        // border: "1.42444px solid var(--theme-color3)",
        // boxShadow: "0px 5.69775px 11.3955px rgba(66, 99, 199, 0.16)",
      },
      "&$selected:focus": {
        outline: "none !important",
        background: theme.palette.action.focus,
      },
      "&$hover:hover": {
        outline: "none !important",
      },
      "&$selected, &$selected:hover": {
        outline: "none !important",
      },
      "&:hover": {
        outline: "none !important",
      },
      // "&:active": {
      //   outline: "none !important",
      //   border: "1.42444px solid var(--theme-color3)",
      //   boxShadow: "0px 5.69775px 11.3955px rgba(66, 99, 199, 0.16)",
      // },
      // "&$disabled": {
      //   pointerEvents: "none", // Disable mouse events on the row
      //   opacity: 0.5, // Optionally reduce the opacity of the disabled row
      //   background: "red",
      // },
    },
    selected: {
      background: theme.palette.action.selected,
      border: "1.42444px solid var(--theme-color3)",
      boxShadow: "0px 5.69775px 11.3955px rgba(66, 99, 199, 0.16)",
    },
  };
})(TableRow);
