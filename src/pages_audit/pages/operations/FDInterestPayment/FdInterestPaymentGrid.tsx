import { Box, Chip, CircularProgress, Dialog, Grid } from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import { Alert, Transition } from "@acuteinfo/common-base";
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import {
  FormWrapper,
  MetaDataType,
  SubmitFnType,
  GradientButton,
  ActionTypes,
  usePopupContext,
  GridWrapper,
  queryClient,
} from "@acuteinfo/common-base";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import * as API from "./api";
import {
  accountFindmetaData,
  FdInterestPaymentGridMetaData,
  PaidFDGridMetaData,
} from "./FdInterestPaymentGridMetaData";
import { FdInterestPaymentDetail } from "./viewDetails";
import { cloneDeep } from "lodash";
import { enqueueSnackbar } from "notistack";
const baseActions: ActionTypes[] = [
  {
    actionName: "retrieve",
    actionLabel: "Retrieve",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "view-details",
    actionLabel: "ViewDetails",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "delete",
    actionLabel: "Delete",
    multiple: false,
    rowDoubleClick: false,
  },
];
const paidFDactions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];

export const FdInterestPaymentGrid = () => {
  const [isFormOpen, setFormOpen] = useState(true);
  const [isPaidFDOpen, setPaidFDOpen] = useState(false);
  const [isFDDetailOpen, setFDDetailOpen] = useState(false);
  const [paidFDdata, setPaidFDdata] = useState([]);
  const [fdPaymentInstructions, setFdPaymentInstructions] = useState([]);
  const [actions, setActions] = useState(baseActions);
  const [rowsData, setRowsData] = useState<any>([]);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const { authState } = useContext(AuthContext);
  const parameterRef = useRef<any>();
  const deletedRowsRef = useRef<any[]>([]);
  const updatedRowsRef = useRef<any[]>([]);
  const formDataRef = useRef<any[]>([]);
  const { t } = useTranslation();

  const { MessageBox, CloseMessageBox } = usePopupContext();
  const navigate = useNavigate();

  const fetchFDPaymentInstructions: any = useMutation(
    "getFDPaymentInstrudtl",
    API.fetchFDPaymentDetails,
    {
      onSuccess: async (data) => {
        if (data.length === 0) {
          let buttonName = await MessageBox({
            messageTitle: "ValidationFailed",
            message: "NounPaidFDmsg",
            buttonNames: ["Ok"],
            icon: "ERROR",
          });
        } else {
          const updatedData = data?.map((item) => ({
            ...item,
            FULL_ACCOUNT:
              item?.BRANCH_CD?.trim() ??
              "" + "-" + item?.ACCT_TYPE?.trim() ??
              "" + "-" + item?.ACCT_CD?.trim() ??
              "",
            CR_COMP_CD: authState?.companyID ?? "",
            CREDIT_DTL:
              item?.PAYMENT_MODE === "BANKACCT"
                ? item?.CR_BRANCH_CD?.trim() ??
                  "" + "-" + item?.CR_ACCT_TYPE?.trim() ??
                  "" + "-" + item?.CR_ACCT_CD?.trim() ??
                  ""
                : item?.PAYMENT_MODE === "NEFT"
                ? "NEFT :" +
                  " " +
                  item?.TO_IFSCCODE.trim() +
                  "-" +
                  item?.TO_ACCT_TYPE.trim()
                : "-",
            _rowColor: Boolean(item?.PAYMENT_MODE)
              ? "rgb(130, 224, 170)"
              : undefined,
          }));

          setFdPaymentInstructions(updatedData);
          //@ts-ignore
          formDataRef.current = cloneDeep(updatedData);
          setFormOpen(false);
          CloseMessageBox();
        }
      },
      onError: async (error: any) => {
        CloseMessageBox();
      },
    }
  );
  const updateFDPayment: any = useMutation(
    "updateFDInterestPayment",
    API.updateFDInterestPayment,
    {
      onSuccess: async (data) => {
        enqueueSnackbar(t("RecordSave"), {
          variant: "success",
        });
        setFormOpen(true);
        setFdPaymentInstructions([]);
        formDataRef.current = [];
        deletedRowsRef.current = [];
        updatedRowsRef.current = [];
        CloseMessageBox();
      },
      onError: async (error: any) => {
        CloseMessageBox();
      },
    }
  );
  const fetchPaidFDDetails: any = useMutation(
    "fetchPaidFDDetails",
    API.fetchPaidFDDetails,
    {
      onSuccess: async (data: any) => {
        if (data.length === 0) {
          let buttonName = await MessageBox({
            messageTitle: "NotFound",
            message: "RecordNotFound",
            buttonNames: ["Ok"],
          });
          if (buttonName === "Ok") {
            setPaidFDOpen(false);
          }
        } else {
          const updatedData = data.map((item) => ({
            ...item,
            INT_RATE: parseFloat(item?.INT_RATE ?? 0).toFixed(2),
            TOT_TDS_RECO_INT_AMT: parseFloat(
              item?.TOT_TDS_RECO_INT_AMT ?? 0
            ).toFixed(2),
          }));
          setPaidFDdata(updatedData);
          CloseMessageBox();
        }
      },
      onError: async (error: any) => {
        CloseMessageBox();
      },
    }
  );

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "delete") {
        // Check if a row is already marked for deletion
        const rowToDelete = data?.rows?.[0];
        if (!rowToDelete) return;

        // Check if the row is already in deletedRowsRef
        const isAlreadyDeleted = deletedRowsRef.current.some(
          (item) => item?.FD_NO === rowToDelete?.FD_NO
        );

        if (!isAlreadyDeleted) {
          const btnName = await MessageBox({
            messageTitle: "Confirmation",
            message: "DeleteData",
            buttonNames: ["Yes", "No"],
          });

          if (btnName === "Yes") {
            const deletedRow = rowToDelete?.data;
            const updatedData = formDataRef?.current?.filter(
              (item) => item?.FD_NO !== deletedRow?.FD_NO
            );
            formDataRef.current = updatedData;
            delete deletedRow?.isNewRow;
            deletedRow.isDeleteRow = true;
            updatedRowsRef.current = updatedRowsRef?.current?.filter(
              (item) => item?.FD_NO !== deletedRow?.FD_NO
            );
            deletedRowsRef.current = [...deletedRowsRef?.current, deletedRow];
            CloseMessageBox();
          }
        } else {
          CloseMessageBox();
        }
      } else if (data?.name === "retrieve") {
        if (
          Array.isArray(formDataRef?.current) &&
          formDataRef?.current?.length > 0
        ) {
          let btnName = await MessageBox({
            messageTitle: "Confirmation",
            message: `RetrieveConfirmation`,
            buttonNames: ["Yes", "No"],
          });
          if (btnName === "Yes") {
            setFormOpen(true);
            setFdPaymentInstructions([]);
            formDataRef.current = [];
            deletedRowsRef.current = [];
            updatedRowsRef.current = [];
          }
        } else {
          setFormOpen(true);
        }
      } else if (data?.name === "view-details") {
        setRowsData(data?.rows);
        setFDDetailOpen(true);
      } else if (data?.name === "paid-fd") {
        fetchPaidFDDetails.mutate({
          COMP_CD: parameterRef?.current?.COMP_CD ?? "",
          BRANCH_CD: parameterRef?.current?.BRANCH_CD ?? "",
          ACCT_TYPE: parameterRef?.current?.ACCT_TYPE ?? "",
          ACCT_CD: parameterRef?.current?.ACCT_CD ?? "",
        });
        setPaidFDOpen(true);
      } else if (data?.name === "save") {
        let allValid = true;

        for (let i = 0; i < formDataRef?.current?.length; i++) {
          if (
            !formDataRef?.current[i]?.PAYMENT_MODE ||
            formDataRef?.current[i]?.PAYMENT_MODE?.trim() === ""
          ) {
            let btnName = await MessageBox({
              messageTitle: "ValidationFailed",
              message: `${t(`SelectPaymentMode`, {
                FD_NO: formDataRef?.current[i]?.FD_NO,
              })}`,
              buttonNames: ["Ok"],
              icon: "ERROR",
            });
            if (btnName === "Ok") {
              allValid = false;
              break;
            }
          }
        }

        if (
          allValid &&
          (deletedRowsRef?.current?.length > 0 ||
            updatedRowsRef?.current?.length > 0 ||
            formDataRef?.current?.filter((item) => item?.isNewRow === true)
              ?.length > 0)
        ) {
          const btnName = await MessageBox({
            messageTitle: "Confirmation",
            message: "SaveData",
            buttonNames: ["Yes", "No"],
            loadingBtnName: ["Yes"],
          });
          if (btnName === "Yes") {
            updateFDPayment.mutate({
              DETAILS_DATA: {
                isDeleteRow: deletedRowsRef?.current ?? [],
                isUpdatedRow: updatedRowsRef?.current ?? [],
                isNewRow:
                  formDataRef?.current?.filter(
                    (item) => item?.isNewRow === true
                  ) ?? [],
              },
            });
          }
        }
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );
  const setPaidFDAction = useCallback(
    async (data) => {
      if (data?.name === "close") {
        setPaidFDdata([]);
        setPaidFDOpen(false);
      }
    },
    [navigate]
  );

  // Add/Remove action
  useEffect(() => {
    setActions(
      // @ts-ignore
      fdPaymentInstructions?.length > 0
        ? [
            ...baseActions,
            {
              actionName: "paid-fd",
              actionLabel: "PaidFD",
              alwaysAvailable: true,
            },
            { actionName: "save", actionLabel: "Save", alwaysAvailable: true },
          ]
        : baseActions
    );
  }, [fdPaymentInstructions?.length]);

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    formDataRef.current = formDataRef?.current?.map((item) => ({
      ...item,
      COMP_CD: authState?.companyID ?? "",
    }));

    fetchFDPaymentInstructions.mutate(parameterRef?.current, {
      onSettled: () => {
        if (!fetchFDPaymentInstructions?.isLoading) {
          endSubmit(true);
        }
      },
    });
  };
  const handleCloseForm = () => {
    setFormOpen(false);
  };
  const handleFDDetailClose = () => {
    setFDDetailOpen(false);
  };
  const handleButtonDisable = (disable) => {
    setButtonDisabled(disable);
  };

  const updateGrid = (formData) => {
    const index = formDataRef?.current?.findIndex(
      (item) => item?.FD_NO === formData?.FD_NO
    );
    if (index !== -1) {
      formDataRef.current[index] = {
        ...formDataRef?.current[index],
        ...formData,
      };
    } else {
      formDataRef?.current?.push(formData);
    }
    formDataRef.current = formDataRef?.current?.map((item) => ({
      ...item,
      FULL_ACCOUNT:
        item?.BRANCH_CD?.trim() ??
        "" + "-" + item?.ACCT_TYPE?.trim() ??
        "" + "-" + item?.ACCT_CD?.trim() ??
        "",
      CREDIT_DTL:
        item?.PAYMENT_MODE === "BANKACCT"
          ? item?.CR_BRANCH_CD?.trim() ??
            "" + "-" + item?.CR_ACCT_TYPE?.trim() ??
            "" + "-" + item?.CR_ACCT_CD?.trim() ??
            ""
          : item?.PAYMENT_MODE === "NEFT"
          ? "NEFT :" +
            " " +
            item?.TO_IFSCCODE.trin() +
            "-" +
            item?.TO_ACCT_TYPE.trim()
          : "-",
      _rowColor: Boolean(item?.PAYMENT_MODE) ? "rgb(130, 224, 170)" : undefined,
    }));
  };

  const updateRow = (rowsData) => {
    const fdNo = rowsData?.FD_NO;

    if (rowsData?.isNewRow === false) {
      const index = updatedRowsRef?.current?.findIndex(
        (row) => row?.FD_NO === fdNo
      );

      if (index !== -1) {
        // Update the existing entry
        updatedRowsRef.current[index] = rowsData;
      } else {
        // Add a new entry
        updatedRowsRef?.current?.push(rowsData);
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    const keysToRemove = [
      "getFDPaymentInstrudtl",
      "updateFDInterestPayment",
      "fetchPaidFDDetails",
      "getPMISCData",
      "getAccountTypeList",
    ].map((key) => [key, authState?.user?.branchCode]);
    return () => {
      keysToRemove?.forEach((key) => queryClient?.removeQueries(key));
    };
  }, []);

  return (
    <Fragment>
      <Dialog
        open={isFormOpen}
        // @ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "100%",
            overflow: "auto",
          },
        }}
        maxWidth="sm"
      >
        {(fetchFDPaymentInstructions?.error || updateFDPayment?.error) && (
          <Alert
            severity="error"
            errorMsg={
              fetchFDPaymentInstructions?.error?.error_msg ||
              updateFDPayment?.error?.error_msg ||
              t("Somethingwenttowrong")
            }
            errorDetail={
              fetchFDPaymentInstructions?.error?.error_detail ||
              updateFDPayment?.error?.error_detail ||
              ""
            }
            color="error"
          />
        )}
        <FormWrapper
          key={"accountFindmetaData"}
          metaData={accountFindmetaData as MetaDataType}
          formStyle={{
            background: "white",
          }}
          controlsAtBottom={true}
          onSubmitHandler={onSubmitHandler}
          setDataOnFieldChange={(action, payload) => {
            if (action === "fdPaymentInstrudtl") {
              parameterRef.current = { ...payload, A_PARM: "FD" };
            }
          }}
          formState={{
            MessageBox: MessageBox,
            handleButtonDisable: handleButtonDisable,
            docCD: "TRN/584",
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <Box display="flex" gap={2}>
                <GradientButton
                  onClick={(event) => {
                    handleSubmit(event, "Save");
                  }}
                  disabled={
                    isSubmitting ||
                    fetchFDPaymentInstructions?.isLoading ||
                    isButtonDisabled
                  }
                  endIcon={
                    isSubmitting || fetchFDPaymentInstructions?.isLoading ? (
                      <CircularProgress size={20} />
                    ) : null
                  }
                  color={"primary"}
                >
                  {t("Submit")}
                </GradientButton>

                <GradientButton
                  onClick={handleCloseForm}
                  color={"primary"}
                  disabled={
                    isSubmitting ||
                    fetchFDPaymentInstructions?.isLoading ||
                    isButtonDisabled
                  }
                >
                  {t("Cancel")}
                </GradientButton>
              </Box>
            </>
          )}
        </FormWrapper>
      </Dialog>
      {updateFDPayment?.error && (
        <Alert
          severity="error"
          errorMsg={
            updateFDPayment?.error?.error_msg || t("Somethingwenttowrong")
          }
          errorDetail={updateFDPayment?.error?.error_detail || ""}
          color="error"
        />
      )}
      <GridWrapper
        key={"FDinterestPaymentGrid" + actions?.length}
        finalMetaData={FdInterestPaymentGridMetaData}
        data={formDataRef?.current ?? []}
        setData={() => null}
        enableExport={true}
        actions={actions}
        setAction={setCurrentAction}
      />
      <Box
        sx={{
          height: "23px",
          width: "60%",
          float: "right",
          position: "relative",
          top: "-2.67rem",
          display: "flex",
          gap: "4rem",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: "1rem",
        }}
      >
        <Chip
          sx={{
            backgroundColor: "rgb(130, 224, 170)",
            color: "black",
          }}
          size="medium"
          label={`Success`}
        />
      </Box>

      <Dialog
        open={isPaidFDOpen}
        // @ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "100%",
            overflow: "auto",
          },
        }}
        maxWidth="lg"
      >
        {fetchPaidFDDetails?.error && (
          <Alert
            severity="error"
            errorMsg={
              fetchPaidFDDetails?.error?.error_msg || t("Somethingwenttowrong")
            }
            errorDetail={fetchPaidFDDetails?.error?.error_detail || ""}
            color="error"
          />
        )}
        <GridWrapper
          key={"PaidFD"}
          finalMetaData={PaidFDGridMetaData}
          data={paidFDdata ?? []}
          setData={() => null}
          actions={paidFDactions}
          setAction={setPaidFDAction}
          loading={
            fetchPaidFDDetails?.isLoading || fetchPaidFDDetails?.isFetching
          }
        />
      </Dialog>
      <Dialog
        open={isFDDetailOpen}
        // @ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "100%",
            overflow: "auto",
          },
        }}
        maxWidth="lg"
      >
        <FdInterestPaymentDetail
          closeDialog={handleFDDetailClose}
          gridData={formDataRef?.current}
          rows={rowsData}
          updateGrid={updateGrid}
          updateRow={updateRow}
          fdDetails={fdPaymentInstructions}
          defaultView={
            Boolean(rowsData?.[0]?.data?.PAYMENT_MODE) ? "edit" : "new"
          }
        />
      </Dialog>
    </Fragment>
  );
};
