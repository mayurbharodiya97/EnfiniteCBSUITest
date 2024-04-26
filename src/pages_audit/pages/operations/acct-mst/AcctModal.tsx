import {
  AppBar,
  Chip,
  Dialog,
  Grid,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import ExtractedHeader from "../c-kyc/formModal/ExtractedHeader";
import { GradientButton } from "components/styledComponent/button";
import { t } from "i18next";
import { Fragment, lazy, useContext, useEffect, useMemo, useRef, useState } from "react";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"; // sidebar-open-icon
import CancelIcon from "@mui/icons-material/Cancel"; // sidebar-close-icon
import { CustomTabLabel, TabPanel } from "../c-kyc/formModal/formModal";
import { CustomTab, useDialogStyles } from "../c-kyc/formModal/style";
import AcctHeaderForm from "./AcctHeaderForm";
import { AuthContext } from "pages_audit/auth";
import { AcctMSTContext } from "./AcctMSTContext";
import { CustomTabs } from "../c-kyc/Ckyc";
import TabStepper from "./TabStepper";
import { useLocation } from "react-router-dom";
import * as API from "./api";
import MainTab from "./tabComponents/MainTab";
import JointTab from "./tabComponents/JointTab";
import NomineeJointTab from "./tabComponents/NomineeJointTab";
import GuardianJointTab from "./tabComponents/GuardianJointTab";
import GuarantorJointTab from "./tabComponents/GuarantorJointTab";
import CollateralJointTab from "./tabComponents/CollateralJointTab";
import SignatoryJointTab from "./tabComponents/SignatoryJointTab";
import IntroductorJointTab from "./tabComponents/IntroductorJointTab";
import TermLoanTab from "./tabComponents/TermLoanTab";
import SavingsDepositTab from "./tabComponents/SavingsDepositTab";
import HypothicationTab from "./tabComponents/HypothicationTab";
import CurrentTab from "./tabComponents/CurrentTab";
import FixDepositTab from "./tabComponents/FixDepositTab";
import LockerTab from "./tabComponents/LockerTab";
import MobileRegTab from "./tabComponents/MobileRegTab";
import RelativeDtlTab from "./tabComponents/RelativeDtlTab";
import ShareNominalTab from "./tabComponents/ShareNominalTab";
import OtherAddTab from "./tabComponents/OtherAddTab";
import DocumentTab from "./tabComponents/DocumentTab";
import AdvConfigTab from "./tabComponents/AdvConfigTab";
import { PreventUpdateDialog } from "../c-kyc/formModal/dialog/PreventUpdateDialog";
import { CloseFormDialog } from "../c-kyc/formModal/dialog/CloseFormDialog";
import { useMutation } from "react-query";
import { ConfirmUpdateDialog } from "../c-kyc/formModal/dialog/ConfirmUpdateDialog";

const AcctModal = ({ onClose, formmode, from }) => {
  const {
    AcctMSTState,
    handleFromFormModectx,
    handleFormModalClosectx,
    handleSidebarExpansionctx,
    handleColTabChangectx,
    handleFormModalOpenctx,
    handleCurrFormctx,
    handleUpdatectx,
  } = useContext(AcctMSTContext);
  const { authState } = useContext(AuthContext);
  const location: any = useLocation();
  const classes = useDialogStyles();
  const [updateDialog, setUpdateDialog] = useState(false)
  const [cancelDialog, setCancelDialog] = useState(false);
  const [alertOnUpdate, setAlertOnUpdate] = useState<boolean>(false)
  const onCloseUpdateDialog = () => {
    setUpdateDialog(false)
  }
  const onCloseCancelDialog = () => {
    setCancelDialog(false)
  }
  const onClosePreventUpdateDialog = () => {
    setAlertOnUpdate(false)
  }

  // get customer form details  
  const mutation: any = useMutation(API.getAccountDetails, {
    onSuccess: (data) => {
      // handleFormDataonRetrievectx(data[0])
      onClosePreventUpdateDialog()
    },
    onError: (error: any) => {},
  });  

  useEffect(() => {
    handleFromFormModectx({ formmode, from });
  }, []);

  const closeForm = () => {
    handleFormModalClosectx();
    onClose();
  };
  const onCancelForm = () => {
    // console.log(Object.keys(state?.formDatactx).length >0, Object.keys(state?.steps).length>0, "*0*",state?.formDatactx, Object.keys(state?.formDatactx).length, " - ", state?.steps, Object.keys(state?.steps).length, "aisuhdiuweqhd")
    if (AcctMSTState?.formmodectx !== "view") {
      if (
        Array.isArray(AcctMSTState?.formDatactx) &&
        Object.keys(AcctMSTState?.formDatactx).length > 0
      ) {
        setCancelDialog(true);
      } else {
        closeForm();
      }
    } else {
      closeForm();
    }
  };

  const dialogsMemo = useMemo(() => {
    // console.log("stepperere qiwuhqweqweqsq", updateDialog, actionDialog, cancelDialog, alertOnUpdate)
    return <Fragment>
        {/* confirms before updating */}
        {updateDialog && <ConfirmUpdateDialog 
            open={updateDialog} 
            onClose={onCloseUpdateDialog} 
            mutationFormDTL={mutation}
            setAlertOnUpdate={setAlertOnUpdate}
        />}

        {/* confirming action-remark dialog */}
        {/* {actionDialog && <ActionDialog 
            open={actionDialog} 
            setOpen={setActionDialog} 
            closeForm = {onClose}
            action= {confirmAction}
        />} */}

        {/* data lost alert on closing form */}
        {cancelDialog && <CloseFormDialog 
            open={cancelDialog} 
            onClose={onCloseCancelDialog} 
            closeForm = {onClose}
        />}

        {/* no change found to update dialog */}
        {alertOnUpdate && <PreventUpdateDialog 
            open={alertOnUpdate} 
            onClose={onClosePreventUpdateDialog} 
        />}
    </Fragment>
  }, [
    // updateDialog, actionDialog, 
    cancelDialog, alertOnUpdate])

  useEffect(() => {
    // console.log(state?.formmodectx,"asddsaasddsa", location?.state)
    // setDisplayMode(formmode)
    if (Boolean(location.state)) {
      if (!AcctMSTState?.isDraftSavedctx) {
        if (AcctMSTState?.formmodectx == "new") {
          handleFormModalOpenctx();
          // console.log("statess new", location.state);
        }
        // else {
        //   handleColTabChangectx(0)
        //   handleFormModalOpenOnEditctx(location?.state)

        //   let payload: {COMP_CD?: string, BRANCH_CD: string, REQUEST_CD?:string, CUSTOMER_ID?:string} = {
        //     // COMP_CD: authState?.companyID ?? "",
        //     BRANCH_CD: authState?.user?.branchCode ?? ""
        //   }
        //   if(Array.isArray(location.state) && location.state.length>0) {
        //     const reqCD = location.state?.[0]?.data.REQUEST_ID ?? "";
        //     const custID = location.state?.[0]?.data.CUSTOMER_ID ?? "";
        //     if(Boolean(reqCD)) {
        //       payload["REQUEST_CD"] = reqCD;
        //     }
        //     if(Boolean(custID)) {
        //       payload["CUSTOMER_ID"] = custID;
        //     }
        //   }
        //   if(Object.keys(payload)?.length > 1) {
        //     mutation.mutate(payload)
        //   }
        // }
      }
    } else {
      handleFormModalClosectx();
      onClose();
    }
  }, [AcctMSTState?.formmodectx]);

  useEffect(() => {
    if(Boolean(AcctMSTState?.currentFormctx.currentFormSubmitted)) {
      const steps = AcctMSTState?.tabNameList.filter(tab => tab.isVisible) 
      const totalTab:any = Array.isArray(steps) && steps.length;
      // handleCurrFormctx({
      //   // currentFormRefctx: [],
      //   currentFormSubmitted: null,
      //   // colTabValuectx: null,
      //   // isLoading: false,
      // })
      if(Boolean(AcctMSTState?.isFinalUpdatectx)) {
        const getUpdatedTabs = async () => {
          const {updated_tab_format, update_type} = await handleUpdatectx({
            COMP_CD: authState?.companyID ?? ""
          })
          if(typeof updated_tab_format === "object") {
            // console.log(update_type, "asdqwezxc weoifhwoehfiwoehfwef", typeof updated_tab_format, updated_tab_format)
            if (Object.keys(updated_tab_format)?.length === 0) {
                setAlertOnUpdate(true)
            } else if(Object.keys(updated_tab_format)?.length>0) {
              setUpdateDialog(true)
            }
          }
        }
        getUpdatedTabs().catch(err => console.log("update error", err.message))
        // if(Object.keys(AcctMSTState?.modifiedFormCols).length >0) {
        //   setUpdateDialog(true)
        //   // setCancelDialog(true)
        // } else {
        //   setAlertOnUpdate(true)
        // }
      } else {
        if((totalTab - 1) > AcctMSTState?.colTabValuectx) {
          handleCurrFormctx({
            colTabValuectx: AcctMSTState?.colTabValuectx + 1,
          })
          handleColTabChangectx(AcctMSTState?.colTabValuectx + 1); 
        }
      }      
    }
  }, [AcctMSTState?.currentFormctx.currentFormSubmitted, AcctMSTState?.tabNameList, AcctMSTState?.isFinalUpdatectx])

  const steps: any = AcctMSTState?.tabsApiResctx.filter((tab) => tab.isVisible);

  const getTabComp = (tabName: string) => {
    switch (tabName) {
      case "Main":
        return <MainTab />;
      case "Term Loan":
        return <TermLoanTab />;  
      case "Savings Deposit":
        return <SavingsDepositTab />  
      case "Hypothication":
        return <HypothicationTab />  
      case "Current":
        return <CurrentTab />  
      case "Share/Nominal":
        return <ShareNominalTab />  
      case "Cummulative Fix Deposit":
      case "Fix Deposit":
        return <FixDepositTab />  
      case "Locker":
        return <LockerTab />
      case "Mobile Registration":
        return <MobileRegTab />
      case "Relative Details":
        return <RelativeDtlTab />
      case "Other Address":
        return <OtherAddTab />
      case "Documents":
        return <DocumentTab />
      case "Advance Configuration":
        return <AdvConfigTab />
      case "Joint Holder":
        return <JointTab />;
      case "Nominee":
        return <NomineeJointTab />;
      case "Guardian":
        return <GuardianJointTab />;
      case "Guarantor":
        return <GuarantorJointTab />;
      case "Collateral Details":
        return <CollateralJointTab />;
      case "Signatory":
        return <SignatoryJointTab />;
      case "Introductor":
        return <IntroductorJointTab />;
      default:
        return <p>Not Found - {tabName}</p>;
    }
  };

  return (
    <Dialog fullScreen={true} open={true}>
      <ExtractedHeader />
      <AppBar
        position="sticky"
        color="secondary"
        style={{ top: "65px", background: "var(--theme-color5)" }}
      >
        <Toolbar variant="dense" sx={{ display: "flex", alignItems: "center" }}>
          <GradientButton
            onClick={handleSidebarExpansionctx}
            sx={{
              border: "1px solid var(--theme-color2)",
              mx: "10px",
              height: "30px",
              minWidth: "30px !important",
              display:
                AcctMSTState?.isFreshEntryctx ||
                AcctMSTState?.fromctx === "new-draft"
                  ? "none"
                  : "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "5px",
              "& .MuiSvgIcon-root": {
                fontSize: { xs: "1.5rem", md: "1.2rem" },
              },
              visibility:
                AcctMSTState?.tabsApiResctx &&
                AcctMSTState?.tabsApiResctx.length > 0
                  ? "visible"
                  : "hidden",
            }}
          >
            {!AcctMSTState?.isSidebarExpandedctx ? (
              <MenuOutlinedIcon sx={{ color: "var(--theme-color2)" }} />
            ) : (
              <CancelIcon sx={{ color: "var(--theme-color2)" }} />
            )}
          </GradientButton>
          <Typography
            className={classes.title}
            color="inherit"
            variant={"h6"}
            component="div"
          >
            {t("AcctMaster.newAcct")}
            {/* {state?.entityTypectx == "C"
                ? t("LegalEntry")
                : t("IndividualEntry")
              } */}
            {AcctMSTState?.formmodectx === "view" && (
              <Chip
                style={{ color: "white", marginLeft: "8px" }}
                variant="outlined"
                color="primary"
                size="small"
                label={`view mode`}
              />
            )}
          </Typography>
          {/* {HeaderContent} */}

          {/* for checker, view-only */}
          {/* {ActionBTNs} */}
          <GradientButton onClick={onCancelForm} color={"primary"}>
            {t("Cancel")}
          </GradientButton>
        </Toolbar>
      </AppBar>
      <AcctHeaderForm />
      <Grid
        container
        sx={{ transition: "all 0.4s ease-in-out", px: 1 }}
        columnGap={(theme) => theme.spacing(1)}
      >
        <Grid
          container
          item
          xs="auto"
          sx={{
            display:
              AcctMSTState?.isFreshEntryctx ||
              AcctMSTState?.fromctx === "new-draft"
                ? "none"
                : "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "sticky",
            top: 175,
            height: "calc(95vh - 150px)",
            boxShadow: "inset 10px 2px 30px #eee",

            opacity:
              AcctMSTState?.tabsApiResctx &&
              AcctMSTState?.tabsApiResctx.length > 0
                ? 1
                : 0,
            transition: "opacity 0.4s ease-in-out",
            pointerEvents:
              AcctMSTState?.tabsApiResctx &&
              AcctMSTState?.tabsApiResctx.length > 0
                ? ""
                : "none",
          }}
        >
          <CustomTabs
            sx={{ height: "calc(100% - 10px)", minWidth: "76px" }}
            textColor="secondary"
            variant="scrollable"
            scrollButtons={false}
            orientation="vertical"
            value={AcctMSTState?.colTabValuectx}
            onChange={(e, newValue) => handleColTabChangectx(newValue)}
          >
            {steps &&
              steps.length > 0 &&
              steps.map((el: any, i) => {
                return (
                  <Tooltip
                    key={el?.TAB_NAME}
                    placement="left"
                    title={
                      AcctMSTState?.isSidebarExpandedctx ? "" : el?.TAB_NAME
                    }
                  >
                    <CustomTab
                      isSidebarExpanded={AcctMSTState?.isSidebarExpandedctx}
                      label={
                        <CustomTabLabel
                          IconName={el?.ICON}
                          isSidebarExpanded={AcctMSTState?.isSidebarExpandedctx}
                          tabLabel={el?.TAB_NAME}
                          subtext={el?.TAB_DESC ?? ""}
                        />
                      }
                    />
                  </Tooltip>
                );
              })}
          </CustomTabs>
        </Grid>
        <Grid
          sx={{
            "& .MuiGrid-root": {
              padding: "0px",
            },
          }}
          item
          xs
        >
          {AcctMSTState?.tabsApiResctx &&
            AcctMSTState?.tabsApiResctx.length > 0 &&
            (AcctMSTState?.isFreshEntryctx ||
              AcctMSTState?.fromctx === "new-draft") && <TabStepper />}
          {steps &&
            steps.length > 0 &&
            steps.map((element, i) => {
              return (
                <TabPanel
                  key={i}
                  value={AcctMSTState?.colTabValuectx}
                  index={i}
                >
                  {getTabComp(element?.TAB_NAME)}
                  {/* {state?.entityTypectx==="I" ? getIndividualTabComp(element?.TAB_NAME) : getLegalTabComp(element?.TAB_NAME)} */}
                </TabPanel>
              );
            })}
        </Grid>
      </Grid>
      {dialogsMemo}
    </Dialog>
  );
};

export default AcctModal;
