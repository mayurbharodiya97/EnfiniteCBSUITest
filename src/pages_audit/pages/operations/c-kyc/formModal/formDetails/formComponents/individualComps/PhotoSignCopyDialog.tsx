import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
  FC,
  CSSProperties,
  useMemo,
  Fragment,
} from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "../../../../api";
import { CkycContext } from "pages_audit/pages/operations/c-kyc/CkycContext";
import { AuthContext } from "pages_audit/auth";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Slider,
  Tooltip,
  Typography,
  makeStyles,
} from "@mui/material";
import { transformFileObject } from "components/fileUpload/utils";
import { utilFunction } from "components/utils";
import { useSnackbar } from "notistack";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { queryClient } from "cache";
import { useStyles } from "./style";
import { useTranslation } from "react-i18next";
import AvatarEditor from "react-avatar-editor";
import { GradientButton } from "components/styledComponent/button";
import { useLocation } from "react-router-dom";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { GridMetaDataType } from "components/dataTableStatic";
import { PhotoHistoryMetadata } from "../../metadata/photohistoryMetadata";
import { ActionTypes } from "components/dataTable";
import _ from "lodash";

interface PhotoSignProps {
  open: boolean;
  onClose: any;
  //   componentIn?: string;
  //   formMode?: string;
  //   setFormMode?: any;
  //   isHistoryGridVisible?: boolean;
  //   setIsHistoryGridVisible?: any;
  //   isSaveDisabled?: boolean;
  //   setIsSaveDisabled?: any;
  //   dialogAction?: "close" | "cancel" | "save" | null;
  //   setDialogAction?: any;
  //   dialogOpen?: boolean;
  //   setDialogOpen?: any;
}

