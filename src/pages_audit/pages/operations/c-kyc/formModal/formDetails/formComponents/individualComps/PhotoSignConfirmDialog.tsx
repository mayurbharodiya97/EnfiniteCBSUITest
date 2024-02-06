import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  FC,
} from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "../../../../api";
import { CkycContext } from "pages_audit/pages/operations/c-kyc/CkycContext";
import { AuthContext } from "pages_audit/auth";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import { transformFileObject } from "components/fileUpload/utils";
import { utilFunction } from "components/utils";
import { useSnackbar } from "notistack";
import { queryClient } from "cache";
import { useStyles } from "./style";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { GridMetaDataType } from "components/dataTableStatic";
import { PhotoHistoryMetadata } from "../../metadata/photohistoryMetadata";
import _ from "lodash";
import { Alert } from "components/common/alert";

interface PhotoSignProps {
  open: boolean;
  onClose: any;
}

const PhotoSignConfirmDialog: FC<PhotoSignProps> = (props) => {
  const { open, onClose } = props;

  const {
    state,
    handlePhotoOrSignctx,
  } = useContext(CkycContext);
  const { authState } = useContext(AuthContext);
  const classes = useStyles();

  const submitBtnRef = useRef<any | null>(null);
  const [filecnt, setFilecnt] = useState(0);
  const photoFileURL = useRef<any | null>(null);
  const photoUploadControl = useRef<any | null>(null);
  const signUploadControl = useRef<any | null>(null);
  const photoFilesdata = useRef<any | null>("");
  const fileName = useRef<any | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  // const headerClasses = useTypeStyles();

  const signFileURL = useRef<any | null>(null);
  const signFilesdata = useRef<any | null>("");
  const { t } = useTranslation();
  const location: any = useLocation();

  const [activePhotoHist, setActivePhotoHist] = useState<any>(null);
  const formMode = "view"
  const [isHistoryGridVisible, setIsHistoryGridVisible] =
    useState<boolean>(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);

  const [customerData, setCustomerData] = useState<any>({});
  // const [custData, setCustData] = useState<any>({});

  // useEffect(() => {
  //   if (location.state && location.state.length > 0) {
  //     setCustData(location.state?.[0]?.data);
  //   }
  // }, [location]);

  // useEffect(() => {
  //   console.log("photoBase64ctx, signBase64ctx", Boolean(state?.photoBase64ctx), Boolean(state?.signBase64ctx))
  // }, [state?.photoBase64ctx, state?.signBase64ctx])

  // let customerData = {};
  useEffect(() => {
    if (location.state && location.state.length > 0) {
      // console.log("locationdata", location.state)
      let data = location.state?.[0]?.data;
      setCustomerData(data);
    }
  }, [location]);
  //   console.log("skjvciwhecfvwrefv", location);

  // to get photo/sign history, on edit
  const {
    data: PhotoHistoryData,
    isError: isPhotoHistoryError,
    isLoading: isPhotoHistoryLoading,
    isFetching: isPhotoHistoryFetching,
    refetch: photoHistoryRefetch,
    error: photoHistoryError,
  } = useQuery<any, any>(["getPhotoSignHistory", {}], () =>
    API.getPhotoSignHistory({
      COMP_CD: authState?.companyID ?? "",
      CUSTOMER_ID: location?.state?.[0]?.data.CUSTOMER_ID,
    })
  );

  const mutation: any = useMutation(API.getCustomerDetailsonEdit, {
    onSuccess: (data) => {
      // console.log(data, "getcustdtmtgltdngk")
      if(data && data.length>0) {
        if(data?.[0]?.PHOTO_MST) {
          let CUST_PHOTO = data?.[0]?.PHOTO_MST?.CUST_PHOTO ?? "";
          let CUST_SIGN = data?.[0]?.PHOTO_MST?.CUST_SIGN ?? "";

          handlePhotoOrSignctx(null, CUST_PHOTO, "photo")
          handlePhotoOrSignctx(null, CUST_SIGN, "sign")
          // console.log("asdqwdq", PhotoHistoryData, activePhotoHist)
          setPhotoImageURL(CUST_PHOTO, "photo");
          setPhotoImageURL(CUST_SIGN, "sign");
          photoFilesdata.current = CUST_PHOTO;
          signFilesdata.current = CUST_SIGN;  
        }
      }
    },
    onError: (error: any) => {},
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getPhotoSignHistory"]);
    }
  }, [])

  useEffect(() => {
    if (!isPhotoHistoryLoading && PhotoHistoryData) {
      // console.log("photohistory", data)
      //   setPhotoHistory(PhotoHistoryData);
      let activeHistory = null;
      activeHistory =
        PhotoHistoryData &&
        PhotoHistoryData.length > 0 &&
        PhotoHistoryData.findLast((el) => el.ACT_FLAG === "Y");
        setActivePhotoHist(activeHistory);
      // console.log("photohistory ac", activeHistory)
    }
  }, [PhotoHistoryData, isPhotoHistoryLoading]);

  // set photo, sign url from history api active record, on edit
  useEffect(() => {
    // if (activePhotoHist) {
      // console.log(!Boolean(customerData.REQUEST_ID), "asdasdasd1", customerData)
      if(customerData && !Boolean(customerData.REQUEST_ID)) {
        // console.log("asdasdasd2", activePhotoHist)
        if (activePhotoHist) {
          handlePhotoOrSignctx(null, activePhotoHist.CUST_PHOTO, "photo")
          handlePhotoOrSignctx(null, activePhotoHist.CUST_SIGN, "sign")
          // console.log("asdqwdq", PhotoHistoryData, activePhotoHist)
          setPhotoImageURL(activePhotoHist.CUST_PHOTO, "photo");
          setPhotoImageURL(activePhotoHist.CUST_SIGN, "sign");
          photoFilesdata.current = activePhotoHist.CUST_PHOTO;
          signFilesdata.current = activePhotoHist.CUST_SIGN;
        }
      } else if(customerData && Boolean(customerData.REQUEST_ID)) {
        let payload: {COMP_CD: string, REQUEST_CD?:string, CUSTOMER_ID?:string} = {
          COMP_CD: authState?.companyID ?? "",
        }
        payload["REQUEST_CD"] = customerData.REQUEST_ID;
        mutation.mutate(payload)
      }
    // }
  }, [activePhotoHist]);

  const updateMutation: any = useMutation(API.updatePhotoSignData, {
    onSuccess: (data, payload) => {
      handlePhotoOrSignctx(null, payload.PHOTO_DTL.CUST_PHOTO, "photo")
      handlePhotoOrSignctx(null, payload.PHOTO_DTL.CUST_SIGN, "sign")

      // photoHistoryRefetch()
      // console.log(payload, "datatdastdastdasd", data);
      setIsSaveDisabled(true)
    },
    onError: (error: any) => {
      // console.log("datatdastdastdasd error", error);
    },
  });

  // useEffect(() => {
  //   console.log("dialogAction, isSaveDisabled, formMode", dialogAction, isSaveDisabled, formMode)
  // }, [dialogAction, isSaveDisabled, formMode])

  // set image url by getting response in base64, convert to blob;, on edit
  const setPhotoImageURL = async (filedata, img: string) => {
    if (filedata && filedata !== null && filedata.length > 6) {
      let blob = utilFunction.base64toBlob(filedata, "image/png");
      if (img === "photo") {
        photoFileURL.current =
          typeof blob === "object" && Boolean(blob)
            ? await URL.createObjectURL(blob as any)
            : null;
      } else if (img === "sign") {
        signFileURL.current =
          typeof blob === "object" && Boolean(blob)
            ? await URL.createObjectURL(blob as any)
            : null;
      }
      setFilecnt(filecnt + 1);
    } else {
      if (img === "photo") {
        photoFileURL.current = null;
      } else if (img === "sign") {
        signFileURL.current = null;
      }
    }
  };

  // custom blob creation from selected file blob
  const customTransformFileObj = (currentObj) => {
    return transformFileObject({})(currentObj);
  };

  // get base64 from blob and save in store state
  const setImageData = async (blob, img: string) => {
    let base64 = await utilFunction.convertBlobToBase64(blob);
    // console.log("kwqdiuqhiuwqgdeqweq base64", base64)
    if (img === "photo") {
      photoFilesdata.current = base64?.[1];
    } else if (img === "sign") {
      signFilesdata.current = base64?.[1];
    }
    // console.log("aqdqwedqwedqwe", blob, base64, img)
  };

  // on file selection/change
  const handleFileSelect = async (e, img: string) => {
    // console.log("kwqdiuqhiuwqgdeqweq", e)
    const files = e.target.files;
    const filesArray = Array.from(files);
    if (filesArray.length > 0) {
      let resdata = filesArray.map(
        async (one) => await customTransformFileObj(one)
      );
      if (resdata.length > 0) {
        let filesObj: any = await Promise.all(resdata);
        // console.log(filesObj, "kwqdiuqhiuwqgdeqweq", resdata)
        let fileExt = filesObj?.[0]?.fileExt?.toUpperCase();
        if (fileExt === "JPG" || fileExt === "JPEG" || fileExt === "PNG") {
          let fileSize = filesObj?.[0]?.size / 1024 / 1024;

          if (fileSize <= 5) {
            if (img === "photo") {
              photoFileURL.current =
                typeof filesObj?.[0]?.blob === "object" &&
                Boolean(filesObj?.[0]?.blob)
                  ? await URL.createObjectURL(filesObj?.[0]?.blob as any)
                  : null;
            } else if (img === "sign") {
              signFileURL.current =
                typeof filesObj?.[0]?.blob === "object" &&
                Boolean(filesObj?.[0]?.blob)
                  ? await URL.createObjectURL(filesObj?.[0]?.blob as any)
                  : null;
            }
            // console.log("kwqdiuqhiuwqgdeqweq url", photoFileURL.current, typeof photoFileURL.current)
            setImageData(filesObj?.[0]?.blob, img);

            fileName.current = filesObj?.[0]?.blob?.name;
            //submitBtnRef.current?.click?.();
            setFilecnt(filecnt + 1);
            if (isSaveDisabled) {
              setIsSaveDisabled(false);
            }
          } else {
            enqueueSnackbar("Image size should be less than 5 MB.", {
              variant: "warning",
            });
          }
        } else {
          enqueueSnackbar("Please Select Valid Format.", {
            variant: "warning",
          });
        }
      }
    }
  };

  // useEffect(() => {
  //   if (activePhotoHist) {
  //     console.log(
  //       "photoFilesdata, signFilesdata",
  //       photoFilesdata.current,
  //       signFilesdata.current,
  //       "asd",
  //       activePhotoHist.CUST_PHOTO,
  //       activePhotoHist.CUST_SIGN
  //     );
  //   }
  // }, [activePhotoHist]);

  return (
    <Dialog
      open={open}
      maxWidth="lg"
      PaperProps={{
        style: {
          minWidth: "70%",
          width: "80%",
          // maxWidth: "90%",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "var(--theme-color3)",
          color: "var(--theme-color2)",
          letterSpacing: "1.3px",
          // margin: "10px",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
          fontWeight: "light",
          borderRadius: "inherit",
          minWidth: "450px",
          py: 1,
          // mx: "auto",
          display: "flex",
          // mx: 1,
          alignItems: "center",
          justifyContent: "space-between",
        }}
        id="responsive-dialog-title"
      >
        <Typography variant="h6">{`Photo & Signature - ${location?.state?.[0]?.data?.CUSTOMER_NAME} - ${location?.state?.[0]?.id}`}</Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          {!isHistoryGridVisible && (
            <Button onClick={() => setIsHistoryGridVisible(true)}>
              View History
            </Button>
          )}
          {isHistoryGridVisible && (
            <Button onClick={() => setIsHistoryGridVisible(false)}>
              Close History
            </Button>
          )}

          {formMode === "view" && (
            <Button
              onClick={() => {
                handlePhotoOrSignctx(null, null, "photo")
                handlePhotoOrSignctx(null, null, "sign")          
                onClose();
              }}
            >
              Close
            </Button>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "150px",
              maxHeight: "50px",
              border: "1px solid #ddd",
              padding: "5px 10px",
              borderRadius: "20px",
              fontSize: "10px",
              fontWeight: "normal",
              userSelect: "none",
            }}
          >
            View Mode
          </div>
        </div>
      </DialogTitle>
      <DialogContent sx={{px: "0"}}>
        <>
          {((updateMutation.isLoading || isPhotoHistoryLoading) || mutation.isLoading) ? <LinearProgress color="secondary" /> : null}
          {updateMutation.isError ? (
            <Alert
              severity={updateMutation.error?.severity ?? "error"}
              errorMsg={updateMutation.error?.error_msg ?? "Something went to wrong.."}
              errorDetail={updateMutation.error?.error_detail}
              color="error"
            />
          ) : mutation.isError ? (
            <Alert
              severity={updateMutation.error?.severity ?? "error"}
              errorMsg={updateMutation.error?.error_msg ?? "Something went to wrong.."}
              errorDetail={updateMutation.error?.error_detail}
              color="error"
            />
          ) : isPhotoHistoryError && (
            <Alert
              severity={photoHistoryError?.severity ?? "error"}
              errorMsg={photoHistoryError?.error_msg ?? "Something went to wrong.."}
              errorDetail={photoHistoryError?.error_detail}
              color="error"
            />
          )}
          <Grid container sx={{px:"1"}}>
            {/* photo */}
            <Grid item xs={12} sm={6} md={6} style={{ paddingBottom: "10px" }}>
              <Typography
                // className={headerClasses.title}
                color="inherit"
                variant={"h6"}
                component="div"
              >
                Photo Image
              </Typography>
                <div
                  className={classes.uploadWrapper}
                  style={{
                    // width: "100%",
                    width: "300px",
                    height: "190px",
                    background: "#cfcfcf",
                    cursor: "auto",
                    margin: "10px",
                    padding: "4px",
                  }}
                  ref={submitBtnRef} //temp
                  key={"div" + filecnt} //temp
                >
                  <Grid
                    container
                    spacing={0}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <img
                      src={
                        Boolean(photoFileURL.current)
                          ? photoFileURL.current
                          : ""
                      } //temp
                      style={{
                        maxWidth: "300px",
                        minWidth: "300px",
                        maxHeight: "190px",
                        minHeight: "190px",
                      }}
                    />
                  </Grid>
                    <input
                      name="fileselect"
                      type="file"
                      style={{ display: "none" }}
                      ref={photoUploadControl} // temp
                      onChange={(event) => handleFileSelect(event, "photo")} //temp
                      accept="image/*"
                      onClick={(e) => {}}
                    />
                </div>
            </Grid>

            {/* signature */}
            <Grid item xs={12} sm={6} md={6} style={{ paddingBottom: "10px" }}>
              <Typography
                // className={headerClasses.title}
                color="inherit"
                variant={"h6"}
                component="div"
              >
                Signature Image
              </Typography>
                <div
                  className={classes.uploadWrapper}
                  style={{
                    // width: "100%",
                    width: "300px",
                    height: "190px",
                    background: "#cfcfcf",
                    cursor: "auto",
                    margin: "10px",
                    padding: "4px",
                  }}
                  ref={submitBtnRef} //temp
                  key={"div" + filecnt} //temp
                >
                  <Grid
                    container
                    spacing={0}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <img
                      src={
                        Boolean(signFileURL.current) ? signFileURL.current : ""
                      } //temp
                      style={{
                        maxWidth: "300px",
                        minWidth: "300px",
                        maxHeight: "190px",
                        minHeight: "190px",
                      }}
                    />
                  </Grid>
                    <input
                      name="fileselect"
                      type="file"
                      style={{ display: "none" }}
                      ref={signUploadControl} // temp
                      onChange={(event) => handleFileSelect(event, "sign")} //temp
                      accept="image/*"
                      onClick={(e) => {}}
                    />
                </div>
            </Grid>

            {PhotoHistoryData && isHistoryGridVisible && (
              <GridWrapper
                key={`AssetDTLGrid`}
                finalMetaData={PhotoHistoryMetadata as GridMetaDataType}
                data={PhotoHistoryData ?? []}
                setData={() => null}
                loading={isPhotoHistoryLoading || isPhotoHistoryFetching}
                // actions={actions}
                // setAction={setCurrentAction}
                // refetchData={() => assetDTLRefetch()}
                // ref={myGridRef}
              />
            )}
          </Grid>
        </>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoSignConfirmDialog;
