import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

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
  tableBordered: {
    borderCollapse: "collapse",
  },
});
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "var(--theme-color3)",
    color: theme.palette.common.white,
    padding: "4px 10px",
  },
  [`&.${tableCellClasses.body}`]: {
    padding: "4px 10px",
    width: "174px",
    // Apply the animation styles to the .flipHorizontal class
    "& .flipHorizontal": {
      animation: "flipHorizontal 2s infinite",
      display: "inline-block",
      transformOrigin: "center",
    },
  },
  // Define the flipHorizontal keyframes animation
  "@keyframes flipHorizontal": {
    "0%": {
      transform: "scaleX(1)",
    },
    "50%": {
      transform: "scaleX(-1)",
    },
    "100%": {
      transform: "scaleX(1)",
    },
  },

  "& .cellBordered": {
    border: "1px solid #000", // Adjust border style and color as needed
    padding: "8px", // Optional: Add padding to cells for spacing
  },
}));

export { useStyles, StyledTableCell };

//for currency symbol animation//
