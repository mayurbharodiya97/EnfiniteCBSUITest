import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";

const StyledTooltip = withStyles({
  tooltip: {
    backgroundColor: "rgb(128,0,0)",
    color: "#fff",
    boxShadow: "0 3px 6px rgba(0,0,0,0.46)",
    fontSize: 11,
    borderBottom: "1px solid rgb(140,0,0)",
  },
  arrow: {
    fontSize: 16,
    width: 17,
    "&::before": {
      border: "1px solid #fff",
      backgroundColor: "rgb(128,0,0)",
      boxSizing: "border-box",
    },
  },
})(Tooltip);

export default StyledTooltip;
