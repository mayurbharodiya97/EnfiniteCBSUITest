import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { Typography, Grid, IconButton, Button, Chip, Icon, Tooltip, Dialog, AppBar, Toolbar } from '@mui/material';
// import StyledTabs from "components/styledComponent/tabs/tabs";
import { CustomTabs } from "../Ckyc";
import PersonalDetails from './formDetails/formComponents/individualComps/PersonalDetails';
import KYCDetails from './formDetails/KYCDetails';
import DeclarationDetails from './formDetails/formComponents/individualComps/DeclarationDetails';
import RelatedPersonDetails from './formDetails/formComponents/individualComps/RelatedPersonDetails';
import OtherDetails from './formDetails/formComponents/individualComps/OtherDetails';
import OtherAddressDetails from './formDetails/formComponents/individualComps/OtherAddressDetails';
import NRIDetails from './formDetails/formComponents/individualComps/NRIDetails';
import AttestationDetails from './formDetails/formComponents/individualComps/AttestationDetails';

// import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded'; //personal-details
// import AddLocationIcon from '@mui/icons-material/AddLocation'; // other-address
// import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
// import InfoIcon from '@mui/icons-material/Info'; // other-details
// import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'; //edit-pencil-icon
// import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'; // delete-icon
// import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'; // close-icon
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
// import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
// import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
// import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded';
// import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded'; // declaration-icon
import CancelIcon from '@mui/icons-material/Cancel'; // close-icon
// import RefreshIcon from '@mui/icons-material/Refresh'; // refresh-icon
// import { customer_data_meta_data } from '../metadata';

import { AuthContext } from 'pages_audit/auth';
import { useStyles } from 'pages_audit/appBar/style';
// import clsx from "clsx";

import * as API from "../api";
import { useMutation, useQuery } from "react-query";
// import { AutoComplete } from 'components/common';
import { useTranslation } from 'react-i18next';
import { CkycContext } from '../CkycContext';
import TabStepper from './TabStepper';
import PhotoSignature from './formDetails/formComponents/individualComps/PhotoSignature';
import EntityDetails from './formDetails/formComponents/legalComps/EntityDetails';
import ControllingPersonDTL from './formDetails/formComponents/legalComps/ControllingPersonDTL';
import { useLocation, useNavigate } from 'react-router-dom';
// import PhotoSignatureCpy from './formDetails/formComponents/individualComps/PhotoSignCopy';
// import Document from './formDetails/formComponents/document/Document';
import Document from './DocumentTab/Document';
import PhotoSignatureCpy from './formDetails/formComponents/individualComps/PhotoSignCopy2';
import { format } from 'date-fns';
import { GradientButton } from 'components/styledComponent/button';
import { ckyc_confirmation_form_metadata } from './formDetails/metadata/confirmation';
import { TextField } from 'components/styledComponent';
import { ActionDialog } from './dialog/ActionDialog';
import { CloseFormDialog } from './dialog/CloseFormDialog';
import { PreventUpdateDialog } from './dialog/PreventUpdateDialog';
import { ConfirmUpdateDialog } from './dialog/ConfirmUpdateDialog';
import { Alert } from 'components/common/alert';
import ExtractedHeader from './ExtractedHeader';
import HeaderForm from './HeaderForm';
import { RemarksAPIWrapper } from 'components/custom/Remarks';
import { MessageBoxWrapper } from 'components/custom/messageBox';
import PhotoSign from './formDetails/formComponents/individualComps/PhotoSign';
import { CustomTab, useDialogStyles } from './style';
// import MyAutocomplete from 'components/common/autocomplete/autocomplete';
export const CustomTabLabel = ({IconName, isSidebarExpanded, tabLabel, subtext}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        textTransform: "capitalize",
        // minWidth: "100px"
      }}
    >
      <div className="toggle_icon_container">
        {/* <ViewListIcon /> */}
          {/* {iconType === "mui" 
          ? <Icon><IconName /></Icon> : null
          // : <FontAwesomeIcon
          //     icon={["fas", IconName.toString()]}
          //     // color="var(--theme-color)"
          //   />
          } */}
          {/* <Icon>star</Icon> */}
        {/* {<IconName />} */}
        <Icon>{`${IconName}`}</Icon>
        {/* {IconComponent(IconName)} */}
        {/* <IconComponent iconName = {IconName as IconNames} /> */}
          {/* <FontAwesomeIcon
            icon={["fas", "users"]}
            // color="var(--theme-color)"
          /> */}
      </div>
      {<div className="toggle_text_container" style={{display: isSidebarExpanded ? "block" : "none", transition: "width 0.4s, display 0.4s", transitionDelay: "0.5s"}}>
        <h4 style={{ margin: 0 }}>{tabLabel}</h4>
        {(subtext.toString().length > 0) && <p style={{ margin: 0 }}>{subtext}</p>}
      </div>}
    </div>
  )
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other }:any = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Grid item xs sx={{ p: 1 }}>
          {/* <Typography> */}
              {children}
          {/* </Typography> */}
        </Grid>
      )}
    </div>
  );
}

