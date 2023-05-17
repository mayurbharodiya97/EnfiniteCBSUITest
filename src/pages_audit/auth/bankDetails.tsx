import { useReducer, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import loginImg from "../../assets/images/login.png";
import { useStyles } from "./style";
import { AuthContext } from "./authContext";
import { Grid } from "@mui/material";
import { Container } from "@mui/material";

export const BankDetails = () => {
  const { isLoggedIn, login } = useContext(AuthContext);
  const classes = useStyles();
  const navigate = useNavigate();

  // let path = require("assets/sound/successSound.mp3").default;
  // let audio = new Audio(path);
  // console.log(audio);
  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/cbsenfinity", { replace: true });
    }
  }, [navigate, isLoggedIn]);

  return (
    <>
      {/* <Grid container style={{ height: "100vh", overflow: "hidden" }}> */}
      <Grid item xs={6} md={6} lg={6} className={classes.loginLeft}>
        <Grid item xs={12} md={12} lg={12} style={{ height: "30em" }}>
          <img
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
            src={loginImg}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
          style={{
            height: "15em",
            background: "var(--theme-color5)",
          }}
        >
          <Container maxWidth="sm">
            <div
              className="text"
              style={{
                color: "white",
                fontStyle: "normal",
                fontSize: "35px",
                paddingTop: "30px",
              }}
            >
              Welcome to
              <span style={{ marginLeft: "8px", fontWeight: "900" }}>
                EasyBank
              </span>
            </div>
            <div
              style={{
                lineHeight: "27px",
                fontSize: "15px",
                fontWeight: "500px",
                letterSpacing: "0.02em",
                color: "#ebedee",
                maxWidth: "464px",
              }}
            >
              It is an enterprise browser-based multi-channel banking solution
              that enables full range of banking services and customers with
              different user profiles, efficiently and reliably.
            </div>
          </Container>
        </Grid>
      </Grid>
      {/* </Grid> */}
    </>
  );
};
