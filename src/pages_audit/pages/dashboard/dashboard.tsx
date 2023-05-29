import { DashboardLayout } from "./dashboard-layout";
import { Box, Card, CardContent } from "@mui/material";
import { DashboardBox } from "components/dashboard/dashboardBox";
import { Alert } from "components/common/alert";
import { useQuery } from "react-query";
import * as API from "./api";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Fragment, useState } from "react";
import { QuickAccessTableGridWrapper } from "./QuickAccessTableGrid/QuickAccessTableGrid";
import Grid from "@mui/material/Grid";
import { TodaysTransactionTableGridWrapper } from "./Today'sTransactionGrid/TodaysTransactionTableGrid";
import { useEffect } from "react";
import { queryClient } from "cache";
import { Transactions } from "components/dashboard/transactions";
import { TrafficByDevice } from "components/dashboard/traffic-by-device";
import { MessageBox } from "components/dashboard/messageBox";
const Dashboard = () => {
  const [isOpenSave, setIsOpenSave] = useState<any>(false);
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getDashboardQuickCardData"], () => API.getDashboardQuickCardData());

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getDashboardQuickCardData"]);
    };
  }, []);
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
        <div style={{ padding: "0 10px 0 10px" }}>
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
                {data?.[0]?.BOXES?.map((item, index) => (
                  <Grid item xl={3} lg={3} sm={6} md={4} xs={12} key={index}>
                    <DashboardBox
                      key={"board" + index}
                      body={item?.DEFAULT}
                      title={item?.TITLE}
                      isSequencs={item?.DISPLAY_SEQ}
                      icon={item?.ICON}
                      isBackground={item?.BACKGROUND}
                      apiName={item?.APINAME}
                    />
                  </Grid>
                ))}
                {data?.[0]?.QUICK_ACCESS?.ISVISIBLE ? (
                  <Grid item lg={8} md={12} xl={8} xs={12}>
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
                ) : null}
                {data?.[0]?.MESSAGE_BOX?.ISVISIBLE ? (
                  <Grid item lg={4} md={12} xl={4} xs={12}>
                    <Card
                      style={{
                        borderRadius: "20px",
                        boxShadow: "0px 11px 70px rgba(226, 236, 249, 0.5)",
                        overflowY: "auto",
                      }}
                    >
                      <CardContent style={{ padding: "10px", height: "78vh" }}>
                        <Grid item lg={12} md={12} xl={12} xs={12}>
                          <MessageBox screenFlag={"Announcement"} />
                          <MessageBox screenFlag={"Tips"} />
                          <MessageBox screenFlag={"Notes"} />
                          <MessageBox screenFlag={"Alert"} />
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ) : null}
                {data?.[0]?.CHART1?.ISVISIBLE ? (
                  <Grid item lg={8} md={12} xl={8} xs={12}>
                    <Transactions />
                  </Grid>
                ) : null}
                {data?.[0]?.CHART2?.ISVISIBLE ? (
                  <Grid item lg={4} md={12} xl={4} xs={12}>
                    <TrafficByDevice sx={{ height: "100%" }} />
                  </Grid>
                ) : null}
                {data?.[0]?.TODAY_TRN?.ISVISIBLE ? (
                  <Grid item lg={12} md={12} xl={12} xs={12}>
                    <Box
                      sx={{
                        background: "var(--theme-color2)",
                        // border: "2px solid #EBEDEE",
                        boxShadow: "0px 11px 70px rgba(226, 236, 249, 0.5)",
                        borderRadius: "20px",
                        marginTop: "10px",
                        padding: "10px",
                      }}
                    >
                      <TodaysTransactionTableGridWrapper />
                    </Box>
                  </Grid>
                ) : null}
              </>
            )}
          </Grid>
        </div>
      </Box>
      {/* {isOpenSave ? (
        <AllScreensGridWrapper
          open={isOpenSave}
          handleDialogClose={handleDialogClose}
        />
      ) : null} */}
    </>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
