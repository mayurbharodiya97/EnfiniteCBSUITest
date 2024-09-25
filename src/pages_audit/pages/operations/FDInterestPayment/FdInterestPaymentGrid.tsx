import { CircularProgress, Dialog } from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FormWrapper,
  MetaDataType,
  SubmitFnType,
  GradientButton,
  ActionTypes,
  usePopupContext,
  GridWrapper,
  extractMetaData,
  utilFunction,
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
import { useTranslation } from "react-i18next";
import { cloneDeepWith } from "lodash";
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
          const updatedData = data.map((item) => ({
            ...item,
            FULL_ACCOUNT:
              item.BRANCH_CD.trim() +
              "-" +
              item.ACCT_TYPE.trim() +
              "-" +
              item.ACCT_CD.trim(),
            CR_COMP_CD: authState?.companyID ?? "",
            CREDIT_DTL:
              item.PAYMENT_MODE === "BANKACCT"
                ? item.CR_BRANCH_CD.trim() +
                  "-" +
                  item.CR_ACCT_TYPE.trim() +
                  "-" +
                  item.CR_ACCT_CD.trim()
                : item.PAYMENT_MODE === "NEFT"
                ? "NEFT :" + " " + item.TO_IFSCCODE + "-" + item.TO_ACCT_TYPE
                : "-",
            _rowColor: Boolean(item.PAYMENT_MODE)
              ? "rgb(255, 0, 0)"
              : undefined,
          }));

          setFdPaymentInstructions(updatedData);
          //@ts-ignore
          formDataRef.current = utilFunction.cloneDeep(updatedData);
          setFormOpen(false);
          CloseMessageBox();
        }
      },
      onError: async (error: any) => {
        const btnName = await MessageBox({
          messageTitle: "ValidationFailed",
          message: error?.error_msg ?? "",
          icon: "ERROR",
        });

        CloseMessageBox();
      },
    }
  );
  const updateFDPayment: any = useMutation(
    "updateFDInterestPayment",
    API.updateFDInterestPayment,
    {
      onSuccess: async (data) => {
        const btnName = await MessageBox({
          messageTitle: "Success",
          message: "RecordSave",
          buttonNames: ["Ok"],
          icon: "SUCCESS",
        });

        setFormOpen(true);
        setFdPaymentInstructions([]);
        formDataRef.current = [];
        deletedRowsRef.current = [];
        updatedRowsRef.current = [];
        CloseMessageBox();
      },
      onError: async (error: any) => {
        const btnName = await MessageBox({
          messageTitle: "ValidationFailed",
          message: error?.error_msg ?? "",
          icon: "ERROR",
        });

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
            INT_RATE: parseFloat(item.INT_RATE).toFixed(2),
            TOT_TDS_RECO_INT_AMT: parseFloat(item.TOT_TDS_RECO_INT_AMT).toFixed(
              2
            ),
          }));
          setPaidFDdata(updatedData);
          CloseMessageBox();
        }
      },
      onError: async (error: any) => {
        const btnName = await MessageBox({
          messageTitle: "ValidationFailed",
          message: error?.error_msg ?? "",
          icon: "ERROR",
        });
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
          (item) => item.FD_NO === rowToDelete.FD_NO
        );

        if (!isAlreadyDeleted) {
          const btnName = await MessageBox({
            messageTitle: "Confirmation",
            message: "DeleteData",
            buttonNames: ["Yes", "No"],
          });

          if (btnName === "Yes") {
            const deletedRow = rowToDelete.data;
            const updatedData = formDataRef.current.filter(
              (item) => item.FD_NO !== deletedRow.FD_NO
            );
            formDataRef.current = updatedData;
            delete deletedRow.isNewRow;
            deletedRow.isDeleteRow = true;
            updatedRowsRef.current = updatedRowsRef.current.filter(
              (item) => item.FD_NO !== deletedRow.FD_NO
            );
            deletedRowsRef.current = [...deletedRowsRef.current, deletedRow];
            CloseMessageBox();
          }
        } else {
          CloseMessageBox();
        }
      } else if (data?.name === "retrieve") {
        if (
          Array.isArray(formDataRef.current) &&
          formDataRef.current.length > 0
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
          COMP_CD: parameterRef.current?.COMP_CD ?? "",
          BRANCH_CD: parameterRef.current?.BRANCH_CD ?? "",
          ACCT_TYPE: parameterRef.current?.ACCT_TYPE ?? "",
          ACCT_CD: parameterRef.current?.ACCT_CD ?? "",
        });
        setPaidFDOpen(true);
      } else if (data?.name === "save") {
        let allValid = true;

        for (let i = 0; i < formDataRef.current.length; i++) {
          if (
            !formDataRef.current[i].PAYMENT_MODE ||
            formDataRef.current[i].PAYMENT_MODE.trim() === ""
          ) {
            let btnName = await MessageBox({
              messageTitle: "ValidationFailed",
              message: `${t(`SelectPaymentMode`, {
                FD_NO: formDataRef.current[i].FD_NO,
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
          (deletedRowsRef?.current.length > 0 ||
            updatedRowsRef?.current.length > 0 ||
            formDataRef?.current.filter((item) => item.isNewRow === true)
              .length > 0)
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
                isDeleteRow: deletedRowsRef.current,
                isUpdatedRow: updatedRowsRef.current,
                isNewRow: formDataRef.current.filter(
                  (item) => item.isNewRow === true
                ),
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
      fdPaymentInstructions.length > 0
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
  }, [fdPaymentInstructions.length]);

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    formDataRef.current = formDataRef.current.map((item) => ({
      ...item,
      COMP_CD: authState?.companyID ?? "",
    }));

    fetchFDPaymentInstructions.mutate(parameterRef.current, {
      onSettled: () => {
        if (!fetchFDPaymentInstructions.isLoading) {
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
    const index = formDataRef.current.findIndex(
      (item) => item.FD_NO === formData.FD_NO
    );
    if (index !== -1) {
      formDataRef.current[index] = {
        ...formDataRef.current[index],
        ...formData,
      };
    } else {
      formDataRef.current.push(formData);
    }
    formDataRef.current = formDataRef.current.map((item) => ({
      ...item,
      FULL_ACCOUNT:
        item.BRANCH_CD.trim() +
        "-" +
        item.ACCT_TYPE.trim() +
        "-" +
        item.ACCT_CD.trim(),
      CREDIT_DTL:
        item.PAYMENT_MODE === "BANKACCT"
          ? item.CR_BRANCH_CD.trim() +
            "-" +
            item.CR_ACCT_TYPE.trim() +
            "-" +
            item.CR_ACCT_CD.trim()
          : item.PAYMENT_MODE === "NEFT"
          ? "NEFT :" + " " + item.TO_IFSCCODE + "-" + item.TO_ACCT_TYPE
          : "-",
      _rowColor: Boolean(item.PAYMENT_MODE) ? "rgb(255, 0, 0)" : undefined,
    }));
  };

  const updateRow = (rowsData) => {
    const fdNo = rowsData?.FD_NO;

    if (rowsData?.isNewRow === false) {
      const index = updatedRowsRef.current.findIndex(
        (row) => row?.FD_NO === fdNo
      );

      if (index !== -1) {
        // Update the existing entry
        updatedRowsRef.current[index] = rowsData;
      } else {
        // Add a new entry
        updatedRowsRef?.current.push(rowsData);
      }
    } else {
      return;
    }
  };

  return (
    <Fragment>
      <Dialog
        open={isFormOpen}
        PaperProps={{
          style: {
            minWidth: "30%",
            maxWidth: "50%",
          },
        }}
      >
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
              <GradientButton
                onClick={(event) => {
                  handleSubmit(event, "Save");
                }}
                disabled={
                  isSubmitting ||
                  fetchFDPaymentInstructions.isLoading ||
                  isButtonDisabled
                }
                endIcon={
                  isSubmitting || fetchFDPaymentInstructions.isLoading ? (
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
                  fetchFDPaymentInstructions.isLoading ||
                  isButtonDisabled
                }
              >
                {t("Cancel")}
              </GradientButton>
            </>
          )}
        </FormWrapper>
      </Dialog>

      <GridWrapper
        key={"FDinterestPaymentGrid" + actions.length}
        finalMetaData={FdInterestPaymentGridMetaData}
        data={formDataRef.current ?? []}
        setData={() => null}
        enableExport={true}
        actions={actions}
        setAction={setCurrentAction}
      />

      <Dialog
        open={isPaidFDOpen}
        PaperProps={{
          style: {
            minWidth: "95%",
            maxWidth: "95%",
          },
        }}
      >
        <GridWrapper
          key={"PaidFD"}
          finalMetaData={PaidFDGridMetaData}
          data={paidFDdata ?? []}
          setData={() => null}
          actions={paidFDactions}
          setAction={setPaidFDAction}
          loading={
            fetchPaidFDDetails.isLoading || fetchPaidFDDetails.isFetching
          }
        />
      </Dialog>
      <Dialog
        open={isFDDetailOpen}
        PaperProps={{
          style: {
            minWidth: "95%",
            maxWidth: "95%",
          },
        }}
      >
        <FdInterestPaymentDetail
          closeDialog={handleFDDetailClose}
          gridData={formDataRef.current}
          rows={rowsData}
          updateGrid={updateGrid}
          updateRow={updateRow}
          fdDetails={fdPaymentInstructions}
          defaultView={
            Boolean(rowsData?.[0]?.data?.PAYMENT_MODE) ? "view" : "new"
          }
        />
      </Dialog>
    </Fragment>
  );
};
