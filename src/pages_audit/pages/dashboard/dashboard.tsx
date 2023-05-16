import { DashboardLayout } from "./dashboard-layout";
import { Box, Card, CardContent, Container, Grid } from "@mui/material";
import { DashboardBox } from "components/dashboard/dashboardBox";
import { Alert } from "components/common/alert";
import { useQuery } from "react-query";
import * as API from "./api";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Fragment } from "react";
import { Announcement } from "components/dashboard/annoucment";

const Dashboard = () => {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getDashboardData"], () => API.getDashboardDatas());

  return (
    <>
      <Box
        component="main"
        sx={{
          backgroundColor: "var(--theme-color4)",
          height: "83vh",
          flexGrow: 1,
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
                    <Grid item xs={7}>
                      <Grid
                        container
                        spacing={{ xs: 2, md: 2 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                        sx={{ justifyContent: "space-between" }}
                      >
                        {Array.from(Array(6)).map((_, index) => (
                          <Grid item xl={2} xs={6} sm={4} md={4} key={index}>
                            <DashboardBox
                              key={"board"}
                              title={"69"}
                              body={"Pending Transactions"}
                              isfooterVisible={undefined}
                              icon={""}
                              apiName={"item?.APINAME"}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                    <Grid item xs={5}>
                      <Container maxWidth="sm">
                        <Card
                          style={{
                            borderRadius: "20px",
                            boxShadow: "0px 11px 70px rgba(226, 236, 249, 0.5)",
                          }}
                        >
                          <CardContent
                            style={{ padding: "20px", height: "80vh" }}
                          >
                            <Grid item lg={12} md={12} xl={12} xs={12}>
                              {Array.from(Array(4)).map((_, index) => (
                                <Announcement
                                  title={"Notes"}
                                  body={"Lorem ipsum dolor sit."}
                                  screenFlag={"NOTES"}
                                  count={"+7"}
                                />
                              ))}
                            </Grid>
                          </CardContent>
                        </Card>
                      </Container>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
