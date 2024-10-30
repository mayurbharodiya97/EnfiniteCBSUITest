import React, { Fragment, useContext, useRef } from "react";
import {
  AppBar,
  Box,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Toolbar,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import HomeIcon from "@mui/icons-material/Home";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { StepIconProps } from "@mui/material/StepIcon";
import { useLocation, useNavigate } from "react-router-dom";
import AccessWrapper from "./applicationAccess";
import OnBoard from "./userOnboard";
import { SecurityContext } from "../context/SecuityForm";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import * as API from "../api";
import _ from "lodash";
import BranchAccessRights from "./branchAccess";
import { ProductAccess } from "./productAccess";
import LoginShift from "./loginShiftAccess";
import BiometricLogins from "./bioMetricLogin";

import {
  ColorlibConnector,
  ColorlibStepIconRoot,
  GradientButton,
  usePopupContext,
  utilFunction,
  GridMetaDataType,
} from "@acuteinfo/common-base";
import { enqueueSnackbar } from "notistack";
import { LoginShiftConfirmation } from "../../userSecurityConfirmation/loginShift";
import { BiometricLoginConfirmation } from "../../userSecurityConfirmation/boimetricLogin";
const CombinedStepper = ({ defaultView }) => {
  let currentPath = useLocation().pathname;
  const navigate = useNavigate();
  const {
    userState,
    setActiveStep,
    resetAllData,
    setIsBackButton,
    dispatchCommon,
  } = useContext(SecurityContext);
  const userRef = useRef(userState);
  userRef.current = userState;
  const { state: rows } = useLocation();
  const UserName = rows?.[0]?.data?.USER_NAME;
  const check = rows?.[0]?.data?.LAST_ENTERED_BY;
  const UserId = userState?.formData?.USER_NAME;
  const submitEventRef = useRef(null);
  const appGridRef = useRef<any>(null);
  const branchGridRef = useRef<any>(null);
  const prodGridRef = useRef<any>(null);
  const loginShiftGridRef = useRef<any>(null);
  const loginBiometricRef = useRef<any>(null);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  const steps = [
    "User Onboarding",
    "Application Access Rights",
    "Branch Access Rights",
    "Product Access Rights",
    "Login Shift",
    "Biometric Access",
  ];
  const icons = {
    1: <VideoLabelIcon />,
    2: <PersonAddIcon />,
    3: <HomeIcon />,
    4: <GroupAddIcon />,
    5: <SettingsIcon />,
    6: <FingerprintIcon />,
  };
  const FormData = useRef<any>(null);
  const { data } = useQuery<any, any>(["getAduserParavalue"], () =>
    API.getAduserParavalue({
      comp_cd: authState?.companyID,
      branch_cd: authState?.user?.branchCode,
    })
  );
  const addMutation = useMutation(API.saveuserdata, {
    onError: async (error: any) => {
      let errorMsg = "Unknown Error occurred";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      CloseMessageBox();
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },
    onSuccess: async (data) => {
      CloseMessageBox();
      //@ts-ignore
      enqueueSnackbar(data, {
        variant: "success",
      });
      resetAllData();
      setActiveStep(0);
      navigate("/cbsenfinity/master/security-user");
    },
  });

  const editMutation = useMutation(API.UpdateDMLData, {
    onError: async (error: any) => {
      let errorMsg = "Unknown Error occurred";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      CloseMessageBox();
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },
    onSuccess: async (data) => {
      CloseMessageBox();
      enqueueSnackbar(data, {
        variant: "success",
      });
      resetAllData();
      setActiveStep(0);
      navigate("/cbsenfinity/master/security-user");
    },
  });

  const confirmation = useMutation(API.confirmSecurityUserData, {
    onSuccess: (response) => {
      enqueueSnackbar(response, { variant: "success" });
      CloseMessageBox();
      resetAllData();
      setActiveStep(0);
      navigate("/cbsenfinity/master/security-user-confirmation");
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg ?? "error", { variant: "error" });
      CloseMessageBox();
    },
  });

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;
    const icon = icons[String(props.icon)];

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {icon}
      </ColorlibStepIconRoot>
    );
  }
  const SaveData = async () => {
    const btnName = await MessageBox({
      message: "SaveData",
      messageTitle: "Confirmation",
      buttonNames: ["Yes", "No"],
      loadingBtnName: ["Yes"],
    });
    if (btnName === "Yes") {
      if (defaultView === "new") {
        addMutation.mutate({
          onboard: userRef.current.formData,
          applicationdata: userRef.current.appContextData,
          branchdata: userRef.current.branchContextData,
          productdata: userRef.current.productContextData,
          loginshiftdata: userRef.current.grid4,
          biometricdata: userRef.current.grid5,
        });
      } else {
        editMutation.mutate({
          onboard: userState.formData,
          applicationdata: userState.appContextData,
          branchdata: userState.branchContextData,
          productdata: userState.productContextData,
          loginshiftdata: userState.grid4,
          biometricdata: userState.grid5,
        });
      }
    }
  };
  const accept = async () => {
    if (
      (check || "").toLowerCase() === (authState?.user?.id || "").toLowerCase()
    ) {
      enqueueSnackbar("You can not accept your own entry.", {
        variant: "warning",
      });
      CloseMessageBox();
    } else {
      const Accept = await MessageBox({
        messageTitle: "Confirmation",
        message: "Do you want to accept this Request?",
        icon: "INFO",
        buttonNames: ["Ok", "Cancel"],
        loadingBtnName: ["Ok"],
      });
      if (Accept === "Ok") {
        confirmation.mutate({
          confirm: "Y",
          usera_name: UserName,
        });
      }
    }
  };
  const reject = async () => {
    if (
      (check || "").toLowerCase() === (authState?.user?.id || "").toLowerCase()
    ) {
      enqueueSnackbar("You can not reject your own entry.", {
        variant: "warning",
      });
      CloseMessageBox();
    } else {
      const Accept = await MessageBox({
        messageTitle: "Confirmation",
        message: "Do you want to reject this Request?",
        icon: "INFO",
        buttonNames: ["Ok", "Cancel"],
        loadingBtnName: ["Ok"],
      });
      if (Accept === "Ok") {
        confirmation.mutate({
          confirm: "R",
          usera_name: UserName,
        });
      }
    }
  };
  const handleComplete = async (e) => {
    submitEventRef.current = e;
    if (defaultView === "new") {
      if (userState.activeStep === 0) {
        FormData.current?.handleSubmit(e);
      } else if (userState.activeStep === 1) {
        let appData = appGridRef?.current?.cleanData?.();
        dispatchCommon("commonType", { appUpdatedData: appData });
        const UpdatedNewRecords = appData
          .filter((row) => row.LOGIN_ACCESS === true)
          .map((row) => {
            return row;
          });
        const filtered = UpdatedNewRecords.map((row) => ({
          USER_NAME: UserId,
          APP_NM: row.APP_NM,
          LOGIN_ACCESS: row.LOGIN_ACCESS ? "Y" : row.LOGIN_ACCESS,
          APP_TRAN_CD: row.TRAN_CD,
        }));
        let OldData = [];
        const CompareData = utilFunction.transformDetailDataForDML(
          OldData ?? [],
          filtered,
          ["APP_NM"]
        );
        dispatchCommon("commonType", { appContextData: CompareData });
        if (filtered.length > 0) {
          setActiveStep(userState.activeStep + 1);
        } else {
          return;
        }
      } else if (userState.activeStep === 2) {
        let branchData = branchGridRef?.current?.cleanData?.();
        dispatchCommon("commonType", { branchUpdatedData: branchData });
        let OldRecord = [];
        const UpdatedNewRecords = branchData
          .filter(
            (row) => row.LOGIN_ACCESS === true || row.REPORT_ACCESS === true
          )
          .map((row) => {
            return row;
          });
        const filteredUpdatedrecords = UpdatedNewRecords.map((row) => ({
          COMP_CD: row.COMP_CD,
          USER_NAME: UserId,
          LOGIN_ACCESS: row.LOGIN_ACCESS ? "Y" : "N",
          REPORT_ACCESS: row.REPORT_ACCESS ? "Y" : "N",
          BRANCH_CD: row.BRANCH_CD,
        }));
        const CompareData = utilFunction.transformDetailDataForDML(
          OldRecord ?? [],
          filteredUpdatedrecords,
          ["BRANCH_CD"]
        );
        dispatchCommon("commonType", { branchContextData: CompareData });
        if (filteredUpdatedrecords.length > 0) {
          setActiveStep(userState.activeStep + 1);
        }
      } else if (userState.activeStep === 3) {
        let proData = prodGridRef?.current?.cleanData?.();
        dispatchCommon("commonType", { productUpdatedData: proData });
        let OldRecord = [];
        const UpdatedNewRecords = proData
          .filter((row) => row.ACCESS === true)
          .map((row) => {
            return row;
          });
        const filtered = UpdatedNewRecords.map((row) => ({
          USER_NAME: UserId,
          COMP_CD: row.COMP_CD,
          BRANCH_CD: row.BRANCH_CD,
          ACCESS: row.ACCESS ? "Y" : "N",
          ACCT_TYPE: row.ACCT_TYPE,
        }));
        const CompareData = utilFunction.transformDetailDataForDML(
          OldRecord ?? [],
          filtered,
          ["ACCT_TYPE"]
        );
        dispatchCommon("commonType", { productContextData: CompareData });
        if (filtered.length > 0) {
          setActiveStep(userState.activeStep + 1);
        }
      } else if (userState.activeStep === 4) {
        loginShiftGridRef.current?.handleSubmit(e);
      } else if (userState.activeStep === 5) {
        let FinalGridData = loginBiometricRef?.current?.cleanData?.();
        let OldRecord = [];
        const filtered = FinalGridData.map((row) => ({
          USER_NAME: row.USER_NAME,
          FINGER_NM: row.FINGER_NM,
          FINGER_BIO: row.FINGER_BIO,
        }));
        const CompareData = utilFunction.transformDetailDataForDML(
          OldRecord ?? [],
          filtered,
          ["FINGER_NM"]
        );
        dispatchCommon("commonType", { grid5: CompareData });
        SaveData();
      }
    } else if (defaultView === "edit") {
      if (userState.activeStep === 0) {
        FormData.current?.handleSubmit(e);
      } else if (userState.activeStep === 1) {
        let FinalGridData = appGridRef?.current?.cleanData?.();
        dispatchCommon("commonType", { appUpdatedData: FinalGridData });
        const Newfiltered = FinalGridData.filter(
          (row) => !row._isNewRow === true
        ).map((row) => {
          return row;
        });
        const NewFilter = Newfiltered.map((row) => ({
          APP_NM: row.APP_NM,
          APP_TRAN_CD: row.APP_TRAN_CD,
          LOGIN_ACCESS: row.LOGIN_ACCESS ? "Y" : "N",
          USER_NAME: UserId,
        }));
        const Oldfiltered = (userState?.oldappContextData || []).map((row) => ({
          APP_NM: row.APP_NM,
          APP_TRAN_CD: row.APP_TRAN_CD,
          LOGIN_ACCESS: row.LOGIN_ACCESS ? "Y" : "N",
          USER_NAME: row.USER_NAME,
        }));
        const CompareData = utilFunction.transformDetailDataForDML(
          Oldfiltered ?? [],
          NewFilter,
          ["APP_NM"]
        );
        const UpdatedNewRecords = FinalGridData.filter(
          (row) => row._isNewRow === true && row.LOGIN_ACCESS === true
        ).map((row) => {
          return row;
        });
        const UpdatedNewRecordFiltered = UpdatedNewRecords.map((row) => ({
          APP_NM: row.APP_NM,
          APP_TRAN_CD: row.APP_TRAN_CD,
          LOGIN_ACCESS: row.LOGIN_ACCESS ? "Y" : "N",
          USER_NAME: row.USER_NAME,
        }));
        CompareData["isNewRow"] = [...UpdatedNewRecordFiltered];
        dispatchCommon("commonType", { appContextData: CompareData });
        if (FinalGridData.length > 0) {
          setActiveStep(userState.activeStep + 1);
        }
      } else if (userState.activeStep === 2) {
        let FinalGridData = branchGridRef?.current?.cleanData?.();
        dispatchCommon("commonType", { branchUpdatedData: FinalGridData });
        const Newfiltered = FinalGridData.filter(
          (row) => !row._isNewRow === true
        ).map((row) => {
          return row;
        });
        const NewFilter = Newfiltered.map((row) => ({
          COMP_CD: row.COMP_CD,
          USER_NAME: UserId,
          LOGIN_ACCESS: row.LOGIN_ACCESS,
          REPORT_ACCESS: row.REPORT_ACCESS,
          BRANCH_CD: row.BRANCH_CD,
        }));
        const Oldfiltered = (userState?.oldbranchContextData || []).map(
          (row) => ({
            COMP_CD: row.COMP_CD,
            USER_NAME: row.USER_NAME,
            LOGIN_ACCESS: row.LOGIN_ACCESS,
            REPORT_ACCESS: row.REPORT_ACCESS,
            BRANCH_CD: row.BRANCH_CD,
          })
        );
        const CompareData = utilFunction.transformDetailDataForDML(
          Oldfiltered ?? [],
          NewFilter,
          ["BRANCH_CD"]
        );
        const UpdatedNewRecords = FinalGridData.filter(
          (row) =>
            row._isNewRow === true &&
            row.LOGIN_ACCESS === true &&
            row.REPORT_ACCESS === true
        ).map((row) => {
          return row;
        });
        const UpdatedNewRecordFiltered = UpdatedNewRecords.map((row) => ({
          COMP_CD: row.COMP_CD,
          USER_NAME: row.USER_NAME,
          LOGIN_ACCESS: row.LOGIN_ACCESS ? "Y" : "N",
          REPORT_ACCESS: row.REPORT_ACCESS ? "Y" : "N",
          BRANCH_CD: row.BRANCH_CD,
        }));
        CompareData["isNewRow"] = [...UpdatedNewRecordFiltered];
        dispatchCommon("commonType", { branchContextData: CompareData });
        if (FinalGridData.length > 0) {
          setActiveStep(userState.activeStep + 1);
        } else {
          return;
        }
      } else if (userState.activeStep === 3) {
        let FinalGridData = prodGridRef?.current?.cleanData?.();
        dispatchCommon("commonType", { productUpdatedData: FinalGridData });
        const Newfiltered = FinalGridData.filter(
          (row) => !row._isNewRow === true
        ).map((row) => {
          return row;
        });
        const NewFilter = Newfiltered.map((row) => ({
          USER_NAME: UserId,
          COMP_CD: row.COMP_CD,
          BRANCH_CD: row.BRANCH_CD,
          ACCESS: row.ACCESS,
          ACCT_TYPE: row.ACCT_TYPE,
        }));
        const Oldfiltered = (userState?.oldproductContextData || []).map(
          (row) => ({
            USER_NAME: row.USER_NAME,
            COMP_CD: row.COMP_CD,
            BRANCH_CD: row.BRANCH_CD,
            ACCESS: row.ACCESS,
            ACCT_TYPE: row.ACCT_TYPE,
          })
        );
        const CompareData = utilFunction.transformDetailDataForDML(
          Oldfiltered ?? [],
          NewFilter,
          ["ACCT_TYPE"]
        );
        const UpdatedNewRecords = FinalGridData.filter(
          (row) => row._isNewRow === true && row.ACCESS === true
        ).map((row) => {
          return row;
        });
        const UpdatedNewRecordFiltered = UpdatedNewRecords.map((row) => ({
          USER_NAME: row.USER_NAME,
          COMP_CD: row.COMP_CD,
          BRANCH_CD: row.BRANCH_CD,
          ACCESS: row.ACCESS ? "Y" : "N",
          ACCT_TYPE: row.ACCT_TYPE,
        }));
        CompareData["isNewRow"] = [...UpdatedNewRecordFiltered];
        dispatchCommon("commonType", { productContextData: CompareData });
        if (FinalGridData.length > 0) {
          setActiveStep(userState.activeStep + 1);
        } else {
          return;
        }
      } else if (userState.activeStep === 4) {
        loginShiftGridRef.current?.handleSubmit(e);
      } else if (userState.activeStep === 5) {
        let FinalGridData = loginBiometricRef?.current?.cleanData?.();
        const filtered = (FinalGridData || []).map((row) => ({
          SR_CD: row.SR_CD,
          USER_NAME: row.USER_NAME,
          FINGER_NM: row.FINGER_NM,
          FINGER_BIO: row.FINGER_BIO,
        }));
        const CompareData = utilFunction.transformDetailDataForDML(
          userState.oldData3 ?? [],
          filtered,
          ["SR_CD"]
        );
        dispatchCommon("commonType", { grid5: CompareData });
        SaveData();
      }
    } else if (defaultView === "view") {
      if (userState.activeStep === 0) {
        setActiveStep(userState.activeStep + 1);
      } else if (userState.activeStep === 1) {
        const FinalGridData = appGridRef?.current?.cleanData?.();
        if (FinalGridData.length > 0) {
          setActiveStep(userState.activeStep + 1);
        }
      } else if (userState.activeStep === 2) {
        const FinalGridData = branchGridRef?.current?.cleanData?.();
        if (FinalGridData.length > 0) {
          setActiveStep(userState.activeStep + 1);
        }
      } else if (userState.activeStep === 3) {
        const FinalGridData = prodGridRef?.current?.cleanData?.();
        if (FinalGridData.length > 0) {
          setActiveStep(userState.activeStep + 1);
        }
      } else if (userState.activeStep === 4) {
        setActiveStep(userState.activeStep + 1);
      } else if (userState.activeStep === 5) {
        const FinalGridData = loginBiometricRef?.current?.cleanData?.();
        if (FinalGridData.length > 0) {
          setActiveStep(userState.activeStep + 1);
        }
      }
    }
  };
  const handleCancel = () => {
    setActiveStep(0);
    resetAllData();
    navigate("/cbsenfinity/master/security-user");
  };
  const handleClose = () => {
    setActiveStep(0);
    resetAllData();
    navigate("/cbsenfinity/master/security-user-confirmation");
  };
  const addUser = () => {
    resetAllData();
    setActiveStep(0);
    navigate("/cbsenfinity/master/security-user/add");
  };
  return (
    <Fragment>
      <AppBar position="relative" style={{ marginBottom: "10px" }}>
        <Toolbar
          variant="dense"
          style={{ background: "var(--theme-color5)", padding: "0px" }}
        >
          <Typography component="span" variant="h5" color="primary" px={2}>
            {defaultView === "new"
              ? utilFunction.getDynamicLabel(
                  currentPath,
                  authState?.menulistdata,
                  true
                )
              : `${utilFunction.getDynamicLabel(
                  currentPath,
                  authState?.menulistdata,
                  true
                )} ${UserName}`}
          </Typography>
          <Box style={{ display: "flex", marginLeft: "auto" }}>
            {defaultView === "new" ? (
              <GradientButton onClick={handleCancel}>Retrieve</GradientButton>
            ) : defaultView === "edit" ? (
              <>
                <GradientButton onClick={addUser}>Add</GradientButton>
                <GradientButton onClick={handleCancel}>Retrieve</GradientButton>
              </>
            ) : defaultView === "view" ? (
              <>
                {userState.activeStep === steps.length - 1 && (
                  <>
                    <GradientButton onClick={accept}>Accept</GradientButton>
                    <GradientButton onClick={reject}>Reject</GradientButton>
                  </>
                )}
                <GradientButton onClick={handleClose}>Close</GradientButton>
              </>
            ) : null}
          </Box>
        </Toolbar>
      </AppBar>
      <Stack sx={{ width: "100%" }} spacing={5}>
        <Stepper
          alternativeLabel
          activeStep={userState.activeStep}
          connector={<ColorlibConnector />}
        >
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel
                StepIconComponent={ColorlibStepIcon}
                componentsProps={{
                  label: {
                    style: { marginTop: "2px", color: "var(--theme-color1)" },
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box style={{ marginTop: "0px" }}>
          {userState.activeStep === 0 ? (
            <OnBoard
              ref={FormData}
              username={rows?.[0]?.data}
              defaultView={defaultView}
              sharing={data}
            />
          ) : userState.activeStep === 1 ? (
            <AccessWrapper
              ref={appGridRef}
              username={rows?.[0]?.data}
              defaultView={defaultView}
            />
          ) : userState.activeStep === 2 ? (
            <BranchAccessRights
              ref={branchGridRef}
              username={rows?.[0]?.data}
              defaultView={defaultView}
            />
          ) : userState.activeStep === 3 ? (
            <ProductAccess
              ref={prodGridRef}
              username={rows?.[0]?.data}
              defaultView={defaultView}
            />
          ) : userState.activeStep === 4 ? (
            defaultView === "view" ? (
              <LoginShiftConfirmation
                ref={loginShiftGridRef}
                userId={rows?.[0]?.data}
              />
            ) : (
              <LoginShift
                ref={loginShiftGridRef}
                username={rows?.[0]?.data}
                defaultView={defaultView}
                userId={UserId}
              />
            )
          ) : userState.activeStep === 5 ? (
            defaultView === "view" ? (
              <BiometricLoginConfirmation
                ref={loginBiometricRef}
                username={UserName}
                defaultView={defaultView}
                userId={rows?.[0]?.data}
              />
            ) : (
              <BiometricLogins
                ref={loginBiometricRef}
                username={UserName}
                defaultView={defaultView}
                userId={UserId}
              />
            )
          ) : (
            <></>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            pt: 2,
            marginTop: "0px !important",
            position: "relative",
          }}
        >
          <Box style={{ position: "fixed", bottom: "20px", right: "10px" }}>
            {userState.activeStep === 0 ? null : (
              <GradientButton
                onClick={() => {
                  setIsBackButton(true);
                  setActiveStep(userState.activeStep - 1);
                }}
              >
                Back
              </GradientButton>
            )}
            {(defaultView === "edit" || defaultView === "new") && (
              <>
                {userState.activeStep !== steps.length - 1 ? (
                  <GradientButton onClick={handleComplete}>
                    Save & Next
                  </GradientButton>
                ) : (
                  <GradientButton onClick={handleComplete}>
                    Finish
                  </GradientButton>
                )}
              </>
            )}
            {defaultView === "view" && (
              <>
                {userState.activeStep !== steps.length - 1 ? (
                  <GradientButton onClick={handleComplete}>Next</GradientButton>
                ) : null}
              </>
            )}
          </Box>
        </Box>
      </Stack>
    </Fragment>
  );
};
export default CombinedStepper;
