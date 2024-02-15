import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useStyles, StyledTableCell } from "./style";
import { useQuery } from "react-query";
import * as API from "./api";
import { TextField } from "components/styledComponent";
import { formatCurrency } from "components/tableCellComponents/currencyRowCellRenderer";
import getCurrencySymbol from "components/custom/getCurrencySymbol";
import { CustomPropertiesConfigurationContext } from "components/propertiesconfiguration/customPropertiesConfig";

const DualPartTable = () => {
  const [rcmultipliedResult, setRcMultipliedResult] = useState([]);
  const [pymultipliedResult, setPyMultipliedResult] = useState<any>([]);
  const [rcinputVal, setrcInputVal] = useState({});
  const [pyinputVal, setpyInputVal] = useState({});
  const [availNote, setAvailNote] = useState<any>([]);
  const [availableNotes, setAvailableNotes] = useState<any>([]);
  const [rcTotalAmount, setRcTotalAmount] = useState(0);
  const classes = useStyles();
  const customParameter = useContext(CustomPropertiesConfigurationContext);
  const { dynamicAmountSymbol, currencyFormat, decimalCount } = customParameter;

  const { data, isLoading } = useQuery<any, any>(
    ["CashReceiptEntrysData"],
    () => API.CashReceiptEntrysData2({ a: "a", b: "b" })
  );

  useEffect(() => {
    if (data && !isLoading) {
      setAvailNote(
        data?.map((el) => {
          return el?.AVAIL_NOTE;
        })
      );
      setAvailableNotes(
        data?.map((el) => {
          return el?.AVAIL_NOTE;
        })
      );
    }
  }, [data, isLoading]);

  useEffect(() => {}, [availableNotes]);

  const updateState = (
    inputVal,
    multipliedResult,
    flag,
    noteKey,
    operation,
    currentItem,
    index,
    value
  ) => {
    inputVal((prevInputVal) => {
      let updatedValue: any = { ...prevInputVal };
      updatedValue[index] = value;
      return updatedValue;
    });

    multipliedResult((prevMultipliedResult) => {
      const multipliedRslt =
        parseFloat(value) * parseFloat(currentItem?.[noteKey]);
      const finalAmount: any = [...prevMultipliedResult];
      finalAmount[index] = !isNaN(multipliedRslt) ? multipliedRslt : "";
      return finalAmount;
    });
  };

  const calculateTotalAmount = () => {
    if (data && data.length > 0) {
      const total = data.reduce(
        (acc, item, index) =>
          acc + parseFloat(rcmultipliedResult[index] || "0"),
        0
      );
      setRcTotalAmount(total);
    }
  };

  // ... (previous code)

  const handleKeyPress = useCallback(
    (event, index, flag, availLblNote, availableNotes) => {
      if (event.key === "Enter") {
        const currentItem = data?.[index];
        const value = parseFloat(event?.target?.value) || 0;

        // Update the state with the updated available note
        if (flag === "REC") {
          setAvailNote((prevalue) => {
            const calcuted = parseFloat(availableNotes[index]) + value;
            const updatedVal = [...prevalue];
            updatedVal[index] = !isNaN(calcuted) ? calcuted : "==";
            return updatedVal;
          });
        } else {
          setAvailNote((prevalue) => {
            const calcuted = parseFloat(availableNotes[index]) - value;
            const updatedVal = [...prevalue];
            updatedVal[index] = !isNaN(calcuted) ? calcuted : "++";
            return updatedVal;
          });
        }
        // setAvailNote((prevAvailNote) => {
        //   console.log(prevAvailNote, "preAvailNotesVVV");
        //   const updatedVal = [...prevAvailNote];
        //   updatedVal[index] = !isNaN(updatedAvailNote)
        //     ? updatedAvailNote
        //     : originalAvailNote;
        //   return updatedVal;
        // });

        // ... (remaining code)^^^
        // console.log(availNote, "availNoite.............");
        // const calculation =
        //   flag === "REC"
        //     ? parseFloat(availNote[index]) + value
        //     : parseFloat(availNote[index]) - value;

        // const updateValue = [...availNote];
        // updateValue[index] = calculation;

        // console.log(updateValue, "UpdateValue.............");

        // setAvailNote(updateValue);
        // console.log(availNote, "availNoite.............1");
      }
    },
    []
  );

  // ... (remaining code)

  const handleChange = useCallback(
    (e, index, flag) => {
      let value = e.target.value;
      const currentItem = data?.[index];

      // Apply acceptable value validation
      if (value.startsWith("-")) {
        value = "";
      } else {
        value = value.replace(/[^0-9]/g, "");
      }

      if (flag === "REC") {
        updateState(
          setrcInputVal,
          setRcMultipliedResult,
          "REC",
          "NOTE",
          (a, b) => a + b,
          currentItem,
          index,
          value
        );
      } else {
        updateState(
          setpyInputVal,
          setPyMultipliedResult,
          "PAY",
          "PYNOTE",
          (a, b) => a - b,
          currentItem,
          index,
          value
        );
      }

      calculateTotalAmount();
    },
    [data, rcinputVal, pyinputVal, availNote]
  );

  return (
    <Box
      borderRadius={"10px"}
      boxShadow={"rgba(226, 236, 249, 0.5) 0px 11px 70px"}
      overflow={"hidden"}
      border={"1px solid gray"}
    >
      <TableContainer>
        <Table sx={{ minWidth: 650 }} classes={classes.tableBordered}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Denomination</StyledTableCell>
              <StyledTableCell>Receipt</StyledTableCell>
              <StyledTableCell align="right">Amount</StyledTableCell>
              <StyledTableCell>Denomination</StyledTableCell>
              <StyledTableCell>Payment</StyledTableCell>
              <StyledTableCell align="right">Amount</StyledTableCell>
              <StyledTableCell>Available Note(s)</StyledTableCell>
              <StyledTableCell align="right">Balance</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.map((item, index) => {
              // {
              //   console.log(item, "item////");
              // }
              return (
                <Fragment>
                  <TableRow>
                    <StyledTableCell className="cellBordered" align="left">
                      {formatCurrency(
                        parseFloat(item?.NOTE),
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
                        maxWidth: "120px",
                        minWidth: "120px",
                      }}
                      tabIndex={index + 2}
                      className="cellBordered"
                    >
                      <TextField
                        classes={{ root: classes?.leftTextAlign }}
                        onChange={(e) => handleChange(e, index, "REC")}
                        value={rcinputVal[index]}
                        placeholder={"enter value"}
                        onKeyDown={(even) => {
                          handleKeyPress(
                            even,
                            index,
                            "REC",
                            availNote,
                            availableNotes
                          );
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell className="cellBordered" align="right">
                      {formatCurrency(
                        parseFloat(rcmultipliedResult[index] || "0"),
                        getCurrencySymbol(dynamicAmountSymbol),
                        currencyFormat,
                        decimalCount
                      )}
                    </StyledTableCell>
                    <StyledTableCell className="cellBordered" align="left">
                      {formatCurrency(
                        parseFloat(item?.NOTE),
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
                        maxWidth: "120px",
                        minWidth: "120px",
                      }}
                      tabIndex={index + 2}
                      className="cellBordered"
                    >
                      <TextField
                        classes={{ root: classes?.leftTextAlign }}
                        value={pyinputVal[index]}
                        onChange={(e) => handleChange(e, index, "PAY")}
                        placeholder={"enter value"}
                        onKeyDown={(even) => {
                          handleKeyPress(
                            even,
                            index,
                            "PAY",
                            availNote,
                            availableNotes
                          );
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell className="cellBordered" align="right">
                      {formatCurrency(
                        parseFloat(pymultipliedResult[index] || "0"),
                        getCurrencySymbol(dynamicAmountSymbol),
                        currencyFormat,
                        decimalCount
                      )}
                    </StyledTableCell>
                    <StyledTableCell className="cellBordered" align="right">
                      {availNote[index]}
                    </StyledTableCell>
                    <StyledTableCell className="cellBordered" align="right">
                      {formatCurrency(
                        parseFloat(item?.TOTAL_AMNT),
                        getCurrencySymbol(dynamicAmountSymbol),
                        currencyFormat,
                        decimalCount
                      )}{" "}
                    </StyledTableCell>
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography>{rcTotalAmount}</Typography>
    </Box>
  );

  // return <></>;
};

export default DualPartTable;
