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
import { GradientButton, queryClient } from "@acuteinfo/common-base";
import { t } from "i18next";
import {
  Fragment,
  lazy,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import JointTab from "./tabComponents/jointTabs/JointTab";
import NomineeJointTab from "./tabComponents/jointTabs/NomineeJointTab";
import GuardianJointTab from "./tabComponents/jointTabs/GuardianJointTab";
import GuarantorJointTab from "./tabComponents/jointTabs/GuarantorJointTab";
import CollateralJointTab from "./tabComponents/jointTabs/CollateralJointTab";
import SignatoryJointTab from "./tabComponents/jointTabs/SignatoryJointTab";
import IntroductorJointTab from "./tabComponents/jointTabs/IntroductorJointTab";
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
import Document from "./tabComponents/DocumentTab/Document";
// import Document from "./tabComponents/DocumentTab2/Document";
import { useMutation, useQuery } from "react-query";
import {
  Alert,
  RemarksAPIWrapper,
  usePopupContext,
} from "@acuteinfo/common-base";
import { enqueueSnackbar } from "notistack";

const AcctModal = ({ onClose, formmode, from }) => {
  const {
    AcctMSTState,
    handleFromFormModectx,
    handleFormModalOpenOnEditctx,
    handleFormDataonRetrievectx,
    handleFormModalClosectx,
    handleSidebarExpansionctx,
    handleColTabChangectx,
    handleFormModalOpenctx,
    handleCurrFormctx,
    onFinalUpdatectx,
    handleUpdatectx,
    handleModifiedColsctx,
    handleFormDataonSavectx,
    handleFormLoading,
  } = useContext(AcctMSTContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  const location: any = useLocation();
  const classes = useDialogStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<any>(null);
  const reqCD =
    formmode === "new"
      ? ""
      : !isNaN(parseInt(location?.state?.[0]?.data?.REQUEST_ID))
      ? parseInt(location?.state?.[0]?.data?.REQUEST_ID)
      : "";
  const acctType =
    formmode === "new" ? "" : location?.state?.[0].data?.ACCT_TYPE;
  const acctCD =
    formmode === "new" ? "" : location?.state?.[0].data?.ACCT_CD ?? "";

  // get account form details
  const {
    data: accountDetails,
    isLoading,
    isError: isAcctDtlError,
    error: AcctDtlError,
    refetch,
  } = useQuery<any, any>(
    ["getAccountDetails", acctType],
    () =>
      API.getAccountDetails({
        ACCT_TYPE: acctType,
        ACCT_CD: acctCD,
        REQUEST_CD: reqCD,
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        SCREEN_REF: "MST/002",
      }),
    { enabled: false }
  );

  useEffect(() => {
    if (isLoading) {
      handleFormLoading(true);
    } else {
      handleFormLoading(false);
    }
    if (!isLoading && accountDetails) {
      handleFormDataonRetrievectx(accountDetails[0]);
      handleColTabChangectx(0);
      handleFormLoading(false);
    }
  }, [accountDetails, isLoading]);

  // validate new account entry
  const validateAcctMutation: any = useMutation(API.validateNewAcct, {
    onSuccess: (data) => {
      enqueueSnackbar("Validated Successfully", { variant: "success" });
    },
    onError: (error: any) => {},
  });

  // save new account entry
  const saveAcctMutation: any = useMutation(API.accountSave, {
    onSuccess: (data) => {
      enqueueSnackbar("Saved Successfully", { variant: "success" });
      closeForm();
    },
    onError: (error: any) => {},
  });

  // modify new account entry
  const modifyAcctMutation: any = useMutation(API.accountModify, {
    onSuccess: (data) => {
      CloseMessageBox();
      handleCurrFormctx({
        currentFormSubmitted: null,
        isLoading: false,
      });
      handleModifiedColsctx({});
      handleFormDataonSavectx({});
      enqueueSnackbar("Updated Successfully", { variant: "success" });
      refetch();
      handleFormLoading(true);
    },
    onError: (error: any) => {
      CloseMessageBox();
      handleCurrFormctx({
        currentFormSubmitted: null,
        isLoading: false,
      });
      handleModifiedColsctx({});
      handleFormDataonSavectx({});
    },
  });

  // confirm acount entry
  const confirmMutation: any = useMutation(API.confirmAccount, {
    onSuccess: async (data) => {
      setIsOpen(false);
      enqueueSnackbar("Confirmed successfully", { variant: "success" });
      closeForm();
    },
    onError: async (error: any) => {
      // console.log("data o n error", error)
      // setIsUpdated(true)
      setIsOpen(false);
      setConfirmAction(null);
      // console.log("onerrorrr", error)
      // let buttonName = await MessageBox({
      //   messageTitle: "ERROR",
      //   message: "",
      //   buttonNames: ["Ok"],
      // });
    },
  });

  useEffect(() => {
    handleFromFormModectx({ formmode, from });
    if (Boolean(location.state)) {
      if (formmode === "new") {
        handleColTabChangectx(0);
        handleFormModalOpenctx();
      } else if (Array.isArray(location.state) && location.state.length > 0) {
        handleFormModalOpenOnEditctx(location?.state);
        refetch();
      }
    } else {
      handleFormModalClosectx();
      onClose();
    }

    return () => {
      handleFormModalClosectx();
      queryClient.removeQueries(["getAccountDetails", acctType]);
    };
  }, []);

  const closeForm = () => {
    handleFormModalClosectx();
    onClose();
  };
  const onCancelForm = async () => {
    // console.log(Object.keys(state?.formDatactx).length >0, Object.keys(state?.steps).length>0, "*0*",state?.formDatactx, Object.keys(state?.formDatactx).length, " - ", state?.steps, Object.keys(state?.steps).length, "aisuhdiuweqhd")
    if (
      Boolean(AcctMSTState?.formmodectx) &&
      AcctMSTState?.formmodectx !== "view"
    ) {
      if (Object.keys(AcctMSTState?.formDatactx).length > 0) {
        let buttonName = await MessageBox({
          messageTitle: "Alert",
          message: "Your changes will be Lost. Are you Sure?",
          buttonNames: ["Yes", "No"],
          icon: "WARNING",
        });
        if (buttonName === "Yes") {
          closeForm();
        }
      } else {
        closeForm();
      }
    } else {
      closeForm();
    }
  };

  const onUpdateForm = useCallback(
    (e) => {
      onFinalUpdatectx(true);
      // console.log(state?.modifiedFormCols, "wqeudyfgqwudye", displayMode)
      // console.log(Object.keys(state?.formDatactx).length >0, Object.keys(state?.steps).length>0, "*0*",state?.formDatactx, Object.keys(state?.formDatactx).length, " - ", state?.steps, Object.keys(state?.steps).length, "aisuhdiuweqhd")
      const refs = AcctMSTState?.currentFormctx.currentFormRefctx;
      if (Array.isArray(refs) && refs.length > 0) {
        handleCurrFormctx({
          isLoading: true,
        });
        Promise.all(
          refs.map((ref) => {
            return typeof ref === "function"
              ? ref()
              : ref.current &&
                  ref.current.handleSubmit &&
                  ref.current.handleSubmit(e, "save", false);
          })
        );
      }
    },
    [
      AcctMSTState?.currentFormctx.currentFormRefctx,
      AcctMSTState?.modifiedFormCols,
      formmode,
      AcctMSTState?.formmodectx,
    ]
  );

  const ActionBTNs = useMemo(() => {
    // console.log(AcctMSTState?.formmodectx, "wieuhfiwhefwef", AcctMSTState?.fromctx)
    return AcctMSTState?.formmodectx == "view"
      ? AcctMSTState?.fromctx &&
          AcctMSTState?.fromctx === "confirmation-entry" && (
            <Fragment>
              <GradientButton
                onClick={() => openActionDialog("Y")}
                color="primary"
                // disabled={mutation.isLoading}
              >
                {t("Confirm")}
              </GradientButton>
              <GradientButton
                onClick={() => openActionDialog("R")}
                color="primary"
                // disabled={mutation.isLoading}
              >
                {t("Reject")}
              </GradientButton>
            </Fragment>
          )
      : AcctMSTState?.formmodectx == "edit" &&
          AcctMSTState?.fromctx !== "new-draft" && (
            <GradientButton onClick={onUpdateForm} color="primary">
              {t("Update")}
            </GradientButton>
          );
  }, [
    AcctMSTState?.currentFormctx.currentFormRefctx,
    formmode,
    AcctMSTState?.formmodectx,
    from,
    AcctMSTState?.fromctx,
    AcctMSTState?.modifiedFormCols,
  ]);

  useEffect(() => {
    if (AcctMSTState?.currentFormctx?.currentFormSubmitted) {
      const steps = AcctMSTState?.tabNameList.filter((tab) => tab.isVisible);
      const totalTab: any = Array.isArray(steps) && steps.length;
      const isLastTab: boolean =
        AcctMSTState?.isFreshEntryctx &&
        totalTab - 1 === AcctMSTState?.colTabValuectx;
      if (formmode === "new") {
        if (isLastTab) {
          const reqPara = {
            IsNewRow: true,
            REQ_CD: AcctMSTState?.req_cd_ctx,
            REQ_FLAG: "F",
            SAVE_FLAG: "F",
            CUSTOMER_ID: AcctMSTState?.customerIDctx,
            ACCT_TYPE: AcctMSTState?.accTypeValuectx,
            ACCT_CD: AcctMSTState?.acctNumberctx,
            COMP_CD: authState?.companyID ?? "",
            formData: AcctMSTState?.formDatactx,
            OP_DATE: authState?.workingDate,
          };
          // validateAcctMutation.mutate(reqPara);
          saveAcctMutation.mutate(reqPara);
        }
      } else if (formmode === "edit") {
        if (isLastTab || AcctMSTState?.isFinalUpdatectx) {
          const getUpdatedTabs = async () => {
            const { updated_tab_format, update_type } = await handleUpdatectx({
              COMP_CD: authState?.companyID ?? "",
              BRANCH_CD: authState?.user?.branchCode ?? "",
            });
            if (typeof updated_tab_format === "object") {
              // console.log(update_type, "asdqwezxc weoifhwoehfiwoehfwef", typeof updated_tab_format, updated_tab_format)
              if (Object.keys(updated_tab_format)?.length === 0) {
                let buttonName = await MessageBox({
                  messageTitle: "Alert",
                  message: "You have not made any changes yet.",
                  buttonNames: ["Ok"],
                  icon: "WARNING",
                });
              } else if (Object.keys(updated_tab_format)?.length > 0) {
                let buttonName = await MessageBox({
                  messageTitle: "Alert",
                  message:
                    "Are you sure you want to apply changes and update ?",
                  buttonNames: ["Yes", "No"],
                  loadingBtnName: ["Yes"],
                  icon: "WARNING",
                });
                if (buttonName === "Yes") {
                  const reqPara = {
                    IsNewRow: !AcctMSTState?.req_cd_ctx ? true : false,
                    REQ_CD: AcctMSTState?.req_cd_ctx,
                    // REQ_FLAG: "F",
                    REQ_FLAG: AcctMSTState?.acctNumberctx ? "E" : "F",
                    SAVE_FLAG: "F",
                    CUSTOMER_ID: AcctMSTState?.customerIDctx,
                    ACCT_TYPE: AcctMSTState?.accTypeValuectx,
                    ACCT_CD: AcctMSTState?.acctNumberctx,
                    COMP_CD: authState?.companyID ?? "",
                    BRANCH_CD: authState?.user?.branchCode ?? "",
                    IS_FROM_MAIN: "N",
                    formData: AcctMSTState?.formDatactx,
                    OP_DATE: authState?.workingDate,
                    updated_tab_format: updated_tab_format,
                    update_type: update_type,
                  };
                  modifyAcctMutation.mutate(reqPara);
                }
              }
            }
          };
          getUpdatedTabs().catch((err) =>
            console.log("update error", err.message)
          );
        }
      }
      if (Boolean(!isLastTab && !AcctMSTState?.isFinalUpdatectx)) {
        handleCurrFormctx({
          colTabValuectx: AcctMSTState?.colTabValuectx + 1,
        });
        handleColTabChangectx(AcctMSTState?.colTabValuectx + 1);
      }
    }
  }, [
    AcctMSTState?.currentFormctx.currentFormSubmitted,
    AcctMSTState?.isFinalUpdatectx,
  ]);

  // useEffect(() => {
  //   if(Boolean(AcctMSTState?.currentFormctx.currentFormSubmitted)) {
  //     const steps = AcctMSTState?.tabNameList.filter(tab => tab.isVisible)
  //     const totalTab:any = Array.isArray(steps) && steps.length;
  //     // console.log(AcctMSTState?.currentFormctx, "wkeuhjfiowehfiweuifh", AcctMSTState?.currentFormctx.currentFormSubmitted, "---- ", steps, totalTab)
  //     if((totalTab - 1) > AcctMSTState?.colTabValuectx) {
  //       handleCurrFormctx({
  //         colTabValuectx: AcctMSTState?.colTabValuectx + 1,
  //       })
  //       handleColTabChangectx(AcctMSTState?.colTabValuectx + 1);
  //     } else if(Boolean(AcctMSTState?.isFreshEntryctx && (totalTab - 1) === AcctMSTState?.colTabValuectx)) {
  //       const reqPara = {
  //         IsNewRow: true,
  //         REQ_CD: AcctMSTState?.req_cd_ctx,
  //         REQ_FLAG: "F",
  //         SAVE_FLAG: "F",
  //         CUSTOMER_ID: AcctMSTState?.customerIDctx,
  //         ACCT_TYPE: AcctMSTState?.accTypeValuectx,
  //         ACCT_CD: AcctMSTState?.acctNumberctx,
  //         COMP_CD: authState?.companyID ?? "",
  //         formData: AcctMSTState?.formDatactx,
  //         OP_DATE: authState?.workingDate,
  //       }
  //       // console.log("oifjwoiejfowiejf", reqPara)
  //       saveAcctMutation.mutate(reqPara)
  //     }

  //     // if(Boolean(AcctMSTState?.isFinalUpdatectx)) {
  //     //   const getUpdatedTabs = async () => {
  //     //     const {updated_tab_format, update_type} = await handleUpdatectx({
  //     //       COMP_CD: authState?.companyID ?? ""
  //     //     })
  //     //     if(typeof updated_tab_format === "object") {
  //     //       // console.log(update_type, "asdqwezxc weoifhwoehfiwoehfwef", typeof updated_tab_format, updated_tab_format)
  //     //       if (Object.keys(updated_tab_format)?.length === 0) {
  //     //           setAlertOnUpdate(true)
  //     //       } else if(Object.keys(updated_tab_format)?.length>0) {
  //     //         setUpdateDialog(true)
  //     //       }
  //     //     }
  //     //   }
  //     //   getUpdatedTabs().catch(err => console.log("update error", err.message))
  //     //   // if(Object.keys(AcctMSTState?.modifiedFormCols).length >0) {
  //     //   //   setUpdateDialog(true)
  //     //   //   // setCancelDialog(true)
  //     //   // } else {
  //     //   //   setAlertOnUpdate(true)
  //     //   // }
  //     // } else {
  //     //   if((totalTab - 1) > AcctMSTState?.colTabValuectx) {
  //     //     handleCurrFormctx({
  //     //       colTabValuectx: AcctMSTState?.colTabValuectx + 1,
  //     //     })
  //     //     handleColTabChangectx(AcctMSTState?.colTabValuectx + 1);
  //     //   }
  //     // }
  //   }
  // }, [AcctMSTState?.currentFormctx.currentFormSubmitted, AcctMSTState?.tabNameList, AcctMSTState?.isFinalUpdatectx])

  const steps: any = AcctMSTState?.tabsApiResctx.filter((tab) => tab.isVisible);

  const getTabComp = (tabName: string) => {
    switch (tabName) {
      case "Main":
        return <MainTab />;
      case "Term Loan":
        return <TermLoanTab />;
      case "Savings Deposit":
        return <SavingsDepositTab />;
      case "Hypothication":
        return <HypothicationTab />;
      case "Current":
        return <CurrentTab />;
      case "Share/Nominal":
        return <ShareNominalTab />;
      case "Cummulative Fix Deposit":
      case "Fix Deposit":
        return <FixDepositTab />;
      case "Locker":
        return <LockerTab />;
      case "Mobile Registration":
        return <MobileRegTab />;
      case "Relative Details":
        return <RelativeDtlTab />;
      case "Other Address":
        return <OtherAddTab />;
      case "Documents":
        return <Document />;
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

  const openActionDialog = (state: string) => {
    setIsOpen(true);
    setConfirmAction(state);
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
              display: AcctMSTState?.isFreshEntryctx ? "none" : "flex",
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
            {/* {AcctMSTState?.formmodectx === "view" && (
              <Chip
                style={{ color: "white", marginLeft: "8px" }}
                variant="outlined"
                color="primary"
                size="small"
                label={`view mode`}
              />
            )} */}
            {Boolean(AcctMSTState?.formmodectx) && (
              <Chip
                style={{ color: "white", marginLeft: "8px" }}
                variant="outlined"
                color="primary"
                size="small"
                label={`${AcctMSTState?.formmodectx} mode`}
              />
            )}
          </Typography>
          {/* {HeaderContent} */}

          {/* for checker, view-only */}
          {ActionBTNs}
          <GradientButton onClick={onCancelForm} color={"primary"}>
            {t("Close")}
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
            display: AcctMSTState?.isFreshEntryctx ? "none" : "flex",
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
            AcctMSTState?.isFreshEntryctx && <TabStepper />}
          {isAcctDtlError ? (
            <Alert
              severity={AcctDtlError?.severity ?? "error"}
              errorMsg={AcctDtlError?.error_msg ?? "Something went to wrong.."}
              errorDetail={AcctDtlError?.error_detail}
              color="error"
            />
          ) : saveAcctMutation.isError ? (
            <Alert
              severity={saveAcctMutation.error?.severity ?? "error"}
              errorMsg={
                saveAcctMutation.error?.error_msg ?? "Something went to wrong.."
              }
              errorDetail={saveAcctMutation.error?.error_detail}
              color="error"
            />
          ) : modifyAcctMutation.isError ? (
            <Alert
              severity={modifyAcctMutation.error?.severity ?? "error"}
              errorMsg={
                modifyAcctMutation.error?.error_msg ??
                "Something went to wrong.."
              }
              errorDetail={modifyAcctMutation.error?.error_detail}
              color="error"
            />
          ) : (
            confirmMutation.isError && (
              <Alert
                severity={confirmMutation.error?.severity ?? "error"}
                errorMsg={
                  confirmMutation.error?.error_msg ??
                  "Something went to wrong.."
                }
                errorDetail={confirmMutation.error?.error_detail}
                color="error"
              />
            )
          )}
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

      <RemarksAPIWrapper
        TitleText={"Confirmation"}
        onActionNo={() => {
          setIsOpen(false);
          setConfirmAction(null);
        }}
        onActionYes={(val, rows) => {
          // console.log(val, "weiuifuhiwuefefgwef", rows)
          confirmMutation.mutate({
            REQUEST_CD: AcctMSTState?.req_cd_ctx ?? "",
            REMARKS: val ?? "",
            CONFIRMED: confirmAction,
          });
        }}
        isLoading={confirmMutation.isLoading || confirmMutation.isFetching}
        isEntertoSubmit={true}
        AcceptbuttonLabelText="Ok"
        CanceltbuttonLabelText="Cancel"
        open={isOpen}
        rows={{}}
        isRequired={confirmAction === "Y" ? false : true}
        // isRequired={false}
      />
    </Dialog>
  );
};

export default AcctModal;
