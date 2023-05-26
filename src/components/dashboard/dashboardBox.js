import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
  Tooltip,
  Divider,
} from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import "pages_audit/sideBar/icons";
import { useState } from "react";
import { useQuery } from "react-query";
import * as API from "./api";
import "./style.css";
import { useStyles } from "pages_audit/style";

export const DashboardBox = ({
  title = "",
  body = "",
  isSequencs = "",
  icon = "home",
  apiName = "",
  isBackground = "",
}) => {
  const [showMore, setShowMore] = useState(false);
  const classes = useStyles();
  let reqID = Math.floor(new Date().getTime() / 300000);
  const result = useQuery(["getDynamicBoxData", apiName, reqID], () =>
    API.getDynamicBoxData(apiName)
  );

  const showErrorData = () => {
    setShowMore(true);
  };
  return (
    <>
      <Card
        sx={{
          // height: "14vh",
          // width: "34vh",
          borderRadius: "15px",
          border: "0.5px solid #EBEDEE",
          // boxShadow: "none",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
          // backgroundColor:
          //   body === "Follow Up done"
          //     ? "#E2ECFD"
          //     : body === "Follow Up"
          //     ? "#E2ECFD"
          //     : body === "Reject Transactions"
          //     ? "#FFE5EB"
          //     : body === "Reject Request"
          //     ? "#FFE5EB"
          //     : body === "Pending Request"
          //     ? "#efe0c680"
          //     : body === "Confirm Request"
          //     ? "#d7f1c8b0"
          //     : body === "Confirmed Transactions"
          //     ? "#d7f1c8b0"
          //     : null,
        }}
      >
        <CardContent style={{ height: "13vh", padding: "10px", margin: "5px" }}>
          <Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
            <Grid item xl={4} lg={9} sm={9} xs={12} style={{ height: "16vh" }}>
              <Typography
                // gutterBottom
                // variant="overline"
                style={{
                  color: "#4263C7",
                  fontSize: "23px",
                  fontWeight: "500",
                  letterSpacing: "0.01em",
                  marginBottom: "0px",
                }}
              >{`${result?.data?.[0]?.BOX_BODY ?? body}`}</Typography>
              <Divider style={{ borderColor: "var(--theme-color3)" }} />
              <Typography
                variant="h3"
                style={{
                  color: "#949597",
                  fontSize: "15px",
                  fontWeight: "500",
                  marginTop: "5px",
                }}
              >
                {`${title}`}
              </Typography>
            </Grid>
            <Grid item xl={6} lg={3} sm={3} xs={12}>
              <Avatar
                className={classes.avtar}
                sx={{
                  backgroundColor: "error.main",
                  height: 40,
                  width: 40,
                  top: "10px",
                }}
                style={{
                  backgroundColor: "var(--theme-color3)",
                  color: "var(--theme-color2)",
                }}
              >
                {Boolean(icon) ? (
                  <FontAwesomeIcon
                    icon={["fa", icon]}
                    // className={classes.icon}
                  />
                ) : null}
              </Avatar>
            </Grid>
            {/* <Grid item xl={6} lg={3} sm={3} xs={12}></Grid> */}
          </Grid>
        </CardContent>
      </Card>
      {result.isError ? (
        <Dialog
          open={showMore}
          fullWidth={false}
          onKeyUp={(event) => {
            if (event.key === "Escape") {
              setShowMore(false);
            }
          }}
        >
          <DialogTitle>Error Details</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {result.error?.error_msg ?? "Error"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <GradientButton onClick={() => setShowMore(false)}>
              OK
            </GradientButton>
          </DialogActions>
        </Dialog>
      ) : null}
    </>
  );
};
