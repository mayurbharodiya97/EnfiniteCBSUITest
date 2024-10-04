import { useRef, useCallback, useContext, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { RecurringPaymentEntryGridMetaData } from "./recurringPmtEntryGridMetadata";
import RecurringPaymentStepperForm from "./recurringPaymentEntryForm/recurringPaymentStepperForm";
import { RecurringContext } from "./context/recurringPaymentContext";
import { useTranslation } from "react-i18next";
import { RecurringPaymentEntryForm } from "./recurringPaymentEntryForm/recurringPaymentEntryForm";
import {
  usePopupContext,
  queryClient,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
  Alert,
  RemarksAPIWrapper,
} from "@acuteinfo/common-base";
import { Dialog } from "@mui/material";
import { RecurringPaymentConfirmation } from "../recurringPaymentConfirmation/recurringPaymentConfirmation";

export const RecurringPaymentEntryGrid = ({ screenFlag }) => {
  const navigate = useNavigate();
  const isDataChangedRef = useRef(false);
  const isDeleteDataRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();
  const { getAcctDatafromValApi, updateRecurPmtEntryGridData, resetAllData } =
    useContext(RecurringContext);
  const [deleteMessageBox, setDeleteMessageBox] = useState(false);
  const location = useLocation();
  const initialRender = useRef(true);

  const actions: ActionTypes[] =
    screenFlag === "recurringPmtEntry"
      ? [
          {
            actionName: "add",
            actionLabel: "Add",
            multiple: undefined,
            rowDoubleClick: false,
            alwaysAvailable: true,
          },
          {
            actionName: "view-details",
            actionLabel: "View Detail",
            multiple: false,
            rowDoubleClick: true,
          },
          {
            actionName: "delete",
            actionLabel: "Delete",
            multiple: false,
            rowDoubleClick: false,
          },
        ]
      : screenFlag === "recurringPmtConf"
      ? [
          {
            actionName: "view-details",
            actionLabel: "View Detail",
            multiple: false,
            rowDoubleClick: true,
          },
        ]
      : [];

  //Api for readonly flag for entry form
  const {
    data: entryScreenFlagData,
    isLoading: entryScreenFlagLoading,
    isFetching: entryScreenFlagIsFetching,
    isError: entryScreenFlagIsError,
    error: entryScreenFlagError,
    refetch: entryScreenFlagRefetch,
  } = useQuery<any, any>(
    ["getRecurPaymentScreenPara", authState?.user?.branchCode],
    () =>
      API.getRecurPaymentScreenPara({
        companyID: authState?.companyID ?? "",
        branchCode: authState?.user?.branchCode ?? "",
      })
  );

  //Api for get grid data
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(
    ["getRecurPaymentEntryGirdData", authState?.user?.branchCode],
    () =>
      API.getRecurPaymentMst({
        companyID: authState?.companyID ?? "",
        branchCode: authState?.user?.branchCode ?? "",
        TDS_METHOD: entryScreenFlagData?.[0]?.TDS_METHOD ?? "",
        GD_DATE: authState?.workingDate ?? "",
      }),
    { enabled: Boolean(entryScreenFlagData) }
  );

  const refetchData = useCallback(() => {
    entryScreenFlagRefetch().then(() => {
      refetch();
    });
  }, [entryScreenFlagRefetch, refetch]);

  const handleDialogClose: any = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      refetchData();
      isDataChangedRef.current = false;
    }
    resetAllData();
  }, [navigate]);

  //Mutation for delete recurring payment data
  const entryDeleteMutation = useMutation(API.recurringPaymentEntryDML, {
    onError: async (error: any) => {
      let errorMsg = t("Unknownerroroccured");
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      await MessageBox({
        messageTitle: "ValidationFailed",
        message: errorMsg ?? "",
      });
      CloseMessageBox();
    },
    onSuccess: async (data) => {
      enqueueSnackbar(t("RecordRemovedMsg"), {
        variant: "success",
      });
      CloseMessageBox();
      navigate(".");
      refetchData();
      handleDialogClose();
    },
  });

  //Mutation for validation before delete entry
  const validateDeleteRecurMutation: any = useMutation(
    "validateDeleteRecurData",
    API.validateDeleteRecurData,
    {
      onSuccess: async (data) => {},
      onError: (error: any) => {
        setDeleteMessageBox(false);
        let errorMsg = t("Unknownerroroccured");
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        CloseMessageBox();
      },
    }
  );

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "delete") {
        isDeleteDataRef.current = data?.rows?.[0];
        setDeleteMessageBox(true);
      } else if (data?.name === "add") {
        navigate(data?.name, {
          state: [],
        });
      } else if (data?.name === "view-details") {
        getAcctDatafromValApi(data?.rows?.[0]?.data);
        isDeleteDataRef.current = data?.rows?.[0];
        navigate(data?.name, {
          state: data?.rows,
        });
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  useEffect(() => {
    updateRecurPmtEntryGridData(data);
  }, [data]);

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getRecurPaymentEntryGirdData",
        authState?.user?.branchCode,
      ]);
      queryClient.removeQueries([
        "getRecurPaymentScreenPara",
        authState?.user?.branchCode,
      ]);
    };
  }, []);

  useEffect(() => {
    if (initialRender.current && screenFlag === "recurringPmtEntry") {
      initialRender.current = false;
      if (
        location.pathname === "/cbsenfinity/operation/recurring-payment-entry"
      ) {
        navigate("add");
      }
    }
  }, [location.pathname, navigate, screenFlag]);

  return (
    <>
      {isError && (
        <Alert
          severity="error"
          errorMsg={
            (error?.error_msg || entryScreenFlagError?.error_msg) ??
            t("Somethingwenttowrong")
          }
          errorDetail={
            error?.error_detail || entryScreenFlagError?.error_detail
          }
          color="error"
        />
      )}
      <GridWrapper
        key={"recurringPaymentEntryGrid" + screenFlag}
        finalMetaData={RecurringPaymentEntryGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={
          entryScreenFlagLoading ||
          entryScreenFlagIsFetching ||
          isLoading ||
          isFetching
        }
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetchData()}
        enableExport={true}
      />

      <Routes>
        <Route
          path="add/*"
          element={
            <RecurringPaymentStepperForm
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              defaultView={"new"}
              entryScreenFlagData={entryScreenFlagData}
            />
          }
        />
        <Route
          path="view-details/*"
          element={
            screenFlag === "recurringPmtEntry" ? (
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
                <RecurringPaymentEntryForm
                  closeDialog={handleDialogClose}
                  defaultView={"view"}
                />
              </Dialog>
            ) : screenFlag === "recurringPmtConf" ? (
              <RecurringPaymentConfirmation
                handleDialogClose={handleDialogClose}
                screenFlag={screenFlag}
                isDataChangedRef={isDataChangedRef}
                setDeleteMessageBox={setDeleteMessageBox}
              />
            ) : null
          }
        />
      </Routes>

      {/*Message box with input for delete entry */}
      {deleteMessageBox && (
        <RemarksAPIWrapper
          TitleText={
            screenFlag === "recurringPmtEntry"
              ? t("EnterRemovalRemarksForRecurringPaymentEntry")
              : t("EnterRemovalRemarksForRecurringPaymentConfirmation")
          }
          label={"RemovalRemarks"}
          onActionNo={() => setDeleteMessageBox(false)}
          onActionYes={(val, rows) => {
            validateDeleteRecurMutation.mutate(
              {
                COMP_CD: rows?.COMP_CD ?? "",
                BRANCH_CD: rows?.BRANCH_CD ?? "",
                ACCT_TYPE: rows?.ACCT_TYPE ?? "",
                ACCT_CD: rows?.ACCT_CD ?? "",
                TRAN_CD: rows?.TRAN_CD ?? "",
                PAYSLIP: Boolean(rows?.PAYSLIP) ? "Y" : "N",
                RTGS_NEFT: Boolean(rows?.RTGS_NEFT) ? "Y" : "N",
                SCREEN_REF:
                  screenFlag === "recurringPmtEntry" ? "TRN/053" : "TRN/385",
                STATUS: rows?.STATUS ?? "",
              },
              {
                onSuccess: async (deletValidData) => {
                  setDeleteMessageBox(false);
                  for (const response of deletValidData ?? []) {
                    if (response?.O_STATUS === "999") {
                      await MessageBox({
                        messageTitle: "ValidationFailed",
                        message: response?.O_MESSAGE ?? "",
                      });
                    } else if (response?.O_STATUS === "9") {
                      await MessageBox({
                        messageTitle: "Alert",
                        message: response?.O_MESSAGE ?? "",
                      });
                    } else if (response?.O_STATUS === "99") {
                      const buttonName = await MessageBox({
                        messageTitle: "Confirmation",
                        message: response?.O_MESSAGE ?? "",
                        buttonNames: ["Yes", "No"],
                        defFocusBtnName: "Yes",
                      });
                      if (buttonName === "No") {
                        break;
                      }
                    } else if (response?.O_STATUS === "0") {
                      const buttonName = await MessageBox({
                        messageTitle: "Confirmation",
                        message: "DoYouWantDeleteRow",
                        buttonNames: ["Yes", "No"],
                        defFocusBtnName: "Yes",
                        loadingBtnName: ["Yes"],
                      });
                      if (buttonName === "Yes") {
                        entryDeleteMutation.mutate({
                          isDeleteRow: true,
                          ...isDeleteDataRef.current?.data,
                          TRAN_AMOUNT: isDeleteDataRef.current?.data?.TRF_AMT,
                          ACTIVITY_TYPE:
                            screenFlag === "recurringPmtEntry"
                              ? t("RecurringPaymentEntry")
                              : t("RecurringPaymentConfirmation"),
                          REMARKS:
                            screenFlag === "recurringPmtEntry"
                              ? t("DeleteFromRecurringPaymentEntry")
                              : t("DeleteFromRecurringPaymentConfirmation"),
                          USER_DEF_REMARKS: val
                            ? val
                            : screenFlag === "recurringPmtEntry"
                            ? t("WRONGENTRYFROMRECURRINGPAYMENTENTRY")
                            : t("WRONGENTRYFROMRECURRINGPAYMENTCONFIRMATION"),
                        });
                      }
                    }
                  }
                },
              }
            );
          }}
          isLoading={validateDeleteRecurMutation?.isLoading}
          isEntertoSubmit={true}
          AcceptbuttonLabelText="Ok"
          CanceltbuttonLabelText="Cancel"
          open={deleteMessageBox}
          rows={isDeleteDataRef.current?.data}
          defaultValue={
            screenFlag === "recurringPmtEntry"
              ? t("WRONGENTRYFROMRECURRINGPAYMENTENTRY")
              : t("WRONGENTRYFROMRECURRINGPAYMENTCONFIRMATION")
          }
        />
      )}
    </>
  );
};
