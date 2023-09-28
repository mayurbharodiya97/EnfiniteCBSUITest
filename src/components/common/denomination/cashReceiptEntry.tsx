import React, { useState, useEffect } from "react";
import {
  Box,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import HelpIcon from "@mui/icons-material/Help";

const useStyles = makeStyles({
  root: {
    "& .MuiInputBase-root": {
      margin: "0px",
      border: "none",
      borderRadius: "none",
    },
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "var(--theme-color3)",
    color: theme.palette.common.white,
    padding: "10px",
  },
  [`&.${tableCellClasses.body}`]: {
    padding: "8px",
  },
}));

const CashReceiptEntry = ({ open, handleCloseDialog }) => {
  const [inputVal, setInputVal] = useState<any>("");
  const [noteValue, setNoteValue] = useState<any>([]);
  const [multiplicationResult, setMultiplicationResult] = useState<any>([]);
  const [currentInputValue, setCurrentInputValue] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [textData, setTextData] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<any>(false);
  const classes = useStyles();
  const { data } = useQuery<any, any>(["CashReceiptEntrysData"], () =>
    API.CashReceiptEntrysData()
  );

  useEffect(() => {
    if (data && data.length > 0) {
      const notes = data.map((item: { NOTE: string }) => item.NOTE);
      setNoteValue(notes);
    }
  }, [data]);

  const handleChange = (value: string, index: number) => {
    // Update the current input value for the specific index
    const sanitizedValue = value.replace(/-/g, (match, offset) =>
      offset === 0 ? match : ""
    );
    const updatedCurrentInputValue = [...currentInputValue];
    updatedCurrentInputValue[index] = sanitizedValue;
    setCurrentInputValue(updatedCurrentInputValue);

    // Update the multiplication result for the specific index
    const multipliedValue =
      parseFloat(sanitizedValue) * parseFloat(noteValue[index]);
    const updatedMultipliedValue = [...multiplicationResult];
    updatedMultipliedValue[index] = isNaN(multipliedValue)
      ? ""
      : multipliedValue;
    setMultiplicationResult(updatedMultipliedValue);
  };

  const handleInputUpdate = (index: number) => {
    // Clear the current input value
    const updatedCurrentInputValue = [...currentInputValue];
    updatedCurrentInputValue[index] = ""; // Clear the input
    setCurrentInputValue(updatedCurrentInputValue);
  };

  const updateTotalAmount = () => {
    let sum = 0;
    multiplicationResult.forEach((result) => {
      if (!isNaN(result)) {
        sum += parseFloat(result);
      }
    });
    setTotalAmount(sum);
  };
  console.log(totalAmount, "totzamouz");

  const creditAmount: any = "10000";

  let finalAm: any = creditAmount - totalAmount;

  useEffect(() => {
    if (finalAm === 0) {
      setConfirm(true);
    } else {
      setConfirm(false); // Make sure to reset the state if finalAm is not 0
    }
  }, [creditAmount, totalAmount]);

  return (
    <>
      <Dialog open={open} maxWidth="md" fullWidth={true}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            background: "var(--theme-color5)",
            alignItems: "center",
            height: "54px",
            margin: "9px 9px 1px 9px",
            borderRadius: "4px",
            padding: "7px",
          }}
        >
          <Typography variant="h5" color="#FFFFFF" sx={{ fontWeight: "bold" }}>
            Note Denomination Screen
          </Typography>
          <GradientButton onClick={handleCloseDialog}>Close</GradientButton>
        </Box>

        <TableContainer
          sx={{
            margin: "10px",
            width: "auto",
          }}
          component={Paper}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Note</StyledTableCell>
                <StyledTableCell align="left">Enter note count</StyledTableCell>
                <StyledTableCell align="left">Amount</StyledTableCell>
                <StyledTableCell align="left">Available Note</StyledTableCell>
                <StyledTableCell align="left">Total Amount</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row, index) => (
                <TableRow key={index}>
                  <StyledTableCell component="th" scope="row">
                    <TextField classes={classes} value={row.NOTE} />
                  </StyledTableCell>
                  <StyledTableCell
                    align="left"
                    sx={{
                      borderRight: "1px solid var(--theme-color6)",
                      borderLeft: "1px solid var(--theme-color6)",
                      backgroundColor: "var(--theme-color4)",
                    }}
                  >
                    <TextField
                      classes={classes}
                      placeholder={"Enter value"}
                      value={currentInputValue[index] || ""}
                      onChange={(event: any) => {
                        if (
                          typeof event.target.value !== "number" &&
                          event.target.value.length > 1
                        ) {
                          return;
                        }
                        handleChange(event.target.value, index);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleInputUpdate(index);
                          updateTotalAmount();
                          setTextData(true);
                        }
                      }}
                      onBlur={() => {
                        handleInputUpdate(index);
                        updateTotalAmount();
                        setTextData(true);
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <TextField
                      classes={classes}
                      value={multiplicationResult[index] || ""}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <TextField classes={classes} value={row.AVAIL_NOTE} />
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <TextField classes={classes} value={row.TOTAL_AMNT} />
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ height: "120px", backgroundColor: "lightpink" }}>
          HIIII
          <Typography>Total : {totalAmount}</Typography>
          <Typography>
            {finalAm >= 0 ? "Remaining" : "Excess"} : {finalAm}
          </Typography>
        </Box>
        {Boolean(confirm) ? (
          <Dialog
            // fullScreen={fullScreen}
            open={open}
            // onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle
              sx={{
                background: "var(--theme-color3)",
                color: "var(--theme-color2)",
                letterSpacing: "1.3px",
                margin: "10px",
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
                fontWeight: 500,
                borderRadius: "inherit",
                minWidth: "450px",
                py: 1,
              }}
              id="responsive-dialog-title"
            >
              {"Confirmation"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ fontSize: "19px", display: "flex" }}>
                All Transaction are Completed Want to Proceed
                <HelpIcon color="secondary" fontSize="medium" />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <GradientButton
                // sx={{
                //   color: "var(--theme-color2)",
                // }}
                autoFocus
                onClick={() => setConfirm(false)}
              >
                No
              </GradientButton>
              <GradientButton
                // sx={{
                //   color: "var(--theme-color2)",
                // }}
                onClick={() => console.log("submitted")}
                autoFocus
              >
                Yes
              </GradientButton>
            </DialogActions>
          </Dialog>
        ) : null}
      </Dialog>
    </>
  );
};

export default CashReceiptEntry;
