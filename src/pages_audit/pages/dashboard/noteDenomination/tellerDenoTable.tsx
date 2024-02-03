import React, { useContext, useRef } from "react";
import {
  Box,
  Paper,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useStyles, StyledTableCell } from "./style";
import { TextField } from "components/styledComponent";
import getCurrencySymbol from "components/custom/getCurrencySymbol";
import { CustomPropertiesConfigurationContext } from "components/propertiesconfiguration/customPropertiesConfig";
import { formatCurrency } from "components/tableCellComponents/currencyRowCellRenderer";

const TellerDenoTable = ({
  displayTable,
  data,
  handleChange,
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
}) => {
  const fieldRef: any = useRef([]);
  const classes = useStyles();
  const customParameter = useContext(CustomPropertiesConfigurationContext);
  const { dynamicAmountSymbol, currencyFormat, decimalCount } = customParameter;

  return (
    <Slide direction="left" in={displayTable} mountOnEnter unmountOnExit>
      <Paper
        sx={{
          padding: "7px 2px",
          boxShadow: "none",
          borderRadius: "0px",
          margin: "0 10px",
        }}
      >
        <Box
          borderRadius={"10px"}
          boxShadow={"rgba(226, 236, 249, 0.5) 0px 11px 70px"}
          overflow={"hidden"}
          style={{ transform: "scale(90deg)" }}
        >
          <TableContainer
            sx={{
              width: "auto",
            }}
            component={Paper}
          >
            <Table
              sx={{ minWidth: 650 }}
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
                  <StyledTableCell className="cellBordered" align="left">
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
                          backgroundColor: "var(--theme-color4)",
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
                          onBlur={(event) => handleonBlur(event, index)}
                          // helperText={"HELLO MY FRIENDS"}
                          type={"text"}
                          InputProps={{
                            style: { textAlign: "left" },
                          }}
                          tabIndex={index + 2}
                          sx={{ width: "-webkit-fill-available" }}
                          autoFocus={displayTable && data && index === 0}
                          // ref={(input) => {
                          //   fieldRef.current[index] = input;
                          // }}
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
                <TableRow sx={{ height: "43px" }}>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    className="cellBordered"
                    sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  >
                    {"Total :"}
                  </StyledTableCell>

                  <StyledTableCell
                    align="left"
                    sx={{
                      backgroundColor: "var(--theme-color4)",
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
              borderBottom: "2px solid var(--theme-color6)",
              borderLeft: "2px solid var(--theme-color6)",
              borderRight: "2px solid var(--theme-color6)",
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                backgroundColor: "var(--theme-color2)",
                padding: "10px 0px",
                display: "flex",
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
    </Slide>
  );
};

export default TellerDenoTable;
