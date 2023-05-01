import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "assets/images/netbankinglogo.png";
// import Popover from "@material-ui/core/Popover";
import { AuthContext } from "../auth";
import { useStyles } from "./style";
import {
  AppBar,
  Avatar,
  Button,
  IconButton,
  MenuItem,
  Popover,
  Toolbar,
  Typography,
} from "@mui/material";
//import { ShowEntities, ShowProducts } from "./entities";
// import { NotificationWrapper } from "../notification";

export const MyAppBar = ({ handleDrawerOpen, open }) => {
  const authController = useContext(AuthContext);
  const navigate = useNavigate();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, open && classes.appBarShift)}
    >
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
        >
          <MenuIcon />
        </IconButton>
        {open !== true ? (
          <img
            src={Logo}
            alt="Ratnaafin"
            className={classes.logo}
            onClick={(e) => {
              e.preventDefault();
              navigate("./");
            }}
          />
        ) : null}

        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          className={classes.title}
        >
          {authController?.authState?.companyName}
          <div style={{ display: "flex", gap: "8px" }}>
            <div>
              <Typography variant="caption" display="block" color="secondary">
                Branch: {authController?.authState?.user?.branchCode ?? ""} -{" "}
                {authController?.authState?.user?.branch ?? ""}
              </Typography>
              <Typography variant="caption" display="block" color="secondary">
                Last Login:{" "}
                {checkDateAndDisplay(
                  authController?.authState?.user?.lastLogin ?? ""
                )}
              </Typography>
            </div>
          </div>
        </Typography>

        <div className={classes.loggedInUser}>
          {/* <NotificationWrapper /> */}
          <IconButton onClick={handleClick}>
            <Avatar
              aria-label={authController?.authState?.user?.name ?? ""}
              style={{ backgroundColor: "var(--theme-color1)" }}
            >
              {authController?.authState?.user?.name
                ?.substring(0, 1)
                .toUpperCase()}
            </Avatar>
          </IconButton>
          <Popover
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            elevation={3}
            // getContentAnchorEl={null}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            PaperProps={{
              style: { maxWidth: "240px" },
            }}
          >
            <div style={{ padding: "16px" }}>
              <Typography variant="h6" className={classes.userName}>
                {authController?.authState?.user?.name}
              </Typography>
              <Typography variant="h6" className={classes.userDesignation}>
                {authController?.authState?.companyName}
              </Typography>
              <Typography variant="h6" className={classes.userDesignation}>
                Role: {authController?.authState?.roleName}
              </Typography>
              <Typography variant="h6" className={classes.userDesignation}>
                User ID : {authController?.authState?.user?.id}
              </Typography>
              {/* <ShowEntities
                entities={authController?.authState?.access?.entities}
              />
              <ShowProducts
                products={authController?.authState?.access?.products}
              /> */}
            </div>

            <MenuItem
              onClick={() => {
                navigate("/netbanking/profile");
                handleClose();
              }}
              className={classes.userprofilehover}
            >
              <AccountCircleIcon color="secondary" />
              <span className={classes.vTop}>Profile</span>
            </MenuItem>

            <div style={{ padding: "16px" }}>
              <Button
                onClick={() => {
                  authController?.logout();
                  handleClose();
                }}
                fullWidth
                variant="outlined"
                style={{ background: "var(--theme-color1)", color: "white" }}
              >
                Logout
              </Button>
            </div>
          </Popover>
        </div>
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
