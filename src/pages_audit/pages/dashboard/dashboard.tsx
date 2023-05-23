import { DashboardLayout } from "./dashboard-layout";
import {
  Box,
  Card,
  CardContent,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import { DashboardBox } from "components/dashboard/dashboardBox";
import { Alert } from "components/common/alert";
import { useQuery } from "react-query";
import * as API from "./api";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Fragment, useState } from "react";
import { QuickAccessTableGridWrapper } from "./QuickAccessTableGrid/QuickAccessTableGrid";
import Imagecarousel from "../transactionSummeryCard/imagecarousel";
import { Announcement } from "components/dashboard/annoucment";
import Grid from "@mui/material/Grid";
import TvIcon from "@mui/icons-material/Tv";
import { AllScreensGridWrapper, ReleaseUsers } from "../allScreens";
import { TodaysTransactionTableGridWrapper } from "./Today'sTransactionGrid/TodaysTransactionTableGrid";

const Dashboard = () => {
  const [isOpenSave, setIsOpenSave] = useState<any>(false);
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getDashboardData"], () => API.getDashboardData());
  const handleClick = () => {
    setIsOpenSave(true);
    // console.log("test");
  };
  const handleDialogClose = () => {
    // console.log("test");
    setIsOpenSave(false);
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          background: "rgba(250, 251, 255, 0.9)",
          // height: "83vh",
          flexGrow: 1,
        }}
      >
        <Container style={{ padding: "10px" }}>
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
                  <Grid container spacing={3} style={{ padding: "5px" }}>
                    <Grid item lg={8} md={8} xl={8} xs={8}>
                      <Grid
                        container
                        spacing={{ xs: 2, md: 2 }}
                        columns={{ xs: 12, sm: 12, md: 12 }}
                      >
                        <Grid item lg={4} md={4} xl={4} xs={4}>
                          <Card
                            sx={{
                              color: "white",
                              // minWidth: 223,
                              height: "29vh",
                              width: "90%",
                              // margin: "20px",
                              // background:
                              //   "linear-gradient(61.76deg, #4284F4 8.02%, #885DF5 108.35%)",
                              background: "var(--theme-color5)",
                              borderRadius: "20px",
                              cursor: "pointer",
                            }}
                            onClick={handleClick}
                          >
                            <CardContent style={{ padding: "15px" }}>
                              <IconButton
                                color="inherit"
                                style={{
                                  backgroundColor: "var(--theme-color2)",
                                  borderRadius: "10px",
                                  border: "0.4px solid rgba(66, 99, 199, 0.4)",
                                  boxShadow:
                                    "0px 5px 14px rgba(66, 99, 199, 0.2)",
                                  height: "45px",
                                  width: "45px",
                                }}
                              >
                                {/* {`${icon}`} */}

                                <TvIcon
                                  style={{
                                    color: " #4263C7",
                                    fontSize: "30px",
                                  }}
                                />
                              </IconButton>
                              <Grid item xl={12} lg={12} sm={12} xs={12}>
                                <Typography
                                  // gutterBottom
                                  // variant="overline"
                                  style={{
                                    color: "#black",
                                    fontSize: "30px",
                                    fontWeight: "600",
                                    lineHeight: "42px",
                                    letterSpacing: "0.01em",
                                    marginTop: "18px",
                                    width: "140px",
                                  }}
                                >
                                  All Screens
                                </Typography>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item lg={8} md={8} xl={8} xs={8}>
                          <Grid
                            container
                            spacing={{ xs: 2, md: 2 }}
                            columns={{ xs: 4, sm: 4, md: 12 }}
                          >
                            <Grid item xs={6} sm={6} md={6}>
                              <DashboardBox
                                key={"board"}
                                title={"69"}
                                body={"Follow Up"}
                                isfooterVisible={undefined}
                                icon={""}
                                apiName={"item?.APINAME"}
                              />
                            </Grid>
                            <Grid item xs={6} sm={6} md={6}>
                              <DashboardBox
                                key={"board"}
                                title={"22"}
                                body={"Pending Request"}
                                isfooterVisible={undefined}
                                icon={""}
                                apiName={"item?.APINAME"}
                              />
                            </Grid>
                            <Grid item xs={6} sm={6} md={6}>
                              <DashboardBox
                                key={"board"}
                                title={"90"}
                                body={"Pending Transactions"}
                                isfooterVisible={undefined}
                                icon={""}
                                apiName={"item?.APINAME"}
                              />
                            </Grid>
                            <Grid item xs={6} sm={6} md={6}>
                              <DashboardBox
                                key={"board"}
                                title={"44"}
                                body={"Reject Request"}
                                isfooterVisible={undefined}
                                icon={""}
                                apiName={"item?.APINAME"}
                              />
                            </Grid>
                            {/* {Array.from(Array(4)).map((_, index) => (
                              <Grid item xs={6} sm={6} md={6} key={index}>
                                <DashboardBox
                                  key={"board"}
                                  title={"69"}
                                  body={"Pending Transactions"}
                                  isfooterVisible={undefined}
                                  icon={""}
                                  apiName={"item?.APINAME"}
                                />
                              </Grid>
                            ))} */}
                          </Grid>
                        </Grid>
                        <Grid item xl={12} xs={12} sm={12} md={12}>
                          <Box
                            sx={{
                              background: "var(--theme-color2)",
                              border: "2px solid #EBEDEE",
                              borderRadius: "20px",
                              padding: "05px",
                            }}
                          >
                            <QuickAccessTableGridWrapper />
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item lg={4} md={4} xl={4} xs={4}>
                      <Card
                        style={{
                          borderRadius: "20px",
                          boxShadow: "0px 11px 70px rgba(226, 236, 249, 0.5)",
                          overflowY: "auto",
                        }}
                      >
                        <CardContent
                          style={{ padding: "10px", height: "82vh" }}
                        >
                          <Grid item lg={12} md={12} xl={12} xs={12}>
                            <Announcement screenFlag={"Announcement"} />
                            <Announcement screenFlag={"Tips"} />
                            <Announcement screenFlag={"Notes"} />
                            <Announcement screenFlag={"Alert"} />
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
          <Box
            sx={{
              background: "var(--theme-color2)",
              border: "2px solid #EBEDEE",
              borderRadius: "20px",
              margin: "20px 12px 0 0",
              padding: "10px",
            }}
          >
            <Imagecarousel />
          </Box>
          <Box
            sx={{
              background: "var(--theme-color2)",
              // border: "2px solid #EBEDEE",
              boxShadow: "0px 11px 70px rgba(226, 236, 249, 0.5)",
              borderRadius: "20px",
              margin: "20px 12px 0 0",
              padding: "10px",
            }}
          >
            <TodaysTransactionTableGridWrapper />
          </Box>
        </Container>
      </Box>
      {isOpenSave ? (
        <AllScreensGridWrapper
          open={isOpenSave}
          handleDialogClose={handleDialogClose}
        />
      ) : null}
    </>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
