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
import { UserLoginDtlGridMetaData, UserProfileMetaData } from "./metaData";
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
import { useNavigate } from "react-router-dom";
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

  const userActivityData = useQuery<any, any, any>(
    ["getUserLoginDetails"],
    () => API.getUserLoginDetails({ userID })
  );

  useEffect(() => {
    GeneralAPI.setDocumentName("Profile");
    return () => {
      queryClient.removeQueries(["GETEMPLOYEEDTL"]);
      queryClient.removeQueries(["getUserLoginDetails"]);
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
            <Box sx={{ my: 3, display: "block" }}>
              <AppBar
                position="static"
                sx={{
                  background: "#FFFFFF",
                  borderRadius: "10px",
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
            </Box>
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
                <Box
                  height={"216px"}
                  sx={{
                    // backgroundImage: `url(${User_profile})`,
                    backgroundImage: `url('https://berrydashboard.io/static/media/img-profile-bg.2b15e9314e45a1308110.png')`,
                    backgroundSize: "cover",
                    borderRadius: "10px",
                    margin: "10px",
                    boxShadow: "rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;",
                  }}
                ></Box>
                <Box height={"105px"}>
                  <Grid container>
                    <Grid item xs={3}>
                      <div
                        style={{
                          width: "150px",
                          height: "150px",
                          marginLeft: "auto",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          top: "-50%",
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
                                : "https://berrydashboard.io/static/media/img-user.41a8c06685db060b0ec1.png"
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
                      </div>
                    </Grid>
                    <Grid item xs={9} p={1}>
                      <Grid container p={1}>
                        <Grid item xs={3}>
                          <Typography variant="h6" fontWeight={500}>
                            Ajay Sharma
                          </Typography>
                          <Typography color={"var(--theme-color6)"}>
                            Cashier
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Box sx={{ width: "100%" }}>
                          <Tabs
                            sx={{
                              "& .MuiTabs-fixed": {
                                display: "flex",
                                justifyContent: "flex-end",
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
                              label="User Profile"
                              icon={<AccountCircleOutlinedIcon />}
                              iconPosition="start"
                              // onClick={moveToUserDetail}
                              onClick={() => {
                                setMode("userLogin");
                              }}
                            />
                            <Tab
                              value="two"
                              label="User Detail"
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
                              value="three"
                              label="Change Password"
                              icon={<LockResetOutlinedIcon />}
                              iconPosition="start"
                              onClick={() => {
                                setMode("changePassword");
                                setShowProfile(true);
                              }}
                            />
                          </Tabs>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Container>
          </Grid>
          <Container>
            <Grid
              sx={{
                m: 3,
                p: 1,
                backgroundColor: "var(--theme-color2)",
                borderRadius: "10px",
                boxShadow:
                  "rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px;",
              }}
            >
              {mode === "userDetail" ? (
                <Grid
                  key={"Griditem4"}
                  item
                  xs={12}
                  md={12}
                  lg={12}
                  container
                  spacing={1}
                  justifyContent="flex-start"
                  alignItems="center"
                  style={{ marginBottom: "0px", marginRight: "12px" }}
                >
                  <GridWrapper
                    key={`UserLoginReqGrid`}
                    finalMetaData={UserLoginDtlGridMetaData as GridMetaDataType}
                    data={userActivityData.data ?? []}
                    setData={() => null}
                    //loading={result.isLoading}
                    actions={[]}
                    setAction={() => {}}
                    refetchData={() => {}}
                    ref={myGridRef}
                  />
                </Grid>
              ) : mode === "userLogin" ? (
                <Grid>
                  <FormWrapper
                    key="UserProfileForm"
                    metaData={UserProfileMetaData as MetaDataType}
                    initialValues={[]}
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
        </>
      )}
    </Fragment>
  );
};
