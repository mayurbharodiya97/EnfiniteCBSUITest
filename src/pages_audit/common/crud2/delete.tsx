import { Fragment, useContext, useRef } from "react";
import { useMutation } from "react-query";
import { Alert } from "components/common/alert";
import { CRUDContext } from "./context";
import { cacheWrapperKeyGen } from "cache";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface DeleteFormDataType {
  serialNo?: string;
}

const DeleteFormDataFnWrapper =
  (deleteFormData) =>
  async ({ serialNo }: DeleteFormDataType) => {
    return deleteFormData(serialNo);
  };

export const DeleteAction = ({ isDataChangedRef, closeDialog, serialNo }) => {
  const { deleteFormData } = useContext(CRUDContext);
  const wrapperKey = useRef<any>(null);
  if (wrapperKey.current === null) {
    wrapperKey.current = cacheWrapperKeyGen(Object.values(deleteFormData.args));
  }

  const mutation = useMutation(
    DeleteFormDataFnWrapper(deleteFormData.fn(deleteFormData.args)),
    {
      onError: (error: any) => {},
      onSuccess: (data) => {
        isDataChangedRef.current = true;
        closeDialog();
      },
    }
  );

  return (
    <Fragment key={wrapperKey.current}>
      <DialogTitle id="alert-dialog-title">
        Are you sure you want to delete the selected Records
      </DialogTitle>
      {mutation.isLoading ? (
        <DialogContent>Deleting...</DialogContent>
      ) : mutation?.isError ? (
        <DialogContent>
          <Alert
            severity="error"
            errorMsg={mutation.error?.error_msg ?? "Unknown Error occured"}
            errorDetail={mutation.error?.error_detail ?? ""}
          />
        </DialogContent>
      ) : mutation.isSuccess ? (
        <DialogContent>All Records successfully deleted</DialogContent>
      ) : null}
      {mutation.isSuccess ? (
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      ) : (
        <DialogActions>
          <Button
            onClick={closeDialog}
            color="primary"
            disabled={mutation.isLoading}
          >
            Disagree
          </Button>
          <Button
            onClick={() => mutation.mutate({ serialNo })}
            color="primary"
            disabled={mutation.isLoading}
          >
            Agree
          </Button>
        </DialogActions>
      )}
    </Fragment>
  );
};
