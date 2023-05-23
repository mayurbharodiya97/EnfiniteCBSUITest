import { useReducer, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import loginImg from "../../assets/images/login.png";
import { useStyles } from "./style";
import { AuthContext } from "./authContext";
import { Grid } from "@mui/material";
import { Container } from "@mui/material";
import { utilFunction } from "components/utils";

export const BankDetails = ({ imageData }: any) => {
  const { isLoggedIn, login } = useContext(AuthContext);
  const [loginImageURL, setLoginImageURL] = useState<any | null>(null);
  const urlObj = useRef<any>(null);
  const classes = useStyles();
  const navigate = useNavigate();

  // let path = require("assets/sound/successSound.mp3").default;
  // let audio = new Audio(path);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/audit", { replace: true });
    }
  }, [navigate, isLoggedIn]);
  useEffect(() => {
    if (Boolean(imageData?.[0]?.COMP_LOGO)) {
      let blob = utilFunction.base64toBlob(imageData?.[0]?.COMP_LOGO);
      urlObj.current =
        typeof blob === "object" && Boolean(blob)
          ? URL.createObjectURL(blob)
          : "";
      setLoginImageURL(urlObj.current);
    }
  }, [imageData]);
  return (
    <>
      {/* <Grid container style={{ height: "100vh", overflow: "hidden" }}> */}
      <Grid item xs={6} md={6} lg={6} className={classes.loginLeft}>
        <Grid item xs={12} md={12} lg={12} style={{ height: "70vh" }}>
          <img
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
            src={Boolean(loginImageURL) ? loginImageURL : ""}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
          style={{
            height: "30vh",
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
              {`${imageData?.[0]?.APP_NM ?? ""}`}
              <span style={{ marginLeft: "8px", fontWeight: "900" }}>
                {/* EasyBank */}
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
              {`${imageData?.[0]?.NOTE ?? ""}`}
            </div>
          </Container>
        </Grid>
      </Grid>
      {/* </Grid> */}
    </>
  );
};
