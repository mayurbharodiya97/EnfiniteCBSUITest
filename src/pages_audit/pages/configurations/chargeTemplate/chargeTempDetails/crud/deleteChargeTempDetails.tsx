import { Fragment } from "react";
import { useMutation } from "react-query";
import { useSnackbar } from "notistack";
import { Alert } from "components/common/alert";
import { Transition } from "pages_audit/common/transition";
import * as API from "../api";
import { useLocation } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface DeleteFormDataType {
  transactionID?: number;
  serialNo: number;
}

const DeleteFormDataFnWrapper =
  (deleteFormData) =>
  async ({ transactionID, serialNo }: DeleteFormDataType) => {
    return deleteFormData(transactionID, serialNo);
  };

const DeleteChargeTempDetails = ({
  isDataChangedRef,
  closeDialog,
  transactionID,
  serialNo,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const mutation = useMutation(
    DeleteFormDataFnWrapper(API.deleteBranchData(transactionID, serialNo)),
    {
      onError: (error: any) => {},
      onSuccess: (data) => {
        isDataChangedRef.current = true;
        enqueueSnackbar("record(s) deleted successfully", {
          variant: "success",
        });
        closeDialog();
      },
    }
  );

  return (
    <Fragment>
      <DialogTitle>
        Are you sure you want to delete the selected Record?
      </DialogTitle>
      <DialogContent>
        {mutation.isLoading ? (
          "Deleting..."
        ) : mutation?.isError ? (
          <Alert
            severity="error"
            errorMsg={mutation.error?.errorMessage ?? "Unknown Error occured"}
            errorDetail={mutation.error?.errorDetail ?? ""}
          />
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeDialog}
          color="secondary"
          disabled={mutation.isLoading}
        >
          Disagree
        </Button>
        <Button
          onClick={() => mutation.mutate({ transactionID, serialNo })}
          color="secondary"
          disabled={mutation.isLoading}
        >
          Agree
        </Button>
      </DialogActions>
    </Fragment>
  );
};

export const DeleteChargeTempDetailsWrapper = ({
  closeDialog,
  isDataChangedRef,
}) => {
  const { state: rows } = useLocation();
  return (
    <Dialog
      open={true}
      //@ts-ignore
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
    >
      <DeleteChargeTempDetails
        isDataChangedRef={isDataChangedRef}
        transactionID="" //{rows?.[0]?.data?.transactionID}
        //@ts-ignore
        serialNo={rows.map((one) => one?.id)[0]}
        closeDialog={closeDialog}
      />
    </Dialog>
  );
};
