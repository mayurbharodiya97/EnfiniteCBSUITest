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
} from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import "pages_audit/sideBar/icons";
import { useState } from "react";
import { useQuery } from "react-query";
import * as API from "./api";
import "./style.css";
export const DashboardBox = ({
  title = "",
  body = "",
  isfooterVisible = false,
  icon = "home",
  apiName = "",
}) => {
  const [showMore, setShowMore] = useState(false);
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
          borderRadius: "23px",
          border: "2.36619px solid #EBEDEE",
        }}
      >
        <CardContent style={{ height: "14vh" }}>
          <Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
            <Grid item xl={6} lg={9} sm={9} xs={12} style={{ height: "16vh" }}>
              <Typography
                gutterBottom
                // variant="overline"
                style={{
                  color: "#4263C7",
                  fontSize: "23px",
                  fontWeight: "500",
                  letterSpacing: "0.01em",
                  marginBottom: "0px",
                }}
              >
                {`${title}`}
              </Typography>
              <Typography
                variant="h3"
                style={{
                  color: "#949597",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                {`${result?.data?.[0]?.BOX_BODY ?? body}`}
              </Typography>
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
