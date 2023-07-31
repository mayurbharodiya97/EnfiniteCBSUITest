import { useMutation } from "react-query";
import { useSnackbar } from "notistack";
import { cloneDeep } from "lodash-es";

import * as API from "../api";
import { DynamicReportConfigMetaData } from "./metaData";
import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { useContext, useRef, useState } from "react";
import {
  AppBar,
  CircularProgress,
  Grid,
  TextField,
  Toolbar,
  Typography,
  Theme,
  Dialog,
} from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import { MasterDetailsForm } from "components/formcomponent";
import { Alert } from "components/common/alert";
import { RetrievalParametersGrid } from "./retrievalParameters";
import { makeStyles } from "@mui/styles";
import { AuthContext } from "pages_audit/auth";
import Logo from "assets/images/easy_bankcore_Logo.png";
import { useStyles } from "pages_audit/appBar/style";
import bank_logo_default from "assets/images/BecomePartnerImg.svg";

import {
  Box,
  ToggleButtonGroup,
  Button,
  Divider,
  Chip,
  Skeleton,
  Avatar,
  ButtonGroup,
  Icon,
  Tooltip,
  Modal,
  Tab,
  Stack,
  Autocomplete,
  Select,
  MenuItem,
} from "@mui/material";
import { checkDateAndDisplay } from "pages_audit/appBar/appBar";
import clsx from "clsx";
const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color1)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  refreshiconhover: {},
}));

interface addMasterDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
  SetLoadingOWN?: any;
}

const addMasterFormDataFnWrapper =
  (addMasterFn) =>
  async ({ data }: addMasterDataType) => {
    return addMasterFn(data);
  };

