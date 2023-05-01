import Input from "@material-ui/core/Input";

import { withStyles } from "@material-ui/core/styles";

const MyInput = withStyles({
  root: {
    border: "1px solid #BABABA",
    marginTop: "26px",
    borderRadius: 5,
    backgroundColor: "#fff",
    "@media (max-width: 1200px)": {
      fontSize: "0.875rem",
    },
  },
  multiline: {
    padding: "6px 7px",
  },
  input: {
    padding: "6px 7px ",
    height: "22px",
    //color: "#000",
    "&::placeholder": {
      //color: "#000",
      //fontSize: "0.875rem",
    },
    "@media (max-width: 1200px)": {
      height: "18px",
    },
  },
  underline: {
    "&:before": {
      borderBottom: "0",
    },
    "&:after": {
      borderBottom: "3px solid #3f51b5",
      transition: "transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
    },
    "&:hover": {
      borderBottom: "0",
    },
  },
  adornedStart: {
    borderRight: "1px solid #BABABA",
    height: "36px",
    maxHeight: "36px",
    padding: "0 1rem",
  },
})(Input);

export default MyInput;
