import { FC, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Dialog from "@mui/material/Dialog";
import { GradientButton } from "components/styledComponent/button";
import {
  AppBar,
  Grid,
  Toolbar,
  Typography,
  Theme,
  Card,
  CardContent,
  Slider,
} from "@mui/material";
import * as API from "../api";
import { makeStyles } from "@mui/styles";
import { Carousel } from "react-responsive-carousel";
import { utilFunction } from "components/utils";
const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },

  refreshiconhover: {},
}));

export const ChequeSignForm: FC<{
  onClose?: any;
  reqDataRef?: any;
}> = ({ onClose, reqDataRef }) => {
  const headerClasses = useTypeStyles();
  const [zoom, setZoomValue] = useState<number>(1);
  const [rotate, setRotate] = useState<number>(0);
  const [chequeImageURL, setChequeImageURL] = useState<any | null>(null);
  const urlObj = useRef<any>(null);
  const handleChange = (event: any, newValue: number | number[]) => {
    setZoomValue(newValue as number);
  };
  const handleRotateChange = (event: any, newValue: number | number[]) => {
    setRotate(newValue as number);
  };
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getInwardChequeSignGridData", { ...reqDataRef.current }], () =>
    API.getInwardChequeSignGridData({ ...reqDataRef.current })
  );

  useEffect(() => {
    if (Boolean(data?.[0])) {
      const images: any = [];

      if (Boolean(data[0].FR_GREY_IMG)) {
        let blob = utilFunction.base64toBlob(data[0].FR_GREY_IMG);
        urlObj.current =
          typeof blob === "object" && Boolean(blob)
            ? URL.createObjectURL(blob)
            : "";
        images.push(urlObj.current);
      }
      if (Boolean(data[0].FR_BW_IMG)) {
        let blob = utilFunction.base64toBlob(data[0].FR_BW_IMG);
        urlObj.current =
          typeof blob === "object" && Boolean(blob)
            ? URL.createObjectURL(blob)
            : "";
        images.push(urlObj.current);
      }
      if (Boolean(data[0].BACK_IMG)) {
        let blob = utilFunction.base64toBlob(data[0].BACK_IMG);
        urlObj.current =
          typeof blob === "object" && Boolean(blob)
            ? URL.createObjectURL(blob)
            : "";
        images.push(urlObj.current);
      }

      setChequeImageURL(images);
    }
  }, [data]);

  // const props = {
  //   width: "auto",
  //   height: "auto",
  //   zoomWidth: 500,
  //   img: front,
  //   zoomPosition: "original",
  // };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={true} // Assuming this is controlled by a state
        onKeyUp={(event) => {
          if (event.key === "Escape") {
            onClose();
          }
        }}
        key="chequeSignDialog"
        PaperProps={{
          style: {
            width: "70%",
            // height: "70%",
          },
        }}
      >
        <AppBar
          position="relative"
          color="secondary"
          style={{ marginBottom: "5px" }}
        >
          <Toolbar className={headerClasses.root} variant={"dense"}>
            <Typography
              className={headerClasses.title}
              color="inherit"
              variant={"h6"}
              component="div"
            >
              Customer Level Photo/Signature
            </Typography>
            <GradientButton onClick={onClose}>Close</GradientButton>
          </Toolbar>
        </AppBar>

        {/* {isLoading || isFetching ? (
          <LoaderPaperComponent />
        ) : isError ? (
          <Alert
            severity={error?.severity ?? "error"}
            errorMsg={error?.error_msg ?? "Error"}
            errorDetail={error?.error_detail ?? ""}
          />
        ) : ( */}
        <>
          <>
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
                    top: "49vh",
                  }}
                >{`${current} of ${total}`}</div>
              )}
              infiniteLoop={false}
              centerMode={true}
              centerSlidePercentage={100}
              swipeScrollTolerance={5}
              selectedItem={0}
              emulateTouch={true}
              width="95%"
            >
              {" "}
              {chequeImageURL?.map((imageUrl, index) => (
                <Card
                  key={index}
                  sx={{
                    color: "white",
                    marginLeft: "49px",
                    background: "var(--theme-color1)",
                    cursor: "pointer",
                    transform: `rotate(-${rotate}deg) scale(${zoom})`,
                  }}
                >
                  <CardContent
                    style={{
                      padding: "2px 2px 30px 2px",
                      width: "100%",
                      minHeight: "300px",
                      backgroundColor: "teal",
                    }}
                  >
                    {/* <>
                      <ImageZoom
                        {...props}
                        // style={{
                        //   height: "50vh",
                        //   objectFit: "fill",
                        // }}
                      /> */}
                    {/* </> */}
                    <img
                      key={index}
                      src={Boolean(imageUrl) ? imageUrl : ""}
                      alt={`image-${imageUrl}`}
                      style={{
                        height: "50vh",
                        objectFit: "fill",
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
            </Carousel>
          </>
          <Grid
            container
            spacing={0}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12} md={6} sm={6} lg={6} xl={6}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography sx={{ marginTop: "4px", marginRight: "4px" }}>
                  Zoom:
                </Typography>
                <Slider
                  value={zoom}
                  onChange={handleChange}
                  aria-labelledby="continuous-slider"
                  color="secondary"
                  defaultValue={1}
                  step={0.1}
                  min={0.2}
                  max={3}
                  style={{ width: "70%" }}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6} sm={6} lg={6} xl={6}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography sx={{ marginTop: "4px", marginRight: "14px" }}>
                  Rotate :
                </Typography>
                <Slider
                  value={rotate}
                  onChange={handleRotateChange}
                  aria-labelledby="continuous-slider"
                  color="secondary"
                  defaultValue={0}
                  step={1}
                  min={0}
                  max={360}
                  style={{ width: "65%" }}
                />
              </div>
            </Grid>
          </Grid>
        </>
        {/* // )} */}
      </Dialog>
    </>
  );
};
