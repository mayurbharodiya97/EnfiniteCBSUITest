// import { useMutation, useQuery } from "react-query";
// import { useSnackbar } from "notistack";
// import { cloneDeep } from "lodash-es";
// import * as API from "../api";
// import { DynamicGridConfigMetaData } from "./metaData";
// import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
// import { useCallback, useContext, useEffect, useRef, useState } from "react";
// import {
//   AppBar,
//   CircularProgress,
//   Grid,
//   TextField,
//   Toolbar,
//   Typography,
//   Theme,
//   Dialog,
// } from "@mui/material";
// import { GradientButton } from "components/styledComponent/button";
// import { MasterDetailsForm } from "components/formcomponent";
// import { Alert } from "components/common/alert";
// import { RetrievalParametersGrid } from "./retrievalParameters";
// import { makeStyles } from "@mui/styles";
// import { AuthContext } from "pages_audit/auth";
// import Logo from "assets/images/easy_bankcore_Logo.png";
// import { useStyles } from "pages_audit/appBar/style";
// import bank_logo_default from "assets/images/BecomePartnerImg.svg";
// import { Box, Button, Avatar, Stack } from "@mui/material";
// import { checkDateAndDisplay } from "pages_audit/appBar/appBar";
// import clsx from "clsx";
// import { queryClient } from "cache";
// import { useLocation } from "react-router-dom";
// import { ActionFormWrapper } from "./actionsform";

// const useTypeStyles = makeStyles((theme: Theme) => ({
//   root: {
//     paddingLeft: theme.spacing(1.5),
//     paddingRight: theme.spacing(1.5),
//     background: "var(--theme-color1)",
//   },
//   title: {
//     flex: "1 1 100%",
//     color: "var(--white)",
//     letterSpacing: "1px",
//     fontSize: "1.5rem",
//   },
//   refreshiconhover: {},
// }));

// interface addMasterDataType {
//   data: object;
//   displayData?: object;
//   endSubmit?: any;
//   setFieldError?: any;
//   SetLoadingOWN?: any;
// }

// const addMasterFormDataFnWrapper =
//   (addMasterFn) =>
//   async ({ data }: addMasterDataType) => {
//     return addMasterFn(data);
//   };

// const AddDynamicGridConfig = ({
//   isDataChangedRef,
//   closeDialog,
//   defaultView = "view",
//   transactionID,
// }) => {
//   const headerClasses = useTypeStyles();
//   const { enqueueSnackbar } = useSnackbar();
//   const myRef = useRef<any>(null);
//   const myVerifyCntRef = useRef(0);
//   const mySqlSyntaxRef = useRef<any>(defaultView === "add" ? false : true);
//   const myparameterDataRef = useRef<any>([]);
//   const [isLocalLoading, setLocalLoading] = useState(false);
//   const [isOpenRerieval, setIsOpenRerieval] = useState(false);
//   const [formName, setformName] = useState("");
//   const [sqlSyntax, setSqlSyntax] = useState("");
//   const mynewSqlSyntaxRef = useRef<any>("");
//   const authController = useContext(AuthContext);
//   const appBarClasses = useStyles();
//   const [isActionsForm, setActionsForm] = useState(false);
//   const myoldSqlSyntaxRef = useRef<any>("");
//   const [formMode, setFormMode] = useState(defaultView);
//   const moveToViewMode = useCallback(() => setFormMode("view"), [setFormMode]);
//   const moveToEditMode = useCallback(() => setFormMode("edit"), [setFormMode]);
//   const { authState } = useContext(AuthContext);
//   const [errorObjData, seterrorObjData] = useState({
//     isError: false,
//     error: { error_msg: "", error_detail: "" },
//   });