export default function FormModal({
  // isFormModalOpen, handleFormModalOpen, handleFormModalClose,
  // isSidebarExpanded, setIsSidebarExpanded, handleSidebarExpansion,
  // colTabValue, setColTabValue, handleColTabChange,
  onClose, formmode, from
  // entityType, setEntityType, 
  // customerCategories, 
  // tabsApiRes, setTabsApiRes, 
  // categoryValue, setCategoryValue, 
  // constitutionValue, setConstitutionValue, 
  // accTypeValue, setAccTypeValue, 
  // AccTypeOptions
}) {
  const {state, handleFormModalOpenctx, handleFormModalClosectx, handleApiRes, handleCategoryChangectx, handleSidebarExpansionctx, handleColTabChangectx, handleAccTypeVal, handleKycNoValctx, handleFormDataonRetrievectx, handleFormModalOpenOnEditctx, handlecustomerIDctx, onFinalUpdatectx, handleCurrFormctx, handleUpdatectx, handleFromFormModectx } = useContext(CkycContext);
  // const { state: data }: any = useLocation();
  const location: any = useLocation();
  const { t } = useTranslation();
  const classes = useDialogStyles();
  const {authState} = useContext(AuthContext);
  const appBarClasses = useStyles();
  // const [customerCategories, setCustomerCategories] = useState([])
  const [categConstitutionIPValue, setCategConstitutionIPValue] = useState<any | null>("")
  const [acctTypeState, setAcctTypeState] = useState<any | null>(null)
  const [updateDialog, setUpdateDialog] = useState(false)
  const [actionDialog, setActionDialog] = useState(false)
  const [confirmMsgDialog, setConfirmMsgDialog] = useState(false)
  const [cancelDialog, setCancelDialog] = useState(false)
  // const [from, setFrom] = useState("");
  const [confirmAction, setConfirmAction] = useState<any>(null);
  const [alertOnUpdate, setAlertOnUpdate] = useState<boolean>(false)
  const [displayMode, setDisplayMode] = useState<any>(formmode)

  // on edit/view
  // - call retrieveFormRefetch
  //   - handleFormDataonRetrievectx(pass response)
  // - handleColTabChangectx(0)
  // - handleFormModalOpenOnEditctx(data.rows)
  
  // retrieve data
  // const {data:retrieveFormData, isError: isRetrieveFormError, isLoading: isRetrieveFormLoading, refetch: retrieveFormRefetch} = useQuery<any, any>(
  //   ["getCustomerDetailsonEdit", { }],
  //   () => API.getCustomerDetailsonEdit({
  //     COMP_CD: authState?.companyID ?? "",
  //     CUSTOMER_ID: location.state[0].id ?? "",
  //   }), {enabled: false}
  // )

  // acct type options
  // const {data:AccTypeOptions, isSuccess: isAccTypeSuccess, isLoading: isAccTypeLoading} = useQuery(
  //   ["getPMISCData", {}],
  //   () => API.getPMISCData("CKYC_ACCT_TYPE")
  // );

  // get customer form details  
  const mutation: any = useMutation(API.getCustomerDetailsonEdit, {
    onSuccess: (data) => {
      // // console.log("on successssss", data, location)
      // handleFormDataonRetrievectx(data[0])
      // let acctTypevalue = data[0]?.PERSONAL_DETAIL.ACCT_TYPE
      // let acctType = AccTypeOptions && AccTypeOptions.filter(op => op.value == acctTypevalue)
      // setAcctTypeState(acctType[0])
      // // handleColTabChangectx(0)
      // // handleFormModalOpenOnEditctx(location?.state)
      handleFormDataonRetrievectx(data[0])
      onClosePreventUpdateDialog()
    },
    onError: (error: any) => {},
  });

  const confirmMutation: any = useMutation(API.ConfirmPendingCustomers, {
    onSuccess: (data) => {
        // console.log("data o n save", data)
        // handleFormModalClosectx()
        // closeForm()
        setActionDialog(false)

        setConfirmMsgDialog(true)
    },
    onError: (error: any) => {
        // console.log("data o n error", error)
        // setIsUpdated(true)
        setActionDialog(false)
        setConfirmAction(null)
    },
  });

  // useEffect(() => {
  //   if(!mutation.isLoading && mutation.data) {
  //     if(AccTypeOptions && !isAccTypeLoading) {
  //       let acctTypevalue = mutation.data[0]?.PERSONAL_DETAIL.ACCT_TYPE
  //       let acctType = AccTypeOptions && AccTypeOptions.filter(op => op.value == acctTypevalue)
  //       setAcctTypeState(acctType[0])
  //     }
  //   }
  // }, [mutation.data, mutation.isLoading, AccTypeOptions, isAccTypeLoading])

  // useEffect(() => {
  //   // if(!location.state) {
  //   //   handleFormModalClosectx()
  //   //   onClose()
  //   // } else {
  //     if(location.pathname.includes("/view-detail")) {
  //       console.log(">>>-- edit", location.state, location.state[0].id)
  //       // handlecustomerIDctx(location.state[0].id)
  //       handleColTabChangectx(0)
  //       handleFormModalOpenOnEditctx(location?.state)
  //       // retrieveFormRefetch()
  //       let data = {
  //         COMP_CD: authState?.companyID ?? "",
  //         CUSTOMER_ID: location.state[0].id ?? "",
  //       }
        
  //       mutation.mutate(data)
  //     } else if(location?.pathname.includes("/new-entry") && location?.state?.entityType) {
  //       // console.log(">>>-- new", location.state)
  //       handleFormModalOpenctx(location?.state?.entityType)
  //     }
  //   // }
  // }, [location])

  useEffect(() => {
    handleFromFormModectx({formmode, from})
  }, [])

  useEffect(() => {
    // console.log(state?.formmodectx,"asddsaasddsa", location?.state)
    // setDisplayMode(formmode)
    if(Boolean(location.state)) {
      if(!state?.isDraftSavedctx) {
        if(state?.formmodectx == "new") {
          handleFormModalOpenctx(location?.state?.entityType)
          console.log("statess new", location.state)
        } else {
          handleColTabChangectx(0)
          handleFormModalOpenOnEditctx(location?.state)
    
          let payload: {COMP_CD?: string, BRANCH_CD: string, REQUEST_CD?:string, CUSTOMER_ID?:string} = {
            // COMP_CD: authState?.companyID ?? "",
            BRANCH_CD: authState?.user?.branchCode ?? ""
          }
          if(Array.isArray(location.state) && location.state.length>0) {
            const reqCD = location.state?.[0]?.data.REQUEST_ID ?? "";
            const custID = location.state?.[0]?.data.CUSTOMER_ID ?? "";
            if(Boolean(reqCD)) {
              payload["REQUEST_CD"] = reqCD;
            }
            if(Boolean(custID)) {
              payload["CUSTOMER_ID"] = custID;
            }
          }
          if(Object.keys(payload)?.length > 1) {
            mutation.mutate(payload)
          }
        } 
      }
    } else {
      handleFormModalClosectx()
      onClose()
    }    
  }, [state?.formmodectx])


  useEffect(() => {
    if(Boolean(state?.currentFormctx.currentFormSubmitted)) {
      const steps = state?.tabNameList.filter(tab => tab.isVisible) 
      const totalTab:any = Array.isArray(steps) && steps.length;
      // handleCurrFormctx({
      //   // currentFormRefctx: [],
      //   currentFormSubmitted: null,
      //   // colTabValuectx: null,
      //   // isLoading: false,
      // })
      if(Boolean(state?.isFinalUpdatectx)) {
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
        // if(Object.keys(state?.modifiedFormCols).length >0) {
        //   setUpdateDialog(true)
        //   // setCancelDialog(true)
        // } else {
        //   setAlertOnUpdate(true)
        // }
      } else {
        if((totalTab - 1) > state?.colTabValuectx) {
          handleCurrFormctx({
            colTabValuectx: state?.colTabValuectx + 1,
          })
          handleColTabChangectx(state?.colTabValuectx + 1); 
        }
      }      
    }
  }, [state?.currentFormctx.currentFormSubmitted, state?.tabNameList, state?.isFinalUpdatectx])




  // useEffect(() => {
  //   console.log("asdasdasdsasdasdas.", state?.isFormModalOpenctx, state?.entityTypectx, state?.isFreshEntryctx)
  // }, [state?.isFormModalOpenctx, state?.entityTypectx, state?.isFreshEntryctx])


  // useEffect(() => {
  //   if(!isAccTypeLoading && AccTypeOptions) {
  //     console.log("asdasdasdasda", AccTypeOptions)
  //     // setAcctTypeState(AccTypeOptions[1]?.value)
  //   }
  // }, [isAccTypeLoading, AccTypeOptions])

  // cust categ options
  // const { 
  //   data: custCategData, 
  //   isError: isCustCategError, 
  //   isLoading: isCustCategLoading, 
  //   error: custCategError, 
  //   refetch: custCategRefetch 
  // } = useQuery<any, any>(
  //   [
  //     "getCIFCategories",
  //     state.entityTypectx,
  //     // {
  //     //   COMP_CD: authState?.companyID ?? "",
  //     //   BRANCH_CD: authState?.user?.branchCode ?? "",
  //     //   ENTITY_TYPE: state.entityTypectx
  //     // }
  //   ],
  //   () =>
  //     API.getCIFCategories({
  //       COMP_CD: authState?.companyID ?? "",
  //       BRANCH_CD: authState?.user?.branchCode ?? "",
  //       ENTITY_TYPE: state?.entityTypectx,
  //     })
  // );

  // // get tabs data
  // const {data:TabsData, isSuccess, isLoading, error, refetch} = useQuery(
  //   ["getTabsDetail", {
  //     ENTITY_TYPE: state?.entityTypectx, 
  //     CATEGORY_CD: state?.categoryValuectx, 
  //     CONS_TYPE: state?.constitutionValuectx,
  //     CONFIRMFLAG: state?.confirmFlagctx,
  //   }],
  //   () =>
  //     API.getTabsDetail(
  //     {
  //       COMP_CD: authState?.companyID ?? "",
  //       ENTITY_TYPE: state?.entityTypectx,
  //       CATEGORY_CD: state?.categoryValuectx, //CATEG_CD
  //       CONS_TYPE: state?.constitutionValuectx, //CONSTITUTION_TYPE
  //       isFreshEntry: state?.isFreshEntryctx,
  //       CONFIRMFLAG: state?.confirmFlagctx,
  //     }  
  //     )
  // );
  // // const handleChangeAccType = (e) => {
  // //   setAccTypeValue(e.target.value)
  // // }

  // useEffect(() => {
  //   if(!isLoading) {
  //     // console.log("ResultResult", TabsData)
  //   // setTabsApiRes(data)
  //     let newData:any[] = []
  //     if(TabsData && TabsData.length>0) {
  //       TabsData.forEach((element:{[k: string]: any}) => {
  //         let subtitleinfo = {
  //           SUB_TITLE_NAME : element?.SUB_TITLE_NAME,
  //           SUB_TITLE_DESC : element?.SUB_TITLE_DESC,
  //           SUB_ICON : element?.SUB_ICON,
  //         }
  //           let index = newData.findIndex((el:any) => el?.TAB_NAME == element?.TAB_NAME)
  //           if(index != -1) {
  //             // duplicate tab element
  //             let subtitles = newData[index].subtitles
  //             subtitles.push(subtitleinfo)
  //           } else {
  //             // new tab element
  //             newData.push({...element, subtitles: [subtitleinfo]})
  //           }
  //         // console.log("filled newdata -aft", element.TAB_NAME , newData)
  //       });
  //       // setTabsApiRes(newData)
  //       handleApiRes(newData)
  //     }
  //   }
  // }, [TabsData, isLoading])

  // const handleCategoryChange = (e, value, r, d) => {
  //   // console.log("e,v,r,d", value)
  //   if(value) {
  //     setCategoryValue(value?.value)
  //     setConstitutionValue(value?.CONSTITUTION_TYPE)
  //     setColTabValue(0)
  //   } else {
  //     setColTabValue(false)
  //     setCategoryValue(null)
  //     setConstitutionValue(null)
  //     setTabsApiRes([])
  //   }
  //   // refetch()
  // }


  const getIndividualTabComp = (tabName:string) => {
    switch (tabName) {
      case "Personal Details":
        return <PersonalDetails />;

      case "KYC Details":
        return <KYCDetails />;
      
      case "Declaration Details":
        return <DeclarationDetails />;

      case "KYC Document Upload":
        return <Document />;

        // return <KYCDocUpload />

      case "Photo & Signature Upload":
        return <PhotoSign />
        // return <PhotoSignatureCpy displayMode={displayMode} />
        // return <PhotoSignatureCpy />
        // return <PhotoSignature />

      case "Details of Related Person":
        return <RelatedPersonDetails />;

      case "More Details":
        return <OtherDetails />;

      case "Other Address":
        return <OtherAddressDetails />;

      case "NRI Details":
        return <NRIDetails />;

      case "Attestation Details":
        return (
          <AttestationDetails
            onFormClose={onClose}
            onUpdateForm={onUpdateForm}
          />
        );

      default:
        return <p>Not Found - {tabName}</p>;
    }
  }
  const getLegalTabComp = (tabName:string) => {
    switch (tabName) {
      case "Entity Details":
        return <EntityDetails />;
        // return <PersonalDetails 
        // isLoading={isLoadingData} setIsLoading={setIsLoadingData} 
        // isCustomerData = {isCustomerData} setIsCustomerData = {setIsCustomerData} />

      case "KYC Details":
        return <KYCDetails />;
      
      case "Declaration Details":
        return <DeclarationDetails />;

      case "KYC Document Upload":
        return <Document />;
        // return <KYCDocUpload />
  
      case "Photo & Signature Upload":
        return <PhotoSign />
        // return <PhotoSignatureCpy displayMode={displayMode} />
        // return <PhotoSignature />

      case "Details of Controlling Persons":
        return <ControllingPersonDTL />;

      case "More Details":
        return <OtherDetails />;

      case "Other Address":
        return <OtherAddressDetails />;

      case "NRI Details":
        return <NRIDetails />;
        
      case "Attestation Details":
        return (
          <AttestationDetails
            onFormClose={onClose}
            onUpdateForm={onUpdateForm}
          />
        );

      default:
        return <p>Not Found - {tabName}</p>;
    }
  }

  const openUpdateDialog = () => {
    // if(state?.currentFormRefctx) {
    //   if(typeof state?.currentFormRefctx.current.handleSubmitError === "function") {
    //     state?.currentFormRefctx.current.handleSubmitError(e, "save")
    //   }
    // }
    setUpdateDialog(true)
  }
  const onCloseUpdateDialog = () => {
    setUpdateDialog(false)
  }

  const openActionDialog = (state:string) => {
    setActionDialog(true)
    setConfirmAction(state)
  }
  const onCloseActionDialog = () => {
    setActionDialog(false)
  }

  const onCloseCancelDialog = () => {
    setCancelDialog(false)
  }

  const onClosePreventUpdateDialog = () => {
    setAlertOnUpdate(false)
  }

  const closeForm = () => {
    handleFormModalClosectx()
    onClose()
  }

  const onUpdateForm = React.useCallback((e) => {
    onFinalUpdatectx(true)
    // console.log(state?.modifiedFormCols, "wqeudyfgqwudye", displayMode)
    // console.log(Object.keys(state?.formDatactx).length >0, Object.keys(state?.steps).length>0, "*0*",state?.formDatactx, Object.keys(state?.formDatactx).length, " - ", state?.steps, Object.keys(state?.steps).length, "aisuhdiuweqhd")
    const refs = state?.currentFormctx.currentFormRefctx;
    if(Array.isArray(refs) && refs.length>0) {
      handleCurrFormctx({
        isLoading: true,
      })
      Promise.all(refs.map(ref => {
        return typeof ref === "function" 
        ? ref() 
        : (ref.current && ref.current.handleSubmitError) 
        && ref.current.handleSubmitError(e, "save", false)
      }))
    }
    // if(displayMode == "new" || displayMode == "edit") {
    //   if(Object.keys(state?.modifiedFormCols).length >0) {
    //     setUpdateDialog(true)
    //     // setCancelDialog(true)
    //   } else {
    //     setAlertOnUpdate(true)
    //   }
    // }
  }, [state?.currentFormctx.currentFormRefctx, state?.modifiedFormCols, displayMode, state?.formmodectx])

  const onCancelForm = () => {
    // console.log(Object.keys(state?.formDatactx).length >0, Object.keys(state?.steps).length>0, "*0*",state?.formDatactx, Object.keys(state?.formDatactx).length, " - ", state?.steps, Object.keys(state?.steps).length, "aisuhdiuweqhd")
    if(state?.formmodectx !== "view") {
      if(Array.isArray(state?.formmodectx) && Object.keys(state?.formDatactx).length >0) {
        setCancelDialog(true)
      } else {
        closeForm()
      }
    } else {
      closeForm()
    }
  }

  const ActionBTNs = React.useMemo(() => {
    return state?.formmodectx == "view"
      ? (state?.fromctx && state?.fromctx === "confirmation-entry") && <React.Fragment>
        <Button
          onClick={() => openActionDialog("Y")}
          color="primary"
          // disabled={mutation.isLoading}
        >
          {t("Confirm")}
        </Button>
        <Button
          onClick={() => openActionDialog("M")}
          color="primary"
          // disabled={mutation.isLoading}
        >
          {t("Raise Query")}
        </Button>
        <Button
          onClick={() => openActionDialog("R")}
          color="primary"
          // disabled={mutation.isLoading}
        >
          {t("Reject")}
        </Button>
      </React.Fragment>
      : (state?.formmodectx == "edit" && state?.fromctx !== "new-draft") && <Button
          onClick={onUpdateForm}
          color="primary"
        >
          {t("Update")}
        </Button>
  }, [state?.currentFormctx.currentFormRefctx, displayMode, state?.formmodectx, from, state?.fromctx,state?.modifiedFormCols])

  const HeaderContent = React.useMemo(() => {
    return <React.Fragment>
      {(!state?.isFreshEntryctx && state?.fromctx !== "new-draft" && state?.retrieveFormDataApiRes)
      ? (
        <Typography sx={{whiteSpace: "nowrap", mx: "30px"}}
          // className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {(state?.entityTypectx === "I" && 
          state?.retrieveFormDataApiRes?.["PERSONAL_DETAIL"]?.IMAGE === "P") 
            ? "Photo/Signature yet not scanned" 
            : state?.retrieveFormDataApiRes?.["PERSONAL_DETAIL"]?.IMAGE === "N"
              ? "Photo/Signature Confirmation Pending" : null
          }
        </Typography>
        )
      :""}
      {
        ((!state?.isFreshEntryctx && state?.fromctx !== "new-draft" && state?.retrieveFormDataApiRes) && state?.retrieveFormDataApiRes?.["PERSONAL_DETAIL"]?.BRANCH_CD)
        ? <Typography sx={{whiteSpace: "nowrap", mx: "30px"}}
            // className={classes.title}
            color="inherit"
            variant="subtitle1"
            component="div"
          >{`Open from Branch - ${state?.retrieveFormDataApiRes?.["PERSONAL_DETAIL"]?.BRANCH_CD}`}</Typography>
        : null
      }


      {((!state?.isFreshEntryctx && state?.fromctx !== "new-draft" && state?.retrieveFormDataApiRes) && state?.retrieveFormDataApiRes?.["PERSONAL_DETAIL"]?.ENTERED_DATE)
      ? (
        <Typography sx={{whiteSpace: "nowrap", mr: "30px"}}
          // className={classes.title}
          color="inherit"
          variant="subtitle2"
          component="div"
        >{`Opening Date - ${format(new Date(state?.retrieveFormDataApiRes?.["PERSONAL_DETAIL"]?.ENTERED_DATE), "dd/MM/yyyy")}`}</Typography>
        )
      :""}
    </React.Fragment>
  }, [state?.retrieveFormDataApiRes])

  const dialogsMemo = React.useMemo(() => {
    // console.log("stepperere qiwuhqweqweqsq", updateDialog, actionDialog, cancelDialog, alertOnUpdate)
    return <React.Fragment>
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
    </React.Fragment>
  }, [updateDialog, actionDialog, cancelDialog, alertOnUpdate])
  const steps:any = state?.tabsApiResctx.filter(tab => tab.isVisible) 

  return (
    // <div>
    //   <Button onClick={handleFormModalOpen}>Open modal</Button>
      <Dialog fullScreen={true} 
      open={true}
      // open={state?.isFormModalOpenctx}
      >
        <ExtractedHeader />
        <AppBar
          position="sticky"
          color="secondary"
          style={{ top: "65px", background: "var(--theme-color5)" }}
        >
          <Toolbar variant="dense" sx={{display: "flex", alignItems: "center"}}>
            <GradientButton 
              onClick={handleSidebarExpansionctx} 
              sx={{ border: "1px solid var(--theme-color2)",
              mx: "10px",
              height: "30px",
              minWidth: "30px !important",
              display: (state?.isFreshEntryctx || state?.fromctx === "new-draft") ? "none" : "flex", 
              alignItems:"center", 
              justifyContent: "center",
              borderRadius: "5px",
              "& .MuiSvgIcon-root": {
                fontSize: {xs: "1.5rem", md: "1.2rem"},
              },
              visibility: (state?.tabsApiResctx && state?.tabsApiResctx.length>0) ? "visible" : "hidden"
              }}
            >                  
              {/* <IconButton color="secondary" onClick={handleSidebarExpansion}
                sx={{backgroundColor: "#ddd",ml: "20px", mb: "2px", alignSelf: "start"}} 
              > */}
                {!state?.isSidebarExpandedctx ? <MenuOutlinedIcon sx={{color:"var(--theme-color2)"}} /> : <CancelIcon sx={{color:"var(--theme-color2)"}} />}
              {/* </IconButton> */}
            </GradientButton>
            <Typography
              className={classes.title}
              color="inherit"
              variant={"h6"}
              component="div"
            >
              {/* {`C-KYC ${entityType == "C" ? "Legal Entity" : "Individual"} Entry`} */}
              {state?.entityTypectx == "C"
                ? t("LegalEntry")
                : t("IndividualEntry")
              }
              {state?.formmodectx === "view" &&
                <Chip
                  style={{ color: "white", marginLeft: "8px" }}
                  variant="outlined"
                  color="primary"
                  size="small"
                  label={`view mode`}
                />
              }
            </Typography>
            {HeaderContent}

            {/* for checker, view-only */}
            {ActionBTNs}
            <Button
              onClick={onCancelForm}
              color="primary"
              // disabled={mutation.isLoading}
            >
              {t("Cancel")}
            </Button>
          </Toolbar>
        </AppBar>
        <HeaderForm />
          <Grid container sx={{transition: "all 0.4s ease-in-out", px:1}} columnGap={(theme) => theme.spacing(1)}>

            

            <Grid container item xs="auto" sx={{
              display: (state?.isFreshEntryctx || state?.fromctx === "new-draft") ? "none" : "flex", flexDirection: "column",alignItems: "center",
              position: "sticky", top:175, height:"calc(95vh - 150px)", 
              boxShadow: "inset 10px 2px 30px #eee",

              opacity: (state?.tabsApiResctx && state?.tabsApiResctx.length>0) ? 1 : 0, 
              transition: 'opacity 0.4s ease-in-out',
              pointerEvents: (state?.tabsApiResctx && state?.tabsApiResctx.length>0) ? "" : "none"
              // backgroundColor: "#ddd"
              }}>
              {/* <CustomTabs sx={{height:"calc(100% - 10px)"}}  textColor="secondary" variant="scrollable" scrollButtons={false} visibleScrollbar={true} orientation="vertical" value={colTabValue} onChange={handleColTabChange}>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "Personal Details"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={HowToRegRoundedIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"Personal Details"} subtext={""} />} /></Tooltip>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "KYC Details"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={NoteAddRoundedIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"KYC"} subtext={"PoA & PoI & Documents"} />} /></Tooltip>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "Declaration"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={ArticleRoundedIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"Declaration"} subtext={"FATCA & CRS"} />} /></Tooltip>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "Details of Related Person"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={PeopleAltIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"Details of Related Person"} subtext={""} />} /></Tooltip>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "Other Details"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={InfoIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"Other Details"} subtext={"Income & Risk profile & Employment Details"} />} /></Tooltip>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "Other Address"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={AddLocationIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"Other Address"} subtext={""} />} /></Tooltip>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "NRI Details"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={PersonAddAltRoundedIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"NRI Details"} subtext={""} />} /></Tooltip>
                <Tooltip placement="left" title={isSidebarExpanded ? "" : "Attestation"}><CustomTab isSidebarExpanded={isSidebarExpanded} label={<CustomTabLabel IconName={WorkspacePremiumIcon} isSidebarExpanded={isSidebarExpanded} tabLabel={"Attestation"} subtext={"KYC verifcation"} />} /></Tooltip>
              </CustomTabs> */}

              <CustomTabs 
                sx={{height:"calc(100% - 10px)", minWidth: "76px"}}  
                textColor="secondary" variant="scrollable" scrollButtons={false} orientation="vertical" 
                value={state?.colTabValuectx} 
                onChange={(e, newValue) => handleColTabChangectx(newValue)}
              >
                {
                  (steps && steps.length>0) && steps.map((el:any, i) => {
                    // console.log(typeof WorkspacePremiumIcon, "asdqwewqsxaswweqeqw",WorkspacePremiumIcon)
                    // if(el.isVisible) {
                      return (
                        <Tooltip key={el?.TAB_NAME} placement="left" title={state?.isSidebarExpandedctx ? "" : el?.TAB_NAME}>
                          <CustomTab isSidebarExpanded={state?.isSidebarExpandedctx} 
                            label={
                              <CustomTabLabel 
                                IconName={el?.ICON} isSidebarExpanded={state?.isSidebarExpandedctx} 
                                tabLabel={el?.TAB_NAME} subtext={el?.TAB_DESC ?? ""} 
                              />
                            } 
                          />
                        </Tooltip>
                      )                      
                    // }
                  }) 
                }
              </CustomTabs>
            </Grid>
            <Grid sx={{
                "& .MuiGrid-root": {
                  padding: "0px",
                }
              }} item xs>
                
              {((state?.tabsApiResctx && state?.tabsApiResctx.length>0) && (state?.isFreshEntryctx || state?.fromctx === "new-draft")) && <TabStepper />}
              {mutation.isError ? (
                <Alert
                  severity={mutation.error?.severity ?? "error"}
                  errorMsg={mutation.error?.error_msg ?? "Something went to wrong.."}
                  errorDetail={mutation.error?.error_detail}
                  color="error"
                />
              ) : confirmMutation.isError && (
                <Alert
                  severity={confirmMutation.error?.severity ?? "error"}
                  errorMsg={confirmMutation.error?.error_msg ?? "Something went to wrong.."}
                  errorDetail={confirmMutation.error?.error_detail}
                  color="error"
                />
              )}
              {
                (steps && steps.length>0) && steps.map((element, i) => {
                  return <TabPanel key={i} value={state?.colTabValuectx} index={i}>
                    {state?.entityTypectx==="I" ? getIndividualTabComp(element?.TAB_NAME) : getLegalTabComp(element?.TAB_NAME)}
                  </TabPanel>
                }) 
              }
            </Grid>
          </Grid>
              {dialogsMemo}

          <RemarksAPIWrapper
            TitleText={"Confirmation"}
            onActionNo={() => {
              setActionDialog(false)
              setConfirmAction(null)
            }}
            onActionYes={(val, rows) => {
              // console.log(val, "weiuifuhiwuefefgwef", rows)
              confirmMutation.mutate({
                  REQUEST_CD: state?.req_cd_ctx ?? "",
                  REMARKS: val ?? "",
                  CONFIRMED: confirmAction
              })
            }}
            isLoading={confirmMutation.isLoading || confirmMutation.isFetching}
            isEntertoSubmit={true}
            AcceptbuttonLabelText="Ok"
            CanceltbuttonLabelText="Cancel"
            open={actionDialog}
            rows={{}}
            isRequired={confirmAction === "Y" ? false : true}
            // isRequired={false}
          />

          <MessageBoxWrapper
            MessageTitle={"SUCCESS"}
            // Message={`New Request ID created Successfully : ${state?.req_cd_ctx ?? ""}` ?? "No Message"}
            Message={
              state?.customerIDctx 
              ? `Customer ID : ${state?.customerIDctx} ${
                confirmAction === "Y" 
                ? "Confirmed" 
                : confirmAction === "M" 
                  ? "Query raised" 
                  : confirmAction === "R" ? "Rejected" : "no value"} Sucessfully`
              : state?.req_cd_ctx 
                ? `Request ID : ${state?.req_cd_ctx} ${
                  confirmAction === "Y" 
                  ? "Confirmed" 
                  : confirmAction === "M" 
                    ? "Query raised" 
                    : confirmAction === "R" && "Rejected"} Sucessfully`
                : "No Message"
            }
            // onClickButton={() => setConfirmMsgDialog(false)}
            onClickButton={() => {
              setConfirmAction(null)
              setConfirmMsgDialog(false)
              closeForm()
            }}
            rows={[]}
            buttonNames={["OK"]}
            open={confirmMsgDialog}
          />

        {/* {updateDialog && <ConfirmUpdateDialog 
            open={updateDialog} 
            onClose={onCloseUpdateDialog} 
            mutationFormDTL={mutation}
        />}

        {actionDialog && <ActionDialog 
            open={actionDialog} 
            onClose={onCloseActionDialog} 
            closeForm = {onClose}
            action= {confirmAction}
        />}

        {cancelDialog && <CloseFormDialog 
            open={cancelDialog} 
            onClose={onCloseCancelDialog} 
            closeForm = {onClose}
        />}

        {alertOnUpdate && <PreventUpdateDialog 
            open={alertOnUpdate} 
            onClose={onClosePreventUpdateDialog} 
        />} */}
      </Dialog>
    // </div>
  );
}

const Greetings = () => {
  let hours = new Date().getHours();
  let greet;

  if (hours < 12) greet = "morning";
  else if (hours >= 12 && hours <= 16) greet = "afternoon";
  else if (hours >= 16 && hours <= 24) greet = "evening";

  return <span>Good {greet},</span>;
};