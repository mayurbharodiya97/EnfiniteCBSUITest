import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { AuthContext } from "../auth";
import { useStyles } from "./style";
import Waving_hand from "assets/images/Waving_Hand_header.png";
import bank_logo_default from "assets/images/BecomePartnerImg.svg";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import Logo from "assets/images/easy_bankcore_Logo.png";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import * as API from "./api";
import { styled } from "@mui/material/styles";
import USER_PROFILE_DEFAULT from "assets/images/USER_PROFILE_DEFAULT.png";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Popover,
  Stack,
  TextareaAutosize,
  Toolbar,
  Tooltip,
  Typography,
  tooltipClasses,
} from "@mui/material";
import { Notification_App } from "./notification";
import { Quick_View } from "./quickView";
import { Language_App } from "./language";
import MySearchField from "components/common/search/search";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { UserDetail } from "./userDetail";
import { useQuery } from "react-query";
import { utilFunction } from "components/utils";
export const MyAppBar = ({ handleDrawerOpen, handleDrawerClose, open }) => {
  const authController = useContext(AuthContext);
  const navigate = useNavigate();
  const classes = useStyles();
  const [pictureURL, setPictureURL] = useState<any | null>({
    bank: "",
    profile: "",
  });
  const urlObj = useRef<any>({ bank: "", profile: "" });
  const handleNavigate = () => {
    navigate("/cbsenfinity/profile");
    handleClose();
  };
  const [anchorEl1, setAnchorEl1] = useState(null);
  const handleClick = (event) => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl1(null);
  };

  const LightTooltip = styled(({ className, ...props }: any) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 13,
    },
  }));
  const { data, isLoading, isFetching, refetch } = useQuery<any, any>(
    ["getBankimgAndProfileimg"],
    () =>
      API.getBankimgAndProfileimg({
        userID: authController?.authState?.user?.id,
      })
  );
  useEffect(() => {
    if (Boolean(data?.[0]?.PROFILE_PHOTO)) {
      let blob = utilFunction.base64toBlob(data?.[0]?.PROFILE_PHOTO);
      urlObj.current = {
        ...urlObj.current,
        profile:
          typeof blob === "object" && Boolean(blob)
            ? URL.createObjectURL(blob)
            : "",
      };
      setPictureURL((old) => {
        return { ...old, profile: urlObj.current?.profile };
      });
    }
  }, [data?.[0]?.PROFILE_PHOTO]);

  useEffect(() => {
    if (Boolean(data?.[0]?.BANK_LOGO)) {
      let blob = utilFunction.base64toBlob(data?.[0]?.BANK_LOGO);
      urlObj.current = {
        ...urlObj.current,
        bank:
          typeof blob === "object" && Boolean(blob)
            ? URL.createObjectURL(blob)
            : "",
      };
      setPictureURL((old) => {
        return { ...old, bank: urlObj.current?.bank };
      });
    }
  }, [data?.[0]?.BANK_LOGO]);

  const Greetings = () => {
    let hours = new Date().getHours();
    let greet;

    if (hours < 12) greet = "morning";
    else if (hours >= 12 && hours <= 16) greet = "afternoon";
    else if (hours >= 16 && hours <= 24) greet = "evening";

    return <span>Good {greet},</span>;
  };
  return (
    <AppBar
      position="fixed"
      elevation={0}
      className={clsx(classes.appBar, open && classes.appBarShift)}
    >
      <Toolbar className={classes.toolbar}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            height: "80px",
            width: "227px",
          }}
        >
          {open ? (
            <IconButton
              disableRipple
              onClick={handleDrawerClose}
              className={classes.DrawerClose_icon}
            >
              <MenuOutlinedIcon fontSize="large" />
            </IconButton>
          ) : (
            <IconButton
              disableRipple
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={classes.DrawerClose_icon}
            >
              <MenuOutlinedIcon fontSize="large" />
            </IconButton>
          )}

          <div>
            <img
              src={Logo}
              alt="Netbanking"
              className={classes.logo}
              onClick={(e) => {
                e.preventDefault();
                navigate("./dashboard");
              }}
            />
            <p className={classes.version01}>V: 1.12.03.1</p>
          </div>
        </Box>
        <Stack direction="row" spacing={4} mx={2}>
          <Box className={classes.heading_user_img_border}>
            <Avatar
              className={classes.heading_user_img}
              alt="Remy Sharp"
              src={
                Boolean(pictureURL?.bank) ? pictureURL?.bank : bank_logo_default
              }
            />
          </Box>
        </Stack>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          className={classes.title}
        >
          <Box
            style={{
              marginBottom: "8px",
              fontSize: "17px",
              color: "#1C1C1C",
              // overflowX: "auto",
              width: "555px",
            }}
            className={clsx({
              [classes.marquee]:
                authController?.authState?.companyName.length > 55,
            })}
          >
            {authController?.authState?.companyName || ""}
          </Box>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ color: "#949597" }}>
              <Typography
                variant="caption"
                display="block"
                lineHeight={0}
                fontSize={"11px"}
              >
                Branch: {authController?.authState?.user?.branchCode ?? "001 "}-
                {authController?.authState?.user?.branch ?? ""}
              </Typography>
              <Typography variant="caption" display="inline" fontSize={"11px"}>
                Working Date:{" "}
                {checkDateAndDisplay(
                  authController?.authState?.workingDate ?? ""
                )}
              </Typography>
              <Typography
                marginLeft={1}
                variant="caption"
                display="inline"
                fontSize={"11px"}
              >
                Last Login Date :{" "}
                {checkDateAndDisplay(
                  authController?.authState?.user?.lastLogin ?? "Vastrapur"
                )}
              </Typography>
            </div>
          </div>
        </Typography>
        <Box>
          <Box sx={{ marginBottom: "3px", paddingRight: "15px" }}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent={"flex-end"}
              alignItems={"center"}
            >
              {/* <Avatar
                alt="Remy Sharp"
                src="/static/images/avatar/1.jpg"
                sx={{ height: "35px", width: "35px" }}
              /> */}
              <Typography fontSize={"17px"} color={"#1C1C1C"}>
                {/* Greetings....{" "} */}
                {Greetings()} {authController.authState.user.id}
              </Typography>
              <img src={Waving_hand} alt="" style={{ height: "18px" }} />
            </Stack>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-evenly"}
            alignItems={"center"}
          >
            <MySearchField
              fieldKey="dashboardSearch"
              name="dashboardSearch"
              enableGrid={true}
            />
            <Language_App />

            <Box width={130} display={"flex"} justifyContent={"space-evenly"}>
              <Quick_View />
              <Notification_App />
              <IconButton
                onClick={() => {
                  authController?.logout();
                  // handleClose();
                }}
                sx={{
                  backgroundColor: "rgba(235, 237, 238, 0.45)",
                  borderRadius: "10px",
                  height: "30px",
                  width: "30px",
                }}
                aria-label="show 4 new mails"
                color="inherit"
              >
                <LogoutIcon
                  color="inherit"
                  fontSize="small"
                  sx={{ color: "var(--theme-color3)" }}
                />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Stack direction="row" spacing={4} ml={1}>
          <Box
            className={classes.heading_user_img_border}
            sx={{ cursor: "pointer" }}
          >
            <LightTooltip
              title={
                <>
                  <div>User ID : {authController?.authState?.user?.id}</div>
                  <div>Role : {authController?.authState?.roleName}</div>
                  <div>Last Unsuccessful Login : ""</div>
                </>
              }
              placement="bottom-start"
            >
              <Avatar
                className={classes.heading_user_img}
                onClick={handleNavigate}
                alt="Remy Sharp"
                src={
                  Boolean(pictureURL?.profile)
                    ? pictureURL?.profile
                    : USER_PROFILE_DEFAULT
                }
              />
            </LightTooltip>
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

const checkDateAndDisplay = (dateStr: string) => {
  // const dt = new Date(dateStr);
  // //@ts-ignore
  // if (dt instanceof Date && !isNaN(dt)) {
  //   return dt.toDateString();
  // }
  if (Boolean(dateStr)) {
    return dateStr;
  }
  return "N/A";
};
