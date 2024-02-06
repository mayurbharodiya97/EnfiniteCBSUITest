// import { makeStyles } from "@mui/styles";
// export const useStyles = makeStyles((theme: any) => ({
//   arrayRowContainer: {
//     position: "relative",
//     boxShadow: theme.shadows[3],
//     marginBottom: theme.spacing(2),
//   },
//   arrayRowRemoveBtn: {
//     position: "absolute",
//     top: -22,
//     right: -22,
//     color: "#f50057",
//   },
//   arrayRowCard: {
//     width: "100%",
//     position: "relative",
//     overflow: "auto",
//   },
//   arrayRowCardContent: {
//     paddingLeft: "32px",
//   },
//   arrayRowCount: {
//     display: "flex",
//     width: "100%",
//     margin: "0 0 16px -8px",
//   },
// }));

import { makeStyles } from "@mui/styles";
export const useStyles = makeStyles((theme: any) => ({
  arrayRowContainer: {
    position: "relative",
    boxShadow: theme.shadows[3],
    marginBottom: theme.spacing(2),
  },
  arrayScreenRowContainer: {
    position: "relative",
    boxShadow: theme.shadows[3],
    // marginBottom: "10px",
    marginBottom: theme.spacing(2),
    // marginBottom: theme.spacing(3.5),
  },

  newArrayRowContainer: {
    position: "relative",
    boxShadow: "",
    marginBottom: "0",
    // top: "-30px",
    "& .MuiInputBase-root": {
      marginTop: "0px",
      // border: "none",
    },
    "& .css-1qlanbt-MuiInputBase-root-MuiFilledInput-root": {
      "&:after": {
        borderBottom: "none",
      },
      "&:hover": {
        "&:before": {
          borderBottom: "none",
        },
      },
    },
    "& .MuiGrid-item": {
      // marginTop: "-30px",
      // borderBottom: "1px solid var(--theme-color6)",
      // borderLeft: "1px solid var(--theme-color6)",
      // borderRight: "1px solid var(--theme-color6)",
      // outline: "1px solid var(--theme-color6)",
    },

    // .css-1qlanbt-MuiInputBase-root-MuiFilledInput-root:hover:not(.Mui-disabled, .Mui-error):before
  },
  newSecondArrayRowContainer: {
    position: "relative",
    boxShadow: "",
    marginBottom: "0",
    // "& .MuiInputBase-root": {
    //   border: "none",
    // },
    "& .css-1qlanbt-MuiInputBase-root-MuiFilledInput-root": {
      "&:after": {
        borderBottom: "none",
      },
      "&:hover": {
        "&:before": {
          borderBottom: "none",
        },
      },
    },
    // "& .MuiGrid-item": {
    //   borderBottom: "1px solid var(--theme-color6)",
    //   borderLeft: "1px solid var(--theme-color6)",
    //   borderRight: "1px solid var(--theme-color6)",
    //   borderTop: "1px solid var(--theme-color6)",
    //   // outline: "1px solid var(--theme-color6)",
    // },
  },
  arrayRowRemoveBtn: {
    position: "absolute",
    top: -22,
    right: -22,
    color: "#f50057",
  },
  arrayRowCard: {
    width: "100%",
    position: "relative",
    // overflow: "auto",
  },
  arrayRowCardContent: {
    paddingLeft: "32px",
  },
  arrayRowCount: {
    display: "flex",
    width: "100%",
    margin: "8px 0 16px -8px",
  },
  arrayRowCountCustomStyle: {
    display: "flex",
    width: "100%",
    margin: "2px 0 0px -8px",
  },
  arrayRowCountFixedRows: {
    display: "flex",
    width: "100%",
    margin: "2px 0 6px -8px",
  },
  arrayScreenRowCount: {
    display: "flex",
    width: "100%",
    margin: "2px 0 12px 0px",
  },
  newArrayRowCardContent: {
    paddingLeft: "32px",
    "& .MuiInputBase-root": {
      marginTop: "0px",
    },
  },
}));
