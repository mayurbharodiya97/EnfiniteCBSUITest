import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  Box,
} from "@mui/material";
import { useStyles, StyledTableCell } from "./style";
import {
  TextField,
  usePropertiesConfigContext,
  formatCurrency,
  getCurrencySymbol,
} from "@acuteinfo/common-base";
import { CashierExchangeTableProps } from "./type";
const CashierExchangeTable = forwardRef<any, CashierExchangeTableProps>(
  (
    {
      data,
      metadata,
      TableLabel,
      hideHeader = false,
      ignoreMinusValue = false,
      showFooter = true,
      tableState,
      onFooterUpdate,
    },
    ref
  ) => {
    const customParameter = usePropertiesConfigContext();
    const [apiData, setApiData] = useState(data || []);
    const [inputData, setInputData] = useState({});
    const { dynamicAmountSymbol, currencyFormat, decimalCount } =
      customParameter;
    const classes = useStyles();
    const inputRefs = useRef({});
    useEffect(() => {
      if (onFooterUpdate) {
        const totals = calculateColumnTotalsforRemain();
        onFooterUpdate(totals);
      }
    }, [apiData, inputData]);
    const handleInputChange = async (event, rowIndex, fieldName) => {
      const newValue = event?.target?.value;
      const totals = calculateColumnTotalsforRemain();
      const rowData = apiData[rowIndex];
      const setDependentValue = (targetFieldName, value) => {
        setInputData((prev) => ({
          ...prev,
          [rowIndex]: {
            ...prev[rowIndex],
            [targetFieldName]: value,
          },
        }));
        setApiData((prevData) => {
          const updatedData = [...prevData];
          updatedData[rowIndex][targetFieldName] = value;
          return updatedData;
        });
      };
      const fieldMetadata = metadata?.fields.find(
        (field) => field.name === fieldName
      );
      if (fieldMetadata?.onChange && fieldMetadata.dependentValue) {
        const dependentValues = fieldMetadata.dependentValue?.map(
          (depFieldName) => rowData[depFieldName]
        );
        await fieldMetadata?.onChange(
          newValue,
          totals,
          dependentValues,
          setDependentValue
        );
      }
      setInputData((prev) => ({
        ...prev,
        [rowIndex]: {
          ...prev[rowIndex],
          [fieldName]: newValue,
        },
      }));
    };
    const handleFieldBlur = async (rowIndex, fieldName) => {
      const currentFieldValue = inputData[rowIndex]?.[fieldName];
      const rowData = apiData[rowIndex];
      const fieldMetadata = metadata?.fields.find(
        (field) => field.name === fieldName
      );
      if (
        currentFieldValue === undefined ||
        currentFieldValue === rowData[fieldName]
      ) {
        return;
      }
      const setDependentValue = (targetFieldName, value) => {
        setInputData((prev) => ({
          ...prev,
          [rowIndex]: {
            ...prev[rowIndex],
            [targetFieldName]: value,
          },
        }));
        setApiData((prevData) => {
          const updatedData = [...prevData];
          updatedData[rowIndex][targetFieldName] = value;
          return updatedData;
        });
      };

      if (fieldMetadata?.validation && fieldMetadata.dependentValue) {
        const dependentValues = fieldMetadata.dependentValue?.map(
          (depFieldName) => rowData[depFieldName]
        );
        await fieldMetadata.validation(
          currentFieldValue,
          rowData,
          dependentValues,
          setDependentValue,
          tableState
        );
      }

      setApiData((prevData) => {
        const updatedData = [...prevData];
        updatedData[rowIndex][fieldName] = currentFieldValue;
        return updatedData;
      });
    };
    const functionFn = () => {
      const updatedRows = apiData
        ?.map((row, index) => ({
          ...row,
          ...inputData[index],
        }))
        .filter((_, index) => {
          const input = inputData[index];
          return (
            input &&
            !Object.values(input).some(
              (value) => value === null || value === ""
            )
          );
        });
      const finalData = {
        tableData: updatedRows,
        tableDisplayData: apiData,
        tablefooter: calculateColumnTotals(),
      };
      return finalData;
    };

    useImperativeHandle(ref, () => ({
      saveData: functionFn,
      getFooterTotals: calculateColumnTotalsforRemain,
    }));
    const calculateColumnTotals = () => {
      return metadata?.fields.reduce((totals, field) => {
        if (field.isCalculation) {
          totals[field.name] = apiData.reduce((sum, row) => {
            const value = parseFloat(row[field.name]) || 0;
            return sum + value;
          }, 0);
        }
        return totals;
      }, {});
    };

    const calculateColumnTotalsforRemain = () => {
      return metadata?.fields.reduce((totals, field) => {
        if (field.isCalculation) {
          totals[field.name] = apiData.reduce((sum, row) => {
            const value = parseFloat(row[field.name]) || 0;
            return sum - value;
          }, 0);
        }
        return totals;
      }, {});
    };
    const total = calculateColumnTotals();
    const remaining: any = calculateColumnTotalsforRemain();
    const remainingValue = parseFloat(remaining?.DENO_AMOUNT);
    const label = remainingValue < 0 ? "Excess: " : "Remaining: ";
    return (
      <Box>
        <Paper
          sx={{
            boxShadow: "none",
            borderRadius: "0px",
            margin: "0 10px",
            paddingBottom: "6px",
          }}
        >
          {apiData.length > 0 && (
            <>
              {!hideHeader && apiData.length > 0 && (
                <AppBar
                  position="static"
                  sx={{
                    background: "var(--theme-color5)",
                    margin: "10px",
                    width: "auto",
                  }}
                >
                  <Toolbar>
                    <Typography
                      variant="h6"
                      sx={{
                        flexGrow: 1,
                        fontWeight: 700,
                        color: "var(--theme-color2)",
                        fontSize: "1rem",
                      }}
                    >
                      {TableLabel}
                    </Typography>
                  </Toolbar>
                </AppBar>
              )}
              <TableContainer
                sx={{ maxHeight: "calc(90vh - 200px)", overflow: "auto" }}
                component={Paper}
              >
                <Table
                  sx={{ minWidth: "350px" }}
                  aria-label="simple table"
                  className={classes.tableBordered}
                >
                  <TableHead>
                    <TableRow
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "var(--theme-color4)",
                        border: "none",
                        zIndex: 999,
                      }}
                    >
                      {metadata?.fields?.map((meta, index) => (
                        <StyledTableCell
                          key={`${meta?.name}-${index}`}
                          align="center"
                        >
                          {meta?.label}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {apiData?.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {metadata?.fields?.map((meta, colIndex) => {
                          const isEditable = !meta?.isReadOnly;
                          let value = row[meta?.name];
                          const displayValue = meta?.isCurrency
                            ? formatCurrency(
                                parseFloat(value || "0"),
                                getCurrencySymbol(dynamicAmountSymbol),
                                currencyFormat,
                                decimalCount
                              )
                            : value;
                          return (
                            <StyledTableCell
                              key={colIndex}
                              align={meta?.align}
                              style={{
                                background: !isEditable ? "#e9ecef" : undefined,
                              }}
                            >
                              {isEditable ? (
                                <TextField
                                  variant="standard"
                                  fullWidth
                                  value={
                                    inputData[rowIndex]?.[meta?.name] ?? value
                                  }
                                  autoComplete="off"
                                  placeholder="Enter value"
                                  InputProps={{
                                    readOnly: !isEditable,
                                    disableUnderline: true,
                                  }}
                                  onChange={(e) =>
                                    isEditable &&
                                    handleInputChange(e, rowIndex, meta?.name)
                                  }
                                  onBlur={() =>
                                    handleFieldBlur(rowIndex, meta?.name)
                                  }
                                  classes={{ root: classes.leftTextAlign }}
                                  inputRef={(el) =>
                                    (inputRefs.current[
                                      `${rowIndex}-${meta?.name}`
                                    ] = el)
                                  }
                                  onKeyPress={(event) => {
                                    const keyCode =
                                      event.keyCode || event.which;
                                    const keyValue =
                                      String.fromCharCode(keyCode);
                                    if (
                                      !ignoreMinusValue &&
                                      /^[0-9-]$/.test(keyValue)
                                    ) {
                                      return;
                                    }
                                    if (ignoreMinusValue && keyValue === "-") {
                                      event.preventDefault();
                                    }
                                    if (!/^[0-9-]$/.test(keyValue)) {
                                      event.preventDefault();
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
                  <TableBody
                    style={{
                      position: "sticky",
                      bottom: 0,
                      background: "var(--theme-color4)",
                      border: "none",
                    }}
                  >
                    <TableRow>
                      {metadata?.fields?.map((meta, index) => (
                        <StyledTableCell
                          key={`${meta?.name}-${index}`}
                          align={meta?.align}
                        >
                          {meta?.isCalculation ? (
                            <Typography sx={{ fontWeight: "bold" }}>
                              {meta?.isTotalWord
                                ? "Total: "
                                : meta?.isCurrency
                                ? formatCurrency(
                                    parseFloat(total[meta?.name] || 0),
                                    getCurrencySymbol(dynamicAmountSymbol),
                                    currencyFormat,
                                    decimalCount
                                  )
                                : total[meta?.name] || 0}
                            </Typography>
                          ) : null}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      {metadata?.fields?.map((meta, index) => (
                        <StyledTableCell
                          key={`${meta?.name}-${index}`}
                          align={meta?.isCurrency ? "right" : "left"}
                        >
                          {meta?.isExcess ? (
                            <Typography sx={{ fontWeight: "bold" }}>
                              {meta?.isTotalWord
                                ? label
                                : meta?.isExcess
                                ? formatCurrency(
                                    parseFloat(remaining[meta?.name] || 0),
                                    getCurrencySymbol(dynamicAmountSymbol),
                                    currencyFormat,
                                    decimalCount
                                  )
                                : remaining[meta?.name] || 0}
                            </Typography>
                          ) : null}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Paper>
      </Box>
    );
  }
);
export default CashierExchangeTable;
