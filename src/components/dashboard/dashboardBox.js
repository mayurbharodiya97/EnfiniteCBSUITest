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
} from "@material-ui/core";
import { GradientButton } from "components/styledComponent/button";
import "pages_audit/sideBar/icons";
import { useState } from "react";
import { useQuery } from "react-query";
import * as API from "./api";
import "./style.css";
import Tooltip from "@material-ui/core/Tooltip";
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
      <Card sx={{ height: "100%" }}>
        <CardContent style={{ height: "22vh" }}>
          <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
            <Grid item xl={6} lg={9} sm={9} xs={12} style={{ height: "16vh" }}>
              <Typography color="secondary" gutterBottom variant="overline">
                {`${title}`}
              </Typography>
              <Typography color="textPrimary" variant="h4">
                {`${result?.data?.[0]?.BOX_BODY ?? body}`}
              </Typography>
            </Grid>
            <Grid item xl={6} lg={3} sm={3} xs={12}>
              <Avatar
                sx={{
                  backgroundColor: "error.main",
                  height: 56,
                  width: 56,
                }}
                style={{
                  backgroundColor: "var(--theme-color2)",
                  color: "var(--theme-color1)",
                }}
              >
                {/* <MoneyIcon /> */}
                {Boolean(icon) ? (
                  <FontAwesomeIcon icon={["fas", icon]} />
                ) : null}
              </Avatar>
            </Grid>
          </Grid>
          <Box
            sx={{
              pt: 2,
              display: "flex",
              alignItems: "center",
              height: "30px",
            }}
          >
            {isfooterVisible ? (
              <>
                {Boolean(result?.data?.[0]?.FOOTER_ICON) ? (
                  <FontAwesomeIcon
                    icon={["fas", result?.data?.[0]?.FOOTER_ICON ?? ""]}
                    color={result?.data?.[0]?.FOOTER_ICON_COLOR ?? ""}
                  />
                ) : null}{" "}
                {/* <ArrowDownwardIcon color="error" /> */}
                <Typography
                  sx={{
                    mr: 2,
                  }}
                  variant="body2"
                  style={{
                    paddingLeft: "3px",
                    color: result?.data?.[0]?.FOOTER_ICON_COLOR ?? "",
                  }}
                >
                  {result?.data?.[0]?.FOOTER}
                </Typography>
                {/* <Typography
                  color="textSecondary"
                  variant="caption"
                ></Typography> */}
              </>
            ) : null}
            <div
              // className="rotating"
              style={{
                flex: "auto",
                textAlign: "right",
              }}
            >
              {result.isError || result.isLoading || result.isFetching ? (
                <>
                  {result.isError ? (
                    <>
                      <Tooltip title={"Error"}>
                        <span>
                          <FontAwesomeIcon
                            icon={["fas", "circle-exclamation"]}
                            color={"red"}
                            style={{ cursor: "pointer" }}
                            onClick={showErrorData}
                          />
                        </span>
                      </Tooltip>
                      <Tooltip title={"Refetch"}>
                        <span>
                          <FontAwesomeIcon
                            icon={["fas", "rotate-right"]}
                            color={"var(--theme-color1)"}
                            style={{ cursor: "pointer", marginLeft: "3px" }}
                            onClick={() => {
                              result.refetch();
                            }}
                          />
                        </span>
                      </Tooltip>
                    </>
                  ) : (
                    <Tooltip title={"Feching..."}>
                      <span>
                        <FontAwesomeIcon
                          icon={["fas", "spinner"]}
                          className={"rotating"}
                        />
                      </span>
                    </Tooltip>
                  )}
                </>
              ) : (
                <>
                  <Tooltip title={"Refresh"}>
                    <span>
                      <FontAwesomeIcon
                        icon={["fas", "rotate-right"]}
                        color={"var(--theme-color1)"}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          result.refetch();
                        }}
                      />
                    </span>
                  </Tooltip>
                </>
              )}
            </div>
          </Box>
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