//   const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
//     any,
//     any
//   >(["getDynamicGridConfigData", transactionID, formMode], () =>
//     API.getDynamicGridConfigData(transactionID, formMode)
//   );
//   // const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
//   //   any,
//   //   any
//   // >(["getDynamicGridConfigGridData"], () =>
//   //   API.getDynamicGridConfigGridData({
//   //     COMP_CD: authState?.companyID ?? "",
//   //     BRANCH_CD: authState?.user?.branchCode ?? "",
//   //   })
//   // );
//   useEffect(() => {
//     return () => {
//       queryClient.removeQueries(["getDynamicGridConfigData"]);
//     };
//   }, [transactionID]);
//   const mutation = useMutation(
//     addMasterFormDataFnWrapper(API.insertMastersData()),
//     {
//       onError: (error: any, { endSubmit, SetLoadingOWN }) => {
//         SetLoadingOWN(false, error?.error_msg, error?.error_detail ?? "");
//       },
//       onSuccess: (data, { endSubmit, SetLoadingOWN }) => {
//         SetLoadingOWN(true, "");
//         isDataChangedRef.current = true;
//         enqueueSnackbar(data, {
//           variant: "success",
//         });
//         closeDialog();
//       },
//     }
//   );
//   const verifySql = useMutation(API.verifyDynGridSqlSyntax, {
//     onError: (error: any) => {},
//     onSuccess: (data) => {
//       mySqlSyntaxRef.current = true;
//       let detailData = data?.[0]?.DETAILS.map((item) => {
//         return {
//           ...item,
//           _isNewRow: true,
//         };
//       });

//       myRef.current?.setGridData(detailData);
//       myparameterDataRef.current = data?.[0]?.PARAMETERS;
//       setformName("dynDetail" + myVerifyCntRef.current);
//       myVerifyCntRef.current = myVerifyCntRef.current + 1;
//       enqueueSnackbar("Query Successfully Verified.", {
//         variant: "success",
//       });
//     },
//   });

//   const onSubmitHandler = ({
//     data,
//     resultValueObj,
//     resultDisplayValueObj,
//     endSubmit,
//     setFieldErrors,
//     actionFlag,
//   }) => {
//     if (!mySqlSyntaxRef.current) {
//       setLocalError(true, "Please Verify Query..", "");
//       endSubmit(true, "Please Verify Query..");
//       return;
//     }
//     setLocalLoading(true);
//     const SetLoadingOWN = (isLoading, error_msg = "", error_detail = "") => {
//       setLocalLoading(isLoading);
//       endSubmit(isLoading, error_msg, error_detail);
//     };

//     data.PARAMETERS = myparameterDataRef.current;
//     data.SQL_ANSI_SYNTAX = mynewSqlSyntaxRef.current;
//     mutation.mutate({ data, SetLoadingOWN, endSubmit });
//   };

//   const setLocalError = (isError, error_msg = "", error_detail = "") => {
//     seterrorObjData({
//       isError: isError,
//       error: { error_msg: error_msg, error_detail: error_detail },
//     });
//   };

//   const onCloseDialog = () => {
//     setIsOpenRerieval(false);
//   };
//   const onSaveParameters = (data) => {
//     myparameterDataRef.current = data;
//     setIsOpenRerieval(false);
//   };

//   let metadata: MasterDetailsMetaData = {} as MasterDetailsMetaData;

//   metadata = cloneDeep(DynamicGridConfigMetaData) as MasterDetailsMetaData;
//   useEffect(() => {
//     setSqlSyntax(data?.[0]?.SQL_ANSI_SYNTAX ?? "");
//     myparameterDataRef.current = data?.[0]?.PARA_DETAILS ?? [];
//     myoldSqlSyntaxRef.current = data?.[0]?.SQL_ANSI_SYNTAX ?? "";
//     mynewSqlSyntaxRef.current = data?.[0]?.SQL_ANSI_SYNTAX ?? "";
//   }, [data]);

