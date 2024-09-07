// import {
//   Box,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   Paper,
//   Table,
//   TableBody,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";
// import React, {
//   Fragment,
//   useCallback,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import { useStyles, StyledTableCell } from "./style";
// import { useQuery } from "react-query";
// import * as API from "./api";
// import { TextField } from "components/styledComponent";
// import { formatCurrency } from "components/tableCellComponents/currencyRowCellRenderer";
// import getCurrencySymbol from "components/custom/getCurrencySymbol";
// import { CustomPropertiesConfigurationContext } from "components/propertiesconfiguration/customPropertiesConfig";
// import { AuthContext } from "pages_audit/auth";
// import { format, parse } from "date-fns";
// import { GradientButton } from "components/styledComponent/button";

// const DualPartTable = ({
//   formData,
//   displayTableDual,
//   openAcctDtl,
//   onCloseTable,
//   data,
//   isLoading,
//   extraAccDtl,
// }) => {
//   const [rcmultipliedResult, setRcMultipliedResult] = useState([]);
//   const [pymultipliedResult, setPyMultipliedResult] = useState<any>([]);
//   const [rcinputVal, setrcInputVal] = useState({});
//   const [pyinputVal, setpyInputVal] = useState({});
//   const [availNote, setAvailNote] = useState<any>([]);
//   const [availableNotes, setAvailableNotes] = useState<any>([]);
//   const [totalAmount, setTotalAmount] = useState({
//     rcTotalAmount: 0,
//     pyTotalAmount: 0,
//     rcInputToal: 0,
//     pyInputTotal: 0,
//   });
//   // const [rcTotalAmount, setTotalAmount] = useState(0);
//   // const [pyTotalAmount, setPyTotalAmount] = useState(0);
//   const classes = useStyles();
//   const customParameter = useContext(CustomPropertiesConfigurationContext);
//   const { authState }: any = useContext(AuthContext);
//   const { dynamicAmountSymbol, currencyFormat, decimalCount } = customParameter;
//   // console.log(formData, "formDataTELLER");
//   // const formattedDate = format(
//   //   parse(authState?.workingDate, "dd/MMM/yyyy", new Date()),
//   //   "dd/MMM/yyyy"
//   // ).toUpperCase();
//   // const { data, isLoading } = useQuery<any, any>(
//   //   ["CashReceiptEntrysData"],
//   //   () =>
//   //     API.CashReceiptEntrysData({
//   //       COMP_CD: authState?.companyID,
//   //       BRANCH_CD: authState?.user?.branchCode,
//   //       USER_NAME: authState?.user?.id,
//   //       // TRAN_DT: "03/FEB/2024",
//   //       TRAN_DT: formattedDate,
//   //     })
//   // );

//   useEffect(() => {
//     if (data && !isLoading) {
//       setAvailNote(
//         data?.map((el) => {
//           return el?.AVAIL_NOTE;
//         })
//       );
//       setAvailableNotes(
//         data?.map((el) => {
//           return el?.AVAIL_NOTE;
//         })
//       );
//     }
//   }, [data, isLoading]);

//   useEffect(() => {}, [availableNotes]);

//   const updateState = (
//     inputVal,
//     multipliedResult,
//     flag,
//     noteKey,
//     operation,
//     currentItem,
//     index,
//     value
//   ) => {
//     inputVal((prevInputVal) => {
//       let updatedValue: any = { ...prevInputVal };
//       updatedValue[index] = value;
//       return updatedValue;
//     });
//     console.log(
//       value,
//       "value",
//       currentItem?.[noteKey],
//       "currentItem?.[noteKey]",
//       currentItem,
//       "currentItem"
//     );
//     multipliedResult((prevMultipliedResult) => {
//       const multipliedRslt =
//         parseFloat(value) * parseFloat(currentItem?.DENO_VAL);
//       const finalAmount: any = [...prevMultipliedResult];
//       finalAmount[index] = !isNaN(multipliedRslt) ? multipliedRslt : "";
//       console.log(finalAmount, "finalAmount", multipliedRslt, "multipliedRslt");
//       return finalAmount;
//     });
//   };

//   const calculateTotalAmount = (baseValue, setterFunction, setterKey) => {
//     const total = data.reduce(
//       (acc, item, index) => acc + parseFloat(baseValue[index] || "0"),
//       0
//     );
//     setterFunction((prevState) => ({ ...prevState, [setterKey]: total }));
//   };

//   // ... (previous code)

