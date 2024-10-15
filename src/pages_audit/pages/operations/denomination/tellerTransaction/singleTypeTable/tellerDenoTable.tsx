import React, { useContext, useEffect, useRef, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  // TextField,
} from "@mui/material";
import { useStyles, StyledTableCell } from "../style";

import { AccDetailContext } from "pages_audit/auth";
import {
  GradientButton,
  formatCurrency,
  TextField,
  usePropertiesConfigContext,
  getCurrencySymbol,
} from "@acuteinfo/common-base";
const TellerDenoTable = ({
  displayTable,
  data,
  handleChange,
  displayError,
  inputValue,
  amount,
  availNotes,
  balance,
  handleonBlur,
  noteCntTotal,
  amountTotal,
  availNoteTotal,
  balanceTotal,
  remainExcessBal,
  finalLable,
  onCloseTable,
  textFieldRef,
  // openAcctDtl,
  // handleonFocus,
  gridLable,
}) => {
  const fieldRef = useRef<any>([]);
  const classes = useStyles();
  const inputRefs = useRef<any>({});
  const [refsReady, setRefsReady] = useState(false);
  const customParameter = usePropertiesConfigContext();
  const { dynamicAmountSymbol, currencyFormat, decimalCount } = customParameter;

  // useEffect(() => {
  //   inputValue = {};
  //   amount = {};
  // }, []);

  const handleonFocus = (event, index) => {
    const input = event.target;
    if (input.value) {
      input.select();
    }
  };
  // console.log(displayTable, data, "weuweuwueywe");

  // useEffect(() => {
  //   console.log("ref<<222", fieldRef.current);
  //   if (fieldRef.current && displayTable && data?.length > 0) {
  //     console.log("ref<<", fieldRef.current["0"]?.firstChild?.firstChild);
  //     console.log("Its 2 seconds over s");
  //     fieldRef.current["0"]?.firstChild?.firstChild?.focus();
  //   }
  // }, [displayTable, data]);

  useEffect(() => {
    // console.log(inputRefs.current, "inputRefs.current5645454545");
    if (Object.keys(inputRefs.current).length > 0) {
      setRefsReady(true);
    }
  }, [data]); // Assuming 'data' influences the number of TextFields

  useEffect(() => {
    if (refsReady) {
      inputRefs?.current["0"].focus();
    }
  }, [refsReady, displayTable, data]);

  return (
    // <Slide direction="left" in={displayTable} mountOnEnterx unmountOnExit>
    <Dialog open={displayTable && data?.length > 0} maxWidth={"xl"}>
      <AppBar
        position="static"
        sx={{
          maxHeight: "2rem",
          background: "var(--theme-color5)",
          margin: "10px",
          width: "auto",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            style={{ flexGrow: 1 }}
            sx={{
              fontWeight: 700,
              color: "var(--theme-color2)",
              fontSize: "1rem",
            }}
          >
            {gridLable}
          </Typography>
          <GradientButton
            onClick={() => onCloseTable(false, "TABLE1")}
            color="primary"
            disabled={false}
          >
            Close
          </GradientButton>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ padding: "0px" }}>
        <Paper
          sx={{
            boxShadow: "none",
            borderRadius: "0px",
            margin: "0 10px",
            paddingBottom: "6px",
          }}
        >
          <Box
            borderRadius={"none"}
            boxShadow={"rgba(226, 236, 249, 0.5) 0px 11px 70px"}
            overflow={"hidden"}
            style={{ transform: "scale(90deg)" }}
          >
            <TableContainer
              sx={{
                width: "auto",
                overflow: "auto",
                maxHeight: "calc(100vh - 200px)",
              }}
              component={Paper}
            >
              <Table
                sx={{ minWidth: 650, borderCollapse: "unset !important" }}
                aria-label="simple table"
                className={classes.tableBordered}
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left" className="cellBordered">
                      Denomination{" "}
                      <Box
                        className="flipHorizontal"
                        style={{
                          animation: "flipHorizontal 2s infinite",
                          display: "inline-block",
                          transformOrigin: "center",
                          marginLeft: "10px",
                        }}
                      >
                        {
                          <Typography
                            style={{
                              border: "0.2px solid",
                              borderRadius: "50%",
                              height: "22px",
                              width: "22px",
                              textAlign: "center",
                            }}
                          >
                            {getCurrencySymbol(dynamicAmountSymbol)}
                          </Typography>
                        }
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell className="cellBordered" align="right">
                      Note count
                    </StyledTableCell>
                    <StyledTableCell className="cellBordered" align="right">
                      Amount
                    </StyledTableCell>
                    <StyledTableCell className="cellBordered" align="right">
                      Available Note(s)
                    </StyledTableCell>
                    <StyledTableCell align="right" className="cellBordered">
                      Balance
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((row: any, index: any) => {
                    return (
                      <TableRow key={index}>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          className="cellBordered"
                        >
                          {row.DENO_LABLE}
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          sx={{
                            borderRight: "1px solid var(--theme-color6)",
                            borderLeft: "1px solid var(--theme-color6)",
                            maxWidth: "167px",
                          }}
                          tabIndex={index + 2}
                          className="cellBordered"
                        >
                          <TextField
                            classes={{ root: classes.leftTextAlign }}
                            placeholder={"Enter value"}
                            value={inputValue[index] || ""}
                            onChange={(event) => handleChange(event, index)}
                            // onKeyDown={(event) => {
                            //   handleKeyPress(event, index);
                            // }}
                            onFocus={(event) => handleonFocus(event, index)}
                            // inputRef={textFieldRef}
                            onBlur={(event) => handleonBlur(event, index)}
                            helperText={displayError[index] || ""}
                            error={Boolean(displayError[index])}
                            type={"text"}
                            InputProps={{
                              style: { textAlign: "left" },
                            }}
                            tabIndex={index + 2}
                            sx={{ width: "-webkit-fill-available" }}
                            // autoFocus={displayTable && data && index === 0}
                            // ref={(input) => {
                            //   fieldRef.current[index] = input;
                            // }}
                            // ref={(input) => {
                            //   console.log(input, "inputssssssss");
                            //   fieldRef.current = {
                            //     ...fieldRef.current,
                            //     [index]: input,
                            //   };
                            // }}
                            // onFocus={() => handleonFocus(index)}
                            inputRef={(input) => {
                              if (input) {
                                inputRefs.current[index] = input;
                                if (index === data.length - 1) {
                                  // Check if the last input is set
                                  setRefsReady(true);
                                }
                              }
                            }}
                          />
                        </StyledTableCell>
                        <StyledTableCell align="right" className="cellBordered">
                          {" "}
                          {formatCurrency(
                            parseFloat(amount[index] || "0"),
                            getCurrencySymbol(dynamicAmountSymbol),
                            currencyFormat,
                            decimalCount
                          )}
                        </StyledTableCell>
                        <StyledTableCell
                          align="right"
                          // className="cellBordered"
                        >
                          {row?.AVAIL_QTY}
                        </StyledTableCell>
                        <StyledTableCell align="right" className="cellBordered">
                          {formatCurrency(
                            parseFloat(row?.AVAIL_VAL),
                            getCurrencySymbol(dynamicAmountSymbol),
                            currencyFormat,
                            decimalCount
                          )}
                        </StyledTableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableBody>
                  <TableRow
                    sx={{
                      height: "32px",
                      position: "sticky",
                      bottom: 0,
                      background: "var(--theme-color4)",
                    }}
                  >
                    <StyledTableCell
                      component="th"
                      scope="row"
                      className="cellBordered"
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    >
                      {"Total :"}
                    </StyledTableCell>

                    <StyledTableCell
                      align="right"
                      sx={{
                        maxWidth: "167px",
                        padding: "4px 17px !important",
                        fontWeight: "bold",
                        fontSize: "1rem",
                      }}
                      className="cellBordered"
                    >
                      {noteCntTotal}
                    </StyledTableCell>
                    <StyledTableCell
                      align="right"
                      className="cellBordered"
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    >
                      {formatCurrency(
                        parseFloat(amountTotal),
                        getCurrencySymbol(dynamicAmountSymbol),
                        currencyFormat,
                        decimalCount
                      )}
                    </StyledTableCell>
                    <StyledTableCell
                      align="right"
                      className="cellBordered"
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    >
                      {availNoteTotal}
                    </StyledTableCell>
                    <StyledTableCell
                      align="right"
                      className="cellBordered"
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    >
                      {formatCurrency(
                        parseFloat(balanceTotal),
                        getCurrencySymbol(dynamicAmountSymbol),
                        currencyFormat,
                        decimalCount
                      )}
                    </StyledTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Paper
              sx={{
                height: "auto",
                width: "auto",
                padding: "2px 8px",
                borderBottom: "1px solid var(--theme-color6)",
                borderLeft: "1px solid var(--theme-color6)",
                borderRight: "1px solid var(--theme-color6)",
                borderBottomLeftRadius: "none",
                borderBottomRightRadius: "none",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                position: "sticky",
                bottom: 0,
                background: "var(--theme-color4)",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  padding: "10px 0px",
                  display: "flex",
                  background: "var(--theme-color4)",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {`${finalLable} :`}
                </Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  {/* {remainExcessBal} */}
                  {formatCurrency(
                    parseFloat(remainExcessBal),
                    getCurrencySymbol(dynamicAmountSymbol),
                    currencyFormat,
                    decimalCount
                  )}
                </Typography>
              </Typography>
            </Paper>{" "}
          </Box>
        </Paper>
      </DialogContent>
    </Dialog>
    // </Slide>
  );
};

export default TellerDenoTable;
