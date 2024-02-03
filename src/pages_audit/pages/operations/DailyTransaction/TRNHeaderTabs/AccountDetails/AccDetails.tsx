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
import React, { useContext, useEffect, useRef, useState } from "react";
import { format } from "date-fns";

export const AccDetails = ({ flag }) => {
  const { cardStore, setCardStore } = useContext(AccDetailContext);
  const windowWidth = useRef(window.innerWidth);

  const [cardName, setCardName] = useState<any>([]);
  let cardsInfo = cardStore?.cardsInfo ?? [];

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 2,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: cardName?.length < 3 ? 2 : 3,
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

  useEffect(() => {
    let arr2 = cardsInfo?.length > 0 && cardsInfo?.map((a) => a.CARD_NAME);
    let arr3 = arr2 && arr2?.filter((a, i) => arr2.indexOf(a) == i);
    setCardName(arr3);
  }, [cardStore]);

  useEffect(() => {
    console.log(cardName, "cardName");
    console.log(cardStore, "cardStore");
  }, [cardName, cardStore]);

  console.log(cardsInfo?.length, "cardsInfo?.length");

  useEffect(() => {
    console.log("width: ", windowWidth.current);
  }, [windowWidth]);
  return (
    <>
      {cardName?.length > 0 ? (
        <Carousel responsive={responsive}>
          {cardName?.length > 0 &&
            cardName?.map((a, i) => {
              return (
                <Card
                  // id={cardName?.length < 3 ? "cardContainer2" : "cardContainer"}
                  id="cardContainer"
                >
                  <CardContent>
                    <div id="cardHeading">
                      <Typography
                        variant="h6"
                        component="div"
                        style={{ color: "white" }}
                      >
                        {a}
                      </Typography>
                      <div>
                        <AccountCircleIcon fontSize="medium" />
                      </div>
                    </div>

                    <div
                      style={{
                        overflowY: "scroll",
                        height: (flag === "DLYTRN" ? "26vh" : "29vh") as string,
                      }}
                    >
                      <Grid container spacing={2} style={{ marginTop: "0px" }}>
                        {cardsInfo?.length > 0 &&
                          cardsInfo?.map((b, i2) => {
                            if (a == b?.CARD_NAME) {
                              return (
                                <Grid item id="cardGridItem" key={i2}>
                                  <Typography id="cardLabel">
                                    {b?.COL_LABEL}
                                  </Typography>
                                  <Typography>{b?.COL_VALUE}</Typography>
                                </Grid>
                              );
                            }
                          })}
                      </Grid>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </Carousel>
      ) : (
        <Card
          style={{
            width: "100%",
            height: "38vh",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ paddingTop: "10%" }}></div>
        </Card>
        // <></>
      )}
    </>
  );
};
