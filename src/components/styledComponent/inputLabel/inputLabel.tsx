import InputLabel from "@material-ui/core/InputLabel";

import { withStyles } from "@material-ui/core/styles";

const MyInputLabel = withStyles({
  root: {
    //color: "#736f6f",
    fontWeight: 600,
    textTransform: "capitalize",
    fontSize: "1rem",
    "@media (max-width: 1200px)": {
      fontSize: "0.75rem",
    },
    "@media (max-width: 1440px)": {
      fontSize: "0.875rem",
    },
  },
  shrink: {
    transform: "translate(0, 1.5px) scale(1)",
  },
})(InputLabel);

export default MyInputLabel;
