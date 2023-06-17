import { AuthContext } from "pages_audit/auth";
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { queryClient } from "cache";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Alert } from "components/common/alert";
import {
  PersonlizationDashboardGridData,
  PersonlizationQuickGridMetaData,
  UserLoginDtlGridMetaData,
  UserProfileMetaData,
  userAccessbranch,
  userAccesstype,
} from "./metaData";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import {
  AppBar,
  Avatar,
  Button,
  Container,
  Grid,
  IconButton,
  InputLabel,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { utilFunction } from "components/utils/utilFunctions";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { GridMetaDataType } from "components/dataTableStatic";
import { ChangePassword } from "./changePassword";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import "./style.css";
import { ProfilePhotoUpdate } from "./profilePhotoUpload";
import { GeneralAPI } from "registry/fns/functions";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import SettingsAccessibilityOutlinedIcon from "@mui/icons-material/SettingsAccessibilityOutlined";
import { useNavigate } from "react-router-dom";
import USER_PROFILE_DEFAULT from "assets/images/USER_PROFILE_DEFAULT.png";
import { useTranslation } from "react-i18next";
export const Profile = () => {
  const { authState } = useContext(AuthContext);
  const myGridRef = useRef<any>(null);
  const userID = authState?.user?.id;
  const urlObj = useRef<any>(null);
  const fileUploadControl = useRef<any | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileUpdate, setProfileUpdate] = useState(false);
  const [filesdata, setFilesData] = useState<any>([]);
  const [ProfilePictureURL, setProfilePictureURL] = useState<any | null>(null);
  const [value, setValue] = useState("one");
  const [mode, setMode] = useState<string>("userLogin");
  const { t } = useTranslation();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  //typeof blob === "object" && Boolean(blob) ? URL.createObjectURL(blob) : ""
  //);
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/cbsenfinity/dashboard");
  };

  const queryData = useQuery<any, any, any>(["GETEMPLOYEEDTL"], () =>
    API.getUserDetails({ userID })
  );

  const userActivityData = useQuery<any, any, any>(["GETUSERACTIVITY"], () =>
    API.getUserLoginDetails({ userID })
  );
  const userAccessBranch = useQuery<any, any, any>(["GETUSERACESSBRNCH"], () =>
    API.getUserAccessBranch({ userID })
  );
  const userAccessType = useQuery<any, any, any>(["GETUSERACESSTYPE"], () =>
    API.getUserAccessType({ userID })
  );
  const quickView = useQuery<any, any, any>(["GETUSERACESSYPE"], () =>
    API.getquickView({ userID })
  );
  const dashboardData = useQuery<any, any, any>(["GETUSERACESSTPE"], () =>
    API.getdashboardData()
  );

  useEffect(() => {
    GeneralAPI.setDocumentName("Profile");
    return () => {
      queryClient.removeQueries(["GETEMPLOYEEDTL"]);
      queryClient.removeQueries(["GETUSERACTIVITY"]);
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
    }
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
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  return (
    <Fragment>
      {queryData.isLoading ||
      queryData.isFetching ||
      userActivityData.isLoading ||
      userActivityData.isFetching ? (
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
              {/* <Grid>
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
                      My Profile
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: "none", md: "flex" } }}>
                      <IconButton
                        aria-label="show 4 new mails"
                        color="inherit"
                        sx={{
                          background: "#ECEFF9",
                          borderRadius: "10px",
                          ml: 2,
                        }}
                        onClick={handleNavigate}
                      >
                        <CancelOutlinedIcon color="info" fontSize="medium" />
                      </IconButton>
                    </Box>
                  </Toolbar>
                </AppBar>
              </Grid> */}
              <Grid>
                {/* <Box
                  height={"216px"}
                  sx={{
                    // backgroundImage: `url(${User_profile})`,
                    backgroundImage: `url('https://berrydashboard.io/static/media/img-profile-bg.2b15e9314e45a1308110.png')`,
                    backgroundSize: "cover",
                    borderRadius: "10px",
                    margin: "10px",
                    boxShadow: "rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;",
                  }}
                ></Box> */}
                <Box>
                  <Grid container>
                    <Grid
                      item
                      xs={2}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <div
                        style={{
                          width: "150px",
                          height: "150px",
                          margin: "auto",
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
                      {/* <Grid m={"auto"}>
                        <Typography variant="h5" fontWeight={500}>
                          {queryData?.data?.USERNAME}
                        </Typography>
                        <Typography color={"var(--theme-color6)"}>
                          {queryData?.data?.USER_LEVEL}
                        </Typography>
                      </Grid> */}
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
                              {t("profile.MyProfile")}
                            </Typography>

                            <Box sx={{ flexGrow: 1 }} />
                            <Box sx={{ display: { xs: "none", md: "flex" } }}>
                              <IconButton
                                aria-label="show 4 new mails"
                                color="inherit"
                                sx={{
                                  background: "#ECEFF9",
                                  borderRadius: "10px",
                                  ml: 2,
                                }}
                                onClick={handleNavigate}
                              >
                                <CancelOutlinedIcon
                                  color="info"
                                  fontSize="medium"
                                />
                              </IconButton>
                            </Box>
                          </Toolbar>
                        </AppBar>
                      </Grid>
                      <Grid container alignItems={"center"}>
                        <Grid item xs={4} pl={3}>
                          <Typography
                            variant="h5"
                            fontWeight={500}
                            display={"inline"}
                            sx={{
                              textTransform: "capitalize",
                            }}
                          >
                            {queryData?.data?.USERNAME} -{" "}
                            {/* {queryData?.data?.USER_LEVEL} */}
                          </Typography>
                          <Typography display={"inline"}>
                            {queryData?.data?.USER_LEVEL}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          {/* <Typography>About</Typography> */}
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {t("profile.MobileNo")} :-{" "}
                            {queryData?.data?.MOBILE_NUMBER}
                          </Typography>
                          <Typography>
                            {t("profile.EmailId")} :-{" "}
                            {queryData?.data?.EMAIL_ID}
                          </Typography>
                          <Typography>{t("profile.About")} :- </Typography>
                        </Grid>
                      </Grid>
                      <Box sx={{ width: "100%", marginTop: "auto" }}>
                        <Tabs
                          sx={{
                            "& .MuiTabs-fixed": {
                              display: "flex",

                              // justifyContent: "flex-end",
                            },
                            "& .Mui-selected": {
                              color: "var(--theme-color1)",
                            },
                            "& .MuiTabs-indicator": {
                              backgroundColor: "var(--theme-color1)",
                            },
                            "& .MuiButtonBase-root": {
                              minHeight: "0px",
                            },
                          }}
                          value={value}
                          onChange={handleChange}
                          textColor="secondary"
                          indicatorColor="secondary"
                          aria-label="secondary tabs example"
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
                    {/* <Grid item xs={2} pt={"10px"}> */}
                    {/* <div
                        style={{
                          width: "150px",
                          height: "150px",
                          margin: "auto",
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
                          ></Avatar>
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
                            Update Photo
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
                      </div> */}
                    {/* <Grid item xs={3} m={"auto"}>
                        <Typography variant="h5" fontWeight={500}>
                          {queryData?.data?.NAME}
                        </Typography>
                        <Typography color={"var(--theme-color6)"}>
                          {queryData?.data?.USER_LEVEL}
                        </Typography>
                      </Grid>
                    </Grid> */}
                    {/* <Grid item xs={10}> */}
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
                          // <Grid
                          //   key={"Griditem4"}
                          //   item
                          //   xs={12}
                          //   md={12}
                          //   lg={12}
                          //   container
                          //   spacing={1}
                          //   justifyContent="flex-start"
                          //   alignItems="center"
                          //   style={{
                          //     marginBottom: "0px",
                          //     marginRight: "12px",
                          //   }}
                          // >
                          <GridWrapper
                            key={`userDetail`}
                            finalMetaData={
                              UserLoginDtlGridMetaData as GridMetaDataType
                            }
                            data={userActivityData.data ?? []}
                            setData={() => null}
                            //loading={result.isLoading}
                            actions={[]}
                            setAction={() => {}}
                            refetchData={() => {}}
                            ref={myGridRef}
                            headerToolbarStyle={{
                              background: "var(--theme-color2)",
                              color: "black",
                            }}
                          />
                        ) : // </Grid>
                        mode === "userLogin" ? (
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
                          <Grid
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 3,
                              p: 2,
                            }}
                          >
                            <Grid
                              container
                              sx={{
                                boxShadow:
                                  "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                              }}
                            >
                              <GridWrapper
                                key={`userAccessbranch`}
                                finalMetaData={
                                  userAccessbranch as GridMetaDataType
                                }
                                data={userAccessBranch.data || []}
                                setData={() => null}
                                headerToolbarStyle={{
                                  background: "var(--theme-color2)",
                                  color: "black",
                                  fontSize: "20px",
                                }}
                                //loading={result.isLoading}
                                // actions={[]}
                                // setAction={() => {}}
                                // refetchData={() => {}}
                                // ref={myGridRef}
                              />
                            </Grid>
                            <Grid
                              container
                              sx={{
                                boxShadow:
                                  "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                              }}
                            >
                              <GridWrapper
                                key={`userAccesstype`}
                                finalMetaData={
                                  userAccesstype as GridMetaDataType
                                }
                                data={userAccessType.data || []}
                                setData={() => null}
                                headerToolbarStyle={{
                                  background: "var(--theme-color2)",
                                  color: "black",
                                  fontSize: "20px",
                                }}
                                //loading={result.isLoading}
                                // actions={[]}
                                // setAction={() => {}}
                                // refetchData={() => {}}
                                // ref={myGridRef}
                              />
                            </Grid>
                          </Grid>
                        ) : mode === "personalizedashboard" ? (
                          <>
                            <Grid
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 3,
                                p: 2,
                              }}
                            >
                              <Grid
                                container
                                sx={{
                                  boxShadow:
                                    "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                                }}
                              >
                                <GridWrapper
                                  key={`personalizeQuickView`}
                                  finalMetaData={
                                    PersonlizationQuickGridMetaData as GridMetaDataType
                                  }
                                  data={quickView.data || []}
                                  setData={() => null}
                                  //loading={result.isLoading}
                                  // actions={[]}
                                  // setAction={() => {}}
                                  headerToolbarStyle={{
                                    background: "var(--theme-color2)",
                                    color: "black",
                                  }}
                                  // refetchData={() => {}}
                                  // ref={myGridRef}
                                />
                              </Grid>
                              <Grid
                                container
                                sx={{
                                  boxShadow:
                                    "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                                }}
                              >
                                <GridWrapper
                                  key={`personalizeDashboardData`}
                                  finalMetaData={
                                    PersonlizationDashboardGridData as GridMetaDataType
                                  }
                                  data={dashboardData.data || []}
                                  headerToolbarStyle={{
                                    background: "var(--theme-color2)",
                                    color: "black",
                                  }}
                                  setData={() => null}
                                  //loading={result.isLoading}
                                  // actions={[]}
                                  // setAction={() => {}}
                                  // refetchData={() => {}}
                                  // ref={myGridRef}
                                />
                              </Grid>
                            </Grid>
                          </>
                        ) : null}
                      </Grid>
                    </Container>

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