const PhotoSignatureCpyDialog: FC<PhotoSignProps> = (props) => {
  const { open, onClose } = props;

  const {
    state,
    handleFormDataonSavectx,
    handleColTabChangectx,
    handlePhotoOrSignctx,
    handleStepStatusctx,
    handleModifiedColsctx,
  } = useContext(CkycContext);
  const { authState } = useContext(AuthContext);
  const classes = useStyles();

  const submitBtnRef = useRef<any | null>(null);
  const [filecnt, setFilecnt] = useState(0);
  const photoFileURL = useRef<any | null>(null);
  const photoUploadControl = useRef<any | null>(null);
  const signUploadControl = useRef<any | null>(null);
  const photoFilesdata = useRef<any | null>(null);
  const fileName = useRef<any | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  // const headerClasses = useTypeStyles();

  const signFileURL = useRef<any | null>(null);
  const signFilesdata = useRef<any | null>(null);
  const { t } = useTranslation();
  const location: any = useLocation();

  const [activePhotoHist, setActivePhotoHist] = useState<any>(null);

  const [formMode, setFormMode] = useState<any>("view");
  const [isHistoryGridVisible, setIsHistoryGridVisible] =
    useState<boolean>(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);
  const [dialogAction, setDialogAction] = useState<
    "close" | "cancel" | "save" | null
  >(null);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  let customerData = {};
  useEffect(() => {
    if (location.state && location.state.length > 0) {
      let data = location.state?.[0]?.data;
      customerData = data;
    }
  }, []);
  //   console.log("skjvciwhecfvwrefv", location);
  //   const mutation: any = useMutation(API.updatePhotoSignData, {
  //     onSuccess: (data) => {
  //       // // console.log("photohistory", data)
  //       // setPhotoHistory(data)
  //       // let activeHistory = null
  //       // activeHistory = (data && data.length>0) && data.findLast(el => el.ACT_FLAG === "Y")
  //       // setActivePhotoHist(activeHistory)
  //       // // console.log("photohistory ac", activeHistory)
  //     },
  //     onError: (error: any) => {},
  //   });

  //   const onSave = () => {};

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
      CUSTOMER_ID: location?.state?.[0]?.id,
    })
  );

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
    if (activePhotoHist) {
      // console.log("asdqwdq", PhotoHistoryData, activePhotoHist)
      setPhotoImageURL(activePhotoHist.CUST_PHOTO, "photo");
      setPhotoImageURL(activePhotoHist.CUST_SIGN, "sign");
    }
  }, [activePhotoHist]);

  useEffect(() => {
    if (dialogAction == "cancel") {
      if (!isSaveDisabled) {
        setDialogOpen(true);
      }
    }
  }, [dialogAction]);

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
          margin: "10px",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
          fontWeight: "light",
          borderRadius: "inherit",
          minWidth: "450px",
          py: 1,

          display: "flex",
          mx: 1,
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
            <Button onClick={() => setFormMode("edit")}>Edit</Button>
          )}
          {formMode === "edit" && (
            <Button disabled={isSaveDisabled} onClick={() => {}}>
              Save
            </Button>
          )}

          {formMode === "edit" && (
            <Button
              onClick={() => {
                setFormMode("view");
                setDialogAction("cancel");
              }}
            >
              Cancel
            </Button>
          )}
          {formMode === "view" && (
            <Button
              onClick={() => {
                setDialogAction(null);
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
            {formMode === "view" ? "View Mode" : "Edit Mode"}
          </div>
        </div>
      </DialogTitle>
      <DialogContent>
        <>
          <Grid container>
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
              <Tooltip
                key={"tooltip-" + formMode}
                title={
                  formMode !== "edit"
                    ? // formMode === "view" || formMode === "confirm"
                      ""
                    : "Click to upload the Photo Image"
                } // temp
                placement={"top"}
                arrow={true}
              >
                <div
                  className={classes.uploadWrapper}
                  style={{
                    // width: "100%",
                    width: "300px",
                    height: "190px",
                    background: "#cfcfcf",
                    cursor:
                      // formMode === "edit" || formMode === "add" //temp
                      formMode === "edit" //temp
                        ? "pointer"
                        : "auto",
                    margin: "10px",
                    padding: "4px",
                  }}
                  // onDoubleClick={() => {
                  //   if (formMode === "edit" || formMode === "add") {
                  //     fileUploadControl?.current?.click();
                  //   }
                  // }}
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
                  {/* {formMode === "edit" || formMode === "add" ? ( //temp */}
                  {formMode === "edit" ? (
                    <div
                      className="image-upload-icon"
                      onClick={() => photoUploadControl?.current?.click()} //temp
                      style={{
                        width: "300px",
                        height: "190px",
                        borderRadius: "5%",
                      }}
                    >
                      <IconButton>
                        <AddAPhotoIcon htmlColor="white" />
                      </IconButton>
                      <Typography
                        component={"span"}
                        style={{
                          margin: "0",
                          color: "white",
                          lineHeight: "1.5",
                          fontSize: "0.75rem",
                          fontFamily: "Public Sans,sans-serif",
                          fontWeight: "400",
                        }}
                      >
                        Upload Photo Image
                      </Typography>
                      <input
                        name="fileselect"
                        type="file"
                        style={{ display: "none" }}
                        ref={photoUploadControl} //temp
                        onChange={(event) => handleFileSelect(event, "photo")} //temp
                        accept="image/*"
                        onClick={(e) => {
                          // console.log("kwqdiuqhiuwqgdeqweq e1", e)
                          //to clear the file uploaded state to reupload the same file (AKA allow our handler to handle duplicate file)
                          //@ts-ignore
                          e.target.value = "";
                        }}
                      />
                    </div>
                  ) : (
                    <input
                      name="fileselect"
                      type="file"
                      style={{ display: "none" }}
                      ref={photoUploadControl} // temp
                      onChange={(event) => handleFileSelect(event, "photo")} //temp
                      accept="image/*"
                      onClick={(e) => {
                        // console.log("kwqdiuqhiuwqgdeqweq e2", e)
                        //to clear the file uploaded state to reupload the same file (AKA allow our handler to handle duplicate file)
                        //@ts-ignore
                        e.target.value = "";
                      }}
                    />
                  )}
                </div>
              </Tooltip>
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
              <Tooltip
                key={"tooltip-" + formMode}
                title={
                  formMode !== "edit"
                    ? // formMode === "view" || formMode === "confirm"
                      ""
                    : "Click to upload the Signature Image"
                } // temp
                placement={"top"}
                arrow={true}
              >
                <div
                  className={classes.uploadWrapper}
                  style={{
                    // width: "100%",
                    width: "300px",
                    height: "190px",
                    background: "#cfcfcf",
                    cursor:
                      // formMode === "edit" || formMode === "add" //temp
                      formMode === "edit" //temp
                        ? "pointer"
                        : "auto",
                    margin: "10px",
                    padding: "4px",
                  }}
                  // onDoubleClick={() => {
                  //   if (formMode === "edit" || formMode === "add") {
                  //     fileUploadControl?.current?.click();
                  //   }
                  // }}
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
                  {/* {formMode === "edit" || formMode === "add" ? ( //temp */}
                  {formMode === "edit" ? (
                    <div
                      className="image-upload-icon"
                      onClick={() => signUploadControl?.current?.click()} //temp
                      style={{
                        width: "300px",
                        height: "190px",
                        borderRadius: "5%",
                      }}
                    >
                      <IconButton>
                        <AddAPhotoIcon htmlColor="white" />
                      </IconButton>
                      <Typography
                        component={"span"}
                        style={{
                          margin: "0",
                          color: "white",
                          lineHeight: "1.5",
                          fontSize: "0.75rem",
                          fontFamily: "Public Sans,sans-serif",
                          fontWeight: "400",
                        }}
                      >
                        Upload Signature Image
                      </Typography>
                      <input
                        name="fileselect"
                        type="file"
                        style={{ display: "none" }}
                        ref={signUploadControl} //temp
                        onChange={(event) => handleFileSelect(event, "sign")} //temp
                        accept="image/*"
                        onClick={(e) => {
                          //to clear the file uploaded state to reupload the same file (AKA allow our handler to handle duplicate file)
                          //@ts-ignore
                          e.target.value = "";
                        }}
                      />
                    </div>
                  ) : (
                    <input
                      name="fileselect"
                      type="file"
                      style={{ display: "none" }}
                      ref={signUploadControl} // temp
                      onChange={(event) => handleFileSelect(event, "sign")} //temp
                      accept="image/*"
                      onClick={(e) => {
                        //to clear the file uploaded state to reupload the same file (AKA allow our handler to handle duplicate file)
                        //@ts-ignore
                        e.target.value = "";
                      }}
                    />
                  )}
                </div>
              </Tooltip>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              style={{ padding: "0px 10px 10px 20px" }}
            >
              {/* {formMode === "edit" || formMode === "add" ? ( //temp */}
              {formMode === "edit" ? (
                <>
                  <Typography
                    // className={headerClasses.typography}
                    color="inherit"
                    variant={"h6"}
                    component="div"
                  >
                    Note:
                  </Typography>
                  <Typography
                    // className={headerClasses.typography}
                    color="inherit"
                    variant={"h6"}
                    component="div"
                    style={{ fontSize: "inherit" }}
                  >
                    <ul style={{ paddingLeft: "15px" }}>
                      <li>Click on the Image box to upload Image.</li>
                      <li>Maximum Image Size should be 5 MB.</li>
                      <li>Image format should be JPEG and PNG.</li>
                    </ul>
                  </Typography>
                </>
              ) : (
                <></>
              )}
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

            {dialogOpen && (
              <Dialog
                open={true}
                maxWidth="sm"
                PaperProps={{
                  style: {
                    minWidth: "40%",
                    width: "40%",
                    // maxWidth: "90%",
                  },
                }}
              >
                <DialogTitle
                  sx={{
                    background: "var(--theme-color3)",
                    color: "var(--theme-color2)",
                    letterSpacing: "1.3px",
                    margin: "10px",
                    boxShadow:
                      "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
                    fontWeight: "light",
                    borderRadius: "inherit",
                    minWidth: "450px",
                    py: 1,

                    display: "flex",
                    mx: 1,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  id="data-lost-confirmation"
                >
                  <Typography variant="h6">Confirmation</Typography>
                </DialogTitle>
                <DialogContent>
                  <Typography variant="body1">
                    Your changes will be removed.
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <GradientButton
                    onClick={() => {
                      setDialogOpen(false);
                      setDialogAction(null);
                      setIsSaveDisabled(true);
                    }}
                  >
                    Cancel
                  </GradientButton>
                  <GradientButton
                    onClick={() => {
                      setPhotoImageURL(activePhotoHist.CUST_PHOTO, "photo");
                      setPhotoImageURL(activePhotoHist.CUST_SIGN, "sign");
                      setDialogOpen(false);
                      setDialogAction(null);
                      setIsSaveDisabled(true);
                    }}
                  >
                    Ok
                  </GradientButton>
                </DialogActions>
              </Dialog>
            )}
          </Grid>
        </>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoSignatureCpyDialog;
