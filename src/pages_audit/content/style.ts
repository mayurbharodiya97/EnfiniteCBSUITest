import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: any) => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflowY: "auto",
    paddingTop: "24px",
    background: "rgba(250, 251, 255, 0.9)",
  },
  container: {
    // padding: theme.spacing(1),
    marginTop: "70px",
    height: "100%",
    display: "auto",
    // height: `calc(100vh - 109px)`,
  },
}));
