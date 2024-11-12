import { useCallback, useState } from "react";
import { useMutation } from "react-query";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { Dialog } from "@mui/material";
import { ImportGridMetaData, PositivePayImportMetaData } from "./metadata";
import { importFileData } from "../api";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import {
  usePopupContext,
  GridWrapper,
  ActionTypes,
  FileUploadControl,
  GridMetaDataType,
} from "@acuteinfo/common-base";

const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];
export default function ImportData({ CloseFileUpload, refetchData }) {
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [openGrid, setOpenGrid] = useState(false);
  const [gridData, setGridData] = useState([]);
  const navigate = useNavigate();

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "close") {
        CloseFileUpload();
        CloseMessageBox();
        setOpenGrid(false);
      }
    },
    [navigate]
  );

  const mutation = useMutation(importFileData, {
    onError: (error: any) => {
      let errorMsg = t("Unknownerroroccured");
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
      CloseFileUpload();
    },
    onSuccess: async (data) => {
      if (Boolean(data)) {
        for (let i = 0; i < data?.length; i++) {
          if (data[i]?.O_STATUS === "999") {
            const btnName = await MessageBox({
              messageTitle: "ValidationFailed",
              message: data[i]?.O_MESSAGE,
              buttonNames: ["Ok"],
              icon: "ERROR",
            });
            if (btnName === "Ok") {
              setOpenGrid(true);
              const errorData = data[i]?.PPS_DATA;
              const updatedData = errorData.map((item) => ({
                ...item,
                CHEQUE_AMT:
                  item.CHEQUE_AMT && !isNaN(item.CHEQUE_AMT)
                    ? parseFloat(item.CHEQUE_AMT).toFixed(2)
                    : item.CHEQUE_AMT,
              }));
              setGridData(updatedData);
              break;
            }
          } else if (data[i]?.O_STATUS === "9") {
            const btnName = await MessageBox({
              messageTitle: "Alert",
              message: data[i]?.O_MESSAGE,
              icon: "WARNING",
            });
          } else if (data[i]?.O_STATUS === "99") {
            const btnName = await MessageBox({
              messageTitle: "Confirmation",
              message: data[i]?.O_MESSAGE,
              buttonNames: ["Yes", "No"],
              icon: "CONFIRM",
            });
            if (btnName === "No") {
              setOpenGrid(true);
              const errorData = data[i]?.PPS_DATA;
              const updatedData = errorData.map((item) => ({
                ...item,
                CHEQUE_AMT: Number(item?.CHEQUE_AMT ?? 0).toFixed,
              }));
              setGridData(updatedData);
              break;
            }
          } else if (data[i]?.STATUS === "0") {
            enqueueSnackbar(t("dataImportedSuccessfully"), {
              variant: "success",
            });
            refetchData();
            CloseFileUpload();
            CloseMessageBox();
          }
        }
      }
    },
  });

  const countOfError = gridData.filter(
    (item: any) => item.ERROR_FLAG === "Y"
  ).length;
  const countOfRecords = gridData.length;
  ImportGridMetaData.gridConfig.footerNote = `Total Records : ${countOfRecords}\u00A0\u00A0 Total Errors : ${countOfError} `;

  return (
    <>
      <div>
        <Dialog fullWidth maxWidth="md" open={true}>
          <FileUploadControl
            key={"PositivePayEntryImportData"}
            onClose={() => {
              CloseFileUpload();
            }}
            additionalColumns={PositivePayImportMetaData}
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
                message: t("AreYouSureToInsertTheFileData"),
                messageTitle: "Confirmation",
                buttonNames: ["Yes", "No"],
                loadingBtnName: ["Yes"],
                icon: "CONFIRM",
              });

              if (btnName === "Yes") {
                const FILE_FORMAT = base64Object[0].DESCRIPTION[0];
                const TRAN_CD = base64Object[0].DESCRIPTION[1];
                const FILEBLOB = base64Object;
                mutation.mutate({
                  FILE_FORMAT,
                  TRAN_CD,
                  FILEBLOB,
                  TABLE_NM: "RBI_POSITIVE_PAY_DATA",
                  ACCT_TYPE: "XX  ",
                  ACCT_CD: "XX                  ",
                  SCROLL_NO: "",
                  CHEQUE_NO: "",
                  REMARKS: "",
                  SCREEN_REF: "MST/968",
                });
              } else if (btnName === "No") {
                CloseFileUpload();
              }
            }}
            gridProps={{}}
            allowedExtensions={["xlsx", "pdf", "csv", "txt", "xls"]}
            onUpdateFileData={(files) => {}}
          />
        </Dialog>
      </div>

      {openGrid && (
        <Dialog
          PaperProps={{
            style: {
              width: "100%",
              overflow: "auto",
              padding: "10px",
            },
          }}
          open={true}
          maxWidth="xl"
        >
          <>
            <GridWrapper
              key={`importDataGrid`}
              finalMetaData={ImportGridMetaData as GridMetaDataType}
              data={gridData ?? []}
              setData={setGridData}
              actions={actions}
              setAction={setCurrentAction}
            />
          </>
        </Dialog>
      )}
    </>
  );
}
