import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType, ActionTypes } from "components/dataTable/types";
import { FDDetailGridMetaData } from "./fdDetailgridMetaData";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { FDRetriveForm } from "./fixDepositForm/fdRetriveForm";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FixDepositForm } from "./fixDepositForm/fdStepperForm";
import { useMutation } from "react-query";
import * as API from "./api";
import { enqueueSnackbar } from "notistack";
import { usePopupContext } from "components/custom/popupContext";
import { PaidFDGrid } from "./paidFDGrid";
import { Dialog, Paper } from "@mui/material";
import { ViewMasterForm } from "./fixDepositForm/viewMasterForm";
import { FDContext } from "./context/fdContext";
import { FDDetailForm } from "./fixDepositForm/fdDetailForm";
import { AuthContext } from "pages_audit/auth";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { utilFunction } from "components/utils";
import { IntPaidDtlGrid } from "./intPaidDtlGrid";
import Draggable from "react-draggable";
import JointDetails from "../DailyTransaction/TRNHeaderTabs/JointDetails";
import Document from "../DailyTransaction/TRNHeaderTabs/Document";
import { isValidDate } from "components/utils/utilFunctions/function";
import { format } from "date-fns";
import { FDPayment } from "./fixDepositForm/fdPayment";

export const FDDetailGrid = () => {
  const {
    FDState,
    updateFDDetailsFormData,
    updateRetrieveFormData,
    resetAllData,
    updateViewDtlGridData,
    setActiveStep,
    updateCheckAllowFDPayApiData,
    updatePrematureRateData,
  } = useContext(FDContext);
  const [openFDPmtBtns, setOpenFDPmtBtns] = useState(false);
  const [openIntPayment, setOpenIntPayment] = useState(false);
  const [openDetailForm, setOpenDetailForm] = useState(false);
  const [displayAllActions, setDisplayAllActions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDataChangedRef = useRef(false);
  const initialRender = useRef(true);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const paramDataRef: any = useRef({});
  const { authState } = useContext(AuthContext);
  let currentPath = useLocation().pathname;

  const actions: ActionTypes[] = !Boolean(displayAllActions)
    ? [
        {
          actionName: "retrieve",
          actionLabel: "Retrieve",
          multiple: undefined,
          alwaysAvailable: true,
        },
      ]
    : [
        {
          actionName: "view-master",
          actionLabel: "View Master",
          multiple: undefined,
          alwaysAvailable: true,
        },
        {
          actionName: "paid-fd",
          actionLabel: "Paid FD",
          multiple: undefined,
          alwaysAvailable: true,
        },
        {
          actionName: "joint-dtl",
          actionLabel: "Joint",
          multiple: undefined,
          alwaysAvailable: true,
        },
        {
          actionName: "int-paid-dtl",
          actionLabel: "Int Paid Dtl",
          multiple: undefined,
          alwaysAvailable: true,
        },
        {
          actionName: "docs",
          actionLabel: "Docs",
          multiple: undefined,
          alwaysAvailable: true,
        },
        {
          actionName: "add",
          actionLabel: "New FD",
          multiple: undefined,
          alwaysAvailable: true,
        },
        {
          actionName: "retrieve",
          actionLabel: "Retrieve",
          multiple: undefined,
          alwaysAvailable: true,
        },
        {
          actionName: "view-details",
          actionLabel: "View Detail",
          multiple: false,
          rowDoubleClick: true,
        },
        {
          actionName: "payment/renew",
          actionLabel: "Payment/Renew",
          multiple: false,
          rowDoubleClick: false,
        },
        {
          actionName: "int-payment",
          actionLabel: "Int. Payment",
          multiple: false,
          rowDoubleClick: false,
        },
      ];

  useEffect(() => {
    paramDataRef.current = {
      ...FDState?.acctNoData,
      ...FDState?.fdParaDetailData,
    };
  }, [FDState?.acctNoData?.AC_STATUS, FDState?.fdParaDetailData?.SPL_AMT]);

  //Mutation for get View Detail grid data
  const getFDViewDtlMutation: any = useMutation(
    "getFDViewDtl",
    API.getFDViewDtl,
    {
      onError: async (error: any) => {
        let errorMsg = "Unknownerroroccured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        await MessageBox({
          messageTitle: "ERROR",
          message: errorMsg ?? "",
          icon: "ERROR",
        });
        CloseMessageBox();
      },
      onSuccess: (data) => {
        setDisplayAllActions(true);
        updateViewDtlGridData(data);
        CloseMessageBox();
      },
    }
  );

  //Mutation for allow modify data
  const checkAllowModifyFDDataMutation: any = useMutation(
    "checkAllowModifyFDData",
    API.checkAllowModifyFDData,
    {
      onError: async (error: any) => {
        let errorMsg = "Unknownerroroccured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        await MessageBox({
          messageTitle: "ERROR",
          message: errorMsg ?? "",
          icon: "ERROR",
        });
        CloseMessageBox();
      },
      onSuccess: () => {},
    }
  );

  //Mutation for allow FD payment
  const checkAllowFDPayMutation: any = useMutation(
    "checkAllowFDPay",
    API.checkAllowFDPay,
    {
      onError: async (error: any) => {
        let errorMsg = "Unknownerroroccured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        await MessageBox({
          messageTitle: "ERROR",
          message: errorMsg ?? "",
          icon: "ERROR",
        });
        CloseMessageBox();
      },
      onSuccess: () => {},
    }
  );

  //Mutation for premature rate
  const getPrematureRateMutation: any = useMutation(
    "getPrematureRate",
    API.getPrematureRate,
    {
      onError: async (error: any) => {
        let errorMsg = "Unknownerroroccured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        await MessageBox({
          messageTitle: "ERROR",
          message: errorMsg ?? "",
          icon: "ERROR",
        });
        CloseMessageBox();
      },
      onSuccess: (data) => {
        updatePrematureRateData(data?.[0]);
        setOpenFDPmtBtns(true);
      },
    }
  );

  const setCurrentAction = useCallback(
    async (data) => {
      const actionData = data;
      const reqParam = {
        A_COMP_CD: data?.rows?.[0]?.data?.COMP_CD ?? "",
        A_BRANCH_CD: data?.rows?.[0]?.data?.BRANCH_CD ?? "",
        A_ACCT_TYPE: data?.rows?.[0]?.data?.ACCT_TYPE ?? "",
        A_ACCT_CD: data?.rows?.[0]?.data?.ACCT_CD ?? "",
        A_FD_NO: data?.rows?.[0]?.data?.FD_NO ?? "",
        A_LEAN_FLAG: data?.rows?.[0]?.data?.LEAN_FLAG ?? "",
        A_MATURITY_DT: isValidDate(data?.rows?.[0]?.data?.MATURITY_DT)
          ? format(new Date(data?.rows?.[0]?.data?.MATURITY_DT), "dd/MMM/yyyy")
          : "",
        A_TRAN_DT: isValidDate(data?.rows?.[0]?.data?.TRAN_DT)
          ? format(new Date(data?.rows?.[0]?.data?.TRAN_DT), "dd/MMM/yyyy")
          : "",
        A_BASE_BRANCH: authState?.user?.baseBranchCode ?? "",
        A_SCREEN_REF: "RPT/401",
        WORKING_DATE: authState?.workingDate ?? "",
        USERROLE: authState?.role ?? "",
        USERNAME: authState?.user?.id ?? "",
        A_PRIN_AMT: data?.rows?.[0]?.data?.TOT_AMT ?? "",
        A_INT_RATE: data?.rows?.[0]?.data?.INT_RATE ?? "",
        A_SPL_AMT: paramDataRef?.current?.SPL_AMT ?? "",
        COMP_CD: data?.rows?.[0]?.data?.COMP_CD ?? "",
        LOGIN_COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: data?.rows?.[0]?.data?.BRANCH_CD ?? "",
        LOGIN_BRANCH_CD: authState?.user?.branchCode ?? "",
        ACCT_TYPE: data?.rows?.[0]?.data?.ACCT_TYPE ?? "",
        ACCT_CD: data?.rows?.[0]?.data?.ACCT_CD ?? "",
        WORKING_DT: authState?.workingDate ?? "",
        USER_NM: authState?.user?.id ?? "",
        USER_LEVEL: authState?.role ?? "",
        FD_NO: data?.rows?.[0]?.data?.FD_NO ?? "",
        CONFIRMED: data?.rows?.[0]?.data?.CONFIRMED ?? "",
        LAST_ENT_BY: data?.rows?.[0]?.data?.LAST_ENTERED_BY ?? "",
        DOC_CD: "RPT/401",
        STATUS: paramDataRef?.current?.AC_STATUS ?? "",
      };

      if (data.name === "retrieve") {
        resetAllData();
        setDisplayAllActions(false);
        navigate("retrieve");
      } else if (data.name === "paid-fd") {
        navigate("paid-fd");
      } else if (data.name === "int-paid-dtl") {
        navigate("int-paid-dtl");
      } else if (data.name === "joint-dtl") {
        navigate("joint-dtl");
      } else if (data.name === "view-master") {
        navigate("view-master");
      } else if (data.name === "docs") {
        navigate("docs");
      } else if (data?.name === "view-details") {
        checkAllowModifyFDDataMutation.mutate(
          {
            ...reqParam,
          },
          {
            onSuccess: async (data) => {
              const allowModifyMutData = data[0];
              if (allowModifyMutData?.O_STATUS === "999") {
                await MessageBox({
                  messageTitle: "Validation Failed",
                  message: allowModifyMutData?.O_MESSAGE ?? "",
                  icon: "ERROR",
                });
              } else {
                navigate(actionData?.name, {
                  state: actionData?.rows,
                });
              }
              CloseMessageBox();
            },
          }
        );
      } else if (data?.name === "payment/renew") {
        checkAllowFDPayMutation.mutate(
          {
            ...reqParam,
            A_FLAG: "P",
          },
          {
            onSuccess: async (data) => {
              const checkAllowFDPayData = data;
              updateCheckAllowFDPayApiData(checkAllowFDPayData?.[0]);

              for (const obj of checkAllowFDPayData) {
                if (obj?.O_STATUS === "999") {
                  await MessageBox({
                    messageTitle: "ValidationFailed",
                    message: obj?.O_MESSAGE,
                    icon: "ERROR",
                  });
                } else if (obj?.O_STATUS === "9") {
                  await MessageBox({
                    messageTitle: "validationAlert",
                    message: obj?.O_MESSAGE ?? "",
                    icon: "WARNING",
                  });
                } else if (obj?.O_STATUS === "99") {
                  const buttonName = await MessageBox({
                    messageTitle: "Confirmation",
                    message: obj?.O_MESSAGE ?? "",
                    buttonNames: ["Yes", "No"],
                  });
                  if (buttonName === "No") {
                    break;
                  }
                } else if (obj?.O_STATUS === "0") {
                  if (obj?.IS_PREMATURE === "Y") {
                    getPrematureRateMutation.mutate({
                      ...reqParam,
                    });
                    navigate(actionData?.name, {
                      state: actionData?.rows,
                    });
                  } else {
                    navigate(actionData?.name, {
                      state: actionData?.rows,
                    });
                    setOpenFDPmtBtns(true);
                  }
                }
              }
              CloseMessageBox();
            },
          }
        );
      } else if (data?.name === "int-payment") {
        checkAllowFDPayMutation.mutate(
          {
            ...reqParam,
            A_FLAG: "I",
          },
          {
            onSuccess: async (data) => {
              const checkAllowFDPayData = data;
              updateCheckAllowFDPayApiData(checkAllowFDPayData?.[0]);

              for (const obj of checkAllowFDPayData) {
                if (obj?.O_STATUS === "999") {
                  await MessageBox({
                    messageTitle: "ValidationFailed",
                    message: obj?.O_MESSAGE,
                    icon: "ERROR",
                  });
                } else if (obj?.O_STATUS === "9") {
                  await MessageBox({
                    messageTitle: "validationAlert",
                    message: obj?.O_MESSAGE ?? "",
                    icon: "WARNING",
                  });
                } else if (obj?.O_STATUS === "99") {
                  const buttonName = await MessageBox({
                    messageTitle: "Confirmation",
                    message: obj?.O_MESSAGE ?? "",
                    buttonNames: ["Yes", "No"],
                  });
                  if (buttonName === "No") {
                    break;
                  }
                } else if (obj?.O_STATUS === "0") {
                  if (obj?.IS_PREMATURE === "Y") {
                    getPrematureRateMutation.mutate({
                      ...reqParam,
                    });
                    navigate(actionData?.name, {
                      state: actionData?.rows,
                    });
                  } else {
                    navigate(actionData?.name, {
                      state: actionData?.rows,
                    });
                    setOpenIntPayment(true);
                  }
                }
              }
              CloseMessageBox();
            },
          }
        );
      } else if (data?.name === "add") {
        navigate(data?.name, {
          state: [],
        });
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  const handleDialogClose = useCallback(() => {
    updateFDDetailsFormData([
      {
        ACCT_NAME: "",
      },
    ]);
    setActiveStep(0);
    setOpenDetailForm(false);
    setOpenFDPmtBtns(false);
    setOpenIntPayment(false);
    navigate(".");
    if (isDataChangedRef.current === true) {
      const reqParam = {
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: FDState?.retrieveFormData?.BRANCH_CD ?? "",
        ACCT_TYPE: FDState?.retrieveFormData?.ACCT_TYPE ?? "",
        ACCT_CD:
          utilFunction.getPadAccountNumber(
            FDState?.retrieveFormData?.ACCT_CD,
            FDState?.retrieveFormData?.ACCT_TYPE
          ) ?? "",
        WORKING_DT: authState?.workingDate ?? "",
      };
      getFDViewDtlMutation?.mutate(reqParam);
      isDataChangedRef.current = false;
    }
  }, [navigate]);

  useEffect(() => {
    navigate("retrieve");
  }, []);

  //Grid Header title
  const label = utilFunction?.getDynamicLabel(
    currentPath,
    authState?.menulistdata,
    true
  );
  FDDetailGridMetaData.gridConfig.gridLabel = Boolean(displayAllActions)
    ? label +
      " " +
      `of A/c No.: ${FDState?.retrieveFormData?.BRANCH_CD?.trim() ?? ""}-${
        FDState?.retrieveFormData?.ACCT_TYPE?.trim() ?? ""
      }-${FDState?.retrieveFormData?.ACCT_CD?.trim() ?? ""} ${
        FDState?.retrieveFormData?.ACCT_NM?.trim() ?? ""
      }`
    : label;

  return (
    <>
      {(checkAllowModifyFDDataMutation.isLoading ||
        checkAllowFDPayMutation.isLoading ||
        getPrematureRateMutation.isLoading) && (
        <Dialog open={true} fullWidth={true}>
          <LoaderPaperComponent size={30} />
        </Dialog>
      )}

      <GridWrapper
        key={
          "fdDetailGrid" +
          Object.keys(FDState?.retrieveFormData).length +
          FDState?.viewDtlGridData?.length +
          displayAllActions
        }
        finalMetaData={FDDetailGridMetaData as GridMetaDataType}
        data={FDState?.viewDtlGridData ?? []}
        setData={() => null}
        loading={getFDViewDtlMutation?.isLoading}
        actions={actions}
        setAction={setCurrentAction}
        onClickActionEvent={async (index, id, data) => {
          if (id === "LEAN_FLAG") {
            updateFDDetailsFormData([
              { ...data, LEAN_COMP_CD: authState?.companyID ?? "" },
            ]);
            const buttonName = await MessageBox({
              messageTitle: "Confirmation",
              message: "Are you sure to Lift lien from this FD?",
              buttonNames: ["Yes", "No"],
              defFocusBtnName: "Yes",
            });
            if (buttonName === "Yes") {
              setOpenDetailForm(true);
            }
          }
        }}
      />

      <Routes>
        <Route
          path="add/*"
          element={
            <FixDepositForm
              isDataChangedRef={isDataChangedRef}
              handleDialogClose={handleDialogClose}
              defaultView={"new"}
            />
          }
        />
        <Route
          path="view-details/*"
          element={
            <Dialog
              open={true}
              fullWidth={true}
              PaperProps={{
                style: {
                  width: "100%",
                },
              }}
              maxWidth="xl"
            >
              <FDDetailForm
                handleDialogClose={handleDialogClose}
                defaultView={"view"}
                isDataChangedRef={isDataChangedRef}
              />
            </Dialog>
          }
        />
        <Route
          path="joint-dtl/*"
          element={
            <Dialog
              open={true}
              fullWidth={true}
              PaperProps={{
                style: {
                  width: "100%",
                },
              }}
              maxWidth="lg"
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
                    COMP_CD: authState?.companyID ?? "",
                    BRANCH_CD: FDState?.retrieveFormData?.BRANCH_CD ?? "",
                    ACCT_TYPE: FDState?.retrieveFormData?.ACCT_TYPE ?? "",
                    ACCT_CD: FDState?.retrieveFormData?.ACCT_CD ?? "",
                    ACCT_NM: FDState?.retrieveFormData?.ACCT_NM ?? "",
                    BTN_FLAG: "Y",
                  }}
                />
              </div>
            </Dialog>
          }
        />

        <Route
          path="view-master/*"
          element={<ViewMasterForm handleDialogClose={handleDialogClose} />}
        />
        <Route
          path="paid-fd/*"
          element={<PaidFDGrid handleDialogClose={handleDialogClose} />}
        />
        <Route
          path="int-paid-dtl/*"
          element={<IntPaidDtlGrid handleDialogClose={handleDialogClose} />}
        />
        <Route
          path="retrieve/*"
          element={
            <FDRetriveForm
              handleDialogClose={handleDialogClose}
              getFDViewDtlMutation={getFDViewDtlMutation}
            />
          }
        />
        <Route
          path="docs/*"
          element={
            <Dialog
              open={true}
              fullWidth={true}
              PaperProps={{
                style: {
                  width: "100%",
                },
              }}
              maxWidth="lg"
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
                <Document
                  reqData={{
                    COMP_CD: authState?.companyID ?? "",
                    BRANCH_CD: FDState?.retrieveFormData?.BRANCH_CD ?? "",
                    ACCT_TYPE: FDState?.retrieveFormData?.ACCT_TYPE ?? "",
                    ACCT_CD: FDState?.retrieveFormData?.ACCT_CD ?? "",
                    ACCT_NM: FDState?.retrieveFormData?.ACCT_NM ?? "",
                  }}
                  handleDialogClose={handleDialogClose}
                />
              </div>
            </Dialog>
          }
        />
      </Routes>

      {openDetailForm ? (
        <Dialog
          open={true}
          fullWidth={true}
          PaperProps={{
            style: {
              width: "100%",
            },
          }}
          maxWidth="xl"
        >
          <FDDetailForm
            isDataChangedRef={isDataChangedRef}
            handleDialogClose={handleDialogClose}
            defaultView={"view"}
            screenFlag="openLienForm"
          />
        </Dialog>
      ) : null}

      {openFDPmtBtns ? (
        <FDPayment handleDialogClose={handleDialogClose} screenFlag="" />
      ) : null}

      {openIntPayment ? (
        <FDPayment
          handleDialogClose={handleDialogClose}
          screenFlag="intPayment"
        />
      ) : null}
    </>
  );
};
