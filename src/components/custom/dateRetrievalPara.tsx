import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  ThemeProvider,
  unstable_createMuiStrictModeTheme,
} from "@material-ui/core";
import { GradientButton } from "components/styledComponent/button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Fragment, useState, useRef } from "react";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { theme2 } from "app/audit/theme";
import { greaterThanInclusiveDate } from "registry/rulesEngine";
import { format } from "date-fns/esm";
import { isValidDate } from "components/utils/utilFunctions/function";
const themeObj = unstable_createMuiStrictModeTheme(theme2);
export const DateRetrievalDialog = ({
  classes,
  open,
  handleClose,
  loginState,
  retrievalParaValues,
}) => {
  const inputButtonRef = useRef<any>(null);
  const [selectedFromDate, setFromDate] = useState(
    new Date(format(new Date(), "yyyy/MM/dd"))
  );
  const [selectedToDate, setToDate] = useState(
    new Date(format(new Date(), "yyyy/MM/dd"))
  );
  const [error, SetError] = useState({ isError: false, error: "" });
  const onFromDateChange = (date) => {
    if (isValidDate(date)) {
      date = new Date(format(date, "yyyy/MM/dd"));
      setFromDate(date);
      if (!greaterThanInclusiveDate(selectedToDate, date)) {
        SetError({
          isError: true,
          error: "To date should be greater than From date.",
        });
      } else {
        SetError({
          isError: false,
          error: "",
        });
      }
    }
  };
  const onToDateChange = (date) => {
    if (isValidDate(date)) {
      date = new Date(format(date, "yyyy/MM/dd"));
      setToDate(date);
      if (!greaterThanInclusiveDate(date, selectedFromDate)) {
        SetError({
          isError: true,
          error: "To date should be greater than From date.",
        });
      } else {
        SetError({
          isError: false,
          error: "",
        });
      }
    }
  };

  return (
    <Fragment>
      <Dialog open={open} maxWidth="xs">
        <DialogTitle>Enter Retrieval Parameters</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>Please Verify OTP</DialogContentText> */}
          <div
            className={classes.divflex}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                inputButtonRef?.current?.click?.();
              }
            }}
          >
            <ThemeProvider theme={themeObj}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  placeholder="From Date"
                  format="dd/MM/yyyy"
                  KeyboardButtonProps={{
                    "aria-label": "Select Date",
                  }}
                  label="From Date"
                  onChange={onFromDateChange}
                  value={selectedFromDate}
                  style={{ width: "40%", marginRight: "35px" }}
                  InputLabelProps={{ shrink: true }}
                  color="primary"
                  autoComplete="off"
                  autoOk={true}
                  showTodayButton={true}
                  disableFuture
                />

                <KeyboardDatePicker
                  placeholder="To Date"
                  format="dd/MM/yyyy"
                  KeyboardButtonProps={{
                    "aria-label": "Select Date",
                  }}
                  label="To Date"
                  onChange={onToDateChange}
                  value={selectedToDate}
                  style={{ width: "40%", marginLeft: "35px" }}
                  InputLabelProps={{ shrink: true }}
                  color="primary"
                  autoComplete="off"
                  autoOk={true}
                  showTodayButton={true}
                  error={error.isError}
                  helperText={error.error}
                />
              </MuiPickersUtilsProvider>
            </ThemeProvider>
          </div>
        </DialogContent>
        <Grid item container justifyContent="center" alignItems="center">
          <DialogActions className={classes.verifybutton}>
            <GradientButton
              disabled={loginState.loading}
              endIcon={
                loginState.loading ? <CircularProgress size={20} /> : null
              }
              onClick={() => {
                if (
                  !greaterThanInclusiveDate(selectedToDate, selectedFromDate)
                ) {
                  SetError({
                    isError: true,
                    error: "To date should be greater than From date.",
                  });
                } else {
                  let retrievalValues = [
                    {
                      id: "FROM_DT",
                      value: {
                        condition: "equal",
                        value: format(
                          new Date(
                            selectedFromDate.toISOString() ?? new Date()
                          ),
                          "dd/MM/yyyy"
                        ),
                        columnName: "From Date",
                      },
                    },
                    {
                      id: "TO_DT",
                      value: {
                        condition: "equal",
                        value: format(
                          new Date(selectedToDate.toISOString() ?? new Date()),
                          "dd/MM/yyyy"
                        ),
                        columnName: "To Date",
                      },
                    },
                  ];
                  retrievalParaValues(retrievalValues);
                }
              }}
              ref={inputButtonRef}
              style={{ marginTop: "15px" }}
            >
              Ok
            </GradientButton>
            <GradientButton
              disabled={loginState.loading}
              onClick={handleClose}
              style={{ marginTop: "15px" }}
            >
              Cancel
            </GradientButton>
          </DialogActions>
        </Grid>
      </Dialog>
    </Fragment>
  );
};
