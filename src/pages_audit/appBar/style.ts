import { alpha } from "@mui/material";
import { makeStyles } from "@mui/styles";

const drawerWidth = 250;

export const useStyles = makeStyles((theme: any) => ({
  appBar: {
    // zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    // backgroundColor: "var(--theme-color2)",
    color: "#0063A3",
    height: "88px",
    background: "rgba(250, 251, 255, 0.9)",
    borderBottom: "1px solid #949597",
    // boxShadow: "0px 1px 0px -0.5px #DEE0E2",
    paddingLeft: "70px",
  },
  appBarShift: {
    paddingLeft: "0px",
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  heading_user_dtl: {
    width: "458px",
    height: "73px",
    left: "37px",
    top: "calc(50% - 73px/2)",
  },
  heading_user_img: {
    width: "45px",
    height: "45px",
  },
  heading_user_img_border: {
    border: "2px dashed #4263C7",
    borderRadius: "50%",
    padding: "4px",
  },
  toolbar: {
    minHeight: "88px",
    paddingLeft: "0px",
    height: "88px",
  },
  title: {
    flexGrow: 1,
    padding: theme.spacing(0.5, 0),
    color: "var(--theme-color1)",
  },
  searchRoot: {
    fontFamily: theme.typography.fontFamily,
    position: "relative",
    boxShadow:
      "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(0.25),
    marginTop: theme.spacing(0.25),
    borderRadius: 40,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    "& $inputInput": {
      transition: theme.transitions.create("width"),
      width: 120,
      "&:focus": {
        width: 170,
      },
    },
  },
  search: {
    width: theme.spacing(6),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    marginTop: 0,
    borderRadius: "40px",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 6),
  },

  loggedInUser: {
    marginLeft: theme.spacing(2),
  },
  nameClass: {
    color: "#0063A3",
    fontWeight: 600,
    textTransform: "capitalize",
    lineHeight: "1.4",
    textAlign: "left",
  },
  dropDown: {
    fontSize: "2rem",
  },
  vTop: {
    verticalAlign: "top",
    paddingLeft: "4px",
    color: "var(--theme-color1)",
  },
  logo: {
    height: "50px",
    marginRight: theme.spacing(2),
    display: "block",
  },
  userDesignation: {
    margin: "0px",
    fontWeight: 500,
    fontSize: "0.875rem",
    lineHeight: 1.57,
    color: "var(--theme-color1)",
  },
  userName: {
    margin: "0px",
    fontWeight: 500,
    fontSize: "0.875rem",
    lineHeight: 1.57,
    color: "var(--theme-color3)",
  },
  userprofilehover: {
    "&:hover": {
      backgroundColor: "var(--theme-color2)",
    },
  },
  lang_svg: {
    marginRight: "10px",
    width: "19px",
    height: "19px",
  },
}));
