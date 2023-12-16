import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  IconButton,
  Button,
  Divider,
  Tab,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import StyledTabs from "components/styledComponent/tabs/tabs";
import FormModal from "./formModal/formModal";
// import {Tabs} from '../../../../components/styledComponent/tabs';
// import {Tab} from '../../../../components/styledComponent/tab';
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined"; // save-icon
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline"; //edit-pencil-icon
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"; // delete-icon
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined"; // close-icon
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; //plus-icon-outlined
import AddCircleIcon from "@mui/icons-material/AddCircle"; //plus-icon-filled
import CorporateFareIcon from "@mui/icons-material/CorporateFare"; // legal-entity-icon
import PersonIcon from "@mui/icons-material/Person"; // individual-person-icon
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import {
  RetrieveDataFilterForm,
  ckyc_pending_req_meta_data,
  ckyc_retrieved_meta_data,
} from "./metadata";
import { FormComponentView } from "components/formcomponent";
import { FilterFormMetaType } from "components/formcomponent/filterform";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { useTranslation } from "react-i18next";
import { CkycContext } from "./CkycContext";
import { ActionTypes } from "components/dataTable";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Dependencies from "pages_audit/acct_Inquiry/dependencies";
import { DeactivateCustomer } from "./DeactivateCustomer";
import InsuranceComp from "./InsuranceComp";
import BankDTLComp from "./BankDTLComp";
import OffencesDTLComp from "./OffencesDTLComp";
import ControllingPersonComp from "./ControllingPersonComp";
import CreditCardDTLComp from "./CreditCardDTLComp";
import AssetDTLComp from "./AssetDTLComp";
import FinancialDTLComp from "./FinancialDTLComp";
import { format } from "date-fns";
import { PhotoSignUpdateDialog } from "./formModal/formDetails/formComponents/individualComps/PhotoSignCopy2";

export const CustomTabs: any = styled(StyledTabs)(({ orientation, theme }) => ({
  border: "unset !important",
  boxShadow: "unset !important",
  background: "unset !important",
  "& .MuiTabs-flexContainer .MuiButtonBase-root": {
    textTransform: "capitalize",
  },
  "& .MuiTabs-root .MuiTabs-scroller": {
    borderBottom: "1px solid rgba(0,0,0,0.12)",
  },
  "& .MuiTabs-scroller .MuiTabs-indicator": {
    backgroundColor: "var(--theme-color1)",
    left: 0,
    display: orientation == "vertical" && "none",
  },
  // "&.MuiTabs-root.MuiTabs-vertical .MuiTabs-scroller .MuiTabs-indicator": {
  //   right: "auto !important",
  // },
  // "& .MuiButtonBase-root.Mui-selected": {
  //   color: "#1976d2"
  // },
  "& .MuiButtonBase-root.MuiTab-root:not(.Mui-selected):hover": {
    color: "var(--theme-color3)",
  },
  "& .MuiTabs-flexContainerVertical": {
    [theme.breakpoints.up("sm")]: {
      // padding: "10px"
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
  "& .MuiTabs-flexContainerVertical .MuiButtonBase-root.MuiTab-root:hover": {
    border: `1.4px solid var(--theme-color1)`,
  },
  "& .MuiTabs-flexContainerVertical .MuiButtonBase-root.MuiTab-root": {
    border: `1.4px solid ${theme.palette.grey[600]}`,
    borderRadius: "10px",
    marginBottom: "10px",
    padding: "6px 16px",
  },
  "& .MuiTabs-flexContainerVertical .MuiButtonBase-root.MuiTab-root.Mui-selected":
    {
      border: `1.4px solid var(--theme-color1)`,
      boxShadow: theme.shadows[4],
      // borderRadius: "10px",
      // marginBottom: "10px"
    },
  "& .MuiButtonBase-root.MuiTab-root .toggle_icon_container": {
    backgroundColor: theme.palette.grey[400],

    minHeight: "40px",
    height: "40px",
    minWidth: "40px",
    width: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "5px",
    [theme.breakpoints.only("md")]: {
      minHeight: "30px",
      height: "30px",
      minWidth: "30px",
      width: "30px",
    },
  },
  "& .MuiButtonBase-root.MuiTab-root .toggle_icon_container .MuiSvgIcon-root": {
    [theme.breakpoints.only("md")]: {
      fontSize: "1.25rem",
    },
  },
  "& .MuiButtonBase-root.MuiTab-root:hover .toggle_icon_container": {
    backgroundColor: "#07288e3b",
  },
  "& .MuiButtonBase-root.MuiTab-root.Mui-selected .toggle_icon_container": {
    backgroundColor: "#07288e82",
    // animation: `boxanima 1000ms ${theme.transitions.easing.easeInOut}`,
    // animationIterationCount: "infinite",
    // animationDirection: "alternate",
    // animationDelay: "5s",
    "& .MuiSvgIcon-root": {
      animation: `anima 500ms ${theme.transitions.easing.easeInOut}`,
      animationIterationCount: "infinite",
      animationDirection: "alternate",
    },
    "@keyframes anima": {
      "0%": {
        fontSize: "1.2rem",
      },
      "100%": {
        fontSize: "1.8rem",
      },
    },
    "@keyframes boxanima": {
      "0%": {
        transform: "rotateY(5deg) rotateX(10deg)",
      },
      "100%": {
        transform: "rotateY(5deg) rotateX(360deg)",
        // borderRadius: "50%"
      },
    },
  },
  "& .MuiButtonBase-root.MuiTab-root .toggle_text_container": {
    paddingLeft: theme.spacing(1),
    textAlign: "left",
  },
}));

const StyledSearchField = styled(TextField)(({ theme }) => ({
  // width: "100%",
  "& .MuiInputBase-root": {
    color: "#888",
    padding: "5px",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor: "#eee",
    border: "0",
    outline: "none",
    maxWidth: "350px",
  },
  "& .MuiInputBase-root .MuiInputBase-input": {
    paddingLeft: theme.spacing(1),
  },
  "& .MuiInputBase-root.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
    {
      border: 0,
    },
  "& .MuiInputBase-root.MuiOutlinedInput-root.Mui-focused .MuiInputBase-input":
    {
      color: "var(--theme-color3)",
    },
  "& .MuiInputBase-root.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
    {
      border: "1.5px solid",
      borderColor: "var(--theme-color3)",
    },
  "& .MuiInputBase-root.MuiOutlinedInput-root": {
    paddingLeft: 0,
  },
  "& .MuiInputAdornment-root": {
    paddingRight: "5px",
  },
}));

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  border: "none",
  backgroundColor: "#07288e3b",
  borderRadius: "10px",
  transition: "all 0.2s",
  "&:hover": {
    backgroundColor: "#07288e7d",
  },
}));

const StyledHeaderGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  // marginBottom: theme.spacing(1),
  backgroundColor: "var(--theme-color2)",
  paddingTop: "5px",
  paddingBottom: "5px",
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  [theme.breakpoints.up("md")]: {
    position: "sticky",
    top: "56px",
    height: { xs: "100px", md: "50px" },
    paddingTop: "2px",
    zIndex: "999",
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          {/* <Typography> */}
          {children}
          {/* </Typography> */}
        </Box>
      )}
    </div>
  );
}

export const Ckyc = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    state,
    handleFormModalOpenctx,
    handleFormModalClosectx,
    handleSidebarExpansionctx,
    handleCustCategoryRes,
    handleFormModalOpenOnEditctx,
    handleColTabChangectx,
    handleFormDataonRetrievectx,
    handlecustomerIDctx,
  } = useContext(CkycContext);
  const location: any = useLocation();
  const [inputSearchValue, setInputSearchValue] = React.useState("");
  const [tabValue, setTabValue] = React.useState(0);
  const [colTabValue, setColTabValue] = React.useState<number | boolean>(0);
  const [customerCategories, setCustomerCategories] = useState([]);
  const [isCustomerData, setIsCustomerData] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const handleSidebarExpansion = () => {
    setIsSidebarExpanded((prevState) => !prevState);
    handleSidebarExpansionctx();
  };
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [entityType, setEntityType] = React.useState<null | string>(null);
  const { authState } = useContext(AuthContext);

  const [tabsApiRes, setTabsApiRes] = React.useState<any[]>([]);
  const [categoryValue, setCategoryValue] = React.useState<null | string>(null);
  const [constitutionValue, setConstitutionValue] = React.useState<
    null | string
  >(null);
  const [accTypeValue, setAccTypeValue] = React.useState<null | string>("");

  const [rowsData, setRowsData] = useState<any[]>([]);
  const [componentToShow, setComponentToShow] = useState("");
  const [acctOpen, setAcctOpen] = useState(false);
  const [insuranceOpen, setInsuranceOpen] = useState(true);
  const [bankCompOpen, setBankCompOpen] = useState(true);
  const [creditCardCompOpen, setCreditCardCompOpen] = useState(true);
  const [offencesCompOpen, setOffencesCompOpen] = useState(true);
  const [assetDTLCompOpen, setAssetDTLCompOpen] = useState(true);
  const [financialDTLCompOpen, setFinancialDTLCompOpen] = useState(true);
  const [contPersonCompOpen, setContPersonCompOpen] = useState(true);

  const { data, isError, isLoading, error, refetch } = useQuery<any, any>(
    [
      "getCIFCategories",
      state.entityTypectx,
      // {
      //   COMP_CD: authState?.companyID ?? "",
      //   BRANCH_CD: authState?.user?.branchCode ?? "",
      //   ENTITY_TYPE: state.entityTypectx
      // }
    ],
    () =>
      API.getCIFCategories({
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        ENTITY_TYPE: state?.entityTypectx,
      }),
    { enabled: false }
  );

  const {
    data: PendingData,
    isError: isPendingError,
    isLoading: isPendingDataLoading,
    isFetching: isPendingDataFetching,
    refetch: PendingRefetch,
  } = useQuery<any, any>(["getPendingData", {}], () =>
    API.getPendingData({
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      ENTERED_DATE: format(new Date(), "dd-MM-yyyy"),
      // ENTERED_DATE: "06-12-2023"
    })
  )

  useEffect(() => {
    PendingRefetch()
  }, [location])

  // useEffect(() => {
  //   if(PendingData && !isPendingDataLoading) {
  //     console.log("dqwiojdqowhdq", PendingData)
  //   }
  // },[PendingData, isPendingDataLoading])

  const mutation: any = useMutation(API.getRetrieveData, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });

  // const {data:retrieveFormData, isError: isRetrieveFormError, isLoading: isRetrieveFormLoading, refetch: retrieveFormRefetch} = useQuery<any, any>(
  //   ["getCustomerDetailsonEdit", { }],
  //   () => API.getCustomerDetailsonEdit({
  //     COMP_CD: authState?.companyID ?? "",
  //     CUSTOMER_ID: mutation?.data?.[0]?.CUSTOMER_ID ?? "",
  //   }), {enabled: false}
  // )

  // const {data:inactivateCustData, isError: isinactivateCustError, isLoading: isinactivateCustLoading, refetch: inactivateCustRefetch} = useQuery<any, any>(
  //   ["InactivateCustomer", { }],
  //   () => API.InactivateCustomer({
  //     COMP_CD: authState?.companyID ?? "",
  //     CUSTOMER_ID: mutation?.data?.[0]?.CUSTOMER_ID ?? "",
  //     // ACCT_TYPE: "143 ",
  //     // ACCT_CD: "000039",
  //     // AS_FROM: "C"
  //   }), {enabled: false}
  // )

  // useEffect(() => {
  //   if(mutation?.data?.[0]?.CUSTOMER_ID) {
  //     handlecustomerIDctx(mutation?.data[0]?.CUSTOMER_ID)
  //   }
  // }, [mutation?.data])

  // const handleViewDetails = async () => {
  //   retrieveFormRefetch()
  //   handleColTabChangectx(0)
  //   // if(retrieveFormData) {
  //   //   await handleFormModalOpenOnEditctx(data?.rows, retrieveFormData[0])
  //   // }
  // }

  // useEffect(() => {
  //   if(!isRetrieveFormLoading && retrieveFormData) {
  //     // console.log("result data....", typeof retrieveFormData[0], retrieveFormData[0])
  //     // let data = retrieveFormData[0]
  //     handleFormDataonRetrievectx(retrieveFormData[0])

  //     // handleFormModalOpenOnEditctx(data?.rows, retrieveFormData)
  //   }
  // }, [isRetrieveFormLoading, retrieveFormData, retrieveFormRefetch])

  useEffect(() => {
    if(!isLoading && data) {
      // console.log(data, "asddsa")
      // setCustomerCategories(data)
      handleCustCategoryRes(data);
    }
  }, [data, isLoading]);

  // useEffect(() => {
  //   if(!isAccTypeLoading) {
  //     console.log(AccTypeOptions, "asddsa")
  //     // setCustomerCategories(AccTypeOptions)
  //   }
  // }, [AccTypeOptions, isAccTypeLoading])

  useEffect(() => {
    // console.log('entityType changed', state?.entityTypectx)
    if (state?.entityTypectx) {
      refetch();
    }
  }, [state?.entityTypectx]);

  // useEffect(() => {
  //   console.log("wadqwdwq.", state?.colTabValuectx, state?.formDatactx, state?.steps)
  // }, [state?.colTabValuectx, state?.formDatactx, state?.steps])
  // useEffect(() => {
  //   console.log("wadqwdwq.", state?.formDatactx, state?.modifiedFormCols)
  // }, [state?.formDatactx, state?.modifiedFormCols])
  // useEffect(() => {
  //   console.log("wadqwdwq..", state?.photoBase64ctx, state?.signBase64ctx)
  // }, [state?.photoBase64ctx, state?.signBase64ctx])
  // useEffect(() => {
  //   console.log("state?.tabsApiResctxstate?.tabsApiResctx", state?.tabsApiResctx)
  // }, [state?.tabsApiResctx])
  // useEffect(() => {
  //   console.log("wadqwdwq. categ", state?.categConstitutionValuectx, state?.categoryValuectx, state?.constitutionValuectx)
  // }, [state?.categConstitutionValuectx, state?.categoryValuectx, state?.constitutionValuectx])
  // useEffect(() => {
  //   console.log("updateFormDatactx, modifiedFormCols", state?.updateFormDatactx, state?.modifiedFormCols)
  // }, [state?.formDatactx, state?.modifiedFormCols])
  // useEffect(() => {
  //   console.log(state?.updateFormDatactx, "< state?.updateFormDatactx state?.retrieveFormDataApiRes >", state?.retrieveFormDataApiRes, "state?.modifiedFormCols >", state?.modifiedFormCols, "state?.modifiedFormCols >", state?.modifiedFormCols)
  // }, [state?.updateFormDatactx, state?.retrieveFormDataApiRes, state?.modifiedFormCols, state?.modifiedFormCols])
  // useEffect(() => {
  //   console.log("state?.entityTypectx, state?.categoryValuectx, state?.constitutionValuectx",state?.entityTypectx, state?.categoryValuectx, state?.constitutionValuectx)
  // }, [state?.entityTypectx, state?.categoryValuectx, state?.constitutionValuectx])
  // useEffect(() => {
  //   console.log(`allonedit,
  //     categConstitutionValuectx - ${state?.categConstitutionValuectx},
  //     categoryValuectx - ${state?.categoryValuectx},
  //     constitutionValuectx - ${state?.constitutionValuectx},
  //     isFormModalOpenctx - ${state?.isFormModalOpenctx}, 
  //     entityTypectx - ${state?.entityTypectx}, 
  //     isFreshEntryctx - ${state?.isFreshEntryctx},
  //     customerIDctx - ${state?.customerIDctx},
  //     req_cd_ctx - ${state?.req_cd_ctx}
  //   `)
  // }, [
  //   state?.categConstitutionValuectx,
  //   state?.categoryValuectx,
  //   state?.constitutionValuectx,
  //   state?.isFormModalOpenctx, 
  //   state?.entityTypectx, 
  //   state?.isFreshEntryctx,
  //   state?.customerIDctx,
  //   state?.req_cd_ctx])
  // useEffect(() => {
  //   console.log("wadqwdwq.cccc", state?.categoryValuectx)
  // }, [state?.categoryValuectx])

  // const handleFormModalOpen = (type:String) => {
  // setIsFormModalOpen(true)
  // if(type) {
  //   setEntityType(type.toString())
  // }
  // };
  const handleFormModalClose = () => {
    handleFormModalClosectx();
    // setIsFormModalOpen(false)
    // setEntityType(null)
    // setColTabValue(false)
    // setCategoryValue(null)
    // setConstitutionValue(null)
    // setAccTypeValue(null)
    // setTabsApiRes([])
    // // setCustomerCategories([])
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  const handleColTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    // console.log("qweert", newValue)
    // console.log({newValue})
    // if(newValue) {
    setColTabValue(newValue);
    // }
  };
  const handleInputSearchValue = (event) => {
    setInputSearchValue(event.target.value);
  };

  // useEffect(() => {
  //   console.log(colTabValue, typeof colTabValue,"...")
  //   console.log(tabValue, typeof tabValue, "... tab")
  // }, [colTabValue, tabValue])

  useEffect(() => {
    if (isLoadingData) {
      setTimeout(() => {
        setIsLoadingData(false);
        setIsCustomerData(true);
      }, 5000);
    }
  }, [isLoadingData]);

  const controlPanel = (
    <Box>
      {/* <Grid container sx={{backgroundColor:"#eee", boxShadow: (theme) => theme.shadows[2],}} xs={12} sm={12} md={12} lg={12}> */}
      {/* <Typography variant="h6">asd</Typography> */}
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "var(--theme-color2)",
          // backgroundColor:{xs:"#fff",sm: "#000", md: "#f00", lg: "#0f0", xl: "#00f"},
          width: "100%",
          // minWidth:
          p: (theme) => theme.spacing(1),
          boxShadow: (theme) => theme.shadows[3],
          borderRadius: "10px",
        }}
      >
        <Button
          sx={{ mr: (theme) => theme.spacing(1), textTransform: "capitalize" }}
          color="secondary"
          variant="contained"
          startIcon={<SaveOutlinedIcon />}
          size="small"
          disableElevation={true}
        >
          Save
        </Button>
        {tabValue ? <Divider orientation="vertical" flexItem={true} /> : null}
        {tabValue ? (
          <CustomIconButton
            color="secondary"
            size="small"
            sx={{ mx: (theme) => theme.spacing(1) }}
          >
            <DriveFileRenameOutlineIcon fontSize="small" />
          </CustomIconButton>
        ) : null}
        {tabValue ? (
          <CustomIconButton
            color="secondary"
            size="small"
            sx={{ mr: (theme) => theme.spacing(1) }}
          >
            <DeleteOutlinedIcon fontSize="small" />
          </CustomIconButton>
        ) : null}
        {tabValue ? (
          <CustomIconButton color="secondary" size="small" sx={{ ml: "auto" }}>
            <CancelOutlinedIcon fontSize="small" />
          </CustomIconButton>
        ) : null}
      </Grid>
      {/* </Grid> */}
    </Box>
  );

  const actions: ActionTypes[] = [
    {
      actionName: "view-detail",
      actionLabel: "View Detail",
      multiple: false,
      rowDoubleClick: true,
    },
    {
      actionName: "inactive-customer",
      actionLabel: "Inactivate Customer",
      multiple: false,
      rowDoubleClick: false,
    },
    {
      actionName: "change-category",
      actionLabel: "Change Category",
      multiple: false,
      rowDoubleClick: false,
    },
    {
      actionName: "document",
      actionLabel: "Document",
      multiple: false,
      rowDoubleClick: false,
    },
    {
      actionName: "photo-signature",
      actionLabel: "Photo/Signature",
      multiple: false,
      rowDoubleClick: false,
    },
    {
      actionName: "other-address",
      actionLabel: "Other Address",
      multiple: false,
      rowDoubleClick: false,
    },
    {
      actionName: "insurance",
      actionLabel: "Insurance",
      multiple: false,
      rowDoubleClick: false,
    },
    {
      actionName: "bank-details",
      actionLabel: "Bank Details",
      multiple: false,
      rowDoubleClick: false,
    },
    {
      actionName: "credit-card",
      actionLabel: "Credit Card",
      multiple: false,
      rowDoubleClick: false,
    },
    {
      actionName: "offences-details",
      actionLabel: "Offences",
      multiple: false,
      rowDoubleClick: false,
    },
    {
      actionName: "asset-details",
      actionLabel: "Asset Details",
      multiple: false,
      rowDoubleClick: false,
    },
    {
      actionName: "financial-details",
      actionLabel: "Financial Details",
      multiple: false,
      rowDoubleClick: false,
    },
    {
      actionName: "tds-exemption",
      actionLabel: "TDS Exemption",
      multiple: false,
      rowDoubleClick: false,
    },
    {
      actionName: "dependencies",
      actionLabel: "Dependencies",
      multiple: false,
      rowDoubleClick: false,
    },
    {
      actionName: "controlling-person-details",
      actionLabel: "Controlling Person",
      multiple: false,
      rowDoubleClick: false,
    },
  ];

  const pendingActions: ActionTypes[] = [
    {
      actionName: "view-detail",
      actionLabel: "View Detail",
      multiple: false,
      rowDoubleClick: true,
    },
    {
      actionName: "view-all",
      actionLabel: "View All",
      multiple: false,
      rowDoubleClick: false,
      alwaysAvailable: true,
      isNodataThenShow: true
    },
  ];


  const setCurrentAction = useCallback(
    (data) => {
      // console.log("jwdoijoijwdwedwe", data)
      // // console.log("dataddaada", data)
      // if (data.name === "view-detail") {
      //   // refetch()
      //   handleViewDetails()
      //   // retrieveFormRefetch()
      //   // handleColTabChangectx(0)
      //   // if(retrieveFormData && Object.keys(state?.retrieveFormDataApiRes)?.length>0) {
      //   // if(retrieveFormData) {
      //     console.log("data?.rows", data?.rows)
      //     handleFormModalOpenOnEditctx(data?.rows)
      //   // }

      //   navigate(data?.name, {
      //     state: data?.rows,
      //   })
      // }
      // else if (data.name === "dependencies") {
      //   setComponentToShow("Dependencies");
      //   setAcctOpen(true);
      //   setRowsData(data?.rows);
      // } else if (data.name === "tds-exemption") {
      //   setComponentToShow("ViewStatement");
      //   // setAcctOpen(true);
      //   setRowsData(data?.rows);
      // } else if(data.name === "inactive-customer") {
      //   setComponentToShow("DeactivateCustomer");
      //   setRowsData(data?.rows);
      // } else if(data.name === "insurance") {
      //   setComponentToShow("insurance");
      //   setInsuranceOpen(true);
      //   setRowsData(data?.rows);
      // } else if(data.name === "bank-details") {
      //   setComponentToShow("bankDetails");
      //   setBankCompOpen(true);
      //   setRowsData(data?.rows);
      // } else if(data.name === "credit-card") {
      //   setComponentToShow("creditCard");
      //   setCreditCardCompOpen(true);
      //   setRowsData(data?.rows);
      // } else if(data.name === "offences-details") {
      //   setComponentToShow("offencesDetails");
      //   setOffencesCompOpen(true);
      //   setRowsData(data?.rows);
      // } else if(data.name === "asset-details") {
      //   setComponentToShow("assetDetails");
      //   setAssetDTLCompOpen(true);
      //   setRowsData(data?.rows);
      // } else if(data.name === "financial-details") {
      //   setComponentToShow("financialDetails");
      //   setFinancialDTLCompOpen(true);
      //   setRowsData(data?.rows);
      // } else if(data.name === "controlling-person-details") {
      //   setComponentToShow("controllingPersonDTL");
      //   setContPersonCompOpen(true);
      //   setRowsData(data?.rows);
      // }
      // else {
      setRowsData(data?.rows);
      navigate(data?.name, {
        state: data?.rows,
      });
      // }
    },
    // []
    [navigate]
  );

  // insurance-data display api
  // const {data:insuranceData, isError: isInsuranceError, isLoading: isInsuranceLoading, refetch: insuranceRefetch} = useQuery<any, any>(
  //     ["getInsuranceGridData", { rowsData}],
  //     () => API.getInsuranceGridData({
  //         COMP_CD: authState?.companyID ?? "",
  //         CUSTOMER_ID: rowsData?.[0]?.id ?? "",
  //     }), {enabled: true}
  // )

  return (
    <React.Fragment>
      <Typography
        sx={{
          color: (theme) => theme.palette.grey[700],
          mb: (theme) => theme.spacing(0.5),
        }}
        variant="h6"
      >
        {t("CkycHeader")}
      </Typography>
      <StyledHeaderGrid
        container
        columnGap={(theme) => theme.spacing(2)}
        rowGap={(theme) => theme.spacing(2)}
      >
        <Grid item xs="auto">
          <CustomTabs
            textColor="secondary"
            value={tabValue}
            onChange={handleTabChange}
            aria-label="ant example"
          >
            {/* <Tab label="Add New" /> */}
            <Tab label={t("Retrieve")} />
            <Tab label={t("Pending")} />
          </CustomTabs>
        </Grid>
        {/* <Grid item xs={12} sm={12} md>
          <Typography variant="h6" gutterBottom={true}>C-KYC Individual/Legal Entry</Typography>
        </Grid> */}
        <Grid container item xs="auto" columnGap={1}>
          <Tooltip title={t("IndividualCustTooltip")}>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => {
                // handleFormModalOpenctx("I")
                navigate("new-entry", {
                  state: {
                    isFormModalOpen: true,
                    entityType: "I",
                    isFreshEntry: true,
                  },
                });
              }}
              sx={{
                // height: "40px", width: "40px", minWidth:"40px", borderRadius: "50%",
                minHeight: { xs: "40px", md: "30px" },
                height: { xs: "40px", md: "30px" },
                minWidth: { xs: "40px", md: "30px" },
                width: { xs: "40px", md: "30px" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "5px",
                "& .MuiSvgIcon-root": {
                  fontSize: { xs: "1.5rem", md: "1.2rem" },
                },
              }}
            >
              {/* <IconButton sx={{border: (theme) => `1px solid ${theme.palette.secondary.main}`}} color="secondary"> */}
              <PersonIcon fontSize="medium" />
              {/* </IconButton> */}
            </Button>
          </Tooltip>
          <Tooltip title={t("LegalCustTooltip")}>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => {
                // handleFormModalOpenctx("C")
                navigate("new-entry", {
                  state: {
                    isFormModalOpen: true,
                    entityType: "C",
                    isFreshEntry: true,
                  },
                });
              }}
              sx={{
                // height: "40px", width: "40px", minWidth:"40px", borderRadius: "50%",
                minHeight: { xs: "40px", md: "30px" },
                height: { xs: "40px", md: "30px" },
                minWidth: { xs: "40px", md: "30px" },
                width: { xs: "40px", md: "30px" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "5px",
                "& .MuiSvgIcon-root": {
                  fontSize: { xs: "1.5rem", md: "1.2rem" },
                },
              }}
            >
              {/* <IconButton sx={{border: (theme) => `1px solid ${theme.palette.secondary.main}`}} color="secondary"> */}
              {/* <AddCircleOutlineIcon fontSize="medium" /> */}
              <CorporateFareIcon fontSize="medium" />
              {/* </IconButton> */}
            </Button>
          </Tooltip>
        </Grid>
        {false && (
          <Grid
            sx={{ display: tabValue !== 0 ? "none" : "block" }}
            item
            xs={12}
            sm={12}
            md="auto"
          >
            {controlPanel}
          </Grid>
        )}
      </StyledHeaderGrid>
      <TabPanel value={tabValue} index={0}>
        {/* <Typography variant="h6">Retrieve</Typography> */}
        {/* <Typography sx={{color: (theme) => theme.palette.grey[700]}} variant="h6" gutterBottom={true}>C-KYC Individual/Legal Entry (MST/707)</Typography>
        <Typography sx={{color: (theme) => theme.palette.grey[500]}} variant="subtitle1" gutterBottom={true}>Lorem ipsum dolor sit amet consectetur adipisicing elit.</Typography> */}

        <Grid
          sx={{
            backgroundColor: "var(--theme-color2)",
            padding: (theme) => theme.spacing(1),
            boxSizing: "border-box",
            border: (theme) => `2px dashed ${theme.palette.grey[500]}`,
            borderRadius: "20px",
          }}
          my={(theme) => theme.spacing(3)}
          container
          direction={"column"}
        >
          {/* <Grid item>
            <Typography sx={{color: "var(--theme-color1)", paddingBottom: (theme) => theme.spacing(2)}} variant="h6" >Fetch Data</Typography>
          </Grid> */}
          {/* <Grid item container direction={"column"}>
            <label htmlFor="customer_id" style={{color:"grey"}}>Customer ID</label>
            <StyledSearchField sx={{maxWidth: "300px"}} id={"customer_id"} placeholder="Customer ID" />
          </Grid> */}

          {/* formComponentview */}
          <FormComponentView
            key={"retrieveCustomerData"}
            finalMetaData={RetrieveDataFilterForm as FilterFormMetaType}
            onAction={(colomnValue, initialVisibleColumn) => {
              // console.log("wlkefhwief", colomnValue, initialVisibleColumn)
              let newObj = {};
              let newArr = Object.keys(colomnValue).filter(
                (key) =>
                  colomnValue[key] != null &&
                  colomnValue[key] != undefined &&
                  colomnValue[key] != ""
              );
              newArr.map((el) => {
                newObj[el] = colomnValue[el];
              });
              let data = {
                COMP_CD: authState?.companyID ?? "",
                SELECT_COLUMN: newObj,
              };
              mutation.mutate(data);
            }}
            loading={false}
            data={{}}
            submitSecondAction={() => {}}
            submitSecondButtonName="Save"
            submitSecondButtonHide={true}
            submitThirdButtonHide={true}
            submitSecondLoading={false}
            propStyles={{
              titleStyle: { color: "var(--theme-color3) !important" },
              toolbarStyles: { background: "var(--theme-color2) !important" },
              IconButtonStyle: { variant: "secondary" },
              paperStyle: { boxShadow: "none" },
            }}
          ></FormComponentView>
          {/* formComponentview */}

          {/* <Grid item py={2} sx={{textAlign: "right"}}>
            <Button color="secondary" variant="contained">Retrieve</Button>
          </Grid> */}
        </Grid>

        <GridWrapper
          key={`RetrieveCustEntries` + mutation.data}
          finalMetaData={ckyc_retrieved_meta_data as GridMetaDataType}
          data={mutation.data ?? []}
          setData={() => null}
          loading={mutation.isLoading || mutation.isFetching}
          actions={actions}
          setAction={setCurrentAction}
          // refetchData={() => refetch()}
          // ref={myGridRef}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {/* <Typography variant="subtitle1" gutterBottom={true}>Pending Requests</Typography> */}
        <Typography
          sx={{
            color: (theme) => theme.palette.grey[700],
            mb: (theme) => theme.spacing(2),
          }}
          variant="h6"
        >
          {t("PendingReq")}
        </Typography>
        <Grid item>
          <GridWrapper
            key={`PendingCustEntrties`+PendingData}
            finalMetaData={ckyc_pending_req_meta_data as GridMetaDataType}
            data={PendingData ?? []}
            setData={() => null}
            loading={isPendingDataLoading || isPendingDataFetching}
            actions={pendingActions}
            setAction={setCurrentAction}
            refetchData={() => PendingRefetch()}
            // ref={myGridRef}
          />
        </Grid>
      </TabPanel>

      <Routes>
        <Route
          path="new-entry/*"
          element={
            <FormModal
              isLoadingData={isLoadingData}
              setIsLoadingData={setIsLoadingData}
              isCustomerData={isCustomerData}
              setIsCustomerData={setIsCustomerData}
              onClose={() => navigate(".")}
              displayMode={"new"}
            />
          }
        />

        <Route
          path="view-detail/*"
          element={
            <FormModal
              isLoadingData={isLoadingData}
              setIsLoadingData={setIsLoadingData}
              isCustomerData={isCustomerData}
              setIsCustomerData={setIsCustomerData}
              onClose={() => navigate(".")}
              displayMode={"edit"}
            />
          }
        />

        <Route
          path="inactive-customer/*"
          element={
            <DeactivateCustomer
              rowdata={rowsData}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="photo-signature/*"
          element={
            <PhotoSignUpdateDialog
              open={true}
              onClose={() => {
                navigate(".")
              }}
            />
          }
        />

        <Route
          path="insurance/*"
          element={
            <InsuranceComp
              // rowsData={rowsData}
              open={insuranceOpen}
              onClose={() => {
                // setInsuranceOpen(false)
                navigate(".");
              }}
            />
          }
        />
        <Route
          path="bank-details/*"
          element={
            <BankDTLComp
              // rowsData={rowsData}
              open={bankCompOpen}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="credit-card/*"
          element={
            <CreditCardDTLComp
              // rowsData={rowsData}
              open={creditCardCompOpen}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="offences-details/*"
          element={
            <OffencesDTLComp
              // rowsData={rowsData}
              open={offencesCompOpen}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="asset-details/*"
          element={
            <AssetDTLComp
              // rowsData={rowsData}
              open={assetDTLCompOpen}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="financial-details/*"
          element={
            <FinancialDTLComp
              // rowsData={rowsData}
              open={financialDTLCompOpen}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="dependencies/*"
          element={
            <Dependencies
              rowsData={rowsData}
              open={contPersonCompOpen}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />

        <Route
          path="controlling-person-details/*"
          element={
            <ControllingPersonComp
              // rowsData={rowsData}
              open={contPersonCompOpen}
              onClose={() => {
                navigate(".");
              }}
            />
          }
        />
      </Routes>

      {componentToShow === "ViewDetail"
        ? ""
        : // <ViewDetail
        //   rowsData={rowsData}
        //   open={acctOpen}
        //   onClose={() => setAcctOpen(false)}
        // />
        // : componentToShow === "Dependencies" ? (
        //   <Dependencies
        //     rowsData={rowsData}
        //     open={acctOpen}
        //     onClose={() => setAcctOpen(false)}
        //   />
        // )
        componentToShow === "ViewStatement"
        ? ""
        : // <ViewStatement
          //   rowsData={rowsData}
          //   open={acctOpen}
          //   onClose={() => setAcctOpen(false)}
          //   screenFlag={"ACCT_INQ"}
          // />
          // : componentToShow === "DeactivateCustomer" ? (
          //     <DeactivateCustomer rowdata={rowsData} />
          // )
          // : componentToShow === "insurance" ? (
          //     <InsuranceComp
          //       rowsData={rowsData}
          //       open={insuranceOpen}
          //       onClose={() => setInsuranceOpen(false)}
          //     />
          // )
          //  : componentToShow === "bankDetails" ? (
          //     <BankDTLComp
          //       rowsData={rowsData}
          //       open={bankCompOpen}
          //       onClose={() => setBankCompOpen(false)}
          //     />
          // )
          // : componentToShow === "creditCard" ? (
          //     <CreditCardDTLComp
          //       rowsData={rowsData}
          //       open={creditCardCompOpen}
          //       onClose={() => setCreditCardCompOpen(false)}
          //     />
          // )
          //  : componentToShow === "offencesDetails" ? (
          //     <OffencesDTLComp
          //       rowsData={rowsData}
          //       open={offencesCompOpen}
          //       onClose={() => setOffencesCompOpen(false)}
          //     />
          // )
          // : componentToShow === "assetDetails" ? (
          //   <AssetDTLComp
          //     rowsData={rowsData}
          //     open={assetDTLCompOpen}
          //     onClose={() => setAssetDTLCompOpen(false)}
          //   />
          // )
          // : componentToShow === "financialDetails" ? (
          //     <FinancialDTLComp
          //       rowsData={rowsData}
          //       open={financialDTLCompOpen}
          //       onClose={() => setFinancialDTLCompOpen(false)}
          //     />
          // )
          // : componentToShow === "controllingPersonDTL" ? (
          //     <ControllingPersonComp
          //       rowsData={rowsData}
          //       open={contPersonCompOpen}
          //       onClose={() => setContPersonCompOpen(false)}
          //     />
          // )
          null}

      {/* <FormModal 
        // isFormModalOpen={state?.isFormModalOpenctx} 
        // handleFormModalOpen={handleFormModalOpen} 
        // handleFormModalClose={handleFormModalClose} 

        // isSidebarExpanded={state?.isSidebarExpandedctx}
        // setIsSidebarExpanded={setIsSidebarExpanded}
        // handleSidebarExpansion={handleSidebarExpansion}

        // colTabValue={colTabValue}
        // setColTabValue={setColTabValue}
        // handleColTabChange={handleColTabChange}

        isLoadingData={isLoadingData}
        setIsLoadingData={setIsLoadingData}
        isCustomerData={isCustomerData}
        setIsCustomerData={setIsCustomerData}

        // entityType={state?.entityTypectx}
        // setEntityType={setEntityType}
        
        // customerCategories={customerCategories}
        // tabsApiRes={tabsApiRes}
        
        // setTabsApiRes={setTabsApiRes}
        // categoryValue={categoryValue}
        // setCategoryValue={setCategoryValue}
        // constitutionValue={constitutionValue}
        // setConstitutionValue={setConstitutionValue}
        // accTypeValue={accTypeValue}
        // setAccTypeValue={setAccTypeValue}
        // refetch={refetch}
        // retrieveFormRefetch={retrieveFormRefetch}
      /> */}
    </React.Fragment>
  );
};