//   return (
//     <>
//       <Grid container>
//         <AppBar
//           position="sticky"
//           color="primary"
//           // style={{ marginBottom: "10px" }}
//         >
//           <Toolbar
//             variant="dense"
//             sx={{ display: "flex", alignItems: "center" }}
//           >
//             <div>
//               <img
//                 src={Logo}
//                 alt="Netbanking"
//                 className={appBarClasses.logo}
//                 onClick={(e) => {
//                   e.preventDefault();
//                 }}
//               />
//               <p className={appBarClasses.version01}>V: 1.12.03.1</p>
//             </div>
//             <Stack direction="row" spacing={4} mx={2}>
//               <Box className={appBarClasses.heading_user_img_border}>
//                 <Avatar
//                   className={appBarClasses.heading_user_img}
//                   alt="Remy Sharp"
//                   src={bank_logo_default}
//                 />
//               </Box>
//             </Stack>
//             <Typography
//               component="h1"
//               variant="h6"
//               color="inherit"
//               noWrap
//               className={appBarClasses.title}
//             >
//               <Box
//                 style={{
//                   marginBottom: "8px",
//                   fontSize: "17px",
//                   color: "#1C1C1C",
//                   // overflowX: "auto",
//                   width: "555px",
//                 }}
//                 className={clsx({
//                   [appBarClasses.marquee]:
//                     authController?.authState?.companyName.length > 55,
//                 })}
//               >
//                 {authController?.authState?.companyName || ""}
//               </Box>
//               <div style={{ display: "flex", gap: "8px" }}>
//                 <div style={{ color: "#949597" }}>
//                   <Typography
//                     variant="caption"
//                     display="block"
//                     lineHeight={0}
//                     fontSize={"11px"}
//                   >
//                     Branch:{" "}
//                     {authController?.authState?.user?.branchCode ?? "001 "}-
//                     {authController?.authState?.user?.branch ?? ""}
//                   </Typography>
//                   <Typography
//                     variant="caption"
//                     display="inline"
//                     fontSize={"11px"}
//                   >
//                     Working Date:{" "}
//                     {checkDateAndDisplay(
//                       authController?.authState?.workingDate ?? ""
//                     )}
//                   </Typography>
//                   <Typography
//                     marginLeft={1}
//                     variant="caption"
//                     display="inline"
//                     fontSize={"11px"}
//                   >
//                     Last Login Date :{" "}
//                     {checkDateAndDisplay(
//                       authController?.authState?.user?.lastLogin ?? "Vastrapur"
//                     )}
//                   </Typography>
//                 </div>
//               </div>
//             </Typography>
//             <Typography fontSize={"17px"} color={"#1C1C1C"}>
//               {/* Greetings....{" "} */}
//               {Greetings()} {authController.authState.user.id}
//             </Typography>

