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
  // ckyc_pending_req_meta_data,
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
import { Alert } from "components/common/alert";
import PendingCustomer from "./PendingCustomer";
import RetrieveCustomer from "./RetrieveCustomer";

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
    // handleCustCategoryRes,
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
  // const [isCustomerData, setIsCustomerData] = useState(true);
  // const [isLoadingData, setIsLoadingData] = useState(false);
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

  // const [rowsData, setRowsData] = useState<any[]>([]);
  // const [componentToShow, setComponentToShow] = useState("");
  // const [acctOpen, setAcctOpen] = useState(false);
  // const [insuranceOpen, setInsuranceOpen] = useState(true);
  // const [bankCompOpen, setBankCompOpen] = useState(true);
  // const [creditCardCompOpen, setCreditCardCompOpen] = useState(true);
  // const [offencesCompOpen, setOffencesCompOpen] = useState(true);
  // const [assetDTLCompOpen, setAssetDTLCompOpen] = useState(true);
  // const [financialDTLCompOpen, setFinancialDTLCompOpen] = useState(true);
  // const [contPersonCompOpen, setContPersonCompOpen] = useState(true);

  useEffect(() => {
    console.log(state?.retrieveFormDataApiRes, "wadqwdwq.", state?.formDatactx, "upd ->", state?.modifiedFormCols)
  }, [state?.retrieveFormDataApiRes, state?.formDatactx, state?.modifiedFormCols])
  // useEffect(() => {
  //   console.log("wadqwdwq.", state?.colTabValuectx, state?.formDatactx, state?.steps)
  // }, [state?.colTabValuectx, state?.formDatactx, state?.steps])
  // useEffect(() => {
  //   console.log(Boolean(state?.photoBase64ctx && state?.signBase64ctx), state?.retrieveFormDataApiRes, "wadqwdwq.", state?.formDatactx, "upd -> ", state?.modifiedFormCols)
  // }, [state?.photoBase64ctx, state?.signBase64ctx, state?.retrieveFormDataApiRes, state?.formDatactx, state?.modifiedFormCols])
  // useEffect(() => {
  //   console.log("wsfewiehifwef", state?.categConstitutionValuectx, state?.categoryValuectx, state?.constitutionValuectx)
  // }, [state?.categConstitutionValuectx, state?.categoryValuectx, state?.constitutionValuectx])
  // useEffect(() => {
  //   console.log(state?.retrieveFormDataApiRes, "wadqwdwq.", state?.formDatactx)
  // }, [state?.formDatactx, state?.retrieveFormDataApiRes])
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
  // const handleFormModalClose = () => {
  //   handleFormModalClosectx();
  //   // setIsFormModalOpen(false)
  //   // setEntityType(null)
  //   // setColTabValue(false)
  //   // setCategoryValue(null)
  //   // setConstitutionValue(null)
  //   // setAccTypeValue(null)
  //   // setTabsApiRes([])
  //   // // setCustomerCategories([])
  // };

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
      </StyledHeaderGrid>
      <TabPanel value={tabValue} index={0}>
        <RetrieveCustomer />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <PendingCustomer />
      </TabPanel>
    </React.Fragment>
  );
};
