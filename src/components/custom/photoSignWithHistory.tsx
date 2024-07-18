import { AppBar, CircularProgress, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { utilFunction } from "components/utils";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { PhotoHistoryMetadata } from "pages_audit/pages/operations/c-kyc/formModal/formDetails/metadata/photohistoryMetadata";
import { useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { GeneralAPI } from "registry/fns/functions";
import { GridMetaDataType } from "components/dataTableStatic";
import { Alert } from "components/common/alert";

const PhotoSignWithHistory = ({
  CUSTOMER_ID, 
  REQ_CD,
  isHistoryGridVisible
}: {
  CUSTOMER_ID: any;
  REQ_CD: any;
  isHistoryGridVisible: boolean;
}) => {
    const { authState } = useContext(AuthContext);
    const submitBtnRef = useRef<any | null>(null);
    const [filecnt, setFilecnt] = useState(0);
    const photoFileURL = useRef<any | null>(null);
    const signFileURL = useRef<any | null>(null);

    // latest photo/sign data
    const {
      data: LatestPhotoSignData,
      isError: isLatestDtlError,
      isLoading: isLatestDtlLoading,
      isFetching: isLatestDtlFetching,
      refetch: LatestDtlRefetch,
      error: LatestDtlError,
    } = useQuery<any, any>(["getLatestPhotoSign"], () =>
      GeneralAPI.getCustLatestDtl({
        COMP_CD: authState?.companyID ?? "",
        CUSTOMER_ID: CUSTOMER_ID,
        REQ_CD: REQ_CD ?? ""
      })
    );

    // photo/sign history
    const {
      data: PhotoHistoryData,
      isError: isPhotoHistoryError,
      isLoading: isPhotoHistoryLoading,
      isFetching: isPhotoHistoryFetching,
      refetch: photoHistoryRefetch,
      error: photoHistoryError,
    } = useQuery<any, any>(["getPhotoSignHistory", {}], () =>
      GeneralAPI.getPhotoSignHistory({
        COMP_CD: authState?.companyID ?? "",
        CUSTOMER_ID: CUSTOMER_ID,
        REQ_CD: REQ_CD ?? ""
      })
    );

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

    useEffect(() => {
      if(LatestPhotoSignData && !isLatestDtlLoading) {
        let custPhoto = LatestPhotoSignData?.[0]?.CUST_PHOTO;
        let custSign = LatestPhotoSignData?.[0]?.CUST_SIGN;
        if(custPhoto) {
          setPhotoImageURL(custPhoto, "photo");
        }
        if(custSign) {
          setPhotoImageURL(custSign, "sign");
        }
      }
    }, [LatestPhotoSignData, isLatestDtlLoading])  

    return (
        <Grid container sx={{px:"1"}}>

          {isLatestDtlError && (
              <AppBar position="relative" color="primary">
                  <Alert
                  severity="error"
                  errorMsg={LatestDtlError?.error_msg ?? "Unknow Error"}
                  errorDetail={LatestDtlError?.error_detail ?? ""}
                  color="error"
                  />
              </AppBar>
            )
          }
          <Grid container
          sx={{
            columnGap: "10px",
            justifyContent: "space-around",
            backgroundColor: "var(--theme-color2)"
          }}
          >
            <Grid item xs={12} sm={6} md={6}
            style={{ 
              paddingBottom: "10px", 
              display:"flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "350px",
              maxWidth: "350px"
             }}
            >
                <Typography
                    color="inherit"
                    variant={"h6"}
                    component="div"
                >
                    Photo Image
                </Typography>
                <div
                //   className={classes.uploadWrapper}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // width: "100%",
                    width: "300px",
                    height: "190px",
                    background: "#cfcfcf",
                    cursor: "auto",
                    // margin: "10px",
                    // padding: "4px",
                  }}
                  ref={submitBtnRef} //temp
                  key={"div" + filecnt} //temp
                >
                  <Grid
                    container
                    spacing={0}
                    justifyContent="center"
                    alignItems="center"
                    sx={{display: "flex", alignItems: "center", justifyContent: "center"}}
                  >
                    {
                      isLatestDtlLoading ? (
                        <CircularProgress
                          color="secondary"
                          size={30}
                          sx={{ marginRight: "8px" }}
                          variant="indeterminate"
                        />
                      ) : (
                        <img
                          src={
                            Boolean(photoFileURL.current)
                              ? photoFileURL.current
                              : ""
                          } //temp
                          alt="No Image Found"
                          style={{
                            maxWidth: "300px",
                            minWidth: "300px",
                            maxHeight: "190px",
                            minHeight: "190px",
                          }}
                        />
                      )
                    }                    
                  </Grid>
                    {/* <input
                      name="fileselect"
                      type="file"
                      style={{ display: "none" }}
                      ref={photoUploadControl} // temp
                    //   onChange={(event) => handleFileSelect(event, "photo")} //temp
                      accept="image/*"
                      onClick={(e) => {}}
                    /> */}
                </div>
            </Grid>

            <Grid item xs={12} sm={6} md={6} style={{ 
              paddingBottom: "10px",
              display:"flex",
              flexDirection: "column",
              alignItems: "flex-start",
              maxWidth: "350px"
            }}>
              <Typography
                // className={headerClasses.title}
                color="inherit"
                variant={"h6"}
                component="div"
              >
                Signature Image
              </Typography>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // width: "100%",
                    width: "300px",
                    height: "190px",
                    background: "#cfcfcf",
                    cursor: "auto",
                    // margin: "10px",
                    // padding: "4px",
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
                    {
                      isLatestDtlLoading ? (
                        <CircularProgress
                          color="secondary"
                          size={30}
                          sx={{ marginRight: "8px" }}
                          variant="indeterminate"
                        />
                      ) : (
                        <img
                          src={
                            Boolean(signFileURL.current) ? signFileURL.current : ""
                          } //temp
                          alt="No Image Found"
                          style={{
                            maxWidth: "300px",
                            minWidth: "300px",
                            maxHeight: "190px",
                            minHeight: "190px",
                          }}
                        />
                      )
                    }
                  </Grid>
                    {/* <input
                      name="fileselect"
                      type="file"
                      style={{ display: "none" }}
                    //   ref={signUploadControl} // temp
                    //   onChange={(event) => handleFileSelect(event, "sign")} //temp
                      accept="image/*"
                      onClick={(e) => {}}
                    /> */}
                </div>
            </Grid>
          </Grid>

          {isPhotoHistoryError && (
              <AppBar position="relative" color="primary">
                <Alert
                severity="error"
                errorMsg={photoHistoryError?.error_msg ?? "Unknow Error"}
                errorDetail={photoHistoryError?.error_detail ?? ""}
                color="error"
                />
              </AppBar>
            )
          }
          {isHistoryGridVisible && (
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
    )
}

export default PhotoSignWithHistory;