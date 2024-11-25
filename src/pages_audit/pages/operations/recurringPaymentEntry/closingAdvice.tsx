import { Dialog } from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import { useContext, useState } from "react";
import { RecurringContext } from "./context/recurringPaymentContext";
import { useQuery } from "react-query";
import * as API from "./api";
import { useTranslation } from "react-i18next";
import {
  LoaderPaperComponent,
  PDFViewer,
  utilFunction,
  usePopupContext,
} from "@acuteinfo/common-base";
import { useLocation } from "react-router-dom";
import { getdocCD } from "components/utilFunction/function";

const ClosingAdvice = ({ handleCloseAdviceDetails, setOpenClosingAdvice }) => {
  const { authState } = useContext(AuthContext);
  const { rpState } = useContext(RecurringContext);
  const { t } = useTranslation();
  let currentPath = useLocation().pathname;
  const docCD = getdocCD(currentPath, authState?.menulistdata);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [fileBlobData, setFileBlobData]: any = useState(null);

  const { data, isLoading, isFetching, refetch } = useQuery<any, any>(
    ["getRucurPmtAdviceDtlJasper", rpState?.dataForJasperParam?.BRANCH_CD],
    () =>
      API?.getRucurPmtAdviceDtlJasper({
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: rpState?.dataForJasperParam?.BRANCH_CD ?? "",
        ACCT_TYPE: rpState?.dataForJasperParam?.ACCT_TYPE ?? "",
        ACCT_CD: rpState?.dataForJasperParam?.ACCT_CD ?? "",
        INT_RATE: rpState?.dataForJasperParam?.INT_RATE ?? "",
        INT_AMOUNT: rpState?.dataForJasperParam?.INT_AMOUNT ?? "",
        REC_PENALTY_AMT: rpState?.dataForJasperParam?.REC_PENALTY_AMT ?? "",
        PENAL_RATE: rpState?.dataForJasperParam?.PENAL_RATE ?? "",
        PAYMENT_TYPE: rpState?.dataForJasperParam?.PAYMENT_TYPE ?? "",
        TRAN_CD: rpState?.dataForJasperParam?.TRAN_CD ?? "",
        SCREEN_REF: docCD ?? "",
      }),
    {
      onSuccess: async (data) => {
        let blobData = utilFunction.blobToFile(data, "");
        if (blobData) {
          setFileBlobData(blobData);
        }
      },
      onError: async (error) => {
        await MessageBox({
          messageTitle: "ValidationFailed",
          message: error?.error_msg ?? "",
          icon: "ERROR",
        });
        setOpenClosingAdvice(false);
      },
    }
  );

  return (
    <>
      {isLoading || isFetching ? (
        <Dialog
          open={true}
          PaperProps={{
            style: {
              width: "100%",
            },
          }}
          maxWidth="xl"
        >
          <LoaderPaperComponent />
        </Dialog>
      ) : Boolean(fileBlobData) ? (
        Boolean(fileBlobData && fileBlobData?.type?.includes("pdf")) && (
          <Dialog
            open={true}
            PaperProps={{
              style: {
                width: "100%",
                height: "100%",
              },
            }}
            maxWidth="xl"
          >
            <PDFViewer
              blob={fileBlobData}
              fileName={`${t("RecurringClosingAdvice")} ${
                rpState?.closingAdviceData?.[0]?.COMP_CD ?? ""
              }${rpState?.closingAdviceData?.[0]?.BRANCH_CD ?? ""}${
                rpState?.closingAdviceData?.[0]?.ACCT_TYPE ?? ""
              }${rpState?.closingAdviceData?.[0]?.ACCT_CD ?? ""}`}
              onClose={() => handleCloseAdviceDetails()}
            />
          </Dialog>
        )
      ) : null}
    </>
  );
};

export default ClosingAdvice;
