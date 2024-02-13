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
import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { DocumentGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { utilFunction } from "components/utils";
import { enqueueSnackbar } from "notistack";

const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
    // alwaysAvailable: true,
  },
];
export const Document = () => {
  const [dataRow, setDataRow] = useState<any>({});
  const imgUrl = useRef<any | null>(null);

  let imgBase = "";
  //=========
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);
  const [detailViewDialog, setDetailViewDialog] = useState<boolean>(false);

  //api define=====================
  const getDocTemplateList = useMutation(API.getDocTemplateList, {
    onSuccess: (data) => {
      console.log(data, " getDocTemplateList");
      setRows(data);
    },
    onError: (error) => {},
  });
  const getDocView = useMutation(API.getDocView, {
    onSuccess: (res) => {
      console.log(res, " getDocView");

      if (res?.ERROR_MSG) {
        enqueueSnackbar(res?.ERROR_MSG, {
          variant: "error",
        });
      } else {
        imgBase = res?.DOC_IMAGE;
        handleImgProcess();
      }
    },
    onError: (error) => {},
  });

  // fns====================
  const setCurrentAction = useCallback((data) => {
    let row = data.rows[0]?.data;
    console.log(row, "rowwww");
    setDataRow(row);
    getDocView.mutate(row);

    if (data.name === "view-detail") {
      console.log("heloooo");
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

  useEffect(() => {
    tempStore?.accInfo?.ACCT_CD && getDocTemplateList.mutate(tempStore.accInfo);
  }, [tempStore]);

  return (
    <>
      <GridWrapper
        key={`DocumentGridMetaData`}
        finalMetaData={DocumentGridMetaData as GridMetaDataType}
        data={rows}
        setData={() => null}
        loading={getDocTemplateList.isLoading}
        refetchData={() => {}}
        ref={myGridRef}
        actions={actions}
        setAction={setCurrentAction}
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

      <Grid
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
      </Grid>
    </>
  );
};
