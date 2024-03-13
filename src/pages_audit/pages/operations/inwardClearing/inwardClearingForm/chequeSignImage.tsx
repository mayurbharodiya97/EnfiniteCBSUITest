import { FC, useEffect, useRef, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Grid, Card, CardContent } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import { utilFunction } from "components/utils";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Alert } from "components/common/alert";
import noPhotoAvailble from "../../../../../assets/images/noPhotoAvailble.jpg";

export const ChequeSignImage: FC<{
  imgData?: any;
  rotate?: any;
  loading?: any;
  error?: any;
}> = ({ imgData, rotate, loading, error }) => {
  const [chequeImageURL, setChequeImageURL] = useState<any>(null);
  const [signImageURL, setSignImageURL] = useState<any>(null);
  const urlObj = useRef<any>(null);

  useEffect(() => {
    if (Boolean(imgData?.[0])) {
      const images: any = [];

      if (Boolean(imgData[0].FR_GREY_IMG)) {
        let blob = utilFunction.base64toBlob(imgData[0].FR_GREY_IMG);
        urlObj.current =
          typeof blob === "object" && Boolean(blob)
            ? URL.createObjectURL(blob)
            : "";
        images.push(urlObj.current);
      }
      if (Boolean(imgData[0].FR_BW_IMG)) {
        let blob = utilFunction.base64toBlob(imgData[0].FR_BW_IMG);
        urlObj.current =
          typeof blob === "object" && Boolean(blob)
            ? URL.createObjectURL(blob)
            : "";
        images.push(urlObj.current);
      }
      if (Boolean(imgData[0].BACK_IMG)) {
        let blob = utilFunction.base64toBlob(imgData[0].BACK_IMG);
        urlObj.current =
          typeof blob === "object" && Boolean(blob)
            ? URL.createObjectURL(blob)
            : "";
        images.push(urlObj.current);
      }

      setChequeImageURL(images);
    }
    if (Boolean(imgData?.[0]?.SIGN_IMG)) {
      let blob = utilFunction.base64toBlob(imgData?.[0]?.SIGN_IMG);
      urlObj.current =
        typeof blob === "object" && Boolean(blob)
          ? URL.createObjectURL(blob)
          : "";
      setSignImageURL(urlObj.current);
    }
  }, [imgData]);

  return (
    <>
      {" "}
      {/* {loading ? (
        <LoaderPaperComponent />
      ) : error ? (
        <Alert
          severity={error?.severity ?? "error"}
          errorMsg={error?.error_msg ?? "Error"}
          errorDetail={error?.error_detail ?? ""}
        />
      ) : ( */}
      <Grid container spacing={0} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={8} sm={8} lg={8} xl={8}>
          <Carousel
            showArrows={false}
            showThumbs={false}
            showStatus={true}
            showIndicators={true}
            useKeyboardArrows={true}
            statusFormatter={(current, total): any => (
              <div
                style={{
                  padding: "10px",
                  fontSize: "17px",
                  position: "relative",
                  top: "17.7em",
                }}
              >{`${current} of ${total}`}</div>
            )}
            infiniteLoop={false}
            centerMode={true}
            centerSlidePercentage={100}
            selectedItem={0}
            emulateTouch={false}
            // @ts-ignore
            style={{
              paddingLeft: "40px !important",
            }}
            width="90%"
          >
            {chequeImageURL && chequeImageURL.length > 0 ? (
              chequeImageURL.map((imageUrl, index) => (
                <div
                  key={index}
                  style={{
                    paddingLeft: "40px",
                    marginBottom: "5px",
                  }}
                >
                  <Card
                    key={index}
                    sx={{
                      color: "white",
                      background: "var(--theme-color1)",
                      cursor: "grab",
                      transform: `rotate(${rotate}deg)`,
                      Width: "100%",
                    }}
                  >
                    <CardContent
                      style={{
                        padding: "2px 2px 23px 2px",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <img
                          src={imageUrl}
                          alt={`image-${index}`}
                          style={{ height: "100%", width: "100%" }}
                        />
                      </div>
                    </CardContent>
                  </Card>{" "}
                </div>
              ))
            ) : (
              <div
                style={{
                  paddingLeft: "40px",
                  marginBottom: "5px",
                }}
              >
                <Card
                  sx={{
                    color: "white",
                    background: "var(--theme-color1)",
                    cursor: "grab",
                    transform: `rotate(${rotate}deg)`,
                    Width: "100%",
                    height: "100%",
                  }}
                >
                  <CardContent
                  // style={{
                  //   padding: "2px 2px 24px 2px",
                  // }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      {" "}
                      <img
                        src={noPhotoAvailble}
                        style={{ height: "100%", width: "100%" }}
                      />{" "}
                      {/* <h1
                        style={{
                          width: "160px",
                          paddingTop: "50px",
                          color: "var(--theme-color2)",
                          fontSize: "40px",
                          margin: "0 auto ",
                        }}
                      >
                        Photo not available
                      </h1> */}
                    </div>
                  </CardContent>
                </Card>{" "}
              </div>
            )}
          </Carousel>{" "}
        </Grid>
        <>
          <Grid item xs={12} md={4} sm={4} lg={4} xl={4}>
            <div style={{ paddingRight: "40px" }}>
              <Card
                sx={{
                  color: "white",
                  background: "var(--theme-color1)",
                  display: "block",
                  margin: "0 auto",
                  width: "100%",
                  height: "100%",
                }}
              >
                <CardContent
                  style={{
                    padding: "2px",
                    overflow: "hidden",
                  }}
                >
                  {signImageURL ? (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={Boolean(signImageURL) ? signImageURL : ""}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        alt="Sign"
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={noPhotoAvailble}
                        style={{ height: "100%", width: "100%" }}
                      />{" "}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </Grid>
        </>
      </Grid>
      {/* )} */}
    </>
  );
};
