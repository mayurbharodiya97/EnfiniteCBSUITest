import { Typography } from "@mui/material";
import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const typographyTitleStyle = {
  fontFamily: "Roboto, sans-serif",
  backgroundColor: "var(--theme-color4)",
  padding: "12px",
  color: "var(--theme-color1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "10px",
  textTransform: "capitalize",
  fontWeight: "bold",
  fontSize: "1.3rem",
  borderRadius: "10px",
  cursor: "pointer",
};

const Title = ({ handleBoxToggle, openBoxes, data, index }) => {
  return (
    <>
      <Typography
        onClick={() =>
          data?.displayType !== "none" ? handleBoxToggle(index) : null
        }
        variant="h5"
        sx={typographyTitleStyle}
        key={index}
      >
        {data?.title}
        {data?.displayType !== "none" &&
          (openBoxes[index] ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          ))}
      </Typography>
    </>
  );
};

export default Title;
