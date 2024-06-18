import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Dialog } from "@mui/material";
import { AccountInquiryMetadata, AccountInquiryGridMetaData } from "./metaData";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GridMetaDataType } from "components/dataTable/types";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes } from "components/dataTable";
import { useMutation } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { ViewStatement } from "./viewStatement";
import * as API from "./api";
import { AccDetailContext, AuthContext } from "pages_audit/auth";
import { SubmitFnType } from "packages/form";
import { Alert } from "components/common/alert";
import { GradientButton } from "components/styledComponent/button";
import Dependencies from "./dependencies";
import * as CommonApi from "../pages/operations/DailyTransaction/TRNCommon/api";
import { enqueueSnackbar } from "notistack";
import { DailyTransTabsWithDialog } from "pages_audit/pages/operations/DailyTransaction/TRNHeaderTabs/DailyTransTabs";
import { queryClient } from "cache";
import { t } from "i18next";

// import { Dialog } from "@mui/material";
const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "dependencies",
    actionLabel: "Dependencies",
    multiple: false,
    rowDoubleClick: false,
  },
  {
    actionName: "view-statement",
    actionLabel: "View Statement",
    multiple: false,
    rowDoubleClick: false,
  },
  {
    actionName: "view-interest",
    actionLabel: "View Interest",
    multiple: false,
    rowDoubleClick: false,
  },
];
export const Accountinquiry = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rowsData, setRowsData] = useState<any>([]);
  const [selectedRowsData, setSelectedRowsData] = useState<any>([]);
  const [acctOpen, setAcctOpen] = useState(false);
  const [componentToShow, setComponentToShow] = useState("");
  const [showGridData, setShowGridData] = useState(false);
  const formRef = useRef<any>(null);
  const formbtnRef = useRef<any>(null);
  const rowsDataRef = useRef<any>(null);
  const { authState }: any = useContext(AuthContext);
  const { cardStore, setCardStore } = useContext(AccDetailContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  // const { t } = useTranslation();
  interface InsertFormDataFnType {
    data: object;
    displayData?: object;
    endSubmit?: any;
    setFieldError?: any;
  }
  const mutation: any = useMutation(API.getAccountInquiry, {
    onSuccess: () => {},
    onError: () => {},
  });

  // let finalTabsData;
  // let cardsData;

  // const handleApiSuccess = (rowData) => {
  //   if (finalTabsData !== undefined && cardsData !== undefined) {
  //     openInNewWindow({
  //       tabsData: finalTabsData,
  //       cardsData: cardsData,
  //       rowsData: rowData,
  //     });
  //   }
  // };

  const setCurrentAction = useCallback(
    (data) => {
      if (data.name === "view-detail") {
        setComponentToShow("ViewDetail");
        setAcctOpen(true);
        setRowsData(data?.rows);
        setSelectedRowsData(data?.rows);
        rowsDataRef.current = data?.rows?.[0]?.data;
        // openInNewWindow();
      } else if (data.name === "dependencies") {
        setComponentToShow("Dependencies");
        setAcctOpen(true);
        setRowsData(data?.rows);
      } else if (data.name === "view-statement") {
        setComponentToShow("ViewStatement");
        setAcctOpen(true);
        setRowsData(data?.rows);
      } else if (data.name === "view-interest") {
        setComponentToShow("ViewInterest");
        setAcctOpen(true);
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  // useEffect(() => {
  //   console.log(
  //     componentToShow,
  //     "olwshefoiwehfowuef",
  //     getTabsByParentType.data,
  //     getCarousalCards.data
  //   );
  //   if (
  //     componentToShow === "ViewDetail" &&
  //     !getTabsByParentType.isLoading &&
  //     getTabsByParentType.data &&
  //     !getCarousalCards.isLoading &&
  //     getCarousalCards.data
  //   ) {
  //     console.log(cardStore, "cardStore");
  //   }
  // }, [
  //   componentToShow,
  //   getTabsByParentType.isLoading,
  //   getCarousalCards.isLoading,
  // ]);

  // const openInNewWindow = (data) => {
  //   const componentURL = "/cbsenfinity/searching";
  //   const screenWidth = window.screen.width;
  //   const screenHeight = window.screen.height;

  //   // Data to be passed to the new window

  //   const rowInfo = data?.rowsData;
  //   const finalRowsData = { ...rowInfo, COMP_CD: authState?.companyID };
  //   const dataToSend = {
  //     tabsData: data?.tabsData,
  //     cardStore: data?.cardsData,
  //     rowsData: finalRowsData,
  //   };

  //   // Define the features of the new window (full screen with specified width and height)
  //   const windowFeatures = `width=${screenWidth},height=${screenHeight},fullscreen=yes`;

  //   // Open the new window
  //   const newWindow = window.open(componentURL, "_blank", windowFeatures);

  //   let isOpened = false;

  //   if (newWindow) {
  //     //@ts-ignore
  //     window._parentFuntion = () => {
  //       if (isOpened) return;
  //       //@ts-ignore
  //       newWindow.window?._childFunction?.(dataToSend);

  //       newWindow.focus();
  //       isOpened = true;
  //     };
  //   }
  // };

  const onSubmitHandler: SubmitFnType = (data: any, displayData, endSubmit) => {
    if (
      !Boolean(data?.MOBILE) &&
      !Boolean(data?.CUSTOMER) &&
      !Boolean(data?.ACCOUNT) &&
      !Boolean(data?.PAN) &&
      !Boolean(data?.NAME)
    ) {
      //@ts-ignore
      endSubmit(true, t("PleaseEnterAnyValue"));
      setShowGridData(true);
    } else {
      //@ts-ignore
      setShowGridData(false);
      endSubmit(true);
      const payload = { ...data, COMP_CD: authState?.companyID };
      mutation.mutate(payload);
    }
  };
  const ClickEventManage = () => {
    let event: any = { preventDefault: () => {} };
    formRef?.current?.handleSubmit(event, "BUTTON_CLICK");
  };

  const handleClose = () => {
    setAcctOpen(false);
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth={true}
        PaperProps={{
          style: {
            maxWidth: "1150px",
          },
        }}
      >
        {mutation.isError && (
          <Alert
            severity={mutation.error?.severity ?? "error"}
            errorMsg={mutation.error?.error_msg ?? "Something went to wrong.."}
            errorDetail={mutation.error?.error_detail}
            color="error"
          />
        )}
        <div
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              let target: any = e?.target;
              if (target?.value) {
                ClickEventManage();
              }
            }
          }}
        >
          <FormWrapper
            key={`MerchantOnboardConfig`}
            metaData={AccountInquiryMetadata as MetaDataType}
            initialValues={[]}
            onSubmitHandler={onSubmitHandler}
            formStyle={{
              background: "white",
            }}
            onFormButtonClickHandel={() => {
              let event: any = { preventDefault: () => {} };
              formRef?.current?.handleSubmit(event, "BUTTON_CLICK");
            }}
            // onFormButtonCicular={mutation.isLoading}
            ref={formRef}
          >
            {() => (
              <>
                <GradientButton
                  onClick={() => {
                    //   isSubmitEventRef.current = event;
                    // handleSubmit(event, "Save");
                    onClose();
                  }}
                  // disabled={isSubmitting}
                  // endIcon={
                  //   isSubmitting ? <CircularProgress size={20} /> : null
                  // }
                  color={"primary"}
                  ref={formbtnRef}
                  endicon="CancelOutlined"
                  rotateIcon="scale(1.4) rotate(360deg)"
                  sx={{
                    background: "transparent !important",
                    color: "var(--theme-color2) !important",
                    boxShadow: "none !important",
                    fontSize: "14px",
                    "&:hover": {
                      background: "rgba(235, 237, 238, 0.45) !important",
                      // color: "var(--theme-color2) !important",
                      // border: "1.5px solid var(--theme-color2)",
                      transition: "all 1s ease 0s",
                      "& .MuiSvgIcon-root": {
                        transform: "scale(1.4) rotateY(360deg)",
                        transition: "transform 2s ease-in-out",
                      },
                    },
                  }}
                >
                  {t("Close")}
                </GradientButton>
              </>
            )}
          </FormWrapper>
        </div>
        <GridWrapper
          key={`customerSearchingGrid`}
          finalMetaData={AccountInquiryGridMetaData as GridMetaDataType}
          data={showGridData ? [] : mutation.data ?? []}
          setData={() => null}
          loading={mutation.isLoading}
          actions={actions}
          setAction={setCurrentAction}
          headerToolbarStyle={{
            fontSize: "1.20rem",
          }}
          // refetchData={() => {}}
          // ref={myGridRef}
        />
        {componentToShow === "ViewDetail" && Boolean(acctOpen) ? (
          <DailyTransTabsWithDialog
            handleClose={handleClose}
            rowsData={rowsData}
            setRowsData={setRowsData}
          />
        ) : // <ViewDetail
        //   rowsData={rowsData}
        //   open={acctOpen}
        //   onClose={() => setAcctOpen(false)}
        // />

        // <Dialog open={acctOpen} fullScreen onClose={handleClose}>
        //   <DialogTitle
        //     sx={{
        //       display: "flex",
        //       justifyContent: "space-between",
        //       background: "var(--theme-color5)",
        //       margin: "10px 10px 0px 10px",
        //       alignItems: "center",
        //       height: "7vh",
        //       boxShadow:
        //         "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
        //     }}
        //   >
        //     <Typography
        //       sx={{
        //         fontWeight: 500,
        //         fontSize: "1.25rem",
        //         lineHeight: 1.6,
        //         letterSpacing: "0.0075em",
        //         color: "#fff",
        //       }}
        //     >
        //       {`Account Details For Customer ID : ${
        //         (rowsData as any)?.[0]?.data?.CUSTOMER_ID
        //       }`}
        //     </Typography>
        //     <GradientButton onClick={handleClose} color="primary">
        //       Close
        //     </GradientButton>
        //   </DialogTitle>
        //   {Boolean(getCarousalCards.isLoading) ||
        //   Boolean(getTabsByParentType.isLoading) ? (
        //     <LinearProgress sx={{ margin: "0px 10px" }} color="secondary" />
        //   ) : null}
        //   <DialogContent>
        //     <DailyTransTabs heading="" tabsData={tabsData} />
        //   </DialogContent>
        // </Dialog>

        // <Routes>
        //   <Route
        //     path="./searching"
        //     element={<DailyTransTabs heading={""} tabsData={[]} />}
        //   />
        // </Routes>

        componentToShow === "Dependencies" ? (
          <Dependencies
            rowsData={rowsData}
            open={acctOpen}
            onClose={() => setAcctOpen(false)}
          />
        ) : componentToShow === "ViewStatement" ? (
          <ViewStatement
            rowsData={rowsData}
            open={acctOpen}
            onClose={() => setAcctOpen(false)}
            screenFlag={"ACCT_INQ"}
          />
        ) : //   componentToShow === "ViewInterest" ? (
        // <ViewInterest open={acctOpen} onClose={() => setAcctOpen(false)} />
        // ) :
        null}
      </Dialog>
    </>
  );
};
