//@ts-ignore
import { useMutation } from "react-query";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Alert } from "components/common/alert";
import * as API from "../api";
import { useContext } from "react";
import { AuthContext } from "pages_audit/auth";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface DeleteFormDataType {
  transactionID?: number;
}

const DeleteFormDataFnWrapper = (deleteFormData) => async (data) => {
  const a = deleteFormData(data);
  return a;
};

const DeleteChargeTempMaster = ({
  closeDialog,
  transactionID,
  isDataChangedRef,
  rows,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);
  const mutation = useMutation(
    DeleteFormDataFnWrapper(
      API.deleteBytransactionID({
        COMP_CD: authState.companyID,
        BRANCH_CD: authState.user.branchCode,
        ...rows?.[0]?.data,
        _isDeleteRow: true,
      })
    ),
    {
      onError: (error: any) => {},
      onSuccess: (data) => {
        isDataChangedRef.current = true;
        enqueueSnackbar("Records successfully deleted", {
          variant: "success",
        });
        closeDialog();
      },
    }
  );

  return (
    <Dialog open={true} maxWidth="sm">
      <DialogTitle>Would you like to delete the selected record?</DialogTitle>
      <DialogContent>
        {mutation.isLoading ? (
          "Deleting..."
        ) : mutation.isError ? (
          <Alert
            severity="error"
            // I suspect this, mutation.error?.error_msg is misspelt. Try errorMessage
            errorMsg={mutation.error?.error_msg ?? "Unknown Error occured"}
            errorDetail={mutation.error?.error_detail ?? ""}
          />
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeDialog}
          color="secondary"
          disabled={mutation.isLoading}
        >
          No
        </Button>
        <Button
          onClick={() => mutation.mutate({ transactionID })}
          color="secondary"
          disabled={mutation.isLoading}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const DeleteChargeTempMasterWrapper = ({
  closeDialog,
  isDataChangedRef,
}) => {
  const { state: rows } = useLocation();
  //@ts-ignore
  const transactionID = rows?.map((one) => one.id);
  return (
    <DeleteChargeTempMaster
      transactionID={transactionID}
      closeDialog={closeDialog}
      isDataChangedRef={isDataChangedRef}
      rows={rows}
    />
  );
};
