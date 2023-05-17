import { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { AuthContext } from "../auth";
import { useStyles } from "./style";
import SearchIcon from "@mui/icons-material/Search";
import Waving_hand from "assets/images/Waving_Hand_header.png";
import userimage from "assets/images/BecomePartnerImg.svg";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import { AppBar, Avatar, Box, Stack, Toolbar, Typography } from "@mui/material";
import { Notification_App } from "./notification";
import { Wifi_App } from "./wifi";
import { Language_App } from "./language";
//import { ShowEntities, ShowProducts } from "./entities";
// import { NotificationWrapper } from "../notification";

export const MyAppBar = ({ handleDrawerOpen, open }) => {
  const authController = useContext(AuthContext);
  // const navigate = useNavigate();
  const classes = useStyles();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      className={clsx(classes.appBar, open && classes.appBarShift)}
    >
      <Toolbar className={classes.toolbar}>
        <Stack direction="row" spacing={4} margin={2}>
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
          <div style={{ margin: "3px 0", fontSize: "27px", color: "#1C1C1C" }}>
            {authController?.authState?.companyName}
            <span style={{ marginLeft: "7px" }}>
              <img src={Waving_hand} alt="Waving_hand not found" />
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ color: "#949597" }}>
              <Typography variant="caption" display="block" lineHeight={0}>
                Branch: {authController?.authState?.user?.branchCode ?? ""} -{" "}
                {authController?.authState?.user?.branch ?? ""}
              </Typography>
              <Typography variant="caption" display="inline">
                Login Branch:{" "}
                {checkDateAndDisplay(
                  authController?.authState?.user?.lastLogin ?? ""
                )}
              </Typography>
              <Typography variant="caption" display="inline" marginLeft={1}>
                Working Date:{" "}
                {checkDateAndDisplay(
                  authController?.authState?.workingDate ?? ""
                )}
              </Typography>
            </div>
          </div>
        </Typography>

        <Paper
          component="form"
          sx={{
            display: "flex",
            alignItems: "center",
            width: 250,
            height: 38,
            backgroundColor: "rgba(235, 237, 238, 0.45)",
          }}
        >
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ flex: 1 }}
            placeholder="Search here..."
            inputProps={{ "aria-label": "search google maps" }}
          />
        </Paper>

        <Language_App />

        <Box width={100} display={"flex"} justifyContent={"space-evenly"}>
          <Wifi_App />
          <Notification_App />
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
