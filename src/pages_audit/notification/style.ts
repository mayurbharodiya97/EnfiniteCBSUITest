import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(() => ({
  notificationIcon: {
    fontSize: "2.5rem",
    border: "none",
  },
  badge: {
    "& .MuiBadge-anchorOriginTopRightRectangle": {
      transform: "none",
      border: "1px solid #fff",
    },
  },
}));
