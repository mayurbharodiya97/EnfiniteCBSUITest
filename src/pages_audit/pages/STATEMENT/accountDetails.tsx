import {
  Box,
  Typography,
  Grid,
  Dialog,
  AppBar,
  Button,
  Toolbar,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Divider,
} from "@mui/material";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import React from "react";
import { AccountDetailsGridMetaData } from "./gridMetaData";
import { GridMetaDataType } from "components/dataTable/types";
import { GradientButton } from "components/styledComponent/button";
import { styled } from "@mui/material/styles";
// import Logo from "src/assets/images/easy_bankcore_Logo.png";
import * as API from "./api";
import { useQuery } from "react-query";
import { createNewWorkbook } from "components/report/export";

const StyledTableContainer = styled(TableContainer)({
  display: "flex",
  justifyContent: "flex-start",
});

const StyledTableHeaderCell = styled(TableCell)({
  width: "150px",
  fontWeight: "bold",
});

const AccountDetails = ({ columns }) => {
  const styles = {
    root: {
      maxWidth: "100%",
      margin: "0",
      padding: "16px",
      fontFamily: "Montserrat",
      backgroundColor: "inherit",
    },
    heading: {
      fontFamily: "Montserrat",
      color: "var(--theme-color3)",
      textTransform: "uppercase",
      letterSpacing: "2px",
      fontWeight: 700,
      margin: 0,
    },
    leftContainer: {
      width: "50%",
      paddingRight: "16px",
    },
    rightContainer: {
      width: "50%",
      paddingLeft: "16px",
    },
  };

  const dataLeft = [
    { label: "Name : ", value: "Narendra" },
    { label: "Mobile : ", value: "4156654553" },
    { label: "Phone : ", value: "022-5647-4657" },
    { label: "Fax : ", value: "fax_abccompany" },
  ];

  const dataRight = [
    {
      label: "Address : ",
      value:
        "g-3, dharmyug society, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      label: "Account No : ",
      value: " 002101184661fsvsvsfvbfbfbfbfbfbbfbfbfbfbfbfbfb",
    },
    { label: "Tra Code : ", value: "0221000012021" },
    { label: "Date : ", value: "today's date" },
  ];

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["QuickAccessTableGridDataAAAAA"], () =>
    API.QuickAccessTableGridDataAAAAA()
  );

  return (
    <>
      <Dialog fullScreen={true} open={true}>
        <Toolbar sx={{ backgroundColor: "var(--theme-color4)" }}>
          {/* <Box>
            <image>{Logo}</image>
          </Box> */}
          <Grid container sx={{ width: "100%" }}>
            <Grid
              item
              xs={7}
              sm={7}
              md={10}
              lg={10}
              xl={10}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={styles.heading}
                variant="h5"
                align="center"
                gutterBottom
              >
                STATEMENT OF ACCOUNT
              </Typography>
            </Grid>
            <Grid
              item
              xs={5}
              sm={5}
              md={2}
              lg={2}
              xl={2}
              sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
            >
              <GradientButton
                onClick={() =>
                  createNewWorkbook({
                    data: data,
                    title: "SHEET@@@",
                    columns: AccountDetailsGridMetaData.columns,
                  })
                }
              >
                DOWNLOAD
              </GradientButton>
              <GradientButton onClick={() => window.close()}>
                CLOSE
              </GradientButton>
            </Grid>
          </Grid>
        </Toolbar>
        <Box sx={styles.root}>
          <Box
            component={Paper}
            sx={{
              height: "30vh",
              display: "flex",
              backgroundColor: "var(--theme-color4)",
              boxShadow: "none",
              borderRadius: "16px",
            }}
          >
            <Box padding={"10px"} width={"50%"}>
              {" "}
              {dataLeft?.map((item) => (
                <Typography sx={{ padding: "6px 0px", display: "flex" }}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    {item.label}
                  </Typography>
                  {item.value}
                </Typography>
              ))}
            </Box>
            <Box padding={"10px"} width={"50%"}>
              {" "}
              {dataRight?.map((item) => (
                <Typography sx={{ padding: "6px 0px", display: "flex" }}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    {item.label}
                  </Typography>
                  {item.value}
                </Typography>
              ))}
            </Box>
          </Box>
          <Divider sx={{ marginTop: "10px" }} />
          <Box
            sx={{
              marginTop: "10px",
              // border: "1px solid var(--theme-color6)",
              borderRadius: "16px",
              padding: "10px",
              boxShadow: "rgba(226, 236, 249, 5) 0px 11px 70px",
            }}
          >
            {" "}
            <GridWrapper
              key={`statementdetails`}
              finalMetaData={AccountDetailsGridMetaData as GridMetaDataType}
              data={data}
              setData={() => null}
              headerToolbarStyle={{
                background: "inherit",
                color: "black",
              }}
            />
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default AccountDetails;
