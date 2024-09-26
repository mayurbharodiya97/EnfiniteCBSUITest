import { Box, Dialog } from "@mui/material";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { fetchFDPaymentConfAcct } from "../FDInterestPaymentConf/api";
import { updateRecInterestPaymentEntry } from "../recInterestPayment/api";
import { RecInterestPaymentMetaData } from "../recInterestPayment/RecInterestPaymentMetaData";
import * as API from "./api";
import {
  ActionTypes,
  Alert,
  FormWrapper,
  GradientButton,
  GridMetaDataType,
  GridWrapper,
  LoaderPaperComponent,
  MetaDataType,
  queryClient,
  SubmitFnType,
  usePopupContext,
} from "@acuteinfo/common-base";
import { AuthContext } from "pages_audit/auth";
import { FdInterestPaymentConfmGridMetaData } from "../FDInterestPaymentConf/FdInterestPaymentConfmMetaData";

const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "ViewDetails",
    multiple: false,
    rowDoubleClick: true,
  },
];
export const RecInterestPaymentConf = () => {
  const [isFDDetailOpen, setIsFDDetailOpen] = useState(false);
  const [rowData, setRowData] = useState<any>([]);
  const [recPaymentInstructions, setRecPaymentInstructions] = useState<any>([]);
  const { authState } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { MessageBox, CloseMessageBox } = usePopupContext();

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getFDPaymentInstruConfAcctDtl", authState?.user?.branchCode ?? ""], () =>
    API.getFDPaymentInstruConfAcctDtl({
      USER_LEVEL: authState?.role ?? "",
      A_USER: authState?.user?.id ?? "",
      ENT_COMP_CD: authState?.companyID ?? "",
      ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
      FLAG: "REC",
    })
  );
  const getFDPaymentInstruDetail: any = useMutation(
    "fetchFDPaymentConfAcct",
    fetchFDPaymentConfAcct,
    {
      onSuccess: async (data) => {
        setRecPaymentInstructions(data);
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

  const deleteFDInterestPaymentEntry: any = useMutation(
    "updateRecInterestPaymentEntry",
    updateRecInterestPaymentEntry,
    {
      onSuccess: async (data) => {
        const btnName = await MessageBox({
          messageTitle: "Success",
          message: "RecordReject",
          buttonNames: ["Ok"],
          icon: "SUCCESS",
        });
        CloseMessageBox();
        handleFDDetailClose();
        refetch();
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

  const doRecPaymentInstruEntryConfm: any = useMutation(
    "doRecPaymentInstruEntryConfm",
    API.doRecPaymentInstruEntryConfm,
    {
      onSuccess: async (...data) => {
        const btnName = await MessageBox({
          messageTitle: "Success",
          message: "confirmMsg",
          buttonNames: ["Ok"],
          icon: "SUCCESS",
        });
        CloseMessageBox();
        handleFDDetailClose();
        refetch();
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
      if (data?.name === "view-details") {
        getFDPaymentInstruDetail.mutate({
          COMP_CD: data?.rows?.[0]?.data?.COMP_CD ?? "",
          BRANCH_CD: data?.rows?.[0]?.data?.BRANCH_CD ?? "",
          ACCT_TYPE: data?.rows?.[0]?.data?.ACCT_TYPE ?? "",
          ACCT_CD: data?.rows?.[0]?.data?.ACCT_CD ?? "",
          A_CONFIRMED: data?.rows?.[0]?.data?.CONFIRMED ?? "",
          A_LAST_ENT_BY: data?.rows?.[0]?.data?.LAST_ENTERED_BY ?? "",
          A_PARM: "REC",
        });
        setIsFDDetailOpen(true);
        setRowData(data?.rows);
      } else {
        return "";
      }
    },
    [navigate]
  );

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    if (actionFlag === "Confirm") {
      if (authState?.user?.id === rowData?.[0]?.data?.LAST_ENTERED_BY) {
        const btnName = await MessageBox({
          messageTitle: "InvalidConfirmation",
          message: "ConfirmRestrictMsg",
          icon: "ERROR",
        });
      } else {
        const btnName = await MessageBox({
          messageTitle: "Confirmation",
          message: "ConfirmMsg",
          buttonNames: ["Yes", "No"],
          loadingBtnName: ["Yes"],
        });
        if (btnName === "Yes") {
          doRecPaymentInstruEntryConfm.mutate({
            COMP_CD: authState?.companyID,
            BRANCH_CD: recPaymentInstructions?.[0]?.BRANCH_CD ?? "",
            ACCT_TYPE: recPaymentInstructions?.[0]?.ACCT_TYPE ?? "",
            ACCT_CD: recPaymentInstructions?.[0]?.ACCT_CD ?? "",
            FD_NO: recPaymentInstructions?.[0]?.FD_NO ?? "",
          });
        }
      }
    } else if (actionFlag === "Reject") {
      const btnName = await MessageBox({
        messageTitle: "Confirmation",
        message: "ConfirmReject",
        buttonNames: ["Yes", "No"],
        loadingBtnName: ["Yes"],
      });
      if (btnName === "Yes") {
        deleteFDInterestPaymentEntry.mutate({
          data: {
            COMP_CD: authState?.companyID,
            BRANCH_CD: recPaymentInstructions?.[0]?.BRANCH_CD ?? "",
            ACCT_TYPE: recPaymentInstructions?.[0]?.ACCT_TYPE ?? "",
            ACCT_CD: recPaymentInstructions?.[0]?.ACCT_CD ?? "",
            FD_NO: recPaymentInstructions?.[0]?.FD_NO ?? "",
            _isDeleteRow: true,
          },
        });
      }
    }
  };
  const handleFDDetailClose = () => {
    setIsFDDetailOpen(false);
    setRecPaymentInstructions([]);
  };

  useEffect(() => {
    const keysToRemove = [
      "getFDPaymentInstruConfAcctDtl",
      "fetchFDPaymentConfAcct",
      "updateRecInterestPaymentEntry",
      "doRecPaymentInstruEntryConfm",
    ].map((key) => [key, authState?.user?.branchCode]);
    return () => {
      keysToRemove.forEach((key) => queryClient.removeQueries(key));
    };
  }, []);

  return (
    <Fragment>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Something went to wrong.."}
          errorDetail={error?.error_detail ?? ""}
          color="error"
        />
      )}
      <GridWrapper
        key={"RecInterestPaymentConfm"}
        finalMetaData={FdInterestPaymentConfmGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        enableExport={data?.length > 0 ? true : false}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
      />
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
        {getFDPaymentInstruDetail.isLoading ? (
          <LoaderPaperComponent />
        ) : (
          <FormWrapper
            key={"RecInterestPaymentConf" + recPaymentInstructions?.length}
            metaData={RecInterestPaymentMetaData as MetaDataType}
            formStyle={{
              background: "white",
            }}
            onSubmitHandler={onSubmitHandler}
            initialValues={{
              ...recPaymentInstructions?.[0],
              ACCT_NAME: rowData?.[0]?.data?.ACCT_NM,
            }}
            displayMode={"view"}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <Box display="flex" gap="8px">
                  <GradientButton
                    onClick={(event) => {
                      handleSubmit(event, "Confirm");
                    }}
                    disabled={rowData?.[0]?.data?.ALLOW_CONFIRM === "N"}
                    color={"primary"}
                  >
                    {t("Confirm")}
                  </GradientButton>
                  <GradientButton
                    onClick={(event) => {
                      handleSubmit(event, "Reject");
                    }}
                    color={"primary"}
                  >
                    {t("Reject")}
                  </GradientButton>
                  <GradientButton
                    onClick={handleFDDetailClose}
                    color={"primary"}
                  >
                    {t("Close")}
                  </GradientButton>
                </Box>
              </>
            )}
          </FormWrapper>
        )}
      </Dialog>
    </Fragment>
  );
};
