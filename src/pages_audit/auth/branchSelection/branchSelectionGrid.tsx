import GridWrapper from "components/dataTableStatic";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { BranchSelectionGridMetaData } from "./gridMetaData";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider } from "cache";
import branchSelectionSideImage from "assets/images/sideImage.png";
import "./css/branchSelectionGrid.css";
import { Alert } from "components/common/alert";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Stack,
  Tooltip,
  Typography,
  tooltipClasses,
} from "@mui/material";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import React, { useRef } from "react";
import { useSnackbar } from "notistack";
import { AuthContext } from "pages_audit/auth";
import { queryClient } from "cache";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import easy_bank_core_logo from "assets/images/easy_bankcore_Logo.png";
import bank_logo_default from "assets/images/BecomePartnerImg.svg";
import Waving_hand from "assets/images/Waving_Hand_header.png";

import { useStyles } from "pages_audit/appBar/style";
import { utilFunction } from "components/utils";
import { getBankimgAndProfileimg } from "pages_audit/appBar/api";
import { styled } from "@mui/material/styles";
import USER_PROFILE_DEFAULT from "assets/images/USER_PROFILE_DEFAULT.png";
import Logo from "assets/images/easy_bankcore_Logo.png";
const actions: ActionTypes[] = [
  {
    actionName: "back",
    actionLabel: "Back",
    multiple: false,
    rowDoubleClick: false,
    actionTextColor: "var(--theme-color3)",
    actionBackground: "var(--theme-color2)",
    startsIcon: "West",
    rotateIcon: "rotateX",
  },
  {
    actionName: "proceed",
    actionLabel: "Proceed",
    multiple: false,
    rowDoubleClick: true,
    actionTextColor: "var(--theme-color2)",
    actionBackground: "var(--theme-color3)",
    onEnterSubmit: true,
    endsIcon: "East",
    rotateIcon: "rotateX",
  },
];

