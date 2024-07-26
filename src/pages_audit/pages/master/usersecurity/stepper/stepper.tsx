import React, { Fragment, useContext, useRef, useState, useEffect } from "react";
import {
  AppBar,
  Box,
  CircularProgress,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Toolbar,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import HomeIcon from '@mui/icons-material/Home';
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { StepIconProps } from "@mui/material/StepIcon";
import { GradientButton } from "components/styledComponent/button";
import { useLocation, useNavigate } from "react-router-dom";
import AccessWrapper from "./applicationAccess";
import OnBoard from "./userOnboard";
import { SecurityContext } from "../context/SecuityForm";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import * as API from "../api";
import { utilFunction } from "components/utils";
import { usePopupContext } from "components/custom/popupContext";
import _ from "lodash";
import BranchAccessRights from "./branchAccess";
import { ProductAccess } from "./productAccess";
import LoginShift from "./loginShiftAccess";
import BiometricLogins from "./bioMetricLogin";
import { ColorlibConnector, ColorlibStepIconRoot } from "components/dyanmicForm/stepperForm/style";
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
  const { MessageBox,CloseMessageBox } = usePopupContext();
  const {authState} = useContext(AuthContext);
  const steps =  [
    "User Onboarding",
    "Application Access Rights",
    "Branch Access Rights",
    "Product Access Rights",
    "Login Shift",
    "Biometric Access"
  ];
  const icons =  {
    1: <VideoLabelIcon />,
    2: <PersonAddIcon />,
    3: <HomeIcon />,
    4: <GroupAddIcon />,
    5: <SettingsIcon />,
    6: <FingerprintIcon/>
  };
  const FormData = useRef<any>(null);
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<any, any>(
    ["getAduserParavalue"],
    () => API.getAduserParavalue({
     comp_cd : authState?.companyID,
     branch_cd: authState?.user?.branchCode,
    })
  );
  const addMutation = useMutation((API.saveuserdata), {
    onError: async (error: any) => {
      let errorMsg = "Unknown Error occurred";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      CloseMessageBox()
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },
    onSuccess: async (data) => {
      CloseMessageBox()
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
      CloseMessageBox()
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },
    onSuccess: async (data) => {
      CloseMessageBox()
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
      CloseMessageBox()
      resetAllData();
      setActiveStep(0);
      navigate("/cbsenfinity/master/security-user-confirmation");
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg ?? "error", { variant: "error" });
      CloseMessageBox()
    },
  });

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;
    const icon = icons[String(props.icon)];

    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icon}
      </ColorlibStepIconRoot>
    );
  }
  const SaveData = async ()=>{
    const btnName = await MessageBox({
      message: "SaveData",
      messageTitle: "Confirmation",
      buttonNames: ["Yes", "No"],
      loadingBtnName: ["Yes"],
    });
    if (btnName === "Yes") {
      if (defaultView === "new"){
      addMutation.mutate({
        form: userState.formData,
        grid1: userState.grid1,
        grid2: userState.grid2,
        grid3: userState.grid3,
        grid4: userState.grid4,
        grid5: userState.grid5,
      }); 
    } else {
      editMutation.mutate({
        form: userState.formData,
        grid1: userState.grid1,
        grid2: userState.grid2,
        grid3: userState.grid3,
        grid4: userState.grid4,
        grid5: userState.grid5,
      });
    }
  }
  }
  const accept = async()=>{
    if (
      (check || "").toLowerCase() ===
      (authState?.user?.id || "").toLowerCase()
    ) {
      enqueueSnackbar("You can not accept your own entry.", {
        variant: "warning",
      });
      CloseMessageBox()
    } else {
      const Accept = await MessageBox({ messageTitle: "Confirmation", message: "Do you want to accept this Request?", icon: "INFO",buttonNames:["Ok","Cancel"], loadingBtnName:["Ok"]});
      if (Accept === "Ok"){
        confirmation.mutate({
          confirm :"Y",
          usera_name:UserName,
        })
      }
    }
  }
  const reject = async()=>{
    if (
      (check || "").toLowerCase() ===
      (authState?.user?.id || "").toLowerCase()
    ) {
      enqueueSnackbar("You can not reject your own entry.", {
        variant: "warning",
      });
      CloseMessageBox()
    } else {
      const Accept = await MessageBox({ messageTitle: "Confirmation", message: "Do you want to reject this Request?", icon: "INFO",buttonNames:["Ok","Cancel"], loadingBtnName:["Ok"]});
      if (Accept === "Ok"){
        confirmation.mutate({
          confirm :"R",
          usera_name:UserName,
        })
      }
    }
  }
  const handleComplete = async (e) => {
    submitEventRef.current = e;
    if (defaultView === "new") {
      if (userState.activeStep === 0) {
        FormData.current?.handleSubmit(e);
        setActiveStep(userState.activeStep + 1);
      } else if (userState.activeStep === 1) {
        let result1 = appGridRef?.current?.cleanData?.();
        const filtered = result1.map(row => ({ USER_NAME: UserId, APP_NM: row.APP_NM, LOGIN_ACCESS: row.LOGIN_ACCESS ? "Y" : row.LOGIN_ACCESS, APP_TRAN_CD: row.TRAN_CD }));
        const filterData = (filtered) => {
          return filtered.filter(row => row.LOGIN_ACCESS);
        };
        const filteredResult = filterData(filtered);
        const updatedData = {
          DETAILS_DATA: {
            isNewRow: filteredResult,
            isUpdateRow: [],
            isDeleteRow: []
          }
        };
        dispatchCommon("commonType", { grid1: updatedData });
        if (filteredResult.length > 0) {
          setActiveStep(userState.activeStep + 1);
        } else {
          return
        }
      } else if (userState.activeStep === 2) {
        let result1 = branchGridRef?.current?.cleanData?.();
        const filtered = result1.map(row => ({ COMP_CD: row.COMP_CD, USER_NAME: UserId, LOGIN_ACCESS: row.LOGIN_ACCESS ? "Y" : row.LOGIN_ACCESS, REPORT_ACCESS: row.REPORT_ACCESS ? "Y" : row.REPORT_ACCESS, BRANCH_CD: row.BRANCH_CD }));
        const filterData = (filtered) => {
          return filtered.filter(row => row.LOGIN_ACCESS ? true : false || row.REPORT_ACCESS ? true : false);
        };
        const filteredResult = filterData(filtered);
        const updatedData = {
          DETAILS_DATA: {
            isNewRow: filteredResult,
            isUpdateRow: [],
            isDeleteRow: []
          }
        };
        dispatchCommon("commonType", { grid2: updatedData });
        if (filteredResult.length > 0) {
          setActiveStep(userState.activeStep + 1);
        } else {
          return
        }
      } else if (userState.activeStep === 3) {
        let result1 = prodGridRef?.current?.cleanData?.();
        const filtered = result1.map(row => ({ USER_NAME: UserId, COMP_CD: row.COMP_CD, BRANCH_CD: row.BRANCH_CD, ACCESS: row.ACCESS ? "Y" : row.ACCESS, ACCT_TYPE: row.ACCT_TYPE }));
        const filterData = (filtered) => {
          return filtered.filter(row => row.ACCESS);
        };
        const filteredResult = filterData(filtered);
        const updatedData = {
          DETAILS_DATA: {
            isNewRow: filteredResult,
            isUpdateRow: [],
            isDeleteRow: []
          }
        };
        dispatchCommon("commonType", { grid3: updatedData });
        if (filteredResult.length > 0) {
          setActiveStep(userState.activeStep + 1);
        } else {
          return
        }
      } else if (userState.activeStep === 4) {
        loginShiftGridRef.current?.handleSubmit(e);
      } else if (userState.activeStep === 5) {
        let FinalGridData = loginBiometricRef?.current?.cleanData?.();
        const filtered = FinalGridData.map((row) => ({
          USER_NAME: row.USER_NAME,
          FINGER_NM: row.FINGER_NM,
          FINGER_BIO: row.FINGER_BIO,
        }));
        const updatedData = {
          DETAILS_DATA: {
            isNewRow: filtered,
            isUpdateRow: [],
            isDeleteRow: []
          }
        };
        dispatchCommon("commonType", { grid5: updatedData });
        SaveData();
      }
    } else if (defaultView === "edit") {
      if (userState.activeStep === 0) {
        FormData.current?.handleSubmit(e);
      } else if (userState.activeStep === 1) {
        let FinalGridData = appGridRef?.current?.cleanData?.();
        
        let OldGridData = userState.oldData?.map((row) => {
          return row?.APP_NM;
        });
        let UpdateOldGridData = FinalGridData?.filter((row) => OldGridData.includes(row?.APP_NM))?.map((rowData) => {
          const { APP_NM, APP_TRAN_CD} = rowData;
          return {
            APP_NM,
            APP_TRAN_CD,
            USER_NAME: UserName,
            LOGIN_ACCESS : rowData.LOGIN_ACCESS,
          };
        });
        
        const CompareData = utilFunction.transformDetailDataForDML(userState.oldData ?? [], UpdateOldGridData, ["APP_NM"]);
        let UpdateOldGridData2 = FinalGridData?.filter(
          (row) => !OldGridData.includes(row?.APP_NM) && Boolean(row?.LOGIN_ACCESS)
        )?.map((rowData) => {
          const { APP_NM, APP_TRAN_CD, LOGIN_ACCESS, USER_NAME } = rowData;
          return {
            APP_NM,
            APP_TRAN_CD,
            USER_NAME: UserName,
            LOGIN_ACCESS: LOGIN_ACCESS ? "Y" : "N",
          };
        });
        CompareData["isNewRow"] = [...UpdateOldGridData2];
        dispatchCommon("commonType", { grid1: CompareData });
        if (FinalGridData.length > 0) {
          setActiveStep(userState.activeStep + 1);
        } else {
          return;
        }
      } else if (userState.activeStep === 2) {
        let FinalGridData = branchGridRef?.current?.cleanData?.();
        let OldGridData = userState.oldData1?.map((row) => {
          return row?.BRANCH_CD;
        });
        let UpdateOldGridData = FinalGridData
          ?.filter((row) => OldGridData.includes(row?.BRANCH_CD))
          ?.map((rowData) => {
            const {COMP_CD,BRANCH_CD, LOGIN_ACCESS, USER_NAME,REPORT_ACCESS } = rowData;
          return {
            COMP_CD: rowData.COMP_CD,
            USER_NAME: UserName,
            LOGIN_ACCESS: rowData.LOGIN_ACCESS,
            REPORT_ACCESS: rowData.REPORT_ACCESS,
            BRANCH_CD: rowData.BRANCH_CD,
          };
          });
        const CompareData = utilFunction.transformDetailDataForDML(
          userState.oldData1 ?? [],
          UpdateOldGridData,
          ["BRANCH_CD"]
        );
        let UpdateOldGridData2 = FinalGridData?.filter(
          (row) => 
            !OldGridData.includes(row?.BRANCH_CD) && 
            (Boolean(row?.LOGIN_ACCESS) || Boolean(row?.REPORT_ACCESS))
        )?.map((rowData) => {
          const {LOGIN_ACCESS, REPORT_ACCESS } = rowData;
          return {
            COMP_CD: rowData.COMP_CD,
            USER_NAME: rowData.USER_NAME,
            LOGIN_ACCESS: LOGIN_ACCESS ? "Y" : "N",
            REPORT_ACCESS: REPORT_ACCESS ? "Y" : "N",
            BRANCH_CD: rowData.BRANCH_CD,
          };
        });
        CompareData["isNewRow"] = [...UpdateOldGridData2];
        
        dispatchCommon("commonType", { grid2: CompareData });
        if (FinalGridData.length > 0) {
          setActiveStep(userState.activeStep + 1);
        } else {
          return;
        }
      } else if (userState.activeStep === 3) {
        let FinalGridData = prodGridRef?.current?.cleanData?.();
        let OldGridData = userState.oldData2?.map((row) => {
          return row?.ACCT_TYPE;
        });
        let UpdateOldGridData = FinalGridData?.filter((row) => OldGridData.includes(row?.ACCT_TYPE))?.map((rowData) => {
          return {
            USER_NAME: UserName,
              COMP_CD: rowData.COMP_CD,
              BRANCH_CD: rowData.BRANCH_CD,
              ACCESS: rowData.ACCESS,
              ACCT_TYPE: rowData.ACCT_TYPE,
          };
        });
        const CompareData = utilFunction.transformDetailDataForDML(
          userState.oldData2 ?? [],
          UpdateOldGridData,
          ["ACCT_TYPE"]
        );
        let UpdateOldGridData2 = FinalGridData
          ?.filter(
            (row) => !OldGridData.includes(row?.ACCT_TYPE) && Boolean(row?.ACCESS)
          )
          ?.map((rowData) => {
            const {ACCESS} = rowData;
            return {
              USER_NAME: UserName,
                COMP_CD: rowData.COMP_CD,
                BRANCH_CD: rowData.BRANCH_CD,
                ACCESS: ACCESS ? "Y" : "N",
                ACCT_TYPE: rowData.ACCT_TYPE,
            };
          });
        CompareData["isNewRow"] = [...UpdateOldGridData2];
        dispatchCommon("commonType", { grid3: CompareData });
        if (FinalGridData.length > -1) {
          setActiveStep(userState.activeStep + 1);
        } else {
          return;
        }
      } else if (userState.activeStep === 4) {
        loginShiftGridRef.current?.handleSubmit(e);
      } else if (userState.activeStep === 5) {
        let FinalGridData = loginBiometricRef?.current?.cleanData?.();
        const filtered = FinalGridData.map((row) => ({
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
    }else if (defaultView === "view") {
      if (userState.activeStep === 0) {
        setActiveStep(userState.activeStep + 1);
      }else if (userState.activeStep === 1){
       const FinalGridData = appGridRef?.current?.cleanData?.();
       if (FinalGridData.length > 0){
         setActiveStep(userState.activeStep + 1);
       }
      }else if (userState.activeStep === 2){
        const FinalGridData = branchGridRef?.current?.cleanData?.();
        if (FinalGridData.length > 0){
          setActiveStep(userState.activeStep + 1);
        }
      }else if (userState.activeStep === 3){
        const FinalGridData = prodGridRef?.current?.cleanData?.();
        if (FinalGridData.length > 0){
          setActiveStep(userState.activeStep + 1);
        }
      }else if (userState.activeStep === 4){
          setActiveStep(userState.activeStep + 1);
      }else if (userState.activeStep === 5){
        const FinalGridData = loginBiometricRef?.current?.cleanData?.();
        if (FinalGridData.length > 0){
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
          <div style={{ display: "flex", marginLeft: "auto" }}>
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
</div>

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
        <div style={{ marginTop: "0px" }}>
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
        </div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            pt: 2,
            marginTop: "0px !important",
            position: "relative",
          }}
        >
          <div style={{ position: "fixed", bottom: "20px", right: "10px" }}>
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
  {(defaultView === "edit" || defaultView === "new") && userState.activeStep !== steps.length && (
    <>
      {userState.activeStep !== steps.length - 1 ? (
        <GradientButton
          onClick={handleComplete}
        >
          Save & Next
        </GradientButton>
      ) : (
        <GradientButton onClick={handleComplete}>
          Finish
        </GradientButton>
      )}
    </>
  )}
  {defaultView === "view" && userState.activeStep !== steps.length && (
    <>
      {userState.activeStep !== steps.length - 1 ? (
        <GradientButton
          onClick={handleComplete}
        >
          Next
        </GradientButton>
      ) : null}
    </>
  )}
</div>

        </Box>
      </Stack>
    </Fragment>
  );
};
export default CombinedStepper;
