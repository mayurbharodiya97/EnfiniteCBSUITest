import { makeStyles } from "@mui/styles";

const drawerWidth = 227;

export const useStyles = makeStyles((theme: any) => ({
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    border: "none",
    overflow: "hidden",
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    // width: theme.spacing(6),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    zIndex: 9999,
    ...theme.mixins.toolbar,
    background: "var(--theme-color2)",
    justifyContent: "center",
    height: "80px",
    borderBottom: "1px dashed #949597",
  },
  hrCSS: {
    zIndex: 9999,
  },
  logo: {
    height: "36px",
  },
  logo2: {
    height: "33px",
    paddingLeft: "19px",
    display: "block",
    margin: "auto",
  },
  version01: {
    margin: "0",
    textAlign: "center",
    color: "var(--theme-color3)",
    fontSize: "9px",
  },
  version02: {
    margin: "3px 0 0 26px",
    fontSize: "9px",
    textAlign: "end",
    color: "var(--theme-color3)",
  },
  buttonLink: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    display: "inline",
    margin: 0,
    padding: 0,
    "&:focus": {
      textDecoration: "none",
    },
    "$:hover": {
      textDecoration: "none",
    },
  },
  chevronIcon: {
    width: "38px",
    height: "38px",
    color: "black",
  },
  DrawerClose_icon: {
    color: "var(--theme-color3)",

    background: "#efefef",
    "&:hover": {
      background: "var(--theme-color4)",
    },
    width: "25px",

    height: "25px",
    left: "26px",
    top: "39px",
    boxShadow:
      "rgba(0, 0, 0, 0.16) 0px 3px 4px, rgba(0, 0, 0, 0.23) 0px 3px 20px",
  },
  menuButton: {
    // marginRight: 0,
    padding: 0,
    width: "25px",
    height: "25px",
    background: "#efefef",
    color: "var(--theme-color1)",
    "&:hover": {
      background: "var(--theme-color4)",
    },
    left: "-6px",
    top: "39px",
    boxShadow:
      "rgba(0, 0, 0, 0.16) 0px 3px 4px, rgba(0, 0, 0, 0.23) 0px 3px 20px",
  },
  menuButtonHidden: {
    display: "none",
  },
}));

/*
  
*/
