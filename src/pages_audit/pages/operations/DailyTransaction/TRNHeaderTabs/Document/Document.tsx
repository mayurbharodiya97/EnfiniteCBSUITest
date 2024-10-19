import {
  Button,
  Toolbar,
  Card,
  Tooltip,
  CircularProgress,
  Grid,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { DocumentGridMetaData } from "./gridMetadata";
// import GridWrapper from "components/dataTableStatic";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { enqueueSnackbar } from "notistack";

import {
  Alert,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
  utilFunction,
  usePopupContext,
  queryClient,
  LoaderPaperComponent,
} from "@acuteinfo/common-base";

import { useNavigate } from "react-router-dom";

type DocumentProps = {
  reqData: any;
  handleDialogClose?: any;
  isDisplayClose?: any;
};

let imgBase = "";
//=========
export const Document: React.FC<DocumentProps> = ({
  reqData,
  handleDialogClose,
  isDisplayClose,
}) => {
  const [dataRow, setDataRow] = useState<any>({});
  const imgUrl = useRef<any | null>(null);
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);
  const [detailViewDialog, setDetailViewDialog] = useState<boolean>(false);
  const navigate = useNavigate();
  const { MessageBox, CloseMessageBox } = usePopupContext();

  const actions: ActionTypes[] = [
    {
      actionName: "view-detail",
      actionLabel: "View Detail",
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

  //api define=====================
  const getDocTemplateList = useMutation(API.getDocTemplateList, {
    onSuccess: (data) => {
      console.log(data, " getDocTemplateList");
      setRows(data);
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
  const getDocView = useMutation(API.getDocView, {
    onSuccess: async (res) => {
      console.log(res, " getDocView");

      if (res?.ERROR_MSG) {
        await MessageBox({
          messageTitle: "Validation Failed",
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

  // fns====================
  const setCurrentAction = useCallback((data) => {
    let row = data.rows[0]?.data;
    console.log(row, "rowwww");
    setDataRow(row);

    if (data.name === "view-detail") {
      getDocView.mutate(row);
      console.log("heloooo");
    }
    if (data?.name === "close") {
      handleDialogClose();
    }
  }, []);

  const handleImgProcess = async () => {
    let blob = utilFunction.base64toBlob(imgBase, "image/png");
    console.log("blob", blob);
    imgUrl.current =
      typeof blob === "object" && Boolean(blob)
        ? await URL.createObjectURL(blob as any)
        : null;
    console.log(imgUrl.current, "imgUrl");
    imgUrl.current && setDetailViewDialog(true);
  };
  // const getDocTemplateList = useMutation(API.getDocTemplateList, {
  //   onSuccess: (data) => {
  //     console.log(data, " getDocTemplateList");
  //     setRows(data);
  //   },
  //   onError: (error) => {},
  // });

  // useEffect(() => {
  //   tempStore?.accInfo?.ACCT_CD && getDocTemplateList.mutate(tempStore.accInfo);
  // }, [tempStore]);

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
      {getDocView.isLoading && (
        <Dialog open={true} fullWidth={true}>
          <LoaderPaperComponent size={30} />
        </Dialog>
      )}
      {isError ? (
        <Fragment>
          <div style={{ width: "100%", paddingTop: "10px" }}>
            <Alert
              severity={error?.severity ?? "error"}
              errorMsg={error?.error_msg ?? "Error"}
              errorDetail={error?.error_detail ?? ""}
            />
          </div>
        </Fragment>
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
        // onlySingleSelectionAllow={true}
        // isNewRowStyle={true}
        // disableMultipleRowSelect={true}
        variant={"standard"}
        // defaultSelectedRowId={1}
        //  controlsAtBottom={true}
      />

      <Dialog
        maxWidth="xl"
        open={detailViewDialog}
        // onClose={() => setDetailViewDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="customized-dialog-title">
          {dataRow?.DESCRIPTION}
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={() => setDetailViewDialog(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent>
          {imgUrl?.current ? (
            <img src={imgUrl?.current ?? ""} />
          ) : (
            <CircularProgress color="secondary" />
          )}

          <div style={{ width: "400px" }}></div>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setDetailViewDialog(false)}
            variant="contained"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* <Grid
        item
        xs={12}
        sm={12}
        sx={{
          position: "relative",
          top: "-3rem",
          display: "flex",
          justifyContent: "space-between",
          gap: "3rem",
          alignItems: "center",
        }}
      >
        <div></div>
        <div></div>

        <Grid item sx={{ display: "flex", gap: "1rem" }}>
          *Double click on records for detailed view
        </Grid>
      </Grid> */}
    </>
  );
};
