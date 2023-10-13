import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow /*TextField*/,
  TableSortLabel,
} from "@mui/material";
import { Dialog, Typography } from "@mui/material";
import * as API from "./api";
import { useQuery } from "react-query";
import { GradientButton } from "components/styledComponent/button";
import { useContext, useEffect, useRef, useState } from "react";
import { PopupRequestWrapper } from "components/custom/popupMessage";
import { AuthContext } from "pages_audit/auth";
import { useStyles, StyledTableCell } from "./style";
import { TextField } from "components/styledComponent";
import { CustomPropertiesConfigurationContext } from "components/propertiesconfiguration/customPropertiesConfig";
import getCurrencySymbol from "components/custom/getCurrencySymbol";
import { FormatCurrency } from "components/custom/currencySymbol";

const CashReceiptEntry = ({ open, handleCloseDialog, props, trx }) => {
  const [inputVal, setInputVal] = useState<any>({});
  const [displayError, setDisplayError] = useState<string[]>([]);
  const [multiplicationResult, setMultiplicationResult] = useState<any>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [confirmation, setConfirmation] = useState(false);
  const [forRemark, setForRemark] = useState();
  const [displayTotal, setDisplayTotal] = useState<any>([]);
  const [totalInputAmount, setTotalInputAmount] = useState<number>(0);
  const [availNote, setAvailNote] = useState<any>([]);
  const { authState } = useContext(AuthContext);

  const customParameter = useContext(CustomPropertiesConfigurationContext);

  const { dynamicAmountSymbol, currencyFormat, decimalCount } = customParameter;

  useEffect(() => {
    props?.map((item) => {
      if (item?.textField === "Y") {
        setForRemark(item?.value);
      }
    });
  }, [props]);

  const classes = useStyles();
  const { data } = useQuery<any, any>(["CashReceiptEntrysData"], () =>
    API.CashReceiptEntrysData()
  );
  const withdrawAmount = 8000;
  const upadatedFinalAmount: number = 8000 - totalAmount;

  useEffect(() => {
    setAvailNote(
      data?.map((el) => {
        return el?.AVAIL_NOTE;
      })
    );
  }, [data]);

  const handleChange = (value, index) => {
    if (value.startsWith("-")) {
      value = "-" + value.replace(/[^0-9]/g, "");
    } else {
      value = value.replace(/[^0-9]/g, "");
    }
    // console(value);
    let updatedValue = { ...inputVal };
    updatedValue[index] = value;
    setInputVal(updatedValue);
    const multipliedValue = parseFloat(value) * parseFloat(data?.[index]?.NOTE);
    const updatedMultipliedValue = [...multiplicationResult];
    updatedMultipliedValue[index] = multipliedValue;
    setMultiplicationResult(updatedMultipliedValue);

    let calcAvailNotValue;
    if (trx === "4") {
      if (value && data?.length > 0 && !isNaN(value) && value !== undefined) {
        calcAvailNotValue = data?.[index]?.AVAIL_NOTE - value;
      }
    } else if (trx === "1") {
      if (value && data?.length > 0 && !isNaN(value) && value !== undefined) {
        calcAvailNotValue = data?.[index]?.AVAIL_NOTE + value;
      }
    }

    const updatedCalcAvailNotes = [...availNote];
    updatedCalcAvailNotes[index] = calcAvailNotValue;
    setAvailNote(updatedCalcAvailNotes);
    // Calculate the total input amount and update state
    const newTotalInputAmount: any = Object.values(updatedValue).reduce(
      (acc: any, val: any) => acc + (parseFloat(val) || 0),
      0
    );
    setTotalInputAmount(newTotalInputAmount);
  };

  const updateTotalAmount = (index) => {
    let sum = 0;
    multiplicationResult?.forEach((item) => {
      if (!isNaN(item)) {
        sum += parseFloat(item);
      }
    });

    const newDisplayErrors = [...displayError];

    setTotalAmount((preValue) => {
      return preValue;
    });
    newDisplayErrors[
      index
    ] = `Denomination ${data?.[index]?.NOTE} should be less than or equal to Total Amount`;

    ////////

    if (
      trx === "1" &&
      multiplicationResult[index] < 0 &&
      Math.abs(multiplicationResult[index]) > data[index].TOTAL_AMNT
    ) {
      setDisplayError(newDisplayErrors);
      setMultiplicationResult((preVal) => {
        const updatedRslt = [...preVal];
        updatedRslt[index] = 0;
        return updatedRslt;
      });
      const updatedInputVal = { ...inputVal };
      updatedInputVal[index] = "";
      setInputVal(updatedInputVal);
      setTotalInputAmount((preValue) => preValue);
    } else if (
      trx === "4" &&
      multiplicationResult[index] > 0 &&
      multiplicationResult[index] > data[index].TOTAL_AMNT
    ) {
      setDisplayError(newDisplayErrors);
      setMultiplicationResult((preVal) => {
        const updatedRslt = [...preVal];
        updatedRslt[index] = 0;
        return updatedRslt;
      });
      const updatedInputVal = { ...inputVal };
      updatedInputVal[index] = "";
      setInputVal(updatedInputVal);
      setTotalInputAmount((preValue) => preValue);
    } else {
      newDisplayErrors[index] = "";
      setTotalAmount(sum);
      setDisplayError([]);
    }
  };

  useEffect(() => {
    if (upadatedFinalAmount === 0) {
      setConfirmation(true);
    } else {
      setConfirmation(false);
    }
  }, [upadatedFinalAmount]);

  const controlAction = (row, buttonName) => {
    if (buttonName === "Yes") {
      console.log("submitted");
    } else if (buttonName === "No") {
      setConfirmation(false);
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      const initialTotal = {
        // NOTE_CNT: 0,
        AMOUNT: 0,
        AVAIL_NOTE: 0,
        TOTAL_AMNT: 0,
      };

      const newTotals = data.reduce((acc, item) => {
        return {
          // NOTE_CNT: acc.NOTE_CNT + parseFloat(item.NOTE_CNT),
          AMOUNT: acc.AMOUNT + parseFloat(item.AMOUNT),
          AVAIL_NOTE: acc.AVAIL_NOTE + parseFloat(item.AVAIL_NOTE),
          TOTAL_AMNT: acc.TOTAL_AMNT + parseFloat(item.TOTAL_AMNT),
        };
      }, initialTotal);

      setDisplayTotal(newTotals);
    }
  }, [data]);

  const handleKeyPress = (event, index) => {
    if (event.key === "Enter") {
      updateTotalAmount(index);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        maxWidth="md"
        fullWidth={true}
        sx={{ boxShadow: "10px 10px 10px 10px" }}
      >
        {/* <SortableTable data={data} columns={columns} /> */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            background: "var(--theme-color5)",
            alignItems: "center",
            height: "auto",
            margin: "9px 9px 1px 9px",
            borderRadius: "4px",
            padding: "7px",
          }}
        >
          <Typography variant="h5" color="#FFFFFF" sx={{ fontWeight: "bold" }}>
            {trx === "1"
              ? `Cash Receipt Entry `
              : trx === "4"
              ? `Cash Payment Entry `
              : `NO_NAME `}
            ({authState?.roleName})
          </Typography>
          <GradientButton onClick={handleCloseDialog}>Close</GradientButton>
        </Box>
        {/* </> */}
        <Grid
          container
          component={Paper}
          sx={{
            display: "flex",
            margin: "4px 10px 0px 10px",
            width: "auto",
            padding: "4px",
            border: "2px solid var(--theme-color3)",
          }}
        >
          {props?.map((item, index) => {
            return (
              item?.value !== "" && (
                <Grid
                  sx={{
                    display: "flex",
                    marginRight: "10px",
                    padding: "0rem 10px",
                  }}
                >
                  {item.textField !== "Y" ? (
                    <Grid
                      item
                      sx={{
                        margin: "3px 0px",
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {item?.label}
                      </Typography>
                      <Typography variant="body1"> {item?.value}</Typography>
                    </Grid>
                  ) : (
                    <TextField
                      label={item.label}
                      value={forRemark}
                      variant="outlined"
                      onChange={(e: any) => setForRemark(e.target.value)}
                    />
                  )}
                </Grid>
              )
            );
          })}
        </Grid>
        <TableContainer
          sx={{
            margin: "6px 10px 0px 10px",
            width: "auto",
            maxHeight: "calc(100% - 52px)",
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
                      // fontSize: "24px", // Adjust the font size as needed
                      marginLeft: "10px",
                    }}
                  >
                    {
                      <Typography
                        style={{
                          // backgroundColor: " var(--theme-color1)",
                          // padding: "0px 7px",
                          border: "0.2px solid",
                          borderRadius: "50%",
                          // fontWeight: "bold",
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
                      {/* {FormatCurrency(row.NOTE, dynamicAmountSymbol)} */}
                      {row.NOTE}
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
                        onBlur={() => updateTotalAmount(index)}
                        helperText={displayError[index] || ""}
                        type={"text"}
                        InputProps={{
                          style: { textAlign: "left" },
                        }}
                        tabIndex={index + 2}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="right" className="cellBordered">
                      {" "}
                      {multiplicationResult[index] || "0.00"}
                    </StyledTableCell>
                    <StyledTableCell align="right" className="cellBordered">
                      {row.AVAIL_NOTE || "0"}
                    </StyledTableCell>
                    <StyledTableCell align="right" className="cellBordered">
                      {/* {FormatCurrency(row.TOTAL_AMNT, dynamicAmountSymbol)} */}
                      {row.TOTAL_AMNT}
                    </StyledTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>{" "}
        <Paper
          sx={{
            height: "auto",
            margin: "0px 10px 0px 10px",
            boxShadow:
              "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
            borderRadius: "0px",
            borderBottom: "2px solid var(--theme-color1)",
            borderTop: "2px solid var(--theme-color1)",
          }}
        >
          <TableBody sx={{ display: "flex", justifyContent: "space-between" }}>
            <StyledTableCell
              align="left"
              sx={{ fontWeight: "bold", fontSize: "1rem" }}
            >
              {"Total :"}
            </StyledTableCell>
            <StyledTableCell align="left">{totalInputAmount}</StyledTableCell>
            <StyledTableCell align="right" sx={{ fontWeight: "bold" }}>
              {totalAmount}
            </StyledTableCell>
            <StyledTableCell align="right">
              {displayTotal?.AVAIL_NOTE}
            </StyledTableCell>
            <StyledTableCell align="right">
              {displayTotal?.TOTAL_AMNT}
            </StyledTableCell>
          </TableBody>
        </Paper>
        <Paper
          sx={{
            height: "auto",
            margin: "0px 10px 4px 10px",
            width: "auto",
            padding: "2px 8px",
            borderRadius: "0px",
            borderBottom: "2px solid var(--theme-color1)",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              backgroundColor: "var(--theme-color2)",
              padding: "0px 0px",
              display: "flex",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
              }}
            >
              {" "}
              {upadatedFinalAmount >= 0 ? "Remaining" : "Excess"}:
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>
              {" "}
              {!isNaN(upadatedFinalAmount) ? upadatedFinalAmount : 0}
            </Typography>
          </Typography>
        </Paper>{" "}
        {Boolean(confirmation) ? (
          <PopupRequestWrapper
            MessageTitle={"Confirmation"}
            Message={"All Transaction are Completed Want to Proceed"}
            onClickButton={(rows, buttonNames) => {
              controlAction(rows, buttonNames);
            }}
            buttonNames={["Yes", "No"]}
            rows={[]}
            open={confirmation}
          />
        ) : null}
      </Dialog>
    </>
  );
};

export default CashReceiptEntry;