const AddDynamicGridConfig = ({ isDataChangedRef, closeDialog }) => {
  const headerClasses = useTypeStyles();
  const { enqueueSnackbar } = useSnackbar();
  const myRef = useRef<any>(null);
  const myVerifyCntRef = useRef(0);
  const mySqlSyntaxRef = useRef<any>(false);
  const myparameterDataRef = useRef<any>([]);
  const [isLoading, setLoading] = useState(false);
  const [isOpenRerieval, setIsOpenRerieval] = useState(false);
  const [formName, setformName] = useState("");
  const [sqlSyntax, setSqlSyntax] = useState("");
  const mynewSqlSyntaxRef = useRef<any>("");
  const authController = useContext(AuthContext);
  const appBarClasses = useStyles();
  const [errorObjData, seterrorObjData] = useState({
    isError: false,
    error: { error_msg: "", error_detail: "" },
  });
  const mutation = useMutation(
    addMasterFormDataFnWrapper(API.insertMastersData()),
    {
      onError: (error: any, { endSubmit, SetLoadingOWN }) => {
        SetLoadingOWN(false, error?.error_msg, error?.error_detail ?? "");
      },
      onSuccess: (data, { endSubmit, SetLoadingOWN }) => {
        SetLoadingOWN(true, "");
        isDataChangedRef.current = true;
        enqueueSnackbar(data, {
          variant: "success",
        });
        closeDialog();
      },
    }
  );
  const verifySql = useMutation(API.verifyDynRptSqlSyntax, {
    onError: (error: any) => {},
    onSuccess: (data) => {
      mySqlSyntaxRef.current = true;
      let detailData = data?.[0]?.DETAILS.map((item) => {
        return {
          ...item,
          _isNewRow: true,
        };
      });
      myRef.current?.setGridData(detailData);
      myparameterDataRef.current = data?.[0]?.PARAMETERS;
      setformName("dynDetail" + myVerifyCntRef.current);
      myVerifyCntRef.current = myVerifyCntRef.current + 1;
      enqueueSnackbar("Query Successfully Verified.", {
        variant: "success",
      });
    },
  });

  const onSubmitHandler = ({
    data,
    resultValueObj,
    resultDisplayValueObj,
    endSubmit,
    setFieldErrors,
    actionFlag,
  }) => {
    if (!mySqlSyntaxRef.current) {
      setLocalError(true, "Please Verify Query..", "");
      endSubmit(true, "Please Verify Query..");
      return;
    }
    setLoading(true);
    const SetLoadingOWN = (isLoading, error_msg = "", error_detail = "") => {
      setLoading(isLoading);
      endSubmit(isLoading, error_msg, error_detail);
    };

    data.PARAMETERS = myparameterDataRef.current;
    data.SQL_ANSI_SYNTAX = mynewSqlSyntaxRef.current;
    mutation.mutate({ data, SetLoadingOWN, endSubmit });
  };

  const setLocalError = (isError, error_msg = "", error_detail = "") => {
    seterrorObjData({
      isError: isError,
      error: { error_msg: error_msg, error_detail: error_detail },
    });
  };

  const onCloseDialog = () => {
    setIsOpenRerieval(false);
  };
  const onSaveParameters = (data) => {
    myparameterDataRef.current = data;
    setIsOpenRerieval(false);
  };

  let metadata: MasterDetailsMetaData = {} as MasterDetailsMetaData;

  metadata = cloneDeep(DynamicReportConfigMetaData) as MasterDetailsMetaData;
  return (
    <>
      <Grid container>
        <AppBar
          position="sticky"
          color="primary"
          // style={{ marginBottom: "10px" }}
        >
          <Toolbar
            variant="dense"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <div>
              <img
                src={Logo}
                alt="Netbanking"
                className={appBarClasses.logo}
                onClick={(e) => {
                  e.preventDefault();
                }}
              />
              <p className={appBarClasses.version01}>V: 1.12.03.1</p>
            </div>
            <Stack direction="row" spacing={4} mx={2}>
              <Box className={appBarClasses.heading_user_img_border}>
                <Avatar
                  className={appBarClasses.heading_user_img}
                  alt="Remy Sharp"
                  src={bank_logo_default}
                />
              </Box>
            </Stack>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={appBarClasses.title}
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
                  [appBarClasses.marquee]:
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
                    Branch:{" "}
                    {authController?.authState?.user?.branchCode ?? "001 "}-
                    {authController?.authState?.user?.branch ?? ""}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="inline"
                    fontSize={"11px"}
                  >
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
            <Typography fontSize={"17px"} color={"#1C1C1C"}>
              {/* Greetings....{" "} */}
              {Greetings()} {authController.authState.user.id}
            </Typography>
            {/* <Typography
              className={classes.title}
              color="inherit"
              variant={"h6"}
              component="div"
            >
              C-KYC Individual/Legal Entry
            </Typography> */}
            <Button
              color="primary"
              // disabled={mutation.isLoading}
            >
              Close
            </Button>
          </Toolbar>
        </AppBar>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          style={{
            paddingTop: "10px",
            paddingLeft: "10px",
            paddingRight: "10px",
          }}
        >
          <AppBar
            position="relative"
            color="secondary"
            style={{ marginBottom: "5px" }}
          >
            <Toolbar className={headerClasses.root} variant={"dense"}>
              <Typography
                className={headerClasses.title}
                color="inherit"
                variant={"h6"}
                component="div"
              >
                Dynamic Grid Configure
              </Typography>
              <GradientButton
                onClick={(event) => {
                  myRef.current?.onSubmitHandler(event);
                }}
              >
                Save
              </GradientButton>
              <GradientButton onClick={closeDialog}>Close</GradientButton>
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid item xs={8} sm={6} md={8}>
          <MasterDetailsForm
            key={"dynGridConfig"}
            formNameMaster={"dynGridConfigMaster"}
            formName={formName}
            metaData={metadata}
            ref={myRef}
            initialData={{ _isNewRow: true, DETAILS_DATA: [] }}
            displayMode={"New"}
            isLoading={isLoading}
            onSubmitData={onSubmitHandler}
            isNewRow={true}
            containerstyle={{
              paddingRight: "10px",
              paddingLeft: "10px",
              paddingTop: "5px",
            }}
            formStyle={{
              background: "white",
              height: "25vh",
              overflowY: "auto",
              overflowX: "hidden",
            }}
            hideHeader={true}
            isError={errorObjData.isError}
            errorObj={errorObjData.error}
          >
            {({ isSubmitting, handleSubmit }) => {
              return <></>;
            }}
          </MasterDetailsForm>
        </Grid>
        <Grid item xs={4} sm={6} md={4} style={{ paddingRight: "10px" }}>
          <Grid item xs={12} sm={12} md={12}>
            {verifySql.isError ? (
              <div style={{ marginBottom: "5px" }}>
                <AppBar position="relative" color="primary">
                  <Alert
                    severity="error"
                    errorMsg={
                      verifySql?.error?.error_msg ?? "Something went to wrong.."
                    }
                    errorDetail={verifySql?.error?.error_detail}
                    color="error"
                  />
                </AppBar>
              </div>
            ) : null}
          </Grid>
          <Grid item xs={12} sm={12} md={12} style={{ paddingTop: "12px" }}>
            <TextField
              id="outlined-multiline-static"
              label="SQL ANSI Query Syntax"
              multiline
              minRows={verifySql.isError ? 21 : 24}
              value={sqlSyntax}
              variant="outlined"
              color="secondary"
              style={{ width: "100%" }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => {
                mynewSqlSyntaxRef.current = event.target.value;
                setSqlSyntax(event.target.value);
                mySqlSyntaxRef.current = false;
              }}
              // onBlur={(event) => {
              //   myTextFieldPositionRef.current = event.target?.selectionStart;
              // }}
            />
          </Grid>
          <Grid container style={{ padding: "20px", placeContent: "center" }}>
            <Grid item xs={12} sm={12} md={3}>
              <GradientButton
                disabled={verifySql.isLoading}
                endIcon={
                  verifySql.isLoading ? <CircularProgress size={20} /> : null
                }
                onClick={() => {
                  if (Boolean(sqlSyntax)) {
                    verifySql.mutate({ sqlSyntax, detailsData: [] });
                  } else {
                    enqueueSnackbar("Please Enter SQL Syntax.", {
                      variant: "warning",
                    });
                  }
                }}
              >
                Verify
              </GradientButton>
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
              <GradientButton
                onClick={() => {
                  if (!Boolean(sqlSyntax)) {
                    enqueueSnackbar("Please Enter SQL Syntax.", {
                      variant: "warning",
                    });
                  } else if (!mySqlSyntaxRef.current) {
                    enqueueSnackbar("Please Verify SQL Syntax.", {
                      variant: "warning",
                    });
                  } else {
                    // createRetrievalMetaData(sqlSyntax);
                    setIsOpenRerieval(true);
                  }
                }}
              >
                Parameters
              </GradientButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {isOpenRerieval ? (
        <RetrievalParametersGrid
          isOpen={isOpenRerieval}
          formMode={undefined}
          onClose={onCloseDialog}
          rowsData={myparameterDataRef.current}
          onSaveData={onSaveParameters}
        />
      ) : null}
    </>
  );
};

export const AddDynamicGridConfigWrapper = ({
  isDataChangedRef,
  closeDialog,
}) => {
  return (
    <>
      <Dialog
        fullScreen={true}
        open={true}
        PaperProps={{
          style: {
            width: "100%",
          },
        }}
        maxWidth="lg"
      >
        <AddDynamicGridConfig
          isDataChangedRef={isDataChangedRef}
          closeDialog={closeDialog}
        />
      </Dialog>
    </>
  );
};

const Greetings = () => {
  let hours = new Date().getHours();
  let greet;

  if (hours < 12) greet = "morning";
  else if (hours >= 12 && hours <= 16) greet = "afternoon";
  else if (hours >= 16 && hours <= 24) greet = "evening";

  return <span>Good {greet},</span>;
};
