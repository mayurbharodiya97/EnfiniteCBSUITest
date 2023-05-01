import { Tab } from "@mui/material";
import { withStyles } from "@mui/styles";

const StyledTab = withStyles((theme: any) => ({
  root: {
    textTransform: "none",
    minWidth: 72,
    marginRight: theme.spacing(4),
    opacity: 1,
    color: theme.palette.secondary.main,
    fontWeight: 600,
    fontFamily: [
      "Montserrat",
      "Helvetica",
      "Arial",
      "Lucida",
      "sans-serif",
    ].join(","),
    "&:hover": {
      color: "#0063a3",
      opacity: 1,
    },
    "&$selected": {
      color: "#fff",
      fontWeight: "600",
      // background:
      //   "linear-gradient(-90deg, rgba(94,231,131,1) 0%, rgba(74,205,159,1) 35%, rgba(33,150,218,1) 100%)",
      background: theme.palette.secondary.main,
    },
    "&:focus": {
      color: "#fff",
    },
  },
  selected: {},
}))(Tab);

export default StyledTab;
