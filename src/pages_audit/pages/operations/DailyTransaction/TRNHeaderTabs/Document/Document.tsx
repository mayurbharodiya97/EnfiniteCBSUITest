import { Box, CircularProgress } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { enqueueSnackbar } from "notistack";
import { AuthContext } from "pages_audit/auth";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { DocumentGridMetaData } from "./gridMetadata";

import {
  ActionTypes,
  Alert,
  GradientButton,
  GridMetaDataType,
  GridWrapper,
  LoaderPaperComponent,
  queryClient,
  usePopupContext,
  utilFunction,
} from "@acuteinfo/common-base";
import { t } from "i18next";

type DocumentProps = {
  reqData: any;
  handleDialogClose?: any;
  isDisplayClose?: any;
};

export const Document: React.FC<DocumentProps> = ({
  reqData,
  handleDialogClose,
  isDisplayClose,
}) => {
  const [dataRow, setDataRow] = useState<any>({});
  const imgUrl = useRef<any | null>(null);
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const [detailViewDialog, setDetailViewDialog] = useState<boolean>(false);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  let imgBase = "";

  const actions: ActionTypes[] = [
    {
      actionName: "view-detail",
      actionLabel: "ViewDetails",
      multiple: false,
      rowDoubleClick: true,
      alwaysAvailable: false,
    },
    ...(isDisplayClose
      ? [
          {
            actionName: "close",
            actionLabel: "Close",
            multiple: undefined,
            alwaysAvailable: true,
          },
        ]
      : []),
  ];

  const getDocView = useMutation(API.getDocView, {
    onSuccess: async (res) => {
      if (res?.ERROR_MSG) {
        await MessageBox({
          messageTitle: "ValidationFailed",
          message: res?.ERROR_MSG ?? "",
          icon: "ERROR",
        });
      } else {
        imgBase = res?.DOC_IMAGE;
        handleImgProcess();
      }
    },
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
  });

  const setCurrentAction = useCallback((data) => {
    let row = data?.rows?.[0]?.data;
    setDataRow(row);
    if (data?.name === "view-detail") {
      getDocView?.mutate(row);
    }
    if (data?.name === "close") {
      handleDialogClose();
    }
  }, []);

  const handleImgProcess = async () => {
    let blob = utilFunction.base64toBlob(imgBase, "image/png");
    imgUrl.current =
      typeof blob === "object" && Boolean(blob)
        ? await URL.createObjectURL(blob as any)
        : null;
    imgUrl?.current && setDetailViewDialog(true);
  };

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getDocTemplateList", { reqData }], () => API.getDocTemplateList(reqData));

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getDocTemplateList",
        authState?.user?.branchCode,
      ]);
    };
  }, []);

  return (
    <>
      {getDocView?.isLoading ? (
        <Dialog open={true} fullWidth={true}>
          <LoaderPaperComponent size={30} />
        </Dialog>
      ) : null}
      {isError ? (
        <Alert
          severity={error?.severity ?? "error"}
          errorMsg={error?.error_msg ?? "Error"}
          errorDetail={error?.error_detail ?? ""}
        />
      ) : null}
      <GridWrapper
        key={`DocumentGridMetaData`}
        finalMetaData={DocumentGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        refetchData={() => refetch()}
        ref={myGridRef}
        actions={actions}
        setAction={setCurrentAction}
      />

      <Dialog
        maxWidth="xl"
        open={detailViewDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: "24px",
            }}
          >
            <DialogTitle id="customized-dialog-title">
              {dataRow?.DESCRIPTION}
            </DialogTitle>
            <GradientButton onClick={() => setDetailViewDialog(false)}>
              {t("Close")}
            </GradientButton>
          </Box>

          <DialogContent>
            {imgUrl?.current ? (
              <img src={imgUrl?.current ?? ""} />
            ) : (
              <CircularProgress color="secondary" />
            )}
          </DialogContent>
        </>
      </Dialog>
    </>
  );
};