//             <Button
//               color="primary"
//               // disabled={mutation.isLoading}
//             >
//               Close
//             </Button>
//           </Toolbar>
//         </AppBar>
//         <Grid
//           item
//           xs={12}
//           sm={12}
//           md={12}
//           style={{
//             paddingTop: "05px",
//             paddingLeft: "05px",
//             paddingRight: "05px",
//           }}
//         >
//           <AppBar
//             position="relative"
//             color="secondary"
//             style={{ marginBottom: "5px" }}
//           >
//             <Toolbar className={headerClasses.root} variant={"dense"}>
//               <Typography
//                 className={headerClasses.title}
//                 color="inherit"
//                 variant={"h6"}
//                 component="div"
//               >
//                 Dynamic Grid Configure
//               </Typography>
//               <GradientButton
//                 onClick={() => {
//                   setActionsForm(true);
//                 }}
//               >
//                 Actions
//               </GradientButton>
//               {formMode === "edit" ? (
//                 <>
//                   <GradientButton
//                     onClick={(event) => {
//                       myRef.current?.onSubmitHandler(event);
//                     }}
//                     // disabled={isLocalLoading}
//                     endIcon={
//                       isLocalLoading ? <CircularProgress size={20} /> : null
//                     }
//                   >
//                     Save
//                   </GradientButton>
//                   <GradientButton
//                     onClick={moveToViewMode}
//                     // disabled={isLocalLoading}
//                     color={"primary"}
//                   >
//                     Cancel
//                   </GradientButton>
//                 </>
//               ) : formMode === "view" ? (
//                 <>
//                   <GradientButton onClick={moveToEditMode}>Edit</GradientButton>
//                   <GradientButton onClick={closeDialog}>Close</GradientButton>
//                 </>
//               ) : (
//                 <>
//                   <GradientButton
//                     onClick={(event) => {
//                       myRef.current?.onSubmitHandler(event);
//                     }}
//                     endIcon={
//                       isLocalLoading ? <CircularProgress size={20} /> : null
//                     }
//                   >
//                     Save
//                   </GradientButton>
//                   <GradientButton onClick={closeDialog}>Close</GradientButton>
//                 </>
//               )}
//             </Toolbar>
//           </AppBar>
//           {mutation?.isError === true ? (
//             <>
//               <Alert
//                 severity="error"
//                 errorMsg={mutation?.error?.error_msg ?? ""}
//                 errorDetail={mutation?.error?.error_detail ?? ""}
//               />
//             </>
//           ) : null}
//         </Grid>
//         <Grid item xs={8} sm={6} md={8}>
//           <MasterDetailsForm
//             key={"dynGridConfig" + formMode}
//             formNameMaster={"dynGridConfigMaster" + formMode}
//             formName={formName + formMode}
//             metaData={metadata}
//             ref={myRef}
//             // initialData={
//             //   {
//             //     // _isNewRow: formMode === "add" ? true : false,
//             //     // ...(data?.[0] ?? {}),
//             //     // DETAILS_DATA: data?.[0]?.DETAILS ?? [],
//             //   }
//             // }
//             initialData={{ _isNewRow: true, DETAILS_DATA: [] }}
//             displayMode={formMode === "add" ? "New" : formMode}
//             isLoading={formMode === "view" ? true : isLocalLoading}
//             onSubmitData={onSubmitHandler}
//             isNewRow={formMode === "add" ? true : false}
//             containerstyle={{
//               paddingRight: "10px",
//               paddingLeft: "10px",
//               paddingTop: "5px",
//             }}
//             formStyle={{
//               background: "white",
//               height: "40vh",
//               overflowY: "auto",
//               overflowX: "hidden",
//             }}
//             hideHeader={true}
//             isError={errorObjData.isError}
//             errorObj={errorObjData.error}
//           >
//             {({ isSubmitting, handleSubmit }) => {
//               return <></>;
//             }}
//           </MasterDetailsForm>

