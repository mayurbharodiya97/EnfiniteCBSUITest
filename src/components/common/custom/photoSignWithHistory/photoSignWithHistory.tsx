import {
  AppBar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Theme,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { GeneralAPI } from "registry/fns/functions";
import { makeStyles, styled } from "@mui/styles";
import React from "react";
import { PhotoSignHistoryMetadata } from "./photoSignHistoryGridMetadata";
import { useSnackbar } from "notistack";
import AvatarEditor from "react-avatar-editor";
import Draggable from "react-draggable";
import { t } from "i18next";
import {
  LoaderPaperComponent,
  ActionTypes,
  Alert,
  GradientButton,
  GridMetaDataType,
  GridWrapper,
  utilFunction,
  queryClient,
} from "@acuteinfo/common-base";
import { format } from "date-fns";

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
    fontSize: "1.2rem",
  },
  refreshiconhover: {},
  paper: {
    padding: theme.spacing(1),
    height: "100%",
    borderRadius: "10px",
  },
  tableCell: {
    padding: theme.spacing(0.5),
  },
  boldText: {
    fontWeight: 800,
    color: "var(--theme-color3) !important",
    fontSize: "13px",
  },
  tableRow: {
    "&:last-child td, &:last-child th": { border: 0 },
  },
  printHidden: {
    "@media print": {
      display: "none !important",
    },
  },
}));
const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: t("Close"),
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];
const PhotoSignWithHistory = ({
  data,
  onClose,
  screenRef,
}: {
  data: any;
  onClose?: any;
  screenRef?: any;
}) => {
  const { authState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isHistoryGridVisible, setIsHistoryGridVisible] = useState<any>(false);
  const headerClasses = useTypeStyles();
  const [showAll, setShowAll] = useState(false);
  const [isImgPhotoOpen, setIsImagePhotoOpen] = useState<any>(false);
  const [rotateImg, setRotateImg] = useState<number>(0);
  const [selectedImageUrl, setSelectedImageUrl] = useState<any>("");
  const [AcCustLevel, setAcCustLevel] = useState<any>("");
  // latest photo/sign data
  const {
    data: LatestPhotoSignData,
    isError: isLatestDtlError,
    isLoading: isLatestDtlLoading,
    isFetching: isLatestDtlFetching,
    refetch: LatestDtlRefetch,
    error: LatestDtlError,
  } = useQuery<any, any>(["getCustAccountLatestDtl", data, AcCustLevel], () =>
    GeneralAPI.getCustAccountLatestDtl({
      COMP_CD: data?.COMP_CD ?? "",
      BRANCH_CD: data?.BRANCH_CD ?? "",
      ACCT_TYPE: data?.ACCT_TYPE ?? "",
      ACCT_CD: data?.ACCT_CD ?? "",
      AMOUNT: data?.AMOUNT ?? "",
      SCREEN_REF: screenRef,
      AC_CUST_LEVEL: AcCustLevel ?? "",
    })
  );
  console.log(
    "LatestPhotoSignData",
    LatestPhotoSignData?.length ===
      LatestPhotoSignData?.filter((item) => item.ROW_VISIBLE === "Y").length
  );
  // photo/sign history

  const getPhotoSignHistory: any = useMutation(GeneralAPI.getPhotoSignHistory, {
    onSuccess: (data, variables) => {},
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },
  });
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getCustAccountLatestDtl", data, AcCustLevel]);
    };
  }, []);

  const setCurrentAction = useCallback((data) => {
    if (data.name === "close") {
      setIsHistoryGridVisible(false);
    }
  }, []);
  const handleRotateChange = () => {
    const newRotateValue = (rotateImg + 90) % 360;
    setRotateImg(newRotateValue);
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={true}
        onKeyUp={(event) => {
          if (event.key === "Escape") {
            onClose();
          }
        }}
        key="photoSignDialog"
        PaperProps={{
          style: {
            width: "100%",
          },
        }}
        // PaperComponent={(props) => (
        //   <Draggable
        //     handle="#draggable-dialog-title"
        //     cancel={'[class*="MuiDialogContent-root"]'}
        //   >
        //     <Paper {...props} />
        //   </Draggable>
        // )}
        // aria-labelledby="draggable-dialog-title"
      >
        {/* <div id="draggable-dialog-title" style={{ cursor: 'move' }}> */}
        {isLatestDtlLoading ? (
          <LoaderPaperComponent
            color="secondary"
            size={30}
            sx={{ marginRight: "8px" }}
            variant="indeterminate"
          />
        ) : (
          <>
            <AppBar position="relative" color="secondary">
              <Toolbar className={headerClasses.root} variant={"dense"}>
                <Typography
                  className={headerClasses.title}
                  color="inherit"
                  variant={"h4"}
                  component="div"
                >
                  {LatestPhotoSignData?.[0]?.TITLE || ""}
                </Typography>
                {Boolean(LatestPhotoSignData?.[0]?.BT_NAME) ? (
                  <GradientButton
                    onClick={() => {
                      setAcCustLevel(
                        LatestPhotoSignData?.[0]?.AC_CUST_LEVEL || null
                      );
                    }}
                  >
                    {LatestPhotoSignData?.[0]?.BT_NAME || ""}
                  </GradientButton>
                ) : null}
                {!(
                  LatestPhotoSignData?.length ===
                  LatestPhotoSignData?.filter(
                    (item) => item.ROW_VISIBLE === "Y"
                  ).length
                ) && (
                  <GradientButton
                    onClick={() => {
                      showAll ? setShowAll(false) : setShowAll(true);
                      LatestDtlRefetch();
                    }}
                  >
                    {showAll ? t("Back") : t("ViewAll")}
                  </GradientButton>
                )}
                <GradientButton
                  onClick={() => {
                    onClose();
                  }}
                >
                  {t("Close")}
                </GradientButton>
              </Toolbar>
            </AppBar>
            <Box
              sx={{
                overflowY: "auto",
                maxHeight: "calc(100vh - 200px)",
                paddingBottom: "20px",
              }}
            >
              <Grid container sx={{ px: "1" }}>
                {isLatestDtlError && (
                  <AppBar position="relative" color="primary">
                    <Alert
                      severity="error"
                      errorMsg={LatestDtlError?.error_msg ?? "Unknown Error"}
                      errorDetail={LatestDtlError?.error_detail ?? ""}
                      color="error"
                    />
                  </AppBar>
                )}

                <Grid container spacing={3} sx={{ padding: 2 }}>
                  {LatestPhotoSignData?.filter(
                    (item) => showAll || item?.ROW_VISIBLE === "Y"
                  )?.map((item, index) => (
                    <React.Fragment key={index}>
                      <Grid item xs={12} sm={4} md={4}>
                        <Paper elevation={3} className={headerClasses.paper}>
                          <TableContainer>
                            <Table size="small">
                              <TableBody>
                                <TableRow className={headerClasses.tableRow}>
                                  <TableCell
                                    className={headerClasses.tableCell}
                                  >
                                    <Grid container alignItems="center">
                                      <Box
                                        sx={{
                                          border:
                                            "2px solid var(--theme-color3)",
                                          height: "20px",
                                          width: "20px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          marginRight: "8px",
                                        }}
                                      >
                                        <Typography variant="body2">
                                          {item?.SR_CD}
                                        </Typography>
                                      </Box>
                                      <Typography
                                        variant="body2"
                                        className={headerClasses.boldText}
                                      >
                                        {t("Type")}
                                      </Typography>
                                    </Grid>
                                  </TableCell>
                                  <TableCell
                                    className={headerClasses.tableCell}
                                  >
                                    <Typography variant="body2">
                                      {item?.J_TYPE_DESC}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                                <TableRow className={headerClasses.tableRow}>
                                  <TableCell
                                    className={headerClasses.tableCell}
                                  >
                                    <Typography
                                      variant="body2"
                                      className={headerClasses.boldText}
                                    >
                                      {t("Account_Name")}:
                                    </Typography>
                                  </TableCell>
                                  <TableCell
                                    className={headerClasses.tableCell}
                                  >
                                    <Typography variant="body2">
                                      {item?.ACCT_NM}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                                <TableRow className={headerClasses.tableRow}>
                                  <TableCell
                                    colSpan={2}
                                    className={headerClasses.tableCell}
                                  >
                                    <Box display="flex" alignItems="center">
                                      <Box display="flex" alignItems="center">
                                        <Typography
                                          className={headerClasses.boldText}
                                        >
                                          {t("LimitFrom")}:
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          sx={{ marginLeft: 3 }}
                                        >
                                          {item?.FROM_LIMIT}
                                        </Typography>
                                      </Box>
                                      <Box
                                        display="flex"
                                        alignItems="center"
                                        sx={{ marginLeft: 4 }}
                                      >
                                        <Typography
                                          className={headerClasses.boldText}
                                        >
                                          {t("To")}:
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          sx={{ marginLeft: 1 }}
                                        >
                                          {item?.TO_LIMIT}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </TableCell>
                                </TableRow>
                                <TableRow className={headerClasses.tableRow}>
                                  <TableCell
                                    className={headerClasses.tableCell}
                                  >
                                    <Typography
                                      variant="body2"
                                      className={headerClasses.boldText}
                                    >
                                      {t("CustID")}:
                                    </Typography>
                                  </TableCell>
                                  <TableCell
                                    className={headerClasses.tableCell}
                                  >
                                    <Typography variant="body2">
                                      {item?.CUSTOMER_ID}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                                <TableRow className={headerClasses.tableRow}>
                                  <TableCell
                                    className={headerClasses.tableCell}
                                  >
                                    <Typography
                                      variant="body2"
                                      className={headerClasses.boldText}
                                    >
                                      {t("CustName")}:
                                    </Typography>
                                  </TableCell>
                                  <TableCell
                                    className={headerClasses.tableCell}
                                  >
                                    <Typography variant="body2">
                                      {item?.REF_PER_NAME}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                                <TableRow className={headerClasses.tableRow}>
                                  <TableCell
                                    className={headerClasses.tableCell}
                                  >
                                    <Typography
                                      variant="body2"
                                      className={headerClasses.boldText}
                                    >
                                      {t("ScanBy")}
                                    </Typography>
                                  </TableCell>
                                  <TableCell
                                    className={headerClasses.tableCell}
                                  >
                                    <Typography variant="body2">
                                      {item?.ENTERED_BY}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                                <TableRow className={headerClasses.tableRow}>
                                  <TableCell
                                    className={headerClasses.tableCell}
                                  >
                                    <Typography
                                      variant="body2"
                                      className={headerClasses.boldText}
                                    >
                                      {t("ScanDate")}
                                    </Typography>
                                  </TableCell>
                                  <TableCell
                                    className={headerClasses.tableCell}
                                  >
                                    <Typography variant="body2">
                                      {item?.MODIFIED_DATE
                                        ? format(
                                            new Date(item.MODIFIED_DATE),
                                            "dd/MMM/yyyy"
                                          )
                                        : ""}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                                <TableRow className={headerClasses.tableRow}>
                                  <TableCell
                                    className={headerClasses.tableCell}
                                  >
                                    <Typography
                                      variant="body2"
                                      className={headerClasses.boldText}
                                    >
                                      {t("VerifiedBy")}
                                    </Typography>
                                  </TableCell>
                                  <TableCell
                                    className={headerClasses.tableCell}
                                  >
                                    <Typography variant="body2">
                                      {item?.VERIFIED_BY}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                          {item?.HISTORY_BUTTON === "Y" ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "end",
                              }}
                            >
                              <GradientButton
                                onClick={() => {
                                  getPhotoSignHistory?.mutate({
                                    COMP_CD: authState?.companyID,
                                    CUSTOMER_ID: item?.CUSTOMER_ID,
                                  });
                                  setIsHistoryGridVisible(true);
                                }}
                              >
                                {t("History")}
                              </GradientButton>
                            </div>
                          ) : null}
                        </Paper>
                      </Grid>

                      {/* Photo Section */}
                      <Grid item xs={12} sm={4} md={4}>
                        <Paper
                          elevation={3}
                          sx={{ p: 2, height: "100%", textAlign: "center" }}
                        >
                          <Typography variant="h6" gutterBottom>
                            {t("PhotoImage")}
                          </Typography>
                          <Card
                            sx={{
                              color: "var(--theme-color2)",
                              background: "var(--theme-color5)",
                              cursor: "grab",
                              height: "90%",
                            }}
                          >
                            <CardContent
                              style={{ padding: "2px 2px 30px 2px" }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "100%",
                                  height: "100%",
                                  cursor: "auto",
                                  mt: 2,
                                }}
                              >
                                <Grid
                                  container
                                  spacing={0}
                                  justifyContent="center"
                                  alignItems="center"
                                >
                                  {isLatestDtlLoading ? (
                                    <CircularProgress
                                      color="secondary"
                                      size={30}
                                      sx={{ marginRight: "8px" }}
                                      variant="indeterminate"
                                    />
                                  ) : (
                                    <>
                                      {item?.ACCT_PHOTO ? (
                                        <Tooltip
                                          key={"tooltip-"}
                                          title={t(
                                            "ToZoomInOnTheImagesClickOnItOnce"
                                          )}
                                          placement={"top"}
                                          arrow={true}
                                        >
                                          <div
                                            onClick={() => {
                                              setSelectedImageUrl(
                                                URL.createObjectURL(
                                                  utilFunction.base64toBlob(
                                                    item.ACCT_PHOTO
                                                  )
                                                )
                                              );
                                              setIsImagePhotoOpen(true); // Open the dialog
                                            }}
                                          >
                                            <img
                                              src={URL.createObjectURL(
                                                utilFunction.base64toBlob(
                                                  item.ACCT_PHOTO
                                                )
                                              )}
                                              alt="Account Photo"
                                              style={{
                                                maxWidth: "100%",
                                                maxHeight: "190px",
                                                cursor: "zoom-in",
                                              }}
                                            />
                                          </div>
                                        </Tooltip>
                                      ) : item?.O_STATUS === "999" ? (
                                        <Typography
                                          variant="h6"
                                          width={"200px"}
                                          fontSize={"26px"}
                                          margin={"25px"}
                                        >
                                          {item?.O_MESSAGE}
                                        </Typography>
                                      ) : (
                                        <Typography
                                          variant="h6"
                                          width={"200px"}
                                          fontSize={"26px"}
                                          margin={"25px"}
                                        >
                                          {t("NoImageFound")}
                                        </Typography>
                                      )}
                                    </>
                                  )}
                                </Grid>
                              </Box>
                            </CardContent>
                          </Card>
                        </Paper>
                      </Grid>

                      {/* Signature Section */}
                      <Grid item xs={12} sm={4} md={4}>
                        <Paper
                          elevation={3}
                          sx={{ p: 2, height: "100%", textAlign: "center" }}
                        >
                          <Typography variant="h6" gutterBottom>
                            {t("SignatureImage")}
                          </Typography>
                          <Card
                            sx={{
                              color: "var(--theme-color2)",
                              background: "var(--theme-color5)",
                              cursor: "grab",
                              height: "90%",
                            }}
                          >
                            <CardContent
                              style={{ padding: "2px 2px 30px 2px" }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "100%",
                                  height: "100%",
                                  cursor: "auto",
                                  mt: 2,
                                }}
                              >
                                <Grid
                                  container
                                  spacing={0}
                                  justifyContent="center"
                                  alignItems="center"
                                >
                                  {isLatestDtlLoading ? (
                                    <CircularProgress
                                      color="secondary"
                                      size={30}
                                      sx={{ marginRight: "8px" }}
                                      variant="indeterminate"
                                    />
                                  ) : (
                                    <>
                                      {item?.ACCT_SIGN ? (
                                        <Tooltip
                                          key={"tooltip-"}
                                          title={t(
                                            "ToZoomInOnTheImagesClickOnItOnce"
                                          )}
                                          placement={"top"}
                                          arrow={true}
                                        >
                                          <div
                                            onClick={() => {
                                              setSelectedImageUrl(
                                                URL.createObjectURL(
                                                  utilFunction.base64toBlob(
                                                    item.ACCT_SIGN
                                                  )
                                                )
                                              );
                                              setIsImagePhotoOpen(true); // Open the dialog
                                            }}
                                          >
                                            <img
                                              src={URL.createObjectURL(
                                                utilFunction.base64toBlob(
                                                  item.ACCT_SIGN
                                                )
                                              )}
                                              alt="Account Signature"
                                              style={{
                                                maxWidth: "100%",
                                                maxHeight: "190px",
                                                cursor: "zoom-in",
                                              }}
                                            />
                                          </div>
                                        </Tooltip>
                                      ) : item?.O_STATUS === "999" ? (
                                        <Typography
                                          variant="h6"
                                          width={"200px"}
                                          fontSize={"26px"}
                                          margin={"25px"}
                                        >
                                          {item?.O_MESSAGE}
                                        </Typography>
                                      ) : (
                                        <Typography
                                          variant="h6"
                                          width={"200px"}
                                          fontSize={"26px"}
                                          margin={"25px"}
                                        >
                                          {t("NoImageFound")}
                                        </Typography>
                                      )}
                                    </>
                                  )}
                                </Grid>
                              </Box>
                            </CardContent>
                          </Card>
                        </Paper>
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              </Grid>
            </Box>
          </>
        )}
        {/* {
          getPhotoSignHistory?.isError && (
            <AppBar position="relative" color="primary">
              <Alert
                severity="error"
                errorMsg={getPhotoSignHistory?.?.error_msg ?? "Unknow Error"}
                errorDetail={photoHistoryError?.error_detail ?? ""}
                color="error"
              />
            </AppBar>
          )
        } */}
        <>
          {isHistoryGridVisible ? (
            <>
              <Dialog
                fullWidth
                maxWidth="md"
                open={true} // Assuming this is controlled by a state
                onKeyUp={(event) => {
                  if (event.key === "Escape") {
                    onClose();
                  }
                }}
                key="rtgsConfirmDialog"
                PaperProps={{
                  style: {
                    width: "100%",
                  },
                }}
              >
                <GridWrapper
                  key={`photoSignHistoryGrid`}
                  finalMetaData={PhotoSignHistoryMetadata as GridMetaDataType}
                  data={getPhotoSignHistory?.data ?? []}
                  setData={() => null}
                  loading={getPhotoSignHistory?.isLoading}
                  actions={actions}
                  setAction={setCurrentAction}
                  // refetchData={() => assetDTLRefetch()}
                  // ref={myGridRef}
                />
              </Dialog>
            </>
          ) : null}
        </>
        <>
          <Dialog
            open={isImgPhotoOpen}
            onClose={() => setIsImagePhotoOpen(false)}
            PaperProps={{
              style: {
                width: "100%",
              },
            }}
            maxWidth="lg"
          >
            <AppBar position="relative" color="secondary">
              <Toolbar className={headerClasses.root} variant={"dense"}>
                <Typography
                  className={headerClasses.title}
                  color="inherit"
                  variant={"h4"}
                  component="div"
                >
                  {t("ACNo") +
                    ".:".concat(
                      data?.COMP_CD,
                      "-",
                      data?.BRANCH_CD,
                      "-",
                      data?.ACCT_TYPE,
                      "-",
                      data?.ACCT_CD,
                      t("Account_Name") + ":",
                      data?.ACCT_NM
                    )}
                </Typography>
                <GradientButton
                  className={headerClasses.printHidden}
                  onClick={handleRotateChange}
                >
                  {rotateImg === 0 ? t("Rotate") : t("Reset")}
                </GradientButton>
                <GradientButton
                  onClick={() => {
                    window.print();
                  }}
                  className={headerClasses.printHidden}
                >
                  {t("Print")}
                </GradientButton>
              </Toolbar>
            </AppBar>
            {rotateImg === 0 ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  cursor: "zoom-out",
                  padding: "0px 6px 6px 6px",
                }}
                onClick={() => {
                  setIsImagePhotoOpen(false);
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
        {/* </div> */}
      </Dialog>
    </>
  );
};

export default PhotoSignWithHistory;
