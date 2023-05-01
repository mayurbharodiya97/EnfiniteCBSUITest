import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardHeader: {
      padding: theme.spacing(1, 2),
    },
    list: {
      width: 200,
      height: 230,
      backgroundColor: theme.palette.background.paper,
      overflow: "auto",
    },
    button: {
      margin: theme.spacing(0.5, 0),
    },
  })
);
