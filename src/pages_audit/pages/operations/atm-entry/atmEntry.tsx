import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  FormControl,
  FormLabel,
  Grid,
  InputLabel,
  LinearProgress,
  Paper,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AtmEntryMetaData602 } from "./atmEntryMetadata";
import * as API from "./api";
import { makeStyles } from "@mui/styles";
import { atmGridMetaData } from "./atmEntryGridMetadata";
import { CardDetails } from "./cardDetails/cardDetails";
import { gridClasses } from "@mui/system";
import JointDetails from "../DailyTransaction/TRNHeaderTabs/JointDetails";
import Draggable from "react-draggable";
import {
  LoaderPaperComponent,
  ClearCacheProvider,
  RemarksAPIWrapper,
  FormWrapper,
  MetaDataType,
  usePopupContext,
  Alert,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
} from "@acuteinfo/common-base";

const useStyles: any = makeStyles((theme: any) => ({
  box: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    // marginBottom: theme.spacing(2),
  },
  label: {
    fontWeight: 600,
    fontSize: "14px",
    marginRight: theme.spacing(1),
    // alignSelf: "center",
    // marginRight: "",
  },
  textField: {
    padding: "5px",
    borderRadius: "5px",
    width: "calc(100% - 132px)",
  },
  input: {
    // background: "var(--theme-color7)",
    fontWeight: 500,
    padding: "3px 8px",
    fontColor: "black",
  },
  header: {
    background: "var(--theme-color5)",
    color: "var(--theme-color2)",
    display: "flex",
    justifyContent: "space-between",
    "& .MuiButtonBase-root": {
      color: "var(--theme-color2) !important",
    },
  },
}));

