import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from "@mui/material";

import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { useQuery } from "react-query";
import * as API from "./api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { GradientButton } from "components/styledComponent/button";

Chart.register(ArcElement);

export const TrafficByDevice = (props) => {
  const theme = useTheme();
  const [showMore, setShowMore] = useState(false);
  let reqID = Math.floor(new Date().getTime() / 300000);
  const result = useQuery(["getTrafficChartData", reqID], () =>
    API.getTrafficChartData()
  );
  const showErrorData = () => {
    setShowMore(true);
  };
  const getPerData = (value, totalLoginUser) => {
    return (
      Number.parseFloat(
        totalLoginUser > 0 && Number.parseInt(value) > 0
          ? (Number.parseInt(value) / totalLoginUser) * 100
          : Boolean(value)
          ? value
          : "0"
      ).toFixed(2) + "%"
    );
  };
  const data = {
    datasets: [
      {
        data: [
          result?.data?.[0]?.WEB,
          result?.data?.[0]?.IOS,
          result?.data?.[0]?.ANDROID,
        ],
        backgroundColor: ["#3F51B5", "#e53935", "#FB8C00"],
        borderWidth: 8,
        borderColor: "#FFFFFF",
        hoverBorderColor: "#FFFFFF",
      },
    ],
    labels: [" Web", " IOS", " Android"],
  };

  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false,
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: "index",
      titleFontColor: theme.palette.text.primary,
    },
  };

  const devices = useMemo(() => {
    return [
      {
        title: "Web",
        value: result?.data?.[0]?.WEB ?? "0",
        icon: LaptopMacIcon,
        color: "#3F51B5",
      },
      {
        title: "IOS",
        value: result?.data?.[0]?.IOS ?? "0",
        icon: PhoneIphoneIcon,
        color: "#E53935",
      },
      {
        title: "Android",
        value: result?.data?.[0]?.ANDROID ?? "0",
        icon: PhoneAndroidIcon,
        color: "#FB8C00",
      },
    ];
  }, [result.data]);
  const totalLoginUser = useMemo(() => {
    let total = devices.reduce((accu, item) => {
      //console.log(accu, item);
      if (!isNaN(item.value)) {
        accu += Number.parseInt(item.value);
      }
      return accu;
    }, 0);
    //console.log(total);
    return total;
  }, [devices]);
  //console.log(totalLoginUser);
  return (
    <>
      <Card {...props} style={{ borderRadius: "20px" }}>
        <CardHeader
          title="Traffic By Device"
          style={{ color: "var(--theme-color1)" }}
        />
        <Divider />
        <CardContent style={{ padding: "10px", height: "47.6vh" }}>
          <Box
            sx={{
              height: "60%",
              position: "relative",
            }}
          >
            <Doughnut data={data} options={options} />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pt: 1,
            }}
          >
            {devices.map(({ color, icon: Icon, title, value }) => (
              <Box
                key={title}
                sx={{
                  p: 1,
                  textAlign: "center",
                }}
              >
                <Icon color="action" />
                <Typography color="textPrimary" variant="body1">
                  {title}
                </Typography>
                <Typography style={{ color }} variant="h6">
                  {getPerData(value, totalLoginUser)}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "right",
              pt: 2,
            }}
            style={{ paddingTop: "5px" }}
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
