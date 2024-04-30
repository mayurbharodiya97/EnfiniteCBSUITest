import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";

//logical
import "./accDetails.css";
import { AccDetailContext } from "pages_audit/auth";
import React, { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import { CustomPropertiesConfigurationContext } from "components/propertiesconfiguration/customPropertiesConfig";
import getCurrencySymbol from "components/custom/getCurrencySymbol";
import { formatCurrency } from "components/tableCellComponents/currencyRowCellRenderer";

const useStyles = makeStyles((theme) => ({
  // cardContainer: {
  //   backgroundColor: "#FFF",
  //   color: "var(--theme-color1)",
  //   //@ts-ignore
  //   marginBottom: theme.spacing(2),
  //   //@ts-ignore
  //   borderRadius: theme.spacing(2),
  //   //@ts-ignore
  //   padding: theme.spacing(2),
  //   display: "flex",
  //   flexDirection: "column",
  //   justifyContent: "space-between",
  //   height: "38vh",
  // },
  // cardHeading: {
  //   display: "flex",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   background: "var(--theme-color5)",
  // },
  // cardContent: {
  //   flex: 1,
  //   overflowY: "auto",
  // },
  cardLabel: {
    fontWeight: "bold",
  },
}));

const cardDimensions = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 2,
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

export const AccDetails = ({ cardsData }) => {
  const { cardStore, setCardStore } = useContext(AccDetailContext);
  const [cardName, setCardName] = useState<any>([]);
  const classes = useStyles();
  const customParameter = useContext(CustomPropertiesConfigurationContext);
  const { dynamicAmountSymbol, currencyFormat, decimalCount } = customParameter;

  let cardsInfo = cardsData ?? [];

  useEffect(() => {
    let arr2 = cardsInfo?.length > 0 && cardsInfo?.map((a) => a.CARD_NAME);
    let arr3 = arr2 && arr2?.filter((a, i) => arr2.indexOf(a) == i);
    setCardName(arr3);
  }, [cardsData]);

  const filteredCardsInfo1 = cardsInfo.filter((card) => card.CARD_NO === "1");
  const filteredCardsInfo2 = cardsInfo.filter((card) => card.CARD_NO === "2");
  const filteredCardsInfo3 = cardsInfo.filter((card) => card.CARD_NO === "3");

  const isOddTotal1 = filteredCardsInfo1.length % 2 === 1;
  const isOddTotal2 = filteredCardsInfo2.length % 2 === 1;
  const isOddTotal3 = filteredCardsInfo3.length % 2 === 1;

  return (
    <>
      {cardName?.length > 0 ? (
        <Carousel responsive={cardDimensions}>
          {cardName?.length > 0 &&
            cardName?.map((a, i) => {
              let filteredCardsInfo;
              let isOddTotal;
              if (a === "Basic Information") {
                filteredCardsInfo = filteredCardsInfo1;
                isOddTotal = isOddTotal1;
              } else if (a === "Balance Information") {
                filteredCardsInfo = filteredCardsInfo2;
                isOddTotal = isOddTotal2;
              } else if (a === "Account Information") {
                filteredCardsInfo = filteredCardsInfo3;
                isOddTotal = isOddTotal3;
              }

              return (
                <Card key={i} id="cardContainer">
                  {/* <div id={"cardHeadingParent"}>
                    <div id="cardHeading">
                      <Typography
                        variant="h6"
                        component="div"
                        style={{ color: "var(--theme-color2)" }}
                      >
                        {a}
                      </Typography>
                      <div id={"headingIcons"}>
                        {a === "Basic Information" && <InfoOutlinedIcon />}
                        {a === "Account Information" && (
                          <AccountCircleOutlinedIcon />
                        )}
                        {a === "Balance Information" && (
                          <AccountBalanceWalletOutlinedIcon />
                        )}
                      </div>
                    </div>
                  </div> */}
                  <CardContent>
                    <Grid container spacing={1}>
                      {filteredCardsInfo.map((b, i2) => (
                        <Grid
                          item
                          xs={6}
                          key={i2}
                          sx={{
                            overflowWrap: "break-word",
                            borderBottom: "1px solid var(--theme-color4)",
                            paddingBottom: "4px",
                          }}
                        >
                          <Typography className={classes.cardLabel}>
                            {b?.COL_LABEL}
                          </Typography>
                          <Typography>
                            {b?.COMPONENT_TYPE === "amountField" ? (
                              b?.COL_LABEL === "Withdrawable" ? (
                                <span
                                  style={{
                                    color: "green",
                                    fontWeight: "bold",
                                    animation: "blinkingTextGreen 1s infinite",
                                  }}
                                >
                                  {formatCurrency(
                                    parseFloat(b.COL_VALUE),
                                    getCurrencySymbol(dynamicAmountSymbol),
                                    currencyFormat,
                                    decimalCount
                                  )}
                                </span>
                              ) : (
                                <span>
                                  {formatCurrency(
                                    parseFloat(b.COL_VALUE),
                                    getCurrencySymbol(dynamicAmountSymbol),
                                    currencyFormat,
                                    decimalCount
                                  )}
                                </span>
                              )
                            ) : (
                              <span>{b?.COL_VALUE}</span>
                            )}
                          </Typography>
                        </Grid>
                      ))}
                      {isOddTotal && (
                        <Grid
                          item
                          xs={6}
                          sx={{
                            borderBottom: "1px solid var(--theme-color4)",
                          }}
                        ></Grid>
                      )}
                    </Grid>
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
      )}
    </>
  );
};