//   const handleKeyPress = useCallback(
//     (event, index, flag, availLblNote, availableNotes) => {
//       if (event.key === "Enter") {
//         const currentItem = data?.[index];
//         const value = parseFloat(event?.target?.value) || 0;

//         // Update the state with the updated available note
//         if (flag === "REC") {
//           setAvailNote((prevalue) => {
//             const calcuted = parseFloat(availableNotes[index]) + value;
//             const updatedVal = [...prevalue];
//             updatedVal[index] = !isNaN(calcuted) ? calcuted : "==";
//             return updatedVal;
//           });
//         } else {
//           setAvailNote((prevalue) => {
//             const calcuted = parseFloat(availableNotes[index]) - value;
//             const updatedVal = [...prevalue];
//             updatedVal[index] = !isNaN(calcuted) ? calcuted : "++";
//             return updatedVal;
//           });
//         }
//         // setAvailNote((prevAvailNote) => {
//         //   console.log(prevAvailNote, "preAvailNotesVVV");
//         //   const updatedVal = [...prevAvailNote];
//         //   updatedVal[index] = !isNaN(updatedAvailNote)
//         //     ? updatedAvailNote
//         //     : originalAvailNote;
//         //   return updatedVal;
//         // });

//         // ... (remaining code)^^^
//         // console.log(availNote, "availNoite.............");
//         // const calculation =
//         //   flag === "REC"
//         //     ? parseFloat(availNote[index]) + value
//         //     : parseFloat(availNote[index]) - value;

//         // const updateValue = [...availNote];
//         // updateValue[index] = calculation;

//         // console.log(updateValue, "UpdateValue.............");

//         // setAvailNote(updateValue);
//         // console.log(availNote, "availNoite.............1");
//       }
//     },
//     []
//   );

//   const handleBlur = (event, index, flag) => {
//     const keyMap = {
//       RECEIPT: {
//         baseValue: rcmultipliedResult,
//         setterKey1: "rcTotalAmount",
//         setterKey2: "rcInputTotal",
//       },
//       PAYMENT: {
//         baseValue: pymultipliedResult,
//         setterKey1: "pyTotalAmount",
//         setterKey2: "pyInputTotal",
//       },
//     };

//     if (keyMap[flag]) {
//       const { baseValue, setterKey1, setterKey2 } = keyMap[flag];
//       calculateTotalAmount(baseValue, setTotalAmount, setterKey1);
//       calculateTotalAmount(baseValue, setTotalAmount, setterKey2);
//     }
//   };

//   const handleChange = useCallback(
//     (e, index, flag) => {
//       let value = e.target.value;
//       const currentItem = data?.[index];

//       // Apply acceptable value validation
//       if (value.startsWith("-")) {
//         value = "";
//       } else {
//         value = value.replace(/[^0-9]/g, "");
//       }

//       if (flag === "REC") {
//         updateState(
//           setrcInputVal,
//           setRcMultipliedResult,
//           "REC",
//           "NOTE",
//           (a, b) => a + b,
//           currentItem,
//           index,
//           value
//         );
//       } else {
//         updateState(
//           setpyInputVal,
//           setPyMultipliedResult,
//           "PAY",
//           "PYNOTE",
//           (a, b) => a - b,
//           currentItem,
//           index,
//           value
//         );
//       }
//     },
//     [data, rcinputVal, pyinputVal, availNote]
//   );

