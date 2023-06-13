import styles from "./styles";

//import DatePicker from "@mui/lab/DatePicker";
//import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import { withStyles } from "@mui/styles";

const StyledKeyboardDatePicker: any = withStyles(styles)(DesktopDatePicker);

export default StyledKeyboardDatePicker;
