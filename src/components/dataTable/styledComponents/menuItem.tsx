import { MenuItem } from "@mui/material";
import { withStyles } from "@mui/styles";
export const StyledMenuItem = withStyles((theme: any) => ({
  root: {
    "& .MuiCheckbox-root": {
      padding: "2px 6px",
    },
    "& label": {
      marginBottom: 0,
    },
  },
}))(MenuItem);
