import styles from "./styles";

// import DateTimePicker from "@mui/lab/DateTimePicker";
// import { DateTimePicker } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { withStyles } from "@mui/styles";
const StyledKeyboardDateTimePicker = withStyles(styles)(DateTimePicker);

export default StyledKeyboardDateTimePicker;