const AtmEntryCustom = (parameter) => {
  const actions: ActionTypes[] = [
    {
      actionName: "card-details",
      actionLabel: "Add",
      multiple: false,
      rowDoubleClick: true,
      alwaysAvailable: true,
    },
  ];

  const [isData, setIsData] = useState<any>({
    closeAlert: true,
    cardData: {},
    gridData: [],
    isVisible: false,
  });

  console.log("<<<isisissis", isData);
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const formRef = useRef<any>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const classes = useStyles();

  const onSubmitHandler = ({ data, displayData, endSubmit }) => {
    //@ts-ignore
    endSubmit(true);
  };

  return (
    <>
      <AppBar position="relative">
        <Toolbar variant="dense" className={classes.header}>
          <Typography component="span" variant="h6" color="primary">
            ATM Registration Entry MST/846
          </Typography>

          <DialogActions>
            {isData?.isVisible && (
              <>
                <Button
                  onClick={() => navigate("joint-details")}
                  color={"primary"}
                >
                  Joint Details
                </Button>
                <Button color="primary">Photo/Sign </Button>
              </>
            )}
            <Button
              color={"primary"}
              // onClick={(event) =>
              //   formRef?.current?.handleSubmit(event, "BUTTON_CLICK")
              // }
              // endIcon={
              //   mutation?.isLoading ? <CircularProgress size={20} /> : null
              // }
            >
              Save
            </Button>
          </DialogActions>
        </Toolbar>
      </AppBar>

      <Grid container>
        <Grid
          item
          xs={8}
          sm={8}
          sx={{
            backgroundColor: "var(--theme-color2)",
            padding: "0px",
            borderRadius: "10px",
          }}
        >
          {/* {crudTempOD?.isLoading ? (
              <LinearProgress color="secondary" />
            ) : (temporaryODDetail?.isError && isData.closeAlert) ||
              (crudTempOD?.isError && isData.closeAlert) ? (
              <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
                <AppBar position="relative" color="primary">
                  <Alert
                    severity="error"
                    errorMsg={
                      temporaryODDetail?.error?.error_msg ??
                      crudTempOD?.error?.error_msg ??
                      "Unknow Error"
                    }
                    errorDetail={
                      temporaryODDetail?.error?.error_detail ??
                      crudTempOD?.error?.error_detail ??
                      ""
                    }
                    color="error"
                  />
                </AppBar>
              </div>
            ) : (
              <LinearProgressBarSpacer />
            )} */}

          <FormWrapper
            key={"atm-reg-entry"}
            metaData={AtmEntryMetaData602 as MetaDataType}
            initialValues={{}}
            onSubmitHandler={onSubmitHandler}
            ref={formRef}
            hideHeader={true}
            formStyle={{
              background: "white",
              height: "calc(100vh - 442px)",
              overflowY: "auto",
              overflowX: "hidden",
            }}
            formState={{ MessageBox: MessageBox }}
            setDataOnFieldChange={(action, payload) => {
              if (action === "RES_DATA") {
                setIsData((old) => ({
                  ...old,
                  cardData: payload?.validateData,
                  isVisible: payload?.isVisible,
                }));
              }
            }}
          ></FormWrapper>
        </Grid>

        <Grid item xs={4} sm={4} padding={1}>
          <Grid item xs={12}>
            <Typography align="center" variant="h6">
              Card Printing
            </Typography>
          </Grid>
          <Grid item xs={12} spacing={1} className={classes.box}>
            <FormLabel className={classes.label}>Surname : </FormLabel>
            <TextField
              disabled
              className={classes.textField}
              value={isData?.cardData?.SUR_NAME ?? ""}
              InputProps={{
                classes: { input: classes.input },
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} className={classes.box}>
            <FormLabel className={classes.label}>First Name : </FormLabel>
            <TextField
              disabled
              className={classes.textField}
              value={isData?.cardData?.FIRST_NAME ?? ""}
              InputProps={{
                classes: { input: classes.input },
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} className={classes.box}>
            <FormLabel className={classes.label}>Last Name : </FormLabel>
            <TextField
              disabled
              className={classes.textField}
              value={isData?.cardData?.MIDDLE_NAME ?? ""}
              InputProps={{
                classes: { input: classes.input },
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} className={classes.box}>
            <FormLabel className={classes.label}>Add1 : </FormLabel>
            <TextField
              disabled
              className={classes.textField}
              value={isData?.cardData?.ADDRESS1 ?? ""}
              InputProps={{
                classes: { input: classes.input },
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} className={classes.box}>
            <FormLabel className={classes.label}>Add2 : </FormLabel>
            <TextField
              disabled
              className={classes.textField}
              value={isData?.cardData?.ADDRESS2 ?? ""}
              InputProps={{
                classes: { input: classes.input },
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} className={classes.box}>
            <FormLabel className={classes.label}>Add3 : </FormLabel>
            <TextField
              disabled
              className={classes.textField}
              value={isData?.cardData?.ADDRESS3 ?? ""}
              style={{ width: "calc(100% - 277px)" }}
              InputProps={{
                classes: { input: classes.input },
              }}
              variant="outlined"
            />
            <FormLabel className={classes.label}>Pincode : </FormLabel>
            <TextField
              disabled
              className={classes.textField}
              value={isData?.cardData?.PINCODE ?? ""}
              style={{ width: "calc(100% - 397px)" }}
              InputProps={{
                classes: { input: classes.input },
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} className={classes.box}>
            <FormLabel className={classes.label}>City : </FormLabel>
            <TextField
              disabled
              className={classes.textField}
              value={isData?.cardData?.CITY ?? ""}
              style={{ width: "calc(100% - 321px)" }}
              InputProps={{
                classes: { input: classes.input },
              }}
              variant="outlined"
            />
            <FormLabel className={classes.label}>State : </FormLabel>
            <TextField
              disabled
              className={classes.textField}
              value={isData?.cardData?.STATE ?? ""}
              style={{ width: "calc(100% - 334px)" }}
              InputProps={{
                classes: { input: classes.input },
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} className={classes.box}>
            <FormLabel className={classes.label}>Branch : </FormLabel>
            <TextField
              disabled
              className={classes.textField}
              value={isData?.cardData?.BRANCH_NAME ?? ""}
              InputProps={{
                classes: { input: classes.input },
              }}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Grid>

      <GridWrapper
        key={`atmGridData` + isData?.gridData}
        finalMetaData={atmGridMetaData as GridMetaDataType}
        data={isData?.gridData ?? []}
        setData={() => null}
        actions={actions}
        setAction={(data) => {
          if (data?.name === "card-details") {
            navigate(data?.name, {
              state: data?.rows,
            });
          }
        }}
        onClickActionEvent={(index, id, data) => {
          setIsData((old) => {
            let deleteData = old?.gridData.filter((item) => item !== data);
            return { ...old, gridData: deleteData };
          });
        }}
      />
      <Routes>
        <Route
          path="card-details/*"
          element={<CardDetails navigate={navigate} setIsData={setIsData} />}
        />
        <Route
          path="joint-details/*"
          element={
            <Dialog
              open={true}
              fullWidth={true}
              PaperProps={{
                style: {
                  maxWidth: "1130px",
                  padding: "5px",
                },
              }}
              PaperComponent={(props) => (
                <Draggable
                  handle="#draggable-dialog-title"
                  cancel={'[class*="MuiDialogContent-root"]'}
                >
                  <Paper {...props} />
                </Draggable>
              )}
            >
              <div id="draggable-dialog-title">
                <JointDetails
                  reqData={{
                    COMP_CD: authState?.companyID,
                    BRANCH_CD: isData?.cardData?.BRANCH_CD,
                    ACCT_TYPE: isData?.cardData?.ACCT_TYPE,
                    ACCT_CD: isData?.cardData?.ACCT_CD,
                    BTN_FLAG: "Y",
                  }}
                />
              </div>
            </Dialog>
          }
        />
      </Routes>
    </>
  );
};

export const AtmEntry = () => {
  const { authState } = useContext(AuthContext);
  const { data, isLoading, isSuccess, isError, error } = useQuery<any, any>(
    ["GETATMREGPARA"],
    () =>
      API.getParameter({
        A_ENT_BRANCH: authState?.user?.branchCode,
        A_ENT_COMP: authState?.companyID,
      })
  );

  return (
    <ClearCacheProvider>
      {isLoading ? (
        <LoaderPaperComponent />
      ) : isError ? (
        <AppBar position="relative" color="primary">
          <Alert
            severity="error"
            errorMsg={error?.error_msg ?? "Unknow Error"}
            errorDetail={error?.error_detail ?? ""}
            color="error"
          />
        </AppBar>
      ) : isSuccess ? (
        <AtmEntryCustom parameter={data?.[0]} />
      ) : null}
    </ClearCacheProvider>
  );
};
