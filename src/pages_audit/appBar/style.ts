import { makeStyles } from "@material-ui/core/styles";
import { alpha } from "@material-ui/core/styles/colorManipulator";

const drawerWidth = 250;

export const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: "var(--white)",
    color: "#0063A3",
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolbar: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    minHeight: "70px",
    height: "70px",
  },
  menuButton: {
    marginRight: 0,
    //background: "var(--theme-color2)",
    color: "var(--theme-color1)",
    "&:hover": {
      background: "var(--theme-color2)",
    },
  },
  menuButtonHidden: {
    display: "none",
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
}));