//   return (
//     <Dialog open={displayTableDual && openAcctDtl} maxWidth={"xl"}>
//       <Box
//         sx={{
//           height: "8vh",
//           background: "var(--theme-color5)",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           margin: "10px",
//         }}
//       >
//         <DialogTitle variant="h6" sx={{ color: "var(--theme-color2)" }}>
//           {`Cash Receipt/Payment - ${extraAccDtl?.Name}`}
//         </DialogTitle>
//         {/* <DialogActions> */}
//         <GradientButton
//           onClick={() => onCloseTable(false, "TABLE2")}
//           color="primary"
//           disabled={false}
//           style={{ marginRight: "10px" }}
//         >
//           Close
//         </GradientButton>
//         {/* </DialogActions> */}
//       </Box>
//       <DialogContent sx={{ padding: "0px" }}>
//         <Paper
//           sx={{
//             padding: "7px 2px",
//             boxShadow: "none",
//             borderRadius: "0px",
//             margin: "0 10px",
//           }}
//         >
//           <Box
//             borderRadius={"none"}
//             boxShadow={"rgba(226, 236, 249, 0.5) 0px 11px 70px"}
//             overflow={"hidden"}
//             // border={"1px solid gray"}
//           >
//             <TableContainer
//               sx={{
//                 width: "auto",
//               }}
//               component={Paper}
//             >
//               <Table
//                 sx={{ minWidth: 650 }}
//                 aria-label="simple table"
//                 className={classes.tableBordered}
//               >
//                 <TableHead>
//                   <TableRow>
//                     <StyledTableCell>
//                       Denomination{" "}
//                       <Box
//                         className="flipHorizontal"
//                         style={{
//                           animation: "flipHorizontal 2s infinite",
//                           display: "inline-block",
//                           transformOrigin: "center",
//                           marginLeft: "10px",
//                         }}
//                       >
//                         {
//                           <Typography
//                             style={{
//                               border: "0.2px solid",
//                               borderRadius: "50%",
//                               height: "22px",
//                               width: "22px",
//                               textAlign: "center",
//                             }}
//                           >
//                             {getCurrencySymbol(dynamicAmountSymbol)}
//                           </Typography>
//                         }
//                       </Box>
//                     </StyledTableCell>
//                     <StyledTableCell>Receipt</StyledTableCell>
//                     <StyledTableCell align="right">Amount</StyledTableCell>
//                     <StyledTableCell>
//                       Denomination{" "}
//                       <Box
//                         className="flipHorizontal"
//                         style={{
//                           animation: "flipHorizontal 2s infinite",
//                           display: "inline-block",
//                           transformOrigin: "center",
//                           marginLeft: "10px",
//                         }}
//                       >
//                         {
//                           <Typography
//                             style={{
//                               border: "0.2px solid",
//                               borderRadius: "50%",
//                               height: "22px",
//                               width: "22px",
//                               textAlign: "center",
//                             }}
//                           >
//                             {getCurrencySymbol(dynamicAmountSymbol)}
//                           </Typography>
//                         }
//                       </Box>{" "}
//                     </StyledTableCell>
//                     <StyledTableCell>Payment</StyledTableCell>
//                     <StyledTableCell align="right">Amount</StyledTableCell>
//                     <StyledTableCell>Available Note(s)</StyledTableCell>
//                     <StyledTableCell align="right">Balance</StyledTableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {data?.map((item, index) => {
//                     // {
//                     //   console.log(item, "item////");
//                     // }
//                     return (
//                       <Fragment>
//                         <TableRow key={index}>
//                           <StyledTableCell
//                             component="th"
//                             scope="row"
//                             className="cellBordered"
//                             align="left"
//                           >
//                             {/* {formatCurrency(
//                         parseFloat(item?.DENO_VAL),
//                         getCurrencySymbol(dynamicAmountSymbol),
//                         currencyFormat,
//                         decimalCount
//                       )} */}
//                             {item?.DENO_LABLE}
//                           </StyledTableCell>
//                           <StyledTableCell
//                             align="left"
//                             sx={{
//                               borderRight: "1px solid var(--theme-color6)",
//                               borderLeft: "1px solid var(--theme-color6)",
//                               // backgroundColor: "var(--theme-color4)",
//                               maxWidth: "120px",
//                               minWidth: "120px",
//                             }}
//                             tabIndex={index + 2}
//                             className="cellBordered"
//                           >
//                             <TextField
//                               classes={{ root: classes?.leftTextAlign }}
//                               onChange={(e) => handleChange(e, index, "REC")}
//                               value={rcinputVal[index]}
//                               placeholder={"enter value"}
//                               onBlur={(event) =>
//                                 handleBlur(event, index, "RECEIPT")
//                               }
//                               onKeyDown={(even) => {
//                                 handleKeyPress(
//                                   even,
//                                   index,
//                                   "REC",
//                                   availNote,
//                                   availableNotes
//                                 );
//                               }}
//                             />
//                           </StyledTableCell>
//                           <StyledTableCell
//                             className="cellBordered"
//                             align="right"
//                           >
//                             {formatCurrency(
//                               parseFloat(rcmultipliedResult[index] || "0"),
//                               getCurrencySymbol(dynamicAmountSymbol),
//                               currencyFormat,
//                               decimalCount
//                             )}
//                           </StyledTableCell>
//                           <StyledTableCell
//                             className="cellBordered"
//                             align="left"
//                           >
//                             {/* {formatCurrency(
//                         parseFloat(item?.DENO_VAL),
//                         getCurrencySymbol(dynamicAmountSymbol),
//                         currencyFormat,
//                         decimalCount
//                       )} */}
//                             {item?.DENO_LABLE}
//                           </StyledTableCell>
//                           <StyledTableCell
//                             align="left"
//                             sx={{
//                               borderRight: "1px solid var(--theme-color6)",
//                               borderLeft: "1px solid var(--theme-color6)",
//                               // backgroundColor: "var(--theme-color4)",
//                               maxWidth: "120px",
//                               minWidth: "120px",
//                             }}
//                             tabIndex={index + 2}
//                             className="cellBordered"
//                           >
//                             <TextField
//                               classes={{ root: classes?.leftTextAlign }}
//                               value={pyinputVal[index]}
//                               onChange={(e) => handleChange(e, index, "PAY")}
//                               placeholder={"enter value"}
//                               onBlur={(event) =>
//                                 handleBlur(event, index, "PAYMENT")
//                               }
//                               onKeyDown={(even) => {
//                                 handleKeyPress(
//                                   even,
//                                   index,
//                                   "PAY",
//                                   availNote,
//                                   availableNotes
//                                 );
//                               }}
//                             />
//                           </StyledTableCell>
//                           <StyledTableCell
//                             className="cellBordered"
//                             align="right"
//                           >
//                             {formatCurrency(
//                               parseFloat(pymultipliedResult[index] || "0"),
//                               getCurrencySymbol(dynamicAmountSymbol),
//                               currencyFormat,
//                               decimalCount
//                             )}
//                           </StyledTableCell>
//                           <StyledTableCell
//                             className="cellBordered"
//                             align="right"
//                           >
//                             {item?.AVAIL_QTY}
//                           </StyledTableCell>
//                           <StyledTableCell
//                             className="cellBordered"
//                             align="right"
//                           >
//                             {formatCurrency(
//                               parseFloat(item?.AVAIL_VAL),
//                               getCurrencySymbol(dynamicAmountSymbol),
//                               currencyFormat,
//                               decimalCount
//                             )}{" "}
//                           </StyledTableCell>
//                         </TableRow>
//                       </Fragment>
//                     );
//                   })}
//                 </TableBody>
//                 <TableBody>
//                   <TableRow sx={{ height: "43px" }}>
//                     <StyledTableCell
//                       component="th"
//                       scope="row"
//                       className="cellBordered"
//                       sx={{ fontWeight: "bold", fontSize: "1rem" }}
//                     >
//                       {"Total :"}
//                     </StyledTableCell>

