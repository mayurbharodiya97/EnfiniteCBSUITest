import { makeStyles } from "@material-ui/core/styles";

export const useStylesBootstrapNav = makeStyles((theme) => ({
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

export const useStylesSideBar = makeStyles((theme) => ({
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
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    background: "var(--theme-color1)",
    "& svg": {
      color: theme.palette.primary.main,
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
    height: "calc(100vh - 71px)",
    overflowY: "auto",
    overflowX: "hidden",
    background: "var(--theme-color1)",
  },
  navLinksforseparateView: {
    height: "calc(100vh - 150px)",
    overflowY: "auto",
    overflowX: "hidden",
    background: "var(--theme-color1)",
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
    color: "white",
    fontWeight: 700,
    fontSize: "1.25rem",
  },
  link: {
    color: "white",
    fontSize: "1rem ",
    marginTop: "2px",
    marginBottom: "2px",
    textOverflow: "ellipsis",
    "& span": {
      fontWeight: 500,
    },
    "& p": {
      color: "white",
    },
  },
  linktext: {
    backgroundColor: "var(--theme-color1)",
    "&:hover": {
      "& div": {
        color: "var(--theme-color1) !important",
      },
      "& div > svg": {
        color: "var(--theme-color1) !important",
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
    backgroundColor: "var(--white)!important", //"var(--theme-color2)!important",
    "& > div": {
      color: "var(--theme-color1)",
    },
    "& svg": {
      color: theme.palette.secondary.main,
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
