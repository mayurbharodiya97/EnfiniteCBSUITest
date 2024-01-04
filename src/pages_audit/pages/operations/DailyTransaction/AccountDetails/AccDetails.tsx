import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import "./accDetails.css";

//logical
import React, { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import { useQuery } from "react-query";
import * as API from "./api";

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
export const AccDetails = ({ flag }) => {
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  let data = tempStore?.accInfo;
  return (
    <>
      <Carousel responsive={responsive}>
        <Card
          sx={{
            width: "450px",
            boxShadow: flag === "DLYTRN" ? "0px 1px 4px -1px #999999" : "none",
            borderRadius: "5px",
            marginBottom: "5px",
            // height: (flag === "TELLER" ? "49vh" : null) as string,
          }}
          className={flag === "TELLER" ? "styleforteller" : ""}
        >
          <CardContent>
            <div id="accHead">
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
                height: (flag === "DLYTRN" ? "26vh" : "36vh") as string,
              }}
            >
              <Grid container spacing={2}>
                <Grid item id="accInfo">
                  <Typography variant="button">Name</Typography>
                  <Typography>{data?.ACCT_NM}</Typography>
                </Grid>
                <Grid item id="accInfo">
                  <Typography variant="button">CUSTOMER_ID</Typography>
                  <Typography>{data?.CUSTOMER_ID}</Typography>
                </Grid>
                <Grid item id="accInfo">
                  <Typography variant="button">Account</Typography>
                  <Typography>{data?.ACCT_CD_NEW}</Typography>
                </Grid>
                {data?.E_MAIL_ID && (
                  <Grid item id="accInfo">
                    <Typography variant="button">Email</Typography>
                    <Typography>{data?.E_MAIL_ID}</Typography>
                  </Grid>
                )}
                {data?.CONTACT2 && (
                  <Grid item id="accInfo">
                    <Typography variant="button">Contact</Typography>
                    <Typography>{data?.CONTACT2}</Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography variant="button">Address</Typography>

                  <Typography>
                    {data?.ADD1} {data?.ADD2 && data?.ADD2} {data?.AREA_NM}
                  </Typography>
                </Grid>

                <Grid item id="accInfo">
                  <Typography variant="button">Branch</Typography>
                  <Typography>{data?.BRANCH_CD}</Typography>
                </Grid>
                <Grid item id="accInfo">
                  <Typography variant="button">COMP_CD</Typography>
                  <Typography>{data?.COMP_CD}</Typography>
                </Grid>
                {data?.ORG_PAN && (
                  <Grid item id="accInfo">
                    <Typography variant="button">PAN_NO</Typography>
                    <Typography>{data?.ORG_PAN}</Typography>
                  </Grid>
                )}
              </Grid>
            </div>
          </CardContent>
        </Card>

        <Card
          sx={{
            width: "450px",
            boxShadow: flag === "DLYTRN" ? "0px 1px 4px -1px #999999" : "none",
            borderRadius: "5px",
            marginBottom: "5px",
            // height: (flag === "TELLER" ? "49vh" : null) as string,
          }}
          className={flag === "TELLER" ? "style-for-teller" : ""}
        >
          <CardContent>
            <div id="accHead">
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
                height: (flag === "DLYTRN" ? "26vh" : "36vh") as string,
              }}
            >
              <Grid container spacing={2}>
                <Grid item id="accInfo">
                  <Typography variant="button">Status</Typography>
                  <Typography
                    style={
                      data?.STATUS == "C" ? { color: "#ea3a1b" } : { color: "" }
                    }
                  >
                    {data?.STATUS == "O" && "Open"}
                    {data?.STATUS == "C" && "Close"}
                    {data?.STATUS == "U" && "Unclaimed"}
                    {data?.STATUS == "F" && "Freeze"}
                    {data?.STATUS == "I" && "Inoperative"}
                    {data?.STATUS == "D" && "Dormant"}
                  </Typography>
                </Grid>
                <Grid item id="accInfo">
                  <Typography variant="button">Opening</Typography>
                  <Typography>{data?.LAST_BAL}</Typography>
                </Grid>
                <Grid item id="accInfo">
                  <Typography variant="button">HOLD_BAL</Typography>
                  <Typography>{data?.HOLD_BAL}</Typography>
                </Grid>
                <Grid item id="accInfo">
                  <Typography variant="button">Shadow(C)</Typography>
                  <Typography>{data?.TRAN_BAL}</Typography>
                </Grid>
                <Grid item id="accInfo">
                  <Typography variant="button">Op. DATE</Typography>
                  <Typography>
                    {data?.OP_DATE &&
                      format(new Date(data?.OP_DATE), "dd/MMM/yyyy")}
                  </Typography>
                </Grid>{" "}
                <Grid item id="accInfo">
                  <Typography variant="button">Pending Amt</Typography>
                  <Typography>{data?.PENDING_SCROLL_AMT}</Typography>
                </Grid>
                <Grid item id="accInfo">
                  <Typography variant="button">Withraw Bal</Typography>
                  <Typography>{data?.WITHDRAW_BAL}</Typography>
                </Grid>
                <Grid item id="accInfo">
                  <Typography variant="button">Current(A)</Typography>
                  <Typography>{data?.CONF_BAL}</Typography>
                </Grid>
                <Grid item id="accInfo">
                  <Typography variant="button">Clearing Chq(B)</Typography>
                  <Typography>{data?.UNCL_BAL}</Typography>
                </Grid>
                <Grid item id="accInfo">
                  <Typography variant="button">(C-B)</Typography>
                  <Typography>
                    {data?.TRAN_BAL &&
                      Number(data?.TRAN_BAL) - Number(data?.UNCL_BAL)}
                  </Typography>
                </Grid>
                <Grid item id="accInfo">
                  <Typography variant="button">(A-B)</Typography>
                  <Typography>
                    {data?.CONF_BAL &&
                      Number(data?.CONF_BAL) - Number(data?.UNCL_BAL)}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </CardContent>
        </Card>
        {/* <Card
          sx={{
            width: "450px",
            boxShadow: flag === "DLYTRN" ? "0px 1px 4px -1px #999999" : "none",
            borderRadius: "5px",
            marginBottom: "5px",
            // height: (flag === "TELLER" ? "49vh" : null) as string,
          }}
          className={flag === "TELLER" ? "style-for-teller" : ""}
        >
          <CardContent>
            <div id="accHead">
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
                height: (flag === "DLYTRN" ? "26vh" : "36vh") as string,
              }}
            >
              <Grid container spacing={2}>
                <Grid item id="accInfo">
                  <Typography variant="button">CUSTOMER_ID</Typography>
                  <Typography>{data?.CUSTOMER_ID}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="button">SCR_ADD</Typography>
                  <Typography>{data?.SCR_ADD}</Typography>
                </Grid>
                <Grid item id="accInfo">
                  <Typography variant="button">TRAN_BAL</Typography>
                  <Typography>{data?.TRAN_BAL}</Typography>
                </Grid>
                <Grid item id="accInfo">
                  <Typography variant="button">OP_DATE</Typography>
                  <Typography>
                    {data?.OP_DATE?.substring(0, 10)}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </CardContent>
        </Card> */}
      </Carousel>
      <br />
    </>
  );
};
