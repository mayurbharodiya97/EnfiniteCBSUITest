import { TableHead } from "@mui/material";
import { withStyles } from "@mui/styles";

export const StickyTableHead = withStyles(() => ({
  root: {
    position: "sticky",
    zIndex: 10,
    top: 0,
    backgroundColor: "var( --theme-color4)",
    display: "block",
    borderRadius: "10px",
    margin: "0px 0px 10px 0px",
  },
}))(TableHead);
