import { Bar } from "react-chartjs-2";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  useTheme,
  Tooltip,
} from "@mui/material";
import { Chart, CategoryScale, registerables } from "chart.js";
import { useMutation } from "react-query";
import * as API from "./api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SelectWithoutOptions } from "components/common/select/render2";
import { useEffect, useState } from "react";
import { GradientButton } from "components/styledComponent/button";
Chart.register(CategoryScale);
Chart.register(...registerables);
const getTransactionChartDataFnWrapper =
  (getTransactionChartData) =>
  async ({ type }) => {
    return getTransactionChartData(type);
  };
export const Transactions = (props) => {
  const theme = useTheme();
  const [showMore, setShowMore] = useState(false);
  const [optionValue, setOptionValue] = useState("D");

  const result = useMutation(
    getTransactionChartDataFnWrapper(API.getTransactionChartData)
  );
  useEffect(() => {
    result.mutate({ type: "D" });
  }, []);
  const showErrorData = () => {
    setShowMore(true);
  };
  const data = {
    datasets: [
      {
        backgroundColor: "green",
        barPercentage: 1,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 1,
        data: result?.data?.SUCCESS,
        label: "Success",
        maxBarThickness: 10,
      },
      {
        backgroundColor: "#FF3A3A",
        barPercentage: 1,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 1,
        data: result?.data?.FAIL,
        label: "Fail",
        maxBarThickness: 10,
      },
    ],
    labels: result?.data?.LABELS,
  };
  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    xAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
          beginAtZero: true,
          min: 0,
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: theme.palette.divider,
        },
      },
    ],
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

  return (
    <Card {...props} style={{ borderRadius: "20px" }}>
      <CardHeader
        action={
          <div style={{ width: "200px" }}>
            {/* <MySelectField
              key={"columnName"}
              columnName={"columnName"}
              value="D"
              options={[{ label: "Today", value: "D" }]}
              loadingOptions={false}
              showCheckbox={false}
            /> */}
            <SelectWithoutOptions
              value={optionValue}
              error={""}
              touched={false}
              size="small"
              variant="outlined"
              handleChange={(e) => {
                setOptionValue(e.target.value);
                if (Boolean(e.target.value)) {
                  result.mutate({ type: e.target.value });
                }

                //setCellValue({ [columnName]: e.target.value, ...clearFields });
              }}
              handleBlur={() => {
                //setCellTouched({ [columnName]: true })
              }}
              options={[
                { label: "Today", value: "D" },
                { label: "Last Week", value: "W" },
                { label: "Last Month", value: "M" },
              ]}
              loadingOptions={false}
              multiple={false}
              showCheckbox={false}
              fullWidth
              disabled={result.isLoading || result.isFetching}
            />
          </div>
        }
        title="Today's Transactions"
        style={{ color: "var(--theme-color1)" }}
      />
      <Divider />
      <CardContent style={{ padding: "10px", height: "43vh" }}>
        <Box
          sx={{
            height: "98%",
            position: "relative",
          }}
        >
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          height: "32px",
          pt: 1,
          marginRight: "10px",
        }}
      >
        {/* <Button
          color="secondary"
          endIcon={<ArrowRightIcon fontSize="small" />}
          size="small"
        >
          Overview
        </Button> */}
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
                {/* <Tooltip title={"Refetch"}>
                  <span>
                    <FontAwesomeIcon
                      icon={["fas", "rotate-right"]}
                      color={"var(--theme-color1)"}
                      style={{ cursor: "pointer", marginLeft: "3px" }}
                      onClick={() => {
                        result.mutate({ type: optionValue });
                      }}
                    />
                  </span>
                </Tooltip> */}
              </>
            ) : (
              <>
                <Tooltip title={"Feching..."} style={{ paddingRight: "10px" }}>
                  <span>
                    <FontAwesomeIcon
                      icon={["fas", "spinner"]}
                      className={"rotating"}
                    />
                  </span>
                </Tooltip>
              </>
            )}
          </>
        ) : (
          <>
            {/* <Tooltip title={"Refresh"}>
              <span>
                <FontAwesomeIcon
                  icon={["fas", "rotate-right"]}
                  color={"var(--theme-color1)"}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    result.mutate({ type: optionValue });
                  }}
                />
              </span>
            </Tooltip> */}
          </>
        )}
      </Box>
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
    </Card>
  );
};
