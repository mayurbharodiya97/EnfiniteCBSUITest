import { makeStyles } from "@mui/styles";
export const useStyles = makeStyles((theme: any) => ({
  arrayRowContainer: {
    position: "relative",
    boxShadow: theme.shadows[3],
    marginBottom: theme.spacing(2),
  },
  arrayRowRemoveBtn: {
    position: "absolute",
    top: -22,
    right: -22,
    color: "#f50057",
  },
  arrayRowCard: {
    width: "100%",
    position: "relative",
    overflow: "auto",
  },
  arrayRowCardContent: {
    paddingLeft: "32px",
  },
  arrayRowCount: {
    display: "flex",
    width: "100%",
    margin: "0 0 16px -8px",
  },
}));
