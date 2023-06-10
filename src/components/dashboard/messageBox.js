import { Box, Dialog, Grid, IconButton, Typography } from "@mui/material";
import { useContext, useEffect, useState, useRef } from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import { useQuery } from "react-query";
import * as API from "./api";
import { queryClient } from "cache";
import { AuthContext } from "pages_audit/auth";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { GradientButton } from "components/styledComponent/button";
import {
  ImageViewer,
  NoPreview,
  PDFViewer,
} from "components/fileUpload/preView";
import { utilFunction } from "components/utils/utilFunctions";

export const MessageBox = ({ screenFlag = "" }) => {
  const [toggle, setToggle] = useState(false);
  const { authState } = useContext(AuthContext);
  const lastFileData = useRef(null);
  const [isOpenPdf, setIsOpenPdf] = useState(false);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const urlObj = useRef(null);
  const [loginImageURL, setLoginImageURL] = useState(null);
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery(
    [
      "getDashboardMessageBoxData",
      {
        screenFlag,
        BRANCH_CD: authState?.user?.branchCode ?? "",
        userID: authState?.user?.id ?? "",
      },
    ],
    () =>
      API.getDashboardMessageBoxData({
        screenFlag,
        BRANCH_CD: authState?.user?.branchCode ?? "",
        userID: authState?.user?.id ?? "",
      })
  );
  const dataLength = data ? data.length : 0;

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getDashboardMessageBoxData",
        {
          screenFlag,
          BRANCH_CD: authState?.user?.branchCode ?? "",
          userID: authState?.user?.id ?? "",
        },
      ]);
    };
  }, []);
  const handleClick = () => {
    setToggle(!toggle);
  };
  const handleDialogClose = () => {
    setIsOpenSave(false);
  };

  return (
    <>
      <Grid>
        <Box
          sx={{
            height: "70px",
            backgroundColor:
              screenFlag === "Announcement"
                ? "var(--theme-color4)"
                : screenFlag === "Notes"
                ? "#E2ECFD"
                : screenFlag === "Tips"
                ? "#EDE7FD"
                : screenFlag === "Alert"
                ? "#FFE5EB"
                : null,
            borderRadius: "10px",
            padding: "12px",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "9px",
            cursor: "pointer",
          }}
          onClick={handleClick}
        >
          <Grid item xl={12} lg={8} xs={12} sm={6} md={4}>
            <Typography
              // gutterBottom
              // variant="overline"
              style={{
                color: "#black",
                fontSize: "20px",
                fontWeight: "500",
                lineHeight: "24px",
                letterSpacing: "0.01em",
                marginBottom: "4px",
              }}
            >
              {`${screenFlag}`}
            </Typography>
            <Typography
              variant="h3"
              style={{
                fontSize: "15px",
                fontWeight: "500",
                color: "#949597",
                lineHeight: "27px",
              }}
            >
              {/* {`${body}`} */}
              {screenFlag === "Announcement"
                ? "Announcing New Features."
                : screenFlag === "Tips"
                ? "Be Preapared For Fruad."
                : screenFlag === "Notes"
                ? "Customer Queries Solve."
                : screenFlag === "Alert"
                ? "Low Balance Alert."
                : null}
              {/* {`${result?.data?.[0]?.BOX_BODY ?? body}`} */}
            </Typography>
          </Grid>

          <Grid
            style={{ display: "flex", justifyContent: "end" }}
            item
            xs={12}
            sm={6}
            md={4}
          >
            <Box
              sx={{
                height: "38px",
                width: "38px",
                backgroundColor: "var(--theme-color3)",
                color: "var(--theme-color2)",
                borderRadius: "12px",
                padding: "10px",
                margin: "4px 14px 0 0",
              }}
            >
              {screenFlag === "Announcement"
                ? dataLength
                : screenFlag === "Tips"
                ? dataLength
                : screenFlag === "Notes"
                ? dataLength
                : screenFlag === "Alert"
                ? dataLength
                : null}
            </Box>
            <IconButton
              color="inherit"
              style={{
                backgroundColor: "var(--theme-color2)",
                borderRadius: "10px",
                border: "0.4px solid rgba(66, 99, 199, 0.4)",
                boxShadow: "0px 5px 14px rgba(66, 99, 199, 0.2)",
                height: "45px",
                width: "45px",
              }}
            >
              {/* {`${icon}`} */}

              {screenFlag === "Announcement" ? (
                <VolumeUpRoundedIcon
                  style={{ color: " #4263C7", fontSize: "30px" }}
                />
              ) : screenFlag === "Tips" ? (
                <TipsAndUpdatesOutlinedIcon
                  style={{ color: "#885CF5", fontSize: "30px" }}
                />
              ) : screenFlag === "Notes" ? (
                <EventNoteOutlinedIcon
                  style={{ color: " #5290F5", fontSize: "30px" }}
                />
              ) : screenFlag === "Alert" ? (
                <WarningAmberRoundedIcon
                  style={{ color: " #FF4F79", fontSize: "30px" }}
                />
              ) : null}
            </IconButton>
          </Grid>
        </Box>
      </Grid>
      {toggle ? (
        <>
          {isLoading || isFetching ? (
            <LoaderPaperComponent />
          ) : (
            <Grid item xs={12} sm={12} md={12} style={{ margin: "5px" }}>
              <Box
                sx={{
                  width: "100%",
                  // maxWidth: 400,
                  bgcolor: "background.paper",
                  height: "25vh",
                  overflowY: "auto",
                  borderRadius: "10px",
                  boxShadow: "0px 11px 20px rgba(226, 236, 249, 0.5)",
                }}
              >
                <nav aria-label="main mailbox folders">
                  <List
                    style={{
                      paddingTop: "0px",
                      paddingBottom: "0px",
                    }}
                  >
                    {data.map((item, _index) => (
                      <ListItemData
                        key={"listItemforannounce" + _index}
                        name={item?.label}
                        disabled={false}
                        onClick={() => {
                          console.log("datasetswdfd", item?.UPLOAD_DOCUMENT);
                          if (Boolean(item?.UPLOAD_DOCUMENT)) {
                            lastFileData.current = {
                              UPLOAD_DOCUMENT: utilFunction.blobToFile(
                                utilFunction.base64toBlob(
                                  item?.UPLOAD_DOCUMENT,
                                  item?.FILE_TYPE === "pdf"
                                    ? "application/pdf"
                                    : "image/" + item?.FILE_TYPE
                                ),
                                item?.FILE_NAME
                              ),
                              FILE_TYPE: item?.FILE_TYPE,
                              FILE_NAME: item?.FILE_NAME,
                            };
                            console.log(
                              "UPLOAD_DOCUMENT",
                              item?.UPLOAD_DOCUMENT
                            );
                          } else {
                            lastFileData.current = {};
                          }
                          setIsOpenSave(true);
                        }}
                      />
                    ))}
                  </List>
                </nav>
              </Box>
              {isOpenSave ? (
                <Dialog
                  fullWidth
                  maxWidth="md"
                  open={true}
                  PaperProps={{
                    style: {
                      width: "80%",
                      height: "90%",
                    },
                  }}
                  key="filepreviewDialog"
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "right",
                      alignItems: "right",
                    }}
                  >
                    <GradientButton
                      style={{ width: "22px", margin: "6px" }}
                      onClick={handleDialogClose}
                    >
                      Close
                    </GradientButton>
                  </div>
                  {console.log(">>lastFileData<<", lastFileData)}
                  {lastFileData.current?.FILE_TYPE?.includes("pdf") ? (
                    <PDFViewer
                      blob={lastFileData.current?.UPLOAD_DOCUMENT ?? null}
                      fileName={lastFileData.current?.FILE_NAME ?? ""}
                    />
                  ) : lastFileData.current?.FILE_TYPE?.includes("png") ||
                    lastFileData.current?.FILE_TYPE?.includes("jpg") ||
                    lastFileData.current?.FILE_TYPE?.includes("jpeg") ? (
                    <>
                      <ImageViewer
                        blob={lastFileData.current?.UPLOAD_DOCUMENT ?? null}
                        fileName={lastFileData.current?.FILE_NAME ?? ""}
                      />
                    </>
                  ) : (
                    <NoPreview
                      fileName={lastFileData.current?.FILE_NAME ?? ""}
                    />
                  )}
                </Dialog>
              ) : null}
            </Grid>
          )}
        </>
      ) : null}
    </>
  );
};
export const ListItemData = ({ name, disabled, selected, onClick }) => {
  //@ts-ignore

  return (
    <div>
      <ListItem
        button
        style={{
          padding: "8px 0 0 35px",
          color: "black",
          fontSize: "15px",
          backgroundColor: selected ? "#0000ff87" : "transparent",
        }}
        onClick={onClick}
      >
        <ListItemText primary={name} />
      </ListItem>
    </div>
  );
};
