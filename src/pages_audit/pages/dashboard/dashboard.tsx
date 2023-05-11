import { Transactions } from "../../../components/dashboard/transactions";
import { TrafficByDevice } from "../../../components/dashboard/traffic-by-device";
import { DashboardLayout } from "./dashboard-layout";
import { Box, Container, Grid } from "@mui/material";
import { DashboardBox } from "components/dashboard/dashboardBox";
import { Alert } from "components/common/alert";
import { useQuery } from "react-query";
import * as API from "./api";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Fragment } from "react";

const Dashboard = () => {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getDashboardData"], () => API.getDashboardDatad());

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // backgroundColor: "red",
          // backgroundColor: "transparent",
          height: "83vh",
          // py: 8,
        }}
      >
        <Container>
          <Grid container spacing={2}>
            {isLoading || isFetching ? (
              <Grid item lg={12} md={12} xl={12} xs={12}>
                <LoaderPaperComponent />
              </Grid>
            ) : isError ? (
              <Fragment>
                <div style={{ width: "100%", paddingTop: "10px" }}>
                  <Alert
                    severity={error?.severity ?? "error"}
                    errorMsg={error?.error_msg ?? "Error"}
                    errorDetail={error?.error_detail ?? ""}
                  />
                </div>
              </Fragment>
            ) : (
              <>
                <Grid item lg={12} md={12} xl={12} xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Grid
                        container
                        spacing={{ xs: 2, md: 3 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                      >
                        {Array.from(Array(6)).map((_, index) => (
                          <Grid item xl={2} xs={6} sm={4} md={4} key={index}>
                            <DashboardBox
                              key={"board"}
                              title={"69"}
                              body={"Follow Up"}
                              isfooterVisible={undefined}
                              icon={""}
                              apiName={"item?.APINAME"}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                    <Grid item xs={4}></Grid>
                  </Grid>
                </Grid>

                {/* {data?.[0]?.BOXES?.map((item, index) => (
                  <Grid key={"grid" + index} item xl={3} lg={3} sm={6} xs={12}>
                    <DashboardBox
                      key={"board" + index}
                      title={"item?.TITLE"}
                      body={"item?.DEFAULT"}
                      isfooterVisible={item?.ISFOOTERVISIBLE}
                      icon={item?.ICON}
                      apiName={item?.APINAME}
                    />
                  </Grid>
                ))} */}
                {data?.[0]?.CHART1?.ISCHARTVISIBLE ? (
                  <Grid item lg={8} md={12} xl={8} xs={12}>
                    <Transactions />
                  </Grid>
                ) : null}
                {data?.[0]?.CHART2?.ISCHARTVISIBLE ? (
                  <Grid item lg={4} md={6} xl={4} xs={12}>
                    <TrafficByDevice sx={{ height: "100%" }} />
                  </Grid>
                ) : null}
              </>
            )}

            {/* <Grid item lg={4} md={6} xl={3} xs={12}>
            <LatestProducts sx={{ height: "100%" }} />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <LatestOrders />
          </Grid> */}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