//                     <StyledTableCell
//                       align="left"
//                       sx={{
//                         maxWidth: "167px",
//                         padding: "4px 17px !important",
//                         fontWeight: "bold",
//                         fontSize: "1rem",
//                       }}
//                       className="cellBordered"
//                     >
//                       {totalAmount?.rcInputToal}
//                     </StyledTableCell>
//                     <StyledTableCell
//                       align="right"
//                       className="cellBordered"
//                       sx={{ fontWeight: "bold", fontSize: "1rem" }}
//                     >
//                       {totalAmount?.rcTotalAmount}
//                     </StyledTableCell>
//                     <StyledTableCell
//                       align="right"
//                       className="cellBordered"
//                       sx={{ fontWeight: "bold", fontSize: "1rem" }}
//                     >
//                       {" "}
//                     </StyledTableCell>
//                     <StyledTableCell
//                       align="right"
//                       className="cellBordered"
//                       sx={{ fontWeight: "bold", fontSize: "1rem" }}
//                     >
//                       {totalAmount?.pyInputTotal}
//                     </StyledTableCell>
//                     <StyledTableCell
//                       align="right"
//                       className="cellBordered"
//                       sx={{ fontWeight: "bold", fontSize: "1rem" }}
//                     >
//                       {totalAmount?.pyTotalAmount}
//                     </StyledTableCell>
//                     <StyledTableCell
//                       align="right"
//                       className="cellBordered"
//                       sx={{ fontWeight: "bold", fontSize: "1rem" }}
//                     >
//                       {" "}
//                     </StyledTableCell>
//                     <StyledTableCell
//                       align="right"
//                       className="cellBordered"
//                       sx={{ fontWeight: "bold", fontSize: "1rem" }}
//                     >
//                       {" "}
//                     </StyledTableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* <Typography>{rcTotalAmount}</Typography> */}
//           </Box>
//         </Paper>
//       </DialogContent>
//     </Dialog>
//   );

//   return <></>;
// };

