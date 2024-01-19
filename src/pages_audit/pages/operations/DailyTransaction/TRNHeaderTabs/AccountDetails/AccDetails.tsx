import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

//logical
import "./accDetails.css";
import { AccDetailContext } from "pages_audit/auth";
import { AuthContext } from "pages_audit/auth";
import React, { useContext, useEffect, useState } from "react";
import { format } from "date-fns";

export const AccDetails = ({ flag }) => {
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  let arr = [{}, {}];
  const [dynamicCard, setDynamicCard] = useState(arr);
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: dynamicCard.length < 3 ? 2 : 3,
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
  let data = tempStore?.accInfo;

  return (
    <>
      <Carousel
        responsive={responsive}
        containerClass="carousel-container"
        // removeArrowOnDeviceType={["tablet", "mobile"]}
        // dotListClass="custom-dot-list-style"
        // itemClass="carousel-item-padding-40-px"
      >
        <Card id={dynamicCard.length < 3 ? "cardContainer2" : "cardContainer"}>
          <CardContent>
            <div id="cardHeading">
              <Typography
                variant="h5"
                component="div"
                style={{ color: "white" }}
              >
                Personal Information
              </Typography>
              <div>
                <AccountCircleIcon fontSize="medium" />
              </div>
            </div>

            <div
              style={{
                overflowY: "scroll",
                height: (flag === "DLYTRN" ? "26vh" : "28vh") as string,
              }}
            >
              <Grid container spacing={2} style={{ marginTop: "0px" }}>
                <Grid item id="cardGridItem">
                  <Typography id="cardLabel">Name</Typography>
                  <Typography>{data?.ACCT_NM}</Typography>
                </Grid>
                <Grid item id="cardGridItem">
                  <Typography id="cardLabel">Account</Typography>
                  <Typography>{data?.ACCT_CD_NEW}</Typography>
                </Grid>
                <Grid item id="cardGridItem">
                  <Typography id="cardLabel">CustomerId</Typography>
                  <Typography>{data?.CUSTOMER_ID}</Typography>
                </Grid>

                <Grid item id="cardGridItem">
                  <Typography id="cardLabel">Email</Typography>
                  <Typography>{data?.E_MAIL_ID}</Typography>
                </Grid>

                {data?.CONTACT2 && (
                  <Grid item id="cardGridItem">
                    <Typography id="cardLabel">Contact</Typography>
                    <Typography>{data?.CONTACT2}</Typography>
                  </Grid>
                )}

                <Grid item id="cardGridItem">
                  <Typography id="cardLabel">Branch Id</Typography>
                  <Typography>{data?.BRANCH_CD}</Typography>
                </Grid>
                <Grid item id="cardGridItem">
                  <Typography id="cardLabel">Company id</Typography>
                  <Typography>{data?.COMP_CD}</Typography>
                </Grid>
                {data?.ORG_PAN && (
                  <Grid item id="cardGridItem">
                    <Typography id="cardLabel">PAN No.</Typography>
                    <Typography>{data?.ORG_PAN}</Typography>
                  </Grid>
                )}
                <Grid item xs={12} id="cardGridItem">
                  <Typography id="cardLabel">Address</Typography>

                  <Typography>
                    {data?.ADD1} {data?.ADD2 && data?.ADD2} {data?.AREA_NM}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </CardContent>
        </Card>
        <Card id={dynamicCard.length < 3 ? "cardContainer2" : "cardContainer"}>
          <CardContent>
            <div id="cardHeading">
              <Typography
                variant="h5"
                component="div"
                style={{ color: "white" }}
              >
                Balance Details
              </Typography>
              <div>
                <AccountBalanceWalletIcon fontSize="medium" />
              </div>
            </div>
            <div
              style={{
                overflowY: "scroll",
                height: (flag === "DLYTRN" ? "26vh" : "28vh") as string,
              }}
            >
              <Grid container spacing={2} style={{ marginTop: "0px" }}>
                <Grid
                  item
                  id="cardGridItem"
                  xs={dynamicCard.length < 3 ? 2 : 3}
                >
                  <Typography id="cardLabel">Status</Typography>
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
                <Grid
                  item
                  id="cardGridItem"
                  xs={dynamicCard.length < 3 ? 2 : 3}
                >
                  <Typography id="cardLabel">Op. Date</Typography>
                  <Typography>
                    {data?.OP_DATE &&
                      format(new Date(data?.OP_DATE), "dd/MMM/yyyy")}
                  </Typography>
                </Grid>{" "}
                <Grid
                  item
                  id="cardGridItem"
                  xs={dynamicCard.length < 3 ? 2 : 3}
                >
                  <Typography id="cardLabel">Opening</Typography>
                  <Typography>{data?.LAST_BAL}</Typography>
                </Grid>{" "}
                <Grid
                  item
                  id="cardGridItem"
                  xs={dynamicCard.length < 3 ? 2 : 3}
                >
                  <Typography id="cardLabel">Withraw Bal</Typography>
                  <Typography>{data?.WITHDRAW_BAL}</Typography>
                </Grid>
                <Grid
                  item
                  id="cardGridItem"
                  xs={dynamicCard.length < 3 ? 2 : 3}
                >
                  <Typography id="cardLabel">Hold Bal</Typography>
                  <Typography>{data?.HOLD_BAL}</Typography>
                </Grid>
                <Grid
                  item
                  id="cardGridItem"
                  xs={dynamicCard.length < 3 ? 2 : 3}
                >
                  <Typography id="cardLabel">Shadow(C)</Typography>
                  <Typography>{data?.TRAN_BAL}</Typography>
                </Grid>
                <Grid
                  item
                  id="cardGridItem"
                  xs={dynamicCard.length < 3 ? 2 : 3}
                >
                  <Typography id="cardLabel">Current(A)</Typography>
                  <Typography>{data?.CONF_BAL}</Typography>
                </Grid>
                <Grid
                  item
                  id="cardGridItem"
                  xs={dynamicCard.length < 3 ? 2 : 3}
                >
                  <Typography id="cardLabel">(C-B)</Typography>
                  <Typography>
                    {data?.TRAN_BAL &&
                      Number(data?.TRAN_BAL) - Number(data?.UNCL_BAL)}
                  </Typography>
                </Grid>
                <Grid
                  item
                  id="cardGridItem"
                  xs={dynamicCard.length < 3 ? 2 : 3}
                >
                  <Typography id="cardLabel">(A-B)</Typography>
                  <Typography>
                    {data?.CONF_BAL &&
                      Number(data?.CONF_BAL) - Number(data?.UNCL_BAL)}
                  </Typography>
                </Grid>
                <Grid
                  item
                  id="cardGridItem"
                  xs={dynamicCard.length < 3 ? 2 : 3}
                >
                  <Typography id="cardLabel">Pending Amt</Typography>
                  <Typography>{data?.PENDING_SCROLL_AMT}</Typography>
                </Grid>
                <Grid
                  item
                  id="cardGridItem"
                  xs={dynamicCard.length < 3 ? 2 : 3}
                >
                  <Typography id="cardLabel">ClearingChq(B)</Typography>
                  <Typography>{data?.UNCL_BAL}</Typography>
                </Grid>
              </Grid>
            </div>
          </CardContent>
        </Card>
      </Carousel>
      <br />
    </>
  );
};
