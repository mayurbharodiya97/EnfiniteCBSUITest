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
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  tooltipClasses,
} from "@mui/material";
import { Notification_App } from "./notification";
import { Quick_View } from "./quickView";
import MySearchField from "components/common/search/search";
import { useQuery } from "react-query";
import { utilFunction } from "components/utils";
import { MultiLanguages } from "pages_audit/auth/multiLanguages";
import AccountDetails from "pages_audit/pages/STATEMENT/accountDetails";
import { Accountinquiry } from "pages_audit/acct_Inquiry/acct_inquiry";
import { useTranslation } from "react-i18next";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
export const MyAppBar = ({
  handleDrawerOpen,
  handleDrawerClose,
  open,
  columns,
}) => {
  const authController = useContext(AuthContext);
  const navigate = useNavigate();
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState<any>(false);
  const [acctInquiry, setAcctInquiry] = useState(false);
  const [pictureURL, setPictureURL] = useState<any | null>({
    bank: "",
    profile: "",
    logo: "",
  });
  const { t } = useTranslation();
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
        companyID: authController?.authState?.access_token?.companyID,
      })
  );
  ////
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
    if (Boolean(data?.[0]?.DHLOGO)) {
      let blob = utilFunction.base64toBlob(data?.[0]?.DHLOGO);
      urlObj.current = {
        ...urlObj.current,
        logo:
          typeof blob === "object" && Boolean(blob)
            ? URL.createObjectURL(blob)
            : "",
      };
      setPictureURL((old) => {
        return { ...old, logo: urlObj.current?.logo };
      });
    }
  }, [data?.[0]?.DHLOGO]);

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
  }, [data?.[0]?.BANK_LOGO]); ////

  const Greetings = () => {
    let hours = new Date().getHours();
    let greet;

    if (hours < 12) greet = "morning";
    else if (hours >= 12 && hours <= 16) greet = "afternoon";
    else if (hours >= 16 && hours <= 24) greet = "evening";

    return (
      <span>
        {t("Good")} {t(greet)},{" "}
      </span>
    );
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
              src={Boolean(pictureURL?.logo) ? pictureURL?.logo : Logo}
              alt="Netbanking"
              className={classes.logo}
              onClick={(e) => {
                e.preventDefault();
                navigate("./dashboard");
              }}
            />
            <p className={classes.version01}>{data?.[0]?.VERSION}</p>
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
                {t("appBar.Branch")}:
                {authController?.authState?.user?.branchCode ?? "001 "}-
                {authController?.authState?.user?.branch ?? ""}
              </Typography>
              <Typography variant="caption" display="inline" fontSize={"11px"}>
                {t("appBar.WorkingDate")}:{" "}
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
                {t("appBar.LastLoginDate")} :{" "}
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
              <Typography fontSize={"17px"} color={"#1C1C1C"}>
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
            {openDialog && <AccountDetails />}

            <MySearchField
              fieldKey="dashboardSearch"
              name="dashboardSearch"
              enableGrid={true}
            />
            <MultiLanguages />

            <Box width={170} display={"flex"} justifyContent={"space-evenly"}>
              <Tooltip title="Account Inquiry" placement="bottom" arrow>
                <IconButton
                  // renderIcon="PersonSearchOutlined"
                  onClick={() => setAcctInquiry(true)}
                  sx={{
                    backgroundColor: acctInquiry
                      ? "var(--theme-color3)"
                      : "rgba(235, 237, 238, 0.45)",
                    color: acctInquiry
                      ? "var(--theme-color2)"
                      : "var(--theme-color3)",
                    borderRadius: "10px",
                    height: "30px",
                    width: "30px",
                    "&:hover": {
                      background: "var(--theme-color2)",
                      borderRadius: "10px",
                      transition: "all 0.2s ease 0s",
                      boxShadow:
                        "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                      "& .MuiSvgIcon-root": {
                        height: "32px",
                        width: "32px",
                        transition: "all 0.2s ease 0s",
                        padding: "4px",
                      },
                    },
                  }}
                >
                  <PersonSearchOutlinedIcon
                    fontSize="small"
                    sx={{
                      color: acctInquiry
                        ? "var(--theme-color2)"
                        : "var(--theme-color3)",
                    }}
                  />
                </IconButton>
              </Tooltip>
              {acctInquiry && (
                <Accountinquiry
                  open={acctInquiry}
                  onClose={() => setAcctInquiry(false)}
                />
              )}
              <Quick_View />
              <Notification_App />
              <Tooltip title="Logout" placement="bottom" arrow>
                <IconButton
                  onClick={() => {
                    authController?.logout();
                    // handleClose();
                  }}
                  color="error"
                  sx={{
                    backgroundColor: "rgba(235, 237, 238, 0.45)",

                    borderRadius: "10px",
                    height: "30px",
                    width: "30px",
                    "&:hover": {
                      background: "var(--theme-color2)",
                      borderRadius: "10px",
                      transition: "all 0.2s ease 0s",
                      boxShadow:
                        "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                      "& .MuiSvgIcon-root": {
                        height: "32px",
                        width: "32px",
                        transition: "all 0.2s ease 0s",
                        padding: "4px",
                      },
                    },
                  }}
                  aria-label="show 4 new mails"
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
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
                  <div>
                    {" "}
                    {t("appBar.UserID")}: {authController?.authState?.user?.id}
                  </div>
                  <div>
                    {t("appBar.Role")} : {authController?.authState?.roleName}
                  </div>
                  <div>{t("appBar.LastUnsuccessfulLogin")} : ""</div>
                </>
              }
              placement="bottom-start"
            >
              <Avatar
                className={classes.heading_user_img}
                onClick={handleNavigate}
                alt="Remy Sharp"
                // src={
                //   Boolean(pictureURL?.profile)
                //     ? pictureURL?.profile
                //     : USER_PROFILE_DEFAULT
                // }
                src={
                  Boolean(authController?.getProfileImage)
                    ? authController?.getProfileImage
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

export const checkDateAndDisplay = (dateStr: string) => {
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
