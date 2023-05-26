import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { AuthContext } from "../auth";
import { useStyles } from "./style";
import Waving_hand from "assets/images/Waving_Hand_header.png";
import userimage from "assets/images/BecomePartnerImg.svg";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import Logo from "assets/images/easy_bankcore_Logo.png";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Popover,
  Stack,
  TextareaAutosize,
  Toolbar,
  Typography,
} from "@mui/material";
import { Notification_App } from "./notification";
import { Quick_View } from "./quickView";
import { Language_App } from "./language";
import MySearchField from "components/common/search/search";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { UserDetail } from "./userDetail";
export const MyAppBar = ({ handleDrawerOpen, handleDrawerClose, open }) => {
  const authController = useContext(AuthContext);
  const navigate = useNavigate();
  const classes = useStyles();
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
                navigate("./");
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
              src={userimage}
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
            {authController?.authState?.companyName}
            {console.log(authController?.authState?.companyName.length)}
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
                {authController?.authState?.user?.branch ??
                  " Demo Bank Back Office Configuration"}
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

        <MySearchField
          fieldKey="dashboardSearch"
          name="dashboardSearch"
          enableGrid={true}
        />
        <Language_App />

        <Box width={130} display={"flex"} justifyContent={"space-evenly"}>
          <Quick_View />
          <Notification_App />
          <UserDetail />
        </Box>
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
