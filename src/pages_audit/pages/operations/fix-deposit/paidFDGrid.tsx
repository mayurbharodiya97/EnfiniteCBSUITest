import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { PaidFDGridMetaData } from "./paidFDGridMetaData";
import { FDContext } from "./context/fdContext";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { useQuery } from "react-query";
import {
  Alert,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
  queryClient,
} from "@acuteinfo/common-base";
import { useTranslation } from "react-i18next";
import { Dialog, Paper } from "@mui/material";
import Draggable from "react-draggable";
import { FdPaymentAdvicePrint } from "../fixDepositConfirmation/form/fdPaymentAdvice";

const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    alwaysAvailable: true,
  },
];

export const PaidFDGrid = ({ handleDialogClose }) => {
  const { t } = useTranslation();
  const { FDState } = useContext(FDContext);
  const { authState } = useContext(AuthContext);
  const [openPaymentAdvice, setOpenPaymentAdvice] = useState(false);
  const requestDataRef = useRef<any>(null);
  const setCurrentAction = useCallback((data) => {
    if (data?.name === "close") {
      handleDialogClose();
    }
  }, []);

  //Api for get Paid FD data
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getPaidFDViewDtl", authState?.user?.branchCode], () =>
    API.getPaidFDViewDtl({
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: FDState?.retrieveFormData?.BRANCH_CD ?? "",
      ACCT_TYPE: FDState?.retrieveFormData?.ACCT_TYPE ?? "",
      ACCT_CD: FDState?.retrieveFormData?.ACCT_CD ?? "",
      WORKING_DT: authState?.workingDate ?? "",
    })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getPaidFDViewDtl",
        authState?.user?.branchCode,
      ]);
    };
  }, []);

  //Grid Header title
  PaidFDGridMetaData.gridConfig.gridLabel = `Paid FD Detail of A/c No.: ${
    FDState?.retrieveFormData?.BRANCH_CD?.trim() ?? ""
  }-${FDState?.retrieveFormData?.ACCT_TYPE?.trim() ?? ""}-${
    FDState?.retrieveFormData?.ACCT_CD?.trim() ?? ""
  } ${FDState?.retrieveFormData?.ACCT_NM?.trim() ?? ""}`;

  return (
    <>
      <Dialog
        open={true}
        fullWidth={true}
        PaperProps={{
          style: {
            width: "100%",
          },
        }}
        maxWidth="xl"
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
          {error && (
            <Alert
              severity="error"
              errorMsg={error?.error_msg ?? t("Somethingwenttowrong")}
              errorDetail={error?.error_detail}
              color="error"
            />
          )}
          <GridWrapper
            key={"PaidFDGrid"}
            finalMetaData={PaidFDGridMetaData as GridMetaDataType}
            data={data ?? []}
            setData={() => null}
            actions={actions}
            loading={isLoading || isFetching}
            setAction={setCurrentAction}
            enableExport={true}
            onClickActionEvent={async (index, id, data) => {
              if (id === "VIEW_ADVICE") {
                requestDataRef.current = {
                  COMP_CD: data?.COMP_CD ?? "",
                  BRANCH_CD: data?.BRANCH_CD ?? "",
                  ACCT_TYPE: data?.ACCT_TYPE ?? "",
                  ACCT_CD: data?.ACCT_CD ?? "",
                  FD_NO: data?.FD_NO ?? "",
                };
                setOpenPaymentAdvice(true);
              }
            }}
          />
        </div>
      </Dialog>

      {/*Open Payment Advice component */}
      {openPaymentAdvice ? (
        <FdPaymentAdvicePrint
          closeDialog={handleDialogClose}
          requestData={{
            ...requestDataRef.current,
            A_FLAG: "P",
          }}
          setOpenAdvice={setOpenPaymentAdvice}
          screenFlag={"FDEntry"}
        />
      ) : null}
    </>
  );
};