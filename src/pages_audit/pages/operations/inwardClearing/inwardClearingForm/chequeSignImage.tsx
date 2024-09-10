import { FC, useEffect, useRef, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Grid, Card, CardContent, Dialog, Theme } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import { utilFunction } from "components/utils";
import noPhotoAvailble from "../../../../../assets/images/noPhotoAvailble.png";
import AvatarEditor from "react-avatar-editor";
import { GradientButton } from "components/styledComponent/button";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";

const useTypeStyles = makeStyles((theme: Theme) => ({
  printHidden: {
    "@media print": {
      display: "none !important",
    },
  },
}));
export const ChequeSignImage: FC<{
  imgData?: any;
  loading?: any;
  error?: any;
  acSignImage?: any;
  isVisibleSign?: any;
}> = ({ imgData, loading, error, acSignImage, isVisibleSign }) => {
  const classes = useTypeStyles();
  const [chequeImageURL, setChequeImageURL] = useState<any>(null);
  const [signImageURL, setSignImageURL] = useState<any>();
  const urlObj = useRef<any>(null);
  const [isOpen, setIsOpen] = useState<any>(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [rotateImg, setRotate] = useState<number>(0);
  const { t } = useTranslation();

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
              >{`${current} "of" ${total}`}</div>
            )}
            renderIndicator={(onClickHandler, isSelected, index, label) => {
              if (!(chequeImageURL && chequeImageURL.length > 0)) return null;
              const indicatorLabel =
                index === 0
                  ? t("FrontGrey")
                  : index === 2
                  ? t("BackImage")
                  : t("BlackWhite");

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
                        padding: "2px 2px 30px 2px",
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
                          // style={{ height: "100%", width: "100%" }}
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
                      <img
                        src={noPhotoAvailble}
                        style={{ width: "100%", height: "100%" }} // Set image width and height to 100% to fill its container
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </Carousel>{" "}
        </Grid>
        <>
          {isVisibleSign === undefined ? (
            <>
              {console.log("test before", isVisibleSign)}
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
                          <img src={noPhotoAvailble} alt="No Photo Available" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </Grid>
            </>
          ) : null}
        </>
      </Grid>
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
            <GradientButton
              className={classes.printHidden}
              onClick={handleRotateChange}
            >
              {rotateImg === 0 ? t("Rotate") : t("Reset")}
            </GradientButton>
            <GradientButton
              onClick={() => {
                window.print();
              }}
              className={classes.printHidden}
            >
              {t("Print")}
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
