import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflowY: "auto",
  },
  container: {
    padding: theme.spacing(2),
    height: "100%",
    // height: `calc(100vh - 70px)`,
  },
}));