const BranchSelectionGrid = ({ selectionMode }) => {
  const { authState, isBranchSelected, branchSelect, isLoggedIn, logout } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const rowsData = useRef<any>({});
  const classes = useStyles();
  const [pictureURL, setPictureURL] = useState<any | null>({
    bank: "",
    profile: "",
    logo: "",
  });
  const urlObj = useRef<any>({ bank: "", profile: "", logo: "" });
  const authController = useContext(AuthContext);

  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["BranchSelectionGridData"], () => API.BranchSelectionGridData());

  const imagesData = useQuery<any, any>(["getBankimgAndProfileimg"], () =>
    getBankimgAndProfileimg({
      userID: authController?.authState?.user?.id,
      companyID: authController?.authState?.access_token?.companyID,
    })
  );

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/cbsenfinity/login");
    } else if (isBranchSelected() && selectionMode !== "C") {
      navigate("/cbsenfinity/dashboard");
    }
  }, [isBranchSelected, isLoggedIn]);

  type MutationErrorType = {
    severity: string;
    error_msg: string;
    error_detail: string;
  };

  const mutation = useMutation(API.GetMenuData, {
    onSuccess: (data) => {
      branchSelect({
        menulistdata: data,
        branchCode: rowsData?.current?.BRANCH_CD,
        branch: rowsData?.current?.BRANCH_NM,
        baseBranchCode: rowsData?.current?.BASE_BRANCH_CD,
      });
    },
  });
  const getError: any = mutation.error as MutationErrorType;
  const setCurrentAction = useCallback(
    (data) => {
      if (data.name === "proceed") {
        if (data.rows?.length === 0) {
          enqueueSnackbar("Please Select Branch", {
            variant: "error",
          });
        } else if (data.rows?.[0]?.data?.STATUS === "Closed") {
          enqueueSnackbar("Please Select Open Branch.", {
            variant: "error",
          });
        } else {
          rowsData.current = data.rows?.[0]?.data;
          mutation.mutate({
            BASE_COMP_CD: data.rows?.[0]?.data?.BASE_COMP_CD ?? "",
            BASE_BRANCH_CD: data.rows?.[0]?.data?.BASE_BRANCH_CD ?? "",
            COMP_CD: data.rows?.[0]?.data?.COMP_CD ?? "",
            BRANCH_CD: data.rows?.[0]?.data?.BRANCH_CD ?? "",
            GROUP_NAME: authState?.roleName ?? "",
            APP_TRAN_CD: "51",
            COMP_NM: data.rows?.[0]?.data?.COMP_NM ?? "",
            BRANCH_NM: data.rows?.[0]?.data?.BRANCH_NM ?? "",
            DAYEND_STATUS: data.rows?.[0]?.data?.DAYEND_STATUS ?? "",
            EOD_RUNNING_STATUS: data.rows?.[0]?.data?.EOD_RUNNING_STATUS ?? "",
            IS_UPD_DEF_BRANCH: authState?.user?.isUpdDefBranch ?? "",
            COMP_BASE_BRANCH_CD:
              data.rows?.[0]?.data?.COMP_BASE_BRANCH_CD ?? "",
            selectionMode,
            fulldata: authState,
          });
        }
      } else {
        if (selectionMode === "C") {
          navigate("/cbsenfinity/dashboard", {
            replace: true,
          });
        } else {
          logout();
        }
      }
    },
    [navigate, data, mutation]
  );

  useEffect(() => {
    if (data?.length === 1) {
      if (data?.[0]?.STATUS === "Closed") {
        enqueueSnackbar("Please Select Open Branch.", {
          variant: "error",
        });
      } else {
        setCurrentAction({ name: "proceed", rows: [{ data: { ...data[0] } }] });
      }
    }
  }, [JSON.stringify(data)]);

  const Greetings = () => {
    let hours = new Date().getHours();
    let greet;

    if (hours < 12) greet = "morning";
    else if (hours >= 12 && hours <= 16) greet = "afternoon";
    else if (hours >= 16 && hours <= 24) greet = "evening";

    return <span>Good {greet},</span>;
  };

  let companyNameText = /*authState?.companyName*/ "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const shouldScroll = companyNameText?.length > 15;

  useEffect(() => {
    if (Boolean(imagesData.data?.[0]?.PROFILE_PHOTO)) {
      let blob = utilFunction.base64toBlob(imagesData.data?.[0]?.PROFILE_PHOTO);
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
  }, [imagesData.data?.[0]?.PROFILE_PHOTO]);

  useEffect(() => {
    if (Boolean(imagesData.data?.[0]?.DHLOGO)) {
      let blob = utilFunction.base64toBlob(imagesData.data?.[0]?.DHLOGO);
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
  }, [imagesData.data?.[0]?.DHLOGO]);

  useEffect(() => {
    if (Boolean(imagesData.data?.[0]?.BANK_LOGO)) {
      let blob = utilFunction.base64toBlob(imagesData.data?.[0]?.BANK_LOGO);
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
  }, [imagesData.data?.[0]?.BANK_LOGO]);

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

  return (
    <>
      <Grid
        container
        style={{
          margin: "0",
          padding: "0",
          height: "100vh",
          // overflowY: "hidden",
        }}
      >
        <Grid item lg={1} md={1} xl={1} xs={1} sm={1}>
          <img
            className="sideImage"
            src={branchSelectionSideImage}
            alt="side-Image"
          />
        </Grid>

        <Grid
          item
          lg={11}
          md={11}
          xl={11}
          xs={11}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid
            container
            style={{
              minHeight: "100vh",
              padding: "10px 0px 0px 0px",
            }}
            lg={11}
            md={11}
            xl={11}
            xs={11}
          >
            <Grid
              container
              style={{
                margin: "0",
                padding: "0",
                // height: "12vh",
              }}
              lg={12}
              md={12}
              xl={12}
              xs={12}
            >
              {/* <Grid
                item
                lg={5}
                md={5}
                xl={5}
                xs={12}
                sm={5}
                style={{
                  justifyContent: "center",
                }}
              >
                <h1
                  className="name-heading"
                  style={{ fontSize: "24px", margin: "4px 0px" }}
                >
                  Welcome <span>{`${authState?.user?.name ?? ""},`}</span>
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <h3 style={{ margin: "4px 0px" }}>{Greetings()}</h3>
                  <img src={Waving_hand} alt="" style={{ height: "18px" }} />
                </div>
                <h1
                  className="access-heading"
                  style={{ fontSize: "22px" }}
                ></h1>
              </Grid>
              <Grid
                item
                lg={7}
                md={7}
                xl={7}
                xs={12}
                sm={7}
                style={{
                  margin: "4px 0px 0 0",
                  padding: "0",
                  // justifyContent: "right",
                  height: "fit-content",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={3}
                  lg={3}
                  xl={3}
                  sx={{
                    border: "2px dashed var(--theme-color6)",
                    borderRadius: "6px",
                    padding: "10px",
                  }}
                >
                  <img alt="" src={easy_bank_core_logo} />
                </Grid>
                <Grid item>
                   <div
                    style={{
                      overflowX: shouldScroll ? "auto" : "hidden",
                    }}
                  >
                    <Typograpy variant="body1">{companyNameText}</Typography>
                  </div> 
                  <div
                    className="bank-name-container"
                    style={{ fontSize: "14px" }}
                  >
                    <p className="bank-name">
                      {`Bank Name: ${authState?.companyName ?? ""}`}
                    </p>
                  </div>

                  <p className="emp-id" style={{ fontSize: "14px" }}>
                    {`Emp. Id: ${authState?.user?.employeeID ?? ""}`}
                  </p>
                </Grid>
                {/*
                 
              </Grid> */}
              <Grid
                xs={12}
                sm={1}
                md={1}
                lg={1}
                xl={1}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  // justifyContent: "center",
                }}
              >
                <Stack direction="row" spacing={4} ml={1}>
                  <Box
                    className={classes.heading_user_img_border}
                    sx={{ cursor: "pointer" }}
                  >
                    <LightTooltip
                      title={
                        <>
                          <div>
                            User ID : {authController?.authState?.user?.id}
                          </div>
                          <div>
                            Role : {authController?.authState?.roleName}
                          </div>
                          <div>Last Unsuccessful Login : ""</div>
                        </>
                      }
                      placement="bottom-start"
                    >
                      <Avatar
                        className={classes.heading_user_img}
                        // onClick={handleNavigate}
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
              </Grid>
              <Grid
                xs={12}
                sm={5}
                md={5}
                lg={5}
                xl={5}
                sx={{
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h1
                  className="name-heading"
                  style={{ fontSize: "24px", margin: "4px 0px" }}
                >
                  Welcome <span>{`${authState?.user?.name ?? ""},`}</span>
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <h3 style={{ margin: "4px 0px" }}>{Greetings()}</h3>
                  <img src={Waving_hand} alt="" style={{ height: "18px" }} />
                </div>
              </Grid>
              <Grid
                xs={12}
                sm={1}
                md={1}
                lg={1}
                xl={1}
                sx={{
                  display: "flex",
                  // flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Stack direction="row" justifyContent="flex-start" spacing={2}>
                  <Box className={classes.heading_user_img_border}>
                    <Avatar
                      className={classes.heading_user_img}
                      alt="Remy Sharp"
                      src={
                        Boolean(pictureURL?.bank)
                          ? pictureURL?.bank
                          : bank_logo_default
                      }
                    />
                  </Box>
                </Stack>
              </Grid>
              <Grid
                xs={12}
                sm={3}
                md={3}
                lg={3}
                xl={3}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  className="bank-name-container"
                  style={{ fontSize: "14px" }}
                >
                  <p className="bank-name">
                    {`Bank Name: ${authState?.companyName ?? ""}`}
                  </p>
                </div>

                <p className="emp-id">
                  {`Emp. Id: ${authState?.user?.employeeID ?? ""}`}
                </p>
              </Grid>
              <Grid
                xs={12}
                sm={3}
                md={3}
                lg={2}
                xl={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "right",
                }}
              >
                {" "}
                <div>
                  <img
                    src={Boolean(pictureURL?.logo) ? pictureURL?.logo : Logo}
                    alt="Netbanking"
                    className={classes.logo}
                  />
                </div>
              </Grid>
            </Grid>

            {isError ? (
              <Fragment>
                <div style={{ width: "100%", paddingTop: "10px" }}>
                  <Alert
                    severity={error?.severity ?? "error"}
                    errorMsg={error?.error_msg ?? "Error"}
                    errorDetail={error?.error_detail ?? ""}
                  />
                </div>
              </Fragment>
            ) : mutation.isError && mutation.error ? (
              <Fragment>
                <div style={{ width: "100%", paddingTop: "10px" }}>
                  <Alert
                    severity={getError.severity ?? "error"}
                    errorMsg={getError.error_msg ?? "Error"}
                    errorDetail={getError.error_detail ?? ""}
                  />
                </div>
              </Fragment>
            ) : null}
            <GridWrapper
              key={`branchSelection`}
              finalMetaData={BranchSelectionGridMetaData as GridMetaDataType}
              data={data ?? []}
              setData={() => null}
              actions={actions}
              setAction={setCurrentAction}
              controlsAtBottom={true}
              headerToolbarStyle={{
                background: "var(--theme-color2)",
                color: "black",
                padding: "0",
              }}
              onlySingleSelectionAllow={true}
              isNewRowStyle={true}
              loading={isLoading || isFetching || mutation.isLoading}
              defaultSelectedRowId={authState?.user?.branchCode ?? null}
            />
            {isError || data?.length === 0 ? (
              <Button
                sx={{
                  backgroundColor: "var(--theme-color3)",
                  position: "absolute",
                  right: "113px",
                  bottom: "20px",
                  width: "7rem",
                  "&:hover": {
                    backgroundColor: "var(--theme-color3)",
                  },
                }}
                onClick={() => {
                  if (selectionMode === "C") {
                    navigate("/cbsenfinity/dashboard", {
                      replace: true,
                    });
                  } else {
                    logout();
                  }
                }}
              >
                Back
              </Button>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export const BranchSelectionGridWrapper = ({ selectionMode }) => {
  return (
    <ClearCacheProvider>
      <BranchSelectionGrid selectionMode={selectionMode} />
    </ClearCacheProvider>
  );
};
