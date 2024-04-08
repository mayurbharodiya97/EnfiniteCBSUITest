import { AuthContext } from "pages_audit/auth";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import * as API from "./api";
import { queryClient } from "cache";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { UserProfileMetaData } from "./metaData";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import {
  AppBar,
  Avatar,
  Container,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import { utilFunction } from "components/utils/utilFunctions";
import { ChangePassword } from "./changePassword";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import "./style.css";
import { ProfilePhotoUpdate } from "./profilePhotoUpload";
import { GeneralAPI } from "registry/fns/functions";
import Box from "@mui/material/Box";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import SettingsAccessibilityOutlinedIcon from "@mui/icons-material/SettingsAccessibilityOutlined";
import { useNavigate } from "react-router-dom";
import USER_PROFILE_DEFAULT from "assets/images/USER_PROFILE_DEFAULT.png";
import About from "./about";
import TotpEnbaledDisabled from "./totp/totp-enabled-disable";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { GradientButton } from "components/styledComponent/button";
import { useTranslation } from "react-i18next";
import { PersonalizeDash } from "./personalizeDash";
import { AllowedAccess } from "./allowedAccess";
import { UserDetail } from "./userDetail";
// import { t } from "i18next";
// interface notificationDataType {
//   activityID: string;
//   readFlag: string;
// }

// const notificationDataWrapperFn =
//   (notificationData) =>
//   async ({ activityID, readFlag }: notificationDataType) => {
//     return notificationData({ activityID, readFlag });
//   };

export const Profile = () => {
  const { authState } = useContext(AuthContext);
  const authController = useContext(AuthContext);
  const userID = authState?.user?.id;
  const urlObj = useRef<any>(null);
  const fileUploadControl = useRef<any | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileUpdate, setProfileUpdate] = useState(false);
  const [filesdata, setFilesData] = useState<any>([]);
  const [ProfilePictureURL, setProfilePictureURL] = useState<any | null>(null);
  const [value, setValue] = useState("one");
  const [showTOTP, setshowTOTP] = useState(false);
  const [mode, setMode] = useState<string>("userLogin");
  const [totpAuthStatus, setTotpAuthStatus] = useState<any>("");
  const { t } = useTranslation();
  // const [girdData, setGridData] = useState<any>();

  //typeof blob === "object" && Boolean(blob) ? URL.createObjectURL(blob) : ""
  //);
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/cbsenfinity/dashboard");
  };

  const queryData = useQuery<any, any, any>(["GETEMPLOYEEDTL"], () =>
    API.getUserDetails({ userID })
  );

  useEffect(() => {
    GeneralAPI.setDocumentName("Profile");
    return () => {
      queryClient.removeQueries(["GETEMPLOYEEDTL"]);
    };
  }, []);

  useEffect(() => {
    if (Boolean(queryData.data?.PROFILE_PHOTO)) {
      let blob = utilFunction.base64toBlob(queryData.data?.PROFILE_PHOTO);
      urlObj.current =
        typeof blob === "object" && Boolean(blob)
          ? URL.createObjectURL(blob)
          : "";
      setProfilePictureURL(urlObj.current);
      authController?.setProfileImage(urlObj.current);
    }
    setTotpAuthStatus(queryData.data?.TOTP_ENABLED);
  }, [queryData.data]);

  const handleProfileUploadClose = (flag, imgdata) => {
    //console.log(Boolean(flag), flag === "Y", typeof imgdata, Boolean(imgdata));
    if (
      Boolean(flag) &&
      flag === "Y" &&
      typeof imgdata === "object" &&
      Boolean(imgdata)
    ) {
      urlObj.current =
        typeof imgdata === "object" && Boolean(imgdata)
          ? URL.createObjectURL(imgdata)
          : "";
      setProfilePictureURL(urlObj.current);
      authController?.setProfileImage(urlObj.current);
    }
    setProfileUpdate(false);
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    const filesArray = Array.from(files);
    if (filesArray.length > 0) {
      // console.log(filesArray);
      setFilesData(filesArray);
      setProfileUpdate(true);
    }
  };

  return (
    <Fragment>
      {queryData.isLoading || queryData.isFetching ? (
        <LoaderPaperComponent />
      ) : (
        <>
          <Grid
            key={"mainGrid"}
            container
            spacing={0}
            px={4}
            direction="column"
            style={{
              background: "rgba(250, 251, 255, 0.9)",
              display: "block",
            }}
          >
            <Container
              sx={{
                background: "white",
                borderRadius: "10px",
                p: "15px",
                boxShadow:
                  "rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px;",
              }}
            >
              <Grid>
                <Box>
                  <Grid container sx={{ minHeight: "200px" }}>
                    <Grid
                      item
                      xs={2}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <div
                        style={{
                          width: "150px",
                          height: "150px",
                          margin: "10px auto",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          // top: "-50%",
                        }}
                      >
                        <div className="image-data">
                          <Avatar
                            variant="rounded"
                            key={"ProfilePicture"}
                            alt="User"
                            src={
                              Boolean(ProfilePictureURL)
                                ? ProfilePictureURL
                                : USER_PROFILE_DEFAULT
                            }
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            {/* {(queryData.data?.NAME || userID)
                              .toUpperCase()
                              .substring(0, 1)} */}
                          </Avatar>
                        </div>
                        <div
                          className="image-upload-icon"
                          onClick={() => fileUploadControl?.current?.click()}
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
                            {t("profile.UpdatePhoto")}
                          </Typography>
                          <input
                            name="fileselect"
                            type="file"
                            style={{ display: "none" }}
                            ref={fileUploadControl}
                            onChange={handleFileSelect}
                            accept=".png,.jpg,.jpeg"
                            onClick={(e) => {
                              //to clear the file uploaded state to reupload the same file (AKA allow our handler to handle duplicate file)
                              //@ts-ignore
                              e.target.value = "";
                            }}
                          />
                        </div>
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={10}
                      sx={{ display: "flex", flexDirection: "column" }}
                    >
                      <Grid>
                        <AppBar
                          position="static"
                          sx={{
                            background: "#FFFFFF",
                            borderRadius: "10px",
                            margin: "10px",
                            width: "auto",
                          }}
                        >
                          <Toolbar style={{ minHeight: "48px" }}>
                            <Typography
                              variant="h5"
                              noWrap
                              component="div"
                              sx={{
                                display: { xs: "none", sm: "block" },
                                fontWeight: 500,
                              }}
                            >
                              {/* My Profile */}
                              {t("profile.MyProfile")}
                            </Typography>

                            <Box sx={{ flexGrow: 1 }}></Box>
                            <Box sx={{ display: { xs: "none", md: "flex" } }}>
                              <GradientButton
                                onClick={() => {
                                  setshowTOTP(true);
                                }}
                                starticon="QrCode2"
                                rotateIcon="scale(1.7)"
                              >
                                {totpAuthStatus === "N"
                                  ? `${t("profile.EnableTOTPAuth")}`
                                  : totpAuthStatus === "Y"
                                  ? `${t("profile.DisableTOTPAuth")}`
                                  : ""}
                              </GradientButton>

                              <GradientButton
                                onClick={handleNavigate}
                                endicon="CancelOutlined"
                                // rotateIcon="scale(1.4) rotateY(360deg)"
                                sx={{
                                  margin: "0 0  0 15px",
                                  "&:hover": {
                                    backgroundColor: "var(--theme-color3)",
                                    "& .MuiSvgIcon-root": {
                                      transform: "scale(1.4) rotateY(360deg)",
                                      transition: "transform 2s ease-in-out",
                                    },
                                  },
                                }}
                              >
                                {t("Close")}
                              </GradientButton>
                            </Box>
                          </Toolbar>
                        </AppBar>
                      </Grid>
                      <Grid container alignItems={"center"} height={"50px"}>
                        <Grid item xs={3} pl={3}>
                          <Typography
                            variant="h5"
                            fontWeight={500}
                            display={"inline"}
                            sx={{
                              textTransform: "capitalize",
                            }}
                          >
                            {queryData?.data?.USERNAME} -{" "}
                          </Typography>
                          <Typography display={"inline"}>
                            {queryData?.data?.USER_LEVEL}
                          </Typography>
                        </Grid>
                        <Grid item xs={9}>
                          <About />
                        </Grid>
                      </Grid>
                      <Box sx={{ width: "100%", marginTop: "auto" }}>
                        <Tabs
                          sx={{
                            // paddingRight: "15px",
                            "& .MuiTabs-fixed": {
                              display: "flex",
                              // justifyContent: "space-between",
                            },
                            "& .MuiTabs-scroller": {
                              display: "flex",
                              justifyContent: "flex-end",
                            },
                            "& .MuiTabScrollButton-root": {
                              // background: "var(--theme-color3)",
                              "& svg": {
                                fontSize: "2.25rem",
                                color: "var(--theme-color1)",
                              },
                            },
                            "& .Mui-selected": {
                              color: "var(--theme-color1)",
                            },
                            "& .MuiTabs-indicator": {
                              backgroundColor: "var(--theme-color1)",
                            },
                            "& .MuiButtonBase-root": {
                              minHeight: "0px",
                              paddingX: "7px",
                              fontSize: "12px",
                            },
                            "& .MuiButtonBase-root:hover": {
                              letterSpacing: "0.5px",
                              boxShadow: "0px 5px 40px -10px rgba(0,0,0,0.57)",
                              transition: "all 0.4s ease 0s",
                              fontWeight: "800",
                              "& .MuiSvgIcon-root": {
                                transform: "scale(1.4)",
                                transition: "transform 2s ease-in-out",
                              },
                            },
                          }}
                          value={value}
                          onChange={(event, newValue) => {
                            setValue(newValue);
                          }}
                          textColor="secondary"
                          indicatorColor="secondary"
                          aria-label="secondary tabs example"
                          variant="scrollable"
                          scrollButtons="auto"
                        >
                          <Tab
                            value="one"
                            label={t("profile.UserProfile")}
                            icon={<AccountCircleOutlinedIcon />}
                            iconPosition="start"
                            // onClick={moveToUserDetail}
                            onClick={() => {
                              setMode("userLogin");
                            }}
                          />
                          <Tab
                            value="two"
                            label={t("profile.AllowedAccess")}
                            icon={<HowToRegOutlinedIcon />}
                            iconPosition="start"
                            // onClick={moveToUserDetail}
                            onClick={() => {
                              setMode("accessAllow");
                            }}
                          />
                          <Tab
                            value="three"
                            label={t("profile.ActivityDetail")}
                            icon={<ArticleOutlinedIcon />}
                            iconPosition="start"
                            // onClick={() => {
                            //   setUserDetail(true);
                            // }}
                            onClick={() => {
                              setMode("userDetail");
                            }}
                          />

                          <Tab
                            value="four"
                            label={t("profile.ChangePassword")}
                            icon={<LockResetOutlinedIcon />}
                            iconPosition="start"
                            onClick={() => {
                              setMode("changePassword");
                              setShowProfile(true);
                            }}
                          />
                          <Tab
                            value="five"
                            label={t("profile.Personalizedashboard")}
                            icon={<SettingsAccessibilityOutlinedIcon />}
                            iconPosition="start"
                            onClick={() => {
                              setMode("personalizedashboard");
                              setShowProfile(true);
                            }}
                          />
                        </Tabs>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Container>
                      <Grid
                        sx={{
                          backgroundColor: "var(--theme-color2)",
                          padding: "0px",
                          borderRadius: "10px",
                          boxShadow:
                            "rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px;",
                        }}
                      >
                        {mode === "userDetail" ? (
                          <UserDetail />
                        ) : mode === "userLogin" ? (
                          <Grid>
                            <FormWrapper
                              key="userLogin"
                              metaData={UserProfileMetaData as MetaDataType}
                              initialValues={queryData.data}
                              onSubmitHandler={() => {}}
                              // displayMode={"view"}
                              // hideDisplayModeInTitle={true}
                              formStyle={{
                                background: "white",
                                // height: "40vh",
                                overflowY: "auto",
                                overflowX: "hidden",
                              }}
                              hideHeader={true}
                            />
                          </Grid>
                        ) : mode === "changePassword" ? (
                          <ChangePassword
                            showProfile={showProfile}
                            onClose={() => setShowProfile(false)}
                          />
                        ) : mode === "accessAllow" ? (
                          <AllowedAccess />
                        ) : mode === "personalizedashboard" ? (
                          <PersonalizeDash />
                        ) : null}
                      </Grid>
                    </Container>
                    {showTOTP ? (
                      <TotpEnbaledDisabled
                        open={showTOTP}
                        // onClose={() => setshowTOTP(false)}
                        onClose={(isSuccess, isLocked) => {
                          if (isSuccess) {
                            setTotpAuthStatus((old) => {
                              if (old === "N") {
                                return "Y";
                              } else {
                                return "N";
                              }
                            });
                          }
                          setshowTOTP(false);
                        }}
                        authFlag={
                          totpAuthStatus === "N" ? "ENABLED" : "DISABLED"
                        }
                        // authFlag="ENABLED"
                      />
                    ) : null}
                    {profileUpdate && filesdata.length > 0 ? (
                      <ProfilePhotoUpdate
                        open={profileUpdate}
                        onClose={handleProfileUploadClose}
                        files={filesdata}
                        userID={userID}
                      />
                    ) : null}
                    {/* </Grid> */}
                  </Grid>
                </Box>
              </Grid>
            </Container>
          </Grid>
        </>
      )}
    </Fragment>
  );
};
