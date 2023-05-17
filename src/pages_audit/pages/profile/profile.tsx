import { AuthContext } from "pages_audit/auth";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
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
  Grid,
  IconButton,
  InputLabel,
  Paper,
  Stack,
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
import SaveIcon from "@mui/icons-material/Save";
import { styled, alpha } from "@mui/material/styles";
// import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
// import Toolbar from "@mui/material/Toolbar";
// import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import User_profile from "assets/images/user_profile_bg.jpg";
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
  //typeof blob === "object" && Boolean(blob) ? URL.createObjectURL(blob) : ""
  //);

  const drawerWidth = 240;

  const queryData = useQuery<any, any, any>(["getUserDetails"], () =>
    API.getUserDetails({ userID })
  );
  const userActivityData = useQuery<any, any, any>(
    ["getUserLoginDetails"],
    () => API.getUserLoginDetails({ userID })
  );

  useEffect(() => {
    GeneralAPI.setDocumentName("Profile");
    return () => {
      queryClient.removeQueries(["getUserDetails"]);
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
        // : queryData.isError || userActivityData.isError ? (
        // <Alert
        //   severity={
        //     queryData.isError
        //       ? queryData.error?.severity ?? "error"
        //       : userActivityData.error?.severity ?? "error"
        //   }
        //   errorMsg={
        //     queryData.isError
        //       ? queryData.error?.error_msg ?? "Unknown error occured"
        //       : userActivityData.error?.error_msg ?? "Unknown error occured"
        //   }
        //   errorDetail={
        //     queryData.isError
        //       ? queryData.error?.error_detail ?? ""
        //       : userActivityData.error?.error_detail ?? ""
        //   }
        // />
        // )
        <>
          <Grid
            key={"mainGrid"}
            container
            spacing={0}
            // justifyContent="flex-start"
            px={4}
            // alignItems="center"
            direction="column"
            style={{
              background: "rgba(250, 251, 255, 0.9)",
              display: "block",
            }}
            // height={500}
          >
            {/* <Grid
              key={"Griditem1"}
              item
              xs={12}
              md={12}
              lg={12}
              container
              spacing={1}
              justifyContent="center"
              alignItems="center"
              style={{
                marginBottom: "1px",
                marginTop: "5px",
                marginRight: "12px",
              }}
            >
              <AppBar position="relative" color="secondary">
                <Toolbar variant="dense">
                  <Typography
                    component="div"
                    variant="h6"
                    color="inherit"
                    style={{
                      flex: "1 1 100%",
                      color: "var(--theme-color2)",
                      letterSpacing: "1px",
                      fontSize: "1.5rem",
                    }}
                  >
                    {UserProfileMetaData?.form?.label ?? "User Details"}
                  </Typography>
                  <div style={{ flexGrow: 1 }}></div>
                  <Button
                    onClick={() => {
                      setShowProfile(true);
                    }}
                    color="primary"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Change Password
                  </Button>
                </Toolbar>
              </AppBar>
            </Grid> */}
            {/* <Grid
              key={"Griditem2"}
              item
              xs={12}
              md={3}
              lg={3}
              container
              spacing={1}
              justifyContent="flex-end"
              alignItems="flex-end"
              style={{ marginBottom: "1px" }}
            >
              <Paper
                style={{
                  width: "100%",
                  height: "43vh",
                  padding: "50px 24px",
                  // borderRadius: "5%",
                }}
              >
                <div>
                  <div
                    style={{
                      width: "18vh",
                      height: "18vh",
                      margin: "auto",
                      border: "1px dashed #9a9a9a",
                      borderRadius: "50%",
                      padding: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <div className="image-data">
                      <Avatar
                        key={"ProfilePicture"}
                        alt="User"
                        src={
                          Boolean(ProfilePictureURL) ? ProfilePictureURL : ""
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        {(queryData.data?.NAME || userID)
                          .toUpperCase()
                          .substring(0, 1)}
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
                </div>
                <div style={{ marginTop: "10px", textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "x-large",
                      fontFamily: "serif",
                      fontWeight: "bold",
                      color: "var(--theme-color1)",
                      textTransform: "capitalize",
                    }}
                  >
                    {(queryData.data?.NAME || userID).toLowerCase()}
                  </div>
                  <div
                    style={{ fontSize: "small", textTransform: "capitalize" }}
                  >
                    {(queryData.data?.USER_LEVEL || "").toLowerCase()}
                  </div>
                </div>
              </Paper>
            </Grid> */}
            {/* <Grid
              key={"Griditem3"}
              item
              xs={12}
              md={9}
              lg={9}
              container
              spacing={1}
              justifyContent="flex-start"
              alignItems="center"
              style={{ marginBottom: "1px" }}
            >
              <Paper
                className="paddingPaper"
                style={{
                  width: "100%",
                }}
              >
                <FormWrapper
                  key="UserProfile"
                  metaData={UserProfileMetaData as MetaDataType}
                  initialValues={queryData.data}
                  onSubmitHandler={() => {}}
                  displayMode={"view"}
                  hideDisplayModeInTitle={true}
                  formStyle={{
                    background: "white",
                    height: "40vh",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                  hideHeader={true}
                />
              </Paper>
            </Grid> */}
            {/* <Grid
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
            </Grid> */}
            <Box sx={{ my: 3, display: "block" }}>
              <AppBar
                position="static"
                sx={{
                  background: "#FFFFFF",
                  borderRadius: "10px",
                }}
              >
                <Toolbar style={{ minHeight: "53px" }}>
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
                    <Button
                      size="small"
                      sx={{ backgroundColor: "#ECEFF9", mr: 2 }}
                      variant="contained"
                      startIcon={<SaveIcon color="info" />}
                    >
                      Save
                    </Button>
                    <IconButton
                      // size="large"
                      sx={{
                        background: "#ECEFF9",
                        borderRadius: "10px",
                        mx: 1,
                      }}
                      aria-label="show 4 new mails"
                      color="inherit"
                    >
                      <BorderColorIcon color="info" />
                    </IconButton>
                    <IconButton
                      // size="large"
                      sx={{
                        background: "#ECEFF9",
                        borderRadius: "10px",
                        mx: 1,
                      }}
                      aria-label="show 4 new mails"
                      color="inherit"
                    >
                      <DeleteOutlineIcon color="info" />
                    </IconButton>
                    <IconButton
                      // size="large"
                      aria-label="show 4 new mails"
                      color="inherit"
                      sx={{
                        background: "#ECEFF9",
                        borderRadius: "10px",
                        ml: 2,
                      }}
                    >
                      <CancelPresentationIcon color="info" />
                    </IconButton>
                  </Box>
                </Toolbar>
              </AppBar>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Item>xs=8</Item>
                </Grid>
                <Grid item xs={9}>
                  <Box sx={{ width: "100%" }}>
                    <Stack spacing={2}>
                      <Item sx={{ height: "30vh", p: 0, borderRadius: "20px" }}>
                        <Stack>
                          <Item
                            sx={{
                              height: "19vh",
                              p: 0,
                              borderRadius: "20px",
                              backgroundImage: `url(${User_profile})`,
                              backgroundSize: "cover",
                              borderBottomLeftRadius: 0,
                              borderBottomRightRadius: 0,
                            }}
                          >
                            {/* <img src={User_profile} alt="" /> */}
                          </Item>
                          <Item
                            sx={{
                              height: "11vh",
                              background: "#1C1C1C",
                              p: 0,
                              borderRadius: "20px",
                              borderTopLeftRadius: 0,
                              borderTopRightRadius: 0,
                            }}
                          >
                            <div
                              style={{
                                width: "15vh",
                                height: "15vh",
                                // margin: "auto",
                                border: "1px dashed #9a9a9a",
                                borderRadius: "50%",
                                padding: "6px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                                top: "-50px",
                                left: "35px",
                              }}
                            >
                              <div className="image-data">
                                <Avatar
                                  key={"ProfilePicture"}
                                  alt="User"
                                  src={
                                    Boolean(ProfilePictureURL)
                                      ? ProfilePictureURL
                                      : ""
                                  }
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                  }}
                                >
                                  {(queryData.data?.NAME || userID)
                                    .toUpperCase()
                                    .substring(0, 1)}
                                </Avatar>
                              </div>
                              <div
                                className="image-upload-icon"
                                onClick={() =>
                                  fileUploadControl?.current?.click()
                                }
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
                          </Item>
                        </Stack>
                      </Item>
                      <Item
                        sx={{
                          p: 2,
                          borderRadius: "20px",
                          border: "2px solid #EBEDEE",
                        }}
                      >
                        <Typography
                          align="left"
                          variant="h4"
                          fontWeight={500}
                          my={1}
                          color={"var(--theme-color3)"}
                        >
                          About me
                        </Typography>
                        <Typography
                          fontSize={16}
                          align="left"
                          variant="body1"
                          gutterBottom
                        >
                          Hello,I’m Anshan Handgun Creative Graphic Designer &
                          User Experience Designer based in Website, I create
                          digital Products a more Beautiful and usable place.
                          Morbid accusant ipsum. Nam nec tellus at.
                        </Typography>
                      </Item>
                      <Item
                        sx={{
                          borderRadius: "20px",
                          border: "2px solid #EBEDEE",
                        }}
                      >
                        <Box
                          component="form"
                          sx={{
                            "& .MuiTextField-root": {
                              width: "35ch",
                              height: "6ch",
                              marginTop: "10px",
                            },
                          }}
                          noValidate
                          autoComplete="off"
                        >
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                            }}
                          >
                            <div style={{ margin: "10px" }}>
                              <InputLabel
                                style={{
                                  display: "flex",
                                  color: "var(--theme-color6)",
                                  fontSize: "16px",
                                }}
                              >
                                First Name
                              </InputLabel>
                              <TextField
                                variant="standard"
                                style={{
                                  background: "rgba(235, 237, 238, 0.2)",
                                  borderRadius: "15px",
                                  border: "1px solid #EBEDEE",
                                }}
                                InputProps={{
                                  disableUnderline: true,
                                }}
                              />
                            </div>
                            <div style={{ margin: "10px" }}>
                              <InputLabel
                                style={{
                                  display: "flex",
                                  color: "var(--theme-color6)",
                                  fontSize: "16px",
                                }}
                              >
                                Last Name
                              </InputLabel>
                              <TextField
                                variant="standard"
                                style={{
                                  background: "rgba(235, 237, 238, 0.2)",
                                  borderRadius: "15px",
                                  border: "1px solid #EBEDEE",
                                }}
                                InputProps={{
                                  disableUnderline: true,
                                }}
                              />
                            </div>
                            <div style={{ margin: "10px" }}>
                              <InputLabel
                                style={{
                                  display: "flex",
                                  color: "var(--theme-color6)",
                                  fontSize: "16px",
                                }}
                              >
                                Bio
                              </InputLabel>
                              <TextField
                                variant="standard"
                                style={{
                                  background: "rgba(235, 237, 238, 0.2)",
                                  borderRadius: "15px",
                                  border: "1px solid #EBEDEE",
                                }}
                                InputProps={{
                                  disableUnderline: true,
                                }}
                              />
                            </div>
                            <div style={{ margin: "10px" }}>
                              <InputLabel
                                style={{
                                  display: "flex",
                                  color: "var(--theme-color6)",
                                  fontSize: "16px",
                                }}
                              >
                                Email address
                              </InputLabel>
                              <TextField
                                variant="standard"
                                style={{
                                  background: "rgba(235, 237, 238, 0.2)",
                                  borderRadius: "15px",
                                  border: "1px solid #EBEDEE",
                                }}
                                InputProps={{
                                  disableUnderline: true,
                                }}
                              />
                            </div>
                            <div style={{ margin: "10px" }}>
                              <InputLabel
                                style={{
                                  display: "flex",
                                  color: "var(--theme-color6)",
                                  fontSize: "16px",
                                }}
                              >
                                Phone
                              </InputLabel>
                              <TextField
                                variant="standard"
                                style={{
                                  background: "rgba(235, 237, 238, 0.2)",
                                  borderRadius: "15px",
                                  border: "1px solid #EBEDEE",
                                }}
                                InputProps={{
                                  disableUnderline: true,
                                }}
                              />
                            </div>
                          </div>
                        </Box>
                      </Item>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <ChangePassword
            showProfile={showProfile}
            onClose={() => setShowProfile(false)}
          />
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