// export default DualPartTable;

import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TextField,
  Typography,
  TableFooter,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { useStyles, StyledTableCell } from "./style";
import { boolean } from "yup";
import { CustomPropertiesConfigurationContext } from "components/propertiesconfiguration/customPropertiesConfig";
import {
  PopupRequestWrapper,
  formatCurrency,
  GradientButton,
  usePropertiesConfigContext,
  getCurrencySymbol,
} from "@acuteinfo/common-base";
const DualPartTable = ({
  data,
  columnDefinitions,
  isLoading,
  displayTableDual,
  // openAcctDtl,
  onCloseTable,
  handleChange,
  inputValues,
  totalAmounts,
  gridLable,
  handleBlur,
  inputRestrictions,
  remainExcess,
  remainExcessLable,
  errors,
  confirmation,
  closeConfirmation,
  getRowData,
  formData,
}) => {
  const classes = useStyles();
  const inputRefs = useRef<any>({});
  const [refsReady, setRefsReady] = useState(false);
  const customParameter = usePropertiesConfigContext();
  const { dynamicAmountSymbol, currencyFormat, decimalCount } = customParameter;

  useEffect(() => {
    // console.log(inputRefs.current, "inputRefs.current5645454545");
    if (Object.keys(inputRefs.current).length > 0) {
      setRefsReady(true);
    }
  }, [data]); // Assuming 'data' influences the number of TextFields

  useEffect(() => {
    if (refsReady) {
      // console.log(
      //   "&&&&&&&TELLER",
      //   inputRefs?.current["0"],
      //   displayTableDual,
      //   "display",
      //   data,
      //   "tata"
      // );
      let timer = setTimeout(() => {
        inputRefs?.current["0"].focus();
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [refsReady, displayTableDual, data]);

  const renderTableHeader = () => {
    return (
      <TableHead>
        <TableRow>
          {columnDefinitions.map((column, index) => (
            <StyledTableCell
              key={`${column.fieldName}-${index}`}
              className="cellBordered"
              align={column.isCurrency && "right"}
            >
              {column.label}
            </StyledTableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };
  // console.log(">>totalAmounts", totalAmounts);
  const renderTableBody = () => {
    return (
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            {columnDefinitions.map((column) => {
              const isEditable = column?.isEditable;
              const value =
                inputValues[index]?.[column.fieldName] ||
                item[column.fieldName] ||
                "";
              const displayValue = column.isCurrency
                ? formatCurrency(
                    parseFloat(value || "0"),
                    getCurrencySymbol(dynamicAmountSymbol),
                    currencyFormat,
                    decimalCount
                  )
                : value;
              return (
                <StyledTableCell
                  key={column?.uniqueID}
                  align={column.isCurrency && "right"}
                >
                  {Boolean(isEditable) ? (
                    <TextField
                      variant="standard"
                      fullWidth
                      value={value}
                      autoComplete="off"
                      onChange={(e) =>
                        isEditable && handleChange(e, index, column.fieldName)
                      }
                      onBlur={(event) =>
                        handleBlur(event, column?.fieldName, index)
                      }
                      placeholder={"Enter value"}
                      InputProps={{
                        readOnly: !isEditable,
                        disableUnderline: true,
                      }}
                      classes={{ root: classes?.leftTextAlign }}
                      error={errors.some(
                        (error) =>
                          error.index === index &&
                          error.fieldName === column?.fieldName
                      )}
                      helperText={
                        (
                          errors.find(
                            (error) =>
                              error.index === index &&
                              error.fieldName === column?.fieldName
                          ) || {}
                        ).message || ""
                      }
                      onKeyPress={(event) => {
                        const keyCode = event.keyCode || event.which;
                        const keyValue = String.fromCharCode(keyCode);
                        if (!/^[0-9]$/.test(keyValue)) event.preventDefault();
                      }}
                      // autoFocus={
                      //   column?.fieldName === "receipt" &&
                      //   displayTableDual &&
                      //   data &&
                      //   index === 0
                      // }
                      inputRef={(input) => {
                        if (input && column?.fieldName === "receipt") {
                          // console.log(
                          //   input,
                          //   "input",
                          //   column?.fieldName === "receipt",
                          //   "check Conditopn"
                          // );
                          // if (index === 0) {
                          //   console.log(input, "check Conditopn2222");
                          // }
                          inputRefs.current[index] = input;
                          if (index === data.length - 1) {
                            // Check if the last input is set
                            setRefsReady(true);
                          }
                        }
                      }}
                    />
                  ) : (
                    <Typography>{displayValue}</Typography>
                  )}
                </StyledTableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    );
  };

  const renderTableFooter = () => {
    return (
      <TableBody
        style={{
          position: "sticky",
          bottom: 0,
          background: "var(--theme-color4)",
          border: "none",
        }}
      >
        <TableRow>
          {columnDefinitions.map((column, index) => (
            <StyledTableCell
              key={`${column.fieldName}--${index}`}
              align={column.isCurrency && "right"}
            >
              <Typography sx={{ fontWeight: "bold" }}>
                {column.isTotalWord
                  ? "Total: "
                  : column.isCurrency
                  ? formatCurrency(
                      parseFloat(totalAmounts[column.fieldName] || "0"),
                      getCurrencySymbol(dynamicAmountSymbol),
                      currencyFormat,
                      decimalCount
                    )
                  : totalAmounts[column.fieldName] || "0"}
              </Typography>
            </StyledTableCell>
          ))}
        </TableRow>
      </TableBody>
    );
  };

  return (
    <Dialog open={displayTableDual && data?.length > 0} maxWidth={"xl"}>
      {/* <Box
        sx={{
          height: "auto",
          background: "var(--theme-color5)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "10px",
        }}
      >
        <DialogTitle
          variant="subtitle1"
          sx={{
            color: "var(--theme-color2)",
            padding: "16px 4px",
            maxWidth: "83rem",
          }}
        >
          {" "}
          {gridLable}
        </DialogTitle>
        <DialogActions>
          <GradientButton
            onClick={() => onCloseTable(false, "TABLE2")}
            color="primary"
            disabled={false}
            style={{ marginRight: "10px" }}
          >
            Close
          </GradientButton>
        </DialogActions>
      </Box> */}

      <AppBar
        position="static"
        sx={{
          height: "auto",
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
            onClick={() => onCloseTable(false, "TABLE2")}
            color="primary"
            disabled={false}
          >
            Close
          </GradientButton>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ padding: 0 }}>
        <Paper
          sx={{
            boxShadow: "none",
            borderRadius: "0px",
            margin: "0 10px",
            paddingBottom: "6px",
          }}
        >
          <TableContainer
            sx={{
              width: "auto",
              maxHeight: "calc(100vh - 200px)", // adjust this value according to your needs
              overflow: "auto",
            }}
            component={Paper}
          >
            <Table
              sx={{ minWidth: 650, borderCollapse: "unset !important" }}
              aria-label="simple table"
              className={classes.tableBordered}
            >
              {renderTableHeader()}
              <TableBody style={{ overflowY: "auto", display: "contents" }}>
                {renderTableBody()}
              </TableBody>
              {renderTableFooter()}
            </Table>
          </TableContainer>{" "}
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
                {`${remainExcessLable} :`}
              </Typography>
              <Typography sx={{ fontWeight: "bold" }}>
                {/* {remainExcessBal} */}
                {formatCurrency(
                  parseFloat(remainExcess),
                  getCurrencySymbol(dynamicAmountSymbol),
                  currencyFormat,
                  decimalCount
                )}
              </Typography>
            </Typography>
          </Paper>{" "}
        </Paper>
      </DialogContent>
      {Boolean(confirmation) ? (
        <PopupRequestWrapper
          MessageTitle={"Confirmation"}
          Message={"All Transaction are Completed Want to Proceed"}
          onClickButton={(buttonNames) => {
            if (Boolean(buttonNames === "Yes")) {
              console.log("form Submitted");
              const A = getRowData();

              const extractedValue = A?.map((item) => {
                return {
                  TYPE_CD:
                    formData?.TRN === "1"
                      ? "1"
                      : formData?.TRN === "4"
                      ? "4"
                      : "",
                  DENO_QTY: item?.DENO_QTY,
                  DENO_TRAN_CD: item?.TRAN_CD,
                  DENO_VAL: item?.DENO_VAL,
                  AMOUNT: item?.AMOUNT,
                };
              });
            } else if (Boolean(buttonNames === "No")) {
              closeConfirmation();
            }
          }}
          buttonNames={["Yes", "No"]}
          rows={[]}
          // loading={"Yes"}
          open={Boolean(confirmation)}
          defFocusBtnName={"Yes"}
          loadingBtnName={"Yes"}
          icon={"INFO"}
        />
      ) : null}
    </Dialog>
  );
};

export default DualPartTable;
