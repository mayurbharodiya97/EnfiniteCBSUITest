import { FC, useEffect, useRef, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  Grid,
  Card,
  CardContent,
  Dialog,
  AppBar,
  Toolbar,
  Typography,
  Theme,
} from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import { utilFunction } from "components/utils";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Alert } from "components/common/alert";
import noPhotoAvailble from "../../../../../assets/images/noPhotoAvailble.png";
import React from "react";
import AvatarEditor from "react-avatar-editor";
import { GradientButton } from "components/styledComponent/button";
import { makeStyles } from "@mui/styles";
const useTypeStyles = makeStyles((theme: Theme) => ({
  title: {
    flex: "1 1 100%",
    color: "var(--theme-color2)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  refreshiconhover: {},
}));
export const ChequeSignImage: FC<{
  imgData?: any;
  loading?: any;
  error?: any;
  acSignImage?: any;
}> = ({ imgData, loading, error, acSignImage }) => {
  const headerClasses = useTypeStyles();
  const [chequeImageURL, setChequeImageURL] = useState<any>(null);
  const [signImageURL, setSignImageURL] = useState<any>();
  const urlObj = useRef<any>(null);
  const [isOpen, setIsOpen] = useState<any>(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [rotateImg, setRotate] = useState<number>(0);

  const handleRotateChange = () => {
    const newRotateValue = (rotateImg + 90) % 360;
    setRotate(newRotateValue);
  };
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

    if (Boolean(acSignImage)) {
      let blob = utilFunction.base64toBlob(acSignImage);
      urlObj.current =
        typeof blob === "object" && Boolean(blob)
          ? URL.createObjectURL(blob)
          : "";
      setSignImageURL(urlObj.current);
    } else if (acSignImage?.length === 0) {
      setSignImageURL(null);
    } else if (Boolean(imgData?.[0]?.SIGN_IMG)) {
      let blob = utilFunction.base64toBlob(imgData?.[0]?.SIGN_IMG);
      urlObj.current =
        typeof blob === "object" && Boolean(blob)
          ? URL.createObjectURL(blob)
          : "";
      setSignImageURL(urlObj.current);
    }
  }, [imgData, acSignImage]);

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
                  top: "17.4em",
                }}
              >{`${current} of ${total}`}</div>
            )}
            renderIndicator={(onClickHandler, isSelected, index, label) => {
              if (!(chequeImageURL && chequeImageURL.length > 0)) return null;
              const indicatorLabel =
                index === 0
                  ? "Front Grey"
                  : index === 2
                  ? "Back Image"
                  : "Black & White";

              return (
                <label
                  style={{
                    marginLeft: "20px",
                    color: "var( --theme-color2)",
                  }}
                  key={index}
                >
                  {indicatorLabel}
                  <input
                    type="radio"
                    name="carouselIndicator"
                    checked={isSelected}
                    onClick={onClickHandler}
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      top: "2px",
                      left: "5px",
                      color: isSelected
                        ? "var( --theme-color1)!important"
                        : "var( --theme-color2)",
                    }}
                  />
                </label>
              );
            }}
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
                          cursor: "zoom-in",
                        }}
                        onClick={() => {
                          setSelectedImageUrl(imageUrl); // Set the clicked image URL
                          setIsOpen(true); // Open the dialog
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
                  }}
                >
                  <CardContent>
                    <div
                      style={{
                        width: "fit-content",
                        margin: "0 auto",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {" "}
                      <img
                        src={noPhotoAvailble}
                        style={{ height: "100%", width: "100%" }}
                      />{" "}
                    </div>
                  </CardContent>
                </Card>
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
                        cursor: "zoom-in",
                      }}
                      onClick={() => {
                        setSelectedImageUrl(signImageURL); // Set the clicked image URL
                        setIsOpen(true); // Open the dialog
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
      <>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          PaperProps={{
            style: {
              width: "100%",
            },
          }}
          maxWidth="lg"
        >
          <div style={{ display: "flex", justifyContent: "end" }}>
            <GradientButton onClick={handleRotateChange}>
              {rotateImg === 0 ? "Rotate" : "Reset"}
            </GradientButton>
            <GradientButton
              onClick={() => {
                window.print();
              }}
            >
              Print
            </GradientButton>
          </div>
          {rotateImg === 0 ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                cursor: "zoom-out",
                padding: "0px 6px 6px 6px",
              }}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <img
                src={selectedImageUrl}
                alt={`image-`}
                style={{
                  height: "100%",
                  width: "100%",
                }}
              />{" "}
            </div>
          ) : (
            <AvatarEditor
              image={selectedImageUrl}
              width={500}
              height={500}
              border={5}
              // onClick={() => {
              //   setIsOpen(false);
              // }}
              color={[255, 255, 255, 0.6]} // RGBA
              rotate={rotateImg}
              style={{ width: "100%", height: "100%", cursor: "pointer" }}
            />
          )}
        </Dialog>
      </>
    </>
  );
};