//           {/* {formMode === "view" ? (
//           <MasterDetailsForm
//             key={"dynReportConfig" + formMode}
//             formNameMaster={"dynRptConfigMaster" + formMode}
//             formName={formName + formMode}
//             metaData={metadata}
//             ref={myRef}
//             initialData={{
//               _isNewRow: false,
//               ...data?.[0],
//               DETAILS_DATA: data?.[0]?.DETAILS,
//             }}
//             displayMode={formMode}
//             isLoading={true}
//             onSubmitData={onSubmitHandler}
//             isNewRow={false}
//             formStyle={{
//               background: "white",
//               height: "25vh",
//               overflowY: "auto",
//               overflowX: "hidden",
//             }}
//             hideHeader={true}
//           >
//             {({ isSubmitting, handleSubmit }) => {
//               return <></>;
//             }}
//           </MasterDetailsForm>
//         ) : formMode === "edit" ? (
//           <MasterDetailsForm
//             key={"dynReportConfig" + formMode}
//             formNameMaster={"dynRptConfigMaster" + formMode}
//             formName={formName + formMode}
//             metaData={metadata}
//             ref={myRef}
//             initialData={{
//               _isNewRow: false,
//               ...data?.[0],
//               DETAILS_DATA: data?.[0]?.DETAILS,
//             }}
//             displayMode={formMode}
//             isLoading={isLocalLoading}
//             onSubmitData={onSubmitHandler}
//             isNewRow={false}
//             formStyle={{
//               background: "white",
//               height: "25vh",
//               overflowY: "auto",
//               overflowX: "hidden",
//             }}
//             hideHeader={true}
//             isError={errorObjData.isError}
//             errorObj={errorObjData.error}
//           >
//             {({ isSubmitting, handleSubmit }) => {
//               return <></>;
//             }}
//           </MasterDetailsForm>
//         ) : formMode === "add" ? (
//           <MasterDetailsForm
//             key={"dynReportConfig"}
//             formNameMaster={"dynRptConfigMaster"}
//             formName={formName}
//             metaData={metadata}
//             ref={myRef}
//             initialData={{ _isNewRow: true, DETAILS_DATA: [] }}
//             displayMode={"New"}
//             isLoading={isLocalLoading}
//             onSubmitData={onSubmitHandler}
//             isNewRow={true}
//             containerstyle={{
//               paddingRight: "10px",
//               paddingLeft: "10px",
//               paddingTop: "5px",
//             }}
//             formStyle={{
//               background: "white",
//               height: "25vh",
//               overflowY: "auto",
//               overflowX: "hidden",
//             }}
//             hideHeader={true}
//             isError={errorObjData.isError}
//             errorObj={errorObjData.error}
//           >
//             {({ isSubmitting, handleSubmit }) => {
//               return <></>;
//             }}
//           </MasterDetailsForm>
//         ) : null} */}
//         </Grid>
//         <Grid item xs={4} sm={6} md={4} style={{ paddingRight: "10px" }}>
//           <Grid item xs={12} sm={12} md={12}>
//             {verifySql.isError ? (
//               <div style={{ marginBottom: "5px" }}>
//                 <AppBar position="relative" color="primary">
//                   <Alert
//                     severity="error"
//                     errorMsg={
//                       verifySql?.error?.error_msg ?? "Something went to wrong.."
//                     }
//                     errorDetail={verifySql?.error?.error_detail}
//                     color="error"
//                   />
//                 </AppBar>
//               </div>
//             ) : null}
//           </Grid>
//           <Grid item xs={12} sm={12} md={12} style={{ paddingTop: "12px" }}>
//             <TextField
//               id="outlined-multiline-static"
//               label="SQL ANSI Query Syntax"
//               multiline
//               rows={verifySql.isError ? 21 : 24}
//               // minRows={verifySql.isError ? 21 : 24}
//               value={sqlSyntax}
//               variant="outlined"
//               color="secondary"
//               style={{
//                 width: "100%",
//               }}
//               disabled={formMode === "view" ? true : false}
//               InputLabelProps={{
//                 shrink: true,
//               }}
//               onChange={(event) => {
//                 mynewSqlSyntaxRef.current = event.target.value;
//                 setSqlSyntax(event.target.value);
//                 mySqlSyntaxRef.current = false;
//               }}
//               // onBlur={(event) => {
//               //   myTextFieldPositionRef.current = event.target?.selectionStart;
//               // }}
//             />
//           </Grid>
//           <Grid container style={{ padding: "20px", placeContent: "center" }}>
//             <Grid item xs={12} sm={12} md={3}>
//               <GradientButton
//                 disabled={verifySql.isLoading}
//                 endIcon={
//                   verifySql.isLoading ? <CircularProgress size={20} /> : null
//                 }
//                 onClick={() => {
//                   if (Boolean(sqlSyntax)) {
//                     verifySql.mutate({ sqlSyntax, detailsData: [] });
//                   } else {
//                     enqueueSnackbar("Please Enter SQL Syntax.", {
//                       variant: "warning",
//                     });
//                   }
//                 }}
//               >
//                 Verify
//               </GradientButton>
//             </Grid>
//             <Grid item xs={12} sm={12} md={3}>
//               <GradientButton
//                 onClick={() => {
//                   if (!Boolean(sqlSyntax)) {
//                     enqueueSnackbar("Please Enter SQL Syntax.", {
//                       variant: "warning",
//                     });
//                   } else if (!mySqlSyntaxRef.current) {
//                     enqueueSnackbar("Please Verify SQL Syntax.", {
//                       variant: "warning",
//                     });
//                   } else {
//                     // createRetrievalMetaData(sqlSyntax);
//                     setIsOpenRerieval(true);
//                   }
//                 }}
//               >
//                 Parameters
//               </GradientButton>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>

