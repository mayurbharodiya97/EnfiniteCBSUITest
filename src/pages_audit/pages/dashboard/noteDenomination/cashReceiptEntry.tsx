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
  // TextField,
} from "@mui/material";
import { Typography } from "@mui/material";
import * as API from "./api";
import { useMutation } from "react-query";
import { GradientButton } from "components/styledComponent/button";
import {
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
import { DenominationScreenMetaData } from "./metadata";
import { UpdateRequestDataVisibleColumn } from "components/utils";
import { formatCurrency } from "components/tableCellComponents/currencyRowCellRenderer";

const CashReceiptEntry = () => {
  const [inputVal, setInputVal] = useState<any>({});
  const [displayError, setDisplayError] = useState<string[]>([]);
  const [multiplicationResult, setMultiplicationResult] = useState<any>([]);
  const [totalAmount, setTotalAmount] = useState<any>(0);
  const [confirmation, setConfirmation] = useState(false);
  const [displayTotal, setDisplayTotal] = useState<any>([]);
  const [totalInputAmount, setTotalInputAmount] = useState<any>(0);
  const [availNote, setAvailNote] = useState<any>([]);
  const customParameter = useContext(CustomPropertiesConfigurationContext);
  const [retData, setRetData] = useState<any>({});
  const [displayTable, setDisplayTable] = useState(false);
  const [balance, setBalance] = useState<any>([]);
  const [openDeno, setOpenDeno] = useState<boolean>(false);
  const [isDisableField, setIsDisableField] = useState<boolean>(false);
  const { dynamicAmountSymbol, currencyFormat, decimalCount } = customParameter;
  const authState = useContext(AuthContext);
  const formComponentViewRef: any = useRef(null);
  const [referData, setReferData] = useState<any>();
  // const [externalButtonLoading, setExternalButtonLoading] = useState<any>();
  // useEffect(() => {
  //   props?.map((item) => {
  //     if (item?.textField === "Y") {
  //       setForRemark(item?.value);
  //     }
  //   });
  // }, [props]);

  const getDefaultBranchCode = authState?.authState?.user?.branchCode;

  const updatedMetaData = {
    ...DenominationScreenMetaData,
    fields: DenominationScreenMetaData.fields.map((field) => {
      if (field.accessor === "BRANCH") {
        return {
          ...field,
          defaultValue: getDefaultBranchCode,
        };
      }
      return field;
    }),
  };

  console.log(updatedMetaData, "updatedMetaData>>>");
  console.log(DenominationScreenMetaData, "DenominationScreenMetaData>>>");

  const getData: any = useMutation(API.CashReceiptEntrysData, {
    onSuccess: (response: any) => {
      setOpenDeno(false);
      setDisplayTable(true);
    },
    onError: (error: any) => {
      setDisplayTable(false);
    },
  });

  const manageOpenDenoYes = () => {
    setIsDisableField(true);
    getData.mutate({ a: "a", b: "b" });
  };

  const manageOpenDenoNo = () => {
    setOpenDeno(false);
  };

  const ClickEventManage = useCallback(
    (data, columnvisible) => {
      setOpenDeno(true);
      let retdata = UpdateRequestDataVisibleColumn(data, columnvisible);
      setRetData(retdata);
    },
    [getData]
  );

  const data: any = useMemo(() => {
    if (Array.isArray(getData.data)) {
      return [...getData.data];
    }
  }, [getData.data, retData]);

  const classes = useStyles();
  // const { data } = useQuery<any, any>(["CashReceiptEntrysData"], () =>
  //   API.CashReceiptEntrysData()
  // );
  const withdrawAmount = retData?.RECEIPT_PAYMENT;
  const upadatedFinalAmount: any = withdrawAmount - totalAmount;

  useEffect(() => {
    setAvailNote(
      data?.map((el) => {
        return el?.AVAIL_NOTE;
      })
    );
    setBalance(
      data?.map((el) => {
        return el?.TOTAL_AMNT;
      })
    );
  }, [data]);

  const handleChange = (value, index) => {
    //apply acceptable value validation in this
    if (value.startsWith("-")) {
      value = "-" + value.replace(/[^0-9]/g, "");
    } else {
      value = value.replace(/[^0-9]/g, "");
    }

    let updatedValue = { ...inputVal };
    updatedValue[index] = value;
    setInputVal(updatedValue);

    //setted multiplied values According to  index

    const multipliedValue: any =
      parseFloat(value) * parseFloat(data?.[index]?.NOTE);
    const updatedMultipliedValue = [...multiplicationResult];
    updatedMultipliedValue[index] = multipliedValue;
    setMultiplicationResult(updatedMultipliedValue);

    //***************************/

    //*********************//
  };

  const updateTotalAmount = (event, index) => {
    let value = event.target.value;
    let sum = 0;
    //get total of all multiplied values

    multiplicationResult?.forEach((item) => {
      if (!isNaN(item)) {
        sum += parseFloat(item);
      }
    });

    //for set error according to index
    const newDisplayErrors = [...displayError];

    newDisplayErrors[
      index
    ] = `Denomination ${data?.[index]?.NOTE} should be less than or equal to Total Amount`;

    //condition for if TRN is Receipt and values is -(negative) and greater then of TotalAmount(absolute(if have - or have + not affect))

    if (
      retData.TRN === "R" &&
      multiplicationResult[index] < 0 &&
      Math.abs(multiplicationResult[index]) > data[index]?.TOTAL_AMNT
    ) {
      setDisplayError(newDisplayErrors);

      //set multiplication is `0` when err0 is occurs according to index
      setMultiplicationResult((preVal) => {
        const updatedRslt = [...preVal];
        updatedRslt[index] = 0;
        return updatedRslt;
      });

      //for clear input whe error occur according to index
      const updatedInputVal = { ...inputVal };
      updatedInputVal[index] = "";
      setInputVal(updatedInputVal);
    }

    //condition for if TRN is Payment and values is +(positive) and greater then of TotalAmount
    else if (
      retData.TRN === "P" &&
      multiplicationResult[index] > 0 &&
      multiplicationResult[index] > data[index]?.TOTAL_AMNT
    ) {
      setDisplayError(newDisplayErrors);

      //set multiplication is `0` when err0 is occurs according to index
      setMultiplicationResult((preVal) => {
        const updatedRslt = [...preVal];
        updatedRslt[index] = 0;
        return updatedRslt;
      });

      //for clear input whe error occur according to index
      const updatedInputVal = { ...inputVal };
      updatedInputVal[index] = "";
      setInputVal(updatedInputVal);
    } else {
      newDisplayErrors[index] = "";
      setTotalAmount(sum);
      setDisplayError([]);
    }

    let calcAvailNotValue;
    let calcBalance;

    if (retData.TRN === "P") {
      if (value && data?.length > 0 && !isNaN(value) && value !== undefined) {
        calcAvailNotValue =
          parseFloat(data?.[index]?.AVAIL_NOTE) - parseFloat(value);
        calcBalance =
          parseFloat(data?.[index]?.TOTAL_AMNT) -
          parseFloat(multiplicationResult[index]);
      } else {
        calcAvailNotValue = parseFloat(data?.[index]?.AVAIL_NOTE);
        calcBalance = parseFloat(data?.[index]?.TOTAL_AMNT);
      }
    } else if (retData.TRN === "R") {
      if (value && data?.length > 0 && !isNaN(value) && value !== undefined) {
        calcAvailNotValue =
          parseFloat(data?.[index]?.AVAIL_NOTE) + parseFloat(value);
        calcBalance =
          parseFloat(data?.[index]?.TOTAL_AMNT) +
          parseFloat(multiplicationResult[index]);
      } else {
        calcAvailNotValue = parseFloat(data?.[index]?.AVAIL_NOTE);
        calcBalance = parseFloat(data?.[index]?.TOTAL_AMNT);
      }
    }

    const updatedCalcAvailNotes = [...availNote];
    updatedCalcAvailNotes[index] = calcAvailNotValue;
    setAvailNote(updatedCalcAvailNotes);

    const updatedBalance = [...balance];
    updatedBalance[index] = calcBalance;
    setBalance(updatedBalance);

    //if inputvalueTotal not working correctly so please move this part(between //**// ---- //**//) on handle change function and change inputVal ---->>updatedInputVal

    //for display total ammount of all inputs
    const newTotalInputAmount: any = Object.values(inputVal).reduce(
      (acc: any, val: any) => acc + (parseFloat(val) || 0),
      0
    );
    setTotalInputAmount(newTotalInputAmount);
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

  //for get total of column
  useEffect(() => {
    if (data && data.length > 0) {
      const initialTotal = {
        // NOTE_CNT: 0,
        AVAIL_NOTE: 0,
        TOTAL_AMNT: 0,
      };

      const newTotals = data.reduce((acc, item, index) => {
        let updatedAvailNote;
        if (availNote && availNote[index] !== undefined) {
          updatedAvailNote = availNote[index];
        } else {
          updatedAvailNote = parseFloat(data?.[index]?.AVAIL_NOTE);
        }
        let updatedBLNC;
        if (balance && balance[index] !== undefined) {
          updatedBLNC = balance[index];
        } else {
          updatedBLNC = parseFloat(data?.[index]?.TOTAL_AMNT);
        }
        return {
          // NOTE_CNT: acc.NOTE_CNT + parseFloat(item.NOTE_CNT),
          AVAIL_NOTE: acc.AVAIL_NOTE + parseFloat(updatedAvailNote),
          TOTAL_AMNT: acc.TOTAL_AMNT + parseFloat(updatedBLNC),
        };
      }, initialTotal);

      setDisplayTotal(newTotals);
    }
  }, [data, inputVal, handleChange]);

  const handleKeyPress = (event, index) => {
    if (event.key === "Enter") {
      updateTotalAmount(event, index);
    }
  };

  const getRefData = () => {
    setReferData(formComponentViewRef?.current);
  };
  useEffect(() => {
    if (
      referData !== undefined &&
      referData?.columnVal?.RECEIPT_PAYMENT &&
      parseFloat(referData?.columnVal?.RECEIPT_PAYMENT) > 0
    ) {
      let retdata = UpdateRequestDataVisibleColumn(referData?.columnVal, "");
      setRetData(retdata);
      setDisplayTable(true);
      manageOpenDenoYes();
    }
  }, [referData]);

  return (
    <>
      <Box padding={"0.5rem 1rem 0.5rem 1rem"}>
        <Box mb={1}>
          <Box
            height={"auto"}
            borderTop={"2px solid var(--theme-color6)"}
            borderRight={"2px solid var(--theme-color6)"}
            borderLeft={"2px solid var(--theme-color6)"}
            sx={{
              background: "var(--theme-color5)",
              borderTopRightRadius: "10px",
              borderTopLeftRadius: "10px",
              display: "flex",
              padding: "0 10px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                padding: "10px",
                fontWeight: "500",
                color: "#ffffff",
                width: "fit-content",
              }}
            >
              {`${DenominationScreenMetaData?.gridConfig?.title} -
              ${authState?.authState?.user?.name} - (${
                authState?.authState?.roleName
              }) - ${getCurrencySymbol(dynamicAmountSymbol)} 20000`}
            </Typography>
            <Box display={"flex"}>
              {/* <GradientButton sx={{ height: "2.5rem" }}>Save </GradientButton>*/}
              <GradientButton
                sx={{ height: "2.5rem" }}
                onClick={getRefData}
                endIcon={
                  getData.isLoading ? <CircularProgress size={20} /> : null
                }
              >
                Denomination
              </GradientButton>
              <GradientButton
                onClick={() => {
                  setIsDisableField(false);
                  setDisplayTable(false);
                }}
                sx={{ height: "2.5rem" }}
              >
                Reset
              </GradientButton>
            </Box>
          </Box>
          <FormComponentView
            key={"Denomination"}
            finalMetaData={DenominationScreenMetaData as FilterFormMetaType}
            onAction={ClickEventManage}
            loading={getData.isLoading || isDisableField}
            data={data ?? {}}
            propStyles={{
              titleStyle: {},
              toolbarStyles: {
                // background: "transparent !important",
              },
              IconButtonStyle: {},
              paperStyle: {
                backgroundColor: "white !important",
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px",
                boxShadow: "rgba(226, 236, 249, 0.5) 0px 11px 70px",
                border: "2px solid var(--theme-color6)",
                overflow: "hidden",
                "& .MuiGrid-root": {
                  marginBottom: "-10px",
                  "& .css-1br77t0-MuiGrid-root>.MuiGrid-item": {
                    paddingTop: "0px !important",
                    display: "none",
                  },
                },
                "& .ForwardRef(Button)-root-80": {
                  display: "none",
                },
              },
            }}
            ref={formComponentViewRef}
          ></FormComponentView>
        </Box>
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
                              onBlur={(event) =>
                                updateTotalAmount(event, index)
                              }
                              helperText={displayError[index] || ""}
                              type={"text"}
                              InputProps={{
                                style: { textAlign: "left" },
                              }}
                              tabIndex={index + 2}
                              sx={{ width: "-webkit-fill-available" }}
                              autoFocus={
                                displayTable && data && index === 0
                                  ? true
                                  : false
                              }
                            />
                          </StyledTableCell>
                          <StyledTableCell
                            align="right"
                            className="cellBordered"
                          >
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
                          <StyledTableCell
                            align="right"
                            className="cellBordered"
                          >
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

        {Boolean(openDeno) ? (
          <PopupMessageAPIWrapper
            MessageTitle="Denomination confirmation"
            Message="Are you sure to open denomination"
            onActionYes={() => manageOpenDenoYes()}
            onActionNo={() => manageOpenDenoNo()}
            rows={[]}
            open={openDeno}
            loading={getData.isLoading}
          />
        ) : null}

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
      </Box>
    </>
  );
};

export default CashReceiptEntry;
