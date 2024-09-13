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

export const FDDetailGrid = () => {
  const {
    FDState,
    updateFDDetailsFormData,
    updateRetrieveFormData,
    resetAllData,
    updateViewDtlGridData,
    setActiveStep,
  } = useContext(FDContext);
  const [openRetriveForm, setOpenRetriveForm] = useState(false);
  const [openDetailForm, setOpenDetailForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDataChangedRef = useRef(false);
  const initialRender = useRef(true);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const acctNoDataRef: any = useRef({});
  const { authState } = useContext(AuthContext);
  let currentPath = useLocation().pathname;

  const actions: ActionTypes[] =
    Object.keys(FDState?.retrieveFormData).length === 0
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
        ];

  useEffect(() => {
    if (initialRender.current) {
      acctNoDataRef.current = FDState?.acctNoData;
    }
  }, [Object.keys(FDState?.acctNoData).length]);

  //Mutation for get View Detail grid data
  const getFDViewDtlMutation: any = useMutation(
    "getFDViewDtl",
    API.getFDViewDtl,
    {
      onError: (error: any) => {
        let errorMsg = "Unknownerroroccured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        CloseMessageBox();
      },
      onSuccess: (data) => {
        updateViewDtlGridData(data);
        CloseMessageBox();
        setOpenRetriveForm(false);
      },
    }
  );

  //Mutation for allow modify data
  const checkAllowModifyFDDataMutation: any = useMutation(
    "checkAllowModifyFDData",
    API.checkAllowModifyFDData,
    {
      onError: (error: any) => {
        let errorMsg = "Unknownerroroccured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        CloseMessageBox();
      },
      onSuccess: () => {},
    }
  );

  const setCurrentAction = useCallback(
    async (data) => {
      const actionData = data;
      if (data.name === "retrieve") {
        resetAllData();
        setOpenRetriveForm(true);
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
            STATUS: acctNoDataRef?.current?.AC_STATUS ?? "",
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
                // updateFDDetailsFormData([actionData?.rows?.[0]?.data]);
                navigate(actionData?.name, {
                  state: actionData?.rows,
                });
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
    navigate(".");
    if (isDataChangedRef.current === true) {
      //   refetch();
      isDataChangedRef.current = false;
    }
  }, [navigate]);

  const handleCloseRetriveForm = () => {
    setOpenRetriveForm(false);
  };

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      if (location.pathname === "/cbsenfinity/operation/fix-deposit") {
        setOpenRetriveForm(true);
      }
    }
  }, [location.pathname, navigate]);

  //Grid Header title
  const label = utilFunction?.getDynamicLabel(
    currentPath,
    authState?.menulistdata,
    true
  );
  FDDetailGridMetaData.gridConfig.gridLabel = Object.keys(
    FDState?.retrieveFormData
  ).length
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
      {checkAllowModifyFDDataMutation.isLoading && (
        <Dialog open={true} fullWidth={true}>
          <LoaderPaperComponent size={30} />
        </Dialog>
      )}
      <GridWrapper
        key={
          "fdDetailGrid" +
          Object.keys(FDState?.retrieveFormData).length +
          FDState?.viewDtlGridData?.length
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
              //   isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
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
                closeDialog={handleDialogClose}
                defaultView={"view"}
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
                    BTN_FLAG: "Y",
                  }}
                />
              </div>
            </Dialog>
          }
        />

        <Route
          path="view-master/*"
          element={<ViewMasterForm closeDialog={handleDialogClose} />}
        />
        <Route
          path="paid-fd/*"
          element={<PaidFDGrid closeDialog={handleDialogClose} />}
        />
        <Route
          path="int-paid-dtl/*"
          element={<IntPaidDtlGrid closeDialog={handleDialogClose} />}
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
                  }}
                  closeDialog={handleDialogClose}
                  // closeDialog={handleDialogClose}
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
            //   isDataChangedRef={isDataChangedRef}
            closeDialog={handleDialogClose}
            defaultView={"view"}
            screenFlag="openLienForm"
          />
        </Dialog>
      ) : null}

      {openRetriveForm ? (
        <FDRetriveForm
          closeDialog={handleCloseRetriveForm}
          getFDViewDtlMutation={getFDViewDtlMutation}
        />
      ) : null}
    </>
  );
};