//       {isOpenRerieval ? (
//         <RetrievalParametersGrid
//           isOpen={isOpenRerieval}
//           formMode={undefined}
//           onClose={onCloseDialog}
//           rowsData={myparameterDataRef.current}
//           onSaveData={onSaveParameters}
//         />
//       ) : null}
//       {isActionsForm ? (
//         <ActionFormWrapper
//           isOpen={isActionsForm}
//           formMode={formName}
//           onClose={() => {
//             setActionsForm(false);
//           }}
//           // reqDataRef={mysubdtlRef}
//         />
//       ) : null}
//     </>
//   );
// };

// export const AddDynamicGridConfigWrapper = ({
//   isDataChangedRef,
//   closeDialog,
//   defaultView,
// }) => {
//   const { state: data }: any = useLocation();
//   return (
//     <>
//       <Dialog
//         fullScreen={true}
//         open={true}
//         PaperProps={{
//           style: {
//             width: "100%",
//           },
//         }}
//         // maxWidth="lg"
//       >
//         <AddDynamicGridConfig
//           isDataChangedRef={isDataChangedRef}
//           closeDialog={closeDialog}
//           transactionID={data?.[0]?.data?.TRAN_CD}
//           defaultView={defaultView}
//         />
//       </Dialog>
//     </>
//   );
// };

import { useMutation, useQuery } from "react-query";
import { useSnackbar } from "notistack";
import { cloneDeep } from "lodash-es";
import * as API from "../api";
import { DynamicGridConfigMetaData } from "./metaData";
import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AppBar,
  CircularProgress,
  Grid,
  TextField,
  Toolbar,
  Typography,
  Theme,
  Dialog,
  IconButton,
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
import { Box, Button, Avatar, Stack } from "@mui/material";
import { checkDateAndDisplay } from "pages_audit/appBar/appBar";
import clsx from "clsx";
import { queryClient } from "cache";
import { useLocation } from "react-router-dom";
import { ActionFormWrapper } from "./actionsform";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
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
  formMode: string;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
  SetLoadingOWN?: any;
}

const addMasterFormDataFnWrapper =
  (addMasterFn) =>
  async ({ data, formMode }: addMasterDataType) => {
    return addMasterFn(data, formMode);
  };

