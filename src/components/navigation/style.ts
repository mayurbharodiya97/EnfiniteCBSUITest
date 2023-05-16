// import { createTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
// const theme = createTheme();

export const useStylesBootstrapNav = makeStyles((theme: any) => ({
  navBarCSS: {
    padding: "4px 1rem ",
    backgroundColor: "#fff !important",
    minHeight: "64px",
    boxShadow: "0 3px 6px rgba(0,0,0,0.03)",
  },
  headerDropdown: {
    backgroundColor: "#fff",
    minWidth: "205px",
    boxShadow: "0 3px 6px rgba(0,0,0,0.16)",
    borderBottom: "3px solid  #26A456",
    marginTop: "0px",
  },
  navLinkHeader: {
    color: "#555",
    fontSize: "14px",
    lineHeight: "1.2",
    paddingTop: "4px",
    paddingBottom: "4px",
    paddingRight: ".5rem",
    paddingLeft: ".5rem",
    fontWeight: 600,
    textTransform: "capitalize",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",

    "& hover": {
      color: "#0b6fb8",
    },
  },
  productLink: {
    color: "#555",
    padding: "0 1rem 8px 1rem",
    display: "inline-block",
    verticalAlign: "middle",
    cursor: "pointer",
    textTransform: "capitalize",
  },
  font13: {
    fontSize: "13px",
  },
  loginDropdown: {
    width: "160px",
  },
}));

export const useStylesSideBar = makeStyles((theme: any) => ({
  root: {
    justifyContent: "left",
  },
  drawer: {
    paddingTop: "70px",
    width: "240px",
  },
  item: {
    display: "flex",
    borderBottom: "1px solid #ddd",
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(2),
    background: "var(--theme-color2)",
    "& svg": {
      // color: theme.palette.primary.main,
      color: "var(--theme-color6)",
    },
  },
  button: {
    color: "#0063A3",
    padding: "10px 8px",
    justifyContent: "flex-start",
    textTransform: "none",
    letterSpacing: 0,
    width: "100%",
    textAlign: "left",
  },
  btnRoot: {
    paddingLeft: "24px",
    justifyContent: "left ",
  },
  navLinks: {
    overflowY: "auto",
    overflowX: "hidden",
    height: "calc(100vh - 170px)",
    background: "var(--theme-color2)",
    marginTop: "25px",
  },
  navLinksforseparateView: {
    overflowY: "auto",
    overflowX: "hidden",
    height: "calc(100vh - 194px)",
  },
  nestedMenuLevel1: {
    paddingLeft: "20px",
    paddingRight: theme.spacing(3),
    fontSize: "13px",
    "& div > svg": {
      fontSize: "14px",
    },
  },
  nestedMenuLevel2: {
    paddingLeft: "24px",
    fontSize: "12px",
    "& div > svg": {
      fontSize: "9px",
    },
  },
  listIcon: {
    minWidth: "32px !important",
    color: "var(--theme-color6)",
    fontWeight: 700,
    fontSize: "1.75rem",
  },
  link: {
    fontSize: "1rem ",
    marginTop: "2px",
    marginBottom: "2px",
    textOverflow: "ellipsis",
    color: "var(--theme-color6)",
    marginLeft: "15px",
    "& span": {
      fontWeight: 500,
    },
    "& p": {
      color: "white",
    },
  },
  linktext: {
    backgroundColor: "var(--theme-color2)",
    "&:hover": {
      background: "var(--theme-color1)",
      "& div": {
        color: "var(--theme-color2) !important",
      },
      "& div > svg": {
        color: "var(--theme-color2) !important",
      },
    },
  },
  faSmall: {
    fontSize: "13px ",
  },
  openList: {
    ":not(activeMenuItem)": {
      "& > div": {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
      },
      "&  *": {
        color: "var(--theme-color2)",
      },
    },
  },
  openCurrent: {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    "&  *": {
      color: "var(--theme-color2)",
    },
  },
  slimList: {
    paddingTop: "4px",
    paddingBottom: "4px",
  },
  activeMenuItem: {
    backgroundColor: "var(--theme-color2)!important", //"var(--theme-color2)!important",
    "& > div": {
      color: "var(--theme-color3)",
    },
    "& svg": {
      color: "var(--theme-color1)",
    },
    "& hover": {
      "& > div": {
        color: "var(--theme-color1)",
      },
    },
    "& p": {
      color: "var(--theme-color1)",
    },
  },
}));
