import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { AuthContext } from "pages_audit/auth";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import "./accDetails.css";

//logical
import React, { useContext, useEffect, useState } from "react";

import { useQuery } from "react-query";
import * as API from "./api";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};
const AccDetails = () => {
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AuthContext);

  const [accInfo, setAccInfo]: any = useState({});

  console.log(tempStore, "tempStore");
  return (
    <>
      <Carousel responsive={responsive}>
        <Card
          sx={{
            width: "450px",
            boxShadow: "0px 1px 4px -1px #999999",
            borderRadius: "5px",
          }}
        >
          <CardContent
            style={{
              margin: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <Typography variant="h5" component="div">
                Personal Information
              </Typography>
              <div>
                <AccountCircleIcon fontSize="medium" />
              </div>
            </div>

            <div
              style={{
                overflowY: "scroll",
                height: "27vh",
              }}
            >
              <Grid container spacing={2}>
                <Grid item id="accInfo">
                  <Typography variant="button">Name</Typography>
                  <Typography>{tempStore?.accInfo?.ACCT_NM}</Typography>
                </Grid>
                <Grid item id="accInfo">
                  <Typography variant="button">Account</Typography>
                  <Typography>{tempStore?.accInfo?.ACCT_CD_NEW}</Typography>
                </Grid>
                {tempStore?.accInfo?.E_MAIL_ID && (
                  <Grid item id="accInfo">
                    <Typography variant="button">Email</Typography>
                    <Typography>{tempStore?.accInfo?.E_MAIL_ID}</Typography>
                  </Grid>
                )}
                {tempStore?.accInfo?.CONTACT2 && (
                  <Grid item id="accInfo">
                    <Typography variant="button">Contact</Typography>
                    <Typography>{tempStore?.accInfo?.CONTACT2}</Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography variant="button">Address</Typography>

                  <Typography>
                    {tempStore?.accInfo?.ADD1}{" "}
                    {tempStore?.accInfo?.ADD2 && tempStore?.accInfo?.ADD2}{" "}
                    {tempStore?.accInfo?.AREA_NM}
                  </Typography>
                </Grid>

                <Grid item id="accInfo">
                  <Typography variant="button">Branch Code</Typography>
                  <Typography>{tempStore?.accInfo?.BRANCH_CD}</Typography>
                </Grid>
                <Grid item id="accInfo">
                  <Typography variant="button">COMP_CD</Typography>
                  <Typography>{tempStore?.accInfo?.COMP_CD}</Typography>
                </Grid>
                {tempStore?.accInfo?.ORG_PAN && (
                  <Grid item id="accInfo">
                    <Typography variant="button">PAN_NO</Typography>
                    <Typography>{tempStore?.accInfo?.ORG_PAN}</Typography>
                  </Grid>
                )}
                <Grid item id="accInfo">
                  <Typography variant="button">Status</Typography>
                  <Typography>
                    {tempStore?.accInfo?.STATUS == "O" && "Open"}
                    {tempStore?.accInfo?.STATUS == "C" && "Close"}
                    {tempStore?.accInfo?.STATUS == "U" && "Unclaimed"}
                    {tempStore?.accInfo?.STATUS == "F" && "Freeze"}
                    {tempStore?.accInfo?.STATUS == "I" && "Inoperative"}
                    {tempStore?.accInfo?.STATUS == "D" && "Dormant"}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </CardContent>
        </Card>

        <Card
          sx={{
            width: "450px",
            boxShadow: "0px 1px 4px -1px #999999",
            borderRadius: "5px",
          }}
        >
          <CardContent
            style={{
              margin: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <Typography variant="h5" component="div">
                Balance Details
              </Typography>
              <div>
                <AccountBalanceWalletIcon fontSize="medium" />
              </div>
            </div>
            <div
              style={{
                overflowY: "scroll",
                height: "27vh",
              }}
            >
              <Grid container spacing={2}>
                <Grid item id="accInfo">
                  <Typography variant="button">CUSTOMER_ID</Typography>
                  <Typography>{tempStore?.accInfo?.CUSTOMER_ID}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="button">SCR_ADD</Typography>
                  <Typography>{tempStore?.accInfo?.SCR_ADD}</Typography>
                </Grid>
                <Grid item id="accInfo">
                  <Typography variant="button">TRAN_BAL</Typography>
                  <Typography>{tempStore?.accInfo?.TRAN_BAL}</Typography>
                </Grid>
                <Grid item id="accInfo">
                  <Typography variant="button">OP_DATE</Typography>
                  <Typography>
                    {tempStore?.accInfo?.OP_DATE?.substring(0, 10)}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </CardContent>
        </Card>
        <Card
          sx={{
            width: "450px",
            boxShadow: "0px 1px 4px -1px #999999",
            borderRadius: "5px",
          }}
        >
          <CardContent
            style={{
              margin: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <Typography variant="h5" component="div">
                Loan Details
              </Typography>
              <div>
                <CreditScoreIcon fontSize="medium" />
              </div>
            </div>
            <div
              style={{
                overflowY: "scroll",
                height: "27vh",
              }}
            >
              <Grid container spacing={2}>
                <Grid item id="accInfo">
                  <Typography variant="button">CUSTOMER_ID</Typography>
                  <Typography>{tempStore?.accInfo?.CUSTOMER_ID}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="button">SCR_ADD</Typography>
                  <Typography>{tempStore?.accInfo?.SCR_ADD}</Typography>
                </Grid>
                <Grid item id="accInfo">
                  <Typography variant="button">TRAN_BAL</Typography>
                  <Typography>{tempStore?.accInfo?.TRAN_BAL}</Typography>
                </Grid>
                <Grid item id="accInfo">
                  <Typography variant="button">OP_DATE</Typography>
                  <Typography>
                    {tempStore?.accInfo?.OP_DATE?.substring(0, 10)}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </CardContent>
        </Card>
        <Card
          sx={{
            width: "450px",
            boxShadow: "0px 1px 4px -1px #999999",
            borderRadius: "5px",
          }}
        >
          <CardContent
            style={{
              margin: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <Typography variant="h5" component="div">
                Personal Information
              </Typography>
              <div>
                <AccountCircleIcon />
              </div>
            </div>
            <div
              style={{
                overflowY: "scroll",
                height: "27vh",
              }}
            >
              <Typography component="div">Name</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
              <Typography component="div">aaaa</Typography>
              <Typography sx={{ mb: 1.5 }}>xyz</Typography>
            </div>
          </CardContent>
        </Card>
      </Carousel>
      <br />
    </>
  );
};

export default AccDetails;