const DynamicGridConfig: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  defaultView?: "view" | "edit" | "add";
  transactionID: number;
}> = ({
  isDataChangedRef,
  closeDialog,
  defaultView = "view",
  transactionID,
}) => {
  const headerClasses = useTypeStyles();
  const { enqueueSnackbar } = useSnackbar();
  const myRef = useRef<any>(null);
  const myVerifyCntRef = useRef(0);
  const mySqlSyntaxRef = useRef<any>(defaultView === "add" ? false : true);
  const myoldSqlSyntaxRef = useRef<any>("");
  const myparameterDataRef = useRef<any>([]);
  const [isLocalLoading, setLocalLoading] = useState(false);
  const [isOpenRerieval, setIsOpenRerieval] = useState(false);
  const [formName, setformName] = useState("");
  const [sqlSyntax, setSqlSyntax] = useState("");
  const mynewSqlSyntaxRef = useRef<any>("");
  const [formMode, setFormMode] = useState(defaultView);
  const moveToViewMode = useCallback(() => setFormMode("view"), [setFormMode]);
  const moveToEditMode = useCallback(() => setFormMode("edit"), [setFormMode]);
  const authController = useContext(AuthContext);
  const appBarClasses = useStyles();
  const [isActionsForm, setActionsForm] = useState(false);
  const [errorObjData, seterrorObjData] = useState({
    isError: false,
    error: { error_msg: "", error_detail: "" },
  });

  const { data, isLoading, isError, error } = useQuery<any, any>(
    ["getDynamicReportConfigData", transactionID],
    () => API.getDynamicGridConfigData(transactionID, formMode)
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getDynamicReportConfigData", transactionID]);
    };
  }, [transactionID]);

  const mutation = useMutation(
    addMasterFormDataFnWrapper(API.dynamicGridConfigDML()),
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
  const verifySql = useMutation(API.verifyDynGridSqlSyntax, {
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
      setLocalError(false, "", "");
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
    setLocalLoading(true);
    const SetLoadingOWN = (isLoading, error_msg = "", error_detail = "") => {
      setLocalLoading(isLoading);
      endSubmit(isLoading, error_msg, error_detail);
    };

    data.PARAMETERS = myparameterDataRef.current;
    // data.SQL_ANSI_SYNTAX = mynewSqlSyntaxRef.current;
    data["DISABLE_GROUP_BY"] = Boolean(data["DISABLE_GROUP_BY"]) ? "Y" : "N";
    data["HIDE_AMOUNT_IN"] = Boolean(data["HIDE_AMOUNT_IN"]) ? "Y" : "N";
    data["HIDE_FOOTER"] = Boolean(data["HIDE_FOOTER"]) ? "Y" : "N";
    data["ACTIVE"] = Boolean(data["ACTIVE"]) ? "Y" : "N";

    if (mynewSqlSyntaxRef.current !== myoldSqlSyntaxRef.current) {
      data["SQL_ANSI_SYNTAX"] = mynewSqlSyntaxRef.current;
      data["_OLDROWVALUE"] = {
        ...data["_OLDROWVALUE"],
        SQL_ANSI_SYNTAX: myoldSqlSyntaxRef.current,
      };
      data["_UPDATEDCOLUMNS"] = [...data["_UPDATEDCOLUMNS"], "SQL_ANSI_SYNTAX"];
    } else {
      data["SQL_ANSI_SYNTAX"] = myoldSqlSyntaxRef.current;
    }

    mutation.mutate({
      data,
      SetLoadingOWN,
      endSubmit,
      formMode,
    });
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

  metadata = cloneDeep(DynamicGridConfigMetaData) as MasterDetailsMetaData;

  useEffect(() => {
    setSqlSyntax(data?.[0]?.SQL_ANSI_SYNTAX ?? "");
    myparameterDataRef.current = data?.[0]?.PARA_DETAILS ?? [];
    myoldSqlSyntaxRef.current = data?.[0]?.SQL_ANSI_SYNTAX ?? "";
    mynewSqlSyntaxRef.current = data?.[0]?.SQL_ANSI_SYNTAX ?? "";
  }, [data]);

  return (
    <>
      {isLoading ? (
        <div style={{ margin: "2rem" }}>
          <LoaderPaperComponent />
          {typeof closeDialog === "function" ? (
            <div style={{ position: "absolute", right: 0, top: 0 }}>
              <IconButton onClick={closeDialog}>
                <HighlightOffOutlinedIcon />
              </IconButton>
            </div>
          ) : null}
        </div>
      ) : isError === true ? (
        <>
          <div style={{ margin: "1.2rem" }}>
            <Alert
              severity="error"
              errorMsg={error?.error_msg ?? ""}
              errorDetail={error?.error_detail ?? ""}
            />
          </div>
        </>
      ) : (
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
                        authController?.authState?.user?.lastLogin ??
                          "Vastrapur"
                      )}
                    </Typography>
                  </div>
                </div>
              </Typography>
              <Typography fontSize={"17px"} color={"#1C1C1C"}>
                {/* Greetings....{" "} */}
                {Greetings()} {authController.authState.user.id}
              </Typography>

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
                  Dynamic Report Configure
                </Typography>
                <GradientButton
                  onClick={() => {
                    setActionsForm(true);
                  }}
                >
                  Actions
                </GradientButton>
                {formMode === "edit" ? (
                  <>
                    <GradientButton
                      onClick={(event) => {
                        myRef.current?.onSubmitHandler(event);
                      }}
                      // disabled={isLocalLoading}
                      endIcon={
                        isLocalLoading ? <CircularProgress size={20} /> : null
                      }
                    >
                      Save
                    </GradientButton>
                    <GradientButton
                      onClick={moveToViewMode}
                      // disabled={isLocalLoading}
                      color={"primary"}
                    >
                      Cancel
                    </GradientButton>
                  </>
                ) : formMode === "view" ? (
                  <>
                    <GradientButton onClick={moveToEditMode}>
                      Edit
                    </GradientButton>
                    <GradientButton onClick={closeDialog}>Close</GradientButton>
                  </>
                ) : (
                  <>
                    <GradientButton
                      onClick={(event) => {
                        myRef.current?.onSubmitHandler(event);
                      }}
                      endIcon={
                        isLocalLoading ? <CircularProgress size={20} /> : null
                      }
                    >
                      Save
                    </GradientButton>
                    <GradientButton onClick={closeDialog}>Close</GradientButton>
                  </>
                )}
              </Toolbar>
            </AppBar>
            {mutation?.isError ? (
              <>
                <Alert
                  severity="error"
                  errorMsg={mutation?.error?.error_msg ?? ""}
                  errorDetail={mutation?.error?.error_detail ?? ""}
                />
              </>
            ) : null}
          </Grid>
          <Grid item xs={8} sm={6} md={8}>
            <MasterDetailsForm
              key={"dynGridConfig" + formMode}
              formNameMaster={"dynGridConfig" + formMode}
              formName={formName + formMode}
              metaData={metadata}
              ref={myRef}
              // initialData={{
              //   _isNewRow: formMode === "add" ? true : false,
              //   ...(data?.[0] ?? {}),
              //   DETAILS_DATA: data?.[0]?.DETAILS ?? [],
              // }}
              initialData={{ _isNewRow: true, DETAILS_DATA: [] }}
              displayMode={formMode === "add" ? "New" : formMode}
              isLoading={formMode === "view" ? true : isLocalLoading}
              onSubmitData={onSubmitHandler}
              isNewRow={formMode === "add" ? true : false}
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
                        verifySql?.error?.error_msg ??
                        "Something went to wrong.."
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
                rows={verifySql.isError ? 21 : 24}
                // minRows={verifySql.isError ? 21 : 24}
                value={sqlSyntax}
                variant="outlined"
                color="secondary"
                style={{
                  width: "100%",
                }}
                disabled={formMode === "view" ? true : false}
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
                  Parameter
                </GradientButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
      {isActionsForm ? (
        <ActionFormWrapper
          isOpen={isActionsForm}
          formMode={formName}
          onClose={() => {
            setActionsForm(false);
          }}
          // reqDataRef={mysubdtlRef}
        />
      ) : null}
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

export const DynamicGridConfigWrapper = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
}) => {
  const { state: data }: any = useLocation();
  return (
    <Dialog
      open={true}
      fullScreen={true}
      PaperProps={{
        style: {
          width: "100%",
        },
      }}
      maxWidth="lg"
    >
      <DynamicGridConfig
        isDataChangedRef={isDataChangedRef}
        closeDialog={closeDialog}
        defaultView={defaultView}
        transactionID={data?.[0]?.data?.TRAN_CD}
      />
    </Dialog>
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
