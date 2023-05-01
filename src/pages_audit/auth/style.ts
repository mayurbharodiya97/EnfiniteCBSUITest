import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: any) => ({
  wrapper: {
    minHeight: "100vh",
    boxShadow: "0 3px 6px rgba(0,0,0,0.03)",
    [theme.breakpoints.down("sm")]: {
      minHeight: "100vh",
    },
    background: "var(--theme-color2)",
  },
  loginEmp: {
    background: "#fff",
    padding: theme.spacing(2, 4),
    display: "flex",
    maxWidth: "400px",
    margin: "auto",
    boxShadow: "0 0 20px rgba(0,0,0,0.06)",
    borderRadius: "8px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  formWrap: {
    marginTop: theme.spacing(2),
  },
  loginBtn: {
    minWidth: "100% !important",
    margin: theme.spacing(2, 0),
    fontSize: "1rem",
    padding: "10px .75rem",
    background: "rgb(128,0,0)",
    border: 0,
    color: "#fff !important",
    fontWeight: 600,
    letterSpacing: "0.02857em",
    boxShadow: "none",
    textTransform: "capitalize",
    alignSelf: "flex-end",
    "&:hover": {
      background: "#fedad8",
      boxShadow: "none",
    },
  },
  OTPTimer: {
    marginTop: "10px",
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  resendLink: {
    marginTop: "10px",
    cursor: "pointer",
    color: theme.palette.secondary.main,
    fontWeight: 600,
    fontSize: "0.875 rem",
  },
  logo: {
    marginBottom: theme.spacing(1),
  },
  loginLeft: {
    display: "flex",
    justifyContent: "center",
    padding: "2rem",
    // background: "var(--theme-color2)",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  loginRight: {
    background: "#fff",
    padding: theme.spacing(2, 4),
    display: "flex",
    maxWidth: "400px",
    margin: "auto",
    boxShadow: "0 0 20px rgba(0,0,0,0.06)",
    borderRadius: "8px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    "& img": {
      alignSelf: "center",
    },
  },
  loginImg: {
    // maxHeight: "40vh",
  },
  verifybutton: {
    alignSelf: "center",
    marginBottom: "10px",
    marginTop: "10px",
  },
  divflex: {
    display: "flex",
  },
  otpinputpadding: {
    "& input": {
      marginRight: "8px !important",
    },
  },
  ibtnvisible: {
    padding: "7px !important",
  },
  btnvisibleoff: {
    display: "none",
  },
  resendOTPalign: {
    textAlign: "center",
    marginTop: "15px",
    display: "block !important",
  },
  resendbtnLink: {
    textDecoration: "underline",
    color: "blue",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
      color: "blue",
    },
  },
  dialogTitleClass: {
    background: "var(--theme-color1)",
    padding: "8px 15px !important",

    "& h2": {
      color: "white",
      fontWeight: "500 !important",
    },
  },
}));
