import styles from "./styles";

// import DateTimePicker from "@mui/lab/DateTimePicker";
// import { DateTimePicker } from "@mui/x-date-pickers";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
// import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { withStyles } from "@mui/styles";
const StyledKeyboardDateTimePicker = withStyles(styles)(DateTimePicker);

export default StyledKeyboardDateTimePicker;
