import {
  Button,
  Toolbar,
  Card,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { JointDetailIssueEntry } from "./metaData";
import { DocumentGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";
import { InitialValuesType, SubmitFnType } from "packages/form";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";

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
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);
  const [detailViewDialog, setDetailViewDialog] = useState<boolean>(false);

  const getDocTemplateList = useMutation(API.getDocTemplateList, {
    onSuccess: (data) => {
      console.log(data, " getDocTemplateList");
      setRows(data);
    },
    onError: (error) => {},
  });
  const getDocView = useMutation(API.getDocView, {
    onSuccess: (data) => {
      console.log(data, " getDocView");
    },
    onError: (error) => {},
  });

  const setCurrentAction = useCallback((data) => {
    let row = data.rows[0]?.data;
    console.log(row, "rowwww");
    // setDataRow(row);
    getDocView.mutate(row);
    setDetailViewDialog(true);
    if (data.name === "view-detail") {
      console.log("heloooo");
    }
  }, []);

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
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle id="alert-dialog-title">Scroll Delete</DialogTitle> */}
        <DialogContent>
          hello
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
    </>
  );
};
