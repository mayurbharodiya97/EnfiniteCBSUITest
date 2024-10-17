import { AppBar, Dialog } from "@mui/material";
import {
  Alert,
  LoaderPaperComponent,
  PDFViewer,
  usePopupContext,
  utilFunction,
} from "@acuteinfo/common-base";
import { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { printPaymentAdvice } from "../api";
import { AuthContext } from "pages_audit/auth";
import { t } from "i18next";

export const FdPaymentAdvicePrint = ({
  closeDialog,
  requestData,
  setOpenAdvice,
}) => {
  const { authState } = useContext(AuthContext);
  const [fileBlobData, setFileBlobData]: any = useState(null);
  const { MessageBox, CloseMessageBox } = usePopupContext();

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery<
    any,
    any
  >(
    ["printPaymentAdvice", authState?.user?.branchCode],
    () => printPaymentAdvice(requestData),
    {
      onSuccess: async (data) => {
        let blobData = utilFunction.blobToFile(data, "");
        if (blobData) {
          setFileBlobData(blobData);
        }
        // CloseMessageBox();
      },
      onError: async (error) => {
        await MessageBox({
          messageTitle: "ValidationFailed",
          message: error?.error_msg ?? "",
          icon: "ERROR",
        });
        setOpenAdvice(false);
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
              overflow: "auto",
              padding: "10px",
              width: "600px",
              height: "100px",
            },
          }}
          maxWidth="md"
        >
          <LoaderPaperComponent />
        </Dialog>
      ) : (
        Boolean(fileBlobData && fileBlobData?.type?.includes("pdf")) && (
          <Dialog
            open={true}
            PaperProps={{
              style: {
                width: "100%",
                overflow: "auto",
                padding: "10px",
                height: "100%",
              },
            }}
            maxWidth="xl"
          >
            <PDFViewer
              blob={fileBlobData}
              fileName={``}
              onClose={() => closeDialog()}
            />
          </Dialog>
        )
      )}
    </>
  );
};
