import { TextField } from "@mui/material";

import { withStyles } from "@mui/styles";
const StyledTextField = withStyles({
  root: {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .MuiInputBase-root:before": {
      borderBottom: "none",
    },

    "& .MuiInputLabel-formControl": {
      //color: "#736f6f",
      fontWeight: 600,
      textTransform: "capitalize",
      fontSize: "1rem",
      whiteSpace: "normal",
      lineHeight: "0.95",
      "@media (max-width: 1200px)": {
        fontSize: "0.75rem",
      },
      "@media (max-width: 1440px)": {
        fontSize: "0.875rem",
      },
    },
    "& .MuiInputLabel-shrink": {
      transform: "translate(0, 1.5px) scale(1)",
    },
    "& label.Mui-focused": {
      //color: "#26A456",
      color: "var(--theme-color1)",
    },

    "& .MuiInputBase-root": {
      border: "1px solid #BABABA",
      marginTop: "26px",
      borderRadius: 5,
      backgroundColor: "#fff",
      paddingTop: "0",
      paddingBottom: "0",
      "@media (max-width: 1200px)": {
        fontSize: "0.875rem",
      },

      "& input": {
        padding: "6px 7px ",
        height: "22px",
        inputMode: "auto", // Use "auto" or remove this line to enable browser default behavior
        "&::placeholder": {
          //color: "#000",
          //fontSize: "0.875rem",
        },
        "@media (max-width: 1200px)": {
          height: "18px",
        },
      },

      "& inputMultiline": {
        padding: "6px 7px",
      },

      "& .MuiInputBase-input": {
        padding: "6px 7px",
      },
    },
    "& .MuiFormHelperText-root": {
      marginLeft: "3px",
      color: "#f44336",
    },
    "& .MuiInput-underline:before": {
      borderBottom: "0",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "3px solid var(--theme-color1)",
      transition: "transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
    },
    "&:hover .MuiInput-underline:before": {
      //borderBottom: "0 !important",
      borderBottom: "0",
    },

    "& .MuiInputAdornment-positionStart": {
      //borderRight: "1px solid #BABABA !important",
      borderRight: "2px dashed #BABABA",
      height: "23px",
      maxHeight: "36px",
      padding: "0 0.6rem 0 0.6rem",
      margin: "6px 0px !important",
    },

    "& .MuiSelect-selectMenu": {
      minHeight: "22px",
      lineHeight: "22px",
      "@media (max-width: 1200px)": {
        minHeight: "18px",
        lineHeight: "18px",
      },
    },
  },
})(TextField);

/*
const StyledTextField = withStyles({
  root: {
    "& .MuiInputLabel-formControl": {
      //color: "#736f6f",
      fontWeight: 600,
      textTransform: "capitalize",
      fontSize: "1rem",
      "@media (max-width: 1200px)": {
        fontSize: "0.75rem",
      },
      "@media (max-width: 1440px)": {
        fontSize: "0.875rem",
      },
    },
    "& .MuiInputLabel-shrink": {
      transform: "translate(0, 1.5px) scale(1)",
    },
    "& label.Mui-focused": {
      //color: "#26A456",
      color: "var(--theme-color1)",
    },

    "& .MuiInputBase-root": {
      // border: "1px solid #BABABA",
      marginTop: "26px",
      // borderRadius: 5,
      // backgroundColor: "#fff",
      // background: "var(--theme-color2)",
      background: "rgba(235, 237, 238, 0.2)",
      borderRadius: "10px",
      border: "0.929198px solid #EBEDEE",
      "@media (max-width: 1200px)": {
        fontSize: "0.875rem",
      },

      "& input": {
        padding: "6px 7px ",
        height: "22px",
        //color: "#000",
        "&::placeholder": {
          //color: "#000",
          //fontSize: "0.875rem",
        },
        "@media (max-width: 1200px)": {
          height: "18px",
        },
      },

      "& inputMultiline": {
        padding: "6px 7px",
      },

      "& .MuiInputBase-input": {
        padding: "6px 7px",
      },
    },

    "& .MuiInput-underline:before": {
      borderBottom: "0",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "3px solid var(--theme-color3)",
      transition: "transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
    },
    "&:hover .MuiInput-underline:before": {
      //borderBottom: "0 !important",
      borderBottom: "0",
    },

    "& .MuiInputAdornment-positionStart": {
      //borderRight: "1px solid #BABABA !important",
      borderRight: "1px solid #BABABA",
      height: "36px",
      maxHeight: "36px",
      padding: "0 1rem",
    },

    "& .MuiSelect-selectMenu": {
      minHeight: "22px",
      lineHeight: "22px",
      "@media (max-width: 1200px)": {
        minHeight: "18px",
        lineHeight: "18px",
      },
    },
  },
})(TextField);*/

export default StyledTextField;
