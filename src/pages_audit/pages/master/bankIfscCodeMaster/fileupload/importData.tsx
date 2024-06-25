import { ActionTypes, GridMetaDataType } from "components/dataTable";
import { FileUploadControl } from "components/fileUpload";
import { ConvertExcelToJSONData } from "components/utils";
import { useContext, useState } from "react";
import { useMutation } from "react-query";
import * as API from "../api";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { Alert } from "components/common/alert";
import { LoadingTextAnimation } from "components/common/loader";
import { AuthContext } from "pages_audit/auth";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { AdditionalcollumnMetadata } from "./additionalCollumMetadata";
import { GeneralAPI } from "registry/fns/functions";
import { usePopupContext } from "components/custom/popupContext";

const actions: ActionTypes[] = [
  {
    actionName: "upload",
    actionLabel: "Upload",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];


export default function ImportData({ CloseFileUpload, refetchData }) {
  const [isFileUploadopen, setFileUpload] = useState(true);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const mutation = useMutation(API.uploadFileData,
    {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        CloseMessageBox();
        CloseFileUpload();
      },
      onSuccess: (data) => {
        enqueueSnackbar("data imported successfully", {
          variant: "success",
        });
        refetchData();
        CloseFileUpload();
        CloseMessageBox();
      },
    }
  );


  return (
    <div>
      <Dialog fullWidth maxWidth="md" open={isFileUploadopen}>
        <FileUploadControl
          key={"BankMasterFileUploadData"}
          onClose={() => {
            CloseFileUpload();
          }}
          additionalColumns={AdditionalcollumnMetadata}
          editableFileName={false}
          defaultFileData={[]}
          onUpload={async (
            formDataObj,
            proccessFunc,
            ResultFunc,
            base64Object,
            result
          ) => {
            const btnName = await MessageBox({
              message: "Are you sure to Insert the File Data ?",
              messageTitle: "Confirmation",
              buttonNames: ["Yes", "No"],
              loadingBtnName: ["Yes"],
            });

            if (btnName === "Yes") {
              const FILE_FORMAT = base64Object[0].DESCRIPTION[0];
              const TRAN_CD = base64Object[0].DESCRIPTION[1];
              const FILEBLOB = base64Object;
              mutation.mutate({ FILE_FORMAT, TRAN_CD, FILEBLOB });
            }
            else if (btnName === "No") {
              CloseFileUpload();
            }

          }}
          gridProps={{}}
          maxAllowedSize={1024 * 1204 * 10} //10Mb file
          allowedExtensions={["xlsx", "pdf", "csv", "txt", "xls"]}
          onUpdateFileData={(files) => { }}
        />
      </Dialog>


    </div>
  );
};



