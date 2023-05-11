import { makeStyles } from "@mui/styles";

const drawerWidth = 250;

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
    background: "var(--white)",
    justifyContent: "center",
    height: "100px",
    borderBottom: "1px solid #949597",
  },
  hrCSS: {
    zIndex: 9999,
  },
  logo: {
    height: "50px",
  },
  logo2: {
    height: "40px",
    paddingLeft: "30px",
    display: "block",
    margin: "auto",
  },
  version01: {
    margin: "0",
    textAlign: "center",
    color: "var(--theme-color3)",
  },
  version02: {
    margin: "5px 0 0 36px",
    fontSize: "11px",
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
  },
  DrawerClose_icon: {
    color: "var(--theme-color3)",

    background: "#efefef",
    "&:hover": {
      background: "var(--theme-color4)",
    },
    width: "30px",
    height: "30px",
    left: "0px",
    top: "51px",
    boxShadow:
      "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
  },
  menuButton: {
    // marginRight: 0,
    padding: 0,
    width: "30px",
    height: "30px",
    background: "#efefef",
    color: "var(--theme-color1)",
    "&:hover": {
      background: "var(--theme-color4)",
    },
    left: "-12px",
    top: "51px",
    boxShadow:
      "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
  },
  menuButtonHidden: {
    display: "none",
  },
}));

/*
  
*/
