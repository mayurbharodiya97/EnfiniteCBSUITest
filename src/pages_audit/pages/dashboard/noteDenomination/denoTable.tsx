import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow /*TextField*/,
  Slide,
  CircularProgress,
  Tooltip,
  Dialog,
  LinearProgress,
  // TextField,
} from "@mui/material";
import { Typography } from "@mui/material";
import * as API from "./api";
import { useMutation } from "react-query";
import { GradientButton } from "components/styledComponent/button";
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  PopupMessageAPIWrapper,
  PopupRequestWrapper,
} from "components/custom/popupMessage";
import { AuthContext } from "pages_audit/auth";
import { useStyles, StyledTableCell } from "./style";
import { TextField } from "components/styledComponent";
import { CustomPropertiesConfigurationContext } from "components/propertiesconfiguration/customPropertiesConfig";
import getCurrencySymbol from "components/custom/getCurrencySymbol";
import {
  FilterFormMetaType,
  FormComponentView,
} from "components/formcomponent";
import {
  DenominationScreenMetaData,
  denoViewTrnGridMetaData,
} from "./metadata";
import { UpdateRequestDataVisibleColumn } from "components/utils";
import { formatCurrency } from "components/tableCellComponents/currencyRowCellRenderer";
import { Button } from "reactstrap";
import { getAcctInqStatement } from "pages_audit/acct_Inquiry/api";
import AccDetails from "pages_audit/pages/operations/DailyTransaction/AccountDetails/AccDetails";
import { Alert } from "components/common/alert";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";

const DenoTable = ({
  displayTable,
  data,
  isDisableField,
  inputVal,
  handleChange,
  handleKeyPress,
  updateTotalAmount,
  displayError,
  multiplicationResult,
  availNote,
  balance,
  totalInputAmount,
  totalAmount,
  displayTotal,
  upadatedFinalAmount,
}) => {
  const classes = useStyles();
  const customParameter = useContext(CustomPropertiesConfigurationContext);
  const { dynamicAmountSymbol, currencyFormat, decimalCount } = customParameter;

  return (
    <>
      {displayTable && data && isDisableField ? (
        <Slide direction="left" in={displayTable} mountOnEnter unmountOnExit>
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
                  {data?.map((row, index) => {
                    return (
                      <TableRow key={index}>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          className="cellBordered"
                        >
                          {formatCurrency(
                            parseFloat(row.NOTE),
                            getCurrencySymbol(dynamicAmountSymbol),
                            currencyFormat,
                            decimalCount
                          )}
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
                            value={inputVal[index] || ""}
                            onChange={(event) =>
                              handleChange(event.target.value, index)
                            }
                            onKeyDown={(event) => {
                              handleKeyPress(event, index);
                            }}
                            onBlur={(event) => updateTotalAmount(event, index)}
                            helperText={displayError[index] || ""}
                            type={"text"}
                            InputProps={{
                              style: { textAlign: "left" },
                            }}
                            tabIndex={index + 2}
                            sx={{ width: "-webkit-fill-available" }}
                            autoFocus={
                              displayTable && data && index === 0 ? true : false
                            }
                          />
                        </StyledTableCell>
                        <StyledTableCell align="right" className="cellBordered">
                          {" "}
                          {formatCurrency(
                            parseFloat(multiplicationResult[index] || "0"),
                            getCurrencySymbol(dynamicAmountSymbol),
                            currencyFormat,
                            decimalCount
                          )}
                        </StyledTableCell>
                        <StyledTableCell
                          align="right"
                          // className="cellBordered"
                        >
                          {availNote && availNote[index] !== undefined
                            ? availNote[index]
                            : availNote}
                        </StyledTableCell>
                        <StyledTableCell align="right" className="cellBordered">
                          {formatCurrency(
                            parseFloat(
                              balance && balance[index] !== undefined
                                ? balance[index]
                                : balance
                            ),
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
                      {totalInputAmount}
                    </StyledTableCell>
                    <StyledTableCell
                      align="right"
                      className="cellBordered"
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    >
                      {formatCurrency(
                        parseFloat(totalAmount),
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
                      {displayTotal?.AVAIL_NOTE}
                    </StyledTableCell>
                    <StyledTableCell
                      align="right"
                      className="cellBordered"
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    >
                      {formatCurrency(
                        parseFloat(displayTotal?.TOTAL_AMNT),
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
                  {" "}
                  {upadatedFinalAmount >= 0 ? "Remaining " : "Excess "} {": "}
                </Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  {formatCurrency(
                    parseFloat(
                      !isNaN(upadatedFinalAmount) ? upadatedFinalAmount : 0
                    ),
                    getCurrencySymbol(dynamicAmountSymbol),
                    currencyFormat,
                    decimalCount
                  )}
                </Typography>
              </Typography>
            </Paper>{" "}
          </Box>
        </Slide>
      ) : null}
    </>
  );
};

export default DenoTable;
