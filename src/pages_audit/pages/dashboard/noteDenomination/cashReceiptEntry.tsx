import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Dialog, Typography } from "@mui/material";
import * as API from "./api";
import { useQuery } from "react-query";
import { GradientButton } from "components/styledComponent/button";
import { TextField } from "components/styledComponent";
import { makeStyles } from "@mui/styles";
import { useContext, useEffect, useState } from "react";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { PopupRequestWrapper } from "components/custom/popupMessage";
import { AuthContext } from "pages_audit/auth";

const useStyles = makeStyles({
  root: {
    "& .MuiInputBase-root": {
      margin: "0px",
      border: "none",
      borderRadius: "none",
      width: "100%",
      "& .MuiInputBase-input": {
        padding: "0px 7px",
        height: "22px",
        textAlign: "right",
      },
    },
  },
  leftTextAlign: {
    "& .MuiInputBase-root": {
      margin: "0px",
      border: "none",
      borderRadius: "none",
      width: "100%",
      "& .MuiInputBase-input": {
        padding: "0px 7px",
        height: "22px",
        textAlign: "left",
      },
    },
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "var(--theme-color3)",
    color: theme.palette.common.white,
    padding: "4px 10px",
  },
  [`&.${tableCellClasses.body}`]: {
    padding: "4px 8px",
  },
}));

const CashReceiptEntry = ({ open, handleCloseDialog, props }) => {
  const [inputVal, setInputVal] = useState<any>({});
  const [displayError, setDisplayError] = useState<string[]>([]);
  const [multiplicationResult, setMultiplicationResult] = useState<any>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [confirmation, setConfirmation] = useState(false);
  const [forRemark, setForRemark] = useState();
  // const [displayTotal, setDisplayTotal] = useState<any>([]);
  const { authState } = useContext(AuthContext);

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

  const handleChange = (value, index) => {
    if (value.startsWith("-")) {
      value = "-" + value.replace(/[^0-9]/g, "");
    } else {
      value = value.replace(/[^0-9]/g, "");
    }
    // setInputVal(value);
    let updatedValue = { ...inputVal };
    updatedValue[index] = value;
    setInputVal(updatedValue);
    const multipliedValue = parseFloat(value) * parseFloat(data?.[index]?.NOTE);
    const updatedMultipliedValue = [...multiplicationResult];
    updatedMultipliedValue[index] = multipliedValue;
    setMultiplicationResult(updatedMultipliedValue);
  };

  const updateTotalAmount = (index) => {
    let sum = 0;
    multiplicationResult?.forEach((item) => {
      if (!isNaN(item)) {
        sum += parseFloat(item);
      }
    });
    const newDisplayErrors = [...displayError];
    if (
      multiplicationResult[index] < 0 &&
      Math.abs(multiplicationResult[index]) > data[index].TOTAL_AMNT
    ) {
      setTotalAmount((preValue) => {
        return preValue;
      });
      newDisplayErrors[
        index
      ] = `Denomination ${data?.[index]?.NOTE} should be less than or equal to Total Amount`;

      const updatedInputVal = { ...inputVal };
      updatedInputVal[index] = "";
      setInputVal(updatedInputVal);
      ////////
      setMultiplicationResult((preVal) => {
        const updatedRslt = [...preVal];
        updatedRslt[index] = "";
        return updatedRslt;
      });
    } else {
      newDisplayErrors[index] = "";
      setTotalAmount(sum);
    }

    setDisplayError(newDisplayErrors);
  };

  const upadatedFinalAmount: number = 10000 - totalAmount;

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

  return (
    <>
      <Dialog open={open} maxWidth="md" fullWidth={true} sx={{}}>
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
            Cash Receipt Entry ({authState?.roleName})
          </Typography>
          <GradientButton onClick={handleCloseDialog}>Close</GradientButton>
        </Box>
        {/* </Toolbar> */}
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
          {props?.map(
            (item, index) =>
              item?.value !== "" && (
                <Grid
                  // xs={3}
                  // sm={3}
                  // md={2}
                  // lg={2}
                  // xl={2}
                  sx={{
                    display: "flex",
                    // width: "-webkit-fill-available",
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
                      // Add other TextField props as needed
                    />
                  )}
                </Grid>
              )
          )}
        </Grid>
        <TableContainer
          sx={{
            margin: "6px 10px 0px 10px",
            width: "auto",
            maxHeight: "calc(100% - 52px)",
          }}
          component={Paper}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Denomination</StyledTableCell>
                <StyledTableCell align="left">Enter note count</StyledTableCell>
                <StyledTableCell align="right">Amount</StyledTableCell>
                <StyledTableCell align="right">
                  Available Note(s)
                </StyledTableCell>
                <StyledTableCell align="right">Balance</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      <TextField
                        classes={{ root: classes.leftTextAlign }}
                        value={row.NOTE}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell
                      align="left"
                      sx={{
                        borderRight: "1px solid var(--theme-color6)",
                        borderLeft: "1px solid var(--theme-color6)",
                        backgroundColor: "var(--theme-color4)",
                        maxWidth: "167px",
                      }}
                    >
                      <TextField
                        classes={{ root: classes.leftTextAlign }}
                        placeholder={"Enter value"}
                        value={inputVal[index] || ""}
                        onChange={(event) =>
                          handleChange(event.target.value, index)
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            updateTotalAmount(index);
                          }
                        }}
                        onBlur={() => updateTotalAmount(index)}
                        helperText={displayError[index] || ""}
                        type={"text"}
                        InputProps={{
                          style: { textAlign: "left" }, // Set the textAlign property
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {" "}
                      <TextField
                        classes={classes}
                        value={multiplicationResult[index] || "0.00"}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <TextField
                        classes={classes}
                        value={row.AVAIL_NOTE}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <TextField
                        classes={classes}
                        value={row.TOTAL_AMNT}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </StyledTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>{" "}
        <Box
          sx={{
            height: "auto",
            backgroundColor: "var(--theme-color4)",
            margin: "0px 10px 4px 10px",
            width: "auto",
          }}
          component={Paper}
        >
          {" "}
          <Typography
            variant="body1"
            sx={{
              backgroundColor: "var(--theme-color2)",
              padding: "3px 7px",
              borderBottom: "2px solid var(--theme-color1)",
              borderTop: "2px solid var(--theme-color1)",
              display: "flex",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>Total : </Typography>
            <Typography> {totalAmount}</Typography>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              backgroundColor: "var(--theme-color2)",
              padding: "3px 7px",
              borderBottom: "2px solid var(--theme-color1)",
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
        </Box>{" "}
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
